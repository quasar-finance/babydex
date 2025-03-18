"use client";
import Input from "../atoms/Input";
import { Button } from "../atoms/Button";
import { twMerge } from "~/utils/twMerge";
import { useModal } from "~/app/providers/ModalProvider";
import { ModalTypes } from "~/types/modal";
import { trpc } from "~/trpc/client";

import type React from "react";
import PoolsSkeleton from "../molecules/skeletons/PoolsSkeleton";
import { CellPoolName } from "../atoms/cells/CellPoolName";
import { CellTVL } from "../atoms/cells/CellTVL";
import { CellData } from "../atoms/cells/CellData";
import { Table, TableRow } from "../atoms/Table";
import { Pagination } from "../atoms/Pagination";

const columns = [
  { key: "name", title: "Pool", className: "col-span-2 lg:col-span-1" },
  { key: "poolLiquidity", title: "TVL" },
  { key: "apr", title: "APR" },
  { key: "volume", title: "Volume 24h" },
  { key: "fees", title: "Fees 24h" },
  { key: "actions", title: "" },
];

const Pools: React.FC = () => {
  const { showModal } = useModal();
  const { data: pools = [], isLoading } = trpc.local.pools.getPools.useQuery();

  const gridClass = "grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_2fr] gap-3";

  return (
    <div className="flex flex-col gap-8 px-4 pb-20">
      <div className="flex gap-3 justify-between items-center">
        <h1 className="text-xl">Pools</h1>
        <div className="flex gap-3 h-[42px] items-center px-2">
          <Input isSearch placeholder="Search" />
        </div>
      </div>

      <Table columns={columns} gridClass={gridClass}>
        {isLoading && <PoolsSkeleton className={twMerge("grid", gridClass)} />}
        {pools.map((pool, i) => (
          <TableRow key={i} gridClass={twMerge("grid", gridClass)}>
            <CellPoolName assets={pool.assets} name={pool.name} />
            <CellTVL poolLiquidity={pool.poolLiquidity} />
            <CellData title="APR" />
            <CellData title="Volume 24h" />
            <CellData title="Fees 24h" />
            <div className="flex lg:items-end lg:justify-end">
              <Button
                variant="flat"
                onPress={() => showModal(ModalTypes.deposit_lp, true, { pool })}
              >
                Add Liquidity
              </Button>
            </div>
          </TableRow>
        ))}
      </Table>
      <Pagination total={5} className={{ base: "self-center backdrop-blur-xl rounded-3xl p-1" }} />
    </div>
  );
};

export default Pools;
