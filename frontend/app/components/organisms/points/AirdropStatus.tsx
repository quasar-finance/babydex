import { useAccount } from '@cosmi/react';
import { useMemo } from 'react';
import airdropData from '~/constants/airdrop_final.json';
import { useModal } from '~/app/providers/ModalProvider';
import { ModalTypes } from '~/types/modal';
import { twMerge } from '~/utils/twMerge';
import { Button } from '../../atoms/Button';

type AirdropRecord = {
  baby_tokens: number;
};

type AirdropStatusView = 'disconnected' | 'eligible' | 'ineligible';

const formatTokenAmount = (amount: number) =>
  amount.toLocaleString(undefined, {
    maximumFractionDigits: amount >= 1 ? 0 : 4,
  });

const typedAirdropData = airdropData as Record<string, AirdropRecord>;

const AirdropStatus: React.FC<{ className: string }> = ({ className }) => {
  const { address: userAddress } = useAccount();
  const { showModal } = useModal();

  const { view, amount } = useMemo(() => {
    if (!userAddress) {
      return { view: 'disconnected' as AirdropStatusView };
    }

    const normalizedAddress = userAddress.toLowerCase();
    const record = typedAirdropData[normalizedAddress];

    if (record && typeof record.baby_tokens === 'number' && record.baby_tokens > 0) {
      return { view: 'eligible' as AirdropStatusView, amount: record.baby_tokens };
    }

    return { view: 'ineligible' as AirdropStatusView };
  }, [userAddress]);

  return (
    <div className={twMerge('p-4 border bg-origin-border border-white/10 rounded-2xl bg-gradient-to-r from-transparent via-transparent via-30% to-tw-orange-500/85', className)}>
      <h2 className="text-lg font-bold mb-3">Points Airdrop Completed on Nov 15th</h2>

      {view === 'disconnected' && (
        <>
          <p className="text-sm text-white/70 mb-4">The $BABY token airdrop was sent to eligible wallets on Nov 15th. Connect Wallet to see how much you received.</p>
          <Button size="md" className="rounded-xl" onPress={() => showModal(ModalTypes.connect_wallet)}>
            Connect Wallet
          </Button>
        </>
      )}

      {view === 'eligible' && typeof amount === 'number' && (
        <p className="text-sm text-white/70">
          You received <strong>{formatTokenAmount(amount)} $BABY tokens</strong>
        </p>
      )}

      {view === 'ineligible' && <p className="text-sm text-white/70">You were not eligible for the airdrop</p>}
    </div>
  );
};

export default AirdropStatus;
