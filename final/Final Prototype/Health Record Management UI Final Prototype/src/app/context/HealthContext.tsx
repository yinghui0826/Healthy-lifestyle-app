import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { HealthRecordManager, ActivityRecord, DietRecord, MoodRecord } from "../models/HealthRecord";

interface HealthContextType {
  manager: HealthRecordManager;
  records: (ActivityRecord | DietRecord | MoodRecord)[];
  refresh: () => void;
}

// ── Demo seed data ────────────────────────────────────────────────────────────
function seedDemoData(mgr: HealthRecordManager) {
  if (mgr.getAll().length > 0) return;
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  const daysAgo = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return fmt(d); };

  mgr.addRecord(new ActivityRecord(daysAgo(6), "Morning Walk", 5200, 180, 45, "Great start to the week"));
  mgr.addRecord(new DietRecord(daysAgo(6), "Breakfast", 350, 420, 22, 55, 10, "Oatmeal with berries"));
  mgr.addRecord(new DietRecord(daysAgo(6), "Lunch", 500, 680, 38, 72, 18, "Grilled chicken salad"));
  mgr.addRecord(new MoodRecord(daysAgo(6), 4, 4, 2, "Started the week feeling motivated"));

  mgr.addRecord(new ActivityRecord(daysAgo(5), "Running", 7800, 350, 35, "Pushed hard today!"));
  mgr.addRecord(new DietRecord(daysAgo(5), "Breakfast", 250, 380, 18, 48, 8));
  mgr.addRecord(new DietRecord(daysAgo(5), "Dinner", 600, 750, 45, 80, 22, "Pasta with veggies"));
  mgr.addRecord(new MoodRecord(daysAgo(5), 5, 5, 1, "Runner's high all day!"));

  mgr.addRecord(new ActivityRecord(daysAgo(4), "Yoga", 0, 120, 40, "Very relaxing session"));
  mgr.addRecord(new ActivityRecord(daysAgo(4), "Cycling", 0, 290, 30));
  mgr.addRecord(new DietRecord(daysAgo(4), "Lunch", 700, 720, 40, 78, 20));
  mgr.addRecord(new DietRecord(daysAgo(4), "Snack", 200, 210, 10, 28, 6, "Protein bar"));
  mgr.addRecord(new MoodRecord(daysAgo(4), 3, 3, 3, "Average day, felt a bit tired"));

  mgr.addRecord(new ActivityRecord(daysAgo(3), "Weight Training", 1500, 260, 50, "Focused on upper body"));
  mgr.addRecord(new DietRecord(daysAgo(3), "Breakfast", 300, 450, 25, 52, 12));
  mgr.addRecord(new DietRecord(daysAgo(3), "Dinner", 550, 700, 42, 75, 18, "Grilled salmon"));
  mgr.addRecord(new MoodRecord(daysAgo(3), 4, 4, 2, "Productive day at the gym"));

  mgr.addRecord(new ActivityRecord(daysAgo(2), "HIIT", 3200, 420, 30, "Intense but worth it!"));
  mgr.addRecord(new DietRecord(daysAgo(2), "Breakfast", 400, 500, 28, 60, 14));
  mgr.addRecord(new DietRecord(daysAgo(2), "Smoothie", 500, 310, 18, 42, 6, "Banana mango protein shake"));
  mgr.addRecord(new MoodRecord(daysAgo(2), 2, 2, 4, "Felt burnt out after the intense session"));

  mgr.addRecord(new ActivityRecord(daysAgo(1), "Walking", 6100, 200, 60, "Evening stroll"));
  mgr.addRecord(new DietRecord(daysAgo(1), "Lunch", 600, 640, 35, 68, 16));
  mgr.addRecord(new DietRecord(daysAgo(1), "Dinner", 400, 580, 38, 62, 15));
  mgr.addRecord(new MoodRecord(daysAgo(1), 4, 3, 2, "Nice recovery day, feeling better"));

  mgr.addRecord(new ActivityRecord(fmt(today), "Morning Walk", 4300, 160, 40, "Good morning energy"));
  mgr.addRecord(new DietRecord(fmt(today), "Breakfast", 300, 390, 20, 50, 9, "Eggs and toast"));
  mgr.addRecord(new MoodRecord(fmt(today), 4, 4, 2, "Great start to the day!"));
}

const HealthContext = createContext<HealthContextType | null>(null);

export function HealthProvider({ username, children }: { username: string; children: React.ReactNode }) {
  // Create a user-scoped manager; seed demo data for "demo" user
  const manager = useMemo(() => {
    const mgr = new HealthRecordManager(username);
    if (username === "demo") seedDemoData(mgr);
    return mgr;
  }, [username]);

  const [records, setRecords] = useState<(ActivityRecord | DietRecord | MoodRecord)[]>(() => manager.getAll());

  const refresh = useCallback(() => {
    setRecords(manager.getAll());
  }, [manager]);

  return (
    <HealthContext.Provider value={{ manager, records, refresh }}>
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const ctx = useContext(HealthContext);
  if (!ctx) throw new Error("useHealth must be used within HealthProvider");
  return ctx;
}
