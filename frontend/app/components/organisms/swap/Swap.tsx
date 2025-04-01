import type React from "react";
import { useEffect, useState } from "react";
import RotateButton from "../../atoms/RotateButton";

import { useFormContext } from "react-hook-form";
import { convertDenomToMicroDenom, convertMicroDenomToDenom } from "~/utils/intl";
import { useSkipClient } from "~/app/hooks/useSkipClient";
import { babylonTestnet } from "~/config/chains/babylon-testnet";
import { AssetInput } from "../../atoms/AssetInput";
import { Assets } from "~/config";

const assets = Object.values(Assets);

export const Swap: React.FC = () => {
  const [activeInput, setActiveInput] = useState<"from" | "to">("from");
  const [fromToken, setFromToken] = useState(assets[0]);
  const [toToken, setToToken] = useState(assets[1]);
  const { watch, setValue, control, formState } = useFormContext();
  const { isSubmitting, isDirty } = formState;
  const toAmount = watch("toAmount");
  const fromAmount = watch("fromAmount");

  const { simulation, simulate, skipClient } = useSkipClient({ cacheKey: "swap" });
  const { isLoading } = simulation;

  useEffect(() => {
    if (!skipClient || !isDirty || (!toAmount && !fromAmount)) return;

    (async () => {
      if (activeInput === "from") {
        const simulation = await simulate({
          destAssetChainID: babylonTestnet.id as unknown as string,
          destAssetDenom: toToken.denom,
          sourceAssetChainID: babylonTestnet.id as unknown as string,
          sourceAssetDenom: fromToken.denom,
          allowSwaps: true,
          allowUnsafe: true,
          amountIn: convertDenomToMicroDenom(fromAmount, fromToken.decimals),
        });

        setValue("toAmount", convertMicroDenomToDenom(simulation?.amountOut, toToken.decimals), {
          shouldValidate: true,
        });
      } else {
        const simulation = await simulate({
          destAssetChainID: babylonTestnet.id as unknown as string,
          destAssetDenom: toToken.denom,
          sourceAssetChainID: babylonTestnet.id as unknown as string,
          sourceAssetDenom: fromToken.denom,
          allowSwaps: true,
          allowUnsafe: true,
          amountOut: convertDenomToMicroDenom(toAmount, toToken.decimals),
        });

        setValue("fromAmount", convertMicroDenomToDenom(simulation?.amountIn, fromToken.decimals), {
          shouldValidate: true,
        });
      }
    })();
  }, [fromAmount, toAmount, fromToken, toToken]);

  const onRotate = () => {
    const fToken = { ...fromToken };
    const tToken = { ...toToken };
    setFromToken(tToken);
    setToToken(fToken);
    setValue("fromAmount", toAmount);
    setValue("toAmount", fromAmount);
    setActiveInput("from");
  };

  return (
    <div className="flex flex-col gap-2 w-full items-center justify-center">
      <AssetInput
        name="fromAmount"
        control={control}
        assets={[fromToken, toToken]}
        disabled={isSubmitting || (isLoading && activeInput === "to")}
        onSelect={setFromToken}
        onFocus={() => setActiveInput("from")}
      />
      <RotateButton onClick={onRotate} />
      <AssetInput
        name="toAmount"
        control={control}
        assets={[toToken, fromToken]}
        disabled={isSubmitting || (isLoading && activeInput === "from")}
        onSelect={setToToken}
        onFocus={() => setActiveInput("to")}
      />
    </div>
  );
};
