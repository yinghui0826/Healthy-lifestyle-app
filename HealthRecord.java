/**
 * Base class representing a generic health record.
 * Demonstrates encapsulation (private fields + getters/setters)
 * and is designed for inheritance by specific record types.
 */
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public abstract class HealthRecord {
    // Encapsulated state
    private LocalDate date;
    private String note;

    protected static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // Constructor
    public HealthRecord(LocalDate date, String note) {
        this.date = date;
        this.note = note;
    }

    // Getters and setters (encapsulation)
    public LocalDate getDate() {
        return date;
    }
    public void setDate(LocalDate date) {
        if (date == null) {
            throw new IllegalArgumentException("date cannot be null");
        }
        this.date = date;
    }

    public String getNote() {
        return note;
    }
    public void setNote(String note) {
        this.note = note == null ? "" : note.trim();
    }

    // Polymorphic hook: subclasses must describe themselves
    public abstract String displayDetails();

    // Optional: a simple "health score" contribution (overridden by subclasses)
    public double score() {
        return 0.0;
    }

    @Override
    public String toString() {
        return "[" + getClass().getSimpleName() + "] " + date.format(DATE_FMT) + " - " + displayDetails();
    }
}
