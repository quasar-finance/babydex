import type React from "react";
import BasicModal from "~/app/components/templates/BasicModal";
import WithConnectedWallet from "../../atoms/WithConnectedWallet";
import { Button } from "../../atoms/Button";
import { ModalTypes } from "~/types/modal";
import { useModal } from "~/app/providers/ModalProvider";
import { useAccount } from "wagmi";

const ModalReferralCode: React.FC<{ referralCode: string }> = ({ referralCode }) => {
  const { showModal } = useModal();
  const { isConnected } = useAccount();

  return (
    <BasicModal title="Referral Code" showClose>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <p>You Are Invited</p>
          <span className="font-semibold text-sm">Code: {referralCode}</span>
        </div>
        <WithConnectedWallet
          modalProps={{
            // ConnectWallet modal will be shown if the user is not connected
            // if the user connects the wallet, reopen the referral code modal
            onConnect: () => {
              showModal(ModalTypes.referral_code, true, { referralCode });
            },
          }}
          className="bg-tw-gray-950"
          connectWalletChildren={
            <span className="text-sm px-6 mb-2 text-white/50">
              To apply your invite link to your wallet, please connect to the app and sign the
              transaction.
            </span>
          }
        >
          <div className="mb-2">
            <p className="text-sm text-white/50">
              Please sign the message to confirm your referral code.
            </p>
            <Button
              color={isConnected ? "primary" : "tertiary"}
              className="static mx-auto flex mt-4"
              onClick={() => {}}
            >
              Sign the message
            </Button>
          </div>
        </WithConnectedWallet>
      </div>
    </BasicModal>
  );
};

export default ModalReferralCode;
