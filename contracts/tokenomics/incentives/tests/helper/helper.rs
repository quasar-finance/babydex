#![allow(dead_code)]

use std::collections::hash_map::Entry;
use std::collections::HashMap;

use anyhow::Result as AnyResult;
use cosmwasm_std::testing::mock_env;
use cosmwasm_std::{
    to_json_binary, Addr, BlockInfo, Coin, Decimal256, Empty, Env, StdResult, Timestamp, Uint128,
};
use cw20::MinterResponse;
use cw_multi_test::{App, AppBuilder, AppResponse, Contract, ContractWrapper, Executor};
use itertools::Itertools;

use astroport::asset::{Asset, AssetInfo, AssetInfoExt, PairInfo};
use astroport::factory::{PairConfig, PairType};
use astroport::incentives::{
    Config, ExecuteMsg, IncentivesSchedule, IncentivizationFeeInfo, InputSchedule,
    PoolInfoResponse, QueryMsg, RewardInfo, ScheduleResponse,
};
use astroport::{factory, native_coin_registry, pair};

use crate::helper::broken_cw20;

fn factory_contract() -> Box<dyn Contract<Empty>> {
    Box::new(
        ContractWrapper::new_with_empty(
            astroport_factory::contract::execute,
            astroport_factory::contract::instantiate,
            astroport_factory::contract::query,
        )
        .with_reply_empty(astroport_factory::contract::reply),
    )
}

fn pair_contract() -> Box<dyn Contract<Empty>> {
    Box::new(
        ContractWrapper::new_with_empty(
            astroport_pair::contract::execute,
            astroport_pair::contract::instantiate,
            astroport_pair::contract::query,
        )
        .with_reply_empty(astroport_pair::contract::reply),
    )
}

fn coin_registry_contract() -> Box<dyn Contract<Empty>> {
    Box::new(ContractWrapper::new_with_empty(
        astroport_native_coin_registry::contract::execute,
        astroport_native_coin_registry::contract::instantiate,
        astroport_native_coin_registry::contract::query,
    ))
}

fn token_contract() -> Box<dyn Contract<Empty>> {
    Box::new(ContractWrapper::new_with_empty(
        cw20_base::contract::execute,
        cw20_base::contract::instantiate,
        cw20_base::contract::query,
    ))
}

fn broken_token_contract() -> Box<dyn Contract<Empty>> {
    Box::new(ContractWrapper::new_with_empty(
        broken_cw20::execute,
        cw20_base::contract::instantiate,
        cw20_base::contract::query,
    ))
}

fn generator_contract() -> Box<dyn Contract<Empty>> {
    Box::new(
        ContractWrapper::new_with_empty(
            astroport_incentives::execute::execute,
            astroport_incentives::instantiate::instantiate,
            astroport_incentives::query::query,
        )
        .with_reply_empty(astroport_incentives::reply::reply),
    )
}

pub struct Helper {
    pub app: App,
    pub owner: Addr,
    pub factory: Addr,
    pub generator: Addr,
    pub coin_registry: Addr,
    pub token_code_id: u64,
    pub incentivization_fee: Coin,
}

