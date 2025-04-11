import deployed from "./deployed.json";
import config from "./config.json";
import {AstroportFactoryClient} from "../sdk/AstroportFactory.client";
import {AstroportPairConcentratedClient} from "../sdk/AstroportPairConcentrated.client";
import {getClientAndAddress} from "./lib";
import {AstroportIncentivesClient} from "../sdk/AstroportIncentives.client";


const toBase64 = (object: any) => {
    return Buffer.from(JSON.stringify(object)).toString('base64');
}

// TODO adapt params
const pclWideParams = (priceScale: number) => {
    return {
        amp: "10",
        gamma: "0.000145",
        mid_fee: "0.0026",
        out_fee: "0.0045",
        fee_gamma: "0.00023",
        repeg_profit_threshold: "0.000002",
        min_price_scale_delta: "0.000146",
        price_scale: priceScale.toString(),
        ma_half_time: 600
    }
}

// TODO adapt params
const pclNarrowParams = (priceScale: number) => {
    return {
        amp: "10",
        gamma: "0.000145",
        mid_fee: "0.0026",
        out_fee: "0.0045",
        fee_gamma: "0.00023",
        repeg_profit_threshold: "0.000002",
        min_price_scale_delta: "0.000146",
        price_scale: priceScale.toString(),
        ma_half_time: 600
    }
}

// TODO adapt params
const pclLSDParams = (priceScale: number) => {
    return {
        amp: "500",
        gamma: "0.01",
        mid_fee: "0.0003",
        out_fee: "0.0045",
        fee_gamma: "0.3",
        repeg_profit_threshold: "0.00000001",
        min_price_scale_delta: "0.0000055",
        price_scale: `${priceScale}`,
        ma_half_time: 600
    }
}

const main = async () => {
    const {client, address} = await getClientAndAddress();

    const poolAddress = "bbn1xut80d09q0tgtch8p0z4k5f88d3uvt8cvtzm5h3tu3tsy4jk9xlsfjc5m7";
    const poolClient = new AstroportPairConcentratedClient(client, address, poolAddress);

    const BABY = "ubbn";
    const USDC = "ibc/65D0BEC6DAD96C7F5043D1E54E54B6BB5D5B3AEC3FF6CEBB75B9E059F3580EA3";
    const BBN_PRICE = 0.098; // Current BBN price in USD
    
    // Get pool config to get price scale
    const config = await poolClient.config();
    if (!config.params) {
        throw new Error("Pool params not found");
    }
    const poolParams = JSON.parse(Buffer.from(config.params, 'base64').toString());
    const priceScale = parseFloat(poolParams.price_scale);
    console.log(`Pool price scale: ${priceScale}`);

    // Function to calculate optimal amounts using only price scale
    function calculateOptimalAmountsSimple(amount: number, isAsset0: boolean): { asset0: number, asset1: number } {
        if (isAsset0) {
            // Given amount of asset0 (BBN), calculate optimal asset1 (USDC)
            const asset1 = amount / priceScale;
            return { asset0: amount, asset1: Math.round(asset1) };
        } else {
            // Given amount of asset1 (USDC), calculate optimal asset0 (BBN)
            const asset0 = amount * priceScale;
            return { asset0: Math.round(asset0), asset1: amount };
        }
    }

    // Example calculations using only price scale
    console.log("\nOptimal amount examples (using price scale only):");
    console.log("Given 1000 USDC (asset1):", calculateOptimalAmountsSimple(1000, false));
    console.log("Given 10000 BBN (asset0):", calculateOptimalAmountsSimple(10000, true));
    
    // Calculate total dollar value for each deposit (in USDC terms)
    const totalDollarValue = 2000; // $2000 worth of liquidity per deposit
    
    // Generate 40 cases with equal dollar values
    for (let i = 20; i <= 40; i++) {
        // Calculate the ratio of USDC to BBN for this test case
        const usdcRatio = (40 - i) / 20; // Goes from 1 to 0
        const bbnRatio = (i - 20) / 20; // Goes from 0 to 1
        
        // Calculate amounts that maintain equal dollar value
        const usdcAmount = Math.round(totalDollarValue * usdcRatio).toString();
        // Convert BBN dollar value to BBN tokens using current price
        const bbnAmount = Math.round((totalDollarValue * bbnRatio) / BBN_PRICE).toString();
        
        console.log(`\nSimulating USDC: ${usdcAmount}, BABY: ${bbnAmount}`);
        const assets = [
            {
                info: {
                    native_token: {
                        denom: BABY
                    }
                },
                amount: bbnAmount
            },
            {
                info: {
                    native_token: {
                        denom: USDC
                    }
                },
                amount: usdcAmount
            }
        ];
        try {
            const result = await poolClient.simulateProvide({assets, slippageTolerance: "0.01"});
            console.log(`Result for [USDC: ${usdcAmount}, BBN: ${bbnAmount}]:`, result);
            
            // Simulate withdrawing the LP shares
            if (result) {
                const withdrawResult = await poolClient.simulateWithdraw({
                    lpAmount: result
                });
                console.log(`Withdraw result for [USDC: ${usdcAmount}, BBN: ${bbnAmount}]:`, withdrawResult);
            }
        } catch (error: any) {
            console.error(`Error simulating [USDC: ${usdcAmount}, BBN: ${bbnAmount}]:`, error.message);
        }

        // Add a small delay between calls to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }}

main()
