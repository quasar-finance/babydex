import { twMerge } from '~/utils/twMerge';
import { Button } from '../../atoms/Button';
import { trpc } from '~/trpc/client';
import { useAccount } from '@cosmi/react';

const Claim: React.FC<{ className: string }> = ({ className }) => {
  const { address: userAddress } = useAccount();

  const { data: pointsData } = trpc.edge.indexer.getPoints.useQuery({ addresses: userAddress ? [userAddress] : [], limit: 1 }, { enabled: !!userAddress });

  const totalPoints = userAddress ? pointsData?.[userAddress]?.total_points ?? 0 : 0;

  return (
    <div className={twMerge('p-4 border bg-origin-border border-white/10 rounded-2xl bg-gradient-to-r from-transparent via-transparent via-30% to-tw-orange-500/85', className)}>
      <h2 className="text-lg font-bold mb-2">Claim BABY as Point Rewards</h2>
      <p className="text-sm text-white/70 mb-4">
        Your are eligible to claim {totalPoints.toLocaleString(undefined, { maximumFractionDigits: totalPoints > 1 ? 0 : 3 })} BABY tokens for your BabyDex Points.
      </p>
      {!userAddress && <p className="text-xs text-white/70 mb-4">Connect your wallet to view and claim your BABY rewards.</p>}
      {userAddress && (
        <Button
          size="md"
          className="rounded-xl"
          onPress={() => {
            // Dummy claim for now
            console.log('Claim Successful');
          }}
        >
          <span className="text-sm">Claim</span>
        </Button>
      )}
    </div>
  );
};

export default Claim;
