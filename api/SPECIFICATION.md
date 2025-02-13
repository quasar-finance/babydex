# Astroport Fork API Layer Requirements

[https://www.notion.so/quasarfinance/Astroport-fork-1840af21459280e2bd9cdccf95e121c7](https://www.notion.so/quasarfinance/Astroport-fork-1840af21459280e2bd9cdccf95e121c7)

The API layer needs (minimally) to serve

1. List of Pools  
   Read all pools from the factory and decode the tokens in the pools  
2. List of Assets  
   Result of action one  
3. Swap Route (BFS simulate)  
   Requires a graph of all pools, vertices are tokens and edges are pools. Swap simulation is the edge weight. We try to find the pool with the highest route cost

**1\. Data Acquisition & Persistence**

* **Blockchain Interaction:**  
  * Utilize a robust blockchain library to interact with the Astroport smart contracts on Cosmos. CosmJS  
  * Efficiently query the factory contract to retrieve the list of deployed pools.  
  * For each pool, fetch the pool contract address and interact with it to:  
    * Retrieve the addresses of the tokens in the pool.  
    * Decode the token symbols or names (if available) using on-chain metadata or external APIs (e.g., CoinGecko, CoinMarketCap).  
* **Data Storage:**  
  * Implement a caching mechanism (e.g., Redis, Memcached) to store frequently accessed data:  
    * List of pools with decoded token information.  
    * Token metadata (symbols, names, logos).

**2\. API Layer**

* **Framework:** Choose a suitable web framework NodeJS for building RESTful APIs.  
* **Endpoints:**  
  * `/pools`:  
    * Returns a list of all pools with decoded token information.  
  * `/assets`:  
    * Returns a list of all unique assets (tokens) found in the pools.  
    * Consider including token metadata (symbols, names, logos).  
  * `/route`:  
    * Accepts input and output token addresses.  
    * Constructs the graph of all pools, where nodes are tokens and edges are pools with their associated swap costs (e.g., slippage, gas fees).  
    * Implements a Breadth-First Search (BFS) algorithm to find the optimal swap route with the highest potential profit or lowest slippage.  
    * Returns the optimal swap route (list of pools) and relevant metrics (e.g., estimated output amount, slippage).

**3\. Swap Route Simulation**

* **Graph Representation:**  
  * Represent the pool graph using a suitable data structure (e.g., adjacency list) for efficient graph traversal.  
* **Swap Cost Calculation:**  
  * Implement a function to calculate the swap cost for each pool. This may involve:  
    * Fetching real-time on-chain reserves for each pool.  
    * Calculating slippage based on the input amount and current reserves.  
    * Estimating gas costs for the swap transactions.  
* **BFS Algorithm:**  
  * Implement a BFS algorithm to traverse the graph and find the shortest path (in terms of hops or cost) between the input and output tokens.  
  * Prioritize paths with the highest potential profit or lowest slippage.

**4\. Error Handling & Security**

* **Robust Error Handling:** Implement proper error handling and logging to identify and address potential issues.  
* **Rate Limiting:** Implement rate limiting to prevent abuse and ensure fair usage of the API.  
* **Data Validation:** Validate all input parameters (e.g., token addresses, amounts) to prevent invalid requests.  
* **Security Best Practices:** Follow security best practices, such as input sanitization and proper authentication/authorization mechanisms if required.

**5\. Monitoring & Maintenance**

* **Monitoring:** Implement monitoring tools to track API performance, usage, and error rates.  
* **Maintenance:** Regularly update the API with new features, bug fixes, and improvements.

**Key Considerations**

* **Scalability:** Design the API to handle a high volume of requests efficiently.  
* **Real-time Data:** Ensure that the API provides up-to-date information by fetching data from the blockchain frequently.  
* **User Experience:** Provide clear and concise documentation for the API, along with user-friendly error messages.

### Request Payloads

**1\. `/pools` Endpoint**

* **Request (Optional):**  
* **Response:**

  * `status`: String, always "success"  
  * `data`: Array of objects, each representing a pool:  
    * `pool_address`: String, address of the pool contract  
    * `token0`:  
      * `address`: String, address of token 0  
      * `symbol`: String, symbol of token 0 (e.g., "WBNB")  
      * `name`: String, name of token 0 (e.g., "Wrapped BNB") 
      * `reserve`: String, current reserve of token 0 in the pool
    * `token1`:  
      * `address`: String, address of token 1  
      * `symbol`: String, symbol of token 1
      * `name`: String, name of token 1
      * `reserve`: String, current reserve of token 1 in the pool
    * `fee_tier`: Integer, fee tier of the pool (if applicable)

**2\. `/assets` Endpoint**

* **Request (Optional):**  
* **Response:**

  * `status`: String, always "success"  
  * `data`: Array of objects, each representing an asset (token):  
    * `address`: String, address of the token  
    * `symbol`: String, symbol of the token  
    * `denom`: String, denomination of the token (eg: ibc/49A…)  
    * `type`: String, enumeration, native/erc20/ibc  
    * `decimals`: Number, the amount of decimals the asset uses  
    * `current_price`: String, Price of 1 unit of the asset, price of coingecko  
    * `name`: String, name of the token  
    * `logo_uri`: String, optional, URI of the token logo

**3\. `/route` Endpoint**

* **Request:**

  * `token_in`: String, address of the input token  
  * `token_out`: String, address of the output token  
  * `amount_in`: String, amount of input token to swap (optional)  
* **Response:**

  * `status`: String, "success" or "error"
  * `message`: String, error message describing the issue (e.g., "No route found"), empty on success
  * `data`: Array of objects, each representing a hop for this route for the given tokens, empty on error 
    * `address`: String, address of the pool for this hop  
    * `token_in`: String, address of the input token for this hop  
    * `token_out`: String, address of the output token for this hop  
    * `amount_out`: String, estimated amount of output tokens received  
    * `slippage`: String, estimated slippage percentage

**Important Notes:**

* **Data Types:** Use appropriate data types for all values (e.g., strings for addresses, integers for amounts, floats for percentages).  
* **Error Handling:** Include a `status` field in all responses to indicate success or failure. If an error occurs, provide a descriptive `message` to help users understand the issue.  
* **Pagination:** Implement pagination for `/pools` and `/assets` endpoints to handle large datasets efficiently.  
* **Filtering:** Consider adding optional filtering parameters to the `/pools` endpoint to allow users to filter pools based on specific criteria.  
* **Rate Limiting:** Implement rate limiting to prevent abuse and ensure fair usage of the API.

