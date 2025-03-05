import { useState } from "react";

import Input from "~/app/components/atoms/Input";
import BasicModal from "~/app/components/templates/BasicModal";
import { useModal } from "~/app/providers/ModalProvider";
import { mockTokens } from "~/utils/consts";

const ModalSelectAsset: React.FC = () => {
  const { hideModal } = useModal();
  const [search, setSearch] = useState("");
  const [filteredTokens, setFilteredTokens] = useState(mockTokens);

  const searchToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setFilteredTokens(
      mockTokens.filter((token) => {
        return (
          token.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          token.symbol.toLowerCase().includes(e.target.value.toLowerCase()) ||
          token.address.toLowerCase().includes(e.target.value.toLowerCase())
        );
      }),
    );
  };

  return (
    <BasicModal title="Select Asset" classNames={{ wrapper: "overflow-hidden" }}>
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
              onClick={() => hideModal()}
            >
              <div className="flex gap-3 items-center">
                <img src={token.logoURI} alt={token.symbol} className="h-8 w-8" />
                <div className="flex flex-col">
                  <p>{token.symbol}</p>
                  <p className="text-sm text-white/50">{token.name}</p>
                </div>
              </div>
              <div className="flex flex-col">
                <p>0.0567</p>
                <p className="text-sm text-white/50">$52.567,34</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BasicModal>
  );
};

export default ModalSelectAsset;
