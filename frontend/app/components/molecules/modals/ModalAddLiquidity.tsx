import { useEffect, useMemo, useRef, useState } from "react";
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
import { FormProvider, useForm } from "react-hook-form";

interface Props {
  pool: PoolInfo;
}

export interface DepositFormData {
  [key: string]: string;
  slipageTolerance: string;
}

export const ModalAddLiquidity: React.FC<Props> = ({ pool }) => {
  const { name } = pool;
  const { showModal } = useModal();
  const [side, setSide] = useState<"double" | "single">("double");
  const [slipageTolerance, setSlipageTolerance] = useState("0.04");
  const { isConnected } = useAccount();
  const submitRef = useRef<{ onSubmit: (data: DepositFormData) => Promise<void> } | null>(null);
  const methods = useForm();
  const { errors, isSubmitting, isValid } = methods.formState;

  const changeSide = (side: "double" | "single") => {
    setSide(side);
    methods.reset();
  };

  const { isDisabled, text } = useMemo(() => {
    if (Object.keys(errors).length) return { isDisabled: true, text: "Insufficient Balance" };
    if (isValid) return { isDisabled: false, text: "Deposit & Stake" };
    return { isDisabled: true, text: "Choose Amount" };
  }, [isValid, errors]);

  const onSubmit = methods.handleSubmit(async (data) => {
    await submitRef.current?.onSubmit({ ...data, slipageTolerance });
  });

  return (
    <BasicModal title="Add Liquidity" classNames={{ wrapper: "max-w-xl", container: "p-0" }}>
      <FormProvider {...methods}>
        <form className="flex flex-col max-w-xl" onSubmit={onSubmit}>
          <div className="flex flex-col gap-5 px-4 py-5">
            <div className="flex flex-col gap-4">
              <div className="bg-white/5 w-full rounded-xl p-4 flex lg:items-center justify-between gap-4 lg:gap-1 flex-col lg:flex-row">
                <p className="text-white/50 text-sm">
                  Selected Pool: <span className="font-bold text-white ">{name}</span>
                </p>
                <div className="flex gap-2 lg:py-1 lg:px-[6px]">
                  <Button
                    variant="flat"
                    onPress={() => changeSide("double")}
                    className={twMerge("border-2 border-transparent", {
                      " border-tw-orange-500": side.includes("double"),
                    })}
                  >
                    Doubled sided
                  </Button>
                  <Button
                    variant="flat"
                    onPress={() => changeSide("single")}
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
