import type React from "react";
import { Table, TableRow, type Column } from "../../atoms/Table";
import { twMerge } from "~/utils/twMerge";

export const Leaderboard: React.FC = () => {
  const columns: Column[] = [
    { key: "position", title: "Position" },
    { key: "user", title: "User" },
    { key: "totalPoints", title: "Total Points" },
  ];

  const gridClass = "grid-cols-2 grid-cols-[auto_2fr_1fr] lg:grid-cols-[1fr_3fr_1fr] gap-4";

  const data = Array.from({ length: 5 }).map((_, i) => ({
    position: i + 1,
    user: `User ${i + 1}`,
    totalPoints: 1000,
  }));

  return (
    <Table columns={columns} gridClass={gridClass} bodyClass="gap-0">
      {data.map((row, index) => (
        <div
          key={index}
          className={twMerge(
            "grid first:bg-yellow-500/10 first:border-yellow-500 first:border rounded-2xl p-4 items-center bg-white/5 my-1",
            gridClass,
          )}
        >
          <div className="col-span-1 flex flex-col gap-2">{row.position}</div>
          <div className="col-span-1 flex flex-col gap-2">{row.user}</div>
          <div className="col-span-1 flex flex-col gap-2">{row.totalPoints}</div>
        </div>
      ))}
    </Table>
  );
};
