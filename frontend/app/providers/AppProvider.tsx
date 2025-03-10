"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ModalProvider } from "./ModalProvider";
import { ThemeProvider } from "./ThemeProvider";
import { TrpcProvider } from "./TrpcProvider";

import type { PropsWithChildren } from "react";
import { CosmiProvider } from "@cosmi/react";
import { cosmi } from "~/config/cosmi";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CosmiProvider config={cosmi}>
        <TrpcProvider queryClient={queryClient}>
          <ThemeProvider>
            <ModalProvider>{children}</ModalProvider>
            <Toaster position="bottom-right" reverseOrder />
          </ThemeProvider>
        </TrpcProvider>
      </CosmiProvider>
    </QueryClientProvider>
  );
};

export default AppProvider;
