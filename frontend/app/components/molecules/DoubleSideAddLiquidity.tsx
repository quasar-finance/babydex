import { useFormContext } from "react-hook-form";
import type { PoolInfo } from "@towerfi/types";
import type React from "react";
import { useAccount } from "@cosmi/react";
import { convertDenomToMicroDenom, convertMicroDenomToDenom, formatDecimals } from "~/utils/intl";
import { useToast } from "~/app/hooks";
import { IconWallet } from "@tabler/icons-react";
import { trpc } from "~/trpc/client";
import { useModal } from "~/app/providers/ModalProvider";
import { ModalTypes } from "~/types/modal";
import type { DepositFormData } from "./modals/ModalAddLiquidity";
import { useImperativeHandle, useMemo } from "react";
import { useDexClient } from "~/app/hooks/useDexClient";
import { TxError } from "~/utils/formatTxErrors";
import { useUserBalances } from "~/app/hooks/useUserBalances";
import { useCw20Allowance } from "~/app/hooks/useCw20Allowance";
import { usePrices } from "~/app/hooks/usePrices";

interface Props {
  pool: PoolInfo;
  submitRef: React.MutableRefObject<{ onSubmit: (data: DepositFormData) => Promise<void> } | null>;
}

export const DoubleSideAddLiquidity: React.FC<Props> = ({ pool, submitRef }) => {
  const { toast } = useToast();
  const { address } = useAccount();
  const { getPrice } = usePrices();
  const { register, watch, setValue } = useFormContext();
  const { data: signingClient } = useDexClient();
  const { showModal } = useModal();

  const { mutateAsync: increaseAllowance } = useCw20Allowance();

  const { data: balances = [], refetch: refreshBalances } = useUserBalances({
    assets: pool.assets,
  });

  const { data: optimalRatio = 1 } = trpc.local.pools.getOptimalRatio.useQuery({
    address: pool.poolAddress,
  });

  const [token0, token1] = pool.assets;

  const token0Amount = watch(token0.symbol, "");
  const token1Amount = watch(token1.symbol, "");

  const [t0DenomBalance, t1DenomBalance] = useMemo(() => {
    const [balance0, balance1] = balances;
    return [
      balance0 ? convertMicroDenomToDenom(balance0.amount, balance0.decimals, balance0.decimals, false) : 0,
      balance1 ? convertMicroDenomToDenom(balance1.amount, balance1.decimals, balance1.decimals, false) : 0,
    ];
  }, [balances]);

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

        if (token0.type === "cw-20") {
          await increaseAllowance({
            address: token0.denom,
            spender: pool.poolAddress,
            amount: BigInt(token0Amount),
          });
        }

        if (token1.type === "cw-20") {
          await increaseAllowance({
            address: token1.denom,
            spender: pool.poolAddress,
            amount: BigInt(token1Amount),
          });
        }

        const sortedTokens = [
          { amount: token0Amount, info: token0 },
          { amount: token1Amount, info: token1 },
        ].sort((a, b) => a.info.denom.localeCompare(b.info.denom));

        await signingClient.addLiquidity({
          slipageTolerance,
          sender: address as string,
          poolAddress: pool.poolAddress,
          autoStake: true,
          assets: sortedTokens,
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
      } finally {
        toast.dismiss(id);
      }
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
                setValue(token1.symbol, formatDecimals(Number(target.value) * optimalRatio, token1.decimals), {
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
              setValue(token0.symbol, formatDecimals(t0DenomBalance, token0.decimals), { shouldValidate: true });
              setValue(token1.symbol, formatDecimals(t0DenomBalance * optimalRatio, token1.decimals), {
                shouldValidate: true,
              });
            }}
          >
            <IconWallet className="h-4 w-4" />
            <p>{t0DenomBalance}</p>
          </div>
          <p>{getPrice(token0Amount, token0.denom)}</p>
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
                setValue(token0.symbol, formatDecimals(Number(target.value) / optimalRatio, token0.decimals), {
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
              setValue(token0.symbol, formatDecimals(Number(t1DenomBalance) / optimalRatio, token0.decimals), {
                shouldValidate: true,
              });
            }}
          >
            <IconWallet className="h-4 w-4" />
            <p>{t1DenomBalance}</p>
          </div>
          <p>{getPrice(token1Amount, token1.denom)}</p>
        </div>
      </div>
    </div>
  );
};
