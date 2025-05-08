import { useState } from "react";

export type Period = "1d" | "7d";
export const DefaultPeriod: Period = "7d";

export function periodToNumber(period: Period): number {
  switch (period) {
    case "1d":
      return 1;
    case "7d":
      return 7;
    default:
      throw new Error("Invalid period " + period);
  }
}

export const PeriodToggle: React.FC<{
  onChange: (period: Period) => void;
  defaultPeriod?: Period;
}> = ({ onChange, defaultPeriod = DefaultPeriod }) => {
  const [aprTimeframe, setAprTimeframe] = useState<Period>(defaultPeriod);

  const handleClick = (period: Period) => {
    setAprTimeframe(period);
    onChange(period);
  };

  return (
    <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
      <button
        type="button"
        onClick={() => handleClick("1d")}
        className={`px-3 py-1 rounded-md text-sm transition-colors ${
          aprTimeframe === "1d" ? "bg-white/10" : "hover:bg-white/5"
        }`}
      >
        1D
      </button>
      <button
        type="button"
        onClick={() => handleClick("7d")}
        className={`px-3 py-1 rounded-md text-sm transition-colors ${
          aprTimeframe === "7d" ? "bg-white/10" : "hover:bg-white/5"
        }`}
      >
        7D
      </button>
    </div>
  );
};
