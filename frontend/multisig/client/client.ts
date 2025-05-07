import { createPublicClient } from "cosmi";
import { signingActions } from "./signingActions";
import type { ClientWithActions } from "./types";

// export type MultiSigClientConfig {
//     provider: MultisigProvider
// }

export function createMultisigClient(params: any): ClientWithActions {
    const { key = 'multisig', name = 'Multisig Client' } = params;
    const client = createPublicClient({
        ...params,
        key,
        name,
    });
    return client.extend(signingActions) as unknown as ClientWithActions;
}

