"use client";

import type React from "react";
import Avatar from "../atoms/Avatar";
import { Button } from "../atoms/Button";
import { useModal } from "~/app/providers/ModalProvider";
import { ModalTypes } from "~/types/modal";

import { IntlAddress } from "~/utils/intl";
import { useAccount } from "@cosmi/react";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/Popover";
import { WalletDetails } from "./WalletDetails";
import { useEffect, useState } from "react";

export const ConnectWallet: React.FC = () => {
  const { showModal } = useModal();
  const { address = "", isConnected } = useAccount();
  const [_isConnected, _setIsConnected] = useState(false);

  useEffect(() => {
    _setIsConnected(isConnected);
  }, [isConnected]);

  if (!_isConnected) {
    return <Button onPress={() => showModal(ModalTypes.connect_wallet)}>Connect wallet</Button>;
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button color="secondary">
          <Avatar seed={address} className="w-4 h-4" /> {IntlAddress(address)}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <WalletDetails />
      </PopoverContent>
    </Popover>
  );
};

export const MobileConnectWallet: React.FC<{ closeMenu: () => void }> = ({ closeMenu }) => {
  const { showModal } = useModal();
  const { address, isConnected } = useAccount();

  const [_isConnected, _setIsConnected] = useState(false);

  useEffect(() => {
    _setIsConnected(isConnected);
  }, [isConnected]);

  if (!_isConnected) {
    return (
      <Button fullWidth onPress={() => [showModal(ModalTypes.connect_wallet), closeMenu()]}>
        Connect wallet
      </Button>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 lg:gap-2 p-2 border border-white/10 rounded-xl">
      <WalletDetails />
    </div>
  );
};
