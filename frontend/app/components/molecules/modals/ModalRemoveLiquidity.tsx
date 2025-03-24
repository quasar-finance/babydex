import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "~/app/components/atoms/Button";
import BasicModal from "~/app/components/templates/BasicModal";
import { twMerge } from "~/utils/twMerge";

import IconCoins from "~/app/components/atoms/icons/IconCoins";
import Divider from "~/app/components/atoms/Divider";

import type { PoolInfo } from "@towerfi/types";
import { useAccount } from "@cosmi/react";
import { ModalTypes } from "~/types/modal";
import { useModal } from "~/app/providers/ModalProvider";
import { SingleSideAddLiquidity } from "../SingleSideAddLiquidity";
import { DoubleSideAddLiquidity } from "../DoubleSideAddLiquidity";
import { FormProvider, useForm } from "react-hook-form";
import AssetsStacked from "../../atoms/AssetsStacked";
import Pill from "../../atoms/Pill";
import Input from "../../atoms/Input";
import { RangeSelector } from "../../atoms/RangeSelector";

interface ModalRemoveLiquidityProps {
  pool: PoolInfo;
}

const ModalRemoveLiquidity: React.FC<ModalRemoveLiquidityProps> = ({ pool }) => {
  const { name } = pool;

  const { assets } = pool;
  const [percentage, setPercentage] = useState(50);

  return (
    <BasicModal
      title="Remove Liquidity"
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
            <p className="text-sm text-white/50">Remove</p>
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
            <p className="text-sm text-white/50">of Liquidity</p>
          </div>
          <RangeSelector value={percentage} onChange={setPercentage} />
        </div>
        <Divider dashed />
        <div className="p-4">
          <Button fullWidth>Remove Liquidity</Button>
        </div>
      </form>
    </BasicModal>
  );
};

export default ModalRemoveLiquidity;
