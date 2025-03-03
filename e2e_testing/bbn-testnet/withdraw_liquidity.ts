import deployed from "./deployed.json";
import { AstroportFactoryClient } from "../sdk/AstroportFactory.client";
import { getClientAndAddress } from "../lib";
import { AstroportPairConcentratedClient } from "../sdk/AstroportPairConcentrated.client";
import { Coin, coin } from "@cosmjs/proto-signing";
import { AstroportIncentivesClient } from "../sdk/AstroportIncentives.client";

interface PoolInfo {
    contractAddr: string;
    liquidityToken: string;
}

async function findPoolByLpToken(
    factoryClient: AstroportFactoryClient,
    lpToken: string
): Promise<PoolInfo | undefined> {
    const pairInfo = await factoryClient.pairByLpToken({ lpToken });
    if (pairInfo) {
        return {
            contractAddr: pairInfo.contract_addr,
            liquidityToken: pairInfo.liquidity_token
        };
    }
    return undefined;
}

const main = async () => {
    const { client, address } = await getClientAndAddress();

    // Replace with actual LP token or pool address
    const lpToken = undefined;
    const poolAddress = "bbn1vkh603t635w73yndx3x92f9d9ykk7etr7fs274d9q0qdeeut0qhqcsz3qd";
    const amountToWithdraw = "2101902"; // Amount of LP tokens to withdraw

    const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);
    let poolInfo: PoolInfo | undefined;

    if (lpToken) {
        poolInfo = await findPoolByLpToken(factoryClient, lpToken);
    } else if (poolAddress) {
        const poolClient = new AstroportPairConcentratedClient(client, address, poolAddress);
        const poolConfig = await poolClient.pair();
        poolInfo = { 
            contractAddr: poolAddress, 
            liquidityToken: poolConfig.liquidity_token
        }
    }

    console.log(poolInfo);

    if (poolInfo) {
        const poolClient = new AstroportPairConcentratedClient(client, address, poolInfo.contractAddr);

        // Query LP token balance, this is 0 if we have autostaked our liquidity
        const balanceResponse = await client.queryContractSmart(poolInfo.liquidityToken, {
            balance: { address }
        });
        console.log("LP token balance:", balanceResponse.balance);

        // Query staked balance in incentives contract
        const incentivesClient = new AstroportIncentivesClient(client, address, deployed.incentives);
        const stakedBalance = await incentivesClient.queryDeposit({
            lpToken: poolInfo.liquidityToken,
            user: address
        });
        console.log("Staked LP token balance:", stakedBalance);

        // If tokens are staked, first withdraw them from incentives
        if (parseInt(stakedBalance) > 0) {
            const withdrawResponse = await incentivesClient.withdraw({
                lpToken: poolInfo.liquidityToken,
                amount: amountToWithdraw
            });
            console.log("Unstake from incentives response:", withdrawResponse);
        }

        // Simulate the withdrawal to see expected returns
        const response1 = await poolClient.simulateWithdraw({
            lpAmount: amountToWithdraw
        });

        console.log("Withdraw liquidity response:", response1);

        // Create the withdraw_liquidity message that will be passed along with the CW20 send
        const withdrawMsg = {
            withdraw_liquidity: {}
        };

        // Create the CW20 send message
        const sendMsg = {
            send: {
                contract: poolInfo.contractAddr,
                amount: amountToWithdraw,
                msg: Buffer.from(JSON.stringify(withdrawMsg)).toString('base64')
            }
        };

        // Execute the send message on the LP token contract
        const response2 = await client.execute(
            address, 
            poolInfo.liquidityToken, 
            sendMsg, 
            "auto"
        );
        console.log("Withdraw liquidity transaction:", response2);
    } else {
        console.error("Pool not found for the given LP token or pool address.");
    }
}

main(); 