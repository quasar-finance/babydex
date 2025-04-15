import type React from "react";
import Script from "next/script";

export const AnalyticsScripts: React.FC = () => {
  return (
    <>
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

      <Script
        src="https://cdn.amplitude.com/script/725b9fbe2f3fa2add70ba50e93721bbb.js"
        strategy="afterInteractive"
      />
      <Script id="amplitude-init" strategy="lazyOnload">
        {`
            window.amplitude?.init('725b9fbe2f3fa2add70ba50e93721bbb', {
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
    </>
  );
};
