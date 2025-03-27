"use client";
import { useModal } from "~/app/providers/ModalProvider";

import type React from "react";
import { Button } from "../atoms/Button";
import { twMerge } from "~/utils/twMerge";
import { CellPoolName } from "../atoms/cells/CellPoolName";
import { IconDots } from "@tabler/icons-react";
import { Popover, PopoverTrigger, PopoverContent } from "../atoms/Popover";
import { CellClaimRewards } from "../atoms/cells/CellClaimRewards";
import { CellData } from "../atoms/cells/CellData";
import { Table, TableRow } from "../atoms/Table";
import { ModalTypes } from "~/types/modal";
import { trpc } from "~/trpc/client";
import { useAccount } from "@cosmi/react";

const columns = [
  { key: "name", title: "Pool" },
  { key: "apr", title: "APR" },
  { key: "staked", title: "Staked" },
  { key: "unstaked", title: "Unstaked" },
  { key: "claimableRewards", title: "Claimable Rewards" },
  { key: "actions", title: "" },
];

const Dashboard: React.FC = () => {
  const gridClass = "grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_2fr] gap-4";
  const { showModal } = useModal();
  const { address } = useAccount();

  const { data: pools = [] } = trpc.local.pools.getUserPools.useQuery({
    address: "bbn1knv468atwzjk4v0d22jwa497v0sd0zez3lh7g3",
  });

  return (
    <div className="flex flex-col gap-8 px-4">
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
        <h1 className="text-xl">My Liquidity Positions</h1>
        <div className="flex gap-3 h-[42px] items-center lg:px-2">
          <Button color="tertiary" isDisabled>
            New Position
          </Button>
          <Button>Claim All</Button>
        </div>
      </div>
      <Table columns={columns} gridClass={gridClass}>
        {pools.map(({ poolInfo, userBalance }, i) => (
          <TableRow key={i} gridClass={twMerge("flex flex-wrap lg:grid ", gridClass)}>
            <CellPoolName
              assets={poolInfo.assets}
              name={poolInfo.name}
              poolType={poolInfo.poolType}
              config={poolInfo.config}
              className="order-1 col-span-1 w-[80%] lg:w-auto"
            />
            <CellData title="APR" data="-" className="order-3 w-[45%] lg:w-auto" />
            <CellData
              title="Staked"
              data={userBalance.staked_share_amount}
              className="order-4 w-[45%] lg:w-auto"
            />
            <CellData title="Price Range" data="-" className="order-5 w-[45%] lg:w-auto" />
            <CellClaimRewards
              rewardAmount="$0.0"
              claimAction={() => {}}
              className="order-6 w-[45%] lg:w-auto"
            />
            <div className="order-2 lg:order-7 flex items-end justify-end w-fit lg:w-auto">
              <Popover>
                <PopoverTrigger>
                  <Button color="tertiary" radius="sm" size="icon" className="mt-4 lg:mt-0">
                    <IconDots className="w-6 h-6" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="min-w-[10rem] p-1">
                  <ul className="w-full">
                    <li
                      className="px-3 py-2 rounded-lg hover:text-tw-orange-400 hover:bg-tw-orange-400/20 w-full transition-all cursor-pointer"
                      onClick={() =>
                        showModal(ModalTypes.stake_liquidity, true, { pool: poolInfo })
                      }
                    >
                      Stake
                    </li>
                    <li
                      className="px-3 py-2 rounded-lg hover:text-tw-orange-400 hover:bg-tw-orange-400/20 w-full transition-all cursor-pointer"
                      onClick={() =>
                        showModal(ModalTypes.unstake_liquidity, true, { pool: poolInfo })
                      }
                    >
                      Unstake
                    </li>
                    <li
                      className="px-3 py-2 rounded-lg hover:text-tw-orange-400 hover:bg-tw-orange-400/20 w-full transition-all cursor-pointer"
                      onClick={() => showModal(ModalTypes.add_liquidity, true, { pool: poolInfo })}
                    >
                      Add
                    </li>
                    <li
                      className="px-3 py-2 rounded-lg hover:text-tw-orange-400 hover:bg-tw-orange-400/20 w-full transition-all cursor-pointer"
                      onClick={() =>
                        showModal(ModalTypes.remove_liquidity, true, { pool: poolInfo })
                      }
                    >
                      Remove
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
          </TableRow>
        ))}
      </Table>
    </div>
  );
};

export default Dashboard;
