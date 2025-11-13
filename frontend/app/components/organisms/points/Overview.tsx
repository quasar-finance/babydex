const formatTotalPoints = (value?: number) => {
  if (value === undefined || value === null) {
    return '-';
  }

  return value.toLocaleString(undefined, {
    minimumFractionDigits: value >= 1 ? 2 : 0,
    maximumFractionDigits: value >= 1 ? 2 : 4,
  });
};

export const Overview: React.FC<{ totalPoints?: number }> = ({ totalPoints }) => {
  return (
    <div className="flex flex-wrap">
      <div className="w-full p-2 pl-4 flex flex-col justify-center space-y-2">
        <span className="text-4xl font-semibold text-white">{formatTotalPoints(totalPoints)}</span>
        <span className="text-sm text-white/60">Total</span>
      </div>
    </div>
  );
};
