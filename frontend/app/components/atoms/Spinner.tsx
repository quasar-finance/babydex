"use client";
import { extendVariants, Spinner as NextSpinner } from "@heroui/react";

export const Spinner = extendVariants(NextSpinner, {
  variants: {
    color: {
      primary: {
        circle1: "border-b-tw-orange-400",
        circle2: "border-b-tw-orange-400",
      },
    },
  },
  defaultVariants: {
    color: "primary",
    size: "md",
  },
});
