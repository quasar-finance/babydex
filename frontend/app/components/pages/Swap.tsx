"use client";

import { IconReload, IconRepeat, IconSettingsFilled } from "@tabler/icons-react";
import { Button } from "../atoms/Button";
import { ModalTypes } from "~/types/modal";
import { useModal } from "~/app/providers/ModalProvider";
import { motion } from "motion/react";
import SwapInfoAccordion from "../molecules/Swap/SwapInfoAccordion";
import { useAccount } from "@cosmi/react";
import { Tab, TabList, TabContent, Tabs } from "../atoms/Tabs";
import { Swap } from "../organisms/swap/Swap";
import { Bridge } from "../organisms/swap/Bridge";
import { useSkipClient } from "~/app/hooks/useSkipClient";
import { FormProvider, useForm } from "react-hook-form";
import { useToast } from "~/app/hooks";
import { useMemo, useState } from "react";
import { useSwapStore } from "~/app/hooks/useSwapStore";

const SwapComponent: React.FC = () => {
  const [action, setAction] = useState("swap");
  const { isConnected, address } = useAccount();
  const { showModal } = useModal();
  const { slippage } = useSwapStore();
  const methods = useForm();
  const { formState, handleSubmit, reset } = methods;
  const { toast } = useToast();
  const { errors, isValid } = formState;

  const { skipClient, simulation: simulationResult } = useSkipClient({ cacheKey: action });
  const { data: simulation, isLoading, isError } = simulationResult;

  const { isDisabled, text } = useMemo(() => {
    if (isError) return { isDisabled: true, text: "No routes found" };
    if (Object.keys(errors).length) return { isDisabled: true, text: "Insufficient Balance" };
    if (isValid) return { isDisabled: false, text: "Swap" };
    return { isDisabled: true, text: "Choose Amount" };
  }, [isValid, errors, isError]);

  const onSubmit = handleSubmit(async () => {
    if (!skipClient || !simulation) throw new Error("error: no client or simulation");
    const { requiredChainAddresses } = simulation;
    const slippageTolerancePercent = slippage === "auto" ? undefined : slippage;

    await skipClient?.executeRoute({
      route: simulation,
      slippageTolerancePercent,
      userAddresses: requiredChainAddresses.map((chainID) => ({
        chainID,
        address: address as string,
      })),
      onTransactionCompleted: async (chainID, txHash, status) => {
        toast.success({
          title: "Success",
          description: `Route completed with tx hash: ${txHash} & status: ${status.state}`,
        });
      },
      onTransactionBroadcast: async ({ txHash, chainID }) => {
        toast.success({
          title: "Success",
          description: `Transaction broadcasted with tx hash: ${txHash}`,
        });
      },
      onTransactionTracked: async ({ txHash, chainID }) => {
        console.log(`Transaction tracked with tx hash: ${txHash}`);
        toast.success({
          title: "Success",
          description: `Transaction tracked with tx hash: ${txHash}`,
        });
      },
      onTransactionSigned: async ({ chainID }) => {
        toast.success({
          title: "Success",
          description: `Transaction signed with chain ID: ${chainID}`,
        });
      },
    });
  });

  return (
    <>
      <form
        className="flex flex-col gap-4 max-w-[434px] mx-auto py-8 px-4 relative z-20"
        onSubmit={onSubmit}
      >
        <FormProvider {...methods}>
          <div className="w-full flex-1 flex items-center justify-center bg-tw-sub-bg rounded-2xl p-2 flex-col relative">
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => showModal(ModalTypes.swap_settings, true)}
              className="absolute top-[10px] right-2 p-2 bg-tw-bg rounded-full z-10"
            >
              <IconSettingsFilled className="w-5 h-5" />
            </motion.button>

            <Tabs
              defaultKey="swap"
              selectedKey={action}
              onSelectionChange={(a) => [reset(), setAction(a)]}
            >
              <TabList>
                <Tab tabKey="swap">
                  <IconRepeat className="w-5 h-5" />
                  <p>Swap</p>
                </Tab>
                <Tab tabKey="bridge" disabled>
                  <IconReload className="w-5 h-5" />
                  <p>Bridge</p>
                </Tab>
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
            {isConnected ? (
              <Button fullWidth type="submit" isDisabled={isLoading || isDisabled}>
                {text}
              </Button>
            ) : (
              <Button onPress={() => showModal(ModalTypes.connect_wallet)} fullWidth>
                Connect wallet
              </Button>
            )}
            <SwapInfoAccordion simulation={simulation} />
          </div>
        </FormProvider>
      </form>
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
