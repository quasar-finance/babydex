import { useAccount } from "@cosmi/react";
import CopyMessage from "../atoms/CopyMessage";
import { IntlAddress } from "~/utils/intl";
import { IconCopy, IconLogout } from "@tabler/icons-react";
import { Button } from "../atoms/Button";

export const WalletDetails: React.FC = () => {
  const { address = "", connector, chain, isConnected } = useAccount();

  const handleDisconnect = () => connector?.disconnect?.();

  if (!isConnected) return null;

  return (
    <>
      <h3 className="text-sm text-tw-gray-200">
        Connected to <span className="font-bold">{chain?.name}</span>
      </h3>
      <div className="w-full rounded-xl bg-tw-orange-400/20 p-2 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <img
            src={`https://raw.githubusercontent.com/quasar-finance/quasar-resources/main/assets/wallet/${connector?.id}.webp`}
            alt="wallet"
            className="w-10 h-10"
          />
          <div className="flex flex-col">
            <p className="text-xs">
              <span className="text-tw-orange-400">{connector?.name} Wallet</span>
            </p>
            <CopyMessage textToCopy={address}>
              <p className="flex gap-2">
                {IntlAddress(address)} <IconCopy className="w-4 h-4" />
              </p>
            </CopyMessage>
          </div>
        </div>
      </div>
      <Button fullWidth variant="ghost" onPress={handleDisconnect}>
        <span>Disconnect</span>
        <IconLogout className="w-4 h-4" />
      </Button>
    </>
  );
};
