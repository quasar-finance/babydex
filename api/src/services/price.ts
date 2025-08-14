import { CacheService } from './cache.js';

interface PriceData {
  [key: string]: {
    usd: number;
  };
}

export class PriceService {
  private cache: CacheService;
  private coingeckoApiUrl = 'https://api.coingecko.com/api/v3';
  
  constructor(cache: CacheService) {
    this.cache = cache;
  }

  async getTokenPrice(tokenAddress: string): Promise<number> {
    const cacheKey = this.cache.generateKey('price', tokenAddress);
    const cached = await this.cache.get<number>(cacheKey);
    
    if (cached !== null) {
      return cached;
    }

    try {
      const response = await fetch(
        `${this.coingeckoApiUrl}/simple/price?ids=${tokenAddress}&vs_currencies=usd`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch price');
      }
      
      const data: PriceData = await response.json();
      const price = data[tokenAddress]?.usd || 0;
      
      await this.cache.set(cacheKey, price, { ttl: 60000 });
      return price;
    } catch (error) {
      console.error(`Failed to fetch price for ${tokenAddress}:`, error);
      return 0;
    }
  }

  async getBatchPrices(tokenAddresses: string[]): Promise<Map<string, number>> {
    const prices = new Map<string, number>();
    const uncachedTokens: string[] = [];
    
    for (const address of tokenAddresses) {
      const cacheKey = this.cache.generateKey('price', address);
      const cached = await this.cache.get<number>(cacheKey);
      
      if (cached !== null) {
        prices.set(address, cached);
      } else {
        uncachedTokens.push(address);
      }
    }
    
    if (uncachedTokens.length > 0) {
      try {
        const ids = uncachedTokens.join(',');
        const response = await fetch(
          `${this.coingeckoApiUrl}/simple/price?ids=${ids}&vs_currencies=usd`
        );
        
        if (response.ok) {
          const data: PriceData = await response.json();
          
          for (const token of uncachedTokens) {
            const price = data[token]?.usd || 0;
            prices.set(token, price);
            
            const cacheKey = this.cache.generateKey('price', token);
            await this.cache.set(cacheKey, price, { ttl: 60000 });
          }
        }
      } catch (error) {
        console.error('Failed to fetch batch prices:', error);
      }
    }
    
    return prices;
  }
  
  getHardcodedPrice(denom: string): number {
    const hardcodedPrices: { [key: string]: number } = {
      'ubtc': 100000,
      'uusdc': 1,
      'uusdt': 1,
      'ubaby': 0.5,
      'uatom': 10
    };
    
    return hardcodedPrices[denom] || 0;
  }
}