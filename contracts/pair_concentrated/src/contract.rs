use std::vec;

#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    attr, ensure, ensure_eq, from_json, wasm_execute, wasm_instantiate, Addr, Binary, CosmosMsg,
    Decimal, Decimal256, DepsMut, Empty, Env, Event, MessageInfo, Reply, Response, StdError,
    StdResult, SubMsg, SubMsgResponse, SubMsgResult, Uint128,
};
use cw2::{get_contract_version, set_contract_version};
use cw20::{Cw20ExecuteMsg, Cw20ReceiveMsg, MinterResponse};
use cw_utils::parse_instantiate_response_data;
use itertools::Itertools;

use astroport::asset::{
    addr_opt_validate, token_asset, Asset, AssetInfo, CoinsExt, PairInfo, MINIMUM_LIQUIDITY_AMOUNT,
};
use astroport::asset::{format_lp_token_name, AssetInfoExt};
use astroport::common::{claim_ownership, drop_ownership_proposal, propose_new_owner};
use astroport::cosmwasm_ext::{DecimalToInteger, IntegerToDecimal};
use astroport::pair::{
    Cw20HookMsg, ExecuteMsg, FeeShareConfig, InstantiateMsg, INSTANTIATE_TOKEN_REPLY_ID,
    MAX_FEE_SHARE_BPS, MIN_TRADE_SIZE,
};
use astroport::pair_concentrated::{
    ConcentratedPoolParams, ConcentratedPoolUpdateParams, UpdatePoolParams,
};
use astroport::querier::{query_factory_config, query_fee_info, query_supply};
use astroport_pcl_common::state::{
    AmpGamma, Config, PoolParams, PoolState, Precisions, PriceState,
};
use astroport_pcl_common::utils::{
    accumulate_prices, assert_max_spread, before_swap_check, calc_last_prices, check_asset_infos,
    check_cw20_in_pool, compute_swap, get_share_in_assets, mint_liquidity_token_message,
};
use astroport_pcl_common::{calc_d, get_xcp};

use crate::error::ContractError;
use crate::state::{CONFIG, OWNERSHIP_PROPOSAL};
use crate::utils::{
    calculate_shares, ensure_min_assets_to_receive, get_assets_with_precision, query_pools,
};

/// Contract name that is used for migration.
const CONTRACT_NAME: &str = env!("CARGO_PKG_NAME");
/// Contract version that is used for migration.
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");
/// An LP token's precision.
pub(crate) const LP_TOKEN_PRECISION: u8 = 6;

