import deployed from "./deployed.json";
import config from "../config.json";
import {AstroportFactoryClient} from "../sdk/AstroportFactory.client";
import {getClientAndAddress} from "../lib";
import {AstroportIncentivesClient} from "../sdk/AstroportIncentives.client";
import { AstroportPairConcentratedClient } from "../sdk/AstroportPairConcentrated.client";
import { Asset, AssetInfo } from "../sdk/AstroportPairConcentrated.types";
import { Coin, coin } from "@cosmjs/proto-signing";





const main = async () => {
    const {client, address} = await getClientAndAddress();
    
    const token0 = "ubbn";
    const token1 = "bbn1cnx34p82zngq0uuaendsne0x4s5gsm7gpwk2es8zk8rz8tnj938qqyq8f9";

    // const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);
    // const poolInfo = await findPoolByTokens(factoryClient, token0, token1);

    // console.log(poolInfo);
    const pool_contract = "bbn10tjmwp8h2qqm53ke23fxdz2xu75r2p00gzkh0346yt7lqskgjv4svsm23j";

    // if (poolInfo) {
        const poolClient = new AstroportPairConcentratedClient(client, address, pool_contract)

        const assets: Asset[] = [
            {
                info: {
                    native_token: {
                        denom: token0
                    }
                },
                amount: "1000000"
            },
            {
                info: {
                    token: {
                        contract_addr: token1
                    },
                },
                amount: "1000000"
            }
        ];
        const coins: Coin[] = assets
            .filter((asset): asset is Asset & { info: { native_token: { denom: string } } } => 
                'native_token' in asset.info)
            .map(asset => coin(asset.amount, asset.info.native_token.denom));
        
        // Approve CW20 token spending for token1
        await client.execute(
            address,
            token1,
            {
                increase_allowance: {
                    amount: "1000000",
                    spender: pool_contract
                }
            },
            "auto"
        );

        const response = await poolClient.provideLiquidity(
            {assets, autoStake: true},
            "auto",
            undefined,
            coins
        );
        console.log("Provide liquidity response:", response);
    // } else {
    //     console.error("Pool not found for the given tokens.");
    // }
}

main();