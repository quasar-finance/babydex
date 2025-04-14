import deployed from "./deployed.json";
import config from "./config.json";
import {AstroportFactoryClient} from "../sdk/AstroportFactory.client";
import {getClientAndAddress} from "./lib";
import {AstroportIncentivesClient} from "../sdk/AstroportIncentives.client";
import { pclNarrowParams, pclWideParams } from "./pcl_params";

const toBase64 = (object: any) => {
    return Buffer.from(JSON.stringify(object)).toString('base64');
}

const main = async () => {
    const {client, address} = await getClientAndAddress();

    const LBTC = "ibc/89EE10FCF78800B572BAAC7080AEFA301B5F3BBC51C5371E907EB129C5B900E7";
    const USDC = "ibc/65D0BEC6DAD96C7F5043D1E54E54B6BB5D5B3AEC3FF6CEBB75B9E059F3580EA3";
    const BABY = "ubbn"

    const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);

    // Set decimals in registry
    // await client.execute(
    //     address,
    //     deployed.coin_registry,
    //     {
    //         add: {
    //             native_coins: [
    //                 [LBTC, 8],
    //                 [USDC, 6], 
    //                 [BABY, 6]
    //             ]
    //         }
    //     },
    //     "auto"
    // ).then(console.log)


    // calculate price scales like 1 x\[0] = price_scale * x\[1].
    // 1 * BABY = PriceScale * USDC 
    // 1 BABY = 0.076 USDC
    // 1 BABY = 0.076 USDC = x BTC
    const baby_usdc = 0.074
    const btc_usd = 81896;
    const baby_btc = baby_usdc / btc_usd;
    const baby_btc_decimals = Number(baby_btc).toFixed(10);
    console.log(baby_btc_decimals);

    // Create xyk-like PCL pairs
    await factoryClient.createPair(
        {
            assetInfos: [
                {native_token: {denom: BABY}},
                {native_token: {denom: USDC}}
            ],
            pairType: {concentrated: {}},
            // add price scale
            initParams: toBase64(pclWideParams(baby_usdc.toString()))
        },
        "auto"
    ).then(console.log)

    await factoryClient.createPair(
        {
            assetInfos: [
                {native_token: {denom: BABY}},
                {native_token: {denom: LBTC}}
            ],
            pairType: {concentrated: {}},
            // add price scale
            initParams: toBase64(pclWideParams(baby_btc_decimals))
        },
        "auto"
    ).then(console.log)

    
    // // Create wide PCL pairs
    // // calculate price scales like 1 x\[0] = price_scale * x\[1].
    await factoryClient.createPair(
        {
            assetInfos: [
                {native_token: {denom: BABY}},
                {native_token: {denom: USDC}}
            ],
            pairType: {concentrated: {}},
            initParams: toBase64(pclNarrowParams(baby_usdc.toString()))
        },
        "auto"
    ).then(console.log)

    // // calculate price scales like 1 x\[0] = price_scale * x\[1].
    await factoryClient.createPair(
        {
            assetInfos: [
                {native_token: {denom: BABY}},
                {native_token: {denom: LBTC}}
            ],
            pairType: {concentrated: {}},
            initParams: toBase64(pclNarrowParams(baby_btc_decimals))
        },
        "auto"
    ).then(console.log)

    const pairs = await factoryClient.pairs({})
    console.log(JSON.stringify(pairs, null, 2))
    
    // Update config with new incentives address
    // await factoryClient.updateConfig({
    //     incentivesAddress: deployed.incentives,
    // }, "auto").then(console.log);}
}

main()
