import type React from "react";

const IconRepeatArrow: React.FC<React.SVGAttributes<HTMLOrSVGElement>> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 14 14"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M2.188 7.73V3.937c0-.645.522-1.167 1.166-1.167h5.459m-1.436-1.75 1.812 1.75-1.812 1.75m4.436 1.75v3.792c0 .644-.523 1.166-1.167 1.166H5.187m1.436 1.75-1.812-1.75 1.812-1.75"
      ></path>
    </svg>
  );
};

export default IconRepeatArrow;
