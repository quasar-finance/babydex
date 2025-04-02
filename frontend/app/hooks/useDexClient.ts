import { useSigningClient } from "@cosmi/react";
import { dexActions } from "../../actions/dexActions";

export function useDexClient() {
  const { data: signingClient, ...rest } = useSigningClient();

  return {
    data: signingClient?.extend(dexActions),
    ...rest,
  };
}
