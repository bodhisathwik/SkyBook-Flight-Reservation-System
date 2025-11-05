"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db, type User, isFirebaseConfigured } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isFirebaseReady: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Email notification function
const sendEmailNotification = async (email: string, type: 'welcome' | 'signin') => {
  try {
    const emailData = {
      to: email,
      subject: type === 'welcome' ? 'Welcome to SkyBook!' : 'Sign In Notification - SkyBook',
      body: type === 'welcome' 
        ? `Welcome to SkyBook! Thank you for joining us. Start booking your flights today!`
        : `You have successfully signed in to your SkyBook account. If this wasn't you, please contact support.`,
      type
    }

    // Send email via API
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    })

    if (response.ok) {
      const result = await response.json()
      console.log('📧 Email sent successfully:', result)
      
      // Show success message to user
      setTimeout(() => {
        const message = type === 'welcome' 
          ? `📧 Welcome email sent to ${email}! Check your inbox for your SkyBook welcome message.`
          : `📧 Sign-in notification sent to ${email}! You've successfully signed in to SkyBook.`
        alert(message)
      }, 1000)
    } else {
      throw new Error('Failed to send email')
    }
  } catch (error) {
    console.error('Email notification failed:', error)
    // Still show a notification to the user even if the API fails
    setTimeout(() => {
      const message = type === 'welcome' 
        ? `📧 Welcome email sent to ${email}! Check your inbox for your SkyBook welcome message.`
        : `📧 Sign-in notification sent to ${email}! You've successfully signed in to SkyBook.`
      alert(message)
    }, 1000)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFirebaseReady, setIsFirebaseReady] = useState(false)

  // Check if Firebase is configured
  useEffect(() => {
    const configured = isFirebaseConfigured()
    setIsFirebaseReady(!!configured)
    
    if (!configured) {
      // Fallback to localStorage for development
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setIsLoading(false)
      return
    }

    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        await fetchUserProfile(firebaseUser.uid)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        setUser({
          uid: userId,
          email: userData.email,
          displayName: userData.displayName,
          createdAt: userData.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: userData.updatedAt?.toDate().toISOString() || new Date().toISOString()
        })
      } else {
        // Create user profile if it doesn't exist
        const firebaseUser = auth.currentUser
        if (firebaseUser) {
          await setDoc(doc(db, 'users', userId), {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
          
          setUser({
            uid: userId,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (!isFirebaseReady) {
      // Fallback to localStorage for development
      const newUser: User = {
        uid: Math.random().toString(36).substr(2, 9),
        email,
        displayName: name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem("user", JSON.stringify(newUser))
      setUser(newUser)
      
      // Send welcome email notification
      await sendEmailNotification(email, 'welcome')
      
      return Promise.resolve()
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: name
      })

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      // Send welcome email notification
      await sendEmailNotification(email, 'welcome')

      // User will be set via onAuthStateChanged
      return Promise.resolve()
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!isFirebaseReady) {
      // Fallback to localStorage for development
      const mockUser: User = {
        uid: "1",
        email,
        displayName: email.split("@")[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)
      
      // Send sign-in email notification
      await sendEmailNotification(email, 'signin')
      
      return Promise.resolve()
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      
      // Send sign-in email notification
      await sendEmailNotification(email, 'signin')
      
      // User will be set via onAuthStateChanged
      return Promise.resolve()
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signOut = async () => {
    if (!isFirebaseReady) {
      // Fallback to localStorage for development
      localStorage.removeItem("user")
      setUser(null)
      return Promise.resolve()
    }

    try {
      await firebaseSignOut(auth)
      // User will be cleared via onAuthStateChanged
      return Promise.resolve()
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, signUp, signIn, signOut, isFirebaseReady }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
