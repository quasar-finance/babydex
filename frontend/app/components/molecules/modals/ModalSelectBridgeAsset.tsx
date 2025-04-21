import { useAccount, useBalances } from "@cosmi/react";
import type { Currency } from "@towerfi/types";
import { useCallback, useState } from "react";

import Input from "~/app/components/atoms/Input";
import BasicModal from "~/app/components/templates/BasicModal";
import { useModal } from "~/app/providers/ModalProvider";
import { convertMicroDenomToDenom } from "~/utils/intl";
import TruncateText from "../../atoms/TruncateText";
import { useUserBalances } from "~/app/hooks/useUserBalances";
import { Button } from "../../atoms/Button";
import { twMerge } from "~/utils/twMerge";
import Divider from "../../atoms/Divider";
import { useSkipClient } from "~/app/hooks/useSkipClient";
import { babylonMainnet } from "~/config/chains/babylon";
import type { Asset } from "@skip-go/client";

type ModalSelectBridgeAssetProps = {
  onSelectAsset: (asset: Currency) => void;
  onClose: () => void;
};

const ModalSelectBridgeAsset: React.FC<ModalSelectBridgeAssetProps> = ({
  onSelectAsset,
  onClose,
}) => {
  const { hideModal } = useModal();
  const [search, setSearch] = useState("");
  const [selectingAction, setSelectingAction] = useState("network");
  const [network, setNetwork] = useState<string>(babylonMainnet.id as unknown as string);
  const [asset, setAsset] = useState<Asset>();
  const { skipClient, chainsAndAssets } = useSkipClient();

  const chain = chainsAndAssets.data?.chains.find((chain) => chain.chainID === network);
  const chainAssets = chainsAndAssets.data?.assets[network] || [];

  return (
    <BasicModal
      title="Select Asset"
      classNames={{ wrapper: "overflow-hidden", container: "flex flex-col p-0" }}
      onClose={onClose}
    >
      <div className="flex items-center gap-4 p-4">
        <div className="flex flex-col gap-2 flex-1">
          <p className="text-xs">Network</p>
          <Button
            color="tertiary"
            className={twMerge(
              "bg-white/10 border-2 border-transparent justify-start p-1 text-base",
              {
                "border-white/30 bg-white/20": selectingAction === "network",
              },
            )}
            onClick={() => setSelectingAction("network")}
          >
            <img src={chain?.logoURI} alt="evm" className="h-[26px] w-[26px]" />
            <p className="text-sm">{chain?.prettyName}</p>
          </Button>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <p className="text-xs">Asset</p>
          <Button
            color="tertiary"
            className={twMerge(
              "bg-white/10 border-2 border-transparent justify-start p-1 text-base",
              {
                "border-white/30 bg-white/20": selectingAction === "asset",
              },
            )}
            onClick={() => setSelectingAction("asset")}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/2048px-Bitcoin.svg.png"
              alt="evm"
              className="h-[26px] w-[26px]"
            />
            <p className="text-sm">Bitcoin</p>
          </Button>
        </div>
      </div>
      <Divider dashed />
      <div className="w-full relative p-4">
        <div className="w-full sticky top-0 bg-gradient-to-b from-70% from-transparent to-tw-gray-950/80 pb-4 backdrop-blur-sm ">
          <Input
            placeholder="Search by Name, Symbol or Address"
            isSearch
            fullWidth
            classNames={{ wrapperClassName: "bg-tw-gray-925 py-1" }}
            value={search}
          />
        </div>
        <div className="flex flex-col gap-2  overflow-scroll scrollbar-none h-[25rem] ">
          {selectingAction === "network"
            ? chainsAndAssets.data?.chains.map((chain) => {
                return (
                  <div
                    key={chain.chainID}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 justify-between hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => setNetwork(chain.chainID)}
                  >
                    <div className="flex gap-3 items-center">
                      <img src={chain.logoURI} alt={chain.prettyName} className="h-8 w-8" />
                      <div className="flex flex-col min-w-0 gap-1">
                        <p>{chain.prettyName}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            : chainAssets?.map((asset) => {
                return (
                  <div
                    key={asset.denom}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 justify-between hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => [hideModal(), onSelectAsset(asset)]}
                  >
                    <div className="flex gap-3 items-center">
                      <img src={asset.logoURI} alt={asset.symbol} className="h-8 w-8" />
                      <div className="flex flex-col min-w-0 gap-1">
                        <p>{asset.symbol}</p>
                        <TruncateText text={asset.denom} className="text-sm text-white/50" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p>0</p>
                      <p className="text-sm text-white/50">$0</p>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </BasicModal>
  );
};

export default ModalSelectBridgeAsset;
