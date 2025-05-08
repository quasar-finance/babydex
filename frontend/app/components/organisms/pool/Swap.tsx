import { FormProvider, useForm } from "react-hook-form";
import type { PoolInfo } from "@towerfi/types";
import { useModal } from "~/app/providers/ModalProvider";
import { useSwapStore } from "~/app/hooks/useSwapStore";
import { IconSettingsFilled } from "@tabler/icons-react";
import { ModalTypes } from "~/types/modal";
import { motion } from "motion/react";
import { Button } from "../../atoms/Button";
import { useAccount } from "@cosmi/react";
import { useEffect, useMemo, useState } from "react";
import { useSwapSimulation } from "~/app/hooks/useSwapSimulation";
import { useDexClient } from "~/app/hooks/useDexClient";
import {
  bpsToFloat,
  convertDenomToMicroDenom,
  convertMicroDenomToDenom,
  maxSlippageToBps,
} from "~/utils/intl";
import { useToast } from "~/app/hooks";
import TruncateText from "../../atoms/TruncateText";
import BigNumber from "bignumber.js";
import type { PoolSwapReturnType } from "~/actions/poolSwap";
import { useQueryClient } from "@tanstack/react-query";
import { AssetInput } from "../../atoms/AssetInput";
import RotateButton from "../../atoms/RotateButton";
import { useDebounce } from "react-use";
import Divider from "../../atoms/Divider";
import SwapInfoAccordion from "../../molecules/Swap/SwapInfoAccordion";
import { usePrices } from "~/app/hooks/usePrices";
import { SwapPriceImpactWarning } from "../../molecules/Swap/SlippageImpactWarning";

