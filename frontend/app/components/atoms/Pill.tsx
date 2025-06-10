import clsx from "clsx";

import type React from "react";
import { twMerge } from "~/utils/twMerge";

interface Props {
  color?: "grey" | "blue" | "green" | "yellow";
  className?: string;
}

const Pill: React.FC<React.PropsWithChildren<Props>> = ({
  color = "grey",
  children,
  className,
}) => {
  return (
    <div
      className={twMerge(
        "py-1 px-2 rounded-full w-fit h-fit text-xs flex items-center justify-center min-w-fit",
        { "bg-white/10 text-white/50": color.includes("grey") },
        { "bg-tw-blue-500/10 text-tw-blue-300/60": color.includes("blue") },
        { "bg-tw-green-500/10 text-tw-green-300/50": color.includes("green") },
        { "bg-tw-orange-400/10 text-tw-orange-400": color.includes("yellow") },
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Pill;