/// Creates a new contract with the specified parameters in the [`InstantiateMsg`].
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    mut deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    if msg.asset_infos.len() != 2 {
        return Err(StdError::generic_err("asset_infos must contain exactly two elements").into());
    }

    check_asset_infos(deps.api, &msg.asset_infos)?;

    let params: ConcentratedPoolParams = from_json(
        msg.init_params
            .ok_or(ContractError::InitParamsNotFound {})?,
    )?;

    if params.price_scale.is_zero() {
        return Err(StdError::generic_err("Initial price scale can not be zero").into());
    }

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    let factory_addr = deps.api.addr_validate(&msg.factory_addr)?;

    Precisions::store_precisions(deps.branch(), &msg.asset_infos, &factory_addr)?;

    // Initializing cumulative prices
    let cumulative_prices = vec![
        (
            msg.asset_infos[0].clone(),
            msg.asset_infos[1].clone(),
            Uint128::zero(),
        ),
        (
            msg.asset_infos[1].clone(),
            msg.asset_infos[0].clone(),
            Uint128::zero(),
        ),
    ];

    let mut pool_params = PoolParams::default();
    pool_params.update_params(UpdatePoolParams {
        mid_fee: Some(params.mid_fee),
        out_fee: Some(params.out_fee),
        fee_gamma: Some(params.fee_gamma),
        repeg_profit_threshold: Some(params.repeg_profit_threshold),
        min_price_scale_delta: Some(params.min_price_scale_delta),
        ma_half_time: Some(params.ma_half_time),
    })?;

    let pool_state = PoolState {
        initial: AmpGamma::default(),
        future: AmpGamma::new(params.amp, params.gamma)?,
        future_time: env.block.time.seconds(),
        initial_time: 0,
        price_state: PriceState {
            oracle_price: params.price_scale.into(),
            last_price: params.price_scale.into(),
            price_scale: params.price_scale.into(),
            last_price_update: env.block.time.seconds(),
            xcp_profit: Decimal256::zero(),
            xcp_profit_real: Decimal256::zero(),
        },
    };

    let config = Config {
        pair_info: PairInfo {
            contract_addr: env.contract.address.clone(),
            liquidity_token: "".to_owned(),
            asset_infos: msg.asset_infos.clone(),
            pair_type: msg.pair_type,
        },
        factory_addr,
        block_time_last: env.block.time.seconds(),
        cumulative_prices,
        pool_params,
        pool_state,
        owner: None,
        fee_share: None,
    };

    CONFIG.save(deps.storage, &config)?;

    let sub_msg = SubMsg::reply_on_success(
        wasm_instantiate(
            msg.token_code_id,
            &cw20_base::msg::InstantiateMsg {
                name: format_lp_token_name(&msg.asset_infos, &deps.querier)?,
                symbol: "uLP".to_string(),
                decimals: 6,
                initial_balances: vec![],
                mint: Some(MinterResponse {
                    minter: env.contract.address.to_string(),
                    cap: None,
                }),
                marketing: None,
            },
            vec![],
            "LP token".to_string(),
        )?,
        INSTANTIATE_TOKEN_REPLY_ID,
    );

    let event = Event::new("instantiate").add_attribute("action", "instantiate");

    Ok(Response::new().add_submessage(sub_msg).add_event(event))
}

/// The entry point to the contract for processing replies from submessages.
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn reply(deps: DepsMut, _env: Env, msg: Reply) -> Result<Response, ContractError> {
    match msg {
        #[allow(deprecated)]
        Reply {
            id: INSTANTIATE_TOKEN_REPLY_ID,
            result:
                SubMsgResult::Ok(SubMsgResponse {
                    data: Some(data), ..
                }),
            ..
        } => {
            let config = CONFIG.update::<_, ContractError>(deps.storage, |mut config| {
                config.pair_info.liquidity_token =
                    parse_instantiate_response_data(data.as_slice())?.contract_address;
                Ok(config)
            })?;

            let event = Event::new("instantiate")
                .add_attribute("liquidity_token_addr", config.pair_info.liquidity_token);

            Ok(Response::new().add_event(event))
        }
        _ => Err(StdError::generic_err("Invalid reply".to_string()).into()),
    }
}

