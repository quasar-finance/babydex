"use client";

import { IconSettingsFilled } from "@tabler/icons-react";
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

const assets = Object.values(Assets);

const SwapComponent: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { showModal } = useModal();
  const methods = useForm();
  const { formState, handleSubmit, setValue } = methods;
  const { errors } = formState;

  const { data: skipClient } = useSkipClient();

  const { data: simulation, mutateAsync: simulateSwap } = useMutation({
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
        console.log(`Route completed with tx hash: ${txHash} & status: ${status.state}`);
      },
      onTransactionBroadcast: async ({ txHash, chainID }) => {
        console.log(`Transaction broadcasted with tx hash: ${txHash}`);
      },
      onTransactionTracked: async ({ txHash, chainID }) => {
        console.log(`Transaction tracked with tx hash: ${txHash}`);
      },
      onTransactionSigned: async ({ chainID }) => {
        console.log(`Transaction signed with chain ID: ${chainID}`);
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
                <Swap simulate={simulateSwap} assets={assets} />
              </TabContent>
              <TabContent tabKey="bridge">
                <Bridge />
              </TabContent>
            </Tabs>
          </div>
          <div className="w-full px-4 flex flex-col gap-6">
            {isConnected ? (
              <Button fullWidth type="submit">
                Swap
              </Button>
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
