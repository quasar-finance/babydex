# Cloudflare Workers Deployment Guide

Step-by-step guide to deploy the Astrofork DEX API to Cloudflare Workers.

## Prerequisites

1. **Cloudflare Account**: Sign up at https://cloudflare.com
2. **Wrangler CLI**: Install globally
   ```bash
   npm install -g wrangler
   ```
3. **Authentication**: Login to Cloudflare
   ```bash
   wrangler login
   ```

## Step 1: Install Dependencies

```bash
cd api
pnpm install
```

## Step 2: Create KV Namespace

Create the KV namespace for caching:

```bash
# Production namespace
wrangler kv:namespace create "CACHE_KV"
# Example output: { binding = "CACHE_KV", id = "abc123def456" }

# Preview/development namespace  
wrangler kv:namespace create "CACHE_KV" --preview
# Example output: { binding = "CACHE_KV", preview_id = "xyz789uvw012" }
```

## Step 3: Update wrangler.toml

Edit `wrangler.toml` and update the KV namespace IDs:

```toml
[[kv_namespaces]]
binding = "CACHE_KV"
id = "abc123def456"           # Replace with your production ID
preview_id = "xyz789uvw012"    # Replace with your preview ID
```

## Step 4: Set Contract Addresses

Update the contract addresses in `wrangler.toml`:

```toml
[vars]
FACTORY_CONTRACT = "your-actual-factory-contract-address"
ROUTER_CONTRACT = "your-actual-router-contract-address"
INCENTIVES_CONTRACT = "your-actual-incentives-contract-address"
COIN_REGISTRY_CONTRACT = "your-actual-coin-registry-contract-address"
```

## Step 5: Set Database Secrets

Set your database connection secrets:

```bash
wrangler secret put SUPABASE_HOST
# Enter your database host when prompted

wrangler secret put SUPABASE_PORT
# Enter 5432 (or your custom port)

wrangler secret put SUPABASE_USER
# Enter your database username

wrangler secret put SUPABASE_PW
# Enter your database password

wrangler secret put SUPABASE_DB
# Enter your database name

wrangler secret put SUPABASE_SSL
# Enter "require" for SSL connections
```

## Step 6: Test Locally

Test the worker locally before deploying:

```bash
pnpm run dev:worker
```

Visit `http://localhost:8787` and test the endpoints:
- `http://localhost:8787/health`
- `http://localhost:8787/tickers`

## Step 7: Build and Deploy

```bash
# Build the worker bundle
pnpm run build

# Deploy to Cloudflare Workers
pnpm run deploy
```

## Step 8: Verify Deployment

After deployment, test your live endpoints:

```bash
# Replace with your worker URL
curl https://astrofork-dex-api.your-subdomain.workers.dev/health
curl https://astrofork-dex-api.your-subdomain.workers.dev/tickers
```

## Step 9: Monitor Logs

Monitor your worker's performance:

```bash
# Real-time logs
pnpm run tail

# Or use wrangler directly
wrangler tail
```

## Custom Domain (Optional)

### Add Custom Domain

1. In Cloudflare Dashboard, go to Workers & Pages
2. Select your worker
3. Go to Settings > Domains & Routes
4. Click "Add Custom Domain"
5. Enter your domain (e.g., `api.astrofork.com`)

### Update wrangler.toml

Add the route configuration:

```toml
[[route]]
pattern = "api.astrofork.com/*"
zone_name = "astrofork.com"
```

## Troubleshooting

### Common Issues

1. **KV Namespace Not Found**
   - Verify the namespace IDs in wrangler.toml match your created namespaces

2. **Database Connection Failed**
   - Check that all database secrets are set correctly
   - Verify your database allows connections from Cloudflare IPs

3. **Contract Query Failures**
   - Ensure contract addresses are correct in wrangler.toml
   - Verify RPC endpoint is accessible

4. **Build Errors**
   - Check that all dependencies are installed
   - Ensure TypeScript compilation is clean

### Useful Commands

```bash
# Check deployment status
wrangler deployments list

# View worker details
wrangler whoami

# Delete deployment (careful!)
wrangler delete

# View KV namespaces
wrangler kv:namespace list

# View environment variables
wrangler secret list
```

## Performance Optimization

### Caching Strategy

The worker uses KV for caching with TTL:
- Pool data: 60 seconds
- Price data: 60 seconds  
- Contract queries: 120 seconds

### Resource Limits

Current limits in wrangler.toml:
- CPU time: 50ms per request
- Memory: 128MB (default)
- KV storage: Unlimited (pay per operation)

### Monitoring

Set up alerts in Cloudflare Dashboard:
- High error rates
- High latency
- Resource usage

## Security

### Environment Variables

Never commit secrets to git. Always use `wrangler secret put`.

### CORS

The API includes CORS headers for browser access:
```javascript
app.use('*', cors())
```

### Rate Limiting

Consider implementing rate limiting for production:
```javascript
// TODO: Add rate limiting middleware
```

## Cost Optimization

### KV Usage

- Read operations: Free up to 10M/month
- Write operations: $0.50 per million
- List operations: $5.00 per million
- Storage: $0.50 per GB per month

### Worker Invocations

- First 100K requests/day: Free
- Additional requests: $0.15 per million

## Maintenance

### Updates

```bash
# Pull latest code
git pull origin main

# Install any new dependencies
pnpm install

# Build and deploy
pnpm run build
pnpm run deploy
```

### Monitoring

Regular checks:
- Check `/health` endpoint
- Monitor logs for errors
- Verify database connectivity
- Check KV cache hit rates