/**
 * Shared token utility functions
 * Consolidates token operations that were duplicated across route files
 */

export interface PoolAssetInfo {
  token?: { contract_addr: string };
  native_token?: { denom: string };
}

/**
 * Extract token identifier from asset info or string
 * Handles both direct strings and PoolAssetInfo objects
 */
export function getTokenIdentifier(assetInfo: PoolAssetInfo | string): string {
  if (typeof assetInfo === 'string') {
    return assetInfo;
  }
  if (assetInfo.token) {
    return assetInfo.token.contract_addr;
  } else if (assetInfo.native_token) {
    return assetInfo.native_token.denom;
  }
  return '';
}

/**
 * Create ticker ID from base and target tokens
 * Supports both string inputs and PoolAssetInfo objects
 */
export function createTickerId(base: string | PoolAssetInfo, target: string | PoolAssetInfo): string {
  const baseId = getTokenIdentifier(base);
  const targetId = getTokenIdentifier(target);
  return `${baseId}_${targetId}`;
}

/**
 * Get asset info object from token string
 * Determines token type based on string format
 */
export function getAssetInfo(token: string): PoolAssetInfo {
  if (token.startsWith('ibc/') || token.startsWith('u')) {
    return { native_token: { denom: token } };
  }
  return { token: { contract_addr: token } };
}

/**
 * Extract token ID from PoolAssetInfo for use as map key
 */
export function getTokenMapKey(assetInfo: PoolAssetInfo): string {
  return assetInfo.native_token?.denom || assetInfo.token?.contract_addr || '';
}