impl Helper {
    pub fn new(astro: &AssetInfo) -> AnyResult<Self> {
        let mut app = AppBuilder::new()
            .with_block(BlockInfo {
                height: 1,
                time: Timestamp::from_seconds(1696810000),
                chain_id: "cw-multitest-1".to_string(),
            })
            .build(|_, _, _| {});
        let owner = app.api().addr_make("owner");

        let coin_registry_address_code = app.store_code(coin_registry_contract());
        let coin_registry_address = app
            .instantiate_contract(
                coin_registry_address_code,
                owner.clone(),
                &native_coin_registry::InstantiateMsg {
                    owner: owner.to_string(),
                },
                &[],
                "Astroport Coin Registry",
                None,
            )
            .unwrap();

        let factory_code = app.store_code(factory_contract());
        let token_code_id = app.store_code(token_contract());
        let pair_code = app.store_code(pair_contract());
        let factory = app
            .instantiate_contract(
                factory_code,
                owner.clone(),
                &factory::InstantiateMsg {
                    pair_configs: vec![
                        PairConfig {
                            code_id: pair_code,
                            pair_type: PairType::Xyk {},
                            total_fee_bps: 0,
                            maker_fee_bps: 0,
                            is_disabled: false,
                            is_generator_disabled: false,
                            permissioned: false,
                        },
                        PairConfig {
                            code_id: pair_code, // yet another xyk
                            pair_type: PairType::Custom("yet_another_xyk".to_string()),
                            total_fee_bps: 0,
                            maker_fee_bps: 0,
                            is_disabled: false,
                            is_generator_disabled: false,
                            permissioned: false,
                        },
                    ],
                    token_code_id,
                    fee_address: None,
                    incentives_address: None,
                    owner: owner.to_string(),
                    coin_registry_address: coin_registry_address.to_string(),
                },
                &[],
                "Astroport Factory",
                None,
            )
            .unwrap();

        let incentivization_fee = astro
            .with_balance(10_000_000000u128)
            .as_coin()
            .expect("Test suite supports only native ASTRO");

        let generator_code = app.store_code(generator_contract());
        let generator = app
            .instantiate_contract(
                generator_code,
                owner.clone(),
                &astroport::incentives::InstantiateMsg {
                    owner: owner.to_string(),
                    factory: factory.to_string(),
                    astro_token: astro.clone(),
                    vesting_contract: app.api().addr_make("vesting").to_string(),
                    incentivization_fee_info: Some(IncentivizationFeeInfo {
                        fee_receiver: app.api().addr_make("maker"),
                        fee: incentivization_fee.clone(),
                    }),
                    guardian: Some(app.api().addr_make("guardian").to_string()),
                },
                &[],
                "Astroport Generator",
                None,
            )
            .unwrap();

        app.execute_contract(
            owner.clone(),
            factory.clone(),
            &factory::ExecuteMsg::UpdateConfig {
                token_code_id: None,
                fee_address: None,
                incentives_address: Some(generator.to_string()),
                coin_registry_address: None,
            },
            &[],
        )
        .unwrap();

        Ok(Self {
            app,
            owner,
            factory,
            generator,
            coin_registry: coin_registry_address,
            token_code_id,
            incentivization_fee,
        })
    }

    pub fn stake(&mut self, from: &Addr, lp_asset: Asset) -> AnyResult<AppResponse> {
        match &lp_asset.info {
            AssetInfo::Token { contract_addr } => self.app.execute_contract(
                from.clone(),
                contract_addr.clone(),
                &cw20::Cw20ExecuteMsg::Send {
                    contract: self.generator.to_string(),
                    amount: lp_asset.amount,
                    msg: to_json_binary(&ExecuteMsg::Deposit { recipient: None }).unwrap(),
                },
                &[],
            ),
            AssetInfo::NativeToken { .. } => self.app.execute_contract(
                from.clone(),
                self.generator.clone(),
                &ExecuteMsg::Deposit { recipient: None },
                &[lp_asset.as_coin().unwrap()],
            ),
        }
    }

    pub fn unstake(
        &mut self,
        from: &Addr,
        lp_token: &str,
        amount: impl Into<Uint128>,
    ) -> AnyResult<AppResponse> {
        self.app.execute_contract(
            from.clone(),
            self.generator.clone(),
            &ExecuteMsg::Withdraw {
                lp_token: lp_token.to_string(),
                amount: amount.into(),
            },
            &[],
        )
    }

    pub fn setup_pools(&mut self, pools: Vec<(String, u128)>) -> AnyResult<AppResponse> {
        self.app.execute_contract(
            self.owner.clone(),
            self.generator.clone(),
            &ExecuteMsg::SetupPools {
                pools: pools
                    .into_iter()
                    .map(|(pool, amount)| (pool, amount.into()))
                    .collect(),
            },
            &[],
        )
    }

    pub fn deactivate_pool(&mut self, from: &Addr, lp_token: &str) -> AnyResult<AppResponse> {
        self.app.execute_contract(
            from.clone(),
            self.generator.clone(),
            &ExecuteMsg::DeactivatePool {
                lp_token: lp_token.to_string(),
            },
            &[],
        )
    }

    pub fn block_tokens(&mut self, from: &Addr, tokens: &[AssetInfo]) -> AnyResult<AppResponse> {
        self.app.execute_contract(
            from.clone(),
            self.generator.clone(),
            &ExecuteMsg::UpdateBlockedTokenslist {
                add: tokens.to_vec(),
                remove: vec![],
            },
            &[],
        )
    }

