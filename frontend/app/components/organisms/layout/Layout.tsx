"use client";

import type { PropsWithChildren } from "react";
import { Header } from "./Header";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="relative flex flex-col items-center justify-center max-w-screen min-h-screen gap-8">
      <Header />
      <div className="flex-1 w-full max-w-[84.5rem] mx-auto z-20">{children}</div>
      <footer className="h-[20vh] relative w-full">
        <img
          src="/letters.png"
          alt="letters"
          className="absolute bottom-0 left-0 w-full object-cover h-[335px] object-top opacity-20 select-none z-0 "
          draggable="false"
        />
      </footer>
    </main>
  );
};

export default Layout;
