import type { BaseCurrency } from "@towerfi/types";
import type { Control } from "react-hook-form";
import { convertMicroDenomToDenom } from "~/utils/intl";
import { motion } from "motion/react";
import { IconChevronDown, IconWallet } from "@tabler/icons-react";

import { ModalTypes } from "~/types/modal";
import { useModal } from "~/app/providers/ModalProvider";
import { Assets } from "~/config";
import { useBalances } from "@cosmi/react";

type AssetInputProps = {
  asset: BaseCurrency;
  name: string;
  disabled?: boolean;
  onSelect: (asset: BaseCurrency) => void;
  control: Control;
  onFocus?: () => void;
};

const assets = Object.values(Assets);

export const AssetInput: React.FC<AssetInputProps> = ({
  name,
  asset,
  onSelect,
  onFocus,
  disabled,
  control,
}) => {
  const { showModal } = useModal();
  const { register } = control;

  const { data: balances = [] } = useBalances();

  const selectAsset = async () => {
    const { promise, resolve, reject } = Promise.withResolvers<BaseCurrency>();

    showModal(ModalTypes.select_asset, false, {
      onSelectAsset: resolve,
      onClose: reject,
      assets: assets.filter((a) => a.symbol !== asset.symbol),
    });

    promise.then(onSelect).catch(() => {});
  };

  const { amount: balance = "0" } = balances.find(({ denom }) => denom === asset.denom) || {};

  const denomBalance = convertMicroDenomToDenom(balance, asset.decimals);

  return (
    <div className="w-full rounded-xl p-4 bg-tw-bg flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <motion.button
          type="button"
          disabled={disabled}
          className="flex items-center gap-2 p-2 bg-white/5 rounded-full"
          onClick={selectAsset}
        >
          <img src={asset.logoURI} alt={asset.symbol} className="w-7 h-7" />
          <p>{asset.symbol}</p>
          <IconChevronDown className="h-4 w-4" />
        </motion.button>

        <input
          className="text-2xl bg-transparent text-right w-[8rem]"
          placeholder="0"
          {...register(name, {
            validate: (value) => {
              if (value === "") return "Amount is required";
              if (Number.isNaN(+value)) return "Only enter number digits";
              if (Number(value) > Number(denomBalance)) return "Insufficient Amount";
              if (Number(value) <= 0) return "Amount must be greater than 0";
            },
          })}
          onFocus={onFocus}
          disabled={disabled}
        />
      </div>

      <div className="flex items-center justify-between text-white/50 text-xs">
        <div className="flex items-center gap-1 ">
          <IconWallet className="w-4 h-4" />
          <p>{denomBalance}</p>
        </div>
        <p>$0</p>
      </div>
    </div>
  );
};
