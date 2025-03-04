import CGeckoService from '~/services/cgecko.service';

const { NODE_ENV } = process.env;

export interface PricingQueryService {
  getCoinPrice(coinId?: string): Promise<{ usd: number; eur: number }>;
}

export class MockPricingQueryService implements PricingQueryService {
  async getCoinPrice(_coinId?: string): Promise<{ usd: number; eur: number }> {
    return Promise.resolve({ eur: 1, usd: 2 });
  }
}

export class PricingQueryServiceFactory {
  private static instance: PricingQueryService;

  static getInstance(): PricingQueryService {
    if (!this.instance) {
      switch (NODE_ENV) {
        case 'development':
        case 'testing':
          this.instance = new MockPricingQueryService();
          break;
        default:
          this.instance = new CGeckoService();
      }

    }

    return this.instance;
  }
}
