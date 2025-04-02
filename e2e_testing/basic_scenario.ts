import deployed from "./bbn-testnet/deployed.json";
import config from "./config.json";
import {AstroportFactoryClient} from "./sdk/AstroportFactory.client";
import {getClientAndAddress} from "./lib";
import {AstroportIncentivesClient} from "./sdk/AstroportIncentives.client";

const toBase64 = (object: any) => {
    return Buffer.from(JSON.stringify(object)).toString('base64');
}

const pclVolatileParams = (priceScale: number) => {
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

    const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);

    // Set decimals in registry
    await client.execute(
        address,
        deployed.coin_registry,
        {
            add: {
                native_coins: [
                    ["uluna", 6],
                    ["ufoo", 6],
                    ["utia", 6],
                    ["usttia", 6],
                ]
            }
        },
        "auto"
    ).then(console.log)

    // Create xyk pair
    await factoryClient.createPair(
        {
            assetInfos: [
                {native_token: {denom: "ufoo"}},
                {native_token: {denom: "uluna"}},
            ],
            pairType: {xyk: {}}
        },
        "auto"
    ).then(console.log)

    // Create volatile PCL pair
    await factoryClient.createPair(
        {
            assetInfos: [
                {native_token: {denom: "uluna"}},
                {native_token: {denom: "ufoo"}}
            ],
            pairType: {concentrated: {}},
            initParams: toBase64(pclVolatileParams(2.5))
        },
        "auto"
    ).then(console.log)

    // Create LSD PCL pair
    await factoryClient.createPair(
        {
            assetInfos: [
                {native_token: {denom: "utia"}},
                {native_token: {denom: "usttia"}}
            ],
            pairType: {concentrated: {}},
            initParams: toBase64(pclLSDParams(1))
        },
        "auto"
    ).then(console.log)

    const lsdPairs = await factoryClient.pairsByAssetInfos(
        {
            assetInfos: [
                {native_token: {denom: "utia"}},
                {native_token: {denom: "usttia"}}
            ]
        }
    )
    console.log(JSON.stringify(lsdPairs, null, 2))

    // Incentivize pair for 3 weeks with 10_000 LUNA
    const incentivesClient = new AstroportIncentivesClient(client, address, deployed.incentives);
    await incentivesClient.incentivize(
        {
            lpToken: lsdPairs[lsdPairs.length - 1].liquidity_token,
            schedule: {
                reward: {info: {native_token: {denom: "uluna"}}, amount: (10_000_000000).toString()},
                duration_periods: 3
            }
        },
        "auto",
        "incentivize LSD pair",
        [{denom: "uluna", amount: (10_000_000000 + parseInt(config.incentivize_fee.fee.amount)).toString()}]
    ).then(console.log)
}

main()
