import type React from "react";
import { useState } from "react";
import { Assets } from "~/config";
import { Button } from "../../atoms/Button";
import Link from "next/link";
import { twMerge } from "~/utils/twMerge";
import { motion, AnimatePresence } from "motion/react";

const assets = Object.values(Assets);

const bridgeExternalLinks = {
  union: {
    label: "Union",
    message:
      "Union is a zero-knowledge interoperability protocol that allows fast, trustless bridging of assets and messages between chains.",
    url: "https://btc.union.build",
    isDisabled: true,
  },
  eureka: {
    label: "IBC Eureka",
    message:
      "Eureka, by Skip, discovers the most efficient IBC routes to bridge tokens into Babylon with optimal speed and cost.",
    url: "https://go.cosmos.network/?src_asset=0x8236a87084f8B84306f72007F36F2618A5634494&src_chain=1&dest_asset=ibc%2F89EE10FCF78800B572BAAC7080AEFA301B5F3BBC51C5371E907EB129C5B900E7&dest_chain=bbn-1&amount_in=1&amount_out=0.999986",
    isDisabled: false,
  },
  axelar: {
    label: "Axelar",
    message:
      "Axelar is a secure cross-chain network that lets you transfer tokens and messages from any chain to Babylon via their GMP protocol.",
    url: "https://app.squidrouter.com/",
    isDisabled: false,
  },
};


export const Bridge: React.FC = () => {
  /* const [activeInput, setActiveInput] = useState<"from" | "to">("from");
  const [fromToken, setFromToken] = useState(assets[0]);
  const [toToken, setToToken] = useState(assets[1]);
  const { watch, setValue, formState } = useFormContext();
  const { isDirty } = formState;
  const toAmount = watch("toAmount");
  const fromAmount = watch("fromAmount");

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
          destAssetChainID: babylonTestnet.id as unknown as string,
          destAssetDenom,
          sourceAssetChainID: babylonTestnet.id as unknown as string,
          sourceAssetDenom,
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
          destAssetDenom,
          sourceAssetChainID: babylonTestnet.id as unknown as string,
          sourceAssetDenom,
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
  }; */

  const [activeBridge, setActiveBridge] = useState("eureka");

  return (
    <div className="flex flex-col gap-2 w-full items-center justify-center pt-2">
      <div className="flex items-center gap-2 w-full">
        {Object.keys(bridgeExternalLinks).map((bridge) => {
          return (
            <Button
              key={bridge}
              color="tertiary"
              size="sm"
              className={twMerge(
                "bg-tw-orange-400/20 border-2 border-transparent flex-1 capitalize text-tw-orange-400",
                {
                  "border-tw-orange-400 bg-tw-orange-400/30": activeBridge === bridge,
                },
              )}
              onClick={() => setActiveBridge(bridge)}
            >
              {bridgeExternalLinks[bridge as keyof typeof bridgeExternalLinks].label}
            </Button>
          );
        })}
      </div>
      <div className="bg-tw-bg rounded-2xl px-4 py-8 ">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBridge}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6 w-full items-center justify-center text-center"
          >
            <p className="text-sm text-white/50">
              {bridgeExternalLinks[activeBridge as keyof typeof bridgeExternalLinks].message}
            </p>
            <Button
              as={Link}
              href={bridgeExternalLinks[activeBridge as keyof typeof bridgeExternalLinks].url}
              target="_blank"
              className="gap-1"
              isDisabled={
                bridgeExternalLinks[activeBridge as keyof typeof bridgeExternalLinks].isDisabled
              }
            >
              {bridgeExternalLinks[activeBridge as keyof typeof bridgeExternalLinks].isDisabled ? (
                "Coming soon"
              ) : (
                <p>
                  Bridge your assets with{" "}
                  <span className="capitalize font-extrabold">{activeBridge}</span>
                </p>
              )}
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
      {/*  <BridgeAssetInput
        name="fromAmount"
        control={control}
        assets={[fromToken, toToken]}
        disabled={isSubmitting || (isLoading && activeInput === "to")}
        onSelect={setFromToken}
        onFocus={() => setActiveInput("from")}
      />
      <RotateButton onClick={onRotate} />
      <BridgeAssetInput
        name="toAmount"
        control={control}
        assets={[toToken, fromToken]}
        disabled={isSubmitting || (isLoading && activeInput === "from")}
        onSelect={setToToken}
        onFocus={() => setActiveInput("to")}
        validateBalance={false}
      /> */}
    </div>
  );
};
