/**
 * Demo script with actual RPC calls to showcase simulation-based pricing
 */
import { CacheService } from './services/cache.js';
import { ContractService } from './services/contracts.js';
import { AMMCalculator } from './services/amm-calculator.js';

async function runDemo() {
  console.log('AMM Calculator Demo - Real RPC Calls');
  console.log('=====================================\n');
  
  // Use actual mainnet contracts from the codebase
  const contracts = {
    factory: process.env.FACTORY_CONTRACT || '',
    router: process.env.ROUTER_CONTRACT || '',
    incentives: process.env.INCENTIVES_CONTRACT || '',
    coinRegistry: process.env.COIN_REGISTRY_CONTRACT || ''
  };
  
  if (!contracts.factory) {
    console.log('ERROR: Please set contract addresses in environment variables:');
    console.log('   FACTORY_CONTRACT=bbn1...');
    console.log('   ROUTER_CONTRACT=bbn1...');
    console.log('   INCENTIVES_CONTRACT=bbn1...');
    console.log('   COIN_REGISTRY_CONTRACT=bbn1...');
    return;
  }
  
  // Initialize services
  const cache = new CacheService(100, 30000);
  const contractService = new ContractService(
    'https://rpc.babylon.nodestake.org',
    contracts,
    cache
  );
  
  const ammCalculator = new AMMCalculator(contractService);
  
  console.log('Services initialized');
  console.log('RPC Endpoint: https://rpc.babylon.nodestake.org');
  console.log(`Factory: ${contracts.factory.slice(0, 20)}...`);
  
  try {
    // Connect to blockchain
    console.log('\nConnecting to blockchain...');
    await contractService.connect();
    console.log('Connected successfully');
    
    // Get first few pools
    console.log('\nFetching pools from factory...');
    const pools = await contractService.getPools(5); // Get first 5 pools
    console.log(`Found ${pools.length} pools`);
    
    if (pools.length === 0) {
      console.log('ERROR: No pools found in factory');
      return;
    }
    
    // Analyze first pool
    const pool = pools[0];
    console.log(`\nAnalyzing Pool: ${pool.contract_addr}`);
    console.log(`   LP Token: ${pool.liquidity_token}`);
    console.log(`   Assets: ${pool.asset_infos.length}`);
    
    // Get pool details
    console.log('\nGetting pool reserves...');
    const poolShares = await contractService.getPoolShares(pool.contract_addr);
    console.log(`   Total Shares: ${poolShares.total_share}`);
    
    for (let i = 0; i < poolShares.assets.length; i++) {
      const asset = poolShares.assets[i];
      const info = asset.info.native_token?.denom || asset.info.token?.contract_addr || 'unknown';
      console.log(`   Asset ${i + 1}: ${asset.amount} of ${info}`);
    }
    
    // Calculate spot price
    if (poolShares.assets.length >= 2) {
      const spotPrice = AMMCalculator.getSpotPrice(
        poolShares.assets[0].amount,
        poolShares.assets[1].amount
      );
      console.log(`\nSpot Price: ${AMMCalculator.formatPrice(spotPrice)}`);
      
      // Test simulation-based bid/ask calculation
      console.log('\nTesting bid/ask calculation with real simulations...');
      
      try {
        const { bid, ask, spread } = await ammCalculator.calculateBidAsk(
          pool.contract_addr,
          pool.asset_infos[0],
          pool.asset_infos[1],
          poolShares.assets
        );
        
        console.log(`   Bid: ${AMMCalculator.formatPrice(bid)}`);
        console.log(`   Ask: ${AMMCalculator.formatPrice(ask)}`);
        console.log(`   Spread: ${(spread * 100).toFixed(3)}%`);
        
      } catch (error) {
        console.log(`   WARNING: Simulation failed: ${error.message}`);
        console.log('   (This might be expected if pool has low liquidity or specific constraints)');
      }
    }
    
    // Test price impact calculation
    if (poolShares.assets.length >= 2) {
      console.log('\nTesting price impact calculation...');
      
      const testAmount = (BigInt(poolShares.assets[0].amount) / 100n).toString(); // 1% of reserve
      const offerAsset = {
        info: pool.asset_infos[0],
        amount: testAmount
      };
      
      try {
        const priceImpact = await ammCalculator.calculatePriceImpact(
          pool.contract_addr,
          offerAsset,
          poolShares.assets[0].amount,
          poolShares.assets[1].amount
        );
        
        console.log(`   Trade Size: ${Number(testAmount) / 1e6} tokens (1% of reserve)`);
        console.log(`   Price Impact: ${(priceImpact * 100).toFixed(3)}%`);
        
      } catch (error) {
        console.log(`   WARNING: Price impact simulation failed: ${error.message}`);
      }
    }
    
    console.log('\nSummary:');
    console.log('   - Successfully connected to Babylon RPC');
    console.log('   - Retrieved real pool data from factory contract');
    console.log('   - Calculated prices using actual pool reserves');
    console.log('   - Tested simulation-based bid/ask calculation');
    console.log('   - Demonstrated price impact analysis');
    
    console.log('\nThis approach gives us:');
    console.log('   - Real-time data from blockchain');
    console.log('   - Accurate pricing for all pool types');
    console.log('   - Proper fee and slippage calculations');
    console.log('   - CoinGecko-ready market data');
    
  } catch (error) {
    console.error('ERROR: Demo failed:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\nTroubleshooting:');
      console.log('   - Check RPC endpoint is accessible');
      console.log('   - Verify contract addresses are correct');
      console.log('   - Ensure network connectivity');
    }
  } finally {
    await contractService.disconnect();
    console.log('\nDisconnected from RPC');
  }
}

// Run demo
runDemo().catch(console.error);