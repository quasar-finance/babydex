import { inviteBoostBps, pointsShareBps } from "~/utils/consts";
import { bpsToFloat } from "~/utils/intl";
import { twMerge } from "~/utils/twMerge";
import { Button } from "../../atoms/Button";
import { trpc } from "~/trpc/client";
import { useAccount } from "wagmi";
import useSignArbitrary from "~/app/hooks/useSignArbitrary";
import { useCallback, useMemo, useRef } from "react";
import Skeleton from "../../atoms/Skeleton";
import Input from "../../atoms/Input";
import { useToast } from "~/app/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import CopyButton from "../../molecules/CopyButton";

function createReferralLink(referralCode: string) {
  return `${window.location.origin}/ref/${referralCode}`;
}

const Referral: React.FC<{ className: string }> = ({ className }) => {
  const { address: userAddress } = useAccount();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fetchReferralCodeKey = useMemo(
    () =>
      getQueryKey(trpc.edge.referral.fetchReferralCode).concat({
        input: { userWalletAddress: userAddress },
        type: "query",
      }),
    [userAddress],
  );
  const { data: referralCode, isLoading: isLoadingReferralCode } =
    trpc.edge.referral.fetchReferralCode.useQuery(
      {
        userWalletAddress: userAddress!,
      },
      {
        enabled: !!userAddress,
      },
    );

  const { mutate: storeReferralCodeMutation, isLoading: isLoadingStoreReferralCode } =
    trpc.edge.referral.storeReferralCode.useMutation({
      onMutate: () => {
        queryClient.cancelQueries(fetchReferralCodeKey);
      },
      onError: (error) => {
        toast.error({
          title: "Error storing referral code",
          description:
            error.message || "An unexpected error occurred while storing your referral code.",
        });
      },
      onSuccess: (data) => {
        if (!data.success) {
          throw new Error("Failed to store referral code." + data.error);
        }
        toast.success({
          title: "Referral link created",
          description: "You can now share your referral link with friends to earn points.",
        });
        queryClient.setQueryData(fetchReferralCodeKey, (oldData: any) => {
          return {
            ...(oldData || {}),
            ...data,
          };
        });
      },
    });

  const signArbitrary = useSignArbitrary();
  const inputReferralCodeRef = useRef<HTMLInputElement>(null);

  const storeReferralCode = useCallback(async () => {
    if (!userAddress) {
      toast.error({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a referral link.",
      });

      return;
    }

    try {
      const signature = await signArbitrary(
        "Please sign this message to generate your referral code.",
      );

      storeReferralCodeMutation({
        signedMessage: signature,
        userWalletAddress: userAddress,
      });
    } catch (error: any) {
      toast.error({
        title: "Error signing referral link",
        description:
          error.message || "An unexpected error occurred while signing your referral link.",
      });
    }
  }, [userAddress, signArbitrary, storeReferralCodeMutation]);

  return (
    <div
      className={twMerge(
        "p-4 border bg-origin-border border-white/10 rounded-2xl bg-gradient-to-r from-transparent via-transparent via-30% to-tw-orange-500/85",
        className,
      )}
    >
      <h2 className="text-lg font-bold mb-2">
        Get {bpsToFloat(pointsShareBps, 2, 0)}% of frens points
      </h2>
      <p className="text-sm text-white/70 mb-4">
        Invite friends and earn 20% of what they earn. They also get a{" "}
        {bpsToFloat(inviteBoostBps, 2, 0)}% boost on their points.
      </p>
      {!userAddress && (
        <p className="text-xs text-white/70 mb-4">
          Connect your wallet to create a referral link and start earning points.
        </p>
      )}
      {userAddress && (
        <>
          {isLoadingReferralCode && <Skeleton className="h-12 w-full max-w-[400px]" />}
          {!isLoadingReferralCode && !referralCode?.code && (
            <Button
              size="sm"
              className="rounded-xl"
              onPress={storeReferralCode}
              isLoading={isLoadingStoreReferralCode}
            >
              <span className="text-sm">Create Referral Link</span>
            </Button>
          )}
          {referralCode?.code && (
            <Input
              className="text-sm"
              ref={inputReferralCodeRef}
              onClick={() => {
                inputReferralCodeRef.current?.select();
              }}
              value={createReferralLink(referralCode.code)}
              readOnly
              classNames={{
                wrapperClassName: "py-1 px-1 pl-3",
                parentClassName: "w-full max-w-[400px]",
              }}
              endContent={
                <CopyButton
                  textToCopy={createReferralLink(referralCode.code)}
                  size="sm"
                  className="rounded-xl"
                />
              }
            />
          )}
        </>
      )}
    </div>
  );
};

export default Referral;
