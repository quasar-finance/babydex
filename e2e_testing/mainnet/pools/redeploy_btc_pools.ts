import deployed from "../deployed.json";
import {AstroportFactoryClient} from "../../sdk/AstroportFactory.client";
import {getClientAndAddress} from "../lib";
import { pclNarrowParams, pclWideParams } from "../pcl_params";
import { BABY, LBTC, uniBTCUnion, LBTCUnion, SolvBTCUnion, PumpBTCUnion, stBTCUnion, EBABY, SolvBTC } from "../assets";

const toBase64 = (object: any) => {
    return Buffer.from(JSON.stringify(object)).toString('base64');
}

const main = async () => {
    const {client, address} = await getClientAndAddress();

    const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);

    // calculate price scales like price_scale * asset0 = 1 * asset1.
    const baby_usd = 0.09667;
    const btc_usd = 95173;
    const btc_baby = baby_usd / btc_usd ;
    const baby_btc_decimals = Number(btc_baby).toFixed(10);
    console.log(baby_btc_decimals);
    
    
    // console.log(`Creating pairs for ${uniBTCUnion}-EBABY...`);
    // await factoryClient.createPair(
    //     {
    //         assetInfos: [
    //             { token: { contract_addr: uniBTCUnion } },
    //             { token: { contract_addr: EBABY } }
    //         ],
    //         pairType: { concentrated: {} },
    //         initParams: toBase64(pclWideParams(baby_btc_decimals))
    //     },
    //     "auto"
    // ).then(console.log);
    
    // Create pairs for each asset with BABY
    const assets = [
        { name: "uniBTC", denom: uniBTCUnion },
        { name: "LBTC.union", denom: LBTCUnion },
        { name: "SolvBTC.union", denom: SolvBTCUnion },
        { name: "PumpBTC", denom: PumpBTCUnion },
        { name: "stBTC", denom: stBTCUnion }
    ];
    for (const asset of assets) {
        console.log(`Creating pairs for ${asset.name}Union-BABY...`);
        
        // Create wide pair
        await factoryClient.createPair(
            {
                assetInfos: [
                    { token: { contract_addr: asset.denom } },
                    { native_token: { denom: BABY } }
                ],
                pairType: { concentrated: {} },
                initParams: toBase64(pclWideParams(baby_btc_decimals))
            },
            "auto"
        ).then(console.log);

        
    }
}

main().catch(console.error);
