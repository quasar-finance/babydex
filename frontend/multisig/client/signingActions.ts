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

import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx.js';
import { AuthInfo, TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx.js';
import { TxBody, Transaction } from './types';

export type SigningActions<
_transport extends Transport = Transport,
_chain extends Chain | undefined = Chain | undefined,
_account extends Account | undefined = Account | undefined,
> = {
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
    
    const msgs = execute.map(({ address, message, funds }) => ({
      "@type": "/cosmwasm.wasm.v1.MsgExecuteContract" as const,
      sender,
      contract: address,
      msg: message,
      funds: funds || [],
    }))

      const txBody = TxBody.fromPartial({
        timeoutHeight: timeoutHeight ?? BigInt(0),
        messages: msgs,
        memo,
      })

      const transaction: Transaction = {
        body: txBody,
        auth_info: {
          signer_infos: [],
          fee: {
            amount: [],
            gas_limit: gasLimit?.toString() ?? "0",
            payer: "",
            granter: ""
          }
        },
        signatures: []
      };

      // Show the transaction in a modal
      const event = new CustomEvent('showTransaction', { 
          detail: { transaction } 
      });
      window.dispatchEvent(event);

      return {};
}