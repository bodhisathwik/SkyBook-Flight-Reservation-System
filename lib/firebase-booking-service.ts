import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore'
import { db, type Booking, type Flight } from './firebase'

export class FirebaseBookingService {
  // Create a new booking
  static async createBooking(bookingData: {
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
    userId: string
  }): Promise<Booking> {
    try {
      // Generate booking reference
      const bookingReference = 'FB' + Math.random().toString(36).substr(2, 6).toUpperCase()

      const bookingRef = await addDoc(collection(db, 'bookings'), {
        userId: bookingData.userId,
        flightId: bookingData.flightId,
        flightNumber: bookingData.flightNumber,
        departureCity: bookingData.departureCity,
        arrivalCity: bookingData.arrivalCity,
        departureTime: bookingData.departureTime,
        arrivalTime: bookingData.arrivalTime,
        departureDate: bookingData.departureDate,
        returnDate: bookingData.returnDate,
        seats: bookingData.seats,
        passengers: bookingData.passengers,
        totalPrice: bookingData.totalPrice,
        bookingReference: bookingReference,
        status: 'confirmed',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      // Update flight available seats
      await this.updateFlightSeats(bookingData.flightId, bookingData.seats.length)

      // Return the created booking
      const bookingDoc = await getDoc(bookingRef)
      return {
        id: bookingDoc.id,
        ...bookingDoc.data(),
        createdAt: bookingDoc.data()?.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: bookingDoc.data()?.updatedAt?.toDate().toISOString() || new Date().toISOString()
      } as Booking
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  }

  // Get user's bookings
  static async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const bookings: Booking[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        bookings.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString()
        } as Booking)
      })
      
