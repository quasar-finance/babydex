import { createClient } from "@supabase/supabase-js";
import { pubkeyToAddress } from "@cosmjs/amino";
import { fromBase64 } from "@cosmjs/encoding";
import { Secp256k1, Secp256k1Signature } from "@cosmjs/crypto";
import type { CosmosSignedMessage } from "@towerfi/types";

export type Referral = {
  fetchReferralCode: (
    userWalletAddress: string,
  ) => Promise<{ code: string; success: boolean; error?: any }>;
  storeReferralCode: (
    userWalletAddress: string,
    signedMessage: CosmosSignedMessage,
  ) => Promise<{ code: string; success: boolean; error?: any }>;
  handleReferral: (
    referredUserWalletAddress: string,
    referralCode: string,
    signedMessage: CosmosSignedMessage,
  ) => Promise<{ success: boolean; error?: any }>;
};

// 23505 is the PostgreSQL error code for unique violation
const UNIQUE_VALIDATION_ERROR_CODE = "23505";

// PGRST116 is supabase postgresql js error when single() row is requested but no row is found
const SUPABASE_SELECT_SINGLE_ROW_ERROR_CODE = "PGRST116";

export const createReferralService = (supabaseUrl: string, supabaseKey: string) => {
  const options = {
    db: { schema: "v1_cosmos" },
  };
  const supabase = createClient(supabaseUrl, supabaseKey, options);

  async function fetchReferralCode(userWalletAddress: string): Promise<{
    code: string;
    success: boolean;
    error?: any;
  }> {
    try {
      const { data, error } = await supabase
        .from("user_referral_codes")
        .select("referral_code")
        .eq("user_wallet_address", userWalletAddress)
        .single();

      if (error) {
        if (error.code === SUPABASE_SELECT_SINGLE_ROW_ERROR_CODE) {
          return { code: "", success: false, error };
        }

        console.error("Error fetching user wallet address", error);

        return { code: "", success: false, error };
      }

      return data ? { code: data.referral_code, success: true } : { code: "", success: false };
    } catch (error: any) {
      console.error("Error fetching user wallet address", error);
      return { code: "", success: false, error };
    }
  }

  async function storeReferralCode(
    userWalletAddress: string,
    signedMessage: CosmosSignedMessage,
  ): Promise<{
    code: string;
    success: boolean;
    error?: any;
  }> {
    let code: string;
    let retries = 0;
    const maxRetries = 10;

    if (!userWalletAddress) {
      const error = new Error("User wallet address is required and cannot be empty.");
      console.warn(error.message);

      return { code: "", success: false, error };
    }

    try {
      const verifiedAddress = await verifyCosmosSignature(signedMessage, userWalletAddress);

      if (!verifiedAddress) {
        return { code: "", success: false, error: "Account ownership verification failed." };
      }

      // Ensure the verified address matches the one provided
      if (verifiedAddress !== userWalletAddress) {
        return {
          code: "",
          success: false,
          error: "Provided wallet address does not match signed address.",
        };
      }

      const referralCodeAlreadyExists = await fetchReferralCode(userWalletAddress);

      if (referralCodeAlreadyExists.success) {
        const error = new Error("Referral code already exists for user wallet address");
        console.warn(error.message, userWalletAddress);

        return { code: referralCodeAlreadyExists.code, success: false, error };
      }

      do {
        code = generateReferralCode();
        const { error } = await supabase
          .from("user_referral_codes")
          .insert([{ referral_code: code, user_wallet_address: userWalletAddress }]);

        if (!error) {
          return { code, success: true };
        }

        if (error.code === UNIQUE_VALIDATION_ERROR_CODE && retries < maxRetries) {
          console.warn(`Referral code ${code} already exists. Retrying...`);
          retries++;
        } else {
          console.error("Error storing referral code:", error);
          return { code: "", success: false, error };
        }
      } while (retries <= maxRetries);

      return {
        code: "",
        success: false,
        error: "Failed to generate a unique referral code after multiple retries.",
      }; // Return an error if max retries is reached
    } catch (error: any) {
      console.error("Error storing referral code:", error);
      return { code: "", success: false, error };
    }
  }

  async function recordReferral(
    referredUserWalletAddress: string,
    referredByUserWalletAddress: string,
  ): Promise<{
    success: boolean;
    error?: any;
  }> {
    try {
      const { error } = await supabase.from("referrals").insert([
        {
          referred_user_wallet_address: referredUserWalletAddress,
          referred_by_user_wallet_address: referredByUserWalletAddress,
        },
      ]);

      if (error) {
        console.error("Error recording referral:", error);
        return { success: false, error };
      }
      return { success: true };
    } catch (error: any) {
      console.error("Error recording referral:", error);
      return { success: false, error };
    }
  }

  async function fetchUserWalletAddress(referralCode: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from("user_referral_codes")
        .select("user_wallet_address")
        .eq("referral_code", referralCode)
        .single(); // Expect only one result

      if (error) {
        if (error.code === SUPABASE_SELECT_SINGLE_ROW_ERROR_CODE) {
          return null; // No data found
        }
        console.error("Error fetching user wallet address", error);
        return null;
      }

      return data ? data.user_wallet_address : null;
    } catch (error: any) {
      console.error("Error fetching user wallet address", error);
      return null;
    }
  }

  async function fetchReferredUserWalletAddress(
    referredUserWalletAddress: string,
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from("referrals")
        .select("referred_user_wallet_address")
        .eq("referred_user_wallet_address", referredUserWalletAddress)
        .single();

      if (error) {
        if (error.code === SUPABASE_SELECT_SINGLE_ROW_ERROR_CODE) {
          return null;
        }

        throw error;
      }

      return data ? data.referred_user_wallet_address : null;
    } catch (error: any) {
      console.error("Error fetching referred user wallet address", error);

      throw error;
    }
  }

  async function handleReferral(
    referredUserWalletAddress: string,
    referralCode: string,
    signedMessage: CosmosSignedMessage,
  ): Promise<{
    success: boolean;
    error?: any;
  }> {
    if (!referredUserWalletAddress) {
      return {
        success: false,
        error: "Referred user wallet address is required and cannot be empty.",
      };
    }

    if (!referralCode || referralCode.length !== 8) {
      return { success: false, error: "Referral code is required and must be 8 characters long." };
    }

    try {
      const verifiedAddress = await verifyCosmosSignature(signedMessage, referredUserWalletAddress);

      if (!verifiedAddress) {
        return { success: false, error: "Account ownership verification of referred user failed." };
      }

      if (verifiedAddress !== referredUserWalletAddress) {
        return {
          success: false,
          error: "Provided wallet address of referred user does not match signed address.",
        };
      }

      if (await fetchReferredUserWalletAddress(referredUserWalletAddress)) {
        return { success: false, error: "User has already been referred." };
      }

      const referredByUserWalletAddress = await fetchUserWalletAddress(referralCode);
      if (!referredByUserWalletAddress) {
        return { success: false, error: "User wallet for referral code not found." };
      }

      if (referredByUserWalletAddress === referredUserWalletAddress) {
        return { success: false, error: "User cannot refer to themselves." };
      }

      const recordResult = await recordReferral(
        referredUserWalletAddress,
        referredByUserWalletAddress,
      );
      if (!recordResult.success) {
        return recordResult;
      }

      return { success: true };
    } catch (error: any) {
      console.error("Error handling referral:", error);
      return { success: false, error };
    }
  }

  return {
    fetchReferralCode,
    storeReferralCode,
    handleReferral,
  } as Referral;
};

