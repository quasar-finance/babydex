"use client";
import { useEffect, useState } from "react";
import Avatar from "../atoms/Avatar";
import { Button } from "../atoms/Button";
import { useModal } from "~/app/providers/ModalProvider";
import { ModalTypes } from "~/types/modal";

import { IntlAddress } from "~/utils/intl";
import { twMerge } from "~/utils/twMerge";
import CopyMessage from "../atoms/CopyMessage";
import { IconCopy, IconLogout } from "@tabler/icons-react";
import { useAccount } from "@cosmi/react";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/Popover";

export const ConnectWallet: React.FC = () => {
  const { showModal } = useModal();
  const { address, isConnected, connector, chain } = useAccount();
  const [_isConnected, _setIsConnected] = useState(false);

  useEffect(() => {
    _setIsConnected(isConnected);
  }, [isConnected]);

  return (
    <div>
      {_isConnected ? (
        <>
          <Popover>
            <PopoverTrigger>
              <Button color="secondary">
                <Avatar seed={address || ""} className="w-4 h-4" /> {IntlAddress(address || "")}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
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
                      <span className=" text-tw-orange-400">{connector?.name} Wallet</span>
                    </p>
                    <CopyMessage textToCopy={address || ""}>
                      <p className=" flex gap-2">
                        {IntlAddress(address || "")} <IconCopy className="w-4 h-4" />
                      </p>
                    </CopyMessage>
                  </div>
                </div>
              </div>
              <Button fullWidth variant="ghost" onPress={() => connector?.disconnect()}>
                <span>Disconnect</span>
                <IconLogout className="w-4 h-4" />
              </Button>
            </PopoverContent>
          </Popover>
          {/* <button onPress={() => disconnect()}>Disconnect</button> */}
        </>
      ) : (
        <Button onPress={() => showModal(ModalTypes.connect_wallet)}>Connect wallet</Button>
      )}
    </div>
  );
};

export const MobileConnectWallet: React.FC<{ closeMenu: () => void }> = ({ closeMenu }) => {
  const { showModal } = useModal();
  const { address, isConnected, connector, chain } = useAccount();
  const [_isConnected, _setIsConnected] = useState(false);

  useEffect(() => {
    _setIsConnected(isConnected);
  }, [isConnected]);

  return (
    <>
      {_isConnected ? (
        <div className="w-full flex flex-col gap-4 lg:gap-2 p-2 border border-white/10 rounded-xl">
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
                  <span className=" text-tw-orange-400">{connector?.name} Wallet</span>
                </p>
                <CopyMessage textToCopy={address || ""}>
                  <p className=" flex gap-2">
                    {IntlAddress(address || "")} <IconCopy className="w-4 h-4" />
                  </p>
                </CopyMessage>
              </div>
            </div>
          </div>
          <Button fullWidth variant="ghost" onPress={() => connector?.disconnect()}>
            <span>Disconnect</span>
            <IconLogout className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Button fullWidth onPress={() => [showModal(ModalTypes.connect_wallet), closeMenu()]}>
          Connect wallet
        </Button>
      )}
    </>
  );
};
