import { IconChevronDown, IconWallet } from "@tabler/icons-react";
import type React from "react";
import { type Dispatch, type SetStateAction, useState } from "react";
import RotateButton from "../../atoms/RotateButton";
import { motion } from "motion/react";
import { ModalTypes } from "~/types/modal";
import { useModal } from "~/app/providers/ModalProvider";

import type { BaseCurrency } from "@towerfi/types";
import { useFormContext } from "react-hook-form";
import { useBalances } from "@cosmi/react";
import { convertDenomToMicroDenom, convertMicroDenomToDenom } from "~/utils/intl";

type SwapProps = {
  assets: BaseCurrency[];
  simulate: ({
    amountIn,
    fromDenom,
    tokenDenom,
    direction,
  }: { amountIn: string; fromDenom: string; tokenDenom: string; direction: string }) => void;
  disabled?: boolean;
};

export const Swap: React.FC<SwapProps> = ({ simulate, assets, disabled }) => {
  const [fromToken, setFromToken] = useState(assets[0]);
  const [toToken, setToToken] = useState(assets[1]);
  const { showModal } = useModal();
  const { register, watch, setValue } = useFormContext();

  const { data: balances = [] } = useBalances();

  const fromAmount = watch("fromAmount");
  const toAmount = watch("toAmount");

  const onSelectToken = async (
    setter: Dispatch<SetStateAction<BaseCurrency>>,
    selectedToken: BaseCurrency,
  ) => {
    const { promise, resolve, reject } = Promise.withResolvers<BaseCurrency>();
    showModal(ModalTypes.select_asset, false, {
      onSelectAsset: resolve,
      onClose: reject,
      assets: assets.filter((asset) => asset.symbol !== selectedToken.symbol),
    });
    promise.then(setter).catch(() => {});
  };

  const onRotate = () => {
    const fToken = { ...fromToken };
    const tToken = { ...toToken };
    setFromToken(tToken);
    setToToken(fToken);
    setValue("fromAmount", toAmount);
    setValue("toAmount", fromAmount);
  };

  const { toBalance, fromBalance } = balances.reduce(
    (acc, { denom, amount }) => {
      if (denom === toToken.denom) acc.toBalance = amount;
      if (denom === fromToken.denom) acc.fromBalance = amount;
      return acc;
    },
    { toBalance: "0", fromBalance: "0" },
  );

  const toDenomBalance = convertMicroDenomToDenom(toBalance, toToken.decimals);
  const fromDenomBalance = convertMicroDenomToDenom(fromBalance, fromToken.decimals);

  return (
    <div className="flex flex-col gap-2 w-full items-center justify-center">
      <div className="w-full rounded-xl p-4 bg-tw-bg flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <motion.button
            disabled={disabled}
            type="button"
            className="flex items-center gap-2 p-2 bg-white/5 rounded-full"
            onClick={() => onSelectToken(setFromToken, toToken)}
          >
            <img src={fromToken.logoURI} alt={fromToken.symbol} className="w-7 h-7" />
            <p>{fromToken.symbol}</p>
            <IconChevronDown className="h-4 w-4" />
          </motion.button>
          <input
            className="text-2xl w-[8rem] bg-transparent text-right"
            placeholder="0"
            {...register("fromAmount", {
              validate: (value) => {
                if (value === "") return "Amount is required";
                if (Number.isNaN(+value)) return "Only enter digits to bond to a vault";
                if (Number(value) > Number(fromDenomBalance)) return "Insufficient Amount";
                if (Number(value) <= 0) return "Amount must be greater than 0";
              },
              onChange: (e) => {
                if (e.target.value === "") return e;
                simulate({
                  amountIn: convertDenomToMicroDenom(e.target.value, fromToken.decimals),
                  fromDenom: fromToken.denom,
                  tokenDenom: toToken.denom,
                  direction: "lineal",
                });
                return e;
              },
            })}
          />
        </div>
        <div className="flex items-center justify-between text-white/50 text-xs">
          <div className="flex items-center gap-1 ">
            <IconWallet className="w-4 h-4" />
            <p>{fromDenomBalance}</p>
          </div>
          <p>$0</p>
        </div>
      </div>
      <RotateButton onClick={onRotate} />
      <div className="w-full rounded-xl p-4 bg-tw-bg">
        <div className="flex items-center justify-between gap-2">
          <motion.button
            type="button"
            disabled={disabled}
            className="flex items-center gap-2 p-2 bg-white/5 rounded-full"
            onClick={() => onSelectToken(setToToken, fromToken)}
          >
            <img src={toToken.logoURI} alt={toToken.symbol} className="w-7 h-7" />
            <p>{toToken.symbol}</p>
            <IconChevronDown className="h-4 w-4" />
          </motion.button>
          <input
            className="text-2xl bg-transparent text-right w-[8rem]"
            placeholder="0"
            {...register("toAmount", {
              validate: (value) => {
                if (value === "") return "Amount is required";
                if (Number.isNaN(+value)) return "Only enter digits to bond to a vault";
                if (Number(value) > Number(toDenomBalance)) return "Insufficient Amount";
                if (Number(value) <= 0) return "Amount must be greater than 0";
              },
              onChange: (e) => {
                if (e.target.value === "") return e;
                simulate({
                  amountIn: convertDenomToMicroDenom(e.target.value, toToken.decimals),
                  fromDenom: toToken.denom,
                  tokenDenom: fromToken.denom,
                  direction: "reverse",
                });
                return e;
              },
            })}
          />
        </div>
      </div>
    </div>
  );
};
