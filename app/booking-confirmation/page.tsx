"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Download, Home, Plane, Calendar, Clock, MapPin, User, Mail, Sparkles, ArrowRight, FileText } from "lucide-react"
import Link from "next/link"
import { PDFGenerator, type BookingPDFData } from "@/lib/pdf-generator"

export default function BookingConfirmationPage() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  // Mock booking data for PDF generation
  const bookingData: BookingPDFData = {
    id: "1",
    bookingRef: "SB123456",
    flightNumber: "6E101",
    airline: "IndiGo",
    departure: "Mumbai (BOM)",
    arrival: "Delhi (DEL)",
    departureDate: "2024-12-15",
    departureTime: "08:00 AM",
    arrivalTime: "11:30 AM",
    passengers: ["John Doe"],
    seats: ["12A"],
    status: "confirmed",
    totalPrice: 9700,
    bookingDate: "2024-10-17"
  }

  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return
    
    setIsGeneratingPDF(true)
    try {
      await PDFGenerator.generateBookingPDF(bookingData)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Beautiful Flight Wallpaper Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')"
      }}></div>
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Booking Confirmed!</h1>
            <p className="text-white/80 text-lg">Your journey is ready to begin</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        {/* Success Message */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl p-8 text-center mb-8 rounded-3xl">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <Sparkles className="w-6 h-6 text-yellow-400 absolute top-0 right-1/2 transform translate-x-4 animate-pulse" />
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your flight has been booked successfully. A confirmation email has been sent to your inbox with all the details.
          </p>

          {/* Booking Reference */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl mb-8 border-2 border-blue-200">
            <p className="text-sm text-gray-600 mb-3 font-medium">Booking Reference</p>
            <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SB123456
            </p>
            <p className="text-sm text-gray-500 mt-2">Keep this reference for your records</p>
          </div>

          {/* Flight Details */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl mb-8 text-left border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-6 text-xl flex items-center gap-3">
              <Plane className="w-6 h-6 text-blue-600" />
              Flight Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Plane className="w-4 h-4" />
                    Flight Number:
                  </span>
                  <span className="font-semibold text-gray-900">6E101</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Plane className="w-4 h-4" />
                    Airline:
                  </span>
                  <span className="font-semibold text-gray-900">IndiGo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Route:
                  </span>
                    <span className="font-semibold text-gray-900">BOM → DEL</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date:
                  </span>
                  <span className="font-semibold text-gray-900">Dec 15, 2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Departure:
                  </span>
                  <span className="font-semibold text-gray-900">08:00 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Arrival:
                  </span>
                  <span className="font-semibold text-gray-900">11:30 AM</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Seat:</span>
                <span className="font-semibold text-gray-900 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">12A</span>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-gray-600 text-lg">Total Amount:</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ₹9,700
                    </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating PDF...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Download PDF Ticket
                </>
              )}
            </Button>
            <Link href="/bookings" className="flex-1">
              <Button variant="outline" className="w-full border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3">
                View My Bookings
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* What's Next */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl p-8 rounded-3xl">
          <h3 className="font-bold text-gray-900 mb-6 text-xl flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            What's Next?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ul className="space-y-4">
              <li className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email Confirmation</p>
                  <p className="text-sm text-gray-600">Check your email for booking confirmation and ticket details</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Airport Arrival</p>
                  <p className="text-sm text-gray-600">Arrive at the airport at least 2 hours before departure</p>
                </div>
              </li>
            </ul>
            <ul className="space-y-4">
              <li className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Check-in Ready</p>
                  <p className="text-sm text-gray-600">Have your booking reference and ID ready at check-in</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Manage Booking</p>
                  <p className="text-sm text-gray-600">Access your booking anytime from your account dashboard</p>
                </div>
              </li>
            </ul>
          </div>
        </Card>

        {/* Home Button */}
        <div className="text-center mt-8">
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto">
              <Home className="w-5 h-5" />
              Back to Home
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}