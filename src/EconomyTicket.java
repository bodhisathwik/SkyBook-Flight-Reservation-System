public class EconomyTicket extends Ticket {
    private static final double ECONOMY_MULTIPLIER = 1.0;

    public EconomyTicket(String ticketId, Passenger passenger, Flight flight, Seat seat, double basePrice) {
        super(ticketId, passenger, flight, seat, basePrice);
    }

    @Override
    public double calculatePrice() {
        return getBasePrice() * ECONOMY_MULTIPLIER;
    }

    @Override
    public String getTicketType() {
        return "Economy";
    }
}
