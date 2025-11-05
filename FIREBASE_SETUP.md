# Firebase Setup Guide for SkyBook

## Prerequisites
- A Google account
- Node.js 18+ installed
- Your SkyBook project ready

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project" or "Add project"
3. Enter project details:
   - **Project name**: `skybook-flight-reservation`
   - **Google Analytics**: Enable (recommended)
4. Click "Create project"
5. Wait for the project to be created (1-2 minutes)

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
5. Click "Save"

## Step 3: Create Firestore Database

1. In your Firebase project, go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

## Step 4: Get Your Project Credentials

1. In your Firebase project, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" → **Web** (</> icon)
4. Enter app details:
   - **App nickname**: `SkyBook Web`
   - **Firebase Hosting**: Not needed for now
5. Click "Register app"
6. Copy the Firebase configuration object

## Step 5: Configure Environment Variables

1. In your SkyBook project root, create a `.env.local` file:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

2. Replace the values with your actual Firebase credentials

## Step 6: Set Up Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** → **Rules**
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Flights are publicly readable
    match /flights/{flightId} {
      allow read: if true;
      allow write: if false; // Only admin can write flights
    }
    
    // Bookings are private to users
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click "Publish"

## Step 7: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Open `http://localhost:3000`
3. Try to sign up with a new account
4. Check Firebase Console → **Authentication** → **Users** to see the new user
5. Check **Firestore Database** → **Data** to see user documents

## Step 8: Initialize Sample Data

The application will automatically create sample flights when you first use the Firebase integration. You can also manually initialize them by calling:

```javascript
import { FirebaseBookingService } from '@/lib/firebase-booking-service'
await FirebaseBookingService.initializeSampleFlights()
```

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Check your `.env.local` file has correct credentials
   - Ensure no extra spaces or quotes around the values

2. **"Missing or insufficient permissions"**
   - Check Firestore security rules
   - Ensure user is authenticated

3. **"User not found" error**
   - Check if the user exists in Firebase Authentication
   - Verify Firestore user document was created

4. **Real-time not working**
   - Check Firestore security rules allow read access
   - Verify WebSocket connections aren't blocked

### Database Queries

You can run these queries in Firebase Console → **Firestore Database** → **Data**:

```javascript
// Check users
db.collection('users').get()

// Check flights
db.collection('flights').get()

// Check bookings
db.collection('bookings').get()
```

## Production Deployment

### Environment Variables for Production

Set these in your deployment platform (Vercel, Netlify, etc.):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Update Security Rules for Production

For production, update your Firestore rules to be more restrictive:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /flights/{flightId} {
      allow read: if true;
      allow write: if false; // Only admin can write flights
    }
    
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use Firestore security rules** to protect data
3. **Enable email verification** in production
4. **Monitor usage** in Firebase Console
5. **Set up proper CORS** policies
6. **Use Firebase App Check** for additional security

## Firebase Features Used

- **Firebase Authentication**: User sign up/sign in
- **Cloud Firestore**: Real-time database
- **Real-time listeners**: Live updates
- **Security rules**: Data protection
- **Server timestamps**: Consistent timestamps

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Firebase Community](https://firebase.community)

---

**Next Steps:**
1. Complete the Firebase setup
2. Test user registration and login
3. Test flight booking functionality
4. Deploy to production with proper environment variables
