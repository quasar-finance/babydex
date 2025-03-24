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
import { useMutation } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { convertMicroDenomToDenom } from "~/utils/intl";
import { Assets } from "~/config";
import { babylonTestnet } from "~/config/chains/babylon-testnet";
import { useToast } from "~/app/hooks";

const assets = Object.values(Assets);

const SwapComponent: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { showModal } = useModal();
  const methods = useForm();
  const { formState, handleSubmit, setValue } = methods;
  const { toast } = useToast();
  const { errors } = formState;

  const { data: skipClient } = useSkipClient();

  const {
    data: simulation,
    mutateAsync: simulateSwap,
    isLoading,
  } = useMutation({
    mutationFn: async ({
      amountIn,
      fromDenom,
      tokenDenom,
      direction,
    }: { amountIn: string; fromDenom: string; tokenDenom: string; direction: string }) => {
      if (!skipClient) throw new Error("error: no client");
      const targetOutput = direction === "lineal" ? "toAmount" : "fromAmount";
      const outputAsset = assets.find((asset) => asset.denom === tokenDenom);

      const simulation = await skipClient.route({
        amountIn,
        sourceAssetDenom: fromDenom,
        sourceAssetChainID: babylonTestnet.id as unknown as string,
        destAssetDenom: tokenDenom,
        destAssetChainID: babylonTestnet.id as unknown as string,
        allowSwaps: true,
        allowUnsafe: true,
      });
      const { amountOut } = simulation;
      const amount = convertMicroDenomToDenom(amountOut, outputAsset?.decimals);
      setValue(targetOutput, amount, { shouldValidate: true });
      return simulation;
    },
  });

  console.log(simulation);

  const onSubmit = handleSubmit(async () => {
    if (!skipClient || !simulation) throw new Error("error: no client or simulation");
    const { requiredChainAddresses } = simulation;
    await skipClient?.executeRoute({
      route: simulation,
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
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => showModal(ModalTypes.swap_settings, true)}
              className="absolute top-[10px] right-2 p-2 bg-tw-bg rounded-full z-10"
            >
              <IconSettingsFilled className="w-5 h-5" />
            </motion.button>

            <Tabs defaultKey="swap">
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
                <Swap simulate={simulateSwap} assets={assets} disabled={isLoading} />
              </TabContent>
              <TabContent tabKey="bridge">
                <Bridge />
              </TabContent>
            </Tabs>
          </div>
          <div className="w-full px-4 flex flex-col gap-6">
            {isConnected ? (
              <Button fullWidth type="submit" disabled={isLoading}>
                Swap
              </Button>
            ) : (
              <Button onPress={() => showModal(ModalTypes.connect_wallet)} fullWidth>
                Connect wallet
              </Button>
            )}
            <SwapInfoAccordion simulation={simulation} fromSymbol="" toSymbol="" />
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