export const Swap: React.FC<{
  pool: PoolInfo;
  onSubmittedTx?: (tx: Awaited<PoolSwapReturnType>) => unknown;
}> = ({ pool, onSubmittedTx }) => {
  const methods = useForm({ mode: "onChange" });
  const { isConnected, address, chain } = useAccount();
  const { formState, handleSubmit, watch, setValue, control } = methods;
  const { errors } = formState;
  const { showModal } = useModal();
  const { slippage } = useSwapStore();
  const { data: signingClient } = useDexClient();
  const client = useQueryClient();
  const { toast } = useToast();
  const toAmount = watch("toAmount");
  const fromAmount = watch("fromAmount");
  const fromAmountBN = useMemo(() => new BigNumber(fromAmount || 0), [fromAmount]);
  const toAmountBN = useMemo(() => new BigNumber(toAmount || 0), [toAmount]);
  const [activeInput, setActiveInput] = useState<"from" | "to">("from");
  const [fromToken, setFromToken] = useState(pool.assets[0]);
  const [toToken, setToToken] = useState(pool.assets[1]);

  // prevent too many simulations, use a debounced fromAmount
  const [debouncedFromAmount, setDebouncedFromAmount] = useState("");
  const [, _cancelDebounceFrom] = useDebounce(
    () => {
      if (activeInput !== "from") {
        return;
      }

      setDebouncedFromAmount(fromAmount);
    },
    500,
    [fromAmount, activeInput],
  );

  // since there is a debounce delay on the fromAmount, we need to check if the simulation is needed
  const [simulationNeeded, setSimulationNeeded] = useState(false);
  useEffect(() => {
    if (activeInput === "from" && fromAmountBN.gt(0)) {
      setSimulationNeeded(true);
    } else {
      setSimulationNeeded(false);
    }
  }, [fromAmountBN.toFixed(), activeInput]);

  const swapSimulation = useSwapSimulation({
    amount: convertDenomToMicroDenom(debouncedFromAmount, fromToken.decimals),
    assets: [fromToken, toToken],
    poolAddress: pool.poolAddress,
  });

  const { isDisabled, text } = useMemo(() => {
    if (!simulationNeeded && swapSimulation.isError)
      return { isDisabled: true, text: "Swap not possible" };
    if (simulationNeeded) return { isDisabled: true, text: "Fetching Quote" };
    if (!fromAmountBN.gt(0)) return { isDisabled: true, text: "Choose Amount" };
    if (Object.keys(errors).length) return { isDisabled: true, text: "Insufficient Balance" };

    return { isDisabled: false, text: "Swap" };
  }, [toAmount, fromAmountBN, simulationNeeded, swapSimulation.error]);

  const onSubmit = handleSubmit(async () => {
    if (!signingClient || !address) {
      return;
    }

    if (!swapSimulation.data) {
      return;
    }

    const id = toast.loading(
      {
        title: "Processing transaction...",
        description: "Waiting for transaction to be completed",
      },
      { duration: Number.POSITIVE_INFINITY },
    );

    const amount = convertDenomToMicroDenom(fromAmount, fromToken.decimals).toString();

    const beliefPrice = new BigNumber(amount)
      .dividedBy(
        new BigNumber(swapSimulation.data.return_amount).plus(
          swapSimulation.data.commission_amount,
        ),
      )
      .toFixed(18);

    try {
      const txResult = await signingClient.poolSwap({
        sender: address,
        maxSpread: bpsToFloat(maxSlippageToBps(slippage)).toString(),
        poolAddress: pool.poolAddress,
        offerAsset: {
          amount: amount,
          info: fromToken,
        },
        beliefPrice: beliefPrice,
        askAssetInfo: toToken,
      });

      if (onSubmittedTx) {
        onSubmittedTx(txResult);
      }

      const txHash = txResult?.hash?.toString() || "";

      client.invalidateQueries(["simulateSwap", pool.poolAddress]);
      client.invalidateQueries(["balances", address]);

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
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";

      toast.error({
        title: "Swap failed",
        description: `Failed to swap ${fromAmount} ${fromToken.symbol} into ${toToken.symbol}. ${message}`,
      });
    } finally {
      toast.dismiss(id);
    }
  });

  useEffect(() => {
    if (fromAmountBN.isZero()) {
      setValue("toAmount", 0);

      return;
    }
  }, [fromAmountBN]);

  useEffect(() => {
    if (swapSimulation.isError) {
      setValue("toAmount", 0);
      setSimulationNeeded(false);
    }
  }, [swapSimulation.isError]);

  useEffect(() => {
    if (swapSimulation.data) {
      const { return_amount } = swapSimulation.data;
      setValue(
        "toAmount",
        convertMicroDenomToDenom(return_amount, toToken.decimals, toToken.decimals, false),
      );
      setSimulationNeeded(false);
      return;
    }
  }, [swapSimulation.data]);

  const onRotate = () => {
    const fToken = { ...fromToken };
    const tToken = { ...toToken };
    setFromToken(tToken);
    setToToken(fToken);
    setValue("fromAmount", toAmount);
    setValue("toAmount", fromAmount);
  };

  const { getPrice } = usePrices();
  const priceImpact = useMemo(() => {
    if (!swapSimulation?.data) return 0;

    const amountInUSD = getPrice(Number(fromAmount), fromToken.denom, { format: false });
    const amountOutUSD = getPrice(Number(toAmount), toToken.denom, { format: false });
    const impact = amountInUSD > 0 ? ((amountInUSD - amountOutUSD) / amountInUSD) * 100 : 0;
    return Math.abs(impact);
  }, [swapSimulation, fromAmount, toAmount]);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 px-0 relative z-20 w-full">
      <FormProvider {...methods}>
        <div className="w-full flex-1 flex items-center justify-center bg-tw-sub-bg rounded-2xl p-2 flex-col relative mt-10">
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => showModal(ModalTypes.swap_settings, true)}
            className="absolute top-[-50px] right-2 p-2 bg-tw-sub-bg rounded-full z-10"
          >
            <IconSettingsFilled className="w-5 h-5" />
          </motion.button>
          <div className="flex flex-col gap-2 w-full items-center justify-center">
            <AssetInput
              name="fromAmount"
              control={control}
              assets={[fromToken, toToken]}
              selectDisabled
              onSelect={() => {}}
              onFocus={() => setActiveInput("from")}
            />
            <RotateButton onClick={onRotate} />
            <AssetInput
              name="toAmount"
              control={control}
              assets={[toToken, fromToken]}
              disabled
              onSelect={() => {}}
              onFocus={() => setActiveInput("to")}
              validateBalance={false}
            />
            <SwapPriceImpactWarning priceImpact={priceImpact} isLoading={simulationNeeded} />
          </div>
        </div>

        <Divider dashed />

        <div className="w-full flex flex-col gap-6 relative z-20">
          <div className="backdrop-blur-md rounded-2xl px-4">
            {isConnected ? (
              <Button
                fullWidth
                size="md"
                type="submit"
                isDisabled={isDisabled}
                isLoading={simulationNeeded}
                className="backdrop-blur-md"
              >
                {text}
              </Button>
            ) : (
              <Button size="md" onPress={() => showModal(ModalTypes.connect_wallet)} fullWidth>
                Connect Wallet
              </Button>
            )}
            <SwapInfoAccordion
              simulation={{
                amountIn: convertDenomToMicroDenom(
                  fromAmountBN.toString(),
                  fromToken.decimals,
                ).toString(),
                amountOut: convertDenomToMicroDenom(
                  toAmountBN.multipliedBy(bpsToFloat(1e4 - maxSlippageToBps(slippage))).toString(),
                  toToken.decimals,
                ).toString(),
                sourceAssetDenom: fromToken.denom,
                destAssetDenom: toToken.denom,
                estimatedFees: [],
              }}
              className="absolute w-full top-14"
            />
          </div>
        </div>
      </FormProvider>
    </form>
  );
};
