"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ModalProvider } from "./ModalProvider";
import { ThemeProvider } from "./ThemeProvider";
import { TrpcProvider } from "./TrpcProvider";

import type { PropsWithChildren } from "react";

const queryClient = new QueryClient();

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TrpcProvider queryClient={queryClient}>
        <ThemeProvider>
          <ModalProvider>{children}</ModalProvider>
          <Toaster position="bottom-right" reverseOrder />
        </ThemeProvider>
      </TrpcProvider>
    </QueryClientProvider>
  );
};

export default AppProvider;
