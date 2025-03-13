import type React from "react";
import { motion } from "motion/react";
import type { PropsWithChildren } from "react";
import { twMerge } from "~/utils/twMerge";

interface Props {
  className?: string;
}

const FlexibleContainer: React.FC<PropsWithChildren<Props>> = ({ children, className }) => {
  return (
    <motion.div
      layout="position"
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={twMerge("overflow-hidden", className)}
    >
      <motion.div layout transition={{ duration: 0.2, ease: "easeInOut" }}>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default FlexibleContainer;
