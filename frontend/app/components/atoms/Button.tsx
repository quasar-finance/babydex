"use client";
import { extendVariants, Button as NextButton } from "@heroui/react";

export const Button = extendVariants(NextButton, {
  variants: {
    color: {
      orange: "",
      green: "",
      blue: "",
      gradient: "",
    },
    isDisabled: {
      true: "opacity-50 cursor-not-allowed",
    },
    variant: {},
    isIconOnly: {
      true: "p-1 h-fit w-fit min-w-fit",
    },
    size: {
      sm: "text-xs py-2 px-4",
      md: "text-sm py-3 px-6",
      lg: "text-lg py-4 px-8",
    },
  },
  defaultVariants: {
    color: "orange",
    size: "md",
    radius: "full",
    variant: "solid",
  },
  compoundVariants: [
    {
      variant: "solid",
      color: "orange",
      class: "bg-tw-orange-400 text-tw-bg",
    },
    {
      variant: "faded",
      color: "orange",
      class: "border-white/10 bg-tw-gray-900 text-tw-orange-400 data-[hover=true]:opacity-hover",
    },
    {
      variant: "bordered",
      color: "orange",
      class:
        "bg-transparent border-tw-orange-400 text-tw-orange-400 data-[hover=true]:opacity-hover",
    },
    {
      variant: "light",
      color: "orange",
      class: "bg-transparent text-tw-orange-400 data-[hover=true]:bg-tw-orange-400/20",
    },
    {
      variant: "flat",
      color: "orange",
      class: "bg-tw-orange-400/20 text-tw-orange-400 data-[hover=true]:opacity-hover",
    },
    {
      variant: "ghost",
      color: "orange",
      class:
        "border-tw-orange-400 text-tw-orange-400 data-[hover=true]:!bg-tw-orange-400 data-[hover=true]:!text-tw-bg",
    },
    {
      variant: "shadow",
      color: "orange",
      class:
        "shadow-lg shadow-tw-orange-400/40 bg-tw-orange-400 text-tw-bg data-[hover=true]:opacity-hover",
    },

    ///BLUE

    {
      variant: "solid",
      color: "blue",
      class: "bg-tw-blue-600 text-tw-bg",
    },
    {
      variant: "faded",
      color: "blue",
      class: "border-white/10 bg-tw-gray-900 text-tw-blue-600 data-[hover=true]:opacity-hover",
    },
    {
      variant: "bordered",
      color: "blue",
      class: "bg-transparent border-tw-blue-600 text-tw-blue-600 data-[hover=true]:opacity-hover",
    },
    {
      variant: "light",
      color: "blue",
      class: "bg-transparent text-tw-blue-600 data-[hover=true]:bg-tw-blue-600/20",
    },
    {
      variant: "flat",
      color: "blue",
      class: "bg-tw-blue-600/20 text-tw-blue-600 data-[hover=true]:opacity-hover",
    },
    {
      variant: "ghost",
      color: "blue",
      class:
        "border-tw-blue-600 text-tw-blue-600 data-[hover=true]:!bg-tw-blue-600 data-[hover=true]:!text-tw-bg",
    },
    {
      variant: "shadow",
      color: "blue",
      class:
        "shadow-lg shadow-tw-blue-600/40 bg-tw-blue-600 text-tw-bg data-[hover=true]:opacity-hover",
    },

    ///GREEN

    {
      variant: "solid",
      color: "green",
      class: "bg-tw-green-500 text-tw-bg",
    },
    {
      variant: "faded",
      color: "green",
      class: "border-white/10 bg-tw-gray-900 text-tw-green-500 data-[hover=true]:opacity-hover",
    },
    {
      variant: "bordered",
      color: "green",
      class: "bg-transparent border-tw-green-500 text-tw-green-500 data-[hover=true]:opacity-hover",
    },
    {
      variant: "light",
      color: "green",
      class: "bg-transparent text-tw-green-500 data-[hover=true]:bg-tw-green-500/20",
    },
    {
      variant: "flat",
      color: "green",
      class: "bg-tw-green-500/20 text-tw-green-500 data-[hover=true]:opacity-hover",
    },
    {
      variant: "ghost",
      color: "green",
      class:
        "border-tw-green-500 text-tw-green-500 data-[hover=true]:!bg-tw-green-500 data-[hover=true]:!text-tw-bg",
    },
    {
      variant: "shadow",
      color: "green",
      class:
        "shadow-lg shadow-tw-green-500/40 bg-tw-green-500 text-tw-bg data-[hover=true]:opacity-hover",
    },

    ///GRADIENT

    {
      variant: "solid",
      color: "gradient",
      class: "bg-gradient-to-bl from-tw-orange-400 to-tw-blue-500 text-tw-bg",
    },
    {
      variant: "faded",
      color: "gradient",
      class:
        "border-white/10 bg-tw-gray-900 bg-gradient-to-bl from-tw-orange-400 to-tw-blue-500 text-tw-bg text-transparent bg-clip-text font-bold data-[hover=true]:opacity-hover",
    },
    {
      variant: "light",
      color: "gradient",
      class:
        "bg-transparent bg-gradient-to-bl from-tw-orange-400 to-tw-blue-500 text-tw-bg text-transparent bg-clip-text data-[hover=true]:bg-tw-gradient-500/20",
    },
    {
      variant: "flat",
      color: "gradient",
      class:
        "bg-gradient-to-bl from-tw-orange-400/30 to-tw-blue-500/30 text-white/80 data-[hover=true]:opacity-hover",
    },
    {
      variant: "shadow",
      color: "gradient",
      class:
        "shadow-lg shadow-tw-blue-500/40 bg-gradient-to-bl from-tw-orange-400 to-tw-blue-500 text-tw-bg data-[hover=true]:opacity-hover",
    },
  ],
});
