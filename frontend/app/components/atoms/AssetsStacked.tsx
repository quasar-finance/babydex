import { twMerge } from "~/utils/twMerge";

import type { BaseCurrency } from "@towerfi/types";
import type React from "react";
interface Props {
  assets?: BaseCurrency[];
}

const AssetsStacked: React.FC<Props> = ({ assets }) => {
  if (!assets) {
    return (
      <div className="flex">
        {Array.from({ length: 2 }).map((_, i) => (
          <img
            key={`asset-${i}-${crypto.randomUUID()}`}
            src="/assets/default.png"
            alt="default-asset"
            className={twMerge(
              `z-${10 - i}} relative rounded-full border-[3px] border-tw-bg min-w-8 min-h-8 w-8 h-8 bg-tw-bg animate-pulse select-none`,
              i > 0 && `-ml-${i * 4}`,
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex">
      {assets.map((pair, i) => (
        <img
          key={pair.symbol + i}
          src={pair.logoURI}
          alt={pair.symbol}
          className={twMerge(
            `z-${10 - i} relative rounded-full border-[3px] border-tw-bg min-w-8 min-h-8 w-8 h-8 bg-tw-bg select-none`,
            i > 0 && `-ml-${i * 4}`,
          )}
        />
      ))}
    </div>
  );
};

export default AssetsStacked;
