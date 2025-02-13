import { Asset } from '~/interfaces';

export default class AssetService {
  async getAssets(): Promise<Asset[]> {
    try {
      // todo:
      // - fetch available assets
      // - determine asset price
      // - convert into Asset[]
      return [];
    } catch (err) {
      return [];
    }
  }
}