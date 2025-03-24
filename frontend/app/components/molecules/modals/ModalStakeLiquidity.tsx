import { useState } from "react";
import { Button } from "~/app/components/atoms/Button";
import BasicModal from "~/app/components/templates/BasicModal";
import { twMerge } from "~/utils/twMerge";

import Divider from "~/app/components/atoms/Divider";

import type { PoolInfo } from "@towerfi/types";
import AssetsStacked from "../../atoms/AssetsStacked";
import Pill from "../../atoms/Pill";
import Input from "../../atoms/Input";
import { RangeSelector } from "../../atoms/RangeSelector";

interface Props {
  pool: PoolInfo;
}

export const ModalStakeLiquidity: React.FC<Props> = ({ pool }) => {
  const { name } = pool;

  const { assets } = pool;
  const [percentage, setPercentage] = useState(50);

  return (
    <BasicModal
      title="Stake"
      classNames={{ wrapper: "max-w-md", container: "p-0" }}
      separator={false}
    >
      <form className="flex flex-col w-full">
        <div className={twMerge("col-span-2 lg:col-span-1 flex flex-col gap-2 p-4")}>
          <div className="flex items-center  justify-between gap-3">
            <div className="flex items-center gap-3">
              <AssetsStacked assets={assets} size="lg" />
              <span>{name}</span>
            </div>
            <Pill>0,3%</Pill>
          </div>
        </div>
        <Divider dashed />
        <div className="flex flex-col gap-4 p-4 py-6">
          <div className="flex items-center gap-2">
            <p className="text-sm text-white/50">Stake</p>
            <Input
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="w-[4rem] text-lg rounded-lg"
              endContent={
                <div className="flex gap-2 items-center text-lg">
                  <span className="text-white/10">|</span>
                  <span className="text-white/50">%</span>
                </div>
              }
              value={percentage}
            />
            <p className="text-sm text-white/50">of Unstaked Deposit</p>
          </div>
          <RangeSelector value={percentage} onChange={setPercentage} />
        </div>
        <Divider dashed />
        <div className="p-4">
          <Button fullWidth>Stake</Button>
        </div>
      </form>
    </BasicModal>
  );
};
