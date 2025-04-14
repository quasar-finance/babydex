"use client";

import { useEffect, type PropsWithChildren } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import * as amplitude from "@amplitude/analytics-browser";
import mixpanel from "mixpanel-browser";

if (typeof window !== "undefined") {
  amplitude.init("ea5eb25990baaab354865581cff0c417", undefined, {
    defaultTracking: { sessions: true, pageViews: true, formInteractions: true },
  });
}

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    //MIXPANNEL
    const trackMixpanel = (event: MouseEvent) => {
      if (!event.target) return;
      if (event.target instanceof HTMLElement) {
        if (event.target.tagName === "BUTTON") {
          mixpanel.track("Click", { buttonClicked: event.target.innerText });
        }
      }
    };

    document.addEventListener("click", trackMixpanel);

    mixpanel.init("e90af3066ae585a14112ee029fb7a9b7", {
      track_pageview: true,
      persistence: "localStorage",
    });

    return () => {
      document.removeEventListener("click", trackMixpanel);
    };
  }, []);

  return (
    <main className="relative flex flex-col items-center justify-center max-w-screen min-h-screen gap-8 scrollbar-none">
      <Header />
      <div className="flex-1 w-full mx-auto z-20">{children}</div>

      <Footer />
    </main>
  );
};

export default Layout;
