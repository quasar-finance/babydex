import Link from "next/link";
import { NavLinks } from "./NavLinks";
import { MenuMobile } from "./MenuMobile";
import { useState } from "react";
import { ConnectWallet } from "../../molecules/ConnectWallet";
import { Hamburguer } from "../../atoms/Hamburguer";
import { useMediaQuery } from "~/app/hooks";

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLg = useMediaQuery("lg");
  return (
    <>
      <nav className="sticky top-0 w-full border-b-1 border-b-white/10 pb-4 pt-4 backdrop-blur-lg z-50 ">
        <div className="flex gap-6 items-center justify-between max-w-[84.5rem] mx-auto px-4">
          <div className="flex gap-10 items-center justify-center">
            <Link href="/">
              <img
                className="max-h-[2.3rem] object-cover"
                src="/towerfi-logo.svg"
                alt="towerfi-logo"
              />
            </Link>
            {isLg && <NavLinks />}
          </div>
          {isLg ? (
            <ConnectWallet />
          ) : (
            <Hamburguer isOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
          )}
        </div>
      </nav>
      {isLg ? null : <MenuMobile open={menuOpen} setIsOpen={setMenuOpen} />}
    </>
  );
};
