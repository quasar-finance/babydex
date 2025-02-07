import axios, { AxiosInstance } from 'axios';
import RedisService from './redis.service';

export default class CGeckoService {
  http: AxiosInstance;
  redisService: RedisService;
  constructor() {
    this.http = axios.create({
      baseURL: 'https://api.coingecko.com/api/v3',
      timeout: 10000
    });
    this.redisService = new RedisService();
  }
  async ping(): Promise<boolean> {
    const { status } = await this.http.get('/ping');
    return status === 200;
  }
  async getCoinPrice(coinId?: string): Promise<{ usd: number; eur: number }> {
    if (!coinId) return { usd: 0, eur: 0 };
    try {
      const cachedValue = await this.redisService.getCoin(coinId);
      if (cachedValue) return cachedValue;
      const { data } = await this.http.get(`/simple/price?ids=${coinId}&vs_currencies=usd,eur`);
      await this.redisService.setCoin(coinId, data[coinId]);
      return data[coinId];
    } catch (err) {
      return { usd: 0, eur: 0 };
    }
  }
}
