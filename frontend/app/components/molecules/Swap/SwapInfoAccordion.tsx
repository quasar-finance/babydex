import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";
import IconCoins from "~/app/components/atoms/icons/IconCoins";
import { twMerge } from "~/utils/twMerge";

interface Props {
  fee: number;
  minimumReceived: string;
  priceImpact: number;
  maxSlippage: number;
}

const SwapInfoAccordion: React.FC<Props> = ({ fee, maxSlippage, minimumReceived, priceImpact }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={twMerge(
        "w-full flex flex-col gap-3 relative overflow-hidden transition-all duration-300 h-[1.5rem] text-white/50 text-sm cursor-pointer",
        expanded ? "h-[6.625rem]" : "h-4",
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between h-4">
        <p>1 BTC = 0.9876 IBTC</p>
        <div className="flex gap-2 items-center">
          <IconCoins className="" />
          <p>Fee (0.25%)</p>
          <p className="text-white">${fee}</p>
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
        <p className="text-white">{minimumReceived}</p>
      </div>
      <div className="flex items-center justify-between h-4">
        <p>Price Impact</p>
        <p className="text-white">{priceImpact}%</p>
      </div>
      <div className="flex items-center justify-between h-4">
        <p>Max Slippage</p>
        <p className="text-white">{maxSlippage}%</p>
      </div>
    </div>
  );
};

export default SwapInfoAccordion;
