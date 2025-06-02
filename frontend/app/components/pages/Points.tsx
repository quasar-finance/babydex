"use client";

import { bpsToFloat } from "~/utils/intl";
import { Button } from "../atoms/Button";
import { DefaultPoints, inviteBoostBps, pointsShareBps } from "~/utils/consts";
import { Overview } from "../organisms/points/Overview";
import { Leaderboard } from "../organisms/points/Leaderboard";
import Pill from "../atoms/Pill";
import { trpc } from "~/trpc/client";
import { useAccount } from "@cosmi/react";
import WithConnectedWallet from "../atoms/WithConnectedWallet";
import type React from "react";
import { useMemo } from "react";
import Link from "next/link";
import Referral from "../organisms/points/Referral";

const GetPointsButton: React.FC<{ className: string }> = ({ className }) => (
  <Button
    as={Link}
    color="tertiary"
    className={className}
    target="_blank"
    href="https://docs.tower.fi/user-guides/points-campaigns"
  >
    Get Points Now
  </Button>
);

const Points: React.FC = () => {
  const { address: userAddress } = useAccount();
  const { data: userPoints, isLoading: _userPointsLoading } = trpc.edge.indexer.getPoints.useQuery(
    {
      addresses: [userAddress || ""],
      limit: 1,
    },
    {
      enabled: !!userAddress,
    },
  );

  const userPointsData = useMemo(
    () => userPoints?.[userAddress || ""] || DefaultPoints(),
    [userPoints, userAddress],
  );

  return (
    <div className="flex flex-col gap-8 px-4 pb-20 max-w-[84.5rem] mx-auto w-full min-h-[65vh] lg:pt-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">My Points</h1>
        <GetPointsButton className="lg:hidden" />
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[65%] p-4 border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <img src={"/tower/points.png"} alt="Tower Points" className="w-auto h-[24px]" />
              <h2 className="text-lg">BabyDex Points</h2>
            </div>
            <GetPointsButton className="hidden lg:inline-flex" />
          </div>
          <div className="mt-4 lg:mt-8">
            <WithConnectedWallet>
              <Overview points={userPointsData} />
            </WithConnectedWallet>
          </div>
        </div>

        <Referral className="w-full lg:w-[35%]" />
      </div>
      <div className="flex flex-col my-4 gap-4 lg:px-4">
        <div className="flex flex-col-reverse lg:flex-row gap-6">
          <h1 className="text-2xl">BabyDex Points Leaderboard</h1>
          {userAddress && userPoints?.[userAddress] && (
            <div
              className="flex items-center gap-2 text-yellow-500"
              style={{ textShadow: "rgba(238, 173, 33, 0.8) 0 0 20px" }}
            >
              <Pill color="yellow" className="border border-yellow-500 text-md">
                #{userPoints?.[userAddress]?.rank}
              </Pill>
              <span>On the leaderboard</span>
            </div>
          )}
        </div>
        <p className="text-white/70">
          Earn BabyDex points through Referrals, Providing Liquidity and Swapping on Tower
        </p>
      </div>
      <div>
        <Leaderboard userPoints={userPointsData} />
      </div>
    </div>
  );
};

export default Points;
