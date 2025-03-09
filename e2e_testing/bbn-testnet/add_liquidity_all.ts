import deployed from "./deployed.json";
import tokens from "./tokens.json";
import { AstroportFactoryClient } from "../sdk/AstroportFactory.client";
import { getClientAndAddress } from "../lib";
import { AstroportPairConcentratedClient } from "../sdk/AstroportPairConcentrated.client";
import { Coin, coin } from "@cosmjs/proto-signing";

// Amount to add for each token (before decimal adjustment)
const BASE_AMOUNT = 1;

const SHARE_DECIMALS = 6;

// Create a map of token denom to its decimal places
function createTokenDecimalMap(): Map<string, number> {
    const tokenMap = new Map<string, number>();
    tokens.tokens.forEach(token => {
        tokenMap.set(token.denom, token.decimals);
    });
    return tokenMap;
}

// Adjust amount based on token decimals
function adjustAmount(amount: number, decimals: number): bigint {
    return BigInt(Math.floor(amount * 10 ** decimals));
}

// Reverse decimal adjustment, converting from BigInt with decimals to Number
function reverseAdjustAmount(amount: bigint, decimals: number): number {
    return Number(amount) / (10 ** decimals);
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

        const cumulative_prices = await poolClient.cumulativePrices();
        const config = await poolClient.config();

        // The params are stored in Binary format and need to be decoded
        const params = config.params ? JSON.parse(Buffer.from(config.params, 'base64').toString()) : null;

        // Now params contains the ConcentratedPoolConfig structure:
        console.log("Decoded params:", {
            amp: params.amp,
            gamma: params.gamma,
            mid_fee: params.mid_fee,
            out_fee: params.out_fee,
            fee_gamma: params.fee_gamma,
            repeg_profit_threshold: params.repeg_profit_threshold,
            min_price_scale_delta: params.min_price_scale_delta,
            price_scale: params.price_scale,
            ma_half_time: params.ma_half_time,
            fee_share: params.fee_share
        });

        // Get the current pool ratio accounting for price_scale
        const poolAmount0 = BigInt(cumulative_prices.assets[0].amount);
        const poolAmount1 = BigInt(cumulative_prices.assets[1].amount);
        const priceScale = Number(params.price_scale);

        // The optimal ratio is poolAmount0 : (poolAmount1 * priceScale)
        const optimalRatio = reverseAdjustAmount(poolAmount0, decimals0) / 
                    (reverseAdjustAmount(poolAmount1, decimals1) * priceScale) ;

// Now adjust your assets to match this ratio
const adjustedAssets = [
    {
        info: { native_token: { denom: token0 } },
        amount: adjustAmount(BASE_AMOUNT, decimals0).toString()
    },
    {
        info: { native_token: { denom: token1 } },
        amount: adjustAmount((BASE_AMOUNT * optimalRatio), decimals1).toString()
    }
];

        const coins: Coin[] = adjustedAssets.map(asset => 
            coin(asset.amount, asset.info.native_token.denom)
        );

        try {
            // First simulate the provide liquidity operation
            const simulation = await poolClient.simulateProvide(
                { 
                    assets: adjustedAssets, 
                    slippageTolerance: "0.04" 
                }
            );
            console.log(`Simulation for ${token0}-${token1} successful:`, {
                expectedLpTokens: simulation,
            });

            // If simulation succeeds, proceed with actual transaction
            const response = await poolClient.provideLiquidity(
                { 
                    assets: adjustedAssets, 
                    autoStake: true, 
                    minLpToReceive: "1", 
                    slippageTolerance: "0.04" 
                },
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