import type { Keplr } from "@keplr-wallet/types";
import type { CosmosSignedMessage } from "@towerfi/types";
import { useCallback } from "react";
import { useAccount } from "wagmi";
import { makeADR36AminoSignDoc, serializeSignDoc } from "@keplr-wallet/cosmos";
import { babylon } from "~/config/chains/babylon";

export default function useSignArbitrary() {
  const { connector, address } = useAccount();

  return useCallback(
    async (message: string): Promise<CosmosSignedMessage> => {
      if (!message) {
        throw new Error("Message is required");
      }

      if (!address || address.length === 1) {
        throw new Error("No address found");
      }

      if (!connector) {
        throw new Error("No connector found");
      }

      const provider: Keplr = (await connector.getProvider()) as Keplr;

      if (!provider) {
        throw new Error("No provider found");
      }

      const signature = await provider.signArbitrary(babylon.id + "", address, message);
      const signDoc = serializeSignDoc(makeADR36AminoSignDoc(address, message));
      const signDocHash = await crypto.subtle.digest("SHA-256", signDoc);

      return {
        data: Buffer.from(signDocHash).toString("base64"),
        signature: signature.signature,
        pubkey: signature.pub_key,
      };
    },
    [address, connector],
  );
}
