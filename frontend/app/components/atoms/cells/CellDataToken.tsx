import type React from "react";
import { twMerge } from "~/utils/twMerge";
import Tooltip from "../Tooltip";
import type { BaseCurrency } from "@towerfi/types";

interface Props {
  title: string;
  data?: number | string | React.ReactNode;
  className?: string;
  tokens?: BaseCurrency[];
}

export const CellDataToken: React.FC<Props> = ({ title, data, className, tokens }) => {
  return (
    <Tooltip
      className="min-w-[10rem]"
      content={
        <div className="flex flex-col gap-3 w-full">
          <p className="text-sm text-tw-orange-400">Total {title}</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-1 text-gray-500">
                <img
                  src={
                    "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/babylontestnet/images/logo.svg"
                  }
                  alt="BTC"
                  className="grayscale w-3 h-3 select-none"
                  draggable={false}
                />
                <p>BTC</p>
              </div>
              <p>0.789</p>
            </div>
            <div className="flex items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-1 text-gray-500 ">
                <img
                  src={
                    "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/babylontestnet/images/logo.svg"
                  }
                  alt="BTC"
                  className="grayscale w-3 h-3"
                />
                <p>BTC</p>
              </div>
              <p>0.789</p>
            </div>
          </div>
        </div>
      }
    >
      <div className={twMerge("flex flex-col gap-2", className)}>
        <p className="text-xs text-white/50 lg:hidden">{title}</p>
        <div className="flex items-center  justify-between gap-3">
          <p>{data ? data : "-"}</p>
        </div>
      </div>
    </Tooltip>
  );
};
