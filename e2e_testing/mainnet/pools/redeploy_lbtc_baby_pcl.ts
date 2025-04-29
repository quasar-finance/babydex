import deployed from "../deployed.json";
import {AstroportFactoryClient} from "../../sdk/AstroportFactory.client";
import {getClientAndAddress} from "../lib";
import {AstroportIncentivesClient} from "../../sdk/AstroportIncentives.client";
import { pclNarrowParams, pclWideParams } from "../pcl_params";
import { BABY, LBTC } from "../assets";

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

    // 1 x lbtc = 687873.3766233766 ubbn

    await factoryClient.createPair(
        {
            assetInfos: [
                {native_token: {denom: LBTC}},
                {native_token: {denom: BABY}}
            ],
            pairType: {concentrated: {}},
            // add price scale
            initParams: toBase64(pclWideParams(baby_btc_decimals))
        },
        "auto"
    ).then(console.log)


    // await factoryClient.createPair(
    //     {
    //         assetInfos: [
    //             {native_token: {denom: LBTC}},
    //             {native_token: {denom: BABY}}
    //         ],
    //         pairType: {concentrated: {}},
    //         initParams: toBase64(pclNarrowParams(baby_btc_decimals))
    //     },
    //     "auto"
    // ).then(console.log)

}

main()
