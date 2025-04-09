import deployed from "./deployed.json";
import config from "./config.json";
import {AstroportFactoryClient} from "../sdk/AstroportFactory.client";
import {getClientAndAddress} from "./lib";
import {AstroportIncentivesClient} from "../sdk/AstroportIncentives.client";

const toBase64 = (object: any) => {
    return Buffer.from(JSON.stringify(object)).toString('base64');
}

// TODO adapt params
const pclWideParams = (priceScale: number) => {
    return {
        amp: "10",
        gamma: "0.000145",
        mid_fee: "0.0026",
        out_fee: "0.0045",
        fee_gamma: "0.00023",
        repeg_profit_threshold: "0.000002",
        min_price_scale_delta: "0.000146",
        price_scale: priceScale.toString(),
        ma_half_time: 600
    }
}

// TODO adapt params
const pclNarrowParams = (priceScale: number) => {
    return {
        amp: "10",
        gamma: "0.000145",
        mid_fee: "0.0026",
        out_fee: "0.0045",
        fee_gamma: "0.00023",
        repeg_profit_threshold: "0.000002",
        min_price_scale_delta: "0.000146",
        price_scale: priceScale.toString(),
        ma_half_time: 600
    }
}

// TODO adapt params
const pclLSDParams = (priceScale: number) => {
    return {
        amp: "500",
        gamma: "0.01",
        mid_fee: "0.0003",
        out_fee: "0.0045",
        fee_gamma: "0.3",
        repeg_profit_threshold: "0.00000001",
        min_price_scale_delta: "0.0000055",
        price_scale: `${priceScale}`,
        ma_half_time: 600
    }
}

const main = async () => {
    const {client, address} = await getClientAndAddress();

    const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);

    // Set decimals in registry
    await client.execute(
        address,
        deployed.coin_registry,
        {
            add: {
                // TODO add USDC
                native_coins: [
                    ["ibc/89EE10FCF78800B572BAAC7080AEFA301B5F3BBC51C5371E907EB129C5B900E7", 8], // LBTC
                    ["", 6],
                    ["ubbn", 6] // baby
                ]
            }
        },
        "auto"
    ).then(console.log)

    // Create xyk-like PCL pairs
    
    // Create wide PCL pairs
    await factoryClient.createPair(
        {
            assetInfos: [
                {native_token: {denom: "ibc/"}},
                {native_token: {denom: "ibc/"}}
            ],
            pairType: {concentrated: {}},
            initParams: toBase64(pclVolatileParams(2.5))
        },
        "auto"
    ).then(console.log)

    // Create Correlated PCL pairs
    await factoryClient.createPair(
        {
            assetInfos: [
                {native_token: {denom: "ibc/"}},
                {native_token: {denom: "ibc/"}}
            ],
            pairType: {concentrated: {}},
            initParams: toBase64(pclLSDParams(1))
        },
        "auto"
    ).then(console.log)

    const pairs = await factoryClient.pairs({})
    console.log(JSON.stringify(pairs, null, 2))
    
    // Update config with new incentives address
    await factoryClient.updateConfig({
        incentivesAddress: deployed.incentives,
    }, "auto").then(console.log);}

main()
