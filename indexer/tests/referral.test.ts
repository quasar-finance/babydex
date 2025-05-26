import {afterAll, expect, test} from 'vitest';
import {createReferralService} from '../src/';
import sanitizedConfig from "./config";
import {generateReferralCode} from "../src/referral";
import {createClient} from "@supabase/supabase-js";
import {CosmosSignedMessage} from "@towerfi/types";

const options = {
  db: { schema: 'v1_cosmos' }
};
const supabase = createClient(sanitizedConfig.SUPABASE_URL, sanitizedConfig.SUPABASE_KEY, options);

const referralService = createReferralService(sanitizedConfig.SUPABASE_URL, sanitizedConfig.SUPABASE_KEY);

const TEST_USER_WALLET_ADDRESS = '0xtestwallet123abc456def';
const TEST_REFERRED_USER_WALLET_ADDRESS = '0xtestwallet456abc789def';

afterAll(async () => {
  await deleteReferralCode();
  await deleteReferrals();
});

async function deleteReferralCode() {
  const { error } = await supabase
    .from('user_referral_codes')
    .delete()
    .eq('user_wallet_address', TEST_USER_WALLET_ADDRESS);

  expect(error).toBeNull;
}

async function deleteReferrals() {
  const { error } = await supabase
    .from('referrals')
    .delete()
    .eq('referred_by_user_wallet_address', TEST_USER_WALLET_ADDRESS);

  expect(error).toBeNull;
}

const mockSignedMessage: CosmosSignedMessage = {
  signature: "",
  pubkey: {
    type: "",
    value: "",
  },
  data: ""
}

// Test suite for referral system functions
test('generateReferralCode generates an 8-character code', () => {
  const code = generateReferralCode();

  console.log(code);

  expect(code).toHaveLength(8);
});

test('storeReferralCode generates referral code and stores it with the user wallet', async () => {
  const userWallet = TEST_USER_WALLET_ADDRESS;
  const result = await referralService.storeReferralCode(userWallet, mockSignedMessage);

  console.log(result);

  expect(result.code).toHaveLength(8);
  expect(result.success).true;

  const fetchReferralCodeResult = await referralService.fetchReferralCode(userWallet);

  expect(fetchReferralCodeResult.code).equal(result.code);
});

test('storeReferralCode fails with invalid user wallet', async () => {
  const userWallet = '';
  const result = await referralService.storeReferralCode(userWallet, mockSignedMessage);

  console.log(result);

  expect(result.success).false;
});

test('fetchReferralCode returns error code PGRST116 when no referral code exists', async () => {
  const userWallet = '0xtestwallet123abc456def';
  const result = await referralService.fetchReferralCode(userWallet);

  console.log(result);

  expect(result.success).false;
  expect(result.error.code).toBe('PGRST116');
});

test('storing existing user wallet referral code fails and returns existing code', async () => {
  const userWallet = TEST_USER_WALLET_ADDRESS;
  const firstResult = await referralService.storeReferralCode(userWallet, mockSignedMessage);

  expect(firstResult.success).true;

  const result = await referralService.storeReferralCode(userWallet, mockSignedMessage);

  console.log(result);

  expect(result.code).toHaveLength(8);
  expect(result.success).false;
});

test('handleReferral records the referral if a valid code is provided', async () => {
  const referredUserWallet = TEST_REFERRED_USER_WALLET_ADDRESS;
  const referredByUserWallet = TEST_USER_WALLET_ADDRESS;

  const store_result = await referralService.storeReferralCode(referredByUserWallet, mockSignedMessage);

  expect(store_result.success).toBe(true);

  const result = await referralService.handleReferral(referredUserWallet, store_result.code, mockSignedMessage);

  console.log(result);

  expect(result.success).toBe(true);

  // Verify the data was stored
  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .eq('referred_user_wallet_address', referredUserWallet)
    .single();

  expect(error).toBeNull();
  expect(data).toBeDefined();
  expect(data?.referred_user_wallet_address).toBe(referredUserWallet);
  expect(data?.referred_by_user_wallet_address).toBe(referredByUserWallet);
});

test('handleReferral returns an error if the referral code is invalid', async () => {
  const referredUserWallet = TEST_REFERRED_USER_WALLET_ADDRESS;
  const invalidCode = 'INVALID_CODE';
  const result = await referralService.handleReferral(referredUserWallet, invalidCode, mockSignedMessage);
  expect(result.success).toBe(false);
  expect(result.error).toBe('Referral code is required and must be 8 characters long.');
});

test('handleReferral returns an error if the referred user wallet address is missing', async () => {
  const result = await referralService.handleReferral('', generateReferralCode(), mockSignedMessage);
  expect(result.success).toBe(false);
  expect(result.error).toBe('Referred user wallet address is required and cannot be empty.');
});

test('handleReferral returns an error if the referred user wallet address already exists', async () => {
  const referredUserWallet = TEST_REFERRED_USER_WALLET_ADDRESS;
  const store_result = await referralService.storeReferralCode(TEST_USER_WALLET_ADDRESS, mockSignedMessage);

  expect(store_result.success).toBe(true);

  const result = await referralService.handleReferral(referredUserWallet, store_result.code, mockSignedMessage);
  expect(result.success).toBe(true);

  const duplicate_result = await referralService.handleReferral(referredUserWallet, store_result.code, mockSignedMessage);
  expect(duplicate_result.success).toBe(false);
  expect(duplicate_result.error).toBe('User has already been referred.');
});

test('handleReferral returns an error if users try to refer themselves', async () => {
  const store_result = await referralService.storeReferralCode(TEST_USER_WALLET_ADDRESS, mockSignedMessage);

  expect(store_result.success).toBe(true);

  const result = await referralService.handleReferral(TEST_USER_WALLET_ADDRESS, store_result.code, mockSignedMessage);
  expect(result.success).toBe(false);
  expect(result.error).toBe('User cannot refer to themselves.');
});

