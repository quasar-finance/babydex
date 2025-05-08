import { useEffect } from 'react';
import { useModal } from '../providers/ModalProvider';
import { ModalTypes } from '~/types/modal';

export function useTransactionDisplay() {
  const { showModal } = useModal();

  useEffect(() => {
    const handleTransaction = (event: CustomEvent) => {
      const { transaction } = event.detail;
      showModal(ModalTypes.transaction_details, false, { transaction });
    };

    window.addEventListener('showTransaction', handleTransaction as EventListener);
    return () => {
      window.removeEventListener('showTransaction', handleTransaction as EventListener);
    };
  }, [showModal]);
} 