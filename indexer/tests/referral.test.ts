import { afterEach, beforeEach, expect, type Mock, test, vi } from "vitest";
import { createReferralService } from "../src/";
import sanitizedConfig from "./config";
import { generateReferralCode, verifyCosmosSignature } from "../src/referral";
import { createClient } from "@supabase/supabase-js";
import type { CosmosSignedMessage } from "@towerfi/types";

vi.mock("@cosmjs/amino", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@cosmjs/amino")>();
  return {
    ...actual,
    pubkeyToAddress: vi.fn(),
  };
});

vi.mock("@cosmjs/proto-signing", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@cosmjs/proto-signing")>();
  return {
    ...actual,
    decodePubkey: vi.fn(),
  };
});

vi.mock("@cosmjs/encoding", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@cosmjs/encoding")>();
  return {
    ...actual,
    fromBase64: vi.fn(),
  };
});

vi.mock("@cosmjs/crypto", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@cosmjs/crypto")>();
  const Secp256k1 = {
    verifySignature: vi.fn(),
    Secp256k1Signature: {
      fromFixedLength: vi.fn((bytes: Uint8Array) => ({
        // Simplified mock, just needs to return an object that matches Secp256k1Signature structure
        r: bytes.slice(0, 32),
        s: bytes.slice(32, 64),
      })),
    },
  };
  return {
    ...actual,
    Secp256k1: Secp256k1,
    Secp256k1Signature: Secp256k1.Secp256k1Signature,
  };
});

// Re-import the mocked functions after mocking the modules
// These imports will now refer to the mocked versions of the @cosmjs functions
import { pubkeyToAddress } from "@cosmjs/amino";
import { decodePubkey } from "@cosmjs/proto-signing";
import { fromBase64 } from "@cosmjs/encoding";
import { Secp256k1, Secp256k1Signature } from "@cosmjs/crypto";

const options = {
  db: { schema: "v1_cosmos" },
};
const supabase = createClient(sanitizedConfig.SUPABASE_URL, sanitizedConfig.SUPABASE_KEY, options);

const referralService = createReferralService(
  sanitizedConfig.SUPABASE_URL,
  sanitizedConfig.SUPABASE_KEY,
);

const TEST_USER_WALLET_ADDRESS = "0xtestwallet123abc456def";
const TEST_REFERRED_USER_WALLET_ADDRESS = "0xtestwallet456abc789def";

beforeEach(async () => {
  const expectedAddress = TEST_USER_WALLET_ADDRESS;
  const decodedSignatureBytesMock = new Uint8Array(new Array(64).fill(0)); // 64 bytes for r and s
  const signedDataBytesMock = new Uint8Array([7, 8, 9]);

  // Configure mocks for a successful verification
  (pubkeyToAddress as Mock).mockReturnValue(expectedAddress);
  (fromBase64 as Mock).mockImplementation((data: string) => {
    if (data === mockSignedMessage.signature) return decodedSignatureBytesMock;
    if (data === mockSignedMessage.data) return signedDataBytesMock;
    return new Uint8Array();
  });
  (Secp256k1Signature.fromFixedLength as Mock).mockReturnValue({} as Secp256k1Signature); // Mock the conversion
  (Secp256k1.verifySignature as Mock).mockReturnValue(true);
});

afterEach(async () => {
  await deleteReferralCode();
  await deleteReferrals();
});

async function deleteReferralCode() {
  const { error } = await supabase
    .from("user_referral_codes")
    .delete()
    .eq("user_wallet_address", TEST_USER_WALLET_ADDRESS);

  expect(error).toBeNull;
}

async function deleteReferrals() {
  const { error } = await supabase
    .from("referrals")
    .delete()
    .eq("referred_by_user_wallet_address", TEST_USER_WALLET_ADDRESS);

  expect(error).toBeNull;
}

const mockSignedMessage: CosmosSignedMessage = {
  signature: "mockSignatureBase64",
  pubkey: { type: "tendermint/PubKeySecp256k1", value: "mockPubkeyBase64" },
  data: "mockDataBase64",
};

