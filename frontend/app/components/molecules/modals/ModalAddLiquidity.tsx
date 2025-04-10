import { useMemo, useRef, useState } from "react";
import { Button } from "~/app/components/atoms/Button";
import BasicModal from "~/app/components/templates/BasicModal";

import IconCoins from "~/app/components/atoms/icons/IconCoins";
import Divider from "~/app/components/atoms/Divider";

import type { PoolInfo } from "@towerfi/types";
import { useAccount } from "@cosmi/react";
import { ModalTypes } from "~/types/modal";
import { useModal } from "~/app/providers/ModalProvider";
import { SingleSideAddLiquidity } from "../SingleSideAddLiquidity";
import { DoubleSideAddLiquidity } from "../DoubleSideAddLiquidity";
import { FormProvider, useForm } from "react-hook-form";
import { Tab, TabList, Tabs } from "../../atoms/Tabs";
import AssetsStacked from "../../atoms/AssetsStacked";
import { Popover, PopoverContent, PopoverTrigger } from "../../atoms/Popover";
import MaxSlippageSwitcher from "../MaxSlippageSwitcher";
import { IconSettingsFilled } from "@tabler/icons-react";
import { usePrices } from "~/app/hooks/usePrices";

interface Props {
  pool: PoolInfo;
  successAction?: () => void;
}

export interface DepositFormData {
  [key: string]: string;
  slipageTolerance: string;
}

export const ModalAddLiquidity: React.FC<Props> = ({ pool, successAction }) => {
  const { name } = pool;

  const { showModal } = useModal();
  const [side, setSide] = useState<"double" | "single">("double");
  const [slipageTolerance, setSlipageTolerance] = useState("0.04");
  const { isConnected } = useAccount();
  const submitRef = useRef<{ onSubmit: (data: DepositFormData) => Promise<void> } | null>(null);
  const methods = useForm({ mode: "onChange" });
  const { errors, isSubmitting, isValid } = methods.formState;

  const changeSide = (side: "double" | "single") => {
    setSide(side);
    methods.reset();
  };

  const { isDisabled, text } = useMemo(() => {
    if (Object.keys(errors).length) return { isDisabled: true, text: "Insufficient Balance" };
    if (isValid) return { isDisabled: false, text: "Deposit & Stake" };
    return { isDisabled: true, text: "Choose Amount" };
  }, [isValid, methods.formState]);

  const onSubmit = methods.handleSubmit(async (data) => {
    await submitRef.current?.onSubmit({
      ...data,
      slipageTolerance: (
        Number(slipageTolerance === "auto" ? "0.05" : slipageTolerance) / 100
      ).toString(),
    });
    if (successAction) successAction();
  });

  return (
    <BasicModal title="Add Liquidity" classNames={{ wrapper: "max-w-xl", container: "p-0" }}>
      <FormProvider {...methods}>
        <form className="flex flex-col max-w-xl" onSubmit={onSubmit}>
          <Popover>
            <PopoverTrigger>
              <Button
                color="secondary"
                className="absolute top-[10px] right-12 p-2"
                type="button"
                isIconOnly
              >
                <IconSettingsFilled className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex w-full items-center justify-between gap-2 mt-2">
                <p className="text-white/50">Max Slippage</p>
                <MaxSlippageSwitcher
                  maxSlippage={slipageTolerance}
                  setMaxSlippage={setSlipageTolerance}
                />
              </div>
            </PopoverContent>
          </Popover>
          <div className="flex flex-col gap-5 px-4 py-5">
            <div className="flex flex-col gap-4">
              <div className="bg-white/5 w-full rounded-xl p-4 flex lg:items-center justify-between gap-4 lg:gap-1 flex-col lg:flex-row">
                <div className="flex items-center gap-3">
                  <AssetsStacked assets={pool.assets} />
                  <span>{name}</span>
                </div>
                {pool.poolType === "concentrated" && (
                  <div className="flex gap-2 lg:py-1 lg:px-[6px]">
                    <Tabs
                      color="orange"
                      defaultKey="double"
                      selectedKey={side}
                      onSelectionChange={(key: string) => changeSide(key as "double" | "single")}
                    >
                      <TabList className="bg-white/10 rounded-full p-1">
                        <Tab tabKey="double">Doubled Sided</Tab>
                        <Tab tabKey="single">Single Sided</Tab>
                      </TabList>
                    </Tabs>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-white/50 text-sm">Deposit Amount</p>
                <div className="flex gap-4 flex-col">
                  {side === "single" && pool.poolType === "concentrated" ? (
                    <SingleSideAddLiquidity submitRef={submitRef} pool={pool} />
                  ) : (
                    <DoubleSideAddLiquidity submitRef={submitRef} pool={pool} />
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
                isLoading={isSubmitting}
                isDisabled={isDisabled}
              >
                {text}
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
        </form>
      </FormProvider>
    </BasicModal>
  );
};
