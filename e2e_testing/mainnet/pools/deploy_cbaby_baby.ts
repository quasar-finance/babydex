import deployed from "../deployed.json";
import {AstroportFactoryClient} from "../../sdk/AstroportFactory.client";
import {getClientAndAddress} from "../lib";
import { pclLSDParams } from "../pcl_params";
import { BABY, CBABY,  } from "../assets";

const toBase64 = (object: any) => {
    return Buffer.from(JSON.stringify(object)).toString('base64');
}

const main = async () => {
    const {client, address} = await getClientAndAddress();


    const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);


    await factoryClient.createPair(
        {
            assetInfos: [
                {token: {contract_addr: CBABY}},
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
