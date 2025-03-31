"use client";

import type React from "react";
import { Button } from "../atoms/Button";
import { trpc } from "~/trpc/client";
import { useAccount } from "@cosmi/react";
import { UserPools } from "../organisms/dashboard/UserPools";

const Dashboard: React.FC = () => {
  const { address } = useAccount();

  const { data: pools = [], isLoading } = trpc.local.pools.getUserPools.useQuery({
    address,
  });

  return (
    <div className="flex flex-col gap-8 px-4 max-w-[84.5rem] mx-auto w-full min-h-[65vh]">
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
        <h1 className="text-xl">My Liquidity Positions</h1>
        <div className="flex gap-3 h-[42px] items-center lg:px-2">
          <Button color="tertiary" isDisabled>
            New Position
          </Button>
          <Button isDisabled={!address}>Claim All</Button>
        </div>
      </div>
      <UserPools pools={pools} isLoading={isLoading} />
    </div>
  );
};

export default Dashboard;
