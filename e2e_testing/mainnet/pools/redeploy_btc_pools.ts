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
    const baby_usdc = 0.09135;
    const btc_usd = 95028;
    const baby_btc = baby_usdc / btc_usd ;
    const baby_btc_decimals = Number(baby_btc).toFixed(10);
    console.log(baby_btc_decimals);

    // Create pairs for each asset with BABY
    const assets = [
        { name: "uniBTC", denom: uniBTCUnion },
        { name: "LBTC.union", denom: LBTCUnion },
        { name: "SolvBTC.union", denom: SolvBTCUnion },
        { name: "PumpBTC", denom: PumpBTCUnion },
        { name: "stBTC", denom: stBTCUnion }
    ];

    // Create narrow pair solvBTC pair
    console.log(`Creating pairs for ${SolvBTC}-BABY...`);
    await factoryClient.createPair(
        {
            assetInfos: [
                { token: { contract_addr: SolvBTC } },
                { token: { contract_addr: BABY } }
            ],
            pairType: { concentrated: {} },
            initParams: toBase64(pclNarrowParams(baby_btc_decimals))
        },
        "auto"
    ).then(console.log);

    for (const asset of assets) {
        console.log(`Creating pairs for ${asset.name}Union-EBABY...`);
        
        // Create wide pair
        await factoryClient.createPair(
            {
                assetInfos: [
                    { token: { contract_addr: asset.denom } },
                    { token: { contract_addr: BABY } }
                ],
                pairType: { concentrated: {} },
                initParams: toBase64(pclWideParams(baby_btc_decimals))
            },
            "auto"
        ).then(console.log);

        
    }
}

main().catch(console.error);