    pub fn unblock_tokens(&mut self, from: &Addr, tokens: &[AssetInfo]) -> AnyResult<AppResponse> {
        self.app.execute_contract(
            from.clone(),
            self.generator.clone(),
            &ExecuteMsg::UpdateBlockedTokenslist {
                add: vec![],
                remove: tokens.to_vec(),
            },
            &[],
        )
    }

    pub fn update_blocklist(
        &mut self,
        from: &Addr,
        add: &[AssetInfo],
        remove: &[AssetInfo],
    ) -> AnyResult<AppResponse> {
        self.app.execute_contract(
            from.clone(),
            self.generator.clone(),
            &ExecuteMsg::UpdateBlockedTokenslist {
                add: add.to_vec(),
                remove: remove.to_vec(),
            },
            &[],
        )
    }

    pub fn block_pair_type(&mut self, from: &Addr, pair_type: PairType) -> AnyResult<AppResponse> {
        let pair_config = self
            .app
            .wrap()
            .query_wasm_smart::<factory::ConfigResponse>(
                &self.factory,
                &factory::QueryMsg::Config {},
            )
            .unwrap()
            .pair_configs
            .into_iter()
            .find(|c| c.pair_type == pair_type)
            .unwrap();

        self.app.execute_contract(
            from.clone(),
            self.factory.clone(),
            &factory::ExecuteMsg::UpdatePairConfig {
                config: PairConfig {
                    is_generator_disabled: true,
                    ..pair_config
                },
            },
            &[],
        )
    }

    pub fn deactivate_blocked(&mut self) -> AnyResult<AppResponse> {
        self.app.execute_contract(
            self.app.api().addr_make("permissionless"),
            self.generator.clone(),
            &ExecuteMsg::DeactivateBlockedPools {},
            &[],
        )
    }

    pub fn set_tokens_per_second(&mut self, amount: u128) -> AnyResult<AppResponse> {
        self.app.execute_contract(
            self.owner.clone(),
            self.generator.clone(),
            &ExecuteMsg::SetTokensPerSecond {
                amount: amount.into(),
            },
            &[],
        )
    }

    pub fn create_schedule(
        &self,
        asset: &Asset,
        duration_periods: u64,
    ) -> AnyResult<(InputSchedule, IncentivesSchedule)> {
        let env = Env {
            block: self.app.block_info(),
            ..mock_env()
        };

        let input = InputSchedule {
            reward: asset.clone(),
            duration_periods,
        };
        let sch = IncentivesSchedule::from_input(&env, &input)?;

        Ok((input, sch))
    }

    pub fn init_cw20(&mut self, name: &str, decimals: Option<u8>) -> Addr {
        self.app
            .instantiate_contract(
                self.token_code_id,
                self.owner.clone(),
                &cw20_base::msg::InstantiateMsg {
                    name: name.to_string(),
                    symbol: name.to_string(),
                    decimals: decimals.unwrap_or(6),
                    initial_balances: vec![],
                    mint: Some(MinterResponse {
                        minter: self.owner.to_string(),
                        cap: None,
                    }),
                    marketing: None,
                },
                &[],
                name,
                None,
            )
            .unwrap()
    }

    pub fn init_broken_cw20(&mut self, name: &str, decimals: Option<u8>) -> Addr {
        let broken_cw20_code = self.app.store_code(broken_token_contract());
        self.app
            .instantiate_contract(
                broken_cw20_code,
                self.owner.clone(),
                &cw20_base::msg::InstantiateMsg {
                    name: name.to_string(),
                    symbol: name.to_string(),
                    decimals: decimals.unwrap_or(6),
                    initial_balances: vec![],
                    mint: Some(MinterResponse {
                        minter: self.owner.to_string(),
                        cap: None,
                    }),
                    marketing: None,
                },
                &[],
                name,
                None,
            )
            .unwrap()
    }

