public class Seat {
    private int seatNumber;
    private String seatClass; // Economy, Business, FirstClass
    private boolean isBooked;

    public Seat(int seatNumber, String seatClass) {
        this.seatNumber = seatNumber;
        this.seatClass = seatClass;
        this.isBooked = false;
    }

    public int getSeatNumber() {
        return seatNumber;
    }

    public String getSeatClass() {
        return seatClass;
    }

    public boolean isBooked() {
        return isBooked;
    }

    public void bookSeat() {
        this.isBooked = true;
    }

    public void cancelSeat() {
        this.isBooked = false;
    }

    @Override
    public String toString() {
        return "Seat " + seatNumber + " (" + seatClass + ") - " + (isBooked ? "Booked" : "Available");
    }
}