// Test suite for referral system functions
test("generateReferralCode generates an 8-character code", () => {
  const code = generateReferralCode();

  console.log(code);

  expect(code).toHaveLength(8);
});

test("storeReferralCode generates referral code and stores it with the user wallet", async () => {
  const userWallet = TEST_USER_WALLET_ADDRESS;
  const result = await referralService.storeReferralCode(userWallet, mockSignedMessage);

  console.log(result);

  expect(result.code).toHaveLength(8);
  expect(result.success).true;

  const fetchReferralCodeResult = await referralService.fetchReferralCode(userWallet);

  expect(fetchReferralCodeResult.code).equal(result.code);
});

test("storeReferralCode fails with invalid user wallet", async () => {
  const userWallet = "";
  const result = await referralService.storeReferralCode(userWallet, mockSignedMessage);

  console.log(result);

  expect(result.success).false;
});

test("fetchReferralCode returns error code PGRST116 when no referral code exists", async () => {
  const userWallet = "0xtestwallet123abc456def";
  const result = await referralService.fetchReferralCode(userWallet);

  console.log(result);

  expect(result.success).false;
  expect(result.error.code).toBe("PGRST116");
});

test("storing existing user wallet referral code fails and returns existing code", async () => {
  const userWallet = TEST_USER_WALLET_ADDRESS;
  const firstResult = await referralService.storeReferralCode(userWallet, mockSignedMessage);

  expect(firstResult.success).true;

  const result = await referralService.storeReferralCode(userWallet, mockSignedMessage);

  console.log(result);

  expect(result.code).toHaveLength(8);
  expect(result.success).false;
});

test("handleReferral records the referral if a valid code is provided", async () => {
  const referredUserWallet = TEST_REFERRED_USER_WALLET_ADDRESS;
  const referredByUserWallet = TEST_USER_WALLET_ADDRESS;

  const store_result = await referralService.storeReferralCode(
    referredByUserWallet,
    mockSignedMessage,
  );

  expect(store_result.success).toBe(true);

  (pubkeyToAddress as Mock).mockReturnValue(TEST_REFERRED_USER_WALLET_ADDRESS);

  const result = await referralService.handleReferral(
    referredUserWallet,
    store_result.code,
    mockSignedMessage,
  );

  console.log(result);

  expect(result.success).toBe(true);

  // Verify the data was stored
  const { data, error } = await supabase
    .from("referrals")
    .select("*")
    .eq("referred_user_wallet_address", referredUserWallet)
    .single();

  expect(error).toBeNull();
  expect(data).toBeDefined();
  expect(data?.referred_user_wallet_address).toBe(referredUserWallet);
  expect(data?.referred_by_user_wallet_address).toBe(referredByUserWallet);
});

test("handleReferral returns an error if the referral code is invalid", async () => {
  const referredUserWallet = TEST_REFERRED_USER_WALLET_ADDRESS;
  const invalidCode = "INVALID_CODE";
  const result = await referralService.handleReferral(
    referredUserWallet,
    invalidCode,
    mockSignedMessage,
  );
  expect(result.success).toBe(false);
  expect(result.error).toBe("Referral code is required and must be 8 characters long.");
});

test("handleReferral returns an error if the referred user wallet address is missing", async () => {
  const result = await referralService.handleReferral(
    "",
    generateReferralCode(),
    mockSignedMessage,
  );
  expect(result.success).toBe(false);
  expect(result.error).toBe("Referred user wallet address is required and cannot be empty.");
});

test("handleReferral returns an error if the referred user wallet address already exists", async () => {
  const referredUserWallet = TEST_REFERRED_USER_WALLET_ADDRESS;
  const store_result = await referralService.storeReferralCode(
    TEST_USER_WALLET_ADDRESS,
    mockSignedMessage,
  );

  console.log(store_result);

  expect(store_result.success).toBe(true);

  (pubkeyToAddress as Mock).mockReturnValue(TEST_REFERRED_USER_WALLET_ADDRESS);

  const result = await referralService.handleReferral(
    referredUserWallet,
    store_result.code,
    mockSignedMessage,
  );
  expect(result.success).toBe(true);

  const duplicate_result = await referralService.handleReferral(
    referredUserWallet,
    store_result.code,
    mockSignedMessage,
  );
  expect(duplicate_result.success).toBe(false);
  expect(duplicate_result.error).toBe("User has already been referred.");
});

