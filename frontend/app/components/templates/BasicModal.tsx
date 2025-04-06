import { motion } from "motion/react";
import { useModal } from "~/app/providers/ModalProvider";
import { IconX } from "@tabler/icons-react";
import { twMerge } from "~/utils/twMerge";
import Divider from "../atoms/Divider";

import type { PropsWithChildren, ReactNode } from "react";
import FlexibleContainer from "../atoms/FlexibleContainer";

export const modalDropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.331,
      type: "spring",
      damping: 36.2,
      stiffness: 563,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

interface Props {
  title?: string;
  subtitle?: string | ReactNode;
  separator?: boolean;
  showClose?: boolean;
  classNames?: {
    container?: string;
    wrapper?: string;
  };
  onClose?: () => void;
}

const BasicModal: React.FC<PropsWithChildren<Props>> = ({
  children,
  title,
  subtitle,
  classNames,
  separator = true,
  showClose = true,
  onClose,
}) => {
  const { hideModal } = useModal();
  return (
    <FlexibleContainer>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className={twMerge(
          "rounded-xl max-w-[480px] w-full bg-tw-gray-950 flex flex-col border-1 border-white/10 relative overflow-visible",
          classNames?.wrapper,
        )}
        variants={modalDropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div
          className={twMerge(
            "flex justify-between w-full ",
            { "items-center p-4": (title && subtitle) || title },
            { "items-start p-4": title && subtitle },
          )}
        >
          <div className="flex flex-col gap-1">
            {title && <p>{title}</p>}
            {typeof subtitle === "string" ? (
              <p className="text-xs text-tw-gray-500">{subtitle}</p>
            ) : (
              subtitle
            )}
          </div>
          {showClose && (
            <button onClick={() => [hideModal(), onClose?.()]} type="button">
              <IconX
                className={twMerge("h-5 w-5 text-white/20", {
                  "absolute right-4 top-4": !title && !subtitle,
                })}
              />
            </button>
          )}
        </div>
        {separator && <Divider />}
        <div className={twMerge("p-4", classNames?.container)}>{children}</div>
      </motion.div>
    </FlexibleContainer>
  );
};

export default BasicModal;