/// Exposes all the execute functions available in the contract.
///
/// ## Variants
/// * **ExecuteMsg::UpdateConfig { params: Binary }** Not supported.
///
/// * **ExecuteMsg::Receive(msg)** Receives a message of type [`Cw20ReceiveMsg`] and processes
/// it depending on the received template.
///
/// * **ExecuteMsg::ProvideLiquidity {
///             assets,
///             slippage_tolerance,
///             auto_stake,
///             receiver,
///         }** Provides liquidity in the pair with the specified input parameters.
///
/// * **ExecuteMsg::Swap {
///             offer_asset,
///             belief_price,
///             max_spread,
///             to,
///         }** Performs a swap operation with the specified parameters.
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;

    match msg {
        ExecuteMsg::Receive(msg) => receive_cw20(deps, env, info, msg),
        ExecuteMsg::ProvideLiquidity {
            assets,
            slippage_tolerance,
            auto_stake,
            receiver,
            min_lp_to_receive,
        } => provide_liquidity(
            deps,
            env,
            info,
            assets,
            slippage_tolerance,
            auto_stake,
            receiver,
            min_lp_to_receive,
        ),
        ExecuteMsg::Swap {
            offer_asset,
            belief_price,
            max_spread,
            to,
            ..
        } => {
            offer_asset.info.check(deps.api)?;
            if !offer_asset.info.is_native_token() {
                return Err(ContractError::Cw20DirectSwap {});
            }
            offer_asset.assert_sent_native_token_balance(&info)?;

            if !config.pair_info.asset_infos.contains(&offer_asset.info) {
                return Err(ContractError::InvalidAsset(offer_asset.info.to_string()));
            }

            let to_addr = addr_opt_validate(deps.api, &to)?;

            swap(
                deps,
                env,
                info.sender,
                offer_asset,
                belief_price,
                max_spread,
                to_addr,
            )
        }
        ExecuteMsg::UpdateConfig { params } => update_config(deps, env, info, params),
        ExecuteMsg::ProposeNewOwner { owner, expires_in } => {
            let factory_config = query_factory_config(&deps.querier, config.factory_addr)?;

            propose_new_owner(
                deps,
                info,
                env,
                owner,
                expires_in,
                config.owner.unwrap_or(factory_config.owner),
                OWNERSHIP_PROPOSAL,
            )
            .map_err(Into::into)
        }
        ExecuteMsg::DropOwnershipProposal {} => {
            let factory_config = query_factory_config(&deps.querier, config.factory_addr)?;

            drop_ownership_proposal(
                deps,
                info,
                config.owner.unwrap_or(factory_config.owner),
                OWNERSHIP_PROPOSAL,
            )
            .map_err(Into::into)
        }
        ExecuteMsg::ClaimOwnership {} => {
            claim_ownership(deps, info, env, OWNERSHIP_PROPOSAL, |deps, new_owner| {
                CONFIG.update::<_, StdError>(deps.storage, |mut config| {
                    config.owner = Some(new_owner);
                    Ok(config)
                })?;

                Ok(())
            })
            .map_err(Into::into)
        }
    }
}

/// Receives a message of type [`Cw20ReceiveMsg`] and processes it depending on the received template.
///
/// * **cw20_msg** CW20 receive message to process.
fn receive_cw20(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    cw20_msg: Cw20ReceiveMsg,
) -> Result<Response, ContractError> {
    match from_json(&cw20_msg.msg)? {
        Cw20HookMsg::Swap {
            belief_price,
            max_spread,
            to,
            ..
        } => {
            let config = CONFIG.load(deps.storage)?;

            // Only asset contract can execute this message
            check_cw20_in_pool(&config, &info.sender)?;

            let to_addr = addr_opt_validate(deps.api, &to)?;
            swap(
                deps,
                env,
                Addr::unchecked(cw20_msg.sender),
                token_asset(info.sender, cw20_msg.amount),
                belief_price,
                max_spread,
                to_addr,
            )
        }
        Cw20HookMsg::WithdrawLiquidity {
            min_assets_to_receive,
        } => withdraw_liquidity(
            deps,
            env,
            info,
            min_assets_to_receive,
            Addr::unchecked(cw20_msg.sender),
            cw20_msg.amount,
        ),
    }
}

