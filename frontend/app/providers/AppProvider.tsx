"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ModalProvider } from "./ModalProvider";
import { ThemeProvider } from "./ThemeProvider";
import { TrpcProvider } from "./TrpcProvider";
import { Web3Provider } from "./Web3Provider";

import type { PropsWithChildren } from "react";

const queryClient = new QueryClient();

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <TrpcProvider queryClient={queryClient}>
          <ThemeProvider>
            <ModalProvider>{children}</ModalProvider>
            <Toaster position="bottom-right" reverseOrder />
          </ThemeProvider>
        </TrpcProvider>
      </Web3Provider>
    </QueryClientProvider>
  );
};

export default AppProvider;
