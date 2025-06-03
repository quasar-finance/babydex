import type React from "react";
import BasicModal from "~/app/components/templates/BasicModal";
import WithConnectedWallet from "../../atoms/WithConnectedWallet";
import { Button } from "../../atoms/Button";
import { ModalTypes } from "~/types/modal";
import { useModal } from "~/app/providers/ModalProvider";
import { useAccount } from "wagmi";
import useSignArbitrary from "~/app/hooks/useSignArbitrary";
import { trpc } from "~/trpc/client";
import { useToast } from "~/app/hooks";
import { useCallback } from "react";
import { ConfettiExplosion } from "react-confetti-explosion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { inviteBoostBps } from "~/utils/consts";
import { bpsToFloat } from "~/utils/intl";

const ModalReferralCode: React.FC<{ referralCode: string }> = ({ referralCode }) => {
  const router = useRouter();

  const { showModal, hideModal } = useModal();
  const { isConnected, address: userAddress } = useAccount();
  const { toast } = useToast();
  const {
    mutate: handleReferralCodeMutation,
    isLoading: isLoadingHandleReferralCode,
    isSuccess,
  } = trpc.edge.referral.handleReferral.useMutation({
    onError: (error: any) => {
      toast.error({
        title: "Error handling referral code",
        description:
          error.message || "An unexpected error occurred while handling your referral code.",
      });
    },
    onSuccess: (data) => {
      if (!data.success) {
        throw new Error("Failed to handle referral code. " + data.error);
      }

      toast.success({
        title: "Referral link created",
        description: "You can now share your referral link with friends to earn points.",
      });
    },
  });
  const signArbitrary = useSignArbitrary();

  const handlerReferralCode = useCallback(async () => {
    if (!userAddress) {
      toast.error({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a referral link.",
      });

      return;
    }

    try {
      const signature = await signArbitrary(
        "Please sign this message to confirm your referral code: " + referralCode,
      );

      handleReferralCodeMutation({
        signedMessage: signature,
        referredUserWalletAddress: userAddress,
        referralCode,
      });
    } catch (error: any) {
      toast.error({
        title: "Error signing referral link",
        description:
          error.message || "An unexpected error occurred while signing your referral link.",
      });
    }
  }, [userAddress, signArbitrary, handleReferralCodeMutation]);

  return (
    <BasicModal title="Referral Code" showClose>
      {isSuccess && (
        <>
          <div className="w-1 mx-auto">
            <ConfettiExplosion zIndex={100} duration={6000} />
          </div>

          <div className="flex flex-col gap-4 text-center">
            Your referral link has been applied and you will earn {bpsToFloat(inviteBoostBps, 2, 0)}
            % extra on your future points
          </div>

          <div className="flex items-center justify-between gap-2 mt-6 mb-2">
            <Button
              as={Link}
              color="tertiary"
              target="_blank"
              href="https://docs.tower.fi/user-guides/points-campaigns"
            >
              Learn how to earn Points
            </Button>
            <Button
              variant="ghost"
              color="primary"
              onClick={() => {
                hideModal();
                router.replace(window.location.pathname, { scroll: false });
              }}
            >
              Continue
            </Button>
          </div>
        </>
      )}
      {!isSuccess && (
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
            <div>
              <p className="text-sm text-white/50">
                To apply your invite link to your wallet, please connect to the app and sign the
                transaction.
              </p>
              <div className="static flex items-center justify-between gap-2 mt-6 mb-2">
                <Button
                  as={Link}
                  color="tertiary"
                  target="_blank"
                  href="https://docs.tower.fi/user-guides/points-campaigns"
                >
                  Learn how to earn Points
                </Button>
                <Button
                  color={isConnected ? "primary" : "tertiary"}
                  className="static flex"
                  onClick={handlerReferralCode}
                  isLoading={isLoadingHandleReferralCode}
                >
                  Sign the message
                </Button>
              </div>
            </div>
          </WithConnectedWallet>
        </div>
      )}
    </BasicModal>
  );
};

export default ModalReferralCode;
