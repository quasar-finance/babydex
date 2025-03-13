import { useState } from "react";
import { Button } from "~/app/components/atoms/Button";
import BasicModal from "~/app/components/templates/BasicModal";
import { twMerge } from "~/utils/twMerge";

import IconCoins from "~/app/components/atoms/icons/IconCoins";
import Divider from "~/app/components/atoms/Divider";

import type { PoolInfo } from "@towerfi/types";
import { useAccount } from "@cosmi/react";
import { ModalTypes } from "~/types/modal";
import { useModal } from "~/app/providers/ModalProvider";
import { SingleSideAddLiquidity } from "../SingleSideAddLiquidity";
import { DoubleSideAddLiquidity } from "../DoubleSideAddLiquidity";

interface ModalDepositLPProps {
  pool: PoolInfo;
}

const ModalDepositLP: React.FC<ModalDepositLPProps> = ({ pool }) => {
  const { name } = pool;
  const { showModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [side, setSide] = useState<"double" | "single">("double");
  const [slipageTolerance, setSlipageTolerance] = useState("0.04");
  const { isConnected } = useAccount();

  return (
    <BasicModal title="Add Liquidity" classNames={{ wrapper: "max-w-xl", container: "p-0" }}>
      <div className="flex flex-col max-w-xl">
        <div className="flex flex-col gap-5 px-4 py-5">
          <div className="flex flex-col gap-4">
            <div className="bg-white/5 w-full rounded-xl p-4 flex items-center justify-between">
              <p className="text-white/50 text-sm">
                Selected Pool: <span className="font-bold text-white ">{name}</span>
              </p>
              <div className="flex gap-2 py-1 px-[6px]">
                <Button
                  variant="flat"
                  onPress={() => setSide("double")}
                  className={twMerge("border-2 border-transparent", {
                    " border-tw-orange-500": side.includes("double"),
                  })}
                >
                  Doubled sided
                </Button>
                <Button
                  variant="flat"
                  onPress={() => setSide("single")}
                  className={twMerge("border-2 border-transparent", {
                    " border-tw-orange-500": side.includes("single"),
                  })}
                >
                  One sided
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-white/50 text-sm">Deposit Amount</p>
              <div className="flex gap-4 flex-col">
                {side === "single" ? (
                  <SingleSideAddLiquidity
                    pool={pool}
                    slipageTolerance={slipageTolerance}
                    setLoading={setIsLoading}
                  />
                ) : (
                  <DoubleSideAddLiquidity
                    pool={pool}
                    slipageTolerance={slipageTolerance}
                    setLoading={setIsLoading}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <Divider dashed />
        <div className="px-4 py-5 flex flex-col gap-4">
          {isConnected ? (
            <Button
              className="w-full text-base"
              size="md"
              type="submit"
              form="addLiquidity"
              isLoading={isLoading}
            >
              Deposit & Stake
            </Button>
          ) : (
            <Button
              className="w-full text-base"
              size="md"
              type="button"
              onClick={() => showModal(ModalTypes.connect_wallet)}
            >
              Connect Wallet
            </Button>
          )}
          <div className="place-self-end gap-3 flex items-center justify-center text-xs text-white/50">
            <div className="flex gap-1 items-center justify-center">
              <IconCoins className="h-4 w-4" />
              <p>Fee</p>
            </div>
            <p className="text-white">-</p>
          </div>
        </div>
      </div>
    </BasicModal>
  );
};

export default ModalDepositLP;
