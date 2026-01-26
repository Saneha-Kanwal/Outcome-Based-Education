# Google OAuth Setup Guide

## Current Configuration

Based on your setup, you need to configure the following in Google Cloud Console:

### Authorized JavaScript origins:
```
http://localhost:5173
```
(Or whatever port your frontend is running on - check your Vite dev server)

### Authorized redirect URIs:
```
http://localhost:8000/api/auth/google/callback
```

## Step-by-Step Instructions

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Make sure you're in the correct project

2. **Navigate to Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Find your OAuth 2.0 Client ID: `466834053179-4ov8b1p8vrogr90nlujjddapvn5uvqv1.apps.googleusercontent.com`
   - Click on it to edit

3. **Update Authorized JavaScript origins:**
   - Find "Authorized JavaScript origins" section
   - Change `http://localhost:3000` to `http://localhost:5173` (or your actual frontend port)
   - This should match where your Vite dev server is running
   - Click "SAVE"

4. **Verify Authorized Redirect URI:**
   - Check "Authorized redirect URIs" section
   - Should have: `http://localhost:8000/api/auth/google/callback`
   - If missing, click "+ ADD URI" and add it
   - **Important:** 
     - Must be `http://` (not `https://`)
     - Must include port `:8000`
     - Must include `/api/auth/google/callback` path
     - No trailing slash
   - Click "SAVE"

4. **Verify:**
   - The redirect URI should now appear in the list
   - Wait a few minutes for changes to propagate

## Testing

After configuring:

1. **Check browser console** when clicking "Continue with Google"
   - Look for "Redirect URI:" in the console logs
   - It should show: `http://localhost:8000/api/auth/google/callback`

2. **If still getting error:**
   - Make sure there are no extra spaces in Google Cloud Console
   - Try removing and re-adding the redirect URI
   - Wait 5-10 minutes for changes to propagate
   - Clear browser cache and try again

## Common Issues

### Issue: "redirect_uri_mismatch"
**Solution:** The redirect URI in Google Cloud Console must EXACTLY match what's being sent. Check:
- Protocol: `http://` vs `https://`
- Port: `:8000` vs `:8080` or no port
- Path: `/api/auth/google/callback` vs `/auth/google/callback`

### Issue: "invalid_client"
**Solution:** Check that the Client ID matches in both:
- Frontend `.env`: `VITE_GOOGLE_CLIENT_ID`
- Google Cloud Console: OAuth 2.0 Client ID

### Issue: Changes not taking effect
**Solution:** 
- Wait 5-10 minutes for Google's changes to propagate
- Clear browser cache
- Try in incognito mode

## Current Values

- **Client ID:** `466834053179-4ov8b1p8vrogr90nlujjddapvn5uvqv1.apps.googleusercontent.com`
- **Redirect URI:** `http://localhost:8000/api/auth/google/callback`
- **Backend URL:** `http://localhost:8000/api`

