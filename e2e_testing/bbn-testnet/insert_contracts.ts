import { Client } from "pg";
import fs from "fs";
import path from "path";
import { getClientAndAddress } from "../lib";
import { AstroportFactoryClient } from "../sdk/AstroportFactory.client";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

// PostgreSQL connection details
const client = new Client({
  user: "postgres",
  host: "db.lvyyjzphlxqtdlponywj.supabase.co",
  database: "postgres",
  password: "CMU_arg5jrc1uvn9zmp",
  port: 5432, // Default PostgreSQL port
});

interface Contract {
  internal_chain_id: number;
  address: string;
  start_height: number;
}

// Function to read deployed contracts from JSON
function readDeployedContracts(): Record<string, string> {
  const filePath = path.join(__dirname, "deployed.json");
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// Function to query the created block for a contract
async function getCreatedBlock(contract_address: string): Promise<number> {
//     const {client, address} = await getClientAndAddress();
//     const response = await client.getContract(contract_address);
//   // Placeholder for actual logic to get the created block
//   // This should be replaced with the actual query to get the block height
//   return response.; // Example block height
    // arbitrary value, but should be gotten from onchain when the contract was created
    return 401000
}

// Function to process contracts deployed by the factory
async function processFactoryContracts(deployedFactory: string)  {
    const {client, address} = await getClientAndAddress();

    const factoryClient = new AstroportFactoryClient(client, address, deployedFactory);

    const pairs = await factoryClient.pairs({});
    
    const processed_pairs = pairs.map((pair) => {
        return {contract: pair.contract_addr, token: pair.liquidity_token}
    })
    return processed_pairs
}

// Sample contract data
async function populateContracts(): Promise<Contract[]> {
  var deployedContracts = readDeployedContracts();
  const contracts: Contract[] = [];

  const factory = deployedContracts["factory"];
  const pairs = await processFactoryContracts(factory); // Ensure pairs is resolved
  const pairsArray = pairs.flatMap(({ contract, token }) => [contract, token]);

  // Convert deployedContracts to an array of values
  const deployedContractsArray = Object.values(deployedContracts);

  // Concatenate the arrays
  const combinedContracts = [...deployedContractsArray, ...pairsArray];

  for (const address of combinedContracts) {
    const startHeight = await getCreatedBlock(address);
    contracts.push({
      internal_chain_id: 1, // Example chain ID, adjust as needed
      address,
      start_height: startHeight,
    });
  }

  return contracts;
}

async function insertContracts(contracts: Contract[]) {
  try {
    await client.connect();
    console.log("Connected to the database.");

    const insertV1CosmosContractsQuery = `
      INSERT INTO v1_cosmos.contracts (
        internal_chain_id, address, start_height
      ) VALUES ($1, $2, $3)
      ON CONFLICT (address, internal_chain_id, start_height) DO NOTHING;
    `;

    const insertHubbleContractStatusQuery = `
      INSERT INTO hubble.contract_status (
        internal_chain_id, address, height, timestamp
      ) VALUES ($1, $2, $3, NOW())
      ON CONFLICT (internal_chain_id, address) DO UPDATE
      SET height = EXCLUDED.height, updated_at = NOW();
    `;

    for (const contract of contracts) {
      await client.query(insertV1CosmosContractsQuery, [
        contract.internal_chain_id,
        contract.address,
        contract.start_height,
      ]);
      console.log(`Inserted contract into v1_cosmos: ${contract.address}`);

    //   await client.query(insertHubbleContractStatusQuery, [
    //     contract.internal_chain_id,
    //     contract.address,
    //     contract.start_height,
    //   ]);
    //   console.log(`Inserted/Updated contract status in hubble: ${contract.address}`);
    }
  } catch (error) {
    console.error("Error inserting contracts:", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
}

// Run the insertion function
(async () => {
  const contracts = await populateContracts();
  console.log(contracts)
  await insertContracts(contracts);
})();
