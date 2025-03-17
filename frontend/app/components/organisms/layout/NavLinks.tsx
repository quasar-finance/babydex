import type React from "react";
import { navLinks } from "~/utils/consts";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  closeMenu?: () => void;
}

export const NavLinks: React.FC<Props> = ({ closeMenu }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (to: string, isDisabled?: boolean, isExternal?: boolean) => {
    if (isDisabled) return;

    if (isExternal) {
      window.open(to, "_blank");
    } else {
      router.push(to);
    }

    closeMenu?.();
  };

  return (
    <motion.ul className="gap-10 lg:gap-4 flex-1 text-base w-full lg:w-auto flex flex-col lg:flex-row ">
      {navLinks.map(({ label, to, isDisabled = false, isExternal = false }) => {
        const isActive = to.length === 1 ? pathname === to : pathname.includes(to);
        return (
          <li
            key={to}
            className={`relative px-4 text-2xl md:text-base cursor-pointer ${
              isDisabled ? "cursor-not-allowed opacity-50" : "opacity-80"
            }`}
            onClick={() => handleClick(to, isDisabled, isExternal)}
          >
            {label}
            {isActive && (
              <motion.div
                className="absolute left-0 w-1/2 lg:w-full h-[3px] lg:h-[1px] bg-tw-orange-400 lg:bottom-[-33px]"
                layoutId="underline"
              />
            )}
          </li>
        );
      })}
    </motion.ul>
  );
};
