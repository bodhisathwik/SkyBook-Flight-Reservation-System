import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class ReservationSystem {
    private List<Flight> flights;
    private List<Ticket> allTickets;
    private int ticketCounter;
    private int passengerCounter;

    public ReservationSystem() {
        this.flights = new ArrayList<>();
        this.allTickets = new ArrayList<>();
        this.ticketCounter = 1000;
        this.passengerCounter = 1;
        initializeFlights();
    }

    private void initializeFlights() {
        // Create airplanes
        Airplane airplane1 = new Airplane("A001", "Boeing 737", 100, 30, 10);
        Airplane airplane2 = new Airplane("A002", "Airbus A380", 150, 50, 20);

        // Create flights
        Flight flight1 = new Flight("AA101", "New York", "Los Angeles", 
                LocalDateTime.of(2024, 12, 15, 8, 0), 
                LocalDateTime.of(2024, 12, 15, 11, 30), airplane1);
        
        Flight flight2 = new Flight("UA202", "Chicago", "Miami", 
                LocalDateTime.of(2024, 12, 16, 14, 0), 
                LocalDateTime.of(2024, 12, 16, 17, 45), airplane2);

        flights.add(flight1);
        flights.add(flight2);
    }

    public void displayFlights() {
        System.out.println("\n=== Available Flights ===");
        for (int i = 0; i < flights.size(); i++) {
            System.out.println((i + 1) + ". " + flights.get(i));
        }
    }

    public Flight selectFlight(int flightIndex) {
        if (flightIndex > 0 && flightIndex <= flights.size()) {
            return flights.get(flightIndex - 1);
        }
        return null;
    }

    public void displayAvailableSeats(Flight flight, String seatClass) {
        List<Seat> availableSeats = flight.getAirplane().getAvailableSeats(seatClass);
        System.out.println("\n=== Available " + seatClass + " Seats ===");
        if (availableSeats.isEmpty()) {
            System.out.println("No available seats in " + seatClass + " class.");
        } else {
            for (Seat seat : availableSeats) {
                System.out.println("Seat " + seat.getSeatNumber());
            }
        }
    }

    public Ticket bookTicket(Flight flight, String seatClass, String passengerName, String email) {
        List<Seat> availableSeats = flight.getAirplane().getAvailableSeats(seatClass);
        
        if (availableSeats.isEmpty()) {
            System.out.println("No available seats in " + seatClass + " class.");
            return null;
        }

        // Book the first available seat
        Seat selectedSeat = availableSeats.get(0);
        selectedSeat.bookSeat();

        // Create passenger
        Passenger passenger = new Passenger("P" + passengerCounter++, passengerName, email);

        // Create ticket based on class
        Ticket ticket = null;
        String ticketId = "T" + ticketCounter++;
        double basePrice = 200.0; // Base price for all tickets

        switch (seatClass) {
            case "Economy":
                ticket = new EconomyTicket(ticketId, passenger, flight, selectedSeat, basePrice);
                break;
            case "Business":
                ticket = new BusinessTicket(ticketId, passenger, flight, selectedSeat, basePrice);
                break;
            case "FirstClass":
                ticket = new FirstClassTicket(ticketId, passenger, flight, selectedSeat, basePrice);
                break;
            default:
                System.out.println("Invalid seat class.");
                return null;
        }

        flight.addBookedTicket(ticket);
        allTickets.add(ticket);

        System.out.println("\n✓ Booking Successful!");
        System.out.println(ticket);
        return ticket;
    }

    public void cancelTicket(Ticket ticket) {
        if (ticket != null && ticket.getStatus().equals("Booked")) {
            ticket.setStatus("Cancelled");
            ticket.getSeat().cancelSeat();
            ticket.getFlight().removeBookedTicket(ticket);
            System.out.println("\n✓ Ticket " + ticket.getTicketId() + " cancelled successfully.");
            System.out.println("Seat " + ticket.getSeat().getSeatNumber() + " is now available.");
        } else {
            System.out.println("Cannot cancel this ticket.");
        }
    }

    public void displayAllBookings() {
        System.out.println("\n=== All Current Bookings ===");
        if (allTickets.isEmpty()) {
            System.out.println("No bookings yet.");
        } else {
            for (Ticket ticket : allTickets) {
                if (ticket.getStatus().equals("Booked")) {
                    System.out.println(ticket);
                }
            }
        }
    }

    public void runInteractiveMode() {
        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        while (running) {
            System.out.println("\n=== Airline Reservation System ===");
            System.out.println("1. View Flights");
            System.out.println("2. Book a Ticket");
            System.out.println("3. View My Bookings");
            System.out.println("4. Cancel a Booking");
            System.out.println("5. Exit");
            System.out.print("Select an option: ");

            int choice = scanner.nextInt();
            scanner.nextLine(); // Consume newline

            switch (choice) {
                case 1:
                    displayFlights();
                    break;
                case 2:
                    displayFlights();
                    System.out.print("Select flight number: ");
                    int flightChoice = scanner.nextInt();
                    scanner.nextLine();
                    
                    Flight selectedFlight = selectFlight(flightChoice);
                    if (selectedFlight != null) {
                        System.out.println("Select seat class (Economy/Business/FirstClass): ");
                        String seatClass = scanner.nextLine();
                        displayAvailableSeats(selectedFlight, seatClass);
                        
                        System.out.print("Enter passenger name: ");
                        String name = scanner.nextLine();
                        System.out.print("Enter email: ");
                        String email = scanner.nextLine();
                        
                        bookTicket(selectedFlight, seatClass, name, email);
                    }
                    break;
                case 3:
                    displayAllBookings();
                    break;
                case 4:
                    displayAllBookings();
                    System.out.print("Enter ticket ID to cancel: ");
                    String ticketId = scanner.nextLine();
                    Ticket ticketToCancel = null;
                    for (Ticket t : allTickets) {
                        if (t.getTicketId().equals(ticketId)) {
                            ticketToCancel = t;
                            break;
                        }
                    }
                    cancelTicket(ticketToCancel);
                    break;
                case 5:
                    running = false;
                    System.out.println("Thank you for using Airline Reservation System!");
                    break;
                default:
                    System.out.println("Invalid option. Please try again.");
            }
        }
        scanner.close();
    }

    public static void main(String[] args) {
        ReservationSystem system = new ReservationSystem();
        
        // Demonstrate the system
        System.out.println("=== Airline Reservation System Demo ===\n");
        
        // Display flights
        system.displayFlights();
        
        // Book some tickets
        Flight flight1 = system.selectFlight(1);
        system.displayAvailableSeats(flight1, "Economy");
        system.bookTicket(flight1, "Economy", "John Doe", "john@example.com");
        
        system.displayAvailableSeats(flight1, "Business");
        system.bookTicket(flight1, "Business", "Jane Smith", "jane@example.com");
        
        system.displayAvailableSeats(flight1, "FirstClass");
        system.bookTicket(flight1, "FirstClass", "Bob Johnson", "bob@example.com");
        
        // Display all bookings
        system.displayAllBookings();
        
        // Display seat map
        flight1.getAirplane().displaySeatMap();
        
        // Cancel a booking
        if (!system.allTickets.isEmpty()) {
            system.cancelTicket(system.allTickets.get(0));
        }
        
        // Display updated bookings
        system.displayAllBookings();
        
        // Run interactive mode
        system.runInteractiveMode();
    }
}
