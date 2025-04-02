import type React from "react";
import { twMerge } from "~/utils/twMerge";
import Skeleton from "../../atoms/Skeleton";
import AssetsStacked from "../../atoms/AssetsStacked";
import Pill from "../../atoms/Pill";
import { Button } from "../../atoms/Button";
import { TableRow } from "../../atoms/Table";
import { IconDots } from "@tabler/icons-react";

interface Props {
  className?: string;
}

const PoolsDashboardSkeleton: React.FC<Props> = ({ className = "" }) => {
  return (
    <>
      {Array.from({ length: 2 }).map((_, i) => {
        return (
          <TableRow key={"skeleton" + i} gridClass={twMerge("flex flex-wrap lg:grid ", className)}>
            <div className="flex flex-col gap-2 order-1 col-span-1 w-[80%] lg:w-auto">
              <div className=" flex items-center  justify-between gap-3">
                <div className="flex items-center gap-3 w-full">
                  <AssetsStacked />
                  <Skeleton className="w-full flex-1 h-6 min-w-[3rem]" />
                </div>
                <Pill className="animate-pulse ">type</Pill>
              </div>
            </div>
            <div className="flex flex-col gap-2 order-3 w-[45%] lg:w-auto">
              <p className="text-xs text-white/50 lg:hidden">APR</p>
              <Skeleton className="w-full h-6" />
            </div>
            <div className="flex flex-col gap-2 order-4 w-[45%] lg:w-auto">
              <p className="text-xs text-white/50 lg:hidden">Staked</p>
              <Skeleton className="w-full h-6" />
            </div>
            {/* <div className="flex flex-col gap-2 order-5 w-[45%] lg:w-auto">
              <p className="text-xs text-white/50 lg:hidden">Unstaked</p>
              <Skeleton className="w-full h-6" />
            </div> */}
            <div className="flex flex-col gap-2 order-6 w-[45%] lg:w-auto">
              <p className="text-xs text-white/50 lg:hidden text-nowrap">Claimable Rewards</p>
              <div className="flex gap-2 items-center">
                <Skeleton className="w-full h-6 flex-1 min-w-[3rem]" />
                <Button color="secondary" size="sm">
                  Claim
                </Button>
              </div>
            </div>
            <div className="flex-col gap-2 order-2 lg:order-7 flex items-end justify-end w-fit lg:w-auto">
              <Button color="tertiary" radius="sm" size="icon" className="mt-4 lg:mt-0" isDisabled>
                <IconDots className="w-6 h-6" />
              </Button>
            </div>
          </TableRow>
        );
      })}
    </>
  );
};

export default PoolsDashboardSkeleton;
