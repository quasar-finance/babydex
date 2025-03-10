"use client";
import { useEffect, useState } from "react";
import Avatar from "../atoms/Avatar";
import { Button } from "../atoms/Button";
import { useModal } from "~/app/providers/ModalProvider";
import { ModalTypes } from "~/types/modal";

import { IntlAddress } from "~/utils/intl";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { twMerge } from "~/utils/twMerge";
import CopyMessage from "../atoms/CopyMessage";
import { IconCopy, IconLogout } from "@tabler/icons-react";
import { useAccount } from "@cosmi/react";

const ConnectWallet: React.FC = () => {
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
          <Popover placement="bottom" showArrow offset={10}>
            <PopoverTrigger>
              <Button variant="flat">
                <Avatar seed={address || ""} className="w-4 h-4" /> {IntlAddress(address || "")}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={twMerge(
                "min-w-[20rem] border border-tw-gray-900 bg-tw-bg rounded-xl py-2 relative overflow-hidden p-2 flex items-start flex-col gap-3",
              )}
            >
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

export default ConnectWallet;
