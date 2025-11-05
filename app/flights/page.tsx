"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SeatSelectionModal } from "@/components/seat-selection-modal"
import { Plane, Clock, ArrowRight, Star, Shield, Wifi, Utensils, ArrowLeft, Search, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { StaggerContainer, StaggerItem } from "@/components/animations"

interface Flight {
  id: string
  airline: string
  flightNumber: string
  departure: string
  arrival: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  stops: number
  amenities: string[]
  rating: number
  availableSeats: number
  aircraft: string
}

// Indian Airlines
const INDIAN_AIRLINES = [
  { name: "IndiGo", code: "6E" },
  { name: "Air India", code: "AI" },
  { name: "SpiceJet", code: "SG" },
  { name: "Vistara", code: "UK" },
  { name: "GoAir", code: "G8" },
  { name: "AirAsia India", code: "I5" },
  { name: "Alliance Air", code: "9I" }
]

export default function FlightsPage() {
  const router = useRouter()
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [showSeatModal, setShowSeatModal] = useState(false)
  const [passengers] = useState(1)
  const [sortBy, setSortBy] = useState("price")
  const [searchParams, setSearchParams] = useState<any>(null)
  const [flights, setFlights] = useState<Flight[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Generate realistic flight data based on search parameters
  const generateFlights = (params: any) => {
    const flightList: Flight[] = []
    const basePrice = Math.floor(Math.random() * 8000) + 3000 // ₹3000-11000
    
    for (let i = 0; i < 8; i++) {
      const airline = INDIAN_AIRLINES[Math.floor(Math.random() * INDIAN_AIRLINES.length)]
      const departureHour = Math.floor(Math.random() * 20) + 6 // 6 AM to 2 AM next day
      const departureMinute = Math.floor(Math.random() * 4) * 15 // 0, 15, 30, 45
      const durationMinutes = Math.floor(Math.random() * 180) + 60 // 1-4 hours
      
      const departureTime = `${departureHour.toString().padStart(2, '0')}:${departureMinute.toString().padStart(2, '0')}`
      const arrivalTime = new Date(2024, 11, 15, departureHour, departureMinute + durationMinutes)
      const arrivalTimeStr = `${arrivalTime.getHours().toString().padStart(2, '0')}:${arrivalTime.getMinutes().toString().padStart(2, '0')}`
      
      const duration = `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
      
      flightList.push({
        id: `${i + 1}`,
        airline: airline.name,
        flightNumber: `${airline.code}${Math.floor(Math.random() * 9000) + 1000}`,
        departure: params.from,
        arrival: params.to,
        departureTime,
        arrivalTime: arrivalTimeStr,
        duration,
        price: basePrice + (i * 500), // Varying prices
        stops: 0, // All direct flights
        amenities: ["WiFi", "Meals", "Entertainment", "Priority"].slice(0, Math.floor(Math.random() * 4) + 1),
        rating: 4.2 + Math.random() * 0.7,
        availableSeats: Math.floor(Math.random() * 50) + 10,
        aircraft: ["Boeing 737", "Airbus A320", "Boeing 787", "Airbus A321"][Math.floor(Math.random() * 4)]
      })
    }
    
    return flightList.sort((a, b) => a.price - b.price)
  }

  useEffect(() => {
    // Get search parameters from localStorage
    const savedParams = localStorage.getItem("searchParams")
    if (savedParams) {
      const params = JSON.parse(savedParams)
      setSearchParams(params)
      
      // Simulate API call delay
      setTimeout(() => {
        const generatedFlights = generateFlights(params)
        setFlights(generatedFlights)
        setIsLoading(false)
      }, 1500)
    } else {
      // Redirect to home if no search params
      router.push("/")
    }
  }, [router])

  const handleSelectSeats = (flight: Flight) => {
    setSelectedFlight(flight)
    setShowSeatModal(true)
  }

  const handleConfirmSeats = (selectedSeats: string[]) => {
    console.log("Confirmed seats:", selectedSeats)
    router.push("/checkout")
  }

  const sortedFlights = [...flights].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price
      case "duration":
        return a.duration.localeCompare(b.duration)
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative">
        {/* Beautiful Flight Wallpaper Background */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')"
        }}></div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/80 to-indigo-900/80"></div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <Plane className="w-16 h-16 text-blue-400 mx-auto mb-6 animate-bounce" />
              <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Searching for flights...</h2>
            <p className="text-white/80">Finding the best options for your journey</p>
          </div>
        </div>
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
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Available Flights</h1>
              {searchParams && (
                <p className="text-white/80 flex items-center justify-center gap-2 mt-1">
                  <MapPin className="w-4 h-4" />
                  {searchParams.from} → {searchParams.to}
                </p>
              )}
            </div>
            <div></div>
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center gap-4">
            <span className="text-white/80 text-sm">Sort by:</span>
            <div className="flex gap-2">
              {[
                { value: "price", label: "Price" },
                { value: "duration", label: "Duration" },
                { value: "rating", label: "Rating" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    sortBy === option.value
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-white/80 hover:bg-white/15"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Flights List */}
      <section className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <StaggerContainer className="space-y-6">
          {sortedFlights.map((flight, index) => (
            <StaggerItem key={flight.id}>
              <motion.div
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card 
                  className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 rounded-3xl group"
                >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
                {/* Flight Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Plane className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{flight.airline}</p>
                    <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{flight.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{flight.aircraft}</p>
                  </div>
                </div>

                {/* Times and Duration */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{flight.departureTime}</p>
                    <p className="text-sm text-gray-600">{flight.departure}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Plane className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">{flight.duration}</p>
                      <p className="text-xs text-gray-500">
                        {flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{flight.arrivalTime}</p>
                    <p className="text-sm text-gray-600">{flight.arrival}</p>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2">
                  {flight.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1"
                    >
                      {amenity === "WiFi" && <Wifi className="w-3 h-3" />}
                      {amenity === "Meals" && <Utensils className="w-3 h-3" />}
                      {amenity === "Entertainment" && <Star className="w-3 h-3" />}
                      {amenity === "Priority" && <Shield className="w-3 h-3" />}
                      {amenity}
                    </span>
                  ))}
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {flight.availableSeats} seats left
                  </span>
                </div>

                {/* Price and Action */}
                <div className="text-center">
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    ₹{flight.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">per passenger</p>
                  <Button 
                    onClick={() => handleSelectSeats(flight)} 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Select Seats
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* No Flights Message */}
        {flights.length === 0 && (
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl p-12 text-center rounded-3xl">
            <Plane className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Flights Found</h3>
            <p className="text-gray-600 mb-6">We couldn't find any flights matching your criteria.</p>
            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Modify Search
            </Button>
          </Card>
        )}
      </section>

      {/* Seat Selection Modal */}
      {selectedFlight && (
        <SeatSelectionModal
          isOpen={showSeatModal}
          onClose={() => setShowSeatModal(false)}
          onConfirm={handleConfirmSeats}
          flightNumber={selectedFlight.flightNumber}
          passengers={passengers}
        />
      )}
    </main>
  )
}