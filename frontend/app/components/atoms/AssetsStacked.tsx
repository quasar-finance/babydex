import { twMerge } from "~/utils/twMerge";

import type { BaseCurrency } from "@towerfi/types";
import type React from "react";
interface Props {
  assets: BaseCurrency[];
}

const AssetsStacked: React.FC<Props> = ({ assets }) => {
  return (
    <div className="flex">
      {assets.map((pair, i) => (
        <img
          key={pair.symbol + i}
          src={pair.logoURI}
          alt={pair.symbol}
          className={twMerge(
            `ml--${i} relative z-10 rounded-full border-[3px] border-tw-bg w-8 h-8 bg-tw-bg`,
          )}
        />
      ))}
    </div>
  );
};

export default AssetsStacked;
