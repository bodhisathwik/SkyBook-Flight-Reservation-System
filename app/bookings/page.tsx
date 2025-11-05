"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plane, Users, Download, X, ArrowRight, Calendar, Clock, MapPin, Star, Search, FileText } from "lucide-react"
import { PDFGenerator, type BookingPDFData } from "@/lib/pdf-generator"
import { BookingPDFView } from "@/components/booking-pdf-view"
import { motion, AnimatePresence } from "framer-motion"
import { StaggerContainer, StaggerItem, modalBackdrop, modalContent } from "@/components/animations"

interface Booking {
  id: string
  bookingRef: string
  flightNumber: string
  airline: string
  departure: string
  arrival: string
  departureDate: string
  departureTime: string
  arrivalTime: string
  passengers: string[]
  seats: string[]
  status: "confirmed" | "pending" | "cancelled"
  totalPrice: number
  bookingDate: string
  rating?: number
}

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "1",
      bookingRef: "SB123456",
      flightNumber: "SA101",
      airline: "SkyAir",
      departure: "Mumbai (BOM)",
      arrival: "Delhi (DEL)",
      departureDate: "2024-12-15",
      departureTime: "08:00 AM",
      arrivalTime: "11:30 AM",
      passengers: ["John Doe"],
      seats: ["12A"],
      status: "confirmed",
      totalPrice: 8500,
      bookingDate: "2024-10-17",
      rating: 4.8,
    },
    {
      id: "2",
      bookingRef: "SB789012",
      flightNumber: "CF202",
      airline: "CloudFly",
      departure: "Delhi (DEL)",
      arrival: "Bangalore (BLR)",
      departureDate: "2024-12-22",
      departureTime: "02:00 PM",
      arrivalTime: "05:45 PM",
      passengers: ["John Doe", "Jane Smith"],
      seats: ["5B", "5C"],
      status: "confirmed",
      totalPrice: 16900,
      bookingDate: "2024-10-16",
      rating: 4.6,
    },
  ])

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleCancelBooking = (bookingId: string) => {
    setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" as const } : b)))
    setShowDetails(false)
  }

  const handleDownloadPDF = async (booking: Booking) => {
    if (isGeneratingPDF) return
    
    setIsGeneratingPDF(true)
    try {
      const bookingData: BookingPDFData = {
        id: booking.id,
        bookingRef: booking.bookingRef,
        flightNumber: booking.flightNumber,
        airline: booking.airline,
        departure: booking.departure,
        arrival: booking.arrival,
        departureDate: booking.departureDate,
        departureTime: booking.departureTime,
        arrivalTime: booking.arrivalTime,
        passengers: booking.passengers,
        seats: booking.seats,
        status: booking.status,
        totalPrice: booking.totalPrice,
        bookingDate: booking.bookingDate,
        rating: booking.rating
      }
      
      await PDFGenerator.generateBookingPDF(bookingData)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return "✓ Confirmed"
      case "pending":
        return "⏳ Pending"
      case "cancelled":
        return "✕ Cancelled"
      default:
        return status
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative">
      {/* Beautiful Flight Wallpaper Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')"
      }}></div>
      
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">My Bookings</h1>
              <p className="text-white/80 mt-1">Manage and view all your flight reservations</p>
            </div>
            <Button
              onClick={() => router.push("/")}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <Search className="w-4 h-4 mr-2" />
              New Search
            </Button>
          </div>
        </div>
      </header>

      {/* Bookings List */}
      <section className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {bookings.length === 0 ? (
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl p-12 text-center rounded-3xl">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plane className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No bookings yet</h2>
            <p className="text-gray-600 mb-8 text-lg">Start your journey by booking a flight</p>
            <Button 
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl"
            >
              Search Flights
            </Button>
          </Card>
        ) : (
          <StaggerContainer className="space-y-6">
            {bookings.map((booking, index) => (
              <StaggerItem key={booking.id}>
                <motion.div
                  whileHover={{ 
                    y: -8,
                    scale: 1.02,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card
                    className={`bg-white/95 backdrop-blur-sm border-0 shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 cursor-pointer rounded-3xl group ${
                      booking.status === "cancelled" ? "opacity-60" : ""
                    }`}
                    onClick={() => {
                      setSelectedBooking(booking)
                      setShowDetails(true)
                    }}
                  >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                  {/* Booking Reference */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Plane className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
                      <p className="text-xl font-bold text-gray-900">{booking.bookingRef}</p>
                      <p className="text-xs text-gray-500 mt-1">{booking.bookingDate}</p>
                    </div>
                  </div>

                  {/* Flight Info */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Flight</p>
                    <p className="text-xl font-bold text-gray-900">{booking.flightNumber}</p>
                    <p className="text-sm text-gray-600">{booking.airline}</p>
                    {booking.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">{booking.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Route and Time */}
                  <div>
                    <p className="text-sm text-gray-600 mb-3">Route & Time</p>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{booking.departureTime}</p>
                        <p className="text-xs text-gray-600">{booking.departure}</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Plane className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{booking.arrivalTime}</p>
                        <p className="text-xs text-gray-600">{booking.arrival}</p>
                      </div>
                    </div>
                  </div>

                  {/* Passengers and Seats */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Passengers</p>
                    <p className="text-lg font-semibold text-gray-900">{booking.passengers.length}</p>
                    <p className="text-sm text-gray-600">Seats: {booking.seats.join(", ")}</p>
                  </div>

                  {/* Status and Price */}
                  <div className="text-right">
                    <div
                      className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 border ${getStatusColor(booking.status)}`}
                    >
                      {getStatusBadge(booking.status)}
                    </div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{booking.totalPrice.toLocaleString()}
                    </p>
                    <ArrowRight className="w-5 h-5 text-gray-400 mt-2 ml-auto group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {showDetails && selectedBooking && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            variants={modalBackdrop}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              variants={modalContent}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl w-full max-w-4xl rounded-3xl">
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900">Booking Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Booking Reference */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Booking Reference</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedBooking.bookingRef}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Status</p>
                  <div
                    className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(selectedBooking.status)}`}
                  >
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                </div>
              </div>

              {/* Flight Details */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-6 text-xl flex items-center gap-3">
                  <Plane className="w-6 h-6 text-blue-600" />
                  Flight Information
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Flight Number</p>
                    <p className="font-semibold text-gray-900 text-lg">{selectedBooking.flightNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Airline</p>
                    <p className="font-semibold text-gray-900 text-lg">{selectedBooking.airline}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Departure
                    </p>
                    <p className="font-semibold text-gray-900">{selectedBooking.departure}</p>
                    <p className="text-sm text-gray-600">
                      {selectedBooking.departureDate} at {selectedBooking.departureTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Arrival
                    </p>
                    <p className="font-semibold text-gray-900">{selectedBooking.arrival}</p>
                    <p className="text-sm text-gray-600">{selectedBooking.arrivalTime}</p>
                  </div>
                </div>
              </div>

              {/* Passengers */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  Passengers
                </h3>
                <div className="space-y-3">
                  {selectedBooking.passengers.map((passenger, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{passenger}</p>
                        <p className="text-sm text-gray-600">Seat: {selectedBooking.seats[idx]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 text-xl">Price Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-semibold text-gray-900">₹{selectedBooking.totalPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">Taxes & Fees</p>
                    <p className="font-semibold text-gray-900">₹0</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <p className="font-bold text-gray-900 text-lg">Total</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{selectedBooking.totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-4 p-8 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
              <Button 
                variant="outline" 
                onClick={() => setShowDetails(false)} 
                className="flex-1 bg-white border-gray-200 hover:bg-gray-50"
              >
                Close
              </Button>
              {selectedBooking.status === "confirmed" && (
                <>
                  <Button 
                    onClick={() => handleDownloadPDF(selectedBooking)}
                    disabled={isGeneratingPDF}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        Download PDF
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleCancelBooking(selectedBooking.id)}
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Cancel Booking
                  </Button>
                </>
              )}
            </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}