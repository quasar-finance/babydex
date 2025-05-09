import { useSigningClient } from "@cosmi/react";
import { dexActions } from "../../actions/dexActions";
import { signingActions } from "~/multisig/client/signingActions";

export function useDexClient() {
  const { data: signingClient, ...rest } = useSigningClient();

  // ugly patch, we need to check whether our current client is the multisig client, if so extend the signing client
  // with the multisig signing methods
  // this is needed due to useSigningClient overloading the clients methods with the cosmi default signing methods

  let client = signingClient;
  if (client && client.key === 'multisig') {
    console.log("found multisig, overloading")
    client = client?.extend(signingActions)
  }

  return {
    data: client?.extend(dexActions),
    ...rest,
  };
}
