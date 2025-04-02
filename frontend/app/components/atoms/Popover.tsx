"use client";
import {
  extendVariants,
  Popover as NextPopover,
  PopoverTrigger as NextPopoverTrigger,
  PopoverContent as NextPopoverContent,
} from "@heroui/react";

export const Popover = extendVariants(NextPopover, {
  variants: {},
  defaultVariants: {
    placement: "bottom",
    showArrow: "true",
    offset: 10,
  },
});

export const PopoverTrigger = extendVariants(NextPopoverTrigger, {
  variants: {},
  defaultVariants: {},
});

export const PopoverContent = extendVariants(NextPopoverContent, {
  variants: {
    color: {
      default:
        "border border-tw-gray-900 bg-tw-bg rounded-xl py-2 relative overflow-hidden p-2 flex items-start flex-col gap-3",
    },
    size: {
      default: "min-w-[20rem]",
    },
  },
  defaultVariants: {
    color: "default",
    size: "default",
  },
});
