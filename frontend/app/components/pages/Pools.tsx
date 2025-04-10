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
import { useEffect, useState } from "react";
import { Pagination } from "../atoms/Pagination";
import { blockedPoolAddresses } from "~/utils/consts";

const columns = [
  { key: "name", title: "Pool", className: "col-span-2 lg:col-span-1" },
  { key: "poolLiquidity", title: "TVL" },
  { key: "apr", title: "APR" },
  /* { key: "volume", title: "Volume 24h" },
  { key: "fees", title: "Fees 24h" }, */
  { key: "actions", title: "" },
];

const Pools: React.FC = () => {
  const { showModal } = useModal();
  const gridClass = "grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-3";
  const { data: pools = [], isLoading } = trpc.local.pools.getPools.useQuery({
    limit: 100,
  });
  const [searchText, setSearchText] = useState("");

  const filteredPools = pools
    .filter((pool) => !blockedPoolAddresses.includes(pool.poolAddress))
    .filter((pool) => pool.name.toLowerCase().includes(searchText.toLowerCase()));

  useEffect(() => {
    setCurrentPage(0);
  }, [searchText]);

  const [currentPage, setCurrentPage] = useState(0);
  const numberPerPage = 10;
  const totalPools = Math.ceil(filteredPools.length / numberPerPage);

  return (
    <div className="flex flex-col gap-8 px-4 pb-20 max-w-[84.5rem] mx-auto w-full min-h-[65vh] lg:pt-8">
      <div className="flex gap-3 justify-between items-center lg:pl-3 lg:pr-2 pl-3">
        <h1 className="text-xl">Pools</h1>
        <div className="flex gap-3 h-[42px] items-center px-2">
          <Input
            isSearch
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      <Table columns={columns} gridClass={gridClass}>
        {isLoading && <PoolsSkeleton className={twMerge("grid", gridClass)} />}
        {filteredPools
          .slice(currentPage * numberPerPage, currentPage * numberPerPage + numberPerPage)
          .map((pool, i) => (
            <TableRow key={i} gridClass={twMerge("grid", gridClass)}>
              <CellPoolName
                assets={pool.assets}
                name={pool.name}
                poolType={pool.poolType}
                config={pool.config}
              />
              <CellTVL poolLiquidity={pool.poolLiquidity} />
              <CellData title="APR" />
              {/* <CellData title="Volume 24h" />
            <CellData title="Fees 24h" /> */}
              <div className="flex lg:items-end lg:justify-end">
                <Button
                  variant="flat"
                  onPress={() => showModal(ModalTypes.add_liquidity, false, { pool })}
                >
                  Add Liquidity
                </Button>
              </div>
            </TableRow>
          ))}
      </Table>
      {filteredPools.length > numberPerPage && (
        <Pagination
          total={totalPools}
          onPageChange={(page) => setCurrentPage(page - 1)}
          initialPage={currentPage + 1}
          className={{ base: "self-center backdrop-blur-xl rounded-3xl p-1" }}
        />
      )}
    </div>
  );
};

export default Pools;
