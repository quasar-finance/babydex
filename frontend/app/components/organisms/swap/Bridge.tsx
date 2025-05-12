import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Assets } from "~/config";
import { Button } from "../../atoms/Button";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { IconChevronDown } from "@tabler/icons-react";
import { useModal } from "~/app/providers/ModalProvider";
import type { Bridge as BridgeType, Currency } from "@towerfi/types";
import { ModalTypes } from "~/types/modal";
import { twMerge } from "~/utils/twMerge";

const assetsWithBridgeTooltip = Object.values(Assets).map((a) => {
  return {
    ...a,
    tooltip: !a.bridge ? "No supported bridge currently available." : undefined,
    disabled: !a.bridge,
  };
});

type Bridge = {
  id: BridgeType;
  label: string;
  message: string;
  url: string;
  isDisabled: boolean;
  getUrl: (asset: Currency) => string;
};

const bridgeExternalLinks: Record<BridgeType, Bridge> = {
  union: {
    id: "union",
    label: "Union",
    message: "Union provides bridging from Ethereum, Corn, BoB to Babylon.",
    url: "https://btc.union.build",
    getUrl(asset: Currency) {
      const url = new URL("transfer", this.url);
      const params = new URLSearchParams(url.search);

      params.set("source", "1");
      params.set("destination", "bbn-1");
      params.set("asset", (asset.ethereumAddresses?.union || "").toLowerCase());

      url.search = params.toString();
      return url.toString();
    },
    isDisabled: false,
  },
  "ibc-eureka": {
    id: "ibc-eureka",
    label: "IBC Eureka",
    message:
      "IBC Eureka provides bridging from Ethereum, Osmosis and other IBC related chains to Babylon.",
    url: "https://go.cosmos.network/?src_asset=0x8236a87084f8B84306f72007F36F2618A5634494&src_chain=1&dest_asset=ibc%2F89EE10FCF78800B572BAAC7080AEFA301B5F3BBC51C5371E907EB129C5B900E7&dest_chain=bbn-1&amount_in=1&amount_out=0.999986",
    getUrl(asset: Currency) {
      const url = new URL(this.url);
      const params = new URLSearchParams(url.search);

      params.set("src_asset", (asset.ethereumAddresses?.["ibc-eureka"] || "").toLowerCase());
      params.set("src_chain", "1");
      params.set("dest_asset", asset.denom);
      params.set("dest_chain", "bbn-1");

      url.search = params.toString();
      return url.toString();
    },
    isDisabled: false,
  },
};

export const Bridge: React.FC = () => {
  const { showModal } = useModal();
  const selectAsset = async () => {
    showModal(ModalTypes.select_asset, false, {
      onSelectAsset: setAsset,
      assets: assetsWithBridgeTooltip,
    });
  };

  const [asset, setAsset] = useState(
    assetsWithBridgeTooltip.find((a) => !!a.bridge) || assetsWithBridgeTooltip[0],
  );

  const hasMultipleBridges = useMemo(() => {
    if (!asset.bridge) {
      return false;
    }

    return asset.bridge.length > 1;
  }, [asset]);

  const [activeBridge, setActiveBridge] = useState<Bridge | null>(null);
  const handleBridgeSelect = (bridge: BridgeType) => {
    const selectedBridge = bridgeExternalLinks[bridge];
    setActiveBridge(selectedBridge);
  };

  useEffect(() => {
    if (asset.bridge && asset.bridge.length > 0) {
      const defaultBridge = bridgeExternalLinks[asset.bridge[0]];
      setActiveBridge(defaultBridge);
    }
  }, [asset]);

  return (
    <div className="flex flex-col gap-2 w-full items-start justify-center pt-2">
      <div className="pl-2 flex flex-col gap-2 w-full items-start justify-center">
        <span>Select Asset to Bridge</span>

        <motion.button
          type="button"
          className="flex items-center gap-2 p-2 bg-white/5 rounded-full min-w-fit w-1/2 mt-2"
          onClick={selectAsset}
        >
          <img src={asset.logoURI} alt={asset.symbol} className="w-7 h-7" />
          <p>{asset.symbol}</p>
          <IconChevronDown className="h-4 w-4 ml-auto" />
        </motion.button>
      </div>

      <div className="pl-2 mt-3">
        <span>Available Bridge{hasMultipleBridges ? "s" : ""}</span>
      </div>
      {asset.bridge && hasMultipleBridges && (
        <div className="flex items-center gap-2 w-full">
          {asset.bridge.map((bridge) => {
            return (
              <Button
                key={bridge}
                color="tertiary"
                size="sm"
                className={twMerge(
                  "bg-tw-orange-400/20 border-2 border-transparent flex-1 capitalize text-tw-orange-400",
                  {
                    "border-tw-orange-400 bg-tw-orange-400/30": activeBridge?.id === bridge,
                  },
                )}
                onClick={() => handleBridgeSelect(bridge)}
              >
                {bridgeExternalLinks[bridge].label}
              </Button>
            );
          })}
        </div>
      )}
      <div className="bg-tw-bg rounded-2xl px-4 py-8 min-w-full min-h-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBridge?.id || "no-bridge"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6 w-full items-center justify-center text-center"
          >
            {activeBridge ? (
              <>
                <p className="text-sm text-white/50">{activeBridge.message}</p>
                <Button
                  as={Link}
                  href={activeBridge.getUrl(asset)}
                  target="_blank"
                  className="gap-1"
                  isDisabled={activeBridge.isDisabled}
                >
                  <p>
                    Open <span className="capitalize font-extrabold">{activeBridge.label}</span>
                    {" Bridge"}
                  </p>
                </Button>
              </>
            ) : (
              <></>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
