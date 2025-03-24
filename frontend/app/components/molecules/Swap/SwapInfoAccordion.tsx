import type { RouteResponse } from "@skip-go/client";
import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";
import IconCoins from "~/app/components/atoms/icons/IconCoins";
import { convertMicroDenomToDenom } from "~/utils/intl";
import { twMerge } from "~/utils/twMerge";

interface Props {
  simulation?: RouteResponse;
  fromSymbol?: string;
  toSymbol?: string;
}

const SwapInfoAccordion: React.FC<Props> = ({ simulation, fromSymbol, toSymbol }) => {
  const [expanded, setExpanded] = useState(false);

  if (!simulation) return null;

  const { estimatedFees, amountIn, amountOut, estimatedAmountOut, swapPriceImpactPercent } =
    simulation;

  return (
    <div
      className={twMerge(
        "w-full flex flex-col gap-3 relative overflow-hidden transition-all duration-300 h-[1.5rem] text-white/50 text-sm cursor-pointer",
        expanded ? "h-[6.625rem]" : "h-4",
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between h-4">
        <p>
          {convertMicroDenomToDenom(amountIn)}
          {fromSymbol} = {convertMicroDenomToDenom(amountOut)} {toSymbol}
        </p>
        <div className="flex gap-2 items-center">
          <IconCoins className="" />
          <p>Fee ({"-"})</p>
          <p className="text-white">-</p>
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
          {convertMicroDenomToDenom(estimatedAmountOut)} {toSymbol}
        </p>
      </div>
      <div className="flex items-center justify-between h-4">
        <p>Price Impact</p>
        <p className="text-white">{swapPriceImpactPercent}</p>
      </div>
      <div className="flex items-center justify-between h-4">
        <p>Max Slippage</p>
        <p className="text-white">{"-"} </p>
      </div>
    </div>
  );
};

export default SwapInfoAccordion;
