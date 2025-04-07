import { useFormContext } from "react-hook-form";
import type { PoolInfo } from "@towerfi/types";
import type React from "react";
import { useAccount, useBalances } from "@cosmi/react";
import { convertDenomToMicroDenom, convertMicroDenomToDenom, formatDecimals } from "~/utils/intl";
import { useToast } from "~/app/hooks";
import { IconWallet } from "@tabler/icons-react";
import { trpc } from "~/trpc/client";
import { useModal } from "~/app/providers/ModalProvider";
import { ModalTypes } from "~/types/modal";
import type { DepositFormData } from "./modals/ModalAddLiquidity";
import { useImperativeHandle } from "react";
import { useDexClient } from "~/app/hooks/useDexClient";
import { TxError } from "~/utils/formatTxErrors";

interface Props {
  pool: PoolInfo;
  submitRef: React.MutableRefObject<{ onSubmit: (data: DepositFormData) => Promise<void> } | null>;
}

export const DoubleSideAddLiquidity: React.FC<Props> = ({ pool, submitRef }) => {
  const { toast } = useToast();
  const { address } = useAccount();
  const { register, watch, setValue } = useFormContext();
  const { data: signingClient } = useDexClient();
  const [token0, token1] = pool.assets;
  const { showModal } = useModal();

  const token0Amount = watch(token0.symbol, "");
  const token1Amount = watch(token1.symbol, "");

  const { data: balances = [], refetch: refreshBalances } = useBalances({
    address: address as string,
  });

  const { data: optimalRatio = 1 } = trpc.local.pools.getOptimalRatio.useQuery({
    address: pool.poolAddress,
  });

  const { t0Balance, t1Balance } = balances.reduce(
    (acc, { denom, amount }) => {
      if (denom === token0.denom) acc.t0Balance = amount;
      if (denom === token1.denom) acc.t1Balance = amount;
      return acc;
    },
    { t0Balance: "0", t1Balance: "0" },
  );

  const t0DenomBalance = convertMicroDenomToDenom(t0Balance, token0.decimals);
  const t1DenomBalance = convertMicroDenomToDenom(t1Balance, token1.decimals);

  useImperativeHandle(submitRef, () => ({
    onSubmit: async ({ slipageTolerance, ...data }) => {
      const id = toast.loading(
        {
          title: "Depositing",
          description: `Depositing ${data[token0.symbol]} ${token0.symbol} and ${data[token1.symbol]} ${token1.symbol} to the pool`,
        },
        { duration: Number.POSITIVE_INFINITY },
      );
      try {
        if (!signingClient) throw new Error("we couldn't submit the tx");
        const token0Amount = convertDenomToMicroDenom(data[token0.symbol], token0.decimals);
        const token1Amount = convertDenomToMicroDenom(data[token1.symbol], token1.decimals);
        await signingClient.addLiquidity({
          slipageTolerance,
          sender: address as string,
          poolAddress: pool.poolAddress,
          autoStake: true,
          assets: [
            { amount: token0Amount, info: { native_token: { denom: token0.denom } } },
            { amount: token1Amount, info: { native_token: { denom: token1.denom } } },
          ],
        });

        await refreshBalances();
        showModal(ModalTypes.deposit_completed, true, {
          tokens: [
            { amount: token0Amount, ...token0 },
            { amount: token1Amount, ...token1 },
          ],
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        console.error(error);
        toast.error({
          title: "Deposit failed",
          description: `Failed to deposit ${data[token0.symbol]} ${token0.symbol} and ${data[token1.symbol]} ${token1.symbol} to the pool. ${new TxError(message).pretty()}`,
        });
      }
      toast.dismiss(id);
    },
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 bg-white/5 w-full rounded-xl p-4 flex-1">
        <div className="w-full flex gap-4 items-center justify-between">
          <div className="flex items-center gap-2 p-2 pr-3 bg-white/5 rounded-full w-fit">
            <img src={token0.logoURI} alt={token0.symbol} className="w-7 h-7" />
            <p>{token0.symbol}</p>
          </div>
          <input
            className="text-2xl w-fit bg-transparent text-right"
            placeholder="0"
            {...register(token0.symbol, {
              validate: (value) => {
                if (value === "") return "Amount is required";
                if (Number.isNaN(+value)) return "Only enter digits to bond to a vault";
                if (Number(value) > Number(t0DenomBalance)) return "Insufficient Amount";
                if (Number(value) <= 0) return "Amount must be greater than 0";
              },
            })}
            value={token0Amount}
            onChange={({ target }) => {
              const regex = /^\d+(\.\d{0,18})?$/;
              if (target.value === "" || regex.test(target.value)) {
                setValue(token0.symbol, target.value, { shouldValidate: true });
                setValue(token1.symbol, formatDecimals(Number(target.value) * optimalRatio), {
                  shouldValidate: true,
                });
              }
            }}
          />
        </div>
        <div className="flex gap-2 items-center justify-between text-white/50 text-xs">
          <div
            className="flex gap-1 items-center cursor-pointer"
            onClick={() => {
              setValue(token0.symbol, formatDecimals(t0DenomBalance), { shouldValidate: true });
              setValue(token1.symbol, formatDecimals(t0DenomBalance * optimalRatio), {
                shouldValidate: true,
              });
            }}
          >
            <IconWallet className="h-4 w-4" />
            <p>{t0DenomBalance}</p>
          </div>
          <p>$0</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 bg-white/5 w-full rounded-xl p-4 flex-1">
        <div className="w-full flex gap-4 items-center justify-between">
          <div className="flex items-center gap-2 p-2 pr-3 bg-white/5 rounded-full w-fit">
            <img src={token1.logoURI} alt={token1.symbol} className="w-7 h-7" />
            <p>{token1.symbol}</p>
          </div>
          <input
            className="text-2xl w-fit bg-transparent text-right"
            placeholder="0"
            {...register(token1.symbol, {
              validate: (value) => {
                if (value === "") return "Amount is required";
                if (Number.isNaN(+value)) return "Only enter digits to bond to a vault";
                if (Number(value) > Number(t1DenomBalance)) return "Insufficient Amount";
                if (Number(value) <= 0) return "Amount must be greater than 0";
              },
            })}
            value={token1Amount}
            onChange={({ target }) => {
              const regex = /^\d+(\.\d{0,18})?$/;
              if (target.value === "" || regex.test(target.value)) {
                setValue(token1.symbol, target.value, { shouldValidate: true });
                setValue(token0.symbol, formatDecimals(Number(target.value) / optimalRatio), {
                  shouldValidate: true,
                });
              }
            }}
          />
        </div>
        <div className="flex gap-2 items-center justify-between text-white/50 text-xs">
          <div
            className="flex gap-1 items-center cursor-pointer"
            onClick={() => {
              setValue(token1.symbol, t1DenomBalance, { shouldValidate: true });
              setValue(token0.symbol, formatDecimals(Number(t1DenomBalance) / optimalRatio), {
                shouldValidate: true,
              });
            }}
          >
            <IconWallet className="h-4 w-4" />
            <p>{t1DenomBalance}</p>
          </div>
          <p>$0</p>
        </div>
      </div>
    </div>
  );
};
