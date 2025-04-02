"use client";

import type { PropsWithChildren } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="relative flex flex-col items-center justify-center max-w-screen min-h-screen gap-8 scrollbar-none">
      <Header />
      <div className="flex-1 w-full mx-auto z-20">{children}</div>

      <Footer />
    </main>
  );
};

export default Layout;
