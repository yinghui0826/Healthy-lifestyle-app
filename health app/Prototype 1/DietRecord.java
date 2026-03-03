/**
 * DietRecord extends HealthRecord (Inheritance)
 * Captures diet-related data like water intake and calories consumed.
 */
import java.time.LocalDate;

public class DietRecord extends HealthRecord {
    private double waterLiters;     // liters of water intake
    private double caloriesConsumed; // kcal consumed

    public DietRecord(LocalDate date, double waterLiters, double caloriesConsumed, String note) {
        super(date, note);
        setWaterLiters(waterLiters);
        setCaloriesConsumed(caloriesConsumed);
    }

    public double getWaterLiters() {
        return waterLiters;
    }
    public void setWaterLiters(double waterLiters) {
        if (waterLiters < 0) throw new IllegalArgumentException("waterLiters cannot be negative");
        this.waterLiters = waterLiters;
    }

    public double getCaloriesConsumed() {
        return caloriesConsumed;
    }
    public void setCaloriesConsumed(double caloriesConsumed) {
        if (caloriesConsumed < 0) throw new IllegalArgumentException("caloriesConsumed cannot be negative");
        this.caloriesConsumed = caloriesConsumed;
    }

    @Override
    public String displayDetails() {
        String notePart = (getNote() == null || getNote().isEmpty()) ? "" : " | Note: " + getNote();
        return "Water: " + String.format("%.2f", waterLiters) + " L | Calories Consumed: "
                + String.format("%.0f", caloriesConsumed) + notePart;
    }

    // Simple score: reward hydration, penalize high calories
    @Override
    public double score() {
        return waterLiters * 2.0 - Math.max(0, (caloriesConsumed - 2000)) / 1000.0;
    }
}
