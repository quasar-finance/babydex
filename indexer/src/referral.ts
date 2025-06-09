import {createClient} from "@supabase/supabase-js";
import {pubkeyToAddress} from "@cosmjs/amino";
import {fromBase64} from "@cosmjs/encoding";
import {Secp256k1, Secp256k1Signature} from "@cosmjs/crypto";
import type {CosmosSignedMessage, Points} from "@towerfi/types";

/**
 * Referral type describes methods for managing referral codes
 * and handling referrals within the system.
 *
 * @typedef {Object} Referral
 *
 * @property {Function} fetchReferralCode
 * Retrieves a referral code for a specified user's wallet address.
 * @param {string} userWalletAddress - The wallet address of the user to fetch the referral code for.
 * @returns {Promise<{ code: string, success: boolean, error?: any }>} A promise resolved with the referral code, success status, and optional error details.
 *
 * @property {Function} storeReferralCode
 * Stores a referral code for a user based on their signed message.
 * @param {string} userWalletAddress - The wallet address of the user to store the referral code for.
 * @param {CosmosSignedMessage} signedMessage - The signed message for verification.
 * @returns {Promise<{ code: string, success: boolean, error?: any }>} A promise resolved with the success status, stored code, and optional error details.
 *
 * @property {Function} handleReferral
 * Handles a referral action involving a referred user, referral code, and signed message.
 * @param {string} referredUserWalletAddress - The wallet address of the referred user.
 * @param {string} referralCode - The referral code being applied.
 * @param {CosmosSignedMessage} signedMessage - The signed message for verification.
 * @returns {Promise<{ success: boolean, error?: any }>} A promise resolved with the success status and optional error details.
 */
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

/**
 * A function that creates a referral service for managing referral codes
 * and user-related referral operations. It uses Supabase for backend support.
 *
 * @param {string} supabaseUrl - The base URL of the Supabase service.
 * @param {string} supabaseKey - The API key for accessing the Supabase instance.
 * @returns {object} An object providing methods for referral management:
 * - `fetchReferralCode(userWalletAddress: string)`: Fetches the referral code for a user based on their wallet address.
 * - `storeReferralCode(userWalletAddress: string, signedMessage: CosmosSignedMessage)`: Stores a new referral code for a user after verification.
 * - `recordReferral(referredUserWalletAddress: string, referredByUserWalletAddress: string)`: Records a referral by linking the referred user's wallet address with the referrer.
 * - `fetchUserWalletAddressByReferralCode(referralCode: string)`: Fetches the wallet address associated with a given referral code.
 * - `fetchUserWalletAddressByAddress(address: string)`: Fetches the wallet address from stored user wallet addresses.
 * - `fetchPointsByAddress(address: string)`: Fetches user reward points using their wallet address.
 * - `fetchReferredUserWalletAddress(referredUserWalletAddress: string)`: Returns the referred user's wallet address if it exists.
 * - `handleReferral(referredUserWalletAddress: string, referralCode: string, signedMessage: CosmosSignedMessage)`: Handles the referral process, including verification and associating referred users.
 */
