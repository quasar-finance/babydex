"use client";

import { IconChevronDown, IconSettingsFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Button } from "../atoms/Button";
import { ModalTypes } from "~/types/modal";
import { useModal } from "~/app/providers/ModalProvider";
import { motion } from "motion/react";
import RotateButton from "../atoms/RotateButton";
import { mockTokens } from "~/utils/consts";
import SwapInfoAccordion from "../molecules/Swap/SwapInfoAccordion";
import { trpc } from "~/trpc/client";
import { useAccount } from "@cosmi/react";

const SwapComponent: React.FC = () => {
  const [fromToken, setFromToken] = useState(mockTokens[0]);
  const [toToken, setToToken] = useState(mockTokens[1]);
  const [_isConnected, _setIsConnected] = useState(false);
  const { isConnected } = useAccount();
  const { showModal } = useModal();

  useEffect(() => {
    _setIsConnected(isConnected);
  }, [isConnected]);

  return (
    <div className="flex flex-col gap-4 max-w-[434px] mx-auto py-16">
      <div className="w-full flex-1 flex items-center justify-center bg-tw-sub-bg rounded-2xl p-2 flex-col">
        <div className="flex items-center justify-between w-full p-4">
          <p className="text-xl">Swap </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => showModal(ModalTypes.swap_settings, true)}
          >
            <IconSettingsFilled className="w-5 h-5" />
          </motion.button>
        </div>
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
      </div>
      <div className="w-full px-4 flex flex-col gap-6">
        {_isConnected ? (
          <Button fullWidth>Swap</Button>
        ) : (
          <Button onPress={() => showModal(ModalTypes.connect_wallet)} fullWidth>
            Connect wallet
          </Button>
        )}
        <SwapInfoAccordion
          fee={1.54}
          minimumReceived="0.345 BTC"
          priceImpact={-0.034}
          maxSlippage={1}
        />
      </div>
    </div>
  );
};

export default SwapComponent;
