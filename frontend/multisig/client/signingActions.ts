import { ExecuteMultipleParameters, ExecuteMultipleReturnType, ExecuteParameters, ExecuteReturnType } from 'cosmi/client';

import type {
    Account,
    Chain,
    Client,
    CometBftRpcSchema,
    Transport,
    TxMessage,
} from 'cosmi/types'
import { toUtf8 } from 'cosmi/utils';

export type SigningActions<
_transport extends Transport = Transport,
_chain extends Chain | undefined = Chain | undefined,
_account extends Account | undefined = Account | undefined,
> = {
    // TODO change these actions up to account for the multisig return type
    execute: (args: ExecuteParameters) => ExecuteReturnType
    executeMultiple: (
        args: ExecuteMultipleParameters,
    ) => ExecuteReturnType
}

export function signingActions(client: Client): SigningActions {
    return {
        execute: (args: ExecuteParameters) => execute(client, args),
        executeMultiple: (args: ExecuteMultipleParameters) => executeMultiple(client, args),
    };
}

export async function execute(client: Client, parameters: ExecuteParameters): ExecuteReturnType {
    const { execute, sender, gasLimit, memo, timeoutHeight } = parameters;
    return await executeMultiple(client, {
        sender,
        gasLimit,
        memo,
        timeoutHeight,
        execute: [execute],
    });
}

export async function executeMultiple(client: Client, parameters: ExecuteMultipleParameters): ExecuteReturnType {
    const { sender, execute, gasLimit, memo, timeoutHeight } = parameters;
    
    // // Format the messages
    // const msgs = execute.map(({ address, message, funds }) => ({
    //     typeUrl: MsgExecuteContract.typeUrl,
    //     value: MsgExecuteContract.encode({
    //         sender,
    //         contract: address,
    //         msg: toUtf8(JSON.stringify(message)),
    //         funds: funds || [],
    //     }).finish(),
    // }));

    // Create the transaction object
    const transaction = {
        messages: execute,
        signer: sender,
        gasLimit,
        memo,
        timeoutHeight,
    };

    // Show the transaction in a modal
    // We'll need to use a state management solution to show the modal
    // For now, let's use a custom event
    const event = new CustomEvent('showTransaction', { 
        detail: { transaction } 
    });
    window.dispatchEvent(event);

    return {};
}