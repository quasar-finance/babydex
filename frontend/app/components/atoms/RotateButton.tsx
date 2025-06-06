import { useState } from "react";
import { motion } from "motion/react";
import IconRepeatArrow from "./icons/IconRepeatArrow";

interface RotateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const RotateButton: React.FC<RotateButtonProps> = ({ className, onClick }) => {
  const [rotation, setRotation] = useState(0);
  const handleRotate = () => {
    setRotation((prev) => (prev === 0 ? 180 : 0));
  };
  return (
    <motion.button
      type="button"
      animate={{ rotate: rotation }}
      transition={{ duration: 0.3 }}
      onClick={(e) => [onClick?.(e), handleRotate()]}
      className="bg-tw-sub-bg my-[-1.4rem] w-9 h-9 flex items-center justify-center relative z-10 rounded-full"
    >
      <IconRepeatArrow className="w-4 h-4" />
    </motion.button>
  );
};

export default RotateButton;
