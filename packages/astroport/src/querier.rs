use cosmwasm_std::{
    from_json, Addr, CustomQuery, Decimal, QuerierWrapper, StdError, StdResult, Uint128,
};
use cw20::{BalanceResponse as Cw20BalanceResponse, Cw20QueryMsg, TokenInfoResponse};

use crate::asset::AssetInfo;
use crate::factory::{
    Config as FactoryConfig, FeeInfoResponse, PairType, QueryMsg as FactoryQueryMsg,
};

/// Returns a native token's balance for a specific account.
///
/// * **denom** specifies the denomination used to return the balance (e.g uluna).
pub fn query_balance<C>(
    querier: &QuerierWrapper<C>,
    account_addr: impl Into<String>,
    denom: impl Into<String>,
) -> StdResult<Uint128>
where
    C: CustomQuery,
{
    querier
        .query_balance(account_addr, denom)
        .map(|coin| coin.amount)
}

/// Returns a token balance for an account.
///
/// * **contract_addr** token contract for which we return a balance.
///
/// * **account_addr** account address for which we return a balance.
pub fn query_token_balance<C>(
    querier: &QuerierWrapper<C>,
    contract_addr: impl Into<String>,
    account_addr: impl Into<String>,
) -> StdResult<Uint128>
where
    C: CustomQuery,
{
    // load balance from the token contract
    let resp: Cw20BalanceResponse = querier
        .query_wasm_smart(
            contract_addr,
            &Cw20QueryMsg::Balance {
                address: account_addr.into(),
            },
        )
        .unwrap_or_else(|_| Cw20BalanceResponse {
            balance: Uint128::zero(),
        });

    Ok(resp.balance)
}

/// Returns a token's symbol.
///
/// * **contract_addr** token contract address.
pub fn query_token_symbol<C>(
    querier: &QuerierWrapper<C>,
    contract_addr: impl Into<String>,
) -> StdResult<String>
where
    C: CustomQuery,
{
    let res: TokenInfoResponse =
        querier.query_wasm_smart(contract_addr, &Cw20QueryMsg::TokenInfo {})?;

    Ok(res.symbol)
}

/// Returns the total supply of a specific token.
///
/// * **contract_addr** token contract address.
pub fn query_supply<C>(
    querier: &QuerierWrapper<C>,
    contract_addr: impl Into<String>,
) -> StdResult<Uint128>
where
    C: CustomQuery,
{
    let res: TokenInfoResponse =
        querier.query_wasm_smart(contract_addr, &Cw20QueryMsg::TokenInfo {})?;

    Ok(res.total_supply)
}

/// Returns the number of decimals that a token has.
///
/// * **asset_info** is an object of type [`AssetInfo`] and contains the asset details for a specific token.
pub fn query_token_precision<C>(
    querier: &QuerierWrapper<C>,
    asset_info: &AssetInfo,
    factory_addr: &Addr,
) -> StdResult<u8>
where
    C: CustomQuery,
{
    Ok(match asset_info {
        AssetInfo::NativeToken { denom } => {
            let res = query_factory_config(querier, factory_addr)?;
            let result = crate::native_coin_registry::COINS_INFO.query(
                querier,
                res.coin_registry_address,
                denom.to_string(),
            )?;

            if let Some(decimals) = result {
                decimals
            } else {
                return Err(StdError::generic_err(format!(
                    "The {denom} precision was not found"
                )));
            }
        }
        AssetInfo::Token { contract_addr } => {
            let res: TokenInfoResponse =
                querier.query_wasm_smart(contract_addr, &Cw20QueryMsg::TokenInfo {})?;

            res.decimals
        }
    })
}

/// Returns the configuration for the factory contract.
pub fn query_factory_config<C>(
    querier: &QuerierWrapper<C>,
    factory_contract: impl Into<String>,
) -> StdResult<FactoryConfig>
where
    C: CustomQuery,
{
    if let Some(res) = querier.query_wasm_raw(factory_contract, b"config".as_slice())? {
        let res = from_json(res)?;
        Ok(res)
    } else {
        Err(StdError::generic_err("The factory config not found!"))
    }
}

/// This structure holds parameters that describe the fee structure for a pool.
pub struct FeeInfo {
    /// The fee address
    pub fee_address: Option<Addr>,
    /// The total amount of fees charged per swap
    pub total_fee_rate: Decimal,
    /// The amount of fees sent to the Maker contract
    pub maker_fee_rate: Decimal,
}

/// Returns the fee information for a specific pair type.
///
/// * **pair_type** pair type we query information for.
pub fn query_fee_info<C>(
    querier: &QuerierWrapper<C>,
    factory_contract: impl Into<String>,
    pair_type: PairType,
) -> StdResult<FeeInfo>
where
    C: CustomQuery,
{
    let res: FeeInfoResponse =
        querier.query_wasm_smart(factory_contract, &FactoryQueryMsg::FeeInfo { pair_type })?;

    Ok(FeeInfo {
        fee_address: res.fee_address,
        total_fee_rate: Decimal::from_ratio(res.total_fee_bps, 10000u16),
        maker_fee_rate: Decimal::from_ratio(res.maker_fee_bps, 10000u16),
    })
}
