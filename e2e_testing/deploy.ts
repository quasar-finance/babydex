import * as fs from "fs";
import {InstantiateMsg as FactoryInitMsg, PairConfig} from "./sdk/AstroportFactory.types";
import {InstantiateMsg as CoinRegistryInitMsg} from "./sdk/AstroportNativeCoinRegistry.types";
import {IncentivizationFeeInfo, InstantiateMsg as IncentivesInitMsg} from "./sdk/AstroportIncentives.types";
import {AssetInfo} from "./sdk/AstroportPair.types";
import config from "./config.json"
import {getClientAndAddress} from "./lib";

const WASM_PATH = "../artifacts/$path.wasm";
const CONTRACTS = [
    "astroport_factory",
    "astroport_incentives",
    "astroport_native_coin_registry",
    "astroport_pair",
    "astroport_pair_concentrated",
    "astroport_router",
]

interface Deployed {
    coin_registry?: string;
    factory?: string;
    incentives?: string;
    router?: string;
}

async function main() {
    const {client, address} = await getClientAndAddress();

    // Store contracts
    let contracts: { [key: string]: number } = {};
    for (let contract of CONTRACTS) {
        const wasmCode = fs.readFileSync(WASM_PATH.replace("$path", contract));
        console.log(`Uploading ${contract}`);
        const resp = await client.upload(address, wasmCode, "auto", `Upload ${contract}`);
        contracts[contract] = resp.codeId;
    }
    // Store CW20 token
    const cw20_code = fs.readFileSync("contracts/cw20_base.wasm");
    console.log("Uploading CW20 token");
    const cw20_resp = await client.upload(address, cw20_code, "auto", "Upload CW20 token");
    contracts["cw20_token"] = cw20_resp.codeId;

    // Write contract code IDs to JSON file
    console.log("Writing contract code IDs to contracts.json");
    fs.writeFileSync("contracts.json", JSON.stringify(contracts, null, 2));

    let deployed: Deployed = {};

    // Init coin registry
    console.log("Init coin registry");
    deployed.coin_registry = await client
        .instantiate(
            address,
            contracts["astroport_native_coin_registry"]!,
            {owner: address} as CoinRegistryInitMsg,
            "Coin registry",
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
                maker_fee_bps: 1000,
                pair_type: {xyk: {}},
                total_fee_bps: 3000
            } as PairConfig,
            {
                code_id: contracts["astroport_pair_concentrated"]!,
                maker_fee_bps: 1000,
                pair_type: {concentrated: {}},
                total_fee_bps: 0
            } as PairConfig
        ],
        token_code_id: contracts["cw20_token"]!
    } as FactoryInitMsg;
    deployed.factory = await client
        .instantiate(address, contracts["astroport_factory"]!, init_msg, "Factory", "auto", {admin: config.admin})
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
        .instantiate(address, contracts["astroport_incentives"]!, incentives_init_msg, "Incentives", "auto", {admin: config.admin})
        .then((resp) => resp.contractAddress);

    // Init router
    console.log("Init router");
    deployed.router = await client
        .instantiate(address, contracts["astroport_router"]!, incentives_init_msg, "Router", "auto", {admin: config.admin})
        .then((resp) => resp.contractAddress);

    console.log("Contracts deployed");
    console.log(deployed);

    fs.writeFileSync("deployed.json", JSON.stringify(deployed, null, 2));
}

main();