import clsx from "clsx";

export const Overview: React.FC = () => {
  const cells = [
    { points: 65867, title: "Total", highlight: true },
    { points: 58987, title: "LPing" },
    { points: 7896, title: "Swapping" },
    { points: 16876, title: "Referral Link" },
    { points: null, title: "Invite Boost" },
  ];

  return (
    <>
      <div className="flex flex-wrap lg:flex-nowrap lg:-ml-4">
        {Array.from(cells).map((cell, index, a) => (
          <div
            key={index}
            className={clsx(
              "w-1/2 lg:w-1/5 pl-4 p-1 box-border mb-6 lg:mb-0 flex flex-col justify-center space-y-1",
              "lg:border-r-3 border-white/10",
              index % 2 === 0 && "border-r-3",
              index === a.length - 1 && "border-none",
            )}
          >
            <span className={clsx("text-2xl text-white/50", cell.highlight && "text-white/100")}>
              {cell.points?.toLocaleString() || "-"}
            </span>
            <span className="text-sm text-white/50">{cell.title}</span>
          </div>
        ))}
      </div>
    </>
  );
};
