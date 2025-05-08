import type React from "react";
import { useState, useEffect } from "react";

interface FadeInOutProps {
  isVisible: boolean;
  children: React.ReactNode;
  duration?: number;
}

export const FadeInOut: React.FC<FadeInOutProps> = ({ isVisible, children, duration = 300 }) => {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timeout = setTimeout(() => setOpacity(100), 10);
      return () => clearTimeout(timeout);
    }

    if (!isVisible) {
      setOpacity(0);
      // remove the element from the DOM after the fade-out animation
      const timeout = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, duration, setOpacity]);

  return shouldRender ? (
    <div className={`transition-opacity duration-${duration} opacity-${opacity}`}>{children}</div>
  ) : null;
};