/// Provides liquidity in the pair with the specified input parameters.
///
/// * **assets** is an array with assets available in the pool.
///
/// * **slippage_tolerance** is an optional parameter which is used to specify how much
///   the pool price can move until the provide liquidity transaction goes through.
///
/// * **auto_stake** is an optional parameter which determines whether the LP tokens minted after
///   liquidity provision are automatically staked in the Incentives contract on behalf of the LP token receiver.
///
/// * **receiver** is an optional parameter which defines the receiver of the LP tokens.
///   If no custom receiver is specified, the pair will mint LP tokens for the function caller.
///
/// NOTE - the address that wants to provide liquidity should approve the pair contract to pull its relevant tokens.
#[allow(clippy::too_many_arguments)]
pub fn provide_liquidity(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    mut assets: Vec<Asset>,
    slippage_tolerance: Option<Decimal>,
    auto_stake: Option<bool>,
    receiver: Option<String>,
    min_lp_to_receive: Option<Uint128>,
) -> Result<Response, ContractError> {
    let mut config = CONFIG.load(deps.storage)?;

    let total_share = query_supply(&deps.querier, &config.pair_info.liquidity_token)?
        .to_decimal256(LP_TOKEN_PRECISION);

    let precisions = Precisions::new(deps.storage)?;

    let mut pools = query_pools(deps.querier, &env.contract.address, &config, &precisions)?;

    let old_real_price = config.pool_state.price_state.last_price;

    let deposits = get_assets_with_precision(
        deps.as_ref(),
        &config,
        &mut assets,
        pools.clone(),
        &precisions,
    )?;

    info.funds
        .assert_coins_properly_sent(&assets, &config.pair_info.asset_infos)?;

    let mut messages = vec![];
    for (i, pool) in pools.iter_mut().enumerate() {
        // If the asset is a token contract, then we need to execute a TransferFrom msg to receive assets
        match &pool.info {
            AssetInfo::Token { contract_addr } => {
                if !deposits[i].is_zero() {
                    messages.push(CosmosMsg::Wasm(wasm_execute(
                        contract_addr,
                        &Cw20ExecuteMsg::TransferFrom {
                            owner: info.sender.to_string(),
                            recipient: env.contract.address.to_string(),
                            amount: deposits[i]
                                .to_uint(precisions.get_precision(&assets[i].info)?)?,
                        },
                        vec![],
                    )?))
                }
            }
            AssetInfo::NativeToken { .. } => {
                // If the asset is native token, the pool balance is already increased
                // To calculate the total amount of deposits properly, we should subtract the user deposit from the pool
                pool.amount = pool.amount.checked_sub(deposits[i])?;
            }
        }
    }

    let (share_uint128, slippage) = calculate_shares(
        &env,
        &mut config,
        &mut pools,
        total_share,
        deposits.clone(),
        slippage_tolerance,
    )?;

    if total_share.is_zero() {
        messages.extend(mint_liquidity_token_message(
            deps.querier,
            &config,
            &env.contract.address,
            &env.contract.address,
            MINIMUM_LIQUIDITY_AMOUNT,
            false,
        )?);
    }

    let min_amount_lp = min_lp_to_receive.unwrap_or_default();
    ensure!(
        share_uint128 >= min_amount_lp,
        ContractError::ProvideSlippageViolation(share_uint128, min_amount_lp,)
    );

    // Mint LP tokens for the sender or for the receiver (if set)
    let receiver = addr_opt_validate(deps.api, &receiver)?.unwrap_or_else(|| info.sender.clone());
    let auto_stake = auto_stake.unwrap_or(false);
    messages.extend(mint_liquidity_token_message(
        deps.querier,
        &config,
        &env.contract.address,
        &receiver,
        share_uint128,
        auto_stake,
    )?);

    accumulate_prices(&env, &mut config, old_real_price);

    CONFIG.save(deps.storage, &config)?;

    let event = Event::new("provide_liquidity").add_attributes(vec![
        attr("action", "provide_liquidity"),
        attr("sender", info.sender),
        attr("receiver", receiver),
        attr("assets", format!("{}, {}", &assets[0], &assets[1])),
        attr("share", share_uint128),
        attr("slippage", slippage.to_string()),
    ]);

    Ok(Response::new().add_messages(messages).add_event(event))
}

