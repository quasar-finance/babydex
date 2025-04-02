import { AstroportFactoryClient } from "../sdk/AstroportFactory.client";
import { getClientAndAddress } from "../lib";
import deployed from "./deployed.json";

const toBase64 = (object: any) => {
    return Buffer.from(JSON.stringify(object)).toString('base64');
}

const pclVolatileParams = (priceScale: number) => {
    return {
        amp: "20",
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

const main = async () => {
    const { client, address } = await getClientAndAddress();
    const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);

    // Create the concentrated pool
    await factoryClient.createPair(
        {
            assetInfos: [
                {native_token: {denom: "ibc/3AA6631D204C192DDB757935A4C49A0E83EEEE14AC045E8A180CCB4EE08B6196"}},
                {native_token: {denom: "ibc/4BF4FFBF2B84A71627E009ABFD6A870AA6424D6BA9B419D81F446FA80D3AE655"}}
            ],
            pairType: { concentrated: {} },
            initParams: toBase64(pclVolatileParams(0.8)) // Adjust price scale based on your tokens
        },
        "auto"
    ).then(console.log);

    // Verify the pool was created
    const pairs = await factoryClient.pairsByAssetInfos(
        {
            assetInfos: [
                { native_token: { denom: "ibc/3AA6631D204C192DDB757935A4C49A0E83EEEE14AC045E8A180CCB4EE08B6196" }},
                { native_token: { denom: "ibc/4BF4FFBF2B84A71627E009ABFD6A870AA6424D6BA9B419D81F446FA80D3AE655" }}
            ]
        }
    );
    console.log("Created pool:", JSON.stringify(pairs, null, 2));
}

main().catch(console.error);