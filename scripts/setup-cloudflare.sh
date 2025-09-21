#!/bin/bash

# Setup Cloudflare Infrastructure
# Run this script after setting CLOUDFLARE_API_TOKEN in your environment

set -e

echo "🚀 Setting up Cloudflare infrastructure..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Check authentication
echo "🔐 Checking Cloudflare authentication..."
wrangler whoami || (echo "❌ Not authenticated. Please run: wrangler login" && exit 1)

# Create R2 buckets
echo "🪣 Creating R2 buckets..."
BUCKETS=("framer-templates-dev" "framer-templates-staging" "framer-templates-prod" "framer-templates-backups")

for bucket in "${BUCKETS[@]}"; do
    echo "  Creating bucket: $bucket"
    wrangler r2 bucket create "$bucket" 2>/dev/null || echo "  ⚠️  Bucket $bucket already exists"
done

# Set up CORS for buckets
echo "🔒 Configuring CORS for R2 buckets..."
cat > /tmp/cors.json << 'EOF'
{
  "AllowedOrigins": ["http://localhost:3000", "http://localhost:1337"],
  "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
  "AllowedHeaders": ["*"],
  "ExposeHeaders": ["ETag"],
  "MaxAgeSeconds": 3600
}
EOF

for bucket in "framer-templates-dev" "framer-templates-staging" "framer-templates-prod"; do
    echo "  Setting CORS for: $bucket"
    wrangler r2 bucket cors put "$bucket" --file /tmp/cors.json || echo "  ⚠️  Failed to set CORS for $bucket"
done

rm /tmp/cors.json

# Install Worker dependencies
echo "📦 Installing Worker dependencies..."
cd apps/worker
yarn install

# Create secrets placeholder
echo "🔑 Creating secrets configuration..."
cat > .dev.vars << 'EOF'
# Development secrets (not committed to git)
STRAPI_URL=http://localhost:1337
JWT_SECRET=your-jwt-secret-min-32-chars
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
EOF

echo "  ⚠️  Please update apps/worker/.dev.vars with actual values"

# Deploy Worker to development
read -p "Deploy Worker to development environment? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Deploying Worker to development..."
    wrangler deploy --env development
    echo "✅ Worker deployed successfully!"
else
    echo "⏩ Skipping Worker deployment"
fi

cd ../..

# Create Pages project setup script
echo "📄 Creating Pages deployment script..."
cat > scripts/deploy-pages.sh << 'EOF'
#!/bin/bash

# Deploy to Cloudflare Pages
# This should be run from CI/CD or manually for production deployments

set -e

echo "🚀 Building UI for production..."
cd apps/ui
yarn build

echo "📤 Deploying to Cloudflare Pages..."
npx wrangler pages deploy .next --project-name framer-templates-ui --compatibility-date 2024-01-01

echo "✅ Deployment complete!"
EOF

chmod +x scripts/deploy-pages.sh

# Update .gitignore
echo "📝 Updating .gitignore..."
cat >> .gitignore << 'EOF'

# Cloudflare Worker
apps/worker/.dev.vars
apps/worker/dist/
apps/worker/.wrangler/

# R2 temp files
*.r2-temp
EOF

# Generate environment template
echo "📋 Generating Cloudflare environment checklist..."
cat > docs/cloudflare-env-checklist.md << 'EOF'
# Cloudflare Environment Variables Checklist

## Required Environment Variables

### Account Configuration
- [ ] `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- [ ] `CLOUDFLARE_API_TOKEN` - API token with Workers, Pages, and R2 permissions

### R2 Storage
- [ ] `R2_ACCESS_KEY_ID` - R2 API access key
- [ ] `R2_SECRET_ACCESS_KEY` - R2 API secret key
- [ ] `R2_ENDPOINT` - Format: https://<account-id>.r2.cloudflarestorage.com

### Worker Configuration
- [ ] `WORKER_URL` - Your Worker endpoint URL
- [ ] `JWT_SECRET` - Shared secret for JWT signing (min 32 chars)

### Pages Configuration
- [ ] `PAGES_PROJECT_NAME` - Cloudflare Pages project name

## Setup Steps Completed

- [x] R2 buckets created (dev, staging, prod, backups)
- [x] CORS configured for R2 buckets
- [x] Worker scaffold created
- [ ] Worker deployed to development
- [ ] Pages project created
- [ ] Custom domain configured
- [ ] SSL certificates active

## Next Steps

1. Update `apps/worker/.dev.vars` with actual secrets
2. Deploy Worker: `cd apps/worker && yarn deploy:dev`
3. Create Pages project in Cloudflare dashboard
4. Connect Pages to your Git repository
5. Configure environment variables in Pages settings
6. Set up custom domain and SSL

## Verification Commands

```bash
# Check Worker status
cd apps/worker && wrangler tail --env development

# Test Worker health
curl https://your-worker.workers.dev/health

# List R2 buckets
wrangler r2 bucket list

# Test R2 access
echo "test" > test.txt
wrangler r2 object put framer-templates-dev/test.txt --file test.txt
wrangler r2 object get framer-templates-dev/test.txt
```
EOF

echo "✅ Cloudflare setup complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Update apps/worker/.dev.vars with actual secrets"
echo "  2. Run 'cd apps/worker && yarn deploy:dev' to deploy Worker"
echo "  3. Create Pages project at https://dash.cloudflare.com"
echo "  4. Review docs/cloudflare-env-checklist.md"
echo ""
echo "🔗 Resources:"
echo "  - Setup guide: docs/cloudflare-setup.md"
echo "  - Environment checklist: docs/cloudflare-env-checklist.md"
echo "  - Worker code: apps/worker/"