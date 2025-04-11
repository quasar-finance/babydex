import deployed from "./deployed.json";
import config from "../config.json";
import {AstroportFactoryClient} from "../sdk/AstroportFactory.client";
import {AstroportPairClient} from "../sdk/AstroportPair.client";
import {getClientAndAddress} from "./lib";
import {AstroportIncentivesClient} from "../sdk/AstroportIncentives.client";
import { AstroportPairConcentratedClient } from "../sdk/AstroportPairConcentrated.client";
import { AstroportRouterClient } from "../sdk/AstroportRouter.client";
import { Asset, AssetInfo } from "../sdk/AstroportPairConcentrated.types";
import { Coin, coin } from "@cosmjs/proto-signing";


interface PoolInfo {
    contractAddr: string;
    liquidityToken: string;
}

const main = async () => {
    const {client, address} = await getClientAndAddress();
    
    const token0 = "ubbn";
    const token1 = "ibc/65D0BEC6DAD96C7F5043D1E54E54B6BB5D5B3AEC3FF6CEBB75B9E059F3580EA3";

    // bbn1r4x3lvn20vpls2ammp4ch5z08nge6h77p43ktl04efptgqxgl0qsxnwehd
    // bbn1yum4v0v5l92jkxn8xpn9mjg7wuldk784ctg424ue8gqvdp88qzlqjpr05x
    const poolAddress = "bbn1qjn06jt7zjhdqxgud07nylkpgnaurq6x6vad38vztwxec4rr5ntsnn4dd3";
        const poolClient = new AstroportPairClient(client, address, poolAddress);

        // const baby_usdc = 0.07526
        // const btc_usd = 81611;
        // const baby_btc = baby_usdc / btc_usd
        // const baby_btc_decimals = Number(baby_btc).toFixed(10);
        // console.log('Baby BTC price:', baby_btc_decimals);

        // const assets = [
        //     {
        //         info: {
        //             native_token: {
        //                 denom: token0
        //             }
        //         },
        //         amount: (5 * 1e6).toString() // 2 UBN with 6 decimals
        //     },
        //     {
        //         info: {
        //             native_token: {
        //                 denom: token1
        //             }
        //         },
        //         amount: Math.floor(5 * baby_btc * 1e8).toString() // 2 * baby_btc with 8 decimals
        //     },
        // ];
        // console.log('Asset amounts:', assets);
        // const coins: Coin[] = assets.map(asset => {
        //     const decimals = asset.info.native_token.denom === token0 ? 6 : 8;
        //     const microAmount = asset.amount; // Already in micro-denom
        //     console.log(`Converting ${asset.info.native_token.denom}: ${asset.amount} (micro-denom)`);
        //     return coin(microAmount, asset.info.native_token.denom);
        // }).sort((a, b) => a.denom.localeCompare(b.denom));
        // console.log('Final coins:', coins);
        
        // const response = await poolClient.provideLiquidity(
        //     {assets, autoStake: true},
        //     "auto",
        //     undefined,
        //     coins
        // );
        // console.log("Provide liquidity response:", response);

        const swapOperation = {
            offer_asset_info: {
                native_token: {
                    denom: token0
                }
            },
            ask_asset_info: {
                native_token: {
                    denom: token1
                }
            },
            pair_address: poolAddress
        };
    
        const routerClient = new AstroportRouterClient(client, address, deployed.router);
    
        try {
            const response = await routerClient.executeSwapOperations(
                {
                    maxSpread: "0.5",
                    operations: [swapOperation],
                    to: address
                },
                "auto",
                undefined,
                [coin(70000, swapOperation.offer_asset_info.native_token.denom)]
            );
    
            console.log("Swap transaction successful:", response.transactionHash);
        } catch (error) {
            console.error("Swap transaction failed:", error);
        }
    // } else {
    //     console.error("Pool not found for the given tokens.");
    // }
}

main();