import deployed from "../deployed.json";
import config from "../config.json";
import {AstroportFactoryClient} from "../../sdk/AstroportFactory.client";
import {getClientAndAddress} from "../lib";
import {AstroportIncentivesClient} from "../../sdk/AstroportIncentives.client";
import { coin, Coin } from "@cosmjs/stargate";
import { AstroportPairClient } from "../../sdk/AstroportPair.client";
import { SolvBTC, USDC } from "../assets";
import { pclNarrowParams, pclWideParams } from "../pcl_params";

const toBase64 = (object: any) => {
    return Buffer.from(JSON.stringify(object)).toString('base64');
}

const main = async () => {
    const {client, address} = await getClientAndAddress();

    const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);

    // calculate price scales like 1 x\[0] = price_scale * x\[1].
    const btc_usd = 85005;


    await factoryClient.createPair(
        {
            assetInfos: [
                {native_token: {denom: SolvBTC}},
                {native_token: {denom: USDC}}
            ],
            pairType: {concentrated: {}},
            // add price scale
            initParams: toBase64(pclWideParams(btc_usd.toString()))
        },
        "auto"
    ).then(console.log)

    await factoryClient.createPair(
        {
            assetInfos: [
                {native_token: {denom: SolvBTC}},
                {native_token: {denom: USDC}}
            ],
            pairType: {concentrated: {}},
            // add price scale
            initParams: toBase64(pclNarrowParams(btc_usd.toString()))
        },
        "auto"
    ).then(console.log)
}

main()
