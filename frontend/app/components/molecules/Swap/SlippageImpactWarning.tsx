import { IconInfoCircle } from "@tabler/icons-react";
import { twMerge } from "~/utils/twMerge";
import { Spinner } from "~/app/components/atoms/Spinner";

interface Props {
  priceImpact: number;
  className?: string;
  isLoading?: boolean;
}

const getPriceImpactWarning = (impact: number) => {
  if (impact >= 25) {
    return {
      message: "Price Impact is very high",
      className: "bg-red-900/50 text-red-200",
    };
  }

  if (impact >= 3) {
    return {
      message: "Price Impact is high",
      className: "bg-amber-900/50 text-amber-200",
    };
  }

  if (impact >= 1) {
    return {
      message: "Price Impact is moderate",
      className: "bg-olive-900/50 text-olive-200",
    };
  }

  return {
    message: "Price Impact",
    className: "bg-tw-bg/50 text-tw-text",
  };
};

export const SwapPriceImpactWarning: React.FC<Props> = ({ priceImpact, className, isLoading }) => {
  const warning = getPriceImpactWarning(priceImpact);

  if (!warning) return null;

  return (
    <div
      className={twMerge(
        "p-2 rounded-lg flex items-center gap-2 w-full",
        !isLoading && warning.className,
        className,
      )}
    >
      <IconInfoCircle size={20} />
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Spinner size="sm" />
          <span>Calculating price impact...</span>
        </div>
      ) : (
        <span>
          {warning.message} (-{priceImpact.toFixed(2)}%)
        </span>
      )}
    </div>
  );
};
