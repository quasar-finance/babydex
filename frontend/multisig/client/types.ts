import type { Client, Transport, Chain, Account, CometBftRpcSchema } from 'cosmi/types';
import type { SigningActions } from './signingActions';

export type ClientWithActions<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined,
  TRpcSchema extends CometBftRpcSchema = CometBftRpcSchema
> = Client<TTransport, TChain, TAccount, TRpcSchema> & {
  actions: SigningActions<TTransport, TChain, TAccount>;
}; 