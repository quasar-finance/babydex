import Layout from "~/app/components/organisms/layout/Layout";
import "./globals.css";
import { Inter } from "next/font/google";
import AppProvider from "~/app/providers/AppProvider";
import { twMerge } from "~/utils/twMerge";
import Script from "next/script";
import { AnalyticsScripts } from "./components/atoms/AnalyticsScripts";

const inter = Inter({
  variable: "--font-inter",
  display: "optional",
  subsets: ["latin"],
});

export const metadata = {
  title: "tower.fi",
  description: "The official website of Tower.fi",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={twMerge("relative", inter.variable)}>
        <AnalyticsScripts />

        <Script
          defer
          strategy="afterInteractive"
          src="https://widget.mava.app"
          widget-version="v2"
          id="MavaWebChat"
          enable-sdk="false"
          data-token="eea2cb80e6bec4a059aa41be542d8adb8b1318532e7d3f1e300662659b737bd6"
        />
        <AppProvider>
          <Layout>{children}</Layout>
        </AppProvider>
      </body>
    </html>
  );
}
