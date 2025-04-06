import Link from "next/link";
import type React from "react";
import { socialLinks, supportLinks } from "~/utils/consts";
import IconSocial from "../../atoms/icons/IconSocial";
import { usePathname } from "next/navigation";
import { asciiLetters } from "../../ascii/letters";
import { motion, AnimatePresence } from "motion/react";

export const Footer: React.FC = () => {
  const pathname = usePathname();
  return (
    <footer className="w-full">
      <div className="h-[20vh] md:h-[25vh] relative w-full">
        {pathname.includes("swap") && (
          <AnimatePresence>
            <motion.img
              src="/tower-gradient.png"
              alt="letters"
              className="absolute bottom-0 left-0 w-full h-full object-cover select-none min-h-[35rem] bg-black-300"
              draggable="false"
              initial={{ opacity: 0, y: 100 }}
              animate={{ 
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.331,
                  type: "spring",
                  damping: 36.2,
                  stiffness: 563,
                }
              }}
              exit={{ opacity: 0, y: 100 }}
            />
          </AnimatePresence>
        )}
        <pre
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full font-mono text-white text-center select-none text-[2vw] md:text-[0.7vw] whitespace-pre max-w-full overflow-hidden"
          style={{ lineHeight: 1, mixBlendMode: "overlay" }}
        >
          {asciiLetters}
        </pre>
      </div>
      <div>
        <div className="w-full flex items-start justify-between gap-2 border-t border-t-white/10 bg-tw-bg rounded-3xl">
          <div className="w-full max-w-[84.5rem] mx-auto px-6 md:px-12 py-4 md:py-20 flex flex-col md:flex-row items-start justify-between gap-8 z-10">
            <div className="flex flex-col order-2 md:order-1 md:self-stretch md:h-auto justify-between gap-y-10 pb-2">
              <Link href="/">
                <img
                  className="max-h-[2.3rem] object-cover"
                  src="/towerfi-logo.svg"
                  alt="towerfi-logo"
                />
              </Link>
              <p className="text-white/50 mt-auto"> Tower 2025</p>
            </div>
            <div className="flex flex-col gap-4 md:gap-24 lg:flex-row order-1 md:order-2 ">
              <div className="flex flex-col gap-2 md:gap-4">
                <p className="text-white/50 pt-2 text-sm md:pb-4">Community</p>
                {socialLinks.map(({ href, icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-all hover:text-tw-orange-400 flex gap-2 items-center text-sm"
                  >
                    <IconSocial type={icon} />
                    <p>{label}</p>
                  </a>
                ))}
              </div>
              <div className="flex flex-col gap-2 md:gap-4">
                <p className="text-white/50 pt-2 text-sm md:pb-4">Support & Resources</p>
                {supportLinks.map(({ href, label, isExternal }) => (
                  <a
                    key={label}
                    href={href}
                    target={isExternal ? "_blank" : "_self"}
                    rel="noreferrer"
                    className="transition-all hover:text-tw-orange-400 flex gap-2 items-center text-sm"
                  >
                    <p>{label}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
