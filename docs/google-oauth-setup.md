# Google OAuth Setup Guide

This guide walks you through setting up Google OAuth authentication for ParkEx.

## Prerequisites

- A Supabase project (see `docs/database-setup.md`)
- A Google Cloud Platform account

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure the OAuth consent screen first:
     - Choose "External" (unless you have a Google Workspace)
     - Fill in app name, user support email, developer contact
     - Add scopes: `email`, `profile`, `openid`
     - Add test users if in testing mode
   - Back to credentials: Choose "Web application"
   - Name it (e.g., "ParkEx OAuth")
   - Add authorized redirect URIs:
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```
     Replace `YOUR_PROJECT_REF` with your Supabase project reference (found in your Supabase URL)
   - Click "Create"
   - **Copy the Client ID and Client Secret** (you'll need these in the next step)

## Step 2: Enable Google Provider in Supabase

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **Authentication** in the left sidebar
3. Click on **Providers** in the Authentication menu
4. Find **Google** in the list of providers
5. Toggle the switch to **ON** (enable it)
6. Fill in the OAuth credentials:
   - **Client ID (for OAuth)**: Paste the Client ID from Google Cloud Console
   - **Client Secret (for OAuth)**: Paste the Client Secret from Google Cloud Console
7. Click **Save**

## Step 3: Test Google OAuth

1. Start your development server: `npm run dev`
2. Navigate to `/login` or `/register`
3. Click "Sign in with Google"
4. You should be redirected to Google's sign-in page
5. After signing in, you'll be redirected back to your app

## Troubleshooting

### Error: "Unsupported provider: provider is not enabled"

- Make sure you've enabled the Google provider in Supabase (Step 2)
- Verify the toggle is ON in the Supabase dashboard

### Error: "redirect_uri_mismatch"

- Check that your redirect URI in Google Cloud Console matches exactly:
  - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- Make sure there are no trailing slashes or typos
- The redirect URI must be HTTPS (not HTTP) for production

### Error: "invalid_client"

- Verify your Client ID and Client Secret are correct in Supabase
- Make sure you copied the entire Client ID and Secret (they're long strings)
- Check that you're using the credentials for a "Web application" type, not other types

### Google sign-in works but user profile is not created

- Check that the `upsertProfile` server action is being called after Google sign-in
- Verify that the `profiles` table exists and migrations have been run
- Check browser console and server logs for errors

## Optional: Local Development

For local development with Supabase CLI, you may need to add a local redirect URI:

```
http://localhost:54321/auth/v1/callback
```

Add this to your Google OAuth client's authorized redirect URIs if you're using Supabase local development.

## Security Notes

- Never commit your Google OAuth Client Secret to git
- The Client ID is safe to expose (it's public)
- The Client Secret should only be stored in Supabase dashboard (not in your code)
- Use environment-specific OAuth clients for production vs development if possible

