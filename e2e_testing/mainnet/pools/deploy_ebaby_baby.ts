import deployed from "../deployed.json";
import config from "../config.json";
import {AstroportFactoryClient} from "../../sdk/AstroportFactory.client";
import {getClientAndAddress} from "../lib";
import {AstroportIncentivesClient} from "../../sdk/AstroportIncentives.client";
import { pclLSDParams, pclNarrowParams, pclWideParams } from "../pcl_params";
import { coin, Coin } from "@cosmjs/stargate";
import { BABY, EBABY } from "../assets";

const toBase64 = (object: any) => {
    return Buffer.from(JSON.stringify(object)).toString('base64');
}

const main = async () => {
    const {client, address} = await getClientAndAddress();


    const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);


    await factoryClient.createPair(
        {
            assetInfos: [
                {token: {contract_addr: EBABY}},
                {native_token: {denom: BABY}}
            ],
            pairType: {concentrated: {}},
            // add price scale
            initParams: toBase64(pclLSDParams(1.0.toString()))
        },
        "auto"
    ).then(console.log)
}

main()