    pub fn incentivize_many(
        &mut self,
        from: &Addr,
        incentives: Vec<(&str, InputSchedule)>,
        attach_funds: &[Coin],
    ) -> AnyResult<AppResponse> {
        let mut funds = HashMap::new();
        for (_, schedule) in &incentives {
            match &schedule.reward.info {
                AssetInfo::Token { contract_addr } => {
                    self.app
                        .execute_contract(
                            from.clone(),
                            contract_addr.clone(),
                            &cw20::Cw20ExecuteMsg::IncreaseAllowance {
                                spender: self.generator.to_string(),
                                amount: schedule.reward.amount,
                                expires: None,
                            },
                            &[],
                        )
                        .unwrap();
                }
                AssetInfo::NativeToken { .. } => {
                    let coin = schedule.reward.as_coin().unwrap();
                    funds.insert(coin.denom.clone(), coin);
                }
            }
        }
        for coin in attach_funds {
            match funds.entry(coin.denom.clone()) {
                Entry::Occupied(mut entry) => {
                    entry.get_mut().amount += coin.amount;
                }
                Entry::Vacant(entry) => {
                    entry.insert(coin.clone());
                }
            }
        }
        let funds = funds.values().cloned().collect_vec();

        self.app.execute_contract(
            from.clone(),
            self.generator.clone(),
            &ExecuteMsg::IncentivizeMany(
                incentives
                    .into_iter()
                    .map(|(lp_token, schedule)| (lp_token.to_string(), schedule))
                    .collect(),
            ),
            &funds,
        )
    }

    pub fn incentivize(
        &mut self,
        from: &Addr,
        lp_token: &str,
        schedule: InputSchedule,
        attach_funds: &[Coin],
    ) -> AnyResult<AppResponse> {
        let mut funds = HashMap::new();
        match &schedule.reward.info {
            AssetInfo::Token { contract_addr } => {
                self.app
                    .execute_contract(
                        from.clone(),
                        contract_addr.clone(),
                        &cw20::Cw20ExecuteMsg::IncreaseAllowance {
                            spender: self.generator.to_string(),
                            amount: schedule.reward.amount,
                            expires: None,
                        },
                        &[],
                    )
                    .unwrap();
            }
            AssetInfo::NativeToken { .. } => {
                let coin = schedule.reward.as_coin().unwrap();
                funds.insert(coin.denom.clone(), coin);
            }
        }
        for coin in attach_funds {
            match funds.entry(coin.denom.clone()) {
                Entry::Occupied(mut entry) => {
                    entry.get_mut().amount += coin.amount;
                }
                Entry::Vacant(entry) => {
                    entry.insert(coin.clone());
                }
            }
        }
        let funds = funds.values().cloned().collect_vec();

        self.app.execute_contract(
            from.clone(),
            self.generator.clone(),
            &ExecuteMsg::Incentivize {
                lp_token: lp_token.to_string(),
                schedule,
            },
            &funds,
        )
    }

    pub fn remove_reward(
        &mut self,
        from: &Addr,
        lp_token: &str,
        reward: &str,
        bypass_upcoming_schedules: bool,
        receiver: &Addr,
    ) -> AnyResult<AppResponse> {
        self.app.execute_contract(
            from.clone(),
            self.generator.clone(),
            &ExecuteMsg::RemoveRewardFromPool {
                lp_token: lp_token.to_string(),
                reward: reward.to_string(),
                bypass_upcoming_schedules,
                receiver: receiver.to_string(),
            },
            &[],
        )
    }

    pub fn claim_orphaned_rewards(
        &mut self,
        limit: Option<u8>,
        receiver: impl Into<String>,
    ) -> AnyResult<AppResponse> {
        self.app.execute_contract(
            self.owner.clone(),
            self.generator.clone(),
            &ExecuteMsg::ClaimOrphanedRewards {
                limit,
                receiver: receiver.into(),
            },
            &[],
        )
    }

    pub fn claim_rewards(&mut self, from: &Addr, lp_tokens: Vec<String>) -> AnyResult<AppResponse> {
        self.app.execute_contract(
            from.clone(),
            self.generator.clone(),
            &ExecuteMsg::ClaimRewards { lp_tokens },
            &[],
        )
    }

    pub fn next_block(&mut self, plus_seconds: u64) {
        self.app.update_block(|block| {
            block.time = block.time.plus_seconds(plus_seconds);
            block.height += 1
        })
    }

    pub fn mint_assets(&mut self, to: &Addr, assets: &[Asset]) {
        for asset in assets {
            match &asset.info {
                AssetInfo::Token { contract_addr } => {
                    self.app
                        .execute_contract(
                            self.owner.clone(),
                            contract_addr.clone(),
                            &cw20::Cw20ExecuteMsg::Mint {
                                recipient: to.to_string(),
                                amount: asset.amount,
                            },
                            &[],
                        )
                        .unwrap();
                }
                AssetInfo::NativeToken { .. } => {
                    self.mint_coin(to, &asset.as_coin().unwrap());
                }
            }
        }
    }

