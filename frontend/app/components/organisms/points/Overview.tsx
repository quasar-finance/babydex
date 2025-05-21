import type { Points } from "@towerfi/types";
import { twMerge } from "~/utils/twMerge";

export const Overview: React.FC<{ points: Points }> = ({ points }) => {
  const cells = [
    { points: points.total_points, title: "Total", highlight: true },
    { points: points.lping_points, title: "LPing" },
    { points: points.swapping_points, title: "Swapping" },
    { points: null, title: "Referral Link" },
    { points: null, title: "Invite Boost" },
  ];

  return (
    <>
      <div className="flex flex-wrap lg:flex-nowrap lg:-ml-4">
        {Array.from(cells).map((cell, index, a) => (
          <div
            key={index}
            className={twMerge(
              "w-1/2 lg:w-1/5 p-1 pl-4 box-border mb-6 lg:mb-0 flex flex-col justify-center space-y-1",
              "lg:border-r-3 border-white/10",
              index % 2 === 0 && "border-r-3",
              index === a.length - 1 && "border-none",
            )}
          >
            <span className={twMerge("text-2xl text-white/50", cell.highlight && "text-white/100")}>
              {cell.points?.toLocaleString(undefined, {
                maximumFractionDigits: cell.points > 1 ? 0 : 3,
              }) || "-"}
            </span>
            <span className="text-sm text-white/50">{cell.title}</span>
          </div>
        ))}
      </div>
    </>
  );
};
