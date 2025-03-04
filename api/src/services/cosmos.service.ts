import axios from 'axios';
import { ContractQueryService } from '~/services/contract.query.service';

export default class CosmosService implements ContractQueryService {
  async queryContract<T = any>(restUrl: string, contractAddress: string, queryMsg: Record<string, unknown>): Promise<T> {
    const queryB64Encoded = Buffer.from(JSON.stringify(queryMsg)).toString('base64');
    const { data } = await axios.get(`${restUrl}/cosmwasm/wasm/v1/contract/${contractAddress}/smart/${queryB64Encoded}`);
    return data.data;
  }
}
