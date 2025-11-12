'use client';

import { Button } from '../atoms/Button';
import { DefaultPoints } from '~/utils/consts';
import { Overview } from '../organisms/points/Overview';
import { Leaderboard } from '../organisms/points/Leaderboard';
import Pill from '../atoms/Pill';
import { trpc } from '~/trpc/client';
import { useAccount } from '@cosmi/react';
import WithConnectedWallet from '../atoms/WithConnectedWallet';
import type React from 'react';
import { useMemo } from 'react';
import Link from 'next/link';
import AirdropStatus from '../organisms/points/AirdropStatus';

const GetPointsButton: React.FC<{ className: string }> = ({ className }) => (
  <Button as={Link} color="tertiary" className={className} target="_blank" href="https://docs.tower.fi/user-guides/points-campaigns">
    Get Points Now
  </Button>
);

const Points: React.FC = () => {
  const { address: userAddress } = useAccount();
  const { data: userPoints, isLoading: _userPointsLoading } = trpc.edge.indexer.getPoints.useQuery(
    {
      addresses: [userAddress || ''],
      limit: 1,
    },
    {
      enabled: !!userAddress,
    }
  );

  const userPointsData = useMemo(() => userPoints?.[userAddress || ''] || DefaultPoints(), [userPoints, userAddress]);

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
              <img src={'/tower/points.png'} alt="Tower Points" className="w-auto h-[24px]" />
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

        <AirdropStatus className="w-full lg:w-[35%]" />
      </div>
    </div>
  );
};

export default Points;
