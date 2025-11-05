"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface Seat {
  id: string
  row: number
  column: string
  available: boolean
  selected: boolean
  type: "economy" | "business"
}

interface SeatSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedSeats: string[]) => void
  flightNumber: string
  passengers: number
}

export function SeatSelectionModal({ isOpen, onClose, onConfirm, flightNumber, passengers }: SeatSelectionModalProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  // Generate seat map
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = []
    const columns = ["A", "B", "C", "D", "E", "F"]
    const rows = 12

    for (let row = 1; row <= rows; row++) {
      for (const col of columns) {
        const seatId = `${row}${col}`
        const isAvailable = Math.random() > 0.2 // 80% available
        const type = row <= 3 ? "business" : "economy"

        seats.push({
          id: seatId,
          row,
          column: col,
          available: isAvailable,
          selected: false,
          type,
        })
      }
    }

    return seats
  }

  const [seats, setSeats] = useState<Seat[]>(generateSeats())

  const handleSeatClick = (seatId: string) => {
    const seat = seats.find((s) => s.id === seatId)
    if (!seat || !seat.available) return

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId))
      setSeats(seats.map((s) => (s.id === seatId ? { ...s, selected: false } : s)))
    } else if (selectedSeats.length < passengers) {
      setSelectedSeats([...selectedSeats, seatId])
      setSeats(seats.map((s) => (s.id === seatId ? { ...s, selected: true } : s)))
    }
  }

  const handleConfirm = () => {
    if (selectedSeats.length === passengers) {
      onConfirm(selectedSeats)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Select Your Seats</h2>
            <p className="text-gray-600">Flight {flightNumber}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Legend */}
          <div className="flex gap-8 mb-8 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 border-2 border-blue-600 rounded"></div>
              <span className="text-sm text-gray-700">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 border-2 border-green-600 rounded"></div>
              <span className="text-sm text-gray-700">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 border-2 border-gray-400 rounded"></div>
              <span className="text-sm text-gray-700">Unavailable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-100 border-2 border-amber-600 rounded"></div>
              <span className="text-sm text-gray-700">Business</span>
            </div>
          </div>

          {/* Seat Selection Counter */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              Selected: <span className="font-bold text-blue-600">{selectedSeats.length}</span> /{" "}
              <span className="font-bold">{passengers}</span> seats
            </p>
          </div>

          {/* Seat Map */}
          <div className="flex justify-center mb-8 overflow-x-auto">
            <div className="inline-block">
              {/* Column Headers */}
              <div className="flex gap-2 mb-4 ml-12">
                {["A", "B", "C", "D", "E", "F"].map((col) => (
                  <div key={col} className="w-10 h-10 flex items-center justify-center font-bold text-gray-600">
                    {col}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {Array.from({ length: 12 }).map((_, rowIdx) => (
                <div key={rowIdx} className="flex gap-2 mb-2 items-center">
                  <div className="w-8 text-right font-bold text-gray-600">{rowIdx + 1}</div>
                  {seats
                    .filter((s) => s.row === rowIdx + 1)
                    .map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat.id)}
                        disabled={!seat.available}
                        className={`w-10 h-10 rounded border-2 transition-all ${
                          seat.selected
                            ? "bg-blue-100 border-blue-600"
                            : seat.available
                              ? seat.type === "business"
                                ? "bg-amber-100 border-amber-600 hover:bg-amber-200"
                                : "bg-green-100 border-green-600 hover:bg-green-200"
                              : "bg-gray-200 border-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {seat.selected && <span className="text-blue-600 font-bold">✓</span>}
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Seats Display */}
          {selectedSeats.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">Selected Seats:</p>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.sort().map((seatId) => (
                  <span key={seatId} className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full font-medium">
                    {seatId}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedSeats.length !== passengers}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Confirm Seats ({selectedSeats.length}/{passengers})
          </Button>
        </div>
      </Card>
    </div>
  )
}
