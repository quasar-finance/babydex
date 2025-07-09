import * as fs from "node:fs";
import deployed from "./deployed.json";
import contracts from "./contracts.json";
import { getClientAndAddress } from "../lib";
import { AstroportFactoryClient } from "../sdk/AstroportFactory.client";

const WASM_PATH = "../../artifacts/$path.wasm";
const CONTRACTS = ["astroport_pair", "astroport_pair_concentrated"];

// Sleep function to pause execution
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const { client, address } = await getClientAndAddress();

  // Store contracts
  const contractCodeIds: { [key: string]: number } = contracts;
  for (const contract of CONTRACTS) {
    const wasmCode = fs.readFileSync(WASM_PATH.replace("$path", contract));
    console.log(`Uploading ${contract}`);
    const resp = await client.upload(address, wasmCode, "auto", `Upload ${contract}`);
    contractCodeIds[contract] = resp.codeId;
    // Sleep for 10 seconds between migrations
    console.log("Sleeping for 10 seconds before next store...");
    await sleep(10000);
  }
  // Write contract code IDs to JSON file
  console.log("Writing contract code IDs to contracts.json");
  fs.writeFileSync("contracts.json", JSON.stringify(contractCodeIds, null, 2));

  const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);
  const pairs = await factoryClient.pairs({});
  for (const pair of pairs) {
    const pairType = pair.pair_type;
    const contractAddr = pair.contract_addr;

    // Determine which contract to migrate to based on pair type
    const targetContract =
      "concentrated" in pairType ? "astroport_pair_concentrated" : "astroport_pair";

    // Migrate the contract
    console.log(`target address: ${pair.contract_addr}, ${targetContract}`);
    await client.migrate(address, contractAddr, contracts[targetContract]!, {}, "auto");
  }
}

main();
