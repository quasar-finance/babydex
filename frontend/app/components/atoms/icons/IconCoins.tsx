import type React from "react";

const IconCoins: React.FC<React.SVGAttributes<HTMLOrSVGElement>> = ({
	...props
}) => {
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
				strokeLinecap="square"
				strokeWidth="1.5"
				d="M8.56 4.306a3.646 3.646 0 1 0-3.408 5.172m7.243-1.311a3.646 3.646 0 1 1-7.291 0 3.646 3.646 0 0 1 7.291 0Z"
			></path>
		</svg>
	);
};

export default IconCoins;
