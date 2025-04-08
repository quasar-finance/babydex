import { useAccount, useSigningClient } from "@cosmi/react";

import { useMutation } from "@tanstack/react-query";
import { getCw20Allowance } from "~/actions/getCw20Allowance";
import { increaseAllowance as increaseAllowanceAction } from "~/actions/increaseAllowance";
import { useToast } from "./useToast";
import { TxError } from "~/utils/formatTxErrors";

export function useCw20Allowance() {
  const { toast } = useToast();
  const { data: signignClient } = useSigningClient();
  const { address: userAddress } = useAccount();

  return useMutation<void, Error, { spender: string; address: string; amount: bigint }>({
    mutationFn: async ({ spender, address, amount }) => {
      if (!signignClient) throw new Error("we couldn't submit the tx");
      const { allowance } = await getCw20Allowance(signignClient, {
        address,
        owner: userAddress as string,
        spender,
      });

      if (BigInt(allowance) >= amount) return;
      const id = toast.loading({
        title: "Increasing allowance",
        description: `Increasing allowance for ${address}`,
      });
      try {
        await increaseAllowanceAction(signignClient, {
          address,
          spender,
          amount: (2n ** 128n - 1n).toString(),
          sender: userAddress as string,
        });
        toast.success({
          title: "Allowance increased",
          description: `Allowance for ${address} increased`,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(error);
        toast.error({
          title: "Failed to increase allowance",
          description: `${new TxError(message).pretty()}`,
        });
      } finally {
        toast.dismiss(id);
      }
    },
  });
}
