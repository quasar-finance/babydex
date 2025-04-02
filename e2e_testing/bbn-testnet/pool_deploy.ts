import deployed from "./deployed.json";
import config from "../config.json";
import {AstroportFactoryClient} from "../sdk/AstroportFactory.client";
import {getClientAndAddress} from "../lib";
import {AstroportIncentivesClient} from "../sdk/AstroportIncentives.client";

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
                    ["ibc/2278567FFA6D754BDD8C159CE1770D8AF27649BFB58E5132CF530460591E479D", 18],
                    ["ibc/241F1FFE4117C31D7DFC2A91C026F083FCEB6868C169BA5002FF0B3E17B88EDF", 6],
                    ["ibc/3AA6631D204C192DDB757935A4C49A0E83EEEE14AC045E8A180CCB4EE08B6196", 18],
                    ["ibc/4BF4FFBF2B84A71627E009ABFD6A870AA6424D6BA9B419D81F446FA80D3AE655", 18],
                    ["ibc/53BE513F8FEA2E000E8522CD60383AFA431F0F655EC05A1D56B7428836F3F314", 6],
                    ["ibc/DC9A0BC30A89A4C767CA2DA3BA1A4B1AB40F6666E720BB4F14213545216C86D8", 6],
                    ["ubbn", 6]
                ]
            }
        },
        "auto"
    ).then(console.log)

    // Create xyk pairs
    await factoryClient.createPair(
        {
            assetInfos: [
                {native_token: {denom: "ibc/2278567FFA6D754BDD8C159CE1770D8AF27649BFB58E5132CF530460591E479D"}},
                {native_token: {denom: "ibc/241F1FFE4117C31D7DFC2A91C026F083FCEB6868C169BA5002FF0B3E17B88EDF"}},
            ],
            pairType: {xyk: {}}
        },
        "auto"
    ).then(console.log)

    await factoryClient.createPair(
        {
            assetInfos: [
                {native_token: {denom: "ibc/2278567FFA6D754BDD8C159CE1770D8AF27649BFB58E5132CF530460591E479D"}},
                {native_token: {denom: "ibc/4BF4FFBF2B84A71627E009ABFD6A870AA6424D6BA9B419D81F446FA80D3AE655"}},
            ],
            pairType: {xyk: {}}
        },
        "auto"
    ).then(console.log)

    await factoryClient.createPair(
        {
            assetInfos: [
                {native_token: {denom: "ibc/2278567FFA6D754BDD8C159CE1770D8AF27649BFB58E5132CF530460591E479D"}},
                {native_token: {denom: "ubbn"}},
            ],
            pairType: {xyk: {}}
        },
        "auto"
    ).then(console.log)

    // Create volatile PCL pair
    await factoryClient.createPair(
        {
            assetInfos: [
                {native_token: {denom: "ibc/3AA6631D204C192DDB757935A4C49A0E83EEEE14AC045E8A180CCB4EE08B6196"}},
                {native_token: {denom: "ibc/4BF4FFBF2B84A71627E009ABFD6A870AA6424D6BA9B419D81F446FA80D3AE655"}}
            ],
            pairType: {concentrated: {}},
            initParams: toBase64(pclVolatileParams(2.5))
        },
        "auto"
    ).then(console.log)

    await factoryClient.createPair(
        {
            assetInfos: [
                {native_token: {denom: "ibc/3AA6631D204C192DDB757935A4C49A0E83EEEE14AC045E8A180CCB4EE08B6196"}},
                {native_token: {denom: "ibc/DC9A0BC30A89A4C767CA2DA3BA1A4B1AB40F6666E720BB4F14213545216C86D8"}}
            ],
            pairType: {concentrated: {}},
            initParams: toBase64(pclVolatileParams(2.5))
        },
        "auto"
    ).then(console.log)

    await factoryClient.createPair(
        {
            assetInfos: [
                {native_token: {denom: "ibc/3AA6631D204C192DDB757935A4C49A0E83EEEE14AC045E8A180CCB4EE08B6196"}},
                {native_token: {denom: "ubbn"}}
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
                {native_token: {denom: "ibc/241F1FFE4117C31D7DFC2A91C026F083FCEB6868C169BA5002FF0B3E17B88EDF"}},
                {native_token: {denom: "ibc/4BF4FFBF2B84A71627E009ABFD6A870AA6424D6BA9B419D81F446FA80D3AE655"}}
            ],
            pairType: {concentrated: {}},
            initParams: toBase64(pclLSDParams(1))
        },
        "auto"
    ).then(console.log)

    const lsdPairs = await factoryClient.pairsByAssetInfos(
        {
            assetInfos: [
                {native_token: {denom: "ibc/241F1FFE4117C31D7DFC2A91C026F083FCEB6868C169BA5002FF0B3E17B88EDF"}},
                {native_token: {denom: "ibc/4BF4FFBF2B84A71627E009ABFD6A870AA6424D6BA9B419D81F446FA80D3AE655"}}
            ]
        }
    )
    console.log(JSON.stringify(lsdPairs, null, 2))

    // Incentivize pair for 5 weeks with 10_000 ibc/2278567FFA6D754BDD8C159CE1770D8AF27649BFB58E5132CF530460591E479D
    const incentivesClient = new AstroportIncentivesClient(client, address, deployed.incentives);
    await incentivesClient.incentivize(
        {
            lpToken: lsdPairs[lsdPairs.length - 1].liquidity_token,
            schedule: {
                reward: {info: {native_token: {denom: "ibc/2278567FFA6D754BDD8C159CE1770D8AF27649BFB58E5132CF530460591E479D"}}, amount: (10_000_000000).toString()},
                duration_periods: 5
            }
        },
        "auto",
        "incentivize LSD pair",
        [{denom: "ibc/2278567FFA6D754BDD8C159CE1770D8AF27649BFB58E5132CF530460591E479D", amount: (10_000_000000).toString()}, {denom: "ubbn", amount: parseInt(config.incentivize_fee.fee.amount).toString()}]
    ).then(console.log)
    
    // Update config with new incentives address
    await factoryClient.updateConfig({
        incentivesAddress: deployed.incentives,
    }, "auto").then(console.log);}

main()
