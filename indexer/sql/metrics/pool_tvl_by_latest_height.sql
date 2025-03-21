SELECT
    p.*
FROM
    pool_balance p
        INNER JOIN (
        SELECT
            pool_address,
            MAX(height) AS max_height
        FROM
            pool_balance
        GROUP BY
            pool_address
    ) latest ON p.pool_address = latest.pool_address AND p.height = latest.max_height
ORDER BY p.pool_address
LIMIT 100
OFFSET 0;