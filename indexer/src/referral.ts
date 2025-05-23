import {createClient} from '@supabase/supabase-js';

export type Referral = {
  fetchReferralCode: (
    userWalletAddress: string,
  ) => Promise<{ code: string; success: boolean; error?: any }>;
  storeReferralCode: (
    userWalletAddress: string,
  ) => Promise<{ code: string; success: boolean; error?: any }>;
  handleReferral: (
    referredUserWalletAddress: string,
    referralCode: string,
  ) => Promise<{ success: boolean; error?: any; }>;
};

// 23505 is the PostgreSQL error code for unique violation
const UNIQUE_VALIDATION_ERROR_CODE = '23505';

// PGRST116 is supabase postgresql js error when single() row is requested but no row is found
const SUPABASE_SELECT_SINGLE_ROW_ERROR_CODE = 'PGRST116';

export const createReferralService = (supabaseUrl: string, supabaseKey: string) => {
  const options = {
    db: { schema: 'v1_cosmos' }
  };
  const supabase = createClient(supabaseUrl, supabaseKey, options);

  async function fetchReferralCode(userWalletAddress: string): Promise<{
    code: string;
    success: boolean;
    error?: any
  }> {
    try {
      const { data, error } = await supabase
        .from('user_referral_codes')
        .select('referral_code')
        .eq('user_wallet_address', userWalletAddress)
        .single();

      if (error) {
        if (error.code === SUPABASE_SELECT_SINGLE_ROW_ERROR_CODE) {
          return { code: '', success: false, error };
        }

        console.error("Error fetching user wallet address", error);

        return { code: '', success: false, error };
      }

      return data ? { code: data.referral_code, success: true } : { code: '', success: false };
    } catch (error: any) {
      console.error("Error fetching user wallet address", error);
      return { code: '', success: false, error };
    }
  }

  async function storeReferralCode(userWalletAddress: string): Promise<{
    code: string;
    success: boolean;
    error?: any
  }> {
    let code: string;
    let retries = 0;
    const maxRetries = 10;

    if (!userWalletAddress) {
      const error = new Error('User wallet address is required and cannot be empty.');
      console.warn(error.message);

      return { code: '', success: false, error };
    }

    try {
      const referralCodeAlreadyExists = await fetchReferralCode(userWalletAddress);

      if (referralCodeAlreadyExists.success) {
        const error = new Error('Referral code already exists for user wallet address');
        console.warn(error.message, userWalletAddress);

        return { code: referralCodeAlreadyExists.code, success: false, error };
      }

      do {
        code = generateReferralCode();
        const { error } = await supabase
          .from('user_referral_codes')
          .insert([{ referral_code: code, user_wallet_address: userWalletAddress }]);

        if (!error) {
          return { code, success: true };
        } else if (error.code === UNIQUE_VALIDATION_ERROR_CODE && retries < maxRetries) {
          console.warn(`Referral code ${ code } already exists. Retrying...`);
          retries++;
        } else {
          console.error('Error storing referral code:', error);
          return { code: '', success: false, error };
        }
      } while (retries <= maxRetries);

      return { code: '', success: false, error: 'Failed to generate a unique referral code after multiple retries.' }; // Return an error if max retries is reached
    } catch (error: any) {
      console.error('Error storing referral code:', error);
      return { code: '', success: false, error };
    }
  }

  async function recordReferral(referredUserWalletAddress: string, referredByUserWalletAddress: string): Promise<{
    success: boolean;
    error?: any
  }> {
    try {
      const { error } = await supabase
        .from('referrals')
        .insert([{
          referred_user_wallet_address: referredUserWalletAddress,
          referred_by_user_wallet_address: referredByUserWalletAddress
        }]);

      if (error) {
        console.error('Error recording referral:', error);
        return { success: false, error };
      }
      return { success: true };
    } catch (error: any) {
      console.error('Error recording referral:', error);
      return { success: false, error };
    }
  }

  async function fetchUserWalletAddress(referralCode: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('user_referral_codes')
        .select('user_wallet_address')
        .eq('referral_code', referralCode)
        .single(); // Expect only one result

      if (error) {
        if (error.code === 'PGRST116') {
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

  async function handleReferral(referredUserWalletAddress: string, referralCode: string): Promise<{
    success: boolean;
    error?: any;
  }> {
    if (!referredUserWalletAddress) {
      return { success: false, error: 'Referred user wallet address is required and cannot be empty.' };
    }

    if (!referralCode || referralCode.length !== 8) {
      return { success: false, error: 'Referral code is required and must be 8 characters long.' };
    }

    try {
      const referredByUserWalletAddress = await fetchUserWalletAddress(referralCode);
      if (!referredByUserWalletAddress) {
        return { success: false, error: 'User wallet for referral code not found.' };
      }

      const recordResult = await recordReferral(referredUserWalletAddress, referredByUserWalletAddress);
      if (!recordResult.success) {
        return recordResult;
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error handling referral:', error);
      return { success: false, error };
    }
  }

  return {
    fetchReferralCode,
    storeReferralCode,
    handleReferral,
  } as Referral;
}

// Helper function to generate an 8 char referral code
export function generateReferralCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}