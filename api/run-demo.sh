#!/bin/bash

# Set environment variables with actual deployed contracts
export FACTORY_CONTRACT="bbn1suhgf5svhu4usrurvxzlgn54ksxmn8gljarjtxqnapv8kjnp4nrs3tkuvr"
export ROUTER_CONTRACT="bbn1466nf3zuxpya8q9emxukd7vftaf6h4psr0a07srl5zw74zh84yjqczkw9f"
export INCENTIVES_CONTRACT="bbn1xr3rq8yvd7qplsw5yx90ftsr2zdhg4e9z60h5duusgxpv72hud3swvshgw"
export COIN_REGISTRY_CONTRACT="bbn1hrpna9v7vs3stzyd4z3xf00676kf78zpe2u5ksvljswn2vnjp3ysx8e0sz"

echo "Running AMM Calculator Demo with mainnet contracts..."
echo ""

# Run the demo
npm run demo