import { createPublicClient } from "cosmi";
import { signingActions } from "./signingActions";
import { Account, Chain, ClientConfig, PublicClientConfig, RpcSchema, Transport } from "viem";
import { MultisigProvider } from "../provider";

// export type MultiSigClientConfig {
//     provider: MultisigProvider
// }

export function createMultisigClient(params: PublicClientConfig) {
    const { key = 'multisig', name = 'Multisig Client' } = params;
    const client = createPublicClient({
        ...params,
        key,
        name,
        // type: 'multisigClient',
    });
    return client.extend(signingActions);
}

