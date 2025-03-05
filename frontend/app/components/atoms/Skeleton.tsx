import clsx from "clsx";

import type React from "react";

const Skeleton: React.FC<React.SVGAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("animate-pulse bg-white/10 rounded-md", className)}
      {...props}
    ></div>
  );
};

export default Skeleton;
