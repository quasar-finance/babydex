import BasicModal from "~/app/components/templates/BasicModal";

import type React from "react";
import { Button } from "../../atoms/Button";
import { useModal } from "~/app/providers/ModalProvider";
import { convertMicroDenomToDenom } from "~/utils/intl";

const ModalDepositCompleted: React.FC = () => {
  const { hideModal, modalProps } = useModal();

  const { tokens = [] } = modalProps ?? {};
  const [token0, token1 = null] = tokens;

  return (
    <BasicModal
      separator={false}
      showClose={false}
      classNames={{
        wrapper:
          "border-none bg-gradient-to-b from-tw-orange-400/50 to-50% to-tw-bg overflow-hidden max-w-[382px]",
        container: "p-0",
      }}
    >
      <div className="flex flex-col items-center justify-center pt-4 relative">
        <img
          src="./tower-tick.png"
          alt="success"
          className="opacity-70 absolute -translate-x-1/2 left-1/2 top-8"
        />
        <div className="flex flex-col gap-4 items-center justify-end bg-gradient-to-b to-40% from-transparent to-tw-bg w-full p-4 relative z-10 h-[429px]">
          <p className="text-xl">Deposit Completed</p>
          <p className="text-medium text-center font-light text-white/60">
            You have successfully deposited
          </p>
          <div className="flex items-center justify-center gap-1">
            <div className="flex items-center justify-center gap-1">
              <img src={token0?.logoURI} alt={token0?.symbol} className="w-5 h-5" />
              <p>{convertMicroDenomToDenom(token0?.amount, token0?.decimals)}</p>
              <p className="text-white">{token0?.symbol}</p>
            </div>
            {tokens.length > 1 && (
              <>
                <p>and</p>
                <div className="flex items-center justify-center gap-1">
                  <img src={token1?.logoURI} alt={token1?.symbol} className="w-5 h-5" />
                  <p>{convertMicroDenomToDenom(token1?.amount, token1?.decimals)}</p>
                  <p className="text-white">{token1?.symbol}</p>
                </div>
              </>
            )}
          </div>
          <Button fullWidth onClick={hideModal}>
            Continue
          </Button>
        </div>
      </div>
    </BasicModal>
  );
};

export default ModalDepositCompleted;
