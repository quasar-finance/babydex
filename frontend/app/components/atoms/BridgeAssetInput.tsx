import type { Currency } from "@towerfi/types";
import { useController, type Control } from "react-hook-form";
import { convertMicroDenomToDenom, IntlAddress } from "~/utils/intl";
import { motion } from "motion/react";
import { IconChevronDown, IconWallet } from "@tabler/icons-react";

import { ModalTypes } from "~/types/modal";
import { useModal } from "~/app/providers/ModalProvider";
import { Assets } from "~/config";
import { useAccount, useBalances } from "@cosmi/react";
import { assetNumberMask } from "~/utils/masks";
import { useUserBalances } from "~/app/hooks/useUserBalances";
import Divider from "./Divider";

type BridgeAssetInputProps = {
  assets: Currency[];
  name: string;
  disabled?: boolean;
  onSelect: (asset: Currency) => void;
  control: Control;
  mask?: (v: string) => string | null;
  onFocus?: () => void;
  validateBalance?: boolean;
};

const assets = Object.values(Assets);

export const BridgeAssetInput: React.FC<BridgeAssetInputProps> = ({
  name,
  assets: assetsSelected,
  onSelect,
  onFocus,
  disabled,
  control,
  validateBalance = true,
  mask = assetNumberMask,
}) => {
  const { showModal } = useModal();
  const { address = "", connector, chain, isConnected: isCosmosConnected } = useAccount();

  const { field: inputField } = useController({
    name,
    control,
    defaultValue: "",
    rules: {
      validate: (value) => {
        if (value === "") return "Amount is required";
        if (Number.isNaN(+value)) return "Only enter number digits";
        if (Number(value) <= 0) return "Amount must be greater than 0";

        if (validateBalance && Number(value) > Number(denomBalance)) return "Insufficient Amount";
      },
    },
  });

  const setValue = (value: string) => inputField.onChange(value);

  const { data: balances = [] } = useUserBalances({
    assets: assetsSelected,
  });

  const selectAsset = async () => {
    const { promise, resolve, reject } = Promise.withResolvers<Currency>();

    const filteredTokens = assets.filter(
      (a) => !assetsSelected.some((selected) => selected.symbol === a.symbol),
    );

    showModal(ModalTypes.select_bridge_asset, false, {
      onSelectAsset: resolve,
      onClose: reject,
      assets: filteredTokens,
    });

    promise.then(onSelect).catch(() => {});
  };

  const asset = assetsSelected[0];

  const { amount: balance = "0" } = balances.find(({ denom }) => denom === asset.denom) || {};

  const denomBalance = convertMicroDenomToDenom(balance, asset.decimals);

  return (
    <div className="w-full rounded-xl bg-tw-bg flex flex-col">
      <div className="w-full p-4 flex flex-col gap-2">
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
            {...inputField}
            className="text-2xl bg-transparent text-right w-[8rem]"
            placeholder="0"
            onFocus={onFocus}
            disabled={disabled}
            onChange={(e) => {
              if (!mask) setValue(e.target.value);
              else {
                if (e.target.value === "") return setValue("");
                const v = mask(e.target.value);
                if (v) setValue(v);
              }
            }}
          />
        </div>

        <div className="flex items-center justify-between text-white/50 text-xs cursor-pointer">
          <div
            className="flex items-center gap-1"
            onClick={() => setValue(denomBalance.toString())}
          >
            <IconWallet className="w-4 h-4" />
            <p>{denomBalance}</p>
          </div>
          <p>$0</p>
        </div>
      </div>
      <Divider dashed />
      <div className="flex items-center justify-between p-4 text-xs">
        <div className="flex gap-1 items-center">
          <span className="text-white/50">on</span>
          <img
            src="https://osmosis.zone/assets/icons/osmo-logo-icon.svg"
            alt={asset.symbol}
            className="w-5 h-5"
          />
          <p>Osmosis</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-white/50">{name === "fromAmount" ? "from" : "to"}</span>
          {name === "fromAmount" ? (
            <div className="flex gap-1 items-center">
              <img
                src={`https://raw.githubusercontent.com/quasar-finance/quasar-resources/main/assets/wallet/${connector?.id}.webp`}
                alt="wallet"
                className="w-5 h-5"
              />
              <p>{IntlAddress(address)}</p>
            </div>
          ) : (
            <div
              className="flex gap-1 items-center cursor-pointer"
              onClick={() =>
                showModal(ModalTypes.select_address, false, {
                  address: "0xCe8cb15036F11084cA5d587D6962722978100456",
                  onChangeAddress: () => {},
                })
              }
            >
              <img
                src="https://raw.githubusercontent.com/quasar-finance/quasar-resources/main/assets/wallet/metamask.webp"
                alt="wallet"
                className="w-5 h-5"
              />
              <p className="underline decoration-dashed underline-offset-4 decoration">
                {IntlAddress("0xCe8cb15036F11084cA5d587D6962722978100456")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
