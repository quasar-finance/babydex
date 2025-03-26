"use client";
import { extendVariants, Button as NextButton } from "@heroui/react";

export const Button = extendVariants(NextButton, {
  variants: {
    color: {
      primary: "outline-none focus:outline-none",
      secondary: "outline-none focus:outline-none",
      tertiary: "outline-none focus:outline-none",
    },
    isDisabled: {
      true: "!bg-white/10 z-10 backdrop-2xl !text-white/70 !hover:bg-white/10 cursor-not-allowed",
    },
    variant: {},
    isIconOnly: {
      true: "p-1 h-fit w-fit min-w-fit",
    },
    size: {
      xs: "text-xs py-1 px-2",
      sm: "text-xs py-2 px-4",
      md: "text-sm py-3 px-6",
      lg: "text-lg py-4 px-8",
      icon: "p-1 min-h-fit min-w-fit",
    },
  },
  defaultVariants: {
    color: "primary",
    size: "md",
    radius: "full",
  },
  compoundVariants: [
    {
      color: "primary",
      class: "bg-tw-orange-400 text-tw-bg",
    },
    {
      variant: "faded",
      color: "primary",
      class: "border-white/10 bg-tw-gray-900 text-tw-orange-400 hover:opacity-hover",
    },
    {
      variant: "flat",
      color: "primary",
      class: "bg-tw-orange-400/20 text-tw-orange-400 hover:opacity-hover",
    },
    {
      variant: "ghost",
      color: "primary",
      class:
        "bg-transparent border-tw-orange-400 text-tw-orange-400 hover:!bg-tw-orange-400 hover:!text-tw-bg",
    },
    {
      variant: "light",
      color: "primary",
      class: "bg-transparent hover:text-tw-orange-400 hover:bg-transparent",
    },
    {
      color: "secondary",
      class: "bg-tw-orange-400/20 text-tw-orange-400 hover:bg-tw-orange-400/10",
    },
    {
      color: "tertiary",
      class: "bg-white/10 text-white",
    },
  ],
});
