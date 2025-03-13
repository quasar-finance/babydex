"use client";
import Link from "next/link";
import ConnectWallet from "../molecules/ConnectWallet";
import { navLinks } from "~/utils/consts";
import { usePathname } from "next/navigation";
import { twMerge } from "~/utils/twMerge";
import { motion } from "motion/react";

import type { PropsWithChildren } from "react";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  return (
    <main className="relative flex flex-col items-center justify-center max-w-screen min-h-screen gap-8">
      <nav className="sticky top-0 w-full border-b-1 border-b-white/10 pt-4 pb-6 backdrop-blur-lg z-50 ">
        <div className="flex gap-6 items-center justify-between max-w-[84.5rem] mx-auto px-2">
          <div className="flex gap-10 items-center justify-center">
            <Link href="/">
              <img
                className="max-h-[2.3rem] object-cover"
                src="/towerfi-logo.svg"
                alt="towerfi-logo"
              />
            </Link>
            <motion.ul className="flex gap-4 flex-1 text-base ">
              {navLinks.map(({ label, to, isDisabled, isExternal }) => {
                const isActive = to.length === 1 ? pathname === to : pathname.includes(to);
                return (
                  <li className="relative px-4" key={`navLink-${to}`}>
                    <Link
                      className={twMerge(
                        "",
                        !isActive && "opacity-80",
                        isDisabled && "cursor-not-allowed",
                      )}
                      href={isDisabled ? "" : to}
                      target={isExternal ? "_blank" : ""}
                    >
                      {label}
                    </Link>
                    {isActive ? (
                      <motion.div
                        className="w-full h-[1px] bg-tw-orange-400 absolute bottom-[-33px] left-0"
                        layoutId="underline"
                      />
                    ) : null}
                  </li>
                );
              })}
            </motion.ul>
          </div>

          <ConnectWallet />
        </div>
      </nav>
      <div className="flex-1 w-full max-w-[84.5rem] mx-auto">{children}</div>
    </main>
  );
};

export default Layout;
