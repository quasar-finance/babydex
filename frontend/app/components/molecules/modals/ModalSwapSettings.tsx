import BasicModal from "~/app/components/templates/BasicModal";
import MaxSlippageSwitcher from "../MaxSlippageSwitcher";

import type React from "react";
import { useSwapStore } from "~/app/hooks/useSwapStore";

const ModalSwapSettings: React.FC = () => {
  const { slippage, setSlippage } = useSwapStore();

  return (
    <BasicModal title="Swap">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <p>Max Slippage</p>
          <MaxSlippageSwitcher
            maxSlippage={slippage}
            setMaxSlippage={(v) => setSlippage(v.toString())}
          />
        </div>
        {/*  <div className="flex items-center justify-between gap-2">
          <p>Transaction Deadline</p>
          <Input
            type="text"
            endContent={"Minutes"}
            classNames={{ inputClassName: "max-w-[24px]" }}
            {...register("txDeadline")}
          />
        </div> */}
      </div>
    </BasicModal>
  );
};

export default ModalSwapSettings;
