import Layout from "~/app/components/organisms/layout/Layout";
import "./globals.css";
import { Inter } from "next/font/google";
import AppProvider from "~/app/providers/AppProvider";
import { twMerge } from "~/utils/twMerge";

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
        <AppProvider>
          <Layout>{children}</Layout>
        </AppProvider>
      </body>
    </html>
  );
}
