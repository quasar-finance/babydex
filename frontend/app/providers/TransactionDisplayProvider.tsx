import { useTransactionDisplay } from '../hooks/useTransactionDisplay';

export const TransactionDisplayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useTransactionDisplay();
  return <>{children}</>;
}; 