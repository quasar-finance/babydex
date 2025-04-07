import deployed from "./deployed.json";
import config from "../config.json";
import {AstroportFactoryClient} from "../sdk/AstroportFactory.client";
import {getClientAndAddress} from "../lib";
import {AstroportIncentivesClient} from "../sdk/AstroportIncentives.client";

   
const main = async () => {
    const {client, address} = await getClientAndAddress();

    const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);
   // Incentivize pair for 5 weeks with 10_000 ibc/2278567FFA6D754BDD8C159CE1770D8AF27649BFB58E5132CF530460591E479D
   const incentivesClient = new AstroportIncentivesClient(client, address, deployed.incentives);

       // Get all pairs
       const pairs = await factoryClient.pairs({});
       console.log(`Found ${pairs.length} pairs`);
       
   
       for (const pair of pairs) {
           const assets = pair.asset_infos;
           await incentivesClient.incentivize(
               {
                   lpToken: pair.liquidity_token,
                   schedule: {
                       reward: {
                           info: {
                               native_token: {
                                   denom: "ibc/3AA6631D204C192DDB757935A4C49A0E83EEEE14AC045E8A180CCB4EE08B6196"
                               }
                           },
                           amount: "10000000000000000000000" // 10_000 * 10^18
                       },
                       duration_periods: 5
                   }
               },
               "auto",
               "incentivize pair",
               [
                   {
                       denom: "ibc/3AA6631D204C192DDB757935A4C49A0E83EEEE14AC045E8A180CCB4EE08B6196",
                       amount: "10000000000000000000000" // 10_000 * 10^18
                   }
                //    {
                //        denom: "ubbn",
                //        amount: parseInt(config.incentivize_fee.fee.amount).toString()
                //    }
               ]
           ).then(console.log);
       }
   }

   main()
