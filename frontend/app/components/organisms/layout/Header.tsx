import Link from 'next/link';
import { NavLinks } from './NavLinks';
import { MenuMobile } from './MenuMobile';
import { useState } from 'react';
import { ConnectWallet } from '../../molecules/ConnectWallet';
import { Hamburguer } from '../../atoms/Hamburguer';
import { useMediaQuery } from '~/app/hooks';

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLg = useMediaQuery('lg');
  return (
    <>
      <nav className="sticky top-0 w-full border-b-1 border-b-white/10 pb-4 backdrop-blur-lg z-50 ">
        <div className="w-full text-[#0F0F0F] bg-tw-orange-400 flex items-center justify-center gap-3 sm:gap-1 px-2 py-1 sm:py-2 mb-4">
          <span className="text-md font-semibold">The Points Airdrop was completed on Nov 13th.</span>
          <a href="https://medium.com/tower-dex/final-baby-airdrop-for-tower-point-farmers-44ff49c8da0a" target="_blank" rel="noopener noreferrer" className="hover:underline text-sm font-bold">
            Learn More
          </a>
        </div>
        <div className="flex gap-6 items-center justify-between max-w-[84.5rem] mx-auto px-4">
          <div className="flex gap-10 items-center justify-center">
            <Link href="/">
              <img className="max-h-[2.3rem] object-cover" src="/towerfi-logo.svg" alt="towerfi-logo" />
            </Link>
            {isLg && <NavLinks />}
          </div>
          {isLg ? <ConnectWallet /> : <Hamburguer isOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />}
        </div>
      </nav>
      {isLg ? null : <MenuMobile open={menuOpen} setIsOpen={setMenuOpen} />}
    </>
  );
};
