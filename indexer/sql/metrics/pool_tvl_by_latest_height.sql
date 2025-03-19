/*
    Select all pools latest token balances (by height) with pagination
*/
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
ORDER BY p.pool_address -- Add an ORDER BY clause for consistent pagination
LIMIT 100
OFFSET 0;

/*
    Select pools based on pool address
 */
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
        WHERE
            pool_address = ANY('{
                "bbn10vzynuvh08kssssdrj9k2vaxxl9uqn0f08jaq8zq6h7vxmd9cnuqa3putu",
                "bbn17xgsxm4vll7trsd59e26wg9f0unwmx2ktfhtvhu35jeel5wrakcqvnwzyu"
            }'::text[])
        GROUP BY
            pool_address
    ) latest ON p.pool_address = latest.pool_address AND p.height = latest.max_height
WHERE
    p.pool_address = ANY('{
                "bbn10vzynuvh08kssssdrj9k2vaxxl9uqn0f08jaq8zq6h7vxmd9cnuqa3putu",
                "bbn17xgsxm4vll7trsd59e26wg9f0unwmx2ktfhtvhu35jeel5wrakcqvnwzyu"
            }'::text[])
ORDER BY
    p.pool_address;