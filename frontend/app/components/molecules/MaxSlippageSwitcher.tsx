import { motion } from "motion/react";
import { twMerge } from "~/utils/twMerge";

interface Props {
  maxSlippage: string;
  setMaxSlippage: (value: string) => void;
}

const MaxSlippageSwitcher: React.FC<Props> = ({ maxSlippage, setMaxSlippage }) => {
  const isCustom = maxSlippage === "auto";

  return (
    <motion.div className="bg-white/5 p-1 relative flex h-[38px] rounded-full">
      <motion.button
        onClick={() => setMaxSlippage("auto")}
        className={twMerge(
          "rounded-full px-2 transition-all duration-300",
          isCustom ? "text-tw-orange-400 bg-orange-400/10" : "text-white/50",
        )}
      >
        Auto
      </motion.button>
      <motion.button
        className={twMerge(
          "rounded-full flex gap-1 items-center px-2 transition-all duration-300",
          !isCustom ? "text-tw-orange-400 bg-orange-400/10" : "text-white/50",
        )}
      >
        <input
          type="number"
          onFocus={() => setMaxSlippage(isCustom ? "0.5" : maxSlippage)}
          value={isCustom ? "0.5" : maxSlippage}
          onChange={(e) => setMaxSlippage(e.target.value)}
          className="bg-transparent outline-none focus:border-none max-w-[1.5rem] text-right"
        />
        <p>%</p>
      </motion.button>
    </motion.div>
  );
};

export default MaxSlippageSwitcher;
