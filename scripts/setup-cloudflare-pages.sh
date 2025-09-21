#!/bin/bash

# Setup Cloudflare Pages
# This script guides you through the manual Pages setup process

set -e

echo "🚀 Cloudflare Pages Setup Guide"
echo "================================"
echo ""
echo "Since Pages requires GitHub integration, please follow these manual steps:"
echo ""

# Set variables
ACCOUNT_ID="82655735d78bf7309c659b5a576715c4"
PAGES_URL="https://dash.cloudflare.com/$ACCOUNT_ID/pages/new/provider/github"

echo "📋 Step 1: Create Pages Project"
echo "--------------------------------"
echo "1. Open: $PAGES_URL"
echo "2. Connect your GitHub account if not already connected"
echo "3. Select repository: strapi-next-monorepo-starter"
echo "4. Click 'Begin setup'"
echo ""

echo "📋 Step 2: Configure Build Settings"
echo "------------------------------------"
echo "Project name: framer-templates-ui"
echo "Production branch: main"
echo ""
echo "Build settings:"
echo "  • Framework preset: None (custom)"
echo "  • Build command: cd apps/ui && yarn build"
echo "  • Build output directory: /apps/ui/.next"
echo "  • Root directory: /"
echo ""

echo "📋 Step 3: Environment Variables"
echo "---------------------------------"
echo "Add these environment variables in the Pages dashboard:"
echo ""
cat << 'EOF'
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://framer-templates-ui.pages.dev
STRAPI_URL=http://localhost:1337
STRAPI_REST_READONLY_API_KEY=[Get from Strapi Admin]
NEXTAUTH_URL=https://framer-templates-ui.pages.dev
NEXTAUTH_SECRET=[Generate with: openssl rand -base64 32]
STRIPE_PUBLISHABLE_KEY=[Your Stripe publishable key]
WORKER_URL=https://framer-templates-api.workers.dev
EOF

echo ""
echo "📋 Step 4: Deploy"
echo "-----------------"
echo "1. Click 'Save and Deploy'"
echo "2. Wait for initial build (may take 5-10 minutes)"
echo "3. Note your deployment URL"
echo ""

echo "📋 Step 5: Custom Domain (Optional)"
echo "------------------------------------"
echo "1. Go to Custom domains tab"
echo "2. Add your domain"
echo "3. Follow DNS instructions"
echo ""

echo "🔧 Local Development with Pages"
echo "--------------------------------"
echo "To test Pages functions locally:"
echo ""
echo "cd apps/ui"
echo "npx wrangler pages dev -- yarn dev"
echo ""

echo "📝 Update Environment Variables"
echo "--------------------------------"
echo "After Pages deployment, update these in your .env file:"
echo ""
echo "PAGES_PROJECT_NAME=framer-templates-ui"
echo "PAGES_DEPLOYMENT_URL=https://framer-templates-ui.pages.dev"
echo ""

# Create Pages environment template
cat > .cloudflare/pages.env.example << 'EOF'
# Cloudflare Pages Environment Variables
# Copy these to Pages dashboard settings

# Core
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Strapi
STRAPI_URL=https://your-strapi-url.com
STRAPI_REST_READONLY_API_KEY=your-readonly-api-key

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars

# Stripe (Public keys only - never add secret keys to Pages!)
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Worker
WORKER_URL=https://your-worker.workers.dev
EOF

echo "✅ Pages environment template created at: .cloudflare/pages.env.example"
echo ""

# Check if we can use Wrangler Pages commands
if command -v wrangler &> /dev/null; then
    echo "🔍 Checking existing Pages projects..."
    export CLOUDFLARE_API_TOKEN=MpTHyC9tlf3lcP7pf3UExT24Ia_8CpMsUqLcUIAd

    # Try to list Pages projects
    wrangler pages project list 2>/dev/null || echo "No Pages projects found yet."

    echo ""
    echo "💡 After creating the Pages project in the dashboard, you can:"
    echo "  • Deploy manually: wrangler pages deploy apps/ui/.next --project-name framer-templates-ui"
    echo "  • Check deployment: wrangler pages deployment list --project-name framer-templates-ui"
fi

echo ""
echo "📌 Quick Links:"
echo "  • Pages Dashboard: https://dash.cloudflare.com/$ACCOUNT_ID/pages"
echo "  • Create New Project: $PAGES_URL"
echo "  • Pages Docs: https://developers.cloudflare.com/pages/"
echo ""
echo "Press Enter to open the Cloudflare Pages dashboard..."
read

# Try to open browser (works on macOS)
if command -v open &> /dev/null; then
    open "$PAGES_URL"
elif command -v xdg-open &> /dev/null; then
    xdg-open "$PAGES_URL"
else
    echo "Please open this URL manually: $PAGES_URL"
fi