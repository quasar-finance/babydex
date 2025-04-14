import Layout from "~/app/components/organisms/layout/Layout";
import "./globals.css";
import { Inter } from "next/font/google";
import AppProvider from "~/app/providers/AppProvider";
import { twMerge } from "~/utils/twMerge";
import Script from "next/script";

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
        <Script id="livesession">
          {`
            window['__ls_namespace'] = '__ls';
            window['__ls_script_url'] = 'https://cdn.livesession.io/track.js';
            !function(w, d, t, u, n) {
              if (n in w) {
                if(w.console && w.console.log) {
                  w.console.log('LiveSession namespace conflict. Please set window["__ls_namespace"].');
                }
                return;
              }
              if (w[n]) return;
              var f = w[n] = function() {
                f.push ? f.push.apply(f, arguments) : f.store.push(arguments)
              };
              if (!w[n]) w[n] = f;
              f.store = [];
              f.v = "1.1";

              var ls = d.createElement(t);
              ls.async = true;
              ls.src = u;
              var s = d.getElementsByTagName(t)[0];
              s.parentNode.insertBefore(ls, s);
            }(window, document, 'script', window['__ls_script_url'], window['__ls_namespace']);

            __ls("init", "aea30c18.14771c76", { keystrokes: false });
            __ls("newPageView");
          `}
        </Script>

        <Script src="https://cdn.amplitude.com/script/725b9fbe2f3fa2add70ba50e93721bbb.js" />
        <Script id="amplitude-init">
          {`
            window.amplitude.init('725b9fbe2f3fa2add70ba50e93721bbb', {
              fetchRemoteConfig: true,
              autocapture: true
            });
          `}
        </Script>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HJ1CN9LZHF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HJ1CN9LZHF');
          `}
        </Script>

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
