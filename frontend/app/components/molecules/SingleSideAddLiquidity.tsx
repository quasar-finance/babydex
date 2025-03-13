import type { PoolInfo } from "@towerfi/types";
import type React from "react";
import Dropdown from "../atoms/Dropdown";
import { useForm } from "react-hook-form";
import { IconWallet } from "@tabler/icons-react";
import { convertDenomToMicroDenom, convertMicroDenomToDenom } from "~/utils/intl";
import { useState } from "react";
import { useAccount, useBalances, useSigningClient } from "@cosmi/react";
import { useToast } from "~/app/hooks";
import { useModal } from "~/app/providers/ModalProvider";
import { ModalTypes } from "~/types/modal";
interface Props {
  pool: PoolInfo;
  slipageTolerance: string;
  setLoading: (loading: boolean) => void;
}

export const SingleSideAddLiquidity: React.FC<Props> = ({ pool, slipageTolerance, setLoading }) => {
  const [selectedToken, setSelectedToken] = useState(0);
  const { address } = useAccount();
  const { toast } = useToast();
  const { data: signingClient } = useSigningClient();
  const { register, watch, setValue, handleSubmit } = useForm();
  const { assets } = pool;
  const { showModal } = useModal();

  const asset = assets[selectedToken];

  const { data: balances = [], refetch: refreshBalances } = useBalances({
    address: address as string,
  });

  const balance = balances.find((balance) => balance.denom === asset.denom)?.amount ?? "0";
  const denomBalance = convertMicroDenomToDenom(balance, asset.decimals);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!signingClient) throw new Error("we couldn't submit the tx");
      setLoading(true);

      const id = toast.loading({
        title: "Depositing",
        description: `Depositing ${data[asset.symbol]} ${asset.symbol} to the pool`,
      });

      const tokenAmount = convertDenomToMicroDenom(data[asset.symbol], asset.decimals);
      await signingClient.execute({
        execute: {
          address: pool.poolAddress,
          message: {
            provide_liquidity: {
              assets: [{ amount: tokenAmount, info: { native_token: { denom: asset.denom } } }],
              slippage_tolerance: slipageTolerance,
            },
          },
          funds: [{ denom: asset.denom, amount: tokenAmount }],
        },
        sender: address as string,
      });
      toast.dismiss(id);
      await refreshBalances();
      showModal(ModalTypes.deposit_completed, true, {
        tokens: [{ amount: tokenAmount, ...asset }],
      });
    } catch (error) {
      toast.error({
        title: "Deposit failed",
        description: `Failed to deposit ${data[asset.symbol]} ${asset.symbol} to the pool`,
      });
    } finally {
      setLoading(false);
    }
  });

  return (
    <form
      id="addLiquidity"
      className="flex flex-col gap-4 bg-white/5 w-full rounded-xl p-4 flex-1"
      onSubmit={onSubmit}
    >
      <div className="w-full flex gap-4 items-center justify-between">
        <Dropdown
          defaultValue={{
            value: asset.symbol,
            label: (
              <>
                <img src={asset.logoURI} alt={asset.symbol} className="w-7 h-7" />
                <p>{asset.symbol}</p>
              </>
            ),
          }}
          options={assets.map((asset) => ({
            value: asset.symbol,
            label: (
              <>
                <img src={asset.logoURI} alt={asset.symbol} className="w-7 h-7" />
                <p>{asset.symbol}</p>
              </>
            ),
          }))}
          onChange={() => setSelectedToken(1 >> selectedToken)}
        />

        <input
          className="text-2xl w-fit bg-transparent text-right"
          placeholder="0"
          {...register(asset.symbol, {
            validate: (value) => {
              if (value === "") return "Amount is required";
              if (Number.isNaN(+value)) return "Only enter digits to bond to a vault";
              if (Number(value) > Number(denomBalance)) return "Insufficient Amount";
              if (Number(value) <= 0) return "Amount must be greater than 0";
            },
          })}
          value={watch(asset.symbol, "")}
          onChange={({ target }) => {
            const regex = /^\d+(\.\d{0,18})?$/;
            if (target.value === "" || regex.test(target.value)) {
              setValue(asset.symbol, target.value, {
                shouldValidate: true,
              });
            }
          }}
        />
      </div>
      <div className="flex gap-2 items-center justify-between text-white/50 text-xs">
        <div className="flex gap-1 items-center">
          <IconWallet className="h-4 w-4" />
          <p>{denomBalance}</p>
        </div>
        <p>$0</p>
      </div>
    </form>
  );
};
