import type React from "react";

interface Props {
  dashed?: boolean;
}

const Divider: React.FC<Props> = ({ dashed }) => {
  return (
    <span className="w-full block text-white/10">
      <svg
        className="w-full"
        height="1"
        viewBox="0 0 589 1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <line
          x1="0"
          y1="0.5"
          x2="589"
          y2="0.5"
          stroke="currentColor"
          strokeDasharray={dashed ? "4 4" : "0"}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
};

export default Divider;
