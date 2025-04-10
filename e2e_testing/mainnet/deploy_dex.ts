import deployed from "./deployed.json";
import config from "./config.json";
import contracts from "./contracts.json"
import {getClientAndAddress} from "./lib";
import * as fs from "fs";
import {InstantiateMsg as FactoryInitMsg, PairConfig} from "../sdk/AstroportFactory.types";
import {InstantiateMsg as CoinRegistryInitMsg} from "../sdk/AstroportNativeCoinRegistry.types";
import {IncentivizationFeeInfo, InstantiateMsg as IncentivesInitMsg} from "../sdk/AstroportIncentives.types";
import {AssetInfo} from "../sdk/AstroportPair.types";


const main = async () => {
    const {client, address} = await getClientAndAddress();

    // Init coin registry
    console.log("Init coin registry");
    deployed.coin_registry = await client
        .instantiate(
            address,
            contracts["astroport_native_coin_registry"]!,
            {owner: config.admin} as CoinRegistryInitMsg,
            "Tower Coin registry",
            "auto",
            {admin: config.admin}
        )
        .then((resp) => resp.contractAddress);

    // Init factory
    console.log("Init factory");
    const init_msg = {
        coin_registry_address: deployed.coin_registry,
        owner: config.admin,
        fee_address: config.fee_address,
        pair_configs: [
            {
                code_id: contracts["astroport_pair"]!,
                maker_fee_bps: 0,
                pair_type: {xyk: {}},
                total_fee_bps: 30
            } as PairConfig,
            {
                code_id: contracts["astroport_pair_concentrated"]!,
                maker_fee_bps: 0,
                pair_type: {concentrated: {}},
                total_fee_bps: 3000,
            } as PairConfig
        ],
        token_code_id: contracts["cw20_token"]!
    } as FactoryInitMsg;

    deployed.factory = await client
        .instantiate(address, contracts["astroport_factory"]!, init_msg, "Tower Factory", "auto", {admin: config.admin})
        .then((resp) => resp.contractAddress)

    // Init incentives
    console.log("Init incentives");
    const incentives_init_msg = {
        factory: deployed.factory,
        incentivization_fee_info: config.incentivize_fee as IncentivizationFeeInfo,
        owner: config.admin,
        // Unused in our context but mandatory by initial design
        astro_token: {native_token: {denom: "tbd"}} as AssetInfo,
        vesting_contract: config.admin
    } as IncentivesInitMsg;

    deployed.incentives = await client
        .instantiate(address, contracts["astroport_incentives"]!, incentives_init_msg, "Tower Incentives", "auto", {admin: config.admin})
        .then((resp) => resp.contractAddress);

    // Init router
    console.log("Init router");
    deployed.router = await client
        .instantiate(address, contracts["astroport_router"]!, incentives_init_msg, "Tower Router", "auto", {admin: config.admin})
        .then((resp) => resp.contractAddress);

    console.log("Contracts deployed");
    console.log(deployed);

    fs.writeFileSync("deployed.json", JSON.stringify(deployed, null, 2));
   
}

main()
