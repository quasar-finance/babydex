"use client";
import type React from "react";
import { useEffect, useState } from "react";
import RotateButton from "../../atoms/RotateButton";

import { useFormContext } from "react-hook-form";
import { convertDenomToMicroDenom, convertMicroDenomToDenom } from "~/utils/intl";
import { useSkipClient } from "~/app/hooks/useSkipClient";
import { babylon } from "~/config/chains/babylon";
import { AssetInput } from "../../atoms/AssetInput";
import { Assets } from "~/config";

import { useSearchParams } from "next/navigation";
import type { Currency } from "@towerfi/types";

const assets = Object.values(Assets);

const getAssetBySymbol = (symbol: string) => {
  return assets.find((asset) => asset.symbol.toLowerCase() === symbol.toLowerCase());
};

export const Swap: React.FC = () => {
  const [activeInput, setActiveInput] = useState<"from" | "to">("from");
  const [fromToken, setFromToken] = useState(assets[0]);
  const [toToken, setToToken] = useState(assets[1]);
  const { watch, setValue, control, formState } = useFormContext();
  const { isSubmitting, isDirty } = formState;
  const toAmount = watch("toAmount");
  const fromAmount = watch("fromAmount");
  const searchParams = useSearchParams();

  const { simulation, simulate, skipClient } = useSkipClient({ cacheKey: "swap" });
  const { isLoading } = simulation;

  useEffect(() => {
    if (!skipClient || !isDirty || (!toAmount && !fromAmount)) return;

    (async () => {
      const destAssetDenom = toToken.type === "cw-20" ? `cw20:${toToken.denom}` : toToken.denom;
      const sourceAssetDenom =
        fromToken.type === "cw-20" ? `cw20:${fromToken.denom}` : fromToken.denom;

      if (activeInput === "from") {
        const simulation = await simulate({
          swapVenues: [
            {
              chainID: babylon.id as unknown as string,
              name: "babylon-tower",
            },
          ],
          destAssetChainID: babylon.id as unknown as string,
          destAssetDenom,
          sourceAssetChainID: babylon.id as unknown as string,
          sourceAssetDenom,
          allowSwaps: true,
          allowUnsafe: true,
          amountIn: convertDenomToMicroDenom(fromAmount, fromToken.decimals),
        });

        setValue("toAmount", convertMicroDenomToDenom(simulation?.amountOut, toToken.decimals, toToken.decimals, false), {
          shouldValidate: true,
        });
      } else {
        const simulation = await simulate({
          swapVenues: [
            {
              chainID: babylon.id as unknown as string,
              name: "babylon-tower",
            },
          ],
          destAssetChainID: babylon.id as unknown as string,
          destAssetDenom,
          sourceAssetChainID: babylon.id as unknown as string,
          sourceAssetDenom,
          allowSwaps: true,
          allowUnsafe: true,
          amountOut: convertDenomToMicroDenom(toAmount, toToken.decimals),
        });

        setValue("fromAmount", convertMicroDenomToDenom(simulation?.amountIn, fromToken.decimals, fromToken.decimals, false), {
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

  useEffect(() => {
    const fromSymbol = searchParams.get("from");
    const toSymbol = searchParams.get("to");

    const fromAsset: Currency | undefined =
      getAssetBySymbol(fromSymbol ?? assets[0].symbol) ||
      assets.find((asset) => asset.symbol.toLowerCase() !== toSymbol?.toLowerCase());

    const toAsset: Currency | undefined =
      toSymbol?.toLowerCase() === (fromAsset?.symbol.toLowerCase() || fromSymbol?.toLowerCase())
        ? assets.find((asset) => asset.denom !== fromAsset?.denom)
        : getAssetBySymbol(toSymbol ?? assets[1].symbol);

    if (fromAsset) setFromToken(fromAsset);
    if (toAsset) setToToken(toAsset);
  }, []);

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
        validateBalance={false}
      />
    </div>
  );
};
