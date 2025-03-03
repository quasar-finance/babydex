import deployed from "./deployed.json";
import tokens from "./tokens.json";
import { AstroportFactoryClient } from "../sdk/AstroportFactory.client";
import { getClientAndAddress } from "../lib";
import { AstroportPairConcentratedClient } from "../sdk/AstroportPairConcentrated.client";
import { Coin, coin } from "@cosmjs/proto-signing";

// Amount to add for each token (before decimal adjustment)
const BASE_AMOUNT = "10";


// Create a map of token denom to its decimal places
function createTokenDecimalMap(): Map<string, number> {
    const tokenMap = new Map<string, number>();
    tokens.tokens.forEach(token => {
        tokenMap.set(token.denom, token.decimals);
    });
    return tokenMap;
}

// Adjust amount based on token decimals
function adjustAmount(amount: string, decimals: number): string {
    return BigInt(amount) * BigInt(10 ** decimals) + "";
}

const main = async () => {
    const { client, address } = await getClientAndAddress();
    const tokenDecimals = createTokenDecimalMap();
    const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);
    
    // Get all pairs
    const pairs = await factoryClient.pairs({});
    console.log(`Found ${pairs.length} pairs`);
    

    for (const pair of pairs) {
        const assets = pair.asset_infos;
        

        const token0 = (assets[0] as { native_token: { denom: string } }).native_token.denom;
        const token1 = (assets[1] as { native_token: { denom: string } }).native_token.denom;

        const decimals0 = tokenDecimals.get(token0);
        const decimals1 = tokenDecimals.get(token1);

        if (!decimals0 || !decimals1) {
            console.log(`Skipping pair ${token0}-${token1}: Missing decimal information`);
            continue;
        }

        const pairTypeString = Object.keys(pair.pair_type)[0];
        console.log(`Adding liquidity to pool ${token0}-${token1}, ${pairTypeString}`);
        console.log(`Decimals: ${token0}=${decimals0}, ${token1}=${decimals1}`);

        const poolClient = new AstroportPairConcentratedClient(
            client,
            address,
            pair.contract_addr
        );

        const adjustedAssets = [
            {
                info: { native_token: { denom: token0 } },
                amount: adjustAmount(BASE_AMOUNT, decimals0)
            },
            {
                info: { native_token: { denom: token1 } },
                amount: adjustAmount(BASE_AMOUNT, decimals1)
            }
        ];

        const coins: Coin[] = adjustedAssets.map(asset => 
            coin(asset.amount, asset.info.native_token.denom)
        );

        try {
            const response = await poolClient.provideLiquidity(
                { assets: adjustedAssets, autoStake: true, minLpToReceive: "1", slippageTolerance: "50.0" },
                "auto",
                undefined,
                coins
            );
            console.log(`Successfully added liquidity to ${token0}-${token1}`);
            console.log("Transaction hash:", response.transactionHash);
        } catch (error) {
            console.error(`Failed to add liquidity to ${token0}-${token1}:`, error);
        }
    }
}

main().catch(console.error); 