/// Withdraw liquidity from the pool.
///
/// * **sender** address that will receive assets back from the pair contract
///
/// * **assets** defines number of coins a user wants to withdraw per each asset.
pub fn withdraw_liquidity(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    min_assets_to_receive: Option<Vec<Asset>>,
    receiver: Addr,
    amount: Uint128,
) -> Result<Response, ContractError> {
    let mut config = CONFIG.load(deps.storage)?;

    ensure_eq!(
        info.sender.to_string(),
        config.pair_info.liquidity_token,
        ContractError::Unauthorized {}
    );

    let precisions = Precisions::new(deps.storage)?;
    let pools = query_pools(
        deps.querier,
        &config.pair_info.contract_addr,
        &config,
        &precisions,
    )?;

    let total_share = query_supply(&deps.querier, &config.pair_info.liquidity_token)?;
    let mut messages = vec![];

    let refund_assets =
        get_share_in_assets(&pools, amount.saturating_sub(Uint128::one()), total_share);

    // decrease XCP
    let mut xs = pools.iter().map(|a| a.amount).collect_vec();

    xs[0] -= refund_assets[0].amount;
    xs[1] -= refund_assets[1].amount;
    xs[1] *= config.pool_state.price_state.price_scale;
    let amp_gamma = config.pool_state.get_amp_gamma(&env);
    let d = calc_d(&xs, &amp_gamma)?;
    config.pool_state.price_state.xcp_profit_real =
        get_xcp(d, config.pool_state.price_state.price_scale)
            / (total_share - amount).to_decimal256(LP_TOKEN_PRECISION);

    let refund_assets = refund_assets
        .into_iter()
        .map(|asset| {
            let prec = precisions.get_precision(&asset.info).unwrap();

            Ok(Asset {
                info: asset.info,
                amount: asset.amount.to_uint(prec)?,
            })
        })
        .collect::<StdResult<Vec<_>>>()?;

    ensure_min_assets_to_receive(&config, refund_assets.clone(), min_assets_to_receive)?;

    messages.extend(
        refund_assets
            .iter()
            .cloned()
            .map(|asset| asset.into_msg(&receiver))
            .collect::<StdResult<Vec<_>>>()?,
    );

    messages.push(
        wasm_execute(
            &config.pair_info.liquidity_token,
            &Cw20ExecuteMsg::Burn { amount },
            vec![],
        )?
        .into(),
    );

    CONFIG.save(deps.storage, &config)?;

    let event = Event::new("withdraw_liquidity").add_attributes(vec![
        attr("action", "withdraw_liquidity"),
        attr("sender", info.sender),
        attr("withdrawn_share", amount),
        attr("refund_assets", refund_assets.iter().join(", ")),
        attr("receiver", receiver.to_string()),
    ]);
    Ok(Response::new().add_messages(messages).add_event(event))
}

