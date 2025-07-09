import type { RouteResponse } from "@skip-go/client";
import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";
import { useSwapStore } from "~/app/hooks/useSwapStore";
import { bpsToFloat, convertMicroDenomToDenom, maxSlippageToBps } from "~/utils/intl";
import { twMerge } from "~/utils/twMerge";
import { Assets } from "~/config";
import BigNumber from "bignumber.js";

interface Props {
  simulation?: Pick<
    RouteResponse,
    | "estimatedFees"
    | "amountIn"
    | "amountOut"
    | "estimatedAmountOut"
    | "swapPriceImpactPercent"
    | "destAssetDenom"
    | "sourceAssetDenom"
  > | null;
  className?: string;
}

const assets = Object.values(Assets);

const SwapInfoAccordion: React.FC<Props> = ({ simulation, className }) => {
  const [expanded, setExpanded] = useState(false);
  const { slippage } = useSwapStore();

  if (!simulation) return null;

  const { amountIn, amountOut: amountOutMicro, destAssetDenom, sourceAssetDenom } = simulation;

  const fromDenom = assets.find((asset) => asset.denom === sourceAssetDenom);
  const toDenom = assets.find((asset) => asset.denom === destAssetDenom);

  const minAmountOutMicro = BigNumber(amountOutMicro)
    .multipliedBy(bpsToFloat(1e4 - maxSlippageToBps(slippage)))
    .toFixed(0, BigNumber.ROUND_DOWN);
  const minAmountOut = convertMicroDenomToDenom(minAmountOutMicro, toDenom?.decimals);
  const rate = Number.parseFloat(
    (minAmountOut / Number(convertMicroDenomToDenom(amountIn, fromDenom?.decimals))).toFixed(6),
  );

  return (
    <div
      className={twMerge(
        "w-full flex flex-col gap-3 relative overflow-hidden transition-all duration-300 h-[1.5rem] text-white/50 text-sm cursor-pointer",
        expanded ? "h-[6.625rem]" : "h-4",
        className,
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between h-4">
        <p>
          {Number.isNaN(rate) ? null : (
            <span>
              1 {fromDenom?.symbol} = {rate} {toDenom?.symbol}
            </span>
          )}
        </p>
        <div className="flex gap-2 items-center">
          {/* <IconCoins className="" />
          <p>Fee ({"-"})</p>
          <p className="text-white">-</p> */}
          <IconChevronDown
            className={twMerge(
              "w-6 h-6 transition-all duration-300",
              expanded ? "rotate-180" : "rotate-0",
            )}
          />
        </div>
      </div>
      <div className="flex items-center justify-between h-4">
        <p>Minimum Received</p>
        <p className="text-white">
          {minAmountOut} {toDenom?.symbol}
        </p>
      </div>
      <div className="flex items-center justify-between h-4">
        <p>Max Slippage</p>
        <p className="text-white capitalize">{bpsToFloat(maxSlippageToBps(slippage), 2, 0)}%</p>
      </div>
    </div>
  );
};

export default SwapInfoAccordion;
