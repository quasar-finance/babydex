import deployed from "../../deployed.json";
import config from "../../config.json";
import {AstroportFactoryClient} from "../../sdk/AstroportFactory.client";
import {getClientAndAddress} from "../../lib";
import {AstroportIncentivesClient} from "../../sdk/AstroportIncentives.client";
import { pclNarrowParams, pclWideParams } from "../pcl_params";
import { BABY, LBTC, uniBTCUnion, LBTCUnion, SolvBTCUnion, PumpBTCUnion, stBTCUnion } from "../assets";

const toBase64 = (object: any) => {
    return Buffer.from(JSON.stringify(object)).toString('base64');
}

const main = async () => {
    const {client, address} = await getClientAndAddress();

    const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);

    // calculate price scales like 1 x\[0] = price_scale * x\[1].
    const baby_usdc = 0.07183;
    const btc_usd = 84497;
    const baby_btc = btc_usd / baby_usdc;
    const baby_btc_decimals = Number(baby_btc).toFixed(10);
    console.log(baby_btc_decimals);

    // Create pairs for each Union asset with BABY
    const unionAssets = [
        { name: "uniBTC", denom: uniBTCUnion },
        { name: "LBTC", denom: LBTCUnion },
        { name: "SolvBTC", denom: SolvBTCUnion },
        { name: "PumpBTC", denom: PumpBTCUnion },
        { name: "stBTC", denom: stBTCUnion }
    ];

    for (const asset of unionAssets) {
        console.log(`Creating pairs for ${asset.name}Union-BABY...`);
        
        // Create wide pair
        await factoryClient.createPair(
            {
                assetInfos: [
                    { native_token: { denom: asset.denom } },
                    { native_token: { denom: BABY } }
                ],
                pairType: { concentrated: {} },
                initParams: toBase64(pclWideParams(baby_btc_decimals))
            },
            "auto"
        ).then(console.log);

        // Create narrow pair
        await factoryClient.createPair(
            {
                assetInfos: [
                    { native_token: { denom: asset.denom } },
                    { native_token: { denom: BABY } }
                ],
                pairType: { concentrated: {} },
                initParams: toBase64(pclNarrowParams(baby_btc_decimals))
            },
            "auto"
        ).then(console.log);
    }
}

main().catch(console.error);
