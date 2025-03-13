import BasicModal from "~/app/components/templates/BasicModal";

import type React from "react";
import { Button } from "../../atoms/Button";
import { useModal } from "~/app/providers/ModalProvider";

const ModalDepositCompleted: React.FC = () => {
  const { hideModal, modalProps } = useModal();

  const { tokens = [] } = modalProps ?? {};
  const [token1, token2 = null] = tokens;

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
          <div className="flex gap-2">
            token 1<span>and</span>
            token 2
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
