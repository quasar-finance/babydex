import BasicModal from "~/app/components/templates/BasicModal";
import { Button } from "~/app/components/atoms/Button";
import Image from "next/image";
import { useModal } from "~/app/providers/ModalProvider";
import { useToast } from "~/app/hooks";

import type React from "react";
import { useAccount, useConnectors } from "@cosmi/react";
import { babylonTestnet } from "~/config/chains/babylon-testnet";
import { useEffect } from "react";

function ConnectorButton({ connector, onClick }: { connector: any; onClick: () => void }) {
  const { name, id, isInstalled } = connector;

  return (
    <Button
      radius="lg"
      variant="faded"
      disabled={!isInstalled}
      onPress={onClick}
      type="button"
      className="flex flex-col p-2 h-fit group overflow-hidden"
    >
      <div className="h-12 w-12 p-1 bg-tw-orange-400 rounded-full relative">
        <Image
          className="w-full h-full rounded-full object-contain relative z-10"
          src={`https://raw.githubusercontent.com/quasar-finance/quasar-resources/main/assets/wallet/${id}.webp`}
          width={40}
          height={40}
          alt={`chain-${name}-${id}`}
          priority
        />
        <span className="bg-tw-orange-400 h-12 w-12 absolute rounded-full top-0 left-0 z-0 group-hover:scale-[5] transition-all duration-400" />
      </div>
      <p className="relative z-10 group-hover:text-tw-bg transition-all duration-400">{name}</p>
    </Button>
  );
}

const ModalConnectWallet: React.FC = () => {
  const connectors = useConnectors();
  const { isConnected } = useAccount();
  const { toast } = useToast();
  const { hideModal } = useModal();

  useEffect(() => {
    if (isConnected) hideModal();
  }, [isConnected]);

  return (
    <BasicModal title="Connect modal">
      <div className="grid grid-cols-2 gap-3">
        {connectors.map((connector) => (
          <ConnectorButton
            key={connector.uid}
            connector={connector}
            onClick={() => connector.connect({ chainId: babylonTestnet.id })}
          />
        ))}
      </div>
    </BasicModal>
  );
};

export default ModalConnectWallet;
