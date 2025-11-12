'use client';

import { Overview } from '../organisms/points/Overview';
import { trpc } from '~/trpc/client';
import { useAccount } from '@cosmi/react';
import WithConnectedWallet from '../atoms/WithConnectedWallet';
import type React from 'react';
import { useMemo } from 'react';
import AirdropStatus from '../organisms/points/AirdropStatus';
import airdropData from '~/constants/airdrop_final.json';

type AirdropRecord = {
  points_after_boost?: number;
};

const typedAirdropData = airdropData as Record<string, AirdropRecord>;

const Points: React.FC = () => {
  const { address: userAddress } = useAccount();
  const { data: userPoints } = trpc.edge.indexer.getPoints.useQuery(
    {
      addresses: [userAddress || ''],
      limit: 1,
    },
    {
      enabled: !!userAddress,
    }
  );

  const totalPoints = useMemo(() => {
    if (!userAddress) {
      return undefined;
    }

    const normalizedAddress = userAddress.toLowerCase();
    const record = typedAirdropData[normalizedAddress];

    if (record && typeof record.points_after_boost === 'number') {
      return record.points_after_boost;
    }

    const pointsFromIndexer = userPoints?.[normalizedAddress]?.total_points;
    return typeof pointsFromIndexer === 'number' ? pointsFromIndexer : 0;
  }, [userAddress, userPoints]);

  return (
    <div className="flex flex-col gap-8 px-4 pb-20 max-w-[84.5rem] mx-auto w-full min-h-[65vh] lg:pt-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">My Points</h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 p-4 border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <img src={'/tower/points.png'} alt="Tower Points" className="w-auto h-[24px]" />
              <h2 className="text-lg">BabyDex Points</h2>
            </div>
          </div>
          <div className="mt-4 lg:mt-8">
            <WithConnectedWallet>
              <Overview totalPoints={totalPoints} />
            </WithConnectedWallet>
          </div>
        </div>

        <AirdropStatus className="flex-1" />
      </div>
    </div>
  );
};

export default Points;
