import Link from "next/link";
import type React from "react";
import { socialLinks, supportLinks } from "~/utils/consts";
import IconSocial from "../../atoms/icons/IconSocial";
import { usePathname } from "next/navigation";

export const Footer: React.FC = () => {
  const pathname = usePathname();
  return (
    <footer className="w-full">
      <div className="h-[20vh] relative w-full">
        <img
          src="/letters.png"
          alt="letters"
          className="absolute bottom-0 left-0 w-full object-cover h-[335px] object-top opacity-20 select-none z-0 "
          draggable="false"
        />
        {pathname.includes("swap") && (
          <img
            src="/tower-gradient.png"
            alt="letters"
            className="absolute bottom-0 left-0 w-full object-cover select-none z-0 min-h-[35rem]"
            draggable="false"
          />
        )}
      </div>
      <div className="w-full flex items-start justify-between gap-2 border-t border-t-white/10">
        <div className="w-full max-w-[84.5rem] mx-auto px-4 py-4 md:py-20 flex flex-col md:flex-row items-start justify-between gap-8 z-10">
          <div className="flex flex-col gap-8 lg:flex-row order-2 md:order-1">
            <Link href="/">
              <img
                className="max-h-[2.3rem] object-cover"
                src="/towerfi-logo.svg"
                alt="towerfi-logo"
              />
            </Link>
          </div>
          <div className="flex flex-col gap-8 lg:flex-row order-1 md:order-2 ">
            <div className="flex flex-col gap-2">
              <p className="text-white/50">Community</p>
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
            <div className="flex flex-col gap-2">
              <p className="text-white/50">Support & Resources</p>
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
    </footer>
  );
};