      return bookings
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      throw error
    }
  }

  // Get booking by reference
  static async getBookingByReference(bookingReference: string): Promise<Booking | null> {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('bookingReference', '==', bookingReference)
      )
      
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        return null
      }
      
      const doc = querySnapshot.docs[0]
      const data = doc.data()
      
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString()
      } as Booking
    } catch (error) {
      console.error('Error fetching booking:', error)
      throw error
    }
  }

  // Cancel a booking
  static async cancelBooking(bookingId: string): Promise<void> {
    try {
      const bookingRef = doc(db, 'bookings', bookingId)
      await updateDoc(bookingRef, {
        status: 'cancelled',
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error cancelling booking:', error)
      throw error
    }
  }

  // Update flight available seats
  private static async updateFlightSeats(flightId: string, seatsBooked: number): Promise<void> {
    try {
      const flightRef = doc(db, 'flights', flightId)
      const flightDoc = await getDoc(flightRef)
      
      if (flightDoc.exists()) {
        const currentSeats = flightDoc.data()?.availableSeats || 0
        const newSeats = Math.max(0, currentSeats - seatsBooked)
        
        await updateDoc(flightRef, {
          availableSeats: newSeats,
          updatedAt: serverTimestamp()
        })
      }
    } catch (error) {
      console.error('Error updating flight seats:', error)
    }
  }

  // Search flights
  static async searchFlights(searchParams: {
    departureCity: string
    arrivalCity: string
    departureDate: string
    passengers: number
  }): Promise<Flight[]> {
    try {
      const q = query(
        collection(db, 'flights'),
        where('departureCity', '==', searchParams.departureCity),
        where('arrivalCity', '==', searchParams.arrivalCity),
        where('departureDate', '==', searchParams.departureDate)
      )
      
      const querySnapshot = await getDocs(q)
      const flights: Flight[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        // Filter by available seats
        if (data.availableSeats >= searchParams.passengers) {
          flights.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString()
          } as Flight)
        }
      })
      
      // Sort by departure time
      flights.sort((a, b) => a.departureTime.localeCompare(b.departureTime))
      
      return flights
    } catch (error) {
      console.error('Error searching flights:', error)
      throw error
    }
  }

  // Get flight by ID
  static async getFlightById(flightId: string): Promise<Flight | null> {
    try {
      const flightDoc = await getDoc(doc(db, 'flights', flightId))
      
      if (!flightDoc.exists()) {
        return null
      }
      
      const data = flightDoc.data()
      return {
        id: flightDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString()
      } as Flight
    } catch (error) {
      console.error('Error fetching flight:', error)
      throw error
    }
  }

  // Subscribe to real-time booking updates
  static subscribeToBookings(userId: string, callback: (bookings: Booking[]) => void) {
    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    return onSnapshot(q, (querySnapshot) => {
      const bookings: Booking[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        bookings.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString()
        } as Booking)
      })
      
      callback(bookings)
    })
  }

  // Initialize sample flights data
  static async initializeSampleFlights(): Promise<void> {
    try {
      const flightsRef = collection(db, 'flights')
      const snapshot = await getDocs(flightsRef)
      
      // Only initialize if no flights exist
      if (snapshot.empty) {
        const sampleFlights = [
          {
            flightNumber: 'FB101',
            departureCity: 'New York',
            arrivalCity: 'Los Angeles',
            departureTime: '08:00',
            arrivalTime: '11:30',
            departureDate: '2024-12-15',
            price: 299,
            availableSeats: 150,
            totalSeats: 180,
            aircraftType: 'Boeing 737',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          },
          {
            flightNumber: 'FB102',
            departureCity: 'Los Angeles',
            arrivalCity: 'New York',
            departureTime: '14:00',
            arrivalTime: '21:30',
            departureDate: '2024-12-15',
            price: 299,
            availableSeats: 120,
            totalSeats: 180,
            aircraftType: 'Boeing 737',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          },
          {
            flightNumber: 'FB201',
            departureCity: 'Chicago',
            arrivalCity: 'Miami',
            departureTime: '09:30',
            arrivalTime: '13:45',
            departureDate: '2024-12-15',
            price: 199,
            availableSeats: 180,
            totalSeats: 180,
            aircraftType: 'Airbus A320',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          },
          {
            flightNumber: 'FB202',
            departureCity: 'Miami',
            arrivalCity: 'Chicago',
            departureTime: '16:15',
            arrivalTime: '20:30',
            departureDate: '2024-12-15',
            price: 199,
            availableSeats: 160,
            totalSeats: 180,
            aircraftType: 'Airbus A320',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          },
          {
            flightNumber: 'FB301',
            departureCity: 'Seattle',
            arrivalCity: 'Denver',
            departureTime: '07:45',
            arrivalTime: '10:15',
            departureDate: '2024-12-15',
            price: 149,
            availableSeats: 140,
            totalSeats: 180,
            aircraftType: 'Boeing 737',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          },
          {
            flightNumber: 'FB302',
            departureCity: 'Denver',
            arrivalCity: 'Seattle',
            departureTime: '18:30',
            arrivalTime: '21:00',
            departureDate: '2024-12-15',
            price: 149,
            availableSeats: 170,
            totalSeats: 180,
            aircraftType: 'Boeing 737',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          },
          {
            flightNumber: 'FB401',
            departureCity: 'Boston',
            arrivalCity: 'San Francisco',
            departureTime: '10:00',
            arrivalTime: '13:30',
            departureDate: '2024-12-15',
            price: 399,
            availableSeats: 100,
            totalSeats: 180,
            aircraftType: 'Boeing 777',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          },
          {
            flightNumber: 'FB402',
            departureCity: 'San Francisco',
            arrivalCity: 'Boston',
            departureTime: '15:45',
            arrivalTime: '23:15',
            departureDate: '2024-12-15',
            price: 399,
            availableSeats: 110,
            totalSeats: 180,
            aircraftType: 'Boeing 777',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          }
        ]

        // Add all sample flights
        for (const flight of sampleFlights) {
          await addDoc(flightsRef, flight)
        }
        
        console.log('Sample flights initialized successfully')
      }
    } catch (error) {
      console.error('Error initializing sample flights:', error)
    }
  }
}
