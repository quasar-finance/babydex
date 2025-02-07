import axios from 'axios';
import { falooda } from '~/loaders';

export default class CosmosService {
  static async queryContract<T = any>(chainId: string, contractAddress: string, queryMsg: Record<string, unknown>): Promise<T> {
    const restUrl = falooda.getFastestCosmosLcd(chainId);
    const queryB64Encoded = Buffer.from(JSON.stringify(queryMsg)).toString('base64');
    const { data } = await axios.get(`${restUrl}/cosmwasm/wasm/v1/contract/${contractAddress}/smart/${queryB64Encoded}`);
    return data.data;
  }
}
