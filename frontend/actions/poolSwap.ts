import type { Account, Chain, Client, CometBftRpcSchema, Transport } from "cosmi/types";
import type { Currency } from "@towerfi/types";

import { execute, type ExecuteReturnType } from "cosmi/client";
import { setInnerValueToAsset } from "@towerfi/trpc";

export type PoolSwapParameters = {
  sender: string;
  poolAddress: string;
  askAssetInfo: Currency;
  offerAsset: {
    amount: string;
    info: Currency;
  };
  beliefPrice: string;
  maxSpread: string;
  to?: string;
};

export type PoolSwapReturnType = ExecuteReturnType;

export async function poolSwap<
  C extends Chain | undefined,
  A extends Account | undefined = Account | undefined,
>(
  client: Client<Transport, C, A, CometBftRpcSchema>,
  parameters: PoolSwapParameters,
): PoolSwapReturnType {
  const { sender, poolAddress, askAssetInfo, beliefPrice, maxSpread, offerAsset, to } = parameters;

  const swapMsg = {
    swap: {
      ask_asset_info: setInnerValueToAsset(askAssetInfo),
      offer_asset: {
        info: setInnerValueToAsset(offerAsset.info),
        amount: offerAsset.amount,
      },
      belief_price: beliefPrice,
      max_spread: maxSpread,
      to: to ?? sender,
    },
  };

  if (offerAsset.info.type === "cw-20") {
    return execute(client, {
      execute: {
        address: offerAsset.info.denom,
        message: {
          send: {
            contract: poolAddress,
            amount: offerAsset.amount,
            msg: btoa(JSON.stringify(swapMsg)),
          },
        },
        funds: [],
      },
      sender,
    });
  }

  return execute(client, {
    execute: {
      address: poolAddress,
      message: swapMsg,
      funds: [
        {
          denom: offerAsset.info.denom,
          amount: offerAsset.amount,
        },
      ],
    },
    sender,
  });
}