    pub fn mint_coin(&mut self, to: &Addr, coin: &Coin) {
        // .init_balance() erases previous balance thus I use such hack and create intermediate "denom admin"
        let denom_admin = self.app.api().addr_make(&format!("{}_admin", &coin.denom));
        self.app
            .init_modules(|router, _, storage| {
                router
                    .bank
                    .init_balance(storage, &denom_admin, vec![coin.clone()])
            })
            .unwrap();

        self.app
            .send_tokens(denom_admin, to.clone(), &[coin.clone()])
            .unwrap();
    }

    pub fn query_pair_info(&self, asset_infos: &[AssetInfo]) -> PairInfo {
        self.app
            .wrap()
            .query_wasm_smart::<Vec<PairInfo>>(
                &self.factory,
                &factory::QueryMsg::PairsByAssetInfos {
                    asset_infos: asset_infos.to_vec(),
                    start_after: None,
                    limit: None,
                },
            )
            .map(|x| x[0].clone())
            .unwrap()
    }

    pub fn query_pending_rewards(&self, user: &Addr, lp_token: &str) -> Vec<Asset> {
        self.app
            .wrap()
            .query_wasm_smart(
                &self.generator,
                &QueryMsg::PendingRewards {
                    lp_token: lp_token.to_string(),
                    user: user.to_string(),
                },
            )
            .unwrap()
    }

    pub fn query_config(&self) -> Config {
        self.app
            .wrap()
            .query_wasm_smart(&self.generator, &QueryMsg::Config {})
            .unwrap()
    }

    pub fn query_deposit(&self, lp_token: &str, user: &Addr) -> StdResult<u128> {
        self.app
            .wrap()
            .query_wasm_smart::<Uint128>(
                &self.generator,
                &QueryMsg::QueryDeposit {
                    lp_token: lp_token.to_string(),
                    user: user.to_string(),
                },
            )
            .map(|x| x.u128())
    }

    pub fn is_fee_needed(&self, lp_token: &str, reward: &AssetInfo) -> bool {
        self.app
            .wrap()
            .query_wasm_smart::<bool>(
                &self.generator,
                &QueryMsg::IsFeeExpected {
                    lp_token: lp_token.to_string(),
                    reward: reward.to_string(),
                },
            )
            .unwrap()
    }

    pub fn query_ext_reward_schedules(
        &self,
        lp_token: &str,
        reward: &AssetInfo,
        start_after: Option<u64>,
        limit: Option<u8>,
    ) -> StdResult<Vec<ScheduleResponse>> {
        self.app.wrap().query_wasm_smart(
            &self.generator,
            &QueryMsg::ExternalRewardSchedules {
                reward: reward.to_string(),
                lp_token: lp_token.to_string(),
                start_after,
                limit,
            },
        )
    }

    pub fn blocked_tokens(&self) -> Vec<AssetInfo> {
        self.app
            .wrap()
            .query_wasm_smart(
                &self.generator,
                &QueryMsg::BlockedTokensList {
                    start_after: None,
                    limit: None,
                },
            )
            .unwrap()
    }

    pub fn pool_info(&self, lp_token: &str) -> StdResult<PoolInfoResponse> {
        self.app.wrap().query_wasm_smart(
            &self.generator,
            &QueryMsg::PoolInfo {
                lp_token: lp_token.to_string(),
            },
        )
    }

    pub fn pool_stakers(
        &self,
        lp_token: &str,
        start_after: Option<&Addr>,
        limit: Option<u8>,
    ) -> Vec<(String, Uint128)> {
        self.app
            .wrap()
            .query_wasm_smart(
                &self.generator,
                &QueryMsg::PoolStakers {
                    lp_token: lp_token.to_string(),
                    start_after: start_after.map(ToString::to_string),
                    limit,
                },
            )
            .unwrap()
    }

    pub fn query_reward_info(&self, lp_token: &str) -> Vec<RewardInfo> {
        self.app
            .wrap()
            .query_wasm_smart(
                &self.generator,
                &QueryMsg::RewardInfo {
                    lp_token: lp_token.to_string(),
                },
            )
            .unwrap()
    }

