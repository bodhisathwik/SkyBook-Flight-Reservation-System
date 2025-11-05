import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface BookingPDFData {
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

export class PDFGenerator {
  static async generateBookingPDF(booking: BookingPDFData): Promise<void> {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    
    // Colors
    const primaryColor = '#2563eb'
    const secondaryColor = '#7c3aed'
    const textColor = '#1f2937'
    const lightGray = '#f3f4f6'
    const darkGray = '#6b7280'
    
    // Header
    doc.setFillColor(primaryColor)
    doc.rect(0, 0, pageWidth, 30, 'F')
    
    // Logo/Title
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('SkyBook India', 20, 20)
    
    // Subtitle
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Flight Booking Confirmation', 20, 25)
    
    // Booking Reference Box
    doc.setFillColor(lightGray)
    doc.rect(pageWidth - 80, 5, 75, 20, 'F')
    doc.setTextColor(textColor)
    doc.setFontSize(10)
    doc.text('Booking Reference', pageWidth - 75, 12)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(booking.bookingRef, pageWidth - 75, 18)
    
    // Status Badge
    const statusColor = booking.status === 'confirmed' ? '#10b981' : 
                       booking.status === 'pending' ? '#f59e0b' : '#ef4444'
    doc.setFillColor(statusColor)
    doc.rect(pageWidth - 75, 20, 30, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text(booking.status.toUpperCase(), pageWidth - 70, 25)
    
    // Reset text color
    doc.setTextColor(textColor)
    
    // Flight Information Section
    let yPosition = 50
    
    // Section Header
    doc.setFillColor(secondaryColor)
    doc.rect(15, yPosition, pageWidth - 30, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Flight Information', 20, yPosition + 6)
    
    yPosition += 15
    
    // Flight Details
    doc.setTextColor(textColor)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    // Flight Number and Airline
    doc.text(`Flight Number: ${booking.flightNumber}`, 20, yPosition)
    doc.text(`Airline: ${booking.airline}`, 20, yPosition + 6)
    
    // Route Information
    yPosition += 20
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Route & Schedule', 20, yPosition)
    
    yPosition += 10
    
    // Departure
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Departure:', 20, yPosition)
    doc.text(booking.departure, 20, yPosition + 6)
    doc.text(`${booking.departureDate} at ${booking.departureTime}`, 20, yPosition + 12)
    
    // Arrival
    doc.text('Arrival:', pageWidth - 100, yPosition)
    doc.text(booking.arrival, pageWidth - 100, yPosition + 6)
    doc.text(booking.arrivalTime, pageWidth - 100, yPosition + 12)
    
    // Flight Path Line
    const midX = pageWidth / 2
    doc.setDrawColor(primaryColor)
    doc.setLineWidth(2)
    doc.line(20, yPosition + 8, midX - 20, yPosition + 8)
    doc.line(midX + 20, yPosition + 8, pageWidth - 100, yPosition + 8)
    
    // Plane icon (simple representation)
    doc.setFillColor(primaryColor)
    doc.circle(midX, yPosition + 8, 3, 'F')
    
    yPosition += 30
    
    // Passengers Section
    doc.setFillColor(secondaryColor)
    doc.rect(15, yPosition, pageWidth - 30, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Passenger Details', 20, yPosition + 6)
    
    yPosition += 15
    
    // Passenger List
    doc.setTextColor(textColor)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    booking.passengers.forEach((passenger, index) => {
      doc.text(`Passenger ${index + 1}: ${passenger}`, 20, yPosition)
      doc.text(`Seat: ${booking.seats[index]}`, pageWidth - 80, yPosition)
      yPosition += 8
    })
    
    yPosition += 10
    
    // Price Summary Section
    doc.setFillColor(lightGray)
    doc.rect(15, yPosition, pageWidth - 30, 8, 'F')
    doc.setTextColor(textColor)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Price Summary', 20, yPosition + 6)
    
    yPosition += 15
    
    // Price Details
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Base Fare:', 20, yPosition)
    doc.text(`₹${booking.totalPrice.toLocaleString()}`, pageWidth - 80, yPosition)
    
    yPosition += 8
    doc.text('Taxes & Fees:', 20, yPosition)
    doc.text('₹0', pageWidth - 80, yPosition)
    
    yPosition += 8
    doc.setDrawColor(darkGray)
    doc.line(20, yPosition, pageWidth - 80, yPosition)
    yPosition += 8
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Total Amount:', 20, yPosition)
    doc.text(`₹${booking.totalPrice.toLocaleString()}`, pageWidth - 80, yPosition)
    
    yPosition += 20
    
    // Important Information
    doc.setFillColor('#fef3c7')
    doc.rect(15, yPosition, pageWidth - 30, 25, 'F')
    doc.setTextColor('#92400e')
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Important Information', 20, yPosition + 8)
    
    doc.setFont('helvetica', 'normal')
    doc.text('• Please arrive at the airport at least 2 hours before departure', 20, yPosition + 15)
    doc.text('• Bring a valid government-issued photo ID', 20, yPosition + 22)
    doc.text('• Check-in online 24 hours before departure', 20, yPosition + 29)
    doc.text('• Keep this confirmation for your records', 20, yPosition + 36)
    
    yPosition += 40
    
    // Footer
    doc.setFillColor(darkGray)
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('SkyBook India - Your Journey, Our Priority', 20, pageHeight - 12)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 80, pageHeight - 12)
    
    // Save the PDF
    const fileName = `SkyBook_${booking.bookingRef}_${booking.departureDate}.pdf`
    doc.save(fileName)
  }
  
  static async generateBookingPDFFromElement(elementId: string, booking: BookingPDFData): Promise<void> {
    try {
      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error('Element not found')
      }
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      
      const imgWidth = pageWidth - 20
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      let heightLeft = imgHeight
      let position = 10
      
      doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10
        doc.addPage()
        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      const fileName = `SkyBook_${booking.bookingRef}_${booking.departureDate}.pdf`
      doc.save(fileName)
    } catch (error) {
      console.error('Error generating PDF from element:', error)
      // Fallback to programmatic PDF generation
      await this.generateBookingPDF(booking)
    }
  }
}
