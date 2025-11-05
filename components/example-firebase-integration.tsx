// Example: How to integrate Firebase booking service in your components
// This file shows how to update existing pages to use the real database

"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-context"
import { FirebaseBookingService } from "@/lib/firebase-booking-service"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import type { Flight, Booking } from "@/lib/firebase"

export function ExampleFirebaseIntegration() {
  const { user, isFirebaseReady } = useAuth()
  const [flights, setFlights] = useState<Flight[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Example: Search flights from database
  const searchFlights = async () => {
    if (!user || !isFirebaseReady) return

    setLoading(true)
    setError(null)

    try {
      const results = await FirebaseBookingService.searchFlights({
        departureCity: "New York",
        arrivalCity: "Los Angeles", 
        departureDate: "2024-12-15",
        passengers: 1
      })
      setFlights(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search flights')
    } finally {
      setLoading(false)
    }
  }

  // Example: Get user's bookings
  const fetchUserBookings = async () => {
    if (!user || !isFirebaseReady) return

    try {
      const userBookings = await FirebaseBookingService.getUserBookings(user.uid)
      setBookings(userBookings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings')
    }
  }

  // Example: Create a booking
  const createBooking = async (flight: Flight) => {
    if (!user || !isFirebaseReady) return

    setLoading(true)
    setError(null)

    try {
      const booking = await FirebaseBookingService.createBooking({
        flightId: flight.id,
        flightNumber: flight.flightNumber,
        departureCity: flight.departureCity,
        arrivalCity: flight.arrivalCity,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        departureDate: flight.departureDate,
        seats: ["12A"], // Selected seats
        passengers: ["John Doe"], // Passenger names
        totalPrice: flight.price,
        userId: user.uid
      })

      console.log('Booking created:', booking)
      // Refresh bookings list
      await fetchUserBookings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  // Example: Cancel a booking
  const cancelBooking = async (bookingId: string) => {
    try {
      await FirebaseBookingService.cancelBooking(bookingId)
      // Refresh bookings list
      await fetchUserBookings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking')
    }
  }

  // Example: Real-time subscription to booking updates
  useEffect(() => {
    if (!user || !isFirebaseReady) return

    const unsubscribe = FirebaseBookingService.subscribeToBookings(user.uid, (updatedBookings) => {
      setBookings(updatedBookings)
    })

    return () => {
      unsubscribe()
    }
  }, [user, isFirebaseReady])

  // Load user bookings on mount
  useEffect(() => {
    if (user && isFirebaseReady) {
      fetchUserBookings()
    }
  }, [user, isFirebaseReady])

  if (!user) {
    return <Alert>Please sign in to view flights and bookings</Alert>
  }

  if (!isFirebaseReady) {
    return <Alert>Firebase is not configured. Using mock data.</Alert>
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button onClick={searchFlights} disabled={loading}>
          Search Flights
        </Button>
        <Button onClick={fetchUserBookings} disabled={loading}>
          Refresh Bookings
        </Button>
        <Button 
          onClick={() => FirebaseBookingService.initializeSampleFlights()}
          disabled={loading}
          variant="outline"
        >
          Initialize Sample Flights
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      {/* Flights List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Flights</h2>
        {flights.map((flight) => (
          <Card key={flight.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{flight.flightNumber}</h3>
                <p>{flight.departureCity} → {flight.arrivalCity}</p>
                <p>{flight.departureTime} - {flight.arrivalTime}</p>
                <p>Available seats: {flight.availableSeats}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${flight.price}</p>
                <Button 
                  onClick={() => createBooking(flight)}
                  disabled={loading || flight.availableSeats < 1}
                >
                  Book Flight
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* User Bookings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Bookings</h2>
        {bookings.map((booking) => (
          <Card key={booking.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{booking.bookingReference}</h3>
                <p>{booking.flightNumber}: {booking.departureCity} → {booking.arrivalCity}</p>
                <p>Seats: {booking.seats.join(', ')}</p>
                <p>Passengers: {booking.passengers.join(', ')}</p>
                <p>Status: {booking.status}</p>
                <p>Total: ${booking.totalPrice}</p>
              </div>
              <div>
                {booking.status === 'confirmed' && (
                  <Button 
                    variant="destructive"
                    onClick={() => cancelBooking(booking.id)}
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Example: How to update your existing pages
// 1. Replace mock data with FirebaseBookingService calls
// 2. Add error handling
// 3. Add loading states
// 4. Use real-time subscriptions for live updates
// 5. Handle authentication properly
// 6. Check isFirebaseReady before making Firebase calls

export default ExampleFirebaseIntegration
