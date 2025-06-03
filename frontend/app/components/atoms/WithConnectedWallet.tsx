import { useAccount } from "@cosmi/react";
import { Button } from "./Button";
import { ModalTypes } from "~/types/modal";
import { useModal } from "~/app/providers/ModalProvider";
import { twMerge } from "~/utils/twMerge";

const WithConnectedWallet: React.FC<{
  connectWalletChildren?: React.ReactNode;
  children: React.ReactNode;
  allowClose?: boolean;
  modalProps?: Record<string, any>;
  className?: string;
}> = ({ children, allowClose, modalProps, connectWalletChildren, className }) => {
  const { address: userAddress } = useAccount();
  const { showModal } = useModal();

  if (!userAddress) {
    return (
      <div className="relative w-full h-full">
        <div
          className={twMerge(
            "absolute -left-4 -top-4 flex flex-col items-center justify-center w-[calc(100%+2rem)] h-[calc(100%+2rem)] text-center backdrop-blur-sm z-10",
            className,
          )}
        >
          {connectWalletChildren ? connectWalletChildren : <span>Please connect your wallet</span>}
          <Button onClick={() => showModal(ModalTypes.connect_wallet, allowClose, modalProps)}>
            Connect Wallet
          </Button>
        </div>
        <div className="">{children}</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default WithConnectedWallet;
