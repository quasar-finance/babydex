"use client";

import { IconSettingsFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Button } from "../atoms/Button";
import { ModalTypes } from "~/types/modal";
import { useModal } from "~/app/providers/ModalProvider";
import { motion } from "motion/react";
import SwapInfoAccordion from "../molecules/Swap/SwapInfoAccordion";
import { useAccount } from "@cosmi/react";
import { Tab, TabList, TabContent, Tabs } from "../atoms/Tabs";
import { Swap } from "../organisms/swap/Swap";
import { Bridge } from "../organisms/swap/Bridge";

const SwapComponent: React.FC = () => {
  const [_isConnected, _setIsConnected] = useState(false);
  const { isConnected } = useAccount();
  const { showModal } = useModal();

  useEffect(() => {
    _setIsConnected(isConnected);
  }, [isConnected]);

  return (
    <>
      <div className="flex flex-col gap-4 max-w-[434px] mx-auto py-8 px-4 relative z-20">
        <div className="w-full flex-1 flex items-center justify-center bg-tw-sub-bg rounded-2xl p-2 flex-col relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => showModal(ModalTypes.swap_settings, true)}
            className="absolute top-4 right-4 p-2 bg-tw-bg rounded-full"
          >
            <IconSettingsFilled className="w-5 h-5" />
          </motion.button>

          <Tabs defaultKey="swap">
            <TabList>
              <Tab tabKey="swap">Swap</Tab>
              <Tab tabKey="bridge">Bridge</Tab>
            </TabList>

            <TabContent tabKey="swap">
              <Swap />
            </TabContent>
            <TabContent tabKey="bridge">
              <Bridge />
            </TabContent>
          </Tabs>
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
      <img
        src="/tower-gradient.png"
        alt="letters"
        className="absolute bottom-0 left-0 w-full object-cover select-none z-10 min-h-[35rem]"
        draggable="false"
      />
    </>
  );
};

export default SwapComponent;
