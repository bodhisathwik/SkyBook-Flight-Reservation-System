"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/components/auth-context"
import { Lock, CreditCard, Shield, ArrowLeft, CheckCircle, Plane } from "lucide-react"

interface BookingSummary {
  flightNumber: string
  airline: string
  departure: string
  arrival: string
  departureDate: string
  departureTime: string
  passengers: number
  seats: string[]
  basePrice: number
  taxes: number
  total: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  // Mock booking summary
  const booking: BookingSummary = {
    flightNumber: "6E101",
    airline: "IndiGo",
    departure: "Mumbai (BOM)",
    arrival: "Delhi (DEL)",
    departureDate: "2024-12-15",
    departureTime: "08:00 AM",
    passengers: 1,
    seats: ["12A"],
    basePrice: 8500,
    taxes: 1200,
    total: 9700,
  }

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
    } else if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d{0,2})/, "$1/$2")
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3)
    }

    setCardData((prev) => ({ ...prev, [name]: formattedValue }))
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to confirmation
    router.push("/booking-confirmation")
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl p-8 text-center max-w-md rounded-3xl">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to complete your booking</p>
          <Button 
            onClick={() => router.push("/auth/sign-in")} 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl"
          >
            Sign In
          </Button>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative">
      {/* Beautiful Flight Wallpaper Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')"
      }}></div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/80 to-indigo-900/80"></div>
      
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">Secure Checkout</h1>
              <p className="text-white/80 mt-1">Complete your flight booking</p>
            </div>
            <div></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl p-8 mb-6 rounded-3xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-500" />
                Payment Method
              </h2>

              {/* Payment Method Selection */}
              <div className="space-y-4 mb-8">
                <label className="flex items-center p-6 border-2 border-blue-500 rounded-2xl cursor-pointer bg-gradient-to-r from-blue-50 to-purple-50 transition-all duration-300 hover:shadow-lg">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <CreditCard className="w-6 h-6 text-blue-600 ml-4 mr-4" />
                  <span className="font-semibold text-gray-900 text-lg">Credit/Debit Card</span>
                </label>

                <label className="flex items-center p-6 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                  <input
                    type="radio"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5"
                  />
                  <div className="w-6 h-6 bg-blue-600 rounded ml-4 mr-4 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">P</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-lg ml-3">PayPal</span>
                </label>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === "card" && (
                <form onSubmit={handlePayment} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      value={cardData.cardName}
                      onChange={handleCardChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900 transition-all duration-300 hover:border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900 transition-all duration-300 hover:border-gray-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={cardData.expiryDate}
                        onChange={handleCardChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900 transition-all duration-300 hover:border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={cardData.cvv}
                        onChange={handleCardChange}
                        placeholder="123"
                        maxLength="3"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900 transition-all duration-300 hover:border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-6 bg-green-50 border border-green-200 rounded-2xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-green-700">Secure Payment</p>
                      <p className="text-xs text-green-600">Your payment is encrypted and secure</p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Complete Payment - ₹{booking.total.toLocaleString()}
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* PayPal Payment */}
              {paymentMethod === "paypal" && (
                <div className="space-y-6">
                  <div className="p-8 bg-blue-50 border-2 border-blue-200 rounded-2xl text-center">
                    <p className="text-gray-700 mb-6 text-lg">You will be redirected to PayPal to complete your payment</p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl">
                      Pay with PayPal - ₹{booking.total.toLocaleString()}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl p-8 sticky top-4 rounded-3xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Order Summary</h2>

              {/* Flight Details */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Plane className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Flight</p>
                    <p className="font-bold text-gray-900 text-lg">{booking.flightNumber}</p>
                    <p className="text-sm text-gray-600">{booking.airline}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Departure:</span>
                    <span className="font-semibold text-gray-900">{booking.departureTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Route:</span>
                    <span className="font-semibold text-gray-900">
                      {booking.departure} → {booking.arrival}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passengers:</span>
                    <span className="font-semibold text-gray-900">{booking.passengers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seats:</span>
                    <span className="font-semibold text-gray-900">{booking.seats.join(", ")}</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price</span>
                  <span className="font-semibold text-gray-900">₹{booking.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-semibold text-gray-900">₹{booking.taxes.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="font-bold text-gray-900 text-lg">Total</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ₹{booking.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Passenger Info */}
              <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl">
                <p className="text-sm font-semibold text-gray-700 mb-3">Booking for:</p>
                <p className="text-sm text-gray-900 font-medium">{user?.displayName || user?.email}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}