test("handleReferral returns an error if users try to refer themselves", async () => {
  const store_result = await referralService.storeReferralCode(
    TEST_USER_WALLET_ADDRESS,
    mockSignedMessage,
  );

  expect(store_result.success).toBe(true);

  const result = await referralService.handleReferral(
    TEST_USER_WALLET_ADDRESS,
    store_result.code,
    mockSignedMessage,
  );
  expect(result.success).toBe(false);
  expect(result.error).toBe("User cannot refer to themselves.");
});

// Test suite for verifyCosmosSignature
test("verifyCosmosSignature - happy path: valid signature and matching address", async () => {
  const mockSignedMessage: CosmosSignedMessage = {
    signature: "mockSignatureBase64",
    pubkey: { type: "tendermint/PubKeySecp256k1", value: "mockPubkeyBase64" },
    data: "mockDataBase64",
  };
  const expectedAddress = "bbn1mockaddress";
  const decodedSignatureBytesMock = new Uint8Array(new Array(64).fill(0)); // 64 bytes for r and s
  const signedDataBytesMock = new Uint8Array([7, 8, 9]);

  // Configure mocks for a successful verification
  (pubkeyToAddress as Mock).mockReturnValue(expectedAddress);
  (fromBase64 as Mock).mockImplementation((data: string) => {
    if (data === mockSignedMessage.signature) return decodedSignatureBytesMock;
    if (data === mockSignedMessage.data) return signedDataBytesMock;
    return new Uint8Array();
  });
  (Secp256k1Signature.fromFixedLength as Mock).mockReturnValue({} as Secp256k1Signature); // Mock the conversion
  (Secp256k1.verifySignature as Mock).mockReturnValue(true);

  const result = await verifyCosmosSignature(mockSignedMessage, expectedAddress);

  expect(result).toBe(expectedAddress);
  expect(pubkeyToAddress).toHaveBeenCalledWith(mockSignedMessage.pubkey, "bbn");
  expect(fromBase64).toHaveBeenCalledWith(mockSignedMessage.signature);
  expect(fromBase64).toHaveBeenCalledWith(mockSignedMessage.data);
  expect(Secp256k1Signature.fromFixedLength).toHaveBeenCalledWith(decodedSignatureBytesMock);
  expect(Secp256k1.verifySignature).toHaveBeenCalledWith(
    expect.any(Object), // Expecting Secp256k1Signature object
    signedDataBytesMock,
    fromBase64(mockSignedMessage.pubkey.value),
  );
});

test("verifyCosmosSignature - error path: invalid signature", async () => {
  const mockSignedMessage: CosmosSignedMessage = {
    signature: "invalidSignatureBase64",
    pubkey: { type: "tendermint/PubKeySecp256k1", value: "mockPubkeyBase64" },
    data: "mockDataBase64",
  };
  const expectedAddress = "bbn1mockaddress";

  const decodedSignatureBytesMock = new Uint8Array(new Array(64).fill(0));
  const signedDataBytesMock = new Uint8Array([7, 8, 9]);

  // Configure mocks for an unsuccessful verification (invalid signature)
  (pubkeyToAddress as Mock).mockReturnValue(expectedAddress);
  (fromBase64 as Mock).mockImplementation((data: string) => {
    if (data === mockSignedMessage.signature) return decodedSignatureBytesMock;
    if (data === mockSignedMessage.data) return signedDataBytesMock;
    return new Uint8Array();
  });
  (Secp256k1Signature.fromFixedLength as Mock).mockReturnValue({} as Secp256k1Signature);
  (Secp256k1.verifySignature as Mock).mockReturnValue(false); // Signature is invalid

  const result = await verifyCosmosSignature(mockSignedMessage, expectedAddress);

  expect(result).toBeNull();
  expect(Secp256k1.verifySignature).toHaveBeenCalledWith(
    expect.any(Object),
    signedDataBytesMock,
    fromBase64(mockSignedMessage.pubkey.value),
  );
});

