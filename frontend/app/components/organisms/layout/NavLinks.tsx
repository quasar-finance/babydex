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
    <motion.ul className="gap-10 lg:gap-8 flex-1 text-base w-full lg:w-auto flex flex-col lg:flex-row ">
      {navLinks.map(({ label, to, isDisabled = false, isExternal = false }) => {
        const isActive = pathname === to || (to !== '/' && pathname.startsWith(to + '/'));
        return (
          <li
            key={to}
            className={`relative px-1 font-medium text-xl md:text-base cursor-pointer ${
              isDisabled ? "cursor-not-allowed opacity-50" : isActive ? "opacity-100" : "opacity-80"
            }`}
            onClick={() => handleClick(to, isDisabled, isExternal)}
          >
            {label}
            {isActive && (
              <motion.div
                className="absolute md:left-0 md:bottom-0 md:top-auto md:w-full md:h-[3px] lg:h-[1px] bg-tw-orange-400 lg:bottom-[-25px] md:rotate-0 rotate-90 h-full w-[1px] right-2 top-0"
                layoutId="underline"
              />
            )}
          </li>
        );
      })}
    </motion.ul>
  );
};
