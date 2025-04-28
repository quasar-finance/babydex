import { IconInfoCircle } from "@tabler/icons-react";
import { twMerge } from "~/utils/twMerge";

interface Props {
  priceImpact: number;
  className?: string;
}

const getPriceImpactWarning = (impact: number) => {
  if (impact >= 25) {
    return {
      message: "Price Impact is very high",
      className: "bg-red-900/50 text-red-200",
    };
  } else if (impact >= 10) {
    return {
      message: "Price Impact is high",
      className: "bg-amber-900/50 text-amber-200",
    };
  } else if (impact >= 2) {
    return {
      message: "Price Impact is moderate",
      className: "bg-olive-900/50 text-olive-200",
    };
  }
  return null;
};

export const SwapPriceImpactWarning: React.FC<Props> = ({ priceImpact, className }) => {
  const warning = getPriceImpactWarning(priceImpact);
  
  if (!warning) return null;

  return (
    <div className={twMerge("p-2 rounded-lg flex items-center gap-2 w-full", warning.className, className)}>
      <IconInfoCircle size={20} />
      <span>{warning.message} ({priceImpact.toFixed(2)}%)</span>
    </div>
  );
}; 