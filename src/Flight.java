import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Flight {
    private String flightNumber;
    private String origin;
    private String destination;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private Airplane airplane;
    private List<Ticket> bookedTickets;

    public Flight(String flightNumber, String origin, String destination, 
                  LocalDateTime departureTime, LocalDateTime arrivalTime, Airplane airplane) {
        this.flightNumber = flightNumber;
        this.origin = origin;
        this.destination = destination;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.airplane = airplane;
        this.bookedTickets = new ArrayList<>();
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public String getOrigin() {
        return origin;
    }

    public String getDestination() {
        return destination;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public LocalDateTime getArrivalTime() {
        return arrivalTime;
    }

    public Airplane getAirplane() {
        return airplane;
    }

    public List<Ticket> getBookedTickets() {
        return bookedTickets;
    }

    public void addBookedTicket(Ticket ticket) {
        bookedTickets.add(ticket);
    }

    public void removeBookedTicket(Ticket ticket) {
        bookedTickets.remove(ticket);
    }

    @Override
    public String toString() {
        return "Flight{" +
                "number='" + flightNumber + '\'' +
                ", from='" + origin + '\'' +
                ", to='" + destination + '\'' +
                ", departure=" + departureTime +
                ", arrival=" + arrivalTime +
                '}';
    }
}
