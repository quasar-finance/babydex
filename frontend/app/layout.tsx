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
        <Script id="mixpanel">
          {`
            (function (f, b) { 
              if (!b.__SV) { 
                var e, g, i, h; 
                window.mixpanel = b; 
                b._i = []; 
                b.init = function (e, f, c) { 
                  function g(a, d) { 
                    var b = d.split("."); 
                    if (b.length === 2) {
                      a = a[b[0]]; 
                      d = b[1];
                    } 
                    a[d] = function () { 
                      a.push([d].concat(Array.prototype.slice.call(arguments, 0))); 
                    }; 
                  } 
                  var a = b; 
                  if (typeof c !== "undefined") {
                    a = b[c] = []; 
                  } else {
                    c = "mixpanel"; 
                  }
                  a.people = a.people || []; 
                  a.toString = function (a) { 
                    var d = "mixpanel"; 
                    if ("mixpanel" !== c) d += "." + c; 
                    if (!a) d += " (stub)"; 
                    return d; 
                  }; 
                  a.people.toString = function () { 
                    return a.toString(1) + ".people (stub)"; 
                  }; 
                  i = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" "); 
                  for (h = 0; h < i.length; h++) g(a, i[h]); 
                  a.get_group = function () { 
                    function b(c) { 
                      d[c] = function () { 
                        call2_args = arguments; 
                        call2 = [c].concat(Array.prototype.slice.call(call2_args, 0)); 
                        a.push([e, call2]); 
                      }; 
                    } 
                    var d = {}, e = ["get_group"].concat(Array.prototype.slice.call(arguments, 0)), c = 0; 
                    for (; c < j.length; c++) b(j[c]); 
                    return d; 
                  }; 
                  b._i.push([e, f, c]); 
                }; 
                b.__SV = 1.2; 
                e = f.createElement("script"); 
                e.type = "text/javascript"; 
                e.async = !0; 
                e.src = "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"; 
                g = f.getElementsByTagName("script")[0]; 
                g.parentNode.insertBefore(e, g); 
              } 
            })(document, window.mixpanel || []);

            window.mixpanel.init("e90af3066ae585a14112ee029fb7a9b7", {
              debug: true,
              track_pageview: true,
              persistence: "localStorage",
            });
          `}
        </Script>

        <Script
          src="https://cdn.amplitude.com/script/725b9fbe2f3fa2add70ba50e93721bbb.js"
        />
        <Script id="amplitude-init">
          {`
            window.amplitude.init('725b9fbe2f3fa2add70ba50e93721bbb', {
              fetchRemoteConfig: true,
              autocapture: true
            });
          `}
        </Script>

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
          src="https://www.googletagmanager.com/gtag/js?id=G-HJ1CN9LZHF"
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
