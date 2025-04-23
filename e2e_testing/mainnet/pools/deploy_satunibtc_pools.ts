import deployed from "../deployed.json";
import {AstroportFactoryClient} from "../../sdk/AstroportFactory.client";
import {getClientAndAddress} from "../lib";
import { pclLSDParams, pclNarrowParams, pclWideParams } from "../pcl_params";
import { BABY, LBTC, uniBTCUnion, LBTCUnion, SolvBTCUnion, PumpBTCUnion, stBTCUnion, EBABY, satuniBTC } from "../assets";

const toBase64 = (object: any) => {
    return Buffer.from(JSON.stringify(object)).toString('base64');
}

const main = async () => {
    const {client, address} = await getClientAndAddress();

    const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);

    // calculate price scales like 1 x\[0] = price_scale * x\[1].
    const baby_usdc = 0.085;
    const btc_usd = 93722;
    const baby_btc = btc_usd / baby_usdc;
    const baby_btc_decimals = Number(baby_btc).toFixed(10);
    console.log(baby_btc_decimals);
        
        // Create LSD pair
        await factoryClient.createPair(
            {
                assetInfos: [
                    { token: { contract_addr: uniBTCUnion } },
                    { token: { contract_addr: satuniBTC } }
                ],
                pairType: { concentrated: {} },
                initParams: toBase64(pclLSDParams("1.0"))
            },
            "auto"
        ).then(console.log);

        // Create wide pair
        await factoryClient.createPair(
            {
                assetInfos: [
                    { token: { contract_addr: satuniBTC } },
                    { native_token: { denom: BABY } }
                ],
                pairType: { concentrated: {} },
                initParams: toBase64(pclWideParams(baby_btc_decimals))
            },
            "auto"
        ).then(console.log);
}

main().catch(console.error);
