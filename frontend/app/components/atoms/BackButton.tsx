"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { Fragment } from "react";
import { twMerge } from "~/utils/twMerge";

interface BackButtonProps {
  className?: string;
  children?: React.ReactNode;
  text?: string;
  returnToURL?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  className,
  children,
  returnToURL,
  text = "Back",
}) => {
  const router = useRouter();

  const handleGoBack = () => {
    if (returnToURL) {
      router.push(returnToURL);
      return;
    }

    router.back();
  };

  return (
    <button
      type="button"
      onClick={handleGoBack}
      className={twMerge("flex items-center gap-2 text-sm", className)}
    >
      {children || (
        <Fragment>
          <IconArrowLeft size={14} className="-mt-0.5" />
          <span>{text}</span>
        </Fragment>
      )}
    </button>
  );
};

export default BackButton;
