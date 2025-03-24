import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useModal } from "~/app/providers/ModalProvider";
import { modals } from "~/utils/modal";

const ControlModal: React.FC = () => {
  const { activeModal, isModalVisible, hideModal, allowClose, modalProps } = useModal();
  const Modal: React.FC<any> = useMemo(
    () => modals[activeModal as unknown as keyof typeof modals],
    [activeModal],
  );

  if (!isModalVisible || !activeModal)
    return <AnimatePresence initial={false} mode="wait" onExitComplete={() => null} />;

  return (
    <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
      <motion.div
        onClick={allowClose ? hideModal : undefined}
        className="backdrop-blur-[2px] bg-tw-bg/90 w-screen h-screen fixed top-0 z-[999999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Modal {...modalProps} />
      </motion.div>
    </AnimatePresence>
  );
};

export default ControlModal;
