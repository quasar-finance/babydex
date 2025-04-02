import type React from "react";
import { twMerge } from "~/utils/twMerge";

interface Props {
  isOpen: boolean;
  onClick: () => void;
}

export const Hamburguer: React.FC<Props> = ({ isOpen, onClick }) => {
  return (
    <div className="lg:hidden flex gap-2 flex-col" onClick={onClick}>
      <div
        className={twMerge(
          "w-[22px] h-[2px] bg-white/50 transition-all",
          isOpen ? "rotate-45 translate-y-[5px]" : "",
        )}
      />
      <div
        className={twMerge(
          "w-[22px] h-[2px] bg-white/50 transition-all",
          isOpen ? "-rotate-45 translate-y-[-5px]" : "",
        )}
      />
    </div>
  );
};
