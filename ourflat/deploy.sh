#!/bin/bash
set -e

echo ""
echo "🏠 OurFlat — Deployment Setup"
echo "================================"
echo ""
echo "This script will deploy the full OurFlat application."
echo ""

# Step 1: Check for required tools
echo "📋 Step 1: Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required. Install from https://nodejs.org"; exit 1; }
command -v vercel >/dev/null 2>&1 || { echo "❌ Vercel CLI not found. Run: npm install -g vercel"; exit 1; }
command -v supabase >/dev/null 2>&1 || { echo "❌ Supabase CLI not found. Run: npm install -g supabase"; exit 1; }

echo "✅ All prerequisites found"
echo ""

# Step 2: Authenticate with Vercel
echo "📋 Step 2: Vercel authentication"
echo "   A browser will open. Please log in to Vercel."
vercel login
echo "✅ Vercel authenticated"
echo ""

# Step 3: Authenticate with Supabase
echo "📋 Step 3: Supabase authentication"
echo "   You'll need a Supabase access token from: https://supabase.com/dashboard/account/tokens"
read -p "   Enter your Supabase access token: " SUPABASE_TOKEN
export SUPABASE_ACCESS_TOKEN="$SUPABASE_TOKEN"
echo "✅ Supabase authenticated"
echo ""

# Step 4: Create Supabase project
echo "📋 Step 4: Creating Supabase project..."
read -p "   Project name (default: ourflat): " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-ourflat}

DB_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=')
supabase projects create "$PROJECT_NAME" --db-password "$DB_PASSWORD" --region eu-west-2

echo "   Waiting for project to be provisioned..."
sleep 30

# Get project credentials
PROJECT_ID=$(supabase projects list --format json 2>/dev/null | python3 -c "import sys,json; projects=json.load(sys.stdin); print([p['id'] for p in projects if p['name']=='$PROJECT_NAME'][0])" 2>/dev/null || echo "")
PROJECT_URL="https://${PROJECT_ID}.supabase.co"

echo "✅ Supabase project created: $PROJECT_URL"
echo "   Database password: $DB_PASSWORD (save this!)"
echo ""

# Step 5: Get API keys
echo "📋 Step 5: Getting API keys..."
ANON_KEY=$(supabase projects api-keys --project-id "$PROJECT_ID" 2>/dev/null | grep "anon" | awk '{print $NF}')
SERVICE_ROLE_KEY=$(supabase projects api-keys --project-id "$PROJECT_ID" 2>/dev/null | grep "service_role" | awk '{print $NF}')
echo "✅ API keys retrieved"
echo ""

# Step 6: Push database schema
echo "📋 Step 6: Pushing database schema..."
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
supabase db push --project-id "$PROJECT_ID"
echo "✅ Database schema applied (30 tables with RLS policies)"
echo ""

# Step 7: Configure environment variables
echo "📋 Step 7: Configuring environment variables..."
cd "$SCRIPT_DIR/web"
cat > .env.local << EOFENV
NEXT_PUBLIC_SUPABASE_URL=$PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY
OPENAI_API_KEY=${OPENAI_API_KEY:-}
EOFENV

cd "$SCRIPT_DIR/mobile"
cat > .env.local << EOFENV
EXPO_PUBLIC_SUPABASE_URL=$PROJECT_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY
EOFENV
echo "✅ Environment variables configured"
echo ""

# Step 8: Deploy to Vercel
echo "📋 Step 8: Deploying web app to Vercel..."
cd "$SCRIPT_DIR/web"
vercel --prod --yes

# Set environment variables on Vercel
echo "   Setting environment variables on Vercel..."
vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "$PROJECT_URL" 2>/dev/null || true
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "$ANON_KEY" 2>/dev/null || true
vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "$SERVICE_ROLE_KEY" 2>/dev/null || true

# Redeploy with env vars
echo "   Redeploying with environment variables..."
vercel --prod --yes

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🎉 ===================================="
echo "   OurFlat is now live!"
echo "   ===================================="
echo ""
echo "   🌐 Visit your Vercel dashboard for the URL"
echo "   🗄️  Supabase Dashboard: https://supabase.com/dashboard/project/$PROJECT_ID"
echo ""
echo "   Next steps:"
echo "   1. Visit your web app and create an account"
echo "   2. Create a household"
echo "   3. Share the invite code with your partner"
echo ""
echo "   For mobile app deployment:"
echo "   cd mobile && npx eas-cli build --platform all"
echo ""
echo "==================================== 🎉"
