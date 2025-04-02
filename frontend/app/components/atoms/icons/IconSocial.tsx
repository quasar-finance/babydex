import { IconBrandDiscordFilled, IconBrandTelegram, IconBrandX } from "@tabler/icons-react";
import type React from "react";
import { twMerge } from "~/utils/twMerge";

interface Props extends React.SVGAttributes<HTMLOrSVGElement> {
  type: "discord" | "twitter" | "telegram";
}

const IconSocial: React.FC<Props> = ({ type, className, ...props }) => {
  if (type === "twitter")
    return <IconBrandX className={twMerge("w-5 h-5", className)} {...props} />;
  if (type === "discord")
    return <IconBrandDiscordFilled className={twMerge("w-5 h-5", className)} {...props} />;
  if (type === "telegram")
    return <IconBrandTelegram className={twMerge("w-5 h-5", className)} {...props} />;
};

export default IconSocial;
