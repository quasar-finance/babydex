"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ModalProvider } from "./ModalProvider";
import { ThemeProvider } from "./ThemeProvider";
import { createClient, trpc } from "~/trpc/client";

import type { PropsWithChildren } from "react";
import { CosmiProvider } from "@cosmi/react";
import { cosmi } from "~/config/cosmi";
import { TransactionDisplayProvider } from './TransactionDisplayProvider';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

const trpcClient = createClient();

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <CosmiProvider config={cosmi}>
          <ThemeProvider>
            <ModalProvider>
              <TransactionDisplayProvider>
                {children}
              </TransactionDisplayProvider>
            </ModalProvider>
            <Toaster
              containerStyle={{
                zIndex: 99999999,
              }}
              toastOptions={{
                style: {
                  zIndex: 99999999,
                },
              }}
              position="bottom-right"
              reverseOrder
            />
          </ThemeProvider>
        </CosmiProvider>
      </trpc.Provider>
    </QueryClientProvider>
  );
};

export default AppProvider;
