import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "~/utils/twMerge";
import { motion } from "motion/react";

interface Props {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const RangeSelector: React.FC<Props> = ({ value, onChange, className }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

  const updateValueFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      const percent = (x / rect.width) * 100;
      onChange(Math.round(percent));
    },
    [onChange],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        updateValueFromPosition(e.clientX);
      }
    },
    [isDragging, updateValueFromPosition],
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValueFromPosition(e.clientX);
  };

  return (
    <div className={twMerge("w-full px-2", className)}>
      <div ref={trackRef} className="relative h-2 cursor-pointer" onMouseDown={handleMouseDown}>
        <div className="absolute top-1/2 left-0 w-full h-1 bg-neutral-700 rounded -translate-y-1/2" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-tw-orange-400 rounded -translate-y-1/2"
          style={{ width: `${value}%` }}
        />
        <div
          className="absolute top-1/2 w-4 h-4 border-2 border-tw-bg bg-tw-orange-400 rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none"
          style={{ left: `${value}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-neutral-400 mt-2 select-none">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  );
};
