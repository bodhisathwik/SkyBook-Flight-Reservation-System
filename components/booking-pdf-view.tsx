"use client"

import { Plane, Users, Calendar, Clock, MapPin, Star } from "lucide-react"

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

interface BookingPDFViewProps {
  booking: Booking
}

export function BookingPDFView({ booking }: BookingPDFViewProps) {
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
    <div id="booking-pdf-content" className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">SkyBook India</h1>
            <p className="text-blue-100">Flight Booking Confirmation</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">Booking Reference</p>
            <p className="text-2xl font-bold">{booking.bookingRef}</p>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getStatusColor(booking.status)}`}>
              {getStatusBadge(booking.status)}
            </div>
          </div>
        </div>
      </div>

      {/* Flight Information */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Plane className="w-5 h-5 text-blue-600" />
          Flight Information
        </h2>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Flight Number</p>
              <p className="text-lg font-semibold text-gray-900">{booking.flightNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Airline</p>
              <p className="text-lg font-semibold text-gray-900">{booking.airline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Route & Schedule */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Route & Schedule</h2>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{booking.departureTime}</p>
              <p className="text-sm text-gray-600 mt-1">{booking.departure}</p>
              <p className="text-xs text-gray-500 mt-1">{booking.departureDate}</p>
            </div>
            
            <div className="flex-1 mx-8">
              <div className="flex items-center justify-center">
                <div className="flex-1 h-px bg-gray-300"></div>
                <div className="mx-4 p-2 bg-blue-100 rounded-full">
                  <Plane className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{booking.arrivalTime}</p>
              <p className="text-sm text-gray-600 mt-1">{booking.arrival}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Passenger Details */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Passenger Details
        </h2>
        
        <div className="space-y-3">
          {booking.passengers.map((passenger, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{passenger}</p>
                  <p className="text-sm text-gray-600">Passenger {index + 1}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Seat</p>
                <p className="font-bold text-blue-600 text-lg">{booking.seats[index]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Price Summary</h2>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Base Fare</p>
              <p className="font-semibold text-gray-900">₹{booking.totalPrice.toLocaleString()}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Taxes & Fees</p>
              <p className="font-semibold text-gray-900">₹0</p>
            </div>
            <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
              <p className="text-lg font-bold text-gray-900">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600">₹{booking.totalPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
        <h3 className="font-bold text-yellow-800 mb-3">Important Information</h3>
        <ul className="space-y-2 text-sm text-yellow-700">
          <li>• Please arrive at the airport at least 2 hours before departure</li>
          <li>• Bring a valid government-issued photo ID</li>
          <li>• Check-in online 24 hours before departure</li>
          <li>• Keep this confirmation for your records</li>
          <li>• Contact SkyBook support for any queries</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>SkyBook India - Your Journey, Our Priority</p>
        <p>Generated on: {new Date().toLocaleDateString()}</p>
        <p>For support, contact: support@skybook.com</p>
      </div>
    </div>
  )
}
