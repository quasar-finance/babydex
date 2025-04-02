import type React from "react";
import { twMerge } from "~/utils/twMerge";
import Tooltip from "../Tooltip";
import type { BaseCurrency, WithPrice } from "@towerfi/types";
import { useWithdrawSimulation } from "~/app/hooks/useWithdrawSimulation";
import {
  convertDenomToMicroDenom,
  convertMicroDenomToDenom,
  toFullNumberString,
} from "~/utils/intl";

interface Props {
  title: string;
  amount: string | number;
  className?: string;
  poolAddress: string;
  tokens: WithPrice<BaseCurrency>[];
}

export const CellDataToken: React.FC<Props> = ({
  poolAddress,
  title,
  amount,
  className,
  tokens,
}) => {
  const [token0, token1] = tokens;

  const parsedAmount = toFullNumberString(amount);

  const {
    simulation: [{ amount: token0Amount }, { amount: token1Amount }],
    query: { isLoading: isSimulateLoading },
  } = useWithdrawSimulation({ poolAddress, assets: tokens, amount: parsedAmount });

  if (!token0Amount || !token1Amount) {
    return (
      <div className={twMerge("flex flex-col gap-2", className)}>
        <p className="text-xs text-white/50 lg:hidden">{title}</p>
        <div className="flex items-center  justify-between gap-3">
          <p>{convertMicroDenomToDenom(parsedAmount, 6)}</p>
        </div>
      </div>
    );
  }

  return (
    <Tooltip
      className="min-w-[10rem]"
      content={
        <div className="flex flex-col gap-3 w-full">
          <p className="text-sm text-tw-orange-400">Total {title}</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-1 text-gray-500">
                <img
                  src={token0.logoURI}
                  alt="BTC"
                  className="grayscale w-3 h-3 select-none"
                  draggable={false}
                />
                <p>{token0.symbol}</p>
              </div>
              <p>{convertMicroDenomToDenom(token0Amount, token0.decimals)}</p>
            </div>
            <div className="flex items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-1 text-gray-500 ">
                <img src={token1.logoURI} alt="BTC" className="grayscale w-3 h-3" />
                <p>{token1.symbol}</p>
              </div>
              <p>{convertMicroDenomToDenom(token1Amount, token1.decimals)}</p>
            </div>
          </div>
        </div>
      }
    >
      <div className={twMerge("flex flex-col gap-2", className)}>
        <p className="text-xs text-white/50 lg:hidden">{title}</p>
        <div className="flex items-center  justify-between gap-3">
          <p>{convertMicroDenomToDenom(parsedAmount, 6)}</p>
        </div>
      </div>
    </Tooltip>
  );
};
