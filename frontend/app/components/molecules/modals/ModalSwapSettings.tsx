import BasicModal from "~/app/components/templates/BasicModal";
import Input from "~/app/components/atoms/Input";
import { useForm } from "react-hook-form";
import MaxSlippageSwitcher from "../Swap/MaxSlippageSwitcher";

import type React from "react";

const ModalSwapSettings: React.FC = () => {
  const defaultSlippage = 5.5;

  const { handleSubmit, register, formState, setValue, watch } = useForm<{
    slippage: number;
    txDeadline: number;
  }>({ mode: "onChange", defaultValues: { slippage: defaultSlippage, txDeadline: 30 } });

  const setSlippage = (value: number) => setValue("slippage", value);

  return (
    <BasicModal title="Swap">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <p>Max Slippage</p>
          <MaxSlippageSwitcher maxSlippage={defaultSlippage} setMaxSlippage={setSlippage} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <p>Transaction Deadline</p>
          <Input
            type="text"
            endContent={"Minutes"}
            classNames={{ inputClassName: "max-w-[24px]" }}
            {...register("txDeadline")}
          />
        </div>
      </div>
    </BasicModal>
  );
};

export default ModalSwapSettings;
