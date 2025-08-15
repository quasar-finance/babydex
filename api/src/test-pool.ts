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
      const readable = Number(amount) / 1e6; // Assuming 6 decimals
      console.log(`  Reserve ${i + 1}: ${asset.amount} (${readable.toFixed(6)}) of ${info}`);
    }
    
    // Calculate spot price
    if (poolShares.assets.length >= 2) {
      const spotPrice = AMMCalculator.getSpotPrice(
        poolShares.assets[0].amount,
        poolShares.assets[1].amount
      );
      console.log(`\nSpot Price: ${AMMCalculator.formatPrice(spotPrice)}`);
      console.log('  (Price of asset 1 in terms of asset 2)');
      
      // Test bid/ask calculation
      console.log('\nCalculating bid/ask prices...');
      
      try {
        const { bid, ask, spread } = await ammCalculator.calculateBidAsk(
          poolAddress,
          pool.asset_infos[0],
          pool.asset_infos[1],
          poolShares.assets
        );
        
        console.log(`  Bid Price: ${AMMCalculator.formatPrice(bid)}`);
        console.log(`  Ask Price: ${AMMCalculator.formatPrice(ask)}`);
        console.log(`  Spread: ${(spread * 100).toFixed(3)}%`);
        
      } catch (error) {
        console.log(`  Error calculating bid/ask: ${error.message}`);
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
            true // offering base asset (asset 0)
          );
          
          const readable = Number(testAmount) / 1e6;
          console.log(`  ${(size * 100).toFixed(1)}% of reserve (${readable.toFixed(6)} tokens): ${(priceImpact * 100).toFixed(3)}% impact`);
          
        } catch (error) {
          console.log(`  ${(size * 100).toFixed(1)}% of reserve: Error - ${error.message}`);
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
        console.log(`  Error fetching config: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
  } finally {
    await contractService.disconnect();
    console.log('\nDisconnected from RPC');
  }
}

// Run test
testPool().catch(console.error);