"use client"

import { useAuth } from "@/components/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ExternalLink, Database } from "lucide-react"

export function FirebaseSetupNotification() {
  const { isFirebaseReady } = useAuth()

  if (isFirebaseReady) {
    return null // Don't show notification if Firebase is configured
  }

  return (
    <Alert className="mb-6 border-orange-200 bg-orange-50">
      <Database className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <div className="space-y-2">
          <p className="font-semibold">🔥 Firebase Database Not Configured</p>
          <p>
            Your app is currently running with mock data. To enable real-time database features, 
            user authentication, and persistent bookings, set up Firebase:
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              <a 
                href="https://console.firebase.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                Create Firebase Project
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              <a 
                href="/FIREBASE_SETUP.md" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                📖 Setup Guide
              </a>
            </Button>
          </div>
          <div className="text-sm text-orange-600 mt-2">
            <strong>Quick Setup:</strong> Create a `.env.local` file with your Firebase credentials
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
