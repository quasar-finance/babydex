import { Tooltip as NextTooltip } from "@heroui/react";
import type React from "react";
import type { PropsWithChildren } from "react";
import { twMerge } from "~/utils/twMerge";

interface Props {
  content: string | React.ReactNode;
  isDisabled?: boolean;
  className?: string;
}

const Tooltip: React.FC<PropsWithChildren<Props>> = ({
  children,
  content,
  isDisabled,
  className,
}) => {
  return (
    <NextTooltip
      showArrow={true}
      content={content}
      isDisabled={isDisabled}
      classNames={{
        base: [
          "before:content-[''] before:absolute before:-top-2 before:left-1/2 before:-translate-x-[50%] ",
          "before:border-l-8 before:border-r-8 before:border-b-8",
          "before:border-l-transparent before:border-r-transparent before:border-b-white/10",
        ],
        arrow: "",
        content: [twMerge("p-4 border border-white/10 bg-tw-bg", className)],
      }}
      radius="lg"
      placement="bottom"
    >
      {children}
    </NextTooltip>
  );
};

export default Tooltip;
