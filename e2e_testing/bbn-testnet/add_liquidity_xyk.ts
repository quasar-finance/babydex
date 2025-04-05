import deployed from "./deployed.json";
import config from "../config.json";
import {AstroportFactoryClient} from "../sdk/AstroportFactory.client";
import {getClientAndAddress} from "../lib";
import {AstroportIncentivesClient} from "../sdk/AstroportIncentives.client";
import { AstroportPairConcentratedClient } from "../sdk/AstroportPairConcentrated.client";
import { Asset, AssetInfo } from "../sdk/AstroportPairConcentrated.types";
import { Coin, coin } from "@cosmjs/proto-signing";
import { AstroportPairClient } from "../sdk/AstroportPair.client";


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
    
    const poolClient = new AstroportPairClient(
        client, 
        address, 
        "bbn12v03wc7yza57fspuperwc2f8s3yzrs922ayf3cychzhmwk3p4exshxzq4e"
    );

    // Query pool state to get token denoms
    const poolState = await poolClient.pool();
    console.log("Current pool state:", poolState);

    // Extract token denoms from pool assets
    const token0Denom = 'native_token' in poolState.assets[0].info 
        ? poolState.assets[0].info.native_token.denom 
        : '';
    const token1Denom = 'native_token' in poolState.assets[1].info 
        ? poolState.assets[1].info.native_token.denom 
        : '';

    console.log("Token0 denom:", token0Denom);
    console.log("Token1 denom:", token1Denom);

    // Amount of token0 you want to provide - use BigInt for precise integer calculations
    const token0Amount = BigInt("1000000000000000000"); // Adjust this to your desired amount

    // Calculate the optimal ratio using BigInt to maintain precision
    const [asset0, asset1] = poolState.assets;
    const poolRatio = Number(asset0.amount) / Number(asset1.amount);
    console.log("Current pool ratio:", poolRatio);

    // Calculate optimal amount of token1 based on token0 amount
    // Round to nearest integer since we can't send fractional tokens
    const token1Amount = BigInt(Math.round(Number(token0Amount) / poolRatio));

    console.log("Optimal amounts to provide:");
    console.log(`Token0 (${token0Denom}): ${token0Amount.toString()}`);
    console.log(`Token1 (${token1Denom}): ${token1Amount.toString()}`);

    // Prepare assets for liquidity provision
    const assets = [
        {
            info: {
                native_token: {
                    denom: token0Denom
                }
            },
            amount: token0Amount.toString()
        },
        {
            info: {
                native_token: {
                    denom: token1Denom
                }
            },
            amount: token1Amount.toString()
        }
    ];

    // Prepare coins for the transaction
    const coins: Coin[] = assets.map(asset => 
        coin(asset.amount, asset.info.native_token.denom)
    );

    // Provide liquidity with default slippage tolerance (0.5%)
    try {
        const response = await poolClient.provideLiquidity(
            {
                assets,
                slippageTolerance: "0.005", // 0.5% default slippage tolerance
                autoStake: true
            },
            "auto",
            undefined,
            coins
        );
        console.log("Provide liquidity response:", response);
    } catch (error) {
        console.error("Error providing liquidity:", error);
    }
}

main().catch(console.error);