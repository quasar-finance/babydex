import type React from "react";
import { Button } from "../Button";
import { twMerge } from "~/utils/twMerge";

interface Props {
  rewardAmount: string;
  claimAction: () => void;
  className?: string;
}

export const CellClaimRewards: React.FC<Props> = ({ rewardAmount, claimAction, className }) => {
  return (
    <div className={twMerge("flex flex-col gap-2", className)}>
      <p className="text-xs text-white/50 lg:hidden">Claimable Rewards</p>
      <div className="flex gap-2 items-center">
        <p>{rewardAmount}</p>
        <Button color="secondary" size="xs">
          Claim
        </Button>
      </div>
    </div>
  );
};
