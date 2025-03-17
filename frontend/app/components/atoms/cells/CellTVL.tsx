import type React from "react";
import AssetsStacked from "../AssetsStacked";
import Pill from "../Pill";
import type { PoolInfo } from "@towerfi/types";
import { twMerge } from "~/utils/twMerge";

interface Props extends Pick<PoolInfo, "poolLiquidity"> {
  className?: string;
}

export const CellTVL: React.FC<Props> = ({ poolLiquidity, className }) => {
  return (
    <div className={twMerge("flex flex-col gap-2", className)}>
      <p className="text-xs text-white/50 lg:hidden">TVL</p>
      <div className="flex items-center  justify-between gap-3">
        <p>{poolLiquidity}</p>
      </div>
    </div>
  );
};