/// Performs an swap operation with the specified parameters. The trader must approve the
/// pool contract to transfer offer assets from their wallet.
///
/// * **sender** is the sender of the swap operation.
///
/// * **offer_asset** proposed asset for swapping.
///
/// * **belief_price** is used to calculate the maximum swap spread.
///
/// * **max_spread** sets the maximum spread of the swap operation.
///
/// * **to** sets the recipient of the swap operation.
fn swap(
    deps: DepsMut,
    env: Env,
    sender: Addr,
    offer_asset: Asset,
    belief_price: Option<Decimal>,
    max_spread: Option<Decimal>,
    to: Option<Addr>,
) -> Result<Response, ContractError> {
    let precisions = Precisions::new(deps.storage)?;
    let offer_asset_prec = precisions.get_precision(&offer_asset.info)?;
    let offer_asset_dec = offer_asset.to_decimal_asset(offer_asset_prec);
    let mut config = CONFIG.load(deps.storage)?;

    let mut pools = query_pools(deps.querier, &env.contract.address, &config, &precisions)?;

    let (offer_ind, _) = pools
        .iter()
        .find_position(|asset| asset.info == offer_asset_dec.info)
        .ok_or_else(|| ContractError::InvalidAsset(offer_asset_dec.info.to_string()))?;
    let ask_ind = 1 ^ offer_ind;
    let ask_asset_prec = precisions.get_precision(&pools[ask_ind].info)?;

    pools[offer_ind].amount -= offer_asset_dec.amount;

    before_swap_check(&pools, offer_asset_dec.amount)?;

    let mut xs = pools.iter().map(|asset| asset.amount).collect_vec();
    let old_real_price = calc_last_prices(&xs, &config, &env)?;

    // Get fee info from the factory
    let fee_info = query_fee_info(
        &deps.querier,
        &config.factory_addr,
        config.pair_info.pair_type.clone(),
    )?;
    let mut maker_fee_share = Decimal256::zero();
    if fee_info.fee_address.is_some() {
        maker_fee_share = fee_info.maker_fee_rate.into();
    }
    // If this pool is configured to share fees
    let mut share_fee_share = Decimal256::zero();
    if let Some(fee_share) = config.fee_share.clone() {
        share_fee_share = Decimal256::from_ratio(fee_share.bps, 10000u16);
    }

    let swap_result = compute_swap(
        &xs,
        offer_asset_dec.amount,
        ask_ind,
        &config,
        &env,
        maker_fee_share,
        share_fee_share,
    )?;
    xs[offer_ind] += offer_asset_dec.amount;
    xs[ask_ind] -= swap_result.dy + swap_result.maker_fee + swap_result.share_fee;

    let return_amount = swap_result.dy.to_uint(ask_asset_prec)?;
    let spread_amount = swap_result.spread_fee.to_uint(ask_asset_prec)?;
    assert_max_spread(
        belief_price,
        max_spread,
        offer_asset.amount,
        return_amount,
        spread_amount,
    )?;

    let total_share = query_supply(&deps.querier, &config.pair_info.liquidity_token)?
        .to_decimal256(LP_TOKEN_PRECISION);

    // Skip very small trade sizes which could significantly mess up the price due to rounding errors,
    // especially if token precisions are 18.
    if (swap_result.dy + swap_result.maker_fee + swap_result.share_fee) >= MIN_TRADE_SIZE
        && offer_asset_dec.amount >= MIN_TRADE_SIZE
    {
        let last_price = swap_result.calc_last_price(offer_asset_dec.amount, offer_ind);

        // update_price() works only with internal representation
        xs[1] *= config.pool_state.price_state.price_scale;
        config
            .pool_state
            .update_price(&config.pool_params, &env, total_share, &xs, last_price)?;
    }

    let receiver = to.unwrap_or_else(|| sender.clone());

    let mut messages = vec![Asset {
        info: pools[ask_ind].info.clone(),
        amount: return_amount,
    }
    .into_msg(&receiver)?];

    // Send the shared fee
    let mut fee_share_amount = Uint128::zero();
    if let Some(fee_share) = config.fee_share.clone() {
        fee_share_amount = swap_result.share_fee.to_uint(ask_asset_prec)?;
        if !fee_share_amount.is_zero() {
            let fee = pools[ask_ind].info.with_balance(fee_share_amount);
            messages.push(fee.into_msg(fee_share.recipient)?);
        }
    }

    // Send the maker fee
    let mut maker_fee = Uint128::zero();
    if let Some(fee_address) = fee_info.fee_address {
        maker_fee = swap_result.maker_fee.to_uint(ask_asset_prec)?;
        if !maker_fee.is_zero() {
            let fee = pools[ask_ind].info.with_balance(maker_fee);
            messages.push(fee.into_msg(fee_address)?);
        }
    }

    accumulate_prices(&env, &mut config, old_real_price);

    CONFIG.save(deps.storage, &config)?;

    let event = Event::new("swap")
        .add_attribute("action", "swap")
        .add_attribute("sender", sender.to_string())
        .add_attribute("receiver", receiver.to_string())
        .add_attribute("offer_asset", offer_asset.info.to_string())
        .add_attribute("ask_asset", pools[ask_ind].info.to_string())
        .add_attribute("offer_amount", offer_asset.amount.to_string())
        .add_attribute("return_amount", return_amount.to_string())
        .add_attribute("spread_amount", spread_amount.to_string())
        .add_attribute(
            "commission_amount",
            swap_result.total_fee.to_uint(ask_asset_prec)?.to_string(),
        )
        .add_attribute("maker_fee_amount", maker_fee.to_string())
        .add_attribute("fee_share_amount", fee_share_amount.to_string());

    Ok(Response::new().add_messages(messages).add_event(event))
}

