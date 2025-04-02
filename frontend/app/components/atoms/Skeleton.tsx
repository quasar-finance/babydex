import type React from "react";
import { twMerge } from "~/utils/twMerge";

const Skeleton: React.FC<React.SVGAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge("animate-pulse bg-white/10 rounded-md", className)}
      {...props}
    ></div>
  );
};

export default Skeleton;
