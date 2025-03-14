import type React from "react";
import { Button } from "../Button";

interface Props {
  rewardAmount: string;
  claimAction: () => void;
}

export const CellClaimRewards: React.FC<Props> = ({ rewardAmount, claimAction }) => {
  return (
    <div className="flex gap-2 items-center">
      <p>{rewardAmount}</p>
      <Button color="secondary" size="xs">
        Claim
      </Button>
    </div>
  );
};
