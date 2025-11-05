// Temporary script to initialize sample flights
// Run this once after Firebase is set up

import { FirebaseBookingService } from '../lib/firebase-booking-service.js'

async function initializeSampleData() {
  try {
    console.log('Initializing sample flights...')
    await FirebaseBookingService.initializeSampleFlights()
    console.log('Sample flights initialized successfully!')
  } catch (error) {
    console.error('Error initializing sample flights:', error)
  }
}

// Run the initialization
initializeSampleData()
