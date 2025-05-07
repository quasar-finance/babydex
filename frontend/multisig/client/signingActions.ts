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
  execute: (args: ExecuteParameters) => void
  executeMultiple: (
    args: ExecuteMultipleParameters,
  ) => void
}

export function signingActions(client: Client): SigningActions {
    return {
        execute: (args: ExecuteParameters) => execute(client, args),
        executeMultiple: (args: ExecuteMultipleParameters) => executeMultiple(client, args),
    };
}

export async function execute(client: Client, parameters: ExecuteParameters) {
    const { execute, sender, gasLimit, memo, timeoutHeight } = parameters;
    return await executeMultiple(client, {
        sender,
        gasLimit,
        memo,
        timeoutHeight,
        execute: [execute],
    });
}

// TODO return the transaction in multisig signable format
export async function executeMultiple(client: Client, parameters: ExecuteMultipleParameters) {
    const { sender, execute, gasLimit, memo, timeoutHeight } = parameters;
    // TODO format the messages in the multisig format, simulate the gas, add it to the tx and return the total format
    // const msgs = execute.map(({ address, message, funds }) => ({
    //     typeUrl: MsgExecuteContract.typeUrl,
    //     value: MsgExecuteContract.encode({
    //         sender,
    //         contract: address,
    //         msg: toUtf8(JSON.stringify(message)),
    //         funds: funds || [],
    //     }).finish(),
    // }));
}