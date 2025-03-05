"use client";
import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { identicon } from "@dicebear/collection";
import { twMerge } from "~/utils/twMerge";

interface AvatarProps {
  seed: string;
  size?: number;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ seed, className, size = 100 }) => {
  const avatar = useMemo(() => {
    return createAvatar(identicon, {
      seed,
      backgroundColor: ["transparent"],
    }).toDataUri();
  }, []);

  if (!avatar) return null;

  return <img src={avatar} alt="Avatar" className={twMerge("w-full h-full sepia", className)} />;
};

export default Avatar;
