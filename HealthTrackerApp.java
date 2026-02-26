import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

public class HealthTrackerApp {
    private final List<HealthRecord> records = new ArrayList<>();
    private final Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        new HealthTrackerApp().run();
    }

    private void run() {
        printBanner();
        boolean running = true;
        while (running) {
            printMenu();
            int choice = readInt("Choose an option:- ");
            try {
                switch (choice) {
                    case 1: addRecord(RecordType.ACTIVITY);
                    case 2: addRecord(RecordType.DIET);
                    case 3: listAllRecords();
                    case 4: viewSummaryByDate();
                    case 5: viewOverallStats();
                    case 0: {
                        System.out.println("Goodbye! Stay healthy.");
                        running = false;
                    }
                    default: System.out.println("Not correct option. Please try again.");
                }
            } catch (Exception ex) {
                System.out.println("Error: " + ex.getMessage());
            }
            System.out.println();
        }
    }

    private void printBanner() {
        System.out.println("--------------------------------------");
        System.out.println("Smart Health Tracker (SDG 3)   ");
        System.out.println("--------------------------------------");
    }

    private void printMenu() {
        System.out.println("Menu:");
        System.out.println(" 1. Add Activity Record (steps, calories burned)");
        System.out.println(" 2. Add Diet Record (water liters, calories consumed)");
        System.out.println(" 3. List All Records (sorted by date)");
        System.out.println(" 4. View Daily Summary (choose a date)");
        System.out.println(" 5. View Overall Stats");
        System.out.println(" 0. Exit");
    }

    private void addRecord(RecordType type) {
        LocalDate date = readDate("Enter date (yyyy-MM-dd): ");
        String note = readLine("Optional note (press Enter to skip): ");

        switch (type) {
            case ACTIVITY: {
                int steps = readNonNegativeInt("Steps walked: ");
                double kcalBurned = readNonNegativeDouble("Calories burned (kcal): ");
                records.add(new ActivityRecord(date, steps, kcalBurned, note));
                System.out.println("✓ Activity record added.");
            }
            case DIET: {
                double water = readNonNegativeDouble("Water intake (liters): ");
                double kcal = readNonNegativeDouble("Calories consumed (kcal): ");
                records.add(new DietRecord(date, water, kcal, note));
                System.out.println("✓ Diet record added.");
            }
            default: throw new IllegalArgumentException("Unknown record type.");
        }
    }

    private void listAllRecords() {
        if (records.isEmpty()) {
            System.out.println("No records yet.");
            return;
        }
        System.out.println("All records (oldest -> newest):");
        records.stream()
                .sorted(Comparator.comparing(HealthRecord::getDate))
                .forEach(r -> System.out.println(" - " + r));
    }

    private void viewSummaryByDate() {
        if (records.isEmpty()) {
            System.out.println("No records yet.");
            return;
        }
        LocalDate date = readDate("Enter date to summarize (yyyy-MM-dd): ");
        List<HealthRecord> onDate = records.stream()
                .filter(r -> r.getDate().equals(date))
                .sorted(Comparator.comparing(r -> r.getClass().getSimpleName()))
                .collect(Collectors.toList());
        if (onDate.isEmpty()) {
            System.out.println("No records found for " + date + ".");
            return;
        }
        System.out.println("=== Summary for " + date + " ===");
        double totalSteps = 0;
        double totalKcalBurned = 0;
        double totalWater = 0;
        double totalKcalConsumed = 0;
        double dayScore = 0;

        for (HealthRecord r : onDate) {
            System.out.println(" • " + r);
            dayScore += r.score();
            if (r instanceof ActivityRecord a) {
                totalSteps += a.getSteps();
                totalKcalBurned += a.getCaloriesBurned();
            } else if (r instanceof DietRecord d) {
                totalWater += d.getWaterLiters();
                totalKcalConsumed += d.getCaloriesConsumed();
            }
        }

        System.out.println("----------------------------------");
        System.out.printf("Steps: %.0f | Kcal Burned: %.0f%n", totalSteps, totalKcalBurned);
        System.out.printf("Water: %.2f L | Kcal Consumed: %.0f%n", totalWater, totalKcalConsumed);
        System.out.printf("Health Score (simple): %.2f%n", dayScore);
    }

    private void viewOverallStats() {
        if (records.isEmpty()) {
            System.out.println("No records yet.");
            return;
        }
        long days = records.stream().map(HealthRecord::getDate).distinct().count();
        double steps = records.stream()
                .filter(r -> r instanceof ActivityRecord)
                .map(r -> (ActivityRecord) r)
                .mapToDouble(ActivityRecord::getSteps)
                .sum();
        double kcalBurned = records.stream()
                .filter(r -> r instanceof ActivityRecord)
                .map(r -> (ActivityRecord) r)
                .mapToDouble(ActivityRecord::getCaloriesBurned)
                .sum();
        double water = records.stream()
                .filter(r -> r instanceof DietRecord)
                .map(r -> (DietRecord) r)
                .mapToDouble(DietRecord::getWaterLiters)
                .sum();
        double kcalConsumed = records.stream()
                .filter(r -> r instanceof DietRecord)
                .map(r -> (DietRecord) r)
                .mapToDouble(DietRecord::getCaloriesConsumed)
                .sum();
        double score = records.stream().mapToDouble(HealthRecord::score).sum();

        System.out.println("=== Overall Stats ===");
        System.out.printf("Days with records: %d%n", days);
        System.out.printf("Total Steps: %.0f | Total Kcal Burned: %.0f%n", steps, kcalBurned);
        System.out.printf("Total Water: %.2f L | Total Kcal Consumed: %.0f%n", water, kcalConsumed);
        System.out.printf("Cumulative Health Score: %.2f%n", score);
        if (days > 0) {
            System.out.printf("Average Water per Day: %.2f L%n", water / days);
            System.out.printf("Average Steps per Day: %.0f%n", steps / days);
        }
    }

    // ---------- Input helpers ----------

    private int readInt(String prompt) {
        while (true) {
            try {
                System.out.print(prompt);
                String line = scanner.nextLine();
                return Integer.parseInt(line.trim());
            } catch (NumberFormatException ex) {
                System.out.println("Please enter a valid integer.");
            }
        }
    }

    private int readNonNegativeInt(String prompt) {
        while (true) {
            int value = readInt(prompt);
            if (value < 0) {
                System.out.println("Value must be non-negative.");
            } else {
                return value;
            }
        }
    }

    private double readNonNegativeDouble(String prompt) {
        while (true) {
            try {
                System.out.print(prompt);
                String line = scanner.nextLine();
                double v = Double.parseDouble(line.trim());
                if (v < 0) {
                    System.out.println("Value must be non-negative.");
                } else {
                    return v;
                }
            } catch (NumberFormatException ex) {
                System.out.println("Please enter a valid number.");
            }
        }
    }

    private LocalDate readDate(String prompt) {
        while (true) {
            try {
                System.out.print(prompt);
                String line = scanner.nextLine().trim();
                return LocalDate.parse(line, HealthRecord.DATE_FMT);
            } catch (DateTimeParseException ex) {
                System.out.println("Please use format yyyy-MM-dd (e.g., 2025-10-28).");
            }
        }
    }

    private String readLine(String prompt) {
        System.out.print(prompt);
        return scanner.nextLine();
    }
}
