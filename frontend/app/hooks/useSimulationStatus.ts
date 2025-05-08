import { useEffect, useState } from "react";

export function useSimulationStatus({
  fromAmount,
  toAmount,
  activeInput,
  isSimulationLoading,
}: {
  fromAmount: string;
  toAmount: string;
  activeInput: "from" | "to";
  isSimulationLoading: boolean;
}) {
  const [pendingSimulation, setPendingSimulation] = useState(false);
  const [hasFreshSimulation, setHasFreshSimulation] = useState(false);

  // Detect when user types and mark pending
  useEffect(() => {
    if (!hasFreshSimulation) {
      if (
        (activeInput === "from" && fromAmount !== undefined && fromAmount !== "") ||
        (activeInput === "to" && toAmount !== undefined && toAmount !== "")
      ) {
        setPendingSimulation(true);
      }
    }
  }, [fromAmount, toAmount, activeInput, hasFreshSimulation]);

  // Watch simulation loading state
  useEffect(() => {
    if (!isSimulationLoading && pendingSimulation) {
      setPendingSimulation(false);
      setHasFreshSimulation(true);
    }
  }, [isSimulationLoading, pendingSimulation]);

  return {
    pendingSimulation,
    hasFreshSimulation,
  };
}
