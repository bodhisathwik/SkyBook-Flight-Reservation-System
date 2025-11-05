public class FirstClassTicket extends Ticket {
    private static final double FIRST_CLASS_MULTIPLIER = 2.5;

    public FirstClassTicket(String ticketId, Passenger passenger, Flight flight, Seat seat, double basePrice) {
        super(ticketId, passenger, flight, seat, basePrice);
    }

    @Override
    public double calculatePrice() {
        return getBasePrice() * FIRST_CLASS_MULTIPLIER;
    }

    @Override
    public String getTicketType() {
        return "First Class";
    }
}
