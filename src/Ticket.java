public abstract class Ticket {
    private String ticketId;
    private Passenger passenger;
    private Flight flight;
    private Seat seat;
    private double basePrice;
    private String status; // Booked, Cancelled

    public Ticket(String ticketId, Passenger passenger, Flight flight, Seat seat, double basePrice) {
        this.ticketId = ticketId;
        this.passenger = passenger;
        this.flight = flight;
        this.seat = seat;
        this.basePrice = basePrice;
        this.status = "Booked";
    }

    public String getTicketId() {
        return ticketId;
    }

    public Passenger getPassenger() {
        return passenger;
    }

    public Flight getFlight() {
        return flight;
    }

    public Seat getSeat() {
        return seat;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Abstract method for polymorphism
    public abstract double calculatePrice();

    public abstract String getTicketType();

    @Override
    public String toString() {
        return "Ticket{" +
                "id='" + ticketId + '\'' +
                ", type='" + getTicketType() + '\'' +
                ", passenger=" + passenger.getName() +
                ", flight=" + flight.getFlightNumber() +
                ", seat=" + seat.getSeatNumber() +
                ", price=$" + String.format("%.2f", calculatePrice()) +
                ", status='" + status + '\'' +
                '}';
    }
}
