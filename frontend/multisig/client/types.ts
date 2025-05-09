import type { Client, Transport, Chain, Account, CometBftRpcSchema, Coin } from 'cosmi/types';
import type { SigningActions } from './signingActions';


export type MsgExecuteContract = {
  "@type": "/cosmwasm.wasm.v1.MsgExecuteContract";
  sender: string;
  contract: string;
  funds: Coin[];
  msg: any;
};

export type Fee = {
  amount: Coin[];
  gas_limit: string;
  payer: string;
  granter: string;
};

export type AuthInfo = {
  signer_infos: any[];
  fee: Fee;
};

export type TxBody = {
  messages: MsgExecuteContract[];
  memo: string;
  timeout_height: string;
  extension_options: any[];
  non_critical_extension_options: any[];
};

export const TxBody = {
  fromPartial: (data: {
    messages: MsgExecuteContract[];
    memo?: string;
    timeoutHeight?: bigint;
    extension_options?: any[];
    non_critical_extension_options?: any[];
  }): TxBody => ({
    messages: data.messages,
    memo: data.memo ?? "",
    timeout_height: data.timeoutHeight?.toString() ?? "0",
    extension_options: data.extension_options ?? [],
    non_critical_extension_options: data.non_critical_extension_options ?? []
  })
};

export type Transaction = {
  body: TxBody;
  auth_info: AuthInfo;
  signatures: any[];
};

export type ClientWithActions<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined,
  TRpcSchema extends CometBftRpcSchema = CometBftRpcSchema
> = Client<TTransport, TChain, TAccount, TRpcSchema> & SigningActions<TTransport, TChain, TAccount>; 