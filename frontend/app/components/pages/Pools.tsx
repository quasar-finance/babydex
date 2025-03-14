"use client";
import Input from "../atoms/Input";
import { mockPools } from "~/utils/consts";
import { Button } from "../atoms/Button";
import Pill from "../atoms/Pill";
import { twMerge } from "~/utils/twMerge";
import AssetsStacked from "../atoms/AssetsStacked";
import { useModal } from "~/app/providers/ModalProvider";
import { ModalTypes } from "~/types/modal";
import { trpc } from "~/trpc/client";

import type React from "react";
import PoolsSkeleton from "../molecules/skeletons/PoolsSkeleton";
import { CellPoolName } from "../atoms/cells/CellPoolName";

const Pools: React.FC = () => {
  const { showModal } = useModal();
  const { data: pools = [], isLoading } = trpc.local.pools.getPools.useQuery();

  const gridClass = "grid-cols-[2fr_1fr_1fr_1fr_1fr_2fr] gap-3";

  return (
    <div className="flex flex-col gap-8 px-4 pb-20">
      <div className="flex gap-3 justify-between items-center">
        <h1 className="text-xl">Pools</h1>
        <div className="flex gap-3 h-[42px] items-center px-2">
          <Input isSearch placeholder="Search" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className={twMerge("grid  px-4 text-xs text-white/50", gridClass)}>
          <p>Pool</p>
          <p>TVL</p>
          <p>APR</p>
          <p>Volume 24h</p>
          <p>Fees 24h</p>
          <p></p>
        </div>

        <div>
          {isLoading && <PoolsSkeleton className={gridClass} />}
          {pools.map((pool, i) => (
            <div
              key={pool.name + i}
              className={twMerge(
                "border first:rounded-t-2xl last:rounded-b-2xl border-b-0 last:border-b-1 border-white/10 p-4 grid items-center bg-tw-bg/50 backdrop-blur-md",
                gridClass,
              )}
            >
              <CellPoolName assets={pool.assets} name={pool.name} />
              <div>{pool.poolLiquidity}</div>
              <div>-</div>
              <div>-</div>
              <div>-</div>
              <div className=" flex items-end justify-end">
                <Button
                  variant="flat"
                  onPress={() => showModal(ModalTypes.deposit_lp, true, { pool })}
                >
                  Add Liquidity
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pools;
