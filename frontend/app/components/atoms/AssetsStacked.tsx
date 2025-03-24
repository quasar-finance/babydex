import { twMerge } from "~/utils/twMerge";

import type { BaseCurrency } from "@towerfi/types";
import type React from "react";
interface Props {
  assets?: BaseCurrency[];
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { stackGap: 2, asset: "min-w-6 min-h-6 w-6 h-6" },
  md: { stackGap: 4, asset: "min-w-8 min-h-8 w-8 h-8" },
  lg: { stackGap: 4, asset: "min-w-10 min-h-10 w-10 h-10" },
};

const AssetsStacked: React.FC<Props> = ({ assets, size = "md" }) => {
  if (!assets) {
    return (
      <div className="flex">
        {Array.from({ length: 2 }).map((_, i) => (
          <img
            key={`asset-${i}-${crypto.randomUUID()}`}
            src="/assets/default.png"
            alt="default-asset"
            className={twMerge(
              `z-${10 - i}} relative rounded-full border-[3px] border-tw-bg bg-tw-bg animate-pulse select-none`,
              i > 0 && `-ml-${i * sizes[size].stackGap}`,
              sizes[size].asset,
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
            i > 0 && `-ml-${i * sizes[size].stackGap}`,
            sizes[size].asset,
          )}
        />
      ))}
    </div>
  );
};

export default AssetsStacked;
