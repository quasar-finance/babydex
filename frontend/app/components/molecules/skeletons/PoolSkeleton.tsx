import type React from "react";
import Skeleton from "../../atoms/Skeleton";
import { Fragment } from "react";

interface Props {
  className?: string;
}

const PoolSkeleton: React.FC<Props> = ({ className = "" }) => {
  return (
    <Fragment>
      <div className="flex flex-col lg:flex-row lg:space-x-14 space-y-6">
        <div className="flex-1 p-4">
          <Skeleton className="h-16 w-2/3 mb-4" />

          <Skeleton className="h-8 w-full mb-8" />

          <Skeleton className="h-28 w-full mb-8 rounded-2xl" />

          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl">My Positions</h2>

          <Skeleton className="h-24 w-full mb-4 mt-8" />

          <div className="flex gap-6 h-[42px] items-center mt-8 mb-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-12 w-1/3" />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PoolSkeleton;
