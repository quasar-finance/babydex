import BasicModal from "~/app/components/templates/BasicModal";
import { Button } from "~/app/components/atoms/Button";
import Image from "next/image";
import { useModal } from "~/app/providers/ModalProvider";
import { useToast } from "~/app/hooks";

import type React from "react";
import { useAccount, useConnectors } from "@cosmi/react";
import { babylonTestnet } from "~/config/chains/babylon-testnet";
import { useEffect, useState } from "react";
import CopyMessage from "../../atoms/CopyMessage";
import { IntlAddress } from "~/utils/intl";
import { IconCopy, IconLogout } from "@tabler/icons-react";
import { set } from "react-hook-form";

function ConnectorButton({ connector, onClick }: { connector: any; onClick: () => void }) {
  const { name, id, isInstalled } = connector;

  return (
    <Button
      radius="lg"
      color="tertiary"
      variant="ghost"
      disabled={!isInstalled}
      onPress={onClick}
      type="button"
      className="flex flex-col p-1 h-fit overflow-hidden cursor-pointer"
    >
      <div className="h-10 w-10 p-1 relative">
        <Image
          className="w-full h-full rounded-full object-contain relative z-10"
          src={`https://raw.githubusercontent.com/quasar-finance/quasar-resources/main/assets/wallet/${id}.webp`}
          width={40}
          height={40}
          alt={`chain-${name}-${id}`}
          priority
        />
      </div>
      <p className="text-sm relative z-10 transition-all duration-400">{name}</p>
    </Button>
  );
}

const ModalConnectBridge: React.FC = () => {
  /*  const connectors = useConnectors();
  const { isConnected } = useAccount();
  const { toast } = useToast();
  const { hideModal } = useModal();

  useEffect(() => {
    if (isConnected) hideModal();
  }, [isConnected]); */

  const { address = "", connector, chain, isConnected: isCosmosConnected } = useAccount();
  const connectors = useConnectors();
  const [isEVMConnected, setIsEVMConnected] = useState(false);

  const handleDisconnect = () => connector?.disconnect?.();

  return (
    <BasicModal title="Bridge Connector" classNames={{ wrapper: "max-w-sm", container: "p-2" }}>
      <div className="flex flex-col gap-4">
        <div className="bg-tw-bg rounded-2xl p-3 flex flex-col gap-2 w-full">
          <p className="text-xs">{`Connect${isCosmosConnected ? "ed to" : ""} Babylon`}</p>
          {isCosmosConnected ? (
            <div className="w-full rounded-xl bg-white/10 p-2 flex items-center justify-between">
              <div className="flex items-center justify-between gap-2 w-full">
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
                      <p className="flex gap-2 items-center">
                        {IntlAddress(address)} <IconCopy className="w-4 h-4" />
                      </p>
                    </CopyMessage>
                  </div>
                </div>
                <Button
                  color="secondary"
                  onClick={handleDisconnect}
                  className="w-10 h-10 rounded-xl p-1"
                  isIconOnly
                >
                  <IconLogout className="w-6 h-6" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {connectors.map((connector) => (
                <ConnectorButton
                  key={connector.uid}
                  connector={connector}
                  onClick={() => connector.connect({ chainId: babylonTestnet.id })}
                />
              ))}
            </div>
          )}
        </div>
        <div className="bg-tw-bg rounded-2xl p-3 flex flex-col gap-2 w-full">
          <p className="text-xs">{`Connect${isEVMConnected ? "ed to" : ""} EVM`}</p>
          {isEVMConnected ? (
            <div className="w-full rounded-xl bg-white/10 p-2 flex items-center justify-between">
              <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex gap-2 items-center">
                  <img
                    src={
                      "https://raw.githubusercontent.com/quasar-finance/quasar-resources/main/assets/wallet/metamask.webp"
                    }
                    alt="wallet"
                    className="w-10 h-10"
                  />
                  <div className="flex flex-col">
                    <p className="text-xs">
                      <span className="text-tw-orange-400">Metamask Wallet</span>
                    </p>
                    <CopyMessage textToCopy={"0xCe8cb15036F11084cA5d587D6962722978100456"}>
                      <p className="flex gap-2">
                        {IntlAddress("0xCe8cb15036F11084cA5d587D6962722978100456")}{" "}
                        <IconCopy className="w-4 h-4" />
                      </p>
                    </CopyMessage>
                  </div>
                </div>
                <Button
                  color="secondary"
                  onClick={() => setIsEVMConnected(false)}
                  className="w-10 h-10 rounded-xl p-1"
                  isIconOnly
                >
                  <IconLogout className="w-6 h-6" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {connectors.map((connector) => (
                <ConnectorButton
                  key={connector.uid}
                  connector={connector}
                  onClick={() => setIsEVMConnected(true)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </BasicModal>
  );
};

export default ModalConnectBridge;
