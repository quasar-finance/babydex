/**
 * Test script for a specific pool
 */
import { CacheService } from './services/cache.js';
import { ContractService } from './services/contracts.js';
import { AMMCalculator } from './services/amm-calculator.js';

async function testPool() {
  const poolAddress = 'bbn1qjn06jt7zjhdqxgud07nylkpgnaurq6x6vad38vztwxec4rr5ntsnn4dd3';
  
  console.log('Testing specific pool');
  console.log('=====================\n');
  console.log(`Pool Address: ${poolAddress}\n`);
  
  // Use actual mainnet contracts
  const contracts = {
    factory: process.env.FACTORY_CONTRACT || 'bbn1suhgf5svhu4usrurvxzlgn54ksxmn8gljarjtxqnapv8kjnp4nrs3tkuvr',
    router: process.env.ROUTER_CONTRACT || 'bbn1466nf3zuxpya8q9emxukd7vftaf6h4psr0a07srl5zw74zh84yjqczkw9f',
    incentives: process.env.INCENTIVES_CONTRACT || 'bbn1xr3rq8yvd7qplsw5yx90ftsr2zdhg4e9z60h5duusgxpv72hud3swvshgw',
    coinRegistry: process.env.COIN_REGISTRY_CONTRACT || 'bbn1hrpna9v7vs3stzyd4z3xf00676kf78zpe2u5ksvljswn2vnjp3ysx8e0sz'
  };
  
  // Initialize services
  const cache = new CacheService(100, 30000);
  const contractService = new ContractService(
    'https://rpc.babylon.nodestake.org',
    contracts,
    cache
  );
  
  const ammCalculator = new AMMCalculator(contractService);
  
  try {
    console.log('Connecting to Babylon RPC...');
    await contractService.connect();
    
    // Get pool info
    console.log('Fetching pool information...\n');
    const pool = await contractService.getPool(poolAddress);
    
    // Get decimals for all assets in the pool
    console.log('Fetching token decimals...');
    const decimalsMap = await contractService.getBatchTokenDecimals(pool.asset_infos);
    for (const [tokenId, decimals] of decimalsMap.entries()) {
      console.log(`  ${tokenId}: ${decimals} decimals`);
    }
    console.log('Pool Info:');
    console.log(`  LP Token: ${pool.liquidity_token}`);
    console.log(`  Pair Type: ${JSON.stringify(pool.pair_type)}`);
    console.log(`  Assets: ${pool.asset_infos.length}`);
    
    // Get detailed asset info
    for (let i = 0; i < pool.asset_infos.length; i++) {
      const asset = pool.asset_infos[i];
      if (asset.native_token) {
        console.log(`  Asset ${i + 1}: Native token - ${asset.native_token.denom}`);
      } else if (asset.token) {
        console.log(`  Asset ${i + 1}: CW20 token - ${asset.token.contract_addr}`);
      }
    }
    
    // Get pool reserves
    console.log('\nFetching pool reserves...');
    const poolShares = await contractService.getPoolShares(poolAddress);
    console.log(`Total LP Shares: ${poolShares.total_share}`);
    
    for (let i = 0; i < poolShares.assets.length; i++) {
      const asset = poolShares.assets[i];
      const info = asset.info.native_token?.denom || asset.info.token?.contract_addr || 'unknown';
      const amount = BigInt(asset.amount);
      const decimals = decimalsMap.get(info) || 6;
      const readable = Number(amount) / Math.pow(10, decimals);
      console.log(`  Reserve ${i + 1}: ${asset.amount} (${readable.toFixed(6)}) of ${info}`);
    }
    
    // Calculate spot price
    if (poolShares.assets.length >= 2) {
      // Get decimals for both assets
      const asset0Id = pool.asset_infos[0].native_token?.denom || pool.asset_infos[0].token?.contract_addr || '';
      const asset1Id = pool.asset_infos[1].native_token?.denom || pool.asset_infos[1].token?.contract_addr || '';
      const asset0Decimals = decimalsMap.get(asset0Id) || 6;
      const asset1Decimals = decimalsMap.get(asset1Id) || 6;
      
      // Get spot price using contract simulation
      const spotPrice = await ammCalculator.getSpotPrice(
        poolAddress,
        pool.asset_infos[0],
        pool.asset_infos[1],
        decimalsMap
      );
      console.log(`\nSpot Price: ${AMMCalculator.formatPrice(spotPrice)}`);
      console.log('  (Price from contract simulation - asset 1 in terms of asset 2)');
      
      // Also show the reserve-based calculation for comparison
      const reservePrice = AMMCalculator.getSpotPriceFromReserves(
        poolShares.assets[0].amount,
        poolShares.assets[1].amount,
        asset0Decimals,
        asset1Decimals
      );
      console.log(`Reserve Price: ${AMMCalculator.formatPrice(reservePrice)}`);
      console.log('  (Price from reserves - for comparison)');
      
      // Test bid/ask calculation
      console.log('\nCalculating bid/ask prices...');
      
      try {
        const { bid, ask, spread } = await ammCalculator.calculateBidAsk(
          poolAddress,
          pool.asset_infos[0],
          pool.asset_infos[1],
          poolShares.assets,
          decimalsMap
        );
        
        console.log(`  Bid Price: ${AMMCalculator.formatPrice(bid)}`);
        console.log(`  Ask Price: ${AMMCalculator.formatPrice(ask)}`);
        console.log(`  Spread: ${(spread * 100).toFixed(3)}%`);
        
      } catch (error) {
        console.log(`  Error calculating bid/ask: ${(error as Error).message}`);
      }
      
      // Test price impact for different trade sizes
      console.log('\nTesting price impact for different trade sizes:');
      const tradeSizes = [0.001, 0.01, 0.05, 0.1]; // 0.1%, 1%, 5%, 10% of reserve
      
      for (const size of tradeSizes) {
        const testAmount = (BigInt(poolShares.assets[0].amount) * BigInt(Math.floor(size * 1000)) / 1000n).toString();
        const offerAsset = {
          info: pool.asset_infos[0],
          amount: testAmount
        };
        
        try {
          const priceImpact = await ammCalculator.calculatePriceImpact(
            poolAddress,
            offerAsset,
            poolShares.assets[0].amount,
            poolShares.assets[1].amount,
            true, // offering base asset (asset 0)
            decimalsMap
          );
          
          const readable = Number(testAmount) / 1e6;
          console.log(`  ${(size * 100).toFixed(1)}% of reserve (${readable.toFixed(6)} tokens): ${(priceImpact * 100).toFixed(3)}% impact`);
          
        } catch (error) {
          console.log(`  ${(size * 100).toFixed(1)}% of reserve: Error - ${(error as Error).message}`);
        }
      }
      
      // Get pool config to understand parameters
      console.log('\nFetching pool configuration...');
      try {
        const config = await contractService.getPoolConfig(poolAddress);
        console.log('Pool Config:');
        console.log(`  Pool Type: ${Object.keys(pool.pair_type)[0]}`);
        if (config.params) {
          console.log(`  Parameters: ${JSON.stringify(config.params, null, 2)}`);
        }
      } catch (error) {
        console.log(`  Error fetching config: ${(error as Error).message}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', (error as Error).message);
    if ((error as Error).stack) {
      console.error('Stack:', (error as Error).stack);
    }
  } finally {
    await contractService.disconnect();
    console.log('\nDisconnected from RPC');
  }
}

// Run test
testPool().catch(console.error);