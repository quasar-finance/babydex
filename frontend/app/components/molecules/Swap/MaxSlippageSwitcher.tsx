import { useState } from "react";
import { motion } from "motion/react";
import { twMerge } from "~/utils/twMerge";

interface Props {
  maxSlippage: number;
  setMaxSlippage: (value: number) => void;
  custom?: boolean;
}

const MaxSlippageSwitcher: React.FC<Props> = ({ maxSlippage, setMaxSlippage, custom: _custom }) => {
  const [slippage, setSlippage] = useState(maxSlippage);
  const [custom, setCustom] = useState(maxSlippage !== slippage);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlippage(+e.target.value);
    setMaxSlippage(Number(e.target.value));
  };

  const handleChangeAuto = () => {
    setSlippage(maxSlippage);
    setMaxSlippage(maxSlippage);
    setCustom(false);
  };

  /* useEffect(() => {
    setCustom(maxSlippage !== slippage);
  }, [maxSlippage, slippage]); */

  return (
    <motion.div className="bg-white/5 p-1 relative flex h-[38px] rounded-full">
      <motion.button
        onClick={handleChangeAuto}
        className={twMerge(
          "rounded-full px-2 transition-all duration-300",
          custom ? "text-white/50" : "text-tw-orange-400 bg-orange-400/10",
        )}
      >
        Auto
      </motion.button>
      <motion.button
        className={twMerge(
          "rounded-full flex gap-1 items-center px-2 transition-all duration-300",
          custom ? "text-tw-orange-400 bg-orange-400/10" : "text-white/50",
        )}
      >
        <input
          type="number"
          value={slippage}
          onChange={handleChange}
          onFocus={() => setCustom(true)}
          onBlur={() => setCustom(maxSlippage !== slippage)}
          className="bg-transparent outline-none focus:border-none max-w-[1.5rem]"
        />
        <p>%</p>
      </motion.button>
    </motion.div>
  );
};

export default MaxSlippageSwitcher;
