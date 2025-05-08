import type { ReactNode } from "react";
import React from "react";
import { twMerge } from "~/utils/twMerge";

interface Column {
  key: string;
  title: ReactNode;
  className?: string;
  sortable?: boolean;
}

interface TableProps {
  columns: Column[];
  children: ReactNode;
  gridClass?: string;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ columns, children, gridClass, className }) => {
  return (
    <div className={twMerge("flex flex-col gap-3", className)}>
      <div className={twMerge("hidden lg:grid px-4 text-xs text-white/50", gridClass)}>
        {columns.map((col) => (
          <div key={col.key} className={col.className}>
            {col.title}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 lg:gap-0">{children}</div>
    </div>
  );
};

interface TableRowProps {
  children: ReactNode[];
  gridClass?: string;
  onClick?: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({ children, gridClass, onClick }) => {
  if (!Array.isArray(children)) {
    throw new Error("TableRow must have multiple children matching the column count.");
  }

  return (
    <div
      className={twMerge(
        "rounded-2xl border lg:rounded-none lg:first:rounded-t-2xl lg:last:rounded-b-2xl lg:border-b-0 lg:last:border-b-1 border-white/10 p-4 items-center bg-tw-bg/50 backdrop-blur-md",
        gridClass,
      )}
      onClick={onClick}
    >
      {children.map((child, index) => (
        <React.Fragment key={index}>{child}</React.Fragment>
      ))}
    </div>
  );
};
