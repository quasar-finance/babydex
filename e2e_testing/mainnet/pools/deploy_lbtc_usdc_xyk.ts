import deployed from "../deployed.json";
import config from "../config.json";
import {AstroportFactoryClient} from "../../sdk/AstroportFactory.client";
import {getClientAndAddress} from "../lib";
import {AstroportIncentivesClient} from "../../sdk/AstroportIncentives.client";
import { coin, Coin } from "@cosmjs/stargate";
import { AstroportPairClient } from "../../sdk/AstroportPair.client";

const toBase64 = (object: any) => {
    return Buffer.from(JSON.stringify(object)).toString('base64');
}

const main = async () => {
    const {client, address} = await getClientAndAddress();

    const LBTC = "ibc/89EE10FCF78800B572BAAC7080AEFA301B5F3BBC51C5371E907EB129C5B900E7";
    const USDC = "ibc/65D0BEC6DAD96C7F5043D1E54E54B6BB5D5B3AEC3FF6CEBB75B9E059F3580EA3";
    const BABY = "ubbn"

    const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);


    // Create xyk-like PCL pairs
     // Create xyk pairs
    //  await factoryClient.createPair(
    //     {
    //         assetInfos: [
    //             {native_token: {denom: LBTC}},
    //             {native_token: {denom: USDC}},
    //         ],
    //         pairType: {xyk: {}}
    //     },
    //     "auto"
    // ).then(console.log)

    const poolClient = new AstroportPairClient(client, address, "bbn1kghjaevh56r347v2luwngsdd2qg5hqyhzm20wgp6hllz3eteuv7q27q26f");

       const assets = [
            {
                info: {
                    native_token: {
                        denom: LBTC
                    }
                },
                amount: "9920"
            },
            {
                info: {
                    native_token: {
                        denom: USDC
                    }
                },
                amount: "8000000"
            },
        ];
        const coins: Coin[] = assets.map(asset => {
            const microAmount = asset.amount; // Already in micro-denom
            console.log(`Converting ${asset.info.native_token.denom}: ${asset.amount} (micro-denom)`);
            return coin(microAmount, asset.info.native_token.denom);
        }).sort((a, b) => a.denom.localeCompare(b.denom));
        
        const response = await poolClient.provideLiquidity(
            {assets, autoStake: true},
            "auto",
            undefined,
            coins
        );
        console.log("Provide liquidity response:", response);
}

main()
