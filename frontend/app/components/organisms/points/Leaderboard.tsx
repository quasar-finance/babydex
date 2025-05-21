import type React from "react";
import { Table, type Column } from "../../atoms/Table";
import { twMerge } from "~/utils/twMerge";
import { trpc } from "~/trpc/client";
import Skeleton from "../../atoms/Skeleton";
import { useAccount } from "@cosmi/react";
import type { Points } from "@towerfi/types";
import { useMemo } from "react";

export const Leaderboard: React.FC<{ userPoints: Points }> = ({ userPoints }) => {
  const { data: allPoints, isLoading: allPointsLoading } = trpc.edge.indexer.getPoints.useQuery({
    addresses: [],
    limit: 50,
  });
  const { address: userAddress } = useAccount();

  const allPointsWithUser = useMemo(() => {
    if (!allPoints) {
      return null;
    }

    if (!userPoints.address) {
      return allPoints;
    }

    const currentUserPoints = allPoints[userPoints.address];
    // if userPoints is not in allPoints, add it
    if (!currentUserPoints) {
      allPoints[userPoints.address] = {
        ...userPoints,
      };
    }

    return allPoints;
  }, [allPoints, userAddress, userPoints]);

  const columns: Column[] = [
    { key: "position", title: "Position" },
    { key: "user", title: "User" },
    { key: "totalPoints", title: "Total Points" },
  ];

  const gridClass = "grid-cols-2 grid-cols-[auto_2fr_1fr] lg:grid-cols-[1fr_5fr_2fr] gap-4";

  if (allPointsLoading) {
    return (
      <Table columns={columns} gridClass={gridClass} bodyClass="gap-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={twMerge("grid rounded-2xl p-4 items-center bg-[#1b1b1b] my-1", gridClass)}
          >
            <div className="col-span-1 flex flex-col gap-2">
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="col-span-1 flex flex-col gap-2">
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="col-span-1 flex flex-col gap-2">
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </Table>
    );
  }

  if (!allPointsWithUser) {
    return (
      <Table columns={columns} gridClass={gridClass} bodyClass="gap-0">
        <div className="grid rounded-2xl p-4 items-center bg-[#1b1b1b] my-1">
          <div className="col-span-1 flex flex-col gap-2">No data available</div>
        </div>
      </Table>
    );
  }

  return (
    <Table columns={columns} gridClass={gridClass} bodyClass="gap-0">
      {Object.entries(allPointsWithUser).map(([address, points], index) => (
        <div
          key={index}
          className={twMerge(
            "grid rounded-2xl p-4 items-center bg-[#1b1b1b] my-1",
            address === userAddress &&
              "sticky top-20 bottom-1 backdrop-blur-sm bg-yellow-500/10 border-yellow-500 border",
            gridClass,
          )}
        >
          <div className="col-span-1 flex flex-col gap-2">{points.rank}</div>
          <div className="col-span-1 flex flex-col gap-2 truncate">
            <span className="block lg:hidden">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
            <span className="hidden lg:block">
              {address}
              {address === userAddress && (
                <span
                  className="text-yellow-500"
                  style={{ textShadow: "rgba(238, 173, 33, 0.8) 0 0 20px" }}
                >
                  &nbsp; (Your Address)
                </span>
              )}
            </span>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            {points.total_points.toLocaleString(undefined, {
              maximumFractionDigits: points.total_points > 1 ? 0 : 3,
            })}
          </div>
        </div>
      ))}
    </Table>
  );
};
