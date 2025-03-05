import {
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoSquare,
  IconLoader,
  IconSquareCheckFilled,
  IconX,
} from "@tabler/icons-react";
import { twMerge } from "~/utils/twMerge";
import { Spinner } from "./Spinner";

interface Props {
  title: string;
  type: "error" | "success" | "loading" | "warning" | "info";
  close: () => void;
  description?: string;
  component?: React.FC;
}

const Icons = {
  error: {
    Icon: IconAlertTriangle,
    classname: "text-qs-error w-5 h-5",
  },
  loading: {
    Icon: IconLoader,
    classname: "w-5 h-5",
  },
  success: {
    Icon: IconCircleCheck,
    classname: "text-qs-light-green w-5 h-5",
  },
  warning: {
    Icon: IconAlertTriangle,
    classname: "text-qs-light-yellow w-5 h-5",
  },
  info: {
    Icon: IconInfoSquare,
    classname: "text-qs-light-yellow w-5 h-5",
  },
};

const classNames = {
  error: "text-tw-error",
  loading: "gap-4",
  success: "text-tw-success",
  warning: "text-tw-warning",
  info: "text-tw-info",
};

export const ToastCustom: React.FC<Props> = ({
  title,
  description,
  component: Component,
  type,
  close,
}) => {
  const { Icon, classname: IconClassName } = Icons[type as keyof typeof Icons];

  return (
    <div className="bg-tw-gray-950 max-w-[19rem] md:min-w-[19rem] rounded-xl">
      <div className="p-4 border-dashed border-b-1 border-b-white/10 flex items-center justify-between w-full">
        <div
          className={twMerge(
            "flex gap-1 items-center text-sm",
            classNames[type as keyof typeof classNames],
          )}
        >
          {type === "loading" ? <Spinner size="sm" /> : <Icon className={twMerge(IconClassName)} />}
          <p>{title}</p>
        </div>
        <IconX className="h-5 w-5 cursor-pointer text-white/20" onClick={close} />
      </div>
      <div className="p-4">
        {description && !Component ? <p className="text-sm text-gray-300">{description}</p> : null}
        {Component ? <Component /> : null}
      </div>
    </div>
  );
};
