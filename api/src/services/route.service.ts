import { Route } from '~/interfaces';

export default class RouteService {
  async getRoute(token0: string, token1: string, amount_in: string): Promise<Route> {
    try {
      // todo:
      // - fetch available pools for given tokens
      // - determine best route (e.g.: via BFS or external routing service)
      // - convert into Pool
      return {hops: []} as Route;
    } catch (err) {
      return {hops: []} as Route;
    }
  }
}