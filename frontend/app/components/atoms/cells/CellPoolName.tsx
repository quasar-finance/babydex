import type React from "react";
import AssetsStacked from "../AssetsStacked";
import Pill from "../Pill";
import type { PoolInfo } from "@towerfi/types";

type Props = Pick<PoolInfo, "assets" | "name">;

export const CellPoolName: React.FC<Props> = ({ assets, name }) => {
  return (
    <div className=" flex items-center  justify-between gap-3">
      <div className="flex items-center gap-3">
        <AssetsStacked assets={assets} />
        <span>{name}</span>
      </div>
      <Pill>0,3%</Pill>
    </div>
  );
};
