// deploy testnet pools with mainnet paramsimport deployed from "./deployed.json";
import config from "../config.json";
import {AstroportFactoryClient} from "../sdk/AstroportFactory.client";
import {getClientAndAddress} from "../lib";
import {AstroportIncentivesClient} from "../sdk/AstroportIncentives.client";
import deployed from "./deployed.json";

const toBase64 = (object: any) => {
    return Buffer.from(JSON.stringify(object)).toString('base64');
}

const pclVolatileParams = (priceScale: number) => {
    return {
        amp: "12",
        gamma: "0.000215",
        mid_fee: "0.0022",
        out_fee: "0.0045",
        fee_gamma: "0.000235",
        repeg_profit_threshold: "0.000002",
        min_price_scale_delta: "0.000146",
        price_scale: priceScale.toString(),
        ma_half_time: 600
    }
}


const pclwideParams = (priceScale: number) => {
    return {
        amp: "75",
        gamma: "0.0003",
        mid_fee: "0.0025",
        out_fee: "0.0045",
        fee_gamma: "0.000285",
        repeg_profit_threshold: "0.000002",
        min_price_scale_delta: "0.000146",
        price_scale: `${priceScale}`,
        ma_half_time: 600
    }
}

const pclLSDParams = (priceScale: number) => {
    return {
        amp: "950",
        gamma: "0.015",
        mid_fee: "0.000275",
        out_fee: "0.004",
        fee_gamma: "0.4",
        repeg_profit_threshold: "0.000000025",
        min_price_scale_delta: "0.000005",
        price_scale: `${priceScale}`,
        ma_half_time: 600
    }
}

const main = async () => {
    const {client, address} = await getClientAndAddress();

    const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);

    // Create volatile PCL pair
    // await factoryClient.createPair(
    //     {
    //         assetInfos: [
    //             {native_token: {denom: "ibc/241F1FFE4117C31D7DFC2A91C026F083FCEB6868C169BA5002FF0B3E17B88EDF"}},
    //             {native_token: {denom: "ibc/53BE513F8FEA2E000E8522CD60383AFA431F0F655EC05A1D56B7428836F3F314"}}
    //         ],
    //         pairType: {concentrated: {}},
    //         initParams: toBase64(pclVolatileParams(1))
    //     },
    //     "auto"
    // ).then(console.log)

    // await factoryClient.createPair(
    //     {
    //         assetInfos: [
    //             {native_token: {denom: "ibc/241F1FFE4117C31D7DFC2A91C026F083FCEB6868C169BA5002FF0B3E17B88EDF"}},
    //             {native_token: {denom: "ibc/53BE513F8FEA2E000E8522CD60383AFA431F0F655EC05A1D56B7428836F3F314"}}
    //         ],
    //         pairType: {concentrated: {}},
    //         initParams: toBase64(pclwideParams(1))
    //     },
    //     "auto"
    // ).then(console.log)

    // // Create LSD PCL pair
    // await factoryClient.createPair(
    //     {
    //         assetInfos: [
    //             {native_token: {denom: "ibc/241F1FFE4117C31D7DFC2A91C026F083FCEB6868C169BA5002FF0B3E17B88EDF"}},
    //             {native_token: {denom: "ibc/53BE513F8FEA2E000E8522CD60383AFA431F0F655EC05A1D56B7428836F3F314"}}
    //         ],
    //         pairType: {concentrated: {}},
    //         initParams: toBase64(pclLSDParams(1))
    //     },
    //     "auto"
    // ).then(console.log)

    const lsdPairs = await factoryClient.pairsByAssetInfos(
        {
            assetInfos: [
                {native_token: {denom: "ibc/241F1FFE4117C31D7DFC2A91C026F083FCEB6868C169BA5002FF0B3E17B88EDF"}},
                {native_token: {denom: "ibc/53BE513F8FEA2E000E8522CD60383AFA431F0F655EC05A1D56B7428836F3F314"}}
            ]
        }
    )
    console.log(JSON.stringify(lsdPairs, null, 2))
}

main()
