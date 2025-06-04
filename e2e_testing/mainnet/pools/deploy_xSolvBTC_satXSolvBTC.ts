import deployed from "../deployed.json";
import { AstroportFactoryClient } from "../../sdk/AstroportFactory.client";
import { getClientAndAddress } from "../lib";
import { satXSolvBTC, xSolvBTC } from "../assets";
import { pclLSDParams, } from "../pcl_params";

const toBase64 = (object: any) => {
  return Buffer.from(JSON.stringify(object)).toString("base64");
};

const main = async () => {
  const { client, address } = await getClientAndAddress();

  const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);

  await factoryClient
    .createPair(
      {
        assetInfos: [
          { native_token: { denom: xSolvBTC } },
          { native_token: { denom: satXSolvBTC } },
        ],
        pairType: { concentrated: {} },
        initParams: toBase64(pclLSDParams("1.0")),
      },
      "auto",
    )
    .then(console.log);
};

main();