/// Updates the pool configuration with the specified parameters in the `params` variable.
///
/// * **params** new parameter values in [`Binary`] form.
fn update_config(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    params: Binary,
) -> Result<Response, ContractError> {
    let mut config = CONFIG.load(deps.storage)?;
    let factory_config = query_factory_config(&deps.querier, &config.factory_addr)?;

    let owner = config.owner.as_ref().unwrap_or(&factory_config.owner);
    if info.sender != *owner {
        return Err(ContractError::Unauthorized {});
    }

    let mut response = Response::default();

    match from_json::<ConcentratedPoolUpdateParams>(&params)? {
        ConcentratedPoolUpdateParams::Update(update_params) => {
            config.pool_params.update_params(update_params)?;

            response.attributes.push(attr("action", "update_params"));
        }
        ConcentratedPoolUpdateParams::Promote(promote_params) => {
            config.pool_state.promote_params(&env, promote_params)?;
            response.attributes.push(attr("action", "promote_params"));
        }
        ConcentratedPoolUpdateParams::StopChangingAmpGamma {} => {
            config.pool_state.stop_promotion(&env);
            response
                .attributes
                .push(attr("action", "stop_changing_amp_gamma"));
        }
        ConcentratedPoolUpdateParams::EnableFeeShare {
            fee_share_bps,
            fee_share_address,
        } => {
            // Enable fee sharing for this contract
            // If fee sharing is already enabled, we should be able to overwrite
            // the values currently set

            // Ensure the fee share isn't 0 and doesn't exceed the maximum allowed value
            if fee_share_bps == 0 || fee_share_bps > MAX_FEE_SHARE_BPS {
                return Err(ContractError::FeeShareOutOfBounds {});
            }

            // Set sharing config
            config.fee_share = Some(FeeShareConfig {
                bps: fee_share_bps,
                recipient: deps.api.addr_validate(&fee_share_address)?,
            });

            response.attributes.extend(vec![
                attr("action", "enable_fee_share"),
                attr("fee_share_bps", fee_share_bps.to_string()),
                attr("fee_share_address", fee_share_address),
            ]);
        }
        ConcentratedPoolUpdateParams::DisableFeeShare => {
            // Disable fee sharing for this contract by setting bps and
            // address back to None
            config.fee_share = None;
            response
                .attributes
                .push(attr("action", "disable_fee_share"));
        }
    };
    CONFIG.save(deps.storage, &config)?;

    Ok(response)
}

/// Manages the contract migration.
#[cfg(not(tarpaulin_include))]
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn migrate(deps: DepsMut, _env: Env, _msg: Empty) -> Result<Response, ContractError> {
    let version = get_contract_version(deps.storage)?;

    match version.contract.as_ref() {
        CONTRACT_NAME => match version.version.as_ref() {
            "4.1.0" => {}
            _ => return Err(ContractError::MigrationError {}),
        },
        _ => return Err(ContractError::MigrationError {}),
    }

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    Ok(Response::new()
        .add_attribute("previous_contract_name", &version.contract)
        .add_attribute("previous_contract_version", &version.version)
        .add_attribute("new_contract_name", CONTRACT_NAME)
        .add_attribute("new_contract_version", CONTRACT_VERSION))
}
