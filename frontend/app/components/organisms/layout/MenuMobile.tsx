import type React from "react";
import { twMerge } from "~/utils/twMerge";
import { MobileConnectWallet } from "../../molecules/ConnectWallet";
import { NavLinks } from "./NavLinks";

interface Props {
  open: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MenuMobile: React.FC<Props> = ({ open, setIsOpen }) => {
  return (
    <div
      className={twMerge(
        "fixed top-[58px] left-0 w-dvw h-[calc(100dvh-58px)] bg-tw-bg/80 backdrop-blur-lg z-[100] p-4 pt-10 flex flex-col gap-4 items-center justify-between transition-all duration-300",
        open ? "left-0" : "-left-full",
      )}
    >
      <NavLinks closeMenu={() => setIsOpen(false)} />
      <MobileConnectWallet closeMenu={() => setIsOpen(false)} />
    </div>
  );
};
