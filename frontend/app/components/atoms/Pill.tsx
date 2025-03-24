import clsx from "clsx";

import type React from "react";

interface Props {
  color?: "grey" | "blue" | "green";
  className?: string;
}

const Pill: React.FC<React.PropsWithChildren<Props>> = ({
  color = "grey",
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        "py-1 px-2 rounded-full w-fit h-fit text-xs flex items-center justify-center min-w-fit",
        { "bg-white/10 text-white/50": color.includes("grey") },
        { "bg-tw-blue-500/10 text-tw-blue-300/40": color.includes("blue") },
        { "bg-tw-green-500/10 text-tw-green-300/40": color.includes("green") },
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Pill;
