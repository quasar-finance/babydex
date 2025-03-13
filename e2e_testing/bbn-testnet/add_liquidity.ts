import deployed from "./deployed.json";
import config from "../config.json";
import {AstroportFactoryClient} from "../sdk/AstroportFactory.client";
import {getClientAndAddress} from "../lib";
import {AstroportIncentivesClient} from "../sdk/AstroportIncentives.client";
import { AstroportPairConcentratedClient } from "../sdk/AstroportPairConcentrated.client";
import { Asset, AssetInfo } from "../sdk/AstroportPairConcentrated.types";
import { Coin, coin } from "@cosmjs/proto-signing";


interface PoolInfo {
    contractAddr: string;
    liquidityToken: string;
}

async function findPoolByTokens(
    factoryClient: AstroportFactoryClient,
    denom1: string,
    denom2: string
): Promise<PoolInfo | undefined> {
    const pairs = await factoryClient.pairs({});
    
    for (const pair of pairs) {
        const assets = pair.asset_infos;
        const isMatch = assets.every(asset => {
            if ('native_token' in asset) {
                return asset.native_token.denom === denom1 || 
                       asset.native_token.denom === denom2;
            }
            return false;
        });
        
        if (isMatch && assets.length === 2) {
            return {
                contractAddr: pair.contract_addr,
                liquidityToken: pair.liquidity_token
            };
        }
    }
    
    return undefined;
}

const main = async () => {
    const {client, address} = await getClientAndAddress();
    
    const token0 = "ibc/3AA6631D204C192DDB757935A4C49A0E83EEEE14AC045E8A180CCB4EE08B6196";
    const token1 = "ibc/4BF4FFBF2B84A71627E009ABFD6A870AA6424D6BA9B419D81F446FA80D3AE655";

    // const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);
    // const poolInfo = await findPoolByTokens(factoryClient, token0, token1);

    // console.log(poolInfo);

    // if (poolInfo) {
        const poolClient = new AstroportPairConcentratedClient(client, address, "bbn1e40kslczvwzset7c20p92pg3hzhuesmsw7x4suwd53ylxjfk6e5sw8j642")

        const assets = [
            {
                info: {
                    native_token: {
                        denom: token0
                    }
                },
                amount: "1000000000000000000000000"
            },
            {
                info: {
                    native_token: {
                        denom: token1
                    }
                },
                amount: "1000000000000000000000000"
            }
        ];
        const coins: Coin[] = assets.map((asset => { return coin(asset.amount, asset.info.native_token.denom)}));
        
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