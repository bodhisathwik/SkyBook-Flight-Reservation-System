import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "placeholder-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "placeholder-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "placeholder-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "placeholder-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "placeholder-app-id"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

// Check if Firebase is properly configured
export const isFirebaseConfigured = () => {
  return process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
         process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
         process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "placeholder-api-key" &&
         process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN !== "placeholder-project.firebaseapp.com" &&
         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "placeholder-project"
}

// Database types
export interface User {
  uid: string
  email: string
  displayName: string
  createdAt: string
  updatedAt: string
}

export interface Flight {
  id: string
  flightNumber: string
  departureCity: string
  arrivalCity: string
  departureTime: string
  arrivalTime: string
  departureDate: string
  returnDate?: string
  price: number
  availableSeats: number
  totalSeats: number
  aircraftType: string
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  userId: string
  flightId: string
  flightNumber: string
  departureCity: string
  arrivalCity: string
  departureTime: string
  arrivalTime: string
  departureDate: string
  returnDate?: string
  seats: string[]
  passengers: string[]
  totalPrice: number
  bookingReference: string
  status: 'confirmed' | 'cancelled' | 'pending'
  createdAt: string
  updatedAt: string
}