export const createReferralService = (supabaseUrl: string, supabaseKey: string) => {
  const options = {
    db: { schema: "v1_cosmos" },
  };
  const supabase = createClient(supabaseUrl, supabaseKey, options);

  /**
   * Fetches a referral code associated with the specified user wallet address.
   *
   * @param {string} userWalletAddress - The wallet address of the user for whom the referral code is to be fetched.
   * @return {Promise<{code: string, success: boolean, error?: any}>} A promise that resolves to an object containing the referral code,
   *         a success flag indicating whether the operation was successful, and an optional error object if an error occurred.
   */
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

  /**
   * Stores a unique referral code for a given user wallet address. Ensures that the wallet address
   * is verified and no existing referral code is already associated with it. If a referral code
   * cannot be stored after multiple retries, an error is returned.
   *
   * @param {string} userWalletAddress - The user's wallet address. This is required for generating the referral code.
   * @param {CosmosSignedMessage} signedMessage - A signed message object that helps verify ownership of the wallet address.
   * @return {Promise<{code: string, success: boolean, error?: any}>} - A promise that resolves with an object containing:
   *    - `code`: The generated referral code (empty string if unsuccessful).
   *    - `success`: A boolean indicating whether the operation succeeded.
   *    - `error`: Optional error information if the operation fails.
   */
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
          console.warn(`Referral code ${ code } already exists. Retrying...`);
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

  /**
   * Records a referral by storing the referred user's wallet address and the referring user's wallet address in the database.
   *
   * @param {string} referredUserWalletAddress - The wallet address of the user being referred.
   * @param {string} referredByUserWalletAddress - The wallet address of the user who referred the new user.
   * @return {Promise<{success: boolean, error?: any}>} A promise that resolves to an object indicating the success or failure of the operation. Includes an error property if the operation failed.
   */
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

  /**
   * Fetches the user's wallet address associated with a given referral code from the database.
   *
   * @param {string} referralCode - The referral code used to find the associated wallet address.
   * @return {Promise<string | null>} A promise that resolves to the user's wallet address if found, or null if not found or an error occurs.
   */
  async function fetchUserWalletAddressByReferralCode(referralCode: string): Promise<string | null> {
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

  /**
   * Fetches the user wallet address from the database by matching the given address.
   *
   * @param {string} address - The wallet address to search for in the database.
   * @return {Promise<string | null>} A Promise that resolves with the user's wallet address if found, or null if not found or an error occurs.
   */
  async function fetchUserWalletAddressByAddress(address: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('user_referral_codes')
        .select('user_wallet_address')
        .eq('user_wallet_address', address)
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

  /**
   * Fetches points data for a specific address from the database.
   *
   * @param {string} address - The address to fetch points for.
   * @return {Promise<Points | null>} A Promise that resolves with the points data object if found, or null if no matching entry exists.
   * @throws {Error} If there is an error during the database query or processing.
   */
  async function fetchPointsByAddress(address: string): Promise<Points | null> {
    try {
      const { data, error } = await supabase
        .from('materialized_points')
        .select('*', { count: 'exact' })
        .eq('address', address)
        .single();

      if (error) {
        if (error.code === SUPABASE_SELECT_SINGLE_ROW_ERROR_CODE) {
          return null; // No data found
        }

        throw error;
      }

      return data ? data as Points : null;
    } catch (error: any) {
      throw new Error("Error fetching points: ", error);
    }
  }

  /**
   * Fetches the wallet address of a referred user from the "referrals" table.
   *
   * @param {string} referredUserWalletAddress - The wallet address of the referred user to lookup.
   * @return {Promise<string | null>} A promise that resolves to the referred user's wallet address if found; otherwise, null.
   */
  async function fetchReferredUserWalletAddress(referredUserWalletAddress: string): Promise<string | null> {
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

  /**
   * Handles the referral process, verifying the referred user's wallet address, referral code, and other required conditions.
   *
   * @param {string} referredUserWalletAddress - The wallet address of the referred user.
   * @param {string} referralCode - The referral code provided by the referring user, must be 8 characters long.
   * @param {CosmosSignedMessage} signedMessage - The signed message used to verify account ownership of the referred user's wallet address.
   * @return {Promise<{ success: boolean; error?: any }>} An object indicating the success status of the referral process.
   * If unsuccessful, an error containing descriptive information is included.
   */
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

      const referredByUserWalletAddress = await fetchUserWalletAddressByReferralCode(referralCode);
      if (!referredByUserWalletAddress) {
        return { success: false, error: "User wallet for referral code not found." };
      }

      if (referredByUserWalletAddress === referredUserWalletAddress) {
        return { success: false, error: "User cannot refer to themselves." };
      }

      if (await fetchUserWalletAddressByAddress(referredUserWalletAddress)) {
        return { success: false, error: 'User has already interacted with the DEX and created a referral code.' };
      }

      const points = await fetchPointsByAddress(referredUserWalletAddress);

      if (points && points.swapping_points > 0) {
        return { success: false, error: 'User has already interacted with the DEX and executed a swap.' };
      }

      if (points && points.lping_points > 0) {
        return { success: false, error: 'User has already interacted with the DEX and added liquidity.' };
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
}

/**
 * Generates a random referral code consisting of 8 alphanumeric characters.
 *
 * @return {string} A string representing the generated referral code.
 */
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
      console.log(`Signature successfully verified for address: ${ derivedAddress }`);
      return derivedAddress;
    }

    console.warn(
      `Signature verification failed or address mismatch. Derived: ${ derivedAddress }, Expected: ${ expectedWalletAddress }`,
    );
    return null;
  } catch (error) {
    console.error("Error during Cosmos signature verification:", error);
    return null;
  }
}