// Helper function to generate an 8 char referral code
export function generateReferralCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

/**
 * Verifies a Cosmos ADR-036 arbitrary data signature using @cosmjs libraries.
 *
 * @param signedMessage The object containing the signature, pubkey, and original data.
 * @param expectedWalletAddress The wallet address that is expected to be the signer.
 * @param prefix The bech32 prefix for the Cosmos chain (e.g., 'cosmos', 'juno', 'osmo', 'bbn').
 * @returns The verified wallet address if successful, otherwise null.
 */
export async function verifyCosmosSignature(
  signedMessage: CosmosSignedMessage,
  expectedWalletAddress: string,
  prefix = "bbn",
): Promise<string | null> {
  try {
    // Decode the public key from its type and base64 value
    const decodedPubkey = signedMessage.pubkey;

    // Derive the address from the decoded public key
    const derivedAddress = pubkeyToAddress(decodedPubkey, prefix);

    // Decode the signature and the original signed data from base64
    const decodedSignature = fromBase64(signedMessage.signature);
    const signedDataBytes = fromBase64(signedMessage.data); // ADR-036 data is base64 encoded bytes of the UTF-8 string

    // Convert Uint8Array signature to Secp256k1Signature object
    const secp256k1Signature = Secp256k1Signature.fromFixedLength(decodedSignature);

    // Perform the cryptographic verification using Secp256k1
    const isValid = await Secp256k1.verifySignature(
      secp256k1Signature,
      signedDataBytes,
      fromBase64(decodedPubkey.value),
    );

    if (isValid && derivedAddress === expectedWalletAddress) {
      console.log(`Signature verified successfully for address: ${derivedAddress}`);
      return derivedAddress;
    }

    console.warn(
      `Signature verification failed or address mismatch. Derived: ${derivedAddress}, Expected: ${expectedWalletAddress}`,
    );
    return null;
  } catch (error) {
    console.error("Error during Cosmos signature verification:", error);
    return null;
  }
}
