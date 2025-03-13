import type React from "react";
import { twMerge } from "~/utils/twMerge";
import Skeleton from "../../atoms/Skeleton";
import AssetsStacked from "../../atoms/AssetsStacked";
import Pill from "../../atoms/Pill";
import { Button } from "../../atoms/Button";

interface Props {
  className?: string;
}

const PoolsSkeleton: React.FC<Props> = ({ className }) => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => {
        return (
          <div
            key={"skeleton" + i}
            className={twMerge(
              "border first:rounded-t-2xl last:rounded-b-2xl border-b-0 last:border-b-1 border-white/10 p-4 grid items-center",
              className,
            )}
          >
            <div className=" flex items-center  justify-between gap-3">
              <div className="flex items-center gap-3 w-full">
                <AssetsStacked />
                <Skeleton className="w-full h-6" />
              </div>
              <Pill className="animate-pulse ">-%</Pill>
            </div>
            <Skeleton className="w-full h-6" />

            <Skeleton className="w-full h-6" />

            <Skeleton className="w-full h-6" />

            <Skeleton className="w-full h-6" />

            <div className=" flex items-end justify-end">
              <Button variant="flat" className="bg-white/10 text-white/20 animate-pulse">
                Add Liquidity
              </Button>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default PoolsSkeleton;
