"use client";

import {
  IconArrowsLeftRight,
  IconReload,
  IconRepeat,
  IconSettingsFilled,
} from "@tabler/icons-react";
import { Button } from "../atoms/Button";
import { ModalTypes } from "~/types/modal";
import { useModal } from "~/app/providers/ModalProvider";
import { motion } from "motion/react";
import SwapInfoAccordion from "../molecules/Swap/SwapInfoAccordion";
import { useAccount, useBalances } from "@cosmi/react";
import { Tab, TabList, TabContent, Tabs } from "../atoms/Tabs";
import { Swap } from "../organisms/swap/Swap";
import { Bridge } from "../organisms/swap/Bridge";
import { useSkipClient } from "~/app/hooks/useSkipClient";
import { FormProvider, useForm } from "react-hook-form";
import { useToast } from "~/app/hooks";
import { useMemo, useState } from "react";
import { useSwapStore } from "~/app/hooks/useSwapStore";
import TruncateText from "../atoms/TruncateText";

const SwapComponent: React.FC = () => {
  const [action, setAction] = useState("swap");
  const { isConnected, address, chain } = useAccount();
  const { showModal } = useModal();
  const { slippage } = useSwapStore();
  const methods = useForm({ mode: "onChange" });
  const { formState, handleSubmit, reset } = methods;
  const { toast } = useToast();
  const { errors, isValid } = formState;

  const { skipClient, simulation: simulationResult } = useSkipClient({ cacheKey: action });
  const { data: simulation, isLoading, isError, isFetching } = simulationResult;

  const { refetch: refreshBalances } = useBalances();

  const { isDisabled, text } = useMemo(() => {
    if (isFetching) return { isDisabled: true, text: "Fetching Quote" };
    if (isError) return { isDisabled: true, text: "No routes found" };
    if (Object.keys(errors).length) return { isDisabled: true, text: "Insufficient Balance" };
    if (isValid) return { isDisabled: false, text: "Swap" };
    return { isDisabled: true, text: "Choose Amount" };
  }, [isValid, errors, isError, isFetching]);

  const onSubmit = handleSubmit(async () => {
    if (!skipClient || !simulation) throw new Error("error: no client or simulation");
    const { requiredChainAddresses } = simulation;
    const slippageTolerancePercent = slippage === "auto" ? undefined : slippage;

    const id = toast.loading(
      {
        title: "Processing transaction...",
        description: "Waiting for transaction to be completed",
      },
      { duration: Number.POSITIVE_INFINITY },
    );

    try {
      await skipClient?.executeRoute({
        route: simulation,
        slippageTolerancePercent,
        userAddresses: requiredChainAddresses.map((chainID) => ({
          chainID,
          address: address as string,
        })),
        onTransactionSigned: async ({ chainID }) => {
          toast.success({
            title: "Succesfully Signed",
            description: `Transaction signed with chain ID: ${chainID}`,
          });
        },
        onTransactionCompleted: async (chainID, txHash, status) => {
          toast.dismiss(id);
          toast.success({
            title: "Success",
            component: () => (
              <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-1">
                  <p>Route completed with tx hash:</p>
                  <TruncateText text={txHash} />{" "}
                </div>
                <a
                  className="underline hover:no-underline"
                  target="_blank"
                  href={`${chain?.blockExplorers?.default.url}/tx/${txHash}`}
                  rel="noreferrer"
                >
                  See tx
                </a>
              </div>
            ),
          });
        },
      });
      reset();
    } catch (e: any) {
      toast.dismiss(id);
      toast.error({
        title: "Error",
        description: e.message,
      });
    }
    refreshBalances();
  });

  return (
    <div className="flex flex-col min-h-[65vh] gap-8 w-full items-center relative">
      <form
        className="flex flex-col gap-4 max-w-[434px] mx-auto py-8 px-4 relative z-20 w-full"
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
                  <IconArrowsLeftRight className="w-5 h-5" />
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
          <div className="w-full flex flex-col gap-6  relative z-20">
            <div className="backdrop-blur-md rounded-2xl">
              {isConnected ? (
                <Button
                  fullWidth
                  type="submit"
                  isDisabled={isDisabled}
                  isLoading={isLoading}
                  className="backdrop-blur-md"
                >
                  {text}
                </Button>
              ) : (
                <Button onPress={() => showModal(ModalTypes.connect_wallet)} fullWidth>
                  Connect Wallet
                </Button>
              )}
            </div>
            <SwapInfoAccordion simulation={simulation} className="absolute w-full top-14" />
          </div>
        </FormProvider>
      </form>
    </div>
  );
};

export default SwapComponent;
