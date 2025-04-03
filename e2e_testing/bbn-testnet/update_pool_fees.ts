import deployed from "./deployed.json";
import tokens from "./tokens.json";
import { AstroportFactoryClient } from "../sdk/AstroportFactory.client";
import { getClientAndAddress } from "../lib";
import { AstroportPairConcentratedClient } from "../sdk/AstroportPairConcentrated.client";
import { Coin, coin } from "@cosmjs/proto-signing";
import { AstroportPairClient } from "../sdk/AstroportPair.client";


interface EnableFeeShareParams {
    fee_share_bps: number;  // TypeScript doesn't have u16, so we use number
    fee_share_address: string;
}

const main = async () => {
    const { client, address } = await getClientAndAddress();
    const factoryClient = new AstroportFactoryClient(client, address, deployed.factory);
    
    const pairs = await factoryClient.pairs({});
    
    const enableFeeShareParams: EnableFeeShareParams = {
        fee_share_bps: 1000,  // 10% fee share (1000 basis points = 10%)
        fee_share_address: "bbn1ue0avvd8vhk24zpg5ll5qjuepanudjefnvwttf"  // The address to receive the fee share
    };

    const PclupdateMsg = {
        update: {
            enable_fee_share: enableFeeShareParams
        }
    };
    const XYKupdateMsg = {
        enable_fee_share: enableFeeShareParams
    };

    for (const pair of pairs) {
        const pairType = pair.pair_type;
        // Determine which contract to migrate to based on pair type
        const targetContract = 'concentrated' in pairType ? "astroport_pair_concentrated" : "astroport_pair";
        if (targetContract == 'astroport_pair_concentrated') {
            const base64Msg = Buffer.from(JSON.stringify(PclupdateMsg)).toString('base64');
            const poolClient = new AstroportPairConcentratedClient(client, address, pair.contract_addr);
            await poolClient.updateConfig({params: base64Msg});
            console.log(`processed ${pair.contract_addr}, pcl pool`)
        } else {
            const base64Msg = Buffer.from(JSON.stringify(XYKupdateMsg)).toString('base64');
            const poolClient = new AstroportPairClient(client, address, pair.contract_addr);
            await poolClient.updateConfig({params: base64Msg});
            console.log(`processed ${pair.contract_addr}, xyk pool`)
        }
    }
}

main().catch(console.error); 