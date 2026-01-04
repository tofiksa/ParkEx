# Database Setup Guide

## Prerequisites

1. Supabase project created at https://supabase.com
2. Project URL and API keys from Supabase dashboard

## Environment Variables

Copy `env.example` to `.env.local` and fill in your Supabase credentials.

### Finding Your Supabase Keys

1. **Go to your Supabase project dashboard**: https://supabase.com/dashboard
2. **Select your project** (or create a new one if you haven't)
3. **Navigate to Settings** (gear icon in the left sidebar)
4. **Click on "API"** in the Settings menu

You'll see three important values:

#### 1. Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
- Found in the "Project URL" section
- Format: `https://xxxxxxxxxxxxx.supabase.co`
- Copy this to `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`

#### 2. Anon/Public Key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- Found in the "Project API keys" section
- Look for the key labeled **"anon"** or **"public"**
- This key is safe to expose in client-side code (it's public)
- Copy this to `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

#### 3. Service Role Key (`SUPABASE_SERVICE_ROLE_KEY`)
- Found in the same "Project API keys" section
- Look for the key labeled **"service_role"** or **"service_role secret"**
- ⚠️ **IMPORTANT**: This key bypasses Row Level Security (RLS) and has full database access
- **Never commit this key to git or expose it in client-side code**
- Only use it in server-side code (API routes, server actions)
- Copy this to `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`

### Example `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Note**: The service role key is longer and typically starts with `eyJ...` (it's a JWT token). Make sure you copy the entire key.

## Running Migrations

### Option 1: Supabase Dashboard (Recommended for initial setup)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/0001_domain.sql`
4. Run the migration
5. Repeat for `supabase/migrations/0002_analytics.sql`

### Option 2: Supabase CLI

If you have Supabase CLI installed:

```bash
# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Verifying Setup

### 1. Health Check Endpoint

Test database connectivity:

```bash
curl http://localhost:3000/api/health
```

Expected response when database is connected:
```json
{
  "status": "ok",
  "checks": {
    "timestamp": "2024-...",
    "database": "ok"
  }
}
```

### 2. Run Integration Tests

```bash
npm test -- tests/db.integration.test.ts
```

Note: Tests will skip if env variables are not set (expected in CI).

### 3. Manual Verification

Check that tables exist in Supabase dashboard:
- `profiles` (with RLS enabled)
- `garages` (with RLS enabled)
- `bids` (with RLS enabled)
- `analytics_events` (if analytics migration run)
- `feedback` (if analytics migration run)

Check storage bucket:
- `garage-images` bucket should exist and be public

## Troubleshooting

### Health endpoint returns "degraded"

1. Verify `.env.local` exists and has correct values
2. Check Supabase project is active
3. Verify migrations have been run
4. Check network connectivity to Supabase

### Tests fail with "table does not exist"

Run migrations (see above) to create required tables.

### RLS policies blocking queries

Verify RLS policies are correctly set up in migrations. For admin operations, use `getSupabaseAdmin()` which uses service role key.

### Google OAuth error: "Unsupported provider: provider is not enabled"

If you get this error when trying to sign in with Google, you need to enable the Google provider in Supabase. See the detailed guide in `docs/google-oauth-setup.md` for step-by-step instructions.

Quick fix:
1. Go to Supabase dashboard → Authentication → Providers
2. Enable Google provider
3. Configure Google OAuth credentials (see `docs/google-oauth-setup.md` for details)

> **Note**: If you don't want to use Google OAuth, you can remove `providers={["google"]}` from the `Auth` components in `app/(auth)/login/page.tsx` and `app/(auth)/register/page.tsx`, or simply leave it enabled but users will only see email/password login if Google is not configured.

