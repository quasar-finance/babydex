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
import type { PoolType } from "@towerfi/types";

const positions = [
  {
    name: "IBCT1 / IBCT4",
    poolAddress: "bbn146uw5zknvk63tz5xhghs46037z5rxllz3y2aqhljw6khgddpnezs4msqwm",
    lpAddress: "bbn16ajpzp8f6zg2f5hch6fxf5mlh4w8ec8z5c4p59far7ltz0hzyjsszufqq9",
    poolType: "concentrated" as PoolType,
    assets: [
      {
        symbol: "IBCT1",
        denom: "ibc/241F1FFE4117C31D7DFC2A91C026F083FCEB6868C169BA5002FF0B3E17B88EDF",
        name: "IBC Test Token 1",
        decimals: 6,
        logoURI: "/assets/default.png",
        price: 0,
      },
      {
        symbol: "IBCT4",
        denom: "ibc/4BF4FFBF2B84A71627E009ABFD6A870AA6424D6BA9B419D81F446FA80D3AE655",
        name: "IBC Test Token 4",
        decimals: 18,
        logoURI: "/assets/default.png",
        price: 0,
      },
    ],
    poolLiquidity: "1036092369",
    rewards: [],
  },
  {
    name: "IBCT5 / IBCT4",
    poolAddress: "bbn148tyz7fs5ahctp8p42k4qwysur3zx2pfxwp54qepdddjhwru0eeqvnq487",
    lpAddress: "bbn1m94w92jh4ajxryzgv6pyakzeptj3n8fjep9cw7h78rkaksqkxsfs049jtv",
    poolType: "xyk" as PoolType,
    assets: [
      {
        symbol: "IBCT5",
        denom: "ibc/3AA6631D204C192DDB757935A4C49A0E83EEEE14AC045E8A180CCB4EE08B6196",
        name: "IBC Test Token 5",
        decimals: 18,
        logoURI: "/assets/default.png",
        price: 0,
      },
      {
        symbol: "IBCT4",
        denom: "ibc/4BF4FFBF2B84A71627E009ABFD6A870AA6424D6BA9B419D81F446FA80D3AE655",
        name: "IBC Test Token 4",
        decimals: 18,
        logoURI: "/assets/default.png",
        price: 0,
      },
    ],
    poolLiquidity: "1002178044",
    rewards: [],
  },
];

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
        {positions.map((pool, i) => (
          <TableRow key={i} gridClass={twMerge("flex flex-wrap lg:grid ", gridClass)}>
            <CellPoolName
              assets={pool.assets}
              name={pool.name}
              poolType={pool.poolType}
              className="order-1 col-span-1 w-[80%] lg:w-auto"
            />
            <CellData title="APR" data="-" className="order-3 w-[45%] lg:w-auto" />
            <CellData title="Staked" data="-" className="order-4 w-[45%] lg:w-auto" />
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
                      onClick={() => showModal(ModalTypes.stake_liquidity, true, { pool })}
                    >
                      Stake
                    </li>
                    <li
                      className="px-3 py-2 rounded-lg hover:text-tw-orange-400 hover:bg-tw-orange-400/20 w-full transition-all cursor-pointer"
                      onClick={() => showModal(ModalTypes.unstake_liquidity, true, { pool })}
                    >
                      Unstake
                    </li>
                    <li
                      className="px-3 py-2 rounded-lg hover:text-tw-orange-400 hover:bg-tw-orange-400/20 w-full transition-all cursor-pointer"
                      onClick={() => showModal(ModalTypes.add_liquidity, true, { pool })}
                    >
                      Add
                    </li>
                    <li
                      className="px-3 py-2 rounded-lg hover:text-tw-orange-400 hover:bg-tw-orange-400/20 w-full transition-all cursor-pointer"
                      onClick={() => showModal(ModalTypes.remove_liquidity, true, { pool })}
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