    pub fn all_pools(&self) -> Vec<String> {
        self.app
            .wrap()
            .query_wasm_smart(
                &self.generator,
                &QueryMsg::ListPools {
                    start_after: None,
                    limit: None,
                },
            )
            .unwrap()
    }

    pub fn active_pools(&self) -> Vec<(String, Uint128)> {
        self.app
            .wrap()
            .query_wasm_smart(&self.generator, &QueryMsg::ActivePools {})
            .unwrap()
    }

    pub fn create_pair(&mut self, asset_infos: &[AssetInfo]) -> AnyResult<PairInfo> {
        let asset_infos = asset_infos.to_vec();
        self.app
            .execute_contract(
                self.app.api().addr_make("permissionless"),
                self.factory.clone(),
                &factory::ExecuteMsg::CreatePair {
                    pair_type: PairType::Xyk {},
                    asset_infos: asset_infos.clone(),
                    init_params: None,
                },
                &[],
            )
            .map(|_| self.query_pair_info(&asset_infos))
    }

    pub fn create_another_pair(&mut self, asset_infos: &[AssetInfo]) -> PairInfo {
        for x in asset_infos {
            if let AssetInfo::NativeToken { denom } = x {
                self.app
                    .execute_contract(
                        self.owner.clone(),
                        self.coin_registry.clone(),
                        &native_coin_registry::ExecuteMsg::Add {
                            native_coins: vec![(denom.to_string(), 6)],
                        },
                        &[],
                    )
                    .unwrap();
            }
        }

        let asset_infos = asset_infos.to_vec();
        self.app
            .execute_contract(
                self.app.api().addr_make("permissionless"),
                self.factory.clone(),
                &factory::ExecuteMsg::CreatePair {
                    pair_type: PairType::Custom("yet_another_xyk".to_string()),
                    asset_infos: asset_infos.clone(),
                    init_params: None,
                },
                &[],
            )
            .unwrap();

        self.query_pair_info(&asset_infos)
    }

    /// Supports only native coins
    pub fn provide_liquidity(
        &mut self,
        sender: &Addr,
        assets: &[Asset],
        pair_addr: &Addr,
        auto_stake: bool,
    ) -> AnyResult<AppResponse> {
        // We don't test pair contract here thus we top up user's balance implicitly
        let funds = assets.iter().map(|a| a.as_coin().unwrap()).collect_vec();
        self.mint_assets(sender, assets);

        let msg = pair::ExecuteMsg::ProvideLiquidity {
            assets: assets.to_vec(),
            slippage_tolerance: None,
            auto_stake: Some(auto_stake),
            receiver: None,
            min_lp_to_receive: None,
        };

        self.app
            .execute_contract(sender.clone(), pair_addr.clone(), &msg, &funds)
    }

    pub fn snapshot_balances(&self, user: &Addr, pending_rewards: &[Asset]) -> Vec<Asset> {
        pending_rewards
            .iter()
            .map(|asset| {
                let balance = match &asset.info {
                    AssetInfo::Token { contract_addr } => {
                        self.app
                            .wrap()
                            .query_wasm_smart::<cw20::BalanceResponse>(
                                contract_addr,
                                &cw20::Cw20QueryMsg::Balance {
                                    address: user.to_string(),
                                },
                            )
                            .unwrap()
                            .balance
                    }
                    AssetInfo::NativeToken { denom } => {
                        self.app.wrap().query_balance(user, denom).unwrap().amount
                    }
                };

                asset.info.with_balance(balance)
            })
            .collect_vec()
    }
}

pub fn assert_rewards(bal_before: &[Asset], bal_after: &[Asset], pending_rewards: &[Asset]) {
    let sort_closure = |a: &&Asset, b: &&Asset| a.info.to_string().cmp(&b.info.to_string());

    let expected = bal_before
        .iter()
        .sorted_by(sort_closure)
        .zip(pending_rewards.iter().sorted_by(sort_closure))
        .fold(vec![], |mut acc, (before, pending)| {
            let amount = before.amount + pending.amount;
            acc.push(before.info.with_balance(amount));
            acc
        });

    let bal_after = bal_after
        .iter()
        .sorted_by(sort_closure)
        .cloned()
        .collect_vec();

    assert_eq!(bal_after, expected);
}

pub fn dec256_to_u128_floor(val: Decimal256) -> u128 {
    Uint128::try_from(val.to_uint_floor()).unwrap().u128()
}
