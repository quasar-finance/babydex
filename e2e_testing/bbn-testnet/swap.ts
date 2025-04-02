import deployed from "./deployed.json";
import tokens from "./tokens.json"; // Assuming this file contains token decimal information
import { AstroportRouterClient } from "../sdk/AstroportRouter.client";
import { AstroportFactoryClient } from "../sdk/AstroportFactory.client";
import { getClientAndAddress } from "../lib";
import { Coin, coin } from "@cosmjs/proto-signing";
import { SwapOperation } from "../sdk/AstroportRouter.types";

async function findPairAddress(factoryClient: AstroportFactoryClient, denom1: string, denom2: string): Promise<string | undefined> {
    const pairs = await factoryClient.pairs({});
    for (const pair of pairs) {
        const assets = pair.asset_infos;
        const isMatch = assets.every(asset => {
            if ('native_token' in asset) {
                return asset.native_token.denom === denom1 || asset.native_token.denom === denom2;
            }
            return false;
        });

        if (isMatch && assets.length === 2) {
            return pair.contract_addr;
        }
    }
    return undefined;
}

function getTokenDecimals(denom: string): number {
    const token = tokens.tokens.find(t => t.denom === denom);
    return token ? token.decimals : 0;
}

function adjustAmount(amount: string, decimals: number): string {
    return (BigInt(amount) * BigInt(10 ** decimals)).toString();
}

const main = async () => {
    const { client, address } = await getClientAndAddress();

    const routerAddress = deployed.router;
    const baseOfferAmount = "12";
    // insane slippage because test pools
    const baseMinimumReceive = "5";

    const token0 = "ibc/3AA6631D204C192DDB757935A4C49A0E83EEEE14AC045E8A180CCB4EE08B6196";
    const token1 = "ibc/4BF4FFBF2B84A71627E009ABFD6A870AA6424D6BA9B419D81F446FA80D3AE655";

    const decimals0 = getTokenDecimals(token0);
    const decimals1 = getTokenDecimals(token1);

    const offerAmount = adjustAmount(baseOfferAmount, decimals0);
    const minimumReceive = adjustAmount(baseMinimumReceive, decimals1);

    const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);
    const pairAddress = "bbn1e40kslczvwzset7c20p92pg3hzhuesmsw7x4suwd53ylxjfk6e5sw8j642" // await findPairAddress(factoryClient, token0, token1);

    if (!pairAddress) {
        console.error("Pair not found for the given token denoms.");
        return;
    }

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
        pair_address: pairAddress
    };

    const routerClient = new AstroportRouterClient(client, address, routerAddress);

    try {
        const response = await routerClient.executeSwapOperations(
            {
                maxSpread: "0.3",
                minimumReceive,
                operations: [swapOperation],
                to: address
            },
            "auto",
            undefined,
            [coin(offerAmount, swapOperation.offer_asset_info.native_token.denom)]
        );

        console.log("Swap transaction successful:", response.transactionHash);
    } catch (error) {
        console.error("Swap transaction failed:", error);
    }
}

main().catch(console.error);
