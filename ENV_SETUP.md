# Environment Variables Setup

## Quick Setup for Development

Create a `.env.local` file in your project root with the following content:

```env
# Firebase Configuration
# Replace these with your actual Firebase project credentials
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## How to Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing project
3. Go to **Project Settings** (gear icon)
4. Scroll to "Your apps" section
5. Click "Add app" → **Web** (</> icon)
6. Copy the Firebase configuration object values:
   - **apiKey** → `NEXT_PUBLIC_FIREBASE_API_KEY`
   - **authDomain** → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - **projectId** → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - **storageBucket** → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - **messagingSenderId** → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - **appId** → `NEXT_PUBLIC_FIREBASE_APP_ID`

## Example Values

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=skybook-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=skybook-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=skybook-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
```

## After Setting Up Environment Variables

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. The Firebase setup notification will disappear
3. You can now use real database features

## Development Mode (No Firebase)

If you don't want to set up Firebase right now, the app will work with mock data:
- User authentication uses localStorage
- Flight data is hardcoded
- Bookings are stored in memory only

## Security Notes

- Never commit `.env.local` to version control
- The `NEXT_PUBLIC_` prefix makes variables available in the browser
- Firebase handles security through Firestore rules
- Keep your API keys secure
