public class BusinessTicket extends Ticket {
    private static final double BUSINESS_MULTIPLIER = 1.5;

    public BusinessTicket(String ticketId, Passenger passenger, Flight flight, Seat seat, double basePrice) {
        super(ticketId, passenger, flight, seat, basePrice);
    }

    @Override
    public double calculatePrice() {
        return getBasePrice() * BUSINESS_MULTIPLIER;
    }

    @Override
    public String getTicketType() {
        return "Business";
    }
}
