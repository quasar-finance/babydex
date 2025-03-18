SELECT
    p.pool_address,
    p.height,
    p.token0_denom,
    p.token0_balance,
    p.token1_denom,
    p.token1_balance,
    p.share,
    (p.token0_balance * COALESCE(tp0.price, 0)) + (p.token1_balance * COALESCE(tp1.price, 0)) AS tvl
FROM
    pool_balance p
        LEFT JOIN
    token_prices tp0 ON p.token0_denom = tp0.denomination
        LEFT JOIN
    token_prices tp1 ON p.token1_denom = tp1.denomination
        INNER JOIN (
        SELECT
            pool_address,
            MAX(height) AS max_height
        FROM
            pool_balance
        GROUP BY
            pool_address
    ) latest ON p.pool_address = latest.pool_address AND p.height = latest.max_height;