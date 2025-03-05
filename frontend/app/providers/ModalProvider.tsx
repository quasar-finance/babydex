"use client";
import { useState, useCallback, type PropsWithChildren, createContext, useContext } from "react";
import ControlModal from "~/app/components/molecules/modals/ControlModal";
import type { ModalTypes } from "~/types/modal";

interface ModalStatus {
  showModal: (
    modalName: ModalTypes,
    allowClose?: boolean,
    modalProps?: Record<string, any>,
  ) => void;
  hideModal: () => void;
  isModalVisible: boolean;
  activeModal?: ModalTypes;
  modalProps: Record<string, any>;
  changeModalProps: (props: Record<string, any>) => void;
  allowClose: boolean;
}

const ModalContext = createContext<ModalStatus | null>(null);

export const ModalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [activeModal, setSelectedModal] = useState<ModalTypes>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalProps, setModalProps] = useState<Record<string, any>>({});
  const [allowClose, setAllowClose] = useState(false);

  const showModal = useCallback(
    (modalName: ModalTypes, allowClose?: boolean, modalProps?: Record<string, any>) => {
      setModalProps(modalProps ?? {});
      setSelectedModal(modalName);
      setIsModalVisible(true);
      setAllowClose(allowClose ?? false);
    },
    [],
  );

  const hideModal = useCallback(() => setIsModalVisible(false), [setIsModalVisible]);
  const changeModalProps = useCallback(
    (props: Record<string, any>) => setModalProps(props),
    [setModalProps],
  );

  return (
    <ModalContext.Provider
      value={{
        showModal,
        hideModal,
        isModalVisible,
        activeModal,
        modalProps,
        changeModalProps,
        allowClose,
      }}
    >
      {children}
      <ControlModal />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};
