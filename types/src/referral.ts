// Type definition for the signed message from the frontend (ADR-036 arbitrary data signing)
export type CosmosSignedMessage = {
  signature: string; // Base64 encoded signature
  pubkey: {
    type: string; // e.g., "tendermint/PubKeySecp256k1" or "cosmos/PubKeySecp256k1"
    value: string; // Base64 encoded public key
  };
  data: string; // The original data (UTF-8 string) that was signed, base64 encoded
};
