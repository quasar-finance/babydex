import type React from "react";

const IconSearch: React.FC<React.SVGAttributes<HTMLOrSVGElement>> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.5"
        d="m13.333 13.333-2.582-2.582m0 0a4.833 4.833 0 1 0-6.835-6.835 4.833 4.833 0 0 0 6.835 6.835Z"
      ></path>
    </svg>
  );
};

export default IconSearch;
