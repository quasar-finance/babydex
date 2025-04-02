import { IconChevronDown } from "@tabler/icons-react";
import type React from "react";
import { useState } from "react";
import { mockTokens } from "~/utils/consts";
import RotateButton from "../../atoms/RotateButton";
import { motion } from "motion/react";
import { ModalTypes } from "~/types/modal";
import { useModal } from "~/app/providers/ModalProvider";

export const Bridge: React.FC = () => {
  const [fromToken, setFromToken] = useState(mockTokens[2]);
  const [toToken, setToToken] = useState(mockTokens[3]);
  const [_isConnected, _setIsConnected] = useState(false);
  const { showModal } = useModal();

  return (
    <div className="flex flex-col gap-2 w-full items-center justify-center">
      <div className="w-full rounded-xl p-4 bg-tw-bg">
        <div className="flex items-center justify-between">
          <motion.button
            className="flex items-center gap-2 p-2 bg-white/5 rounded-full"
            onClick={() => showModal(ModalTypes.select_asset, true)}
          >
            <img src={fromToken.logoURI} alt={fromToken.name} className="w-7 h-7" />
            <p>{fromToken.symbol}</p>
            <IconChevronDown className="h-4 w-4" />
          </motion.button>
          <p>0.00</p>
        </div>
      </div>
      <RotateButton />
      <div className="w-full rounded-xl p-4 bg-tw-bg">
        <div className="flex items-center justify-between">
          <motion.button
            className="flex items-center gap-2 p-2 bg-white/5 rounded-full"
            onClick={() => showModal(ModalTypes.select_asset, true)}
          >
            <img src={toToken.logoURI} alt={toToken.name} className="w-7 h-7" />
            <p>{toToken.symbol}</p>
            <IconChevronDown className="h-4 w-4" />
          </motion.button>
          <p>0.00</p>
        </div>
      </div>
    </div>
  );
};
