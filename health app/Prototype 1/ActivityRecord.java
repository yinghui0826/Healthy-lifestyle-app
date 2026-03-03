/**
 * ActivityRecord extends HealthRecord (Inheritance)
 * Represents physical activity such as steps and calories burned.
 * Demonstrates method overriding (polymorphism).
 */
import java.time.LocalDate;

public class ActivityRecord extends HealthRecord {
    private int steps;             // steps walked
    private double caloriesBurned; // kcal burned

    public ActivityRecord(LocalDate date, int steps, double caloriesBurned, String note) {
        super(date, note);
        setSteps(steps);
        setCaloriesBurned(caloriesBurned);
    }

    public int getSteps() {
        return steps;
    }
    public void setSteps(int steps) {
        if (steps < 0) throw new IllegalArgumentException("steps cannot be negative");
        this.steps = steps;
    }

    public double getCaloriesBurned() {
        return caloriesBurned;
    }
    public void setCaloriesBurned(double caloriesBurned) {
        if (caloriesBurned < 0) throw new IllegalArgumentException("caloriesBurned cannot be negative");
        this.caloriesBurned = caloriesBurned;
    }

    @Override
    public String displayDetails() {
        String notePart = (getNote() == null || getNote().isEmpty()) ? "" : " | Note: " + getNote();
        return "Steps: " + steps + " | Calories Burned: " + String.format("%.0f", caloriesBurned) + notePart;
    }

    // Simple score: reward more steps + calories burned
    @Override
    public double score() {
        // Normalize with simple weights
        return steps / 1000.0 + caloriesBurned / 200.0;
    }
}
