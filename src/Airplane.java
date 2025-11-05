import java.util.ArrayList;
import java.util.List;

public class Airplane {
    private String airplaneId;
    private String model;
    private List<Seat> seats;

    public Airplane(String airplaneId, String model, int economySeats, int businessSeats, int firstClassSeats) {
        this.airplaneId = airplaneId;
        this.model = model;
        this.seats = new ArrayList<>();
        initializeSeats(economySeats, businessSeats, firstClassSeats);
    }

    private void initializeSeats(int economySeats, int businessSeats, int firstClassSeats) {
        int seatNumber = 1;
        
        // Add Economy seats
        for (int i = 0; i < economySeats; i++) {
            seats.add(new Seat(seatNumber++, "Economy"));
        }
        
        // Add Business seats
        for (int i = 0; i < businessSeats; i++) {
            seats.add(new Seat(seatNumber++, "Business"));
        }
        
        // Add First Class seats
        for (int i = 0; i < firstClassSeats; i++) {
            seats.add(new Seat(seatNumber++, "FirstClass"));
        }
    }

    public String getAirplaneId() {
        return airplaneId;
    }

    public String getModel() {
        return model;
    }

    public List<Seat> getSeats() {
        return seats;
    }

    public Seat getSeatByNumber(int seatNumber) {
        for (Seat seat : seats) {
            if (seat.getSeatNumber() == seatNumber) {
                return seat;
            }
        }
        return null;
    }

    public List<Seat> getAvailableSeats(String seatClass) {
        List<Seat> availableSeats = new ArrayList<>();
        for (Seat seat : seats) {
            if (seat.getSeatClass().equals(seatClass) && !seat.isBooked()) {
                availableSeats.add(seat);
            }
        }
        return availableSeats;
    }

    public void displaySeatMap() {
        System.out.println("\n=== Seat Map for " + model + " ===");
        for (Seat seat : seats) {
            System.out.println(seat);
        }
    }
}
