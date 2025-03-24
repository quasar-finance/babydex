import { useAccount, useBalances } from "@cosmi/react";
import type { BaseCurrency } from "@towerfi/types";
import { useCallback, useState } from "react";

import Input from "~/app/components/atoms/Input";
import BasicModal from "~/app/components/templates/BasicModal";
import { useModal } from "~/app/providers/ModalProvider";
import { convertMicroDenomToDenom } from "~/utils/intl";
import TruncateText from "../../atoms/TruncateText";

type ModalSelectAssetProps = {
  assets: BaseCurrency[];
  onSelectAsset: (asset: BaseCurrency) => void;
  onClose: () => void;
};

const ModalSelectAsset: React.FC<ModalSelectAssetProps> = ({ onSelectAsset, onClose, assets }) => {
  const { hideModal } = useModal();
  const [search, setSearch] = useState("");
  const [filteredTokens, setFilteredTokens] = useState(assets);
  const { address } = useAccount();
  const { data: balances } = useBalances({ address });

  const searchToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setFilteredTokens(
      assets.filter((token) => {
        return (
          token.symbol.toLowerCase().includes(e.target.value.toLowerCase()) ||
          token.denom.toLowerCase().includes(e.target.value.toLowerCase())
        );
      }),
    );
  };

  const getBalance = useCallback(
    (denom: string) => {
      return balances?.find((balance) => balance.denom === denom)?.amount;
    },
    [balances],
  );

  return (
    <BasicModal title="Select Asset" classNames={{ wrapper: "overflow-hidden" }} onClose={onClose}>
      <div className="w-full overflow-scroll scrollbar-none h-[25rem] relative rounded-[20px]">
        <div className="w-full sticky top-0 bg-gradient-to-b from-70% from-transparent to-tw-gray-950/80 pb-4 backdrop-blur-sm rounded-t-3xl ">
          <Input
            placeholder="Search by Name, Symbol or Address"
            isSearch
            fullWidth
            classNames={{ wrapperClassName: "bg-tw-gray-925" }}
            onChange={searchToken}
            value={search}
          />
        </div>
        <div className="flex flex-col gap-2">
          {filteredTokens.map((token, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-white/5 rounded-xl p-4 justify-between hover:bg-white/10"
              onClick={() => [hideModal(), onSelectAsset(token)]}
            >
              <div className="flex gap-3 items-center">
                <img src={token.logoURI} alt={token.symbol} className="h-8 w-8" />
                <div className="flex flex-col min-w-0">
                  <p>{token.symbol}</p>
                  <TruncateText text={token.denom} />
                </div>
              </div>
              <div className="flex flex-col">
                <p>{convertMicroDenomToDenom(getBalance(token.denom), token.decimals)}</p>
                <p className="text-sm text-white/50">$0</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BasicModal>
  );
};

export default ModalSelectAsset;
