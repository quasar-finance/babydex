import type { BaseCurrency } from "@towerfi/types";
import type React from "react";
import { convertMicroDenomToDenom } from "~/utils/intl";
import { twMerge } from "~/utils/twMerge";
import Skeleton from "./Skeleton";

interface Props {
  asset: BaseCurrency;
  balance: number | string;
  style?: "bordered" | "background";
  isLoading?: boolean;
}

export const AssetAmountSquare: React.FC<Props> = ({
  asset,
  balance,
  style = "background",
  isLoading,
}) => {
  return (
    <div
      className={twMerge(
        "flex-1 flex flex-col gap-2  p-4 rounded-2xl",
        { "border border-white/10": style.includes("bordered") },
        { "bg-white/10": style.includes("background") },
      )}
    >
      {isLoading ? (
        <Skeleton className="h-[52px] w-full" />
      ) : (
        <>
          <div className="flex gap-1 items-center  select-none">
            <img
              src={asset.logoURI}
              alt={asset.symbol}
              className="w-5 h-5 grayscale"
              draggable={false}
            />
            <p className="text-white/50 text-sm">{asset.symbol}</p>
          </div>
          <p>{convertMicroDenomToDenom(balance, asset.decimals)}</p>
        </>
      )}
    </div>
  );
};