test("verifyCosmosSignature - error path: address mismatch", async () => {
  const mockSignedMessage: CosmosSignedMessage = {
    signature: "mockSignatureBase64",
    pubkey: { type: "tendermint/PubKeySecp256k1", value: "mockPubkeyBase64" },
    data: "mockDataBase64",
  };
  const expectedAddress = "bbn1expectedaddress";
  const derivedAddressMismatch = "bbn1derivedaddress"; // Mismatched address
  const decodedSignatureBytesMock = new Uint8Array(new Array(64).fill(0));
  const signedDataBytesMock = new Uint8Array([7, 8, 9]);

  // Configure mocks for an unsuccessful verification (address mismatch)
  (pubkeyToAddress as Mock).mockReturnValue(derivedAddressMismatch); // Returns a different address
  (fromBase64 as Mock).mockImplementation((data: string) => {
    if (data === mockSignedMessage.signature) return decodedSignatureBytesMock;
    if (data === mockSignedMessage.data) return signedDataBytesMock;
    return new Uint8Array();
  });
  (Secp256k1Signature.fromFixedLength as Mock).mockReturnValue({} as Secp256k1Signature);
  (Secp256k1.verifySignature as Mock).mockReturnValue(true); // Signature itself is valid

  const result = await verifyCosmosSignature(mockSignedMessage, expectedAddress);

  expect(result).toBeNull();
  expect(pubkeyToAddress).toHaveBeenCalledWith(mockSignedMessage.pubkey, "bbn");
});

test.skip("verifyCosmosSignature - error path: error during decoding/derivation", async () => {
  const mockSignedMessage: CosmosSignedMessage = {
    signature: "mockSignatureBase64",
    pubkey: { type: "invalid/PubKey", value: "mockPubkeyBase64" }, // Invalid pubkey type to trigger error
    data: "mockDataBase64",
  };
  const expectedAddress = "bbn1mockaddress";

  // Configure decodePubkey to throw an error
  (decodePubkey as Mock).mockImplementation(() => {
    throw new Error("Decoding error");
  });

  const result = await verifyCosmosSignature(mockSignedMessage, expectedAddress);

  expect(result).toBeNull();
  expect(decodePubkey).toHaveBeenCalledWith(mockSignedMessage.pubkey);
  // Ensure other functions are not called after an early error
  expect(pubkeyToAddress).not.toHaveBeenCalled();
  expect(fromBase64).not.toHaveBeenCalled();
  expect(Secp256k1.verifySignature).not.toHaveBeenCalled();
});

test("verifyCosmosSignature - error path: invalid base64 data", async () => {
  const mockSignedMessage: CosmosSignedMessage = {
    signature: "mockSignatureBase64",
    pubkey: { type: "tendermint/PubKeySecp256k1", value: "mockPubkeyBase64" },
    data: "invalid-base64-data", // Invalid base64
  };
  const expectedAddress = "bbn1mockaddress";
  const decodedPubkeyMock = {
    type: "tendermint/PubKeySecp256k1",
    value: new Uint8Array([1, 2, 3]),
  };
  const decodedSignatureBytesMock = new Uint8Array(new Array(64).fill(0));

  (decodePubkey as Mock).mockReturnValue(decodedPubkeyMock);
  (pubkeyToAddress as Mock).mockReturnValue(expectedAddress);
  // Mock fromBase64 for data to throw an error
  (fromBase64 as Mock).mockImplementation((data: string) => {
    if (data === mockSignedMessage.signature) return decodedSignatureBytesMock;
    if (data === mockSignedMessage.data) throw new Error("Invalid base64");
    return new Uint8Array();
  });
  (Secp256k1Signature.fromFixedLength as Mock).mockReturnValue({} as Secp256k1Signature);
  (Secp256k1.verifySignature as Mock).mockReturnValue(true);

  const result = await verifyCosmosSignature(mockSignedMessage, expectedAddress);

  expect(result).toBeNull();
  expect(fromBase64).toHaveBeenCalledWith(mockSignedMessage.data);
});
