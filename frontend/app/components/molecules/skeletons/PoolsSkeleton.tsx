import type React from "react";
import { twMerge } from "~/utils/twMerge";
import Skeleton from "../../atoms/Skeleton";
import AssetsStacked from "../../atoms/AssetsStacked";
import Pill from "../../atoms/Pill";
import { Button } from "../../atoms/Button";
import { TableRow } from "../../atoms/Table";

interface Props {
  className?: string;
}

const PoolsSkeleton: React.FC<Props> = ({ className = "" }) => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => {
        return (
          <TableRow key={"skeleton" + i} gridClass={className}>
            <div className="flex flex-col gap-2 col-span-2 lg:col-span-1">
              <div className=" flex items-center  justify-between gap-3">
                <div className="flex items-center gap-3 w-full">
                  <AssetsStacked />
                  <Skeleton className="w-full h-6" />
                </div>
                <Pill className="animate-pulse ">type</Pill>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-white/50 lg:hidden">TVL</p>
              <Skeleton className="w-full h-6" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-white/50 lg:hidden">APR</p>
              <Skeleton className="w-full h-6" />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs text-white/50 lg:hidden">Volume 24h</p>
              <Skeleton className="w-full h-6" />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs text-white/50 lg:hidden">Fees 24h</p>
              <Skeleton className="w-full h-6" />
            </div>

            <div className=" flex lg:items-end lg:justify-end">
              <Button variant="flat" className="bg-white/10 text-white/20 animate-pulse">
                Add Liquidity
              </Button>
            </div>
          </TableRow>
        );
      })}
    </>
  );
};

export default PoolsSkeleton;
