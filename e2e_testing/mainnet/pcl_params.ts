export const pclWideParams = (priceScale: string) => {
    return {
        amp: "12",
        gamma: "0.000215",
        mid_fee: "0.0022",
        out_fee: "0.01",
        fee_gamma: "0.000235",
        repeg_profit_threshold: "0.000002",
        min_price_scale_delta: "0.000146",
        price_scale: priceScale,
        ma_half_time: 600
    }
}

export const pclNarrowParams = (priceScale: string) => {
    return {
        amp: "75",
        gamma: "0.0003",
        mid_fee: "0.0025",
        out_fee: "0.01",
        fee_gamma: "0.000285",
        repeg_profit_threshold: "0.000002",
        min_price_scale_delta: "0.000146",
        price_scale: priceScale,
        ma_half_time: 600
    }
}

export const pclLSDParams = (priceScale: string) => {
    return {
        amp: "950",
        gamma: "0.015",
        mid_fee: "0.00025",
        out_fee: "0.004",
        fee_gamma: "0.4",
        repeg_profit_threshold: "0.000000025",
        min_price_scale_delta: "0.000005",
        price_scale: priceScale,
        ma_half_time: 600
    }
}