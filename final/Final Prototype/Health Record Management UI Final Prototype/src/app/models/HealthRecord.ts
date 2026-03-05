// ─────────────────────────────────────────────────────────────────────────────
// Base class – HealthRecord
// Demonstrates encapsulation (private fields + getters/setters)
// ─────────────────────────────────────────────────────────────────────────────
export abstract class HealthRecord {
  private _id: string;
  private _date: string;        // ISO date string
  private _notes: string;
  private _type: "activity" | "diet" | "mood";

  constructor(date: string, notes: string, type: "activity" | "diet" | "mood") {
    this._id = crypto.randomUUID();
    this._date = date;
    this._notes = notes;
    this._type = type;
  }

  // ── Getters ──────────────────────────────────────────────────────────────
  get id(): string { return this._id; }
  get date(): string { return this._date; }
  get notes(): string { return this._notes; }
  get type(): "activity" | "diet" | "mood" { return this._type; }

  // ── Setters ──────────────────────────────────────────────────────────────
  set date(value: string) {
    if (!value) throw new Error("Date cannot be empty.");
    this._date = value;
  }
  set notes(value: string) { this._notes = value; }

  // Abstract method overridden by subclasses (polymorphism)
  abstract getSummary(): string;
  abstract toPlainObject(): Record<string, unknown>;

  // Allow re-hydrating a plain id when loading from storage
  protected setId(id: string) { this._id = id; }
}

// ─────────────────────────────────────────────────────────────────────────────
// ActivityRecord – extends HealthRecord (Inheritance)
// Tracks physical activity: steps taken and calories burned.
// ─────────────────────────────────────────────────────────────────────────────
export class ActivityRecord extends HealthRecord {
  private _steps: number;
  private _caloriesBurned: number;
  private _activityName: string;
  private _durationMinutes: number;

  constructor(
    date: string,
    activityName: string,
    steps: number,
    caloriesBurned: number,
    durationMinutes: number,
    notes: string = ""
  ) {
    super(date, notes, "activity");
    this._activityName = activityName;
    this._steps = steps;
    this._caloriesBurned = caloriesBurned;
    this._durationMinutes = durationMinutes;
  }

  // ── Getters ──────────────────────────────────────────────────────────────
  get steps(): number { return this._steps; }
  get caloriesBurned(): number { return this._caloriesBurned; }
  get activityName(): string { return this._activityName; }
  get durationMinutes(): number { return this._durationMinutes; }

  // ── Setters ──────────────────────────────────────────────────────────────
  set steps(value: number) {
    if (value < 0) throw new Error("Steps cannot be negative.");
    this._steps = value;
  }
  set caloriesBurned(value: number) {
    if (value < 0) throw new Error("Calories burned cannot be negative.");
    this._caloriesBurned = value;
  }
  set activityName(value: string) { this._activityName = value; }
  set durationMinutes(value: number) {
    if (value < 0) throw new Error("Duration cannot be negative.");
    this._durationMinutes = value;
  }

  // ── Method Overriding (Polymorphism) ─────────────────────────────────────
  getSummary(): string {
    return `${this._activityName}: ${this._steps.toLocaleString()} steps, ${this._caloriesBurned} kcal burned in ${this._durationMinutes} min`;
  }

  toPlainObject(): Record<string, unknown> {
    return {
      id: this.id,
      type: this.type,
      date: this.date,
      notes: this.notes,
      activityName: this._activityName,
      steps: this._steps,
      caloriesBurned: this._caloriesBurned,
      durationMinutes: this._durationMinutes,
    };
  }

  static fromPlainObject(obj: Record<string, unknown>): ActivityRecord {
    const r = new ActivityRecord(
      obj.date as string,
      obj.activityName as string,
      obj.steps as number,
      obj.caloriesBurned as number,
      obj.durationMinutes as number,
      obj.notes as string
    );
    r.setId(obj.id as string);
    return r;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DietRecord – extends HealthRecord (Inheritance)
// Captures nutrition data: water intake and calories consumed.
// ─────────────────────────────────────────────────────────────────────────────
export class DietRecord extends HealthRecord {
  private _mealName: string;
  private _waterIntakeMl: number;
  private _caloriesConsumed: number;
  private _protein: number;   // grams
  private _carbs: number;     // grams
  private _fat: number;       // grams

  constructor(
    date: string,
    mealName: string,
    waterIntakeMl: number,
    caloriesConsumed: number,
    protein: number = 0,
    carbs: number = 0,
    fat: number = 0,
    notes: string = ""
  ) {
    super(date, notes, "diet");
    this._mealName = mealName;
    this._waterIntakeMl = waterIntakeMl;
    this._caloriesConsumed = caloriesConsumed;
    this._protein = protein;
    this._carbs = carbs;
    this._fat = fat;
  }

  // ── Getters ──────────────────────────────────────────────────────────────
  get mealName(): string { return this._mealName; }
  get waterIntakeMl(): number { return this._waterIntakeMl; }
  get caloriesConsumed(): number { return this._caloriesConsumed; }
  get protein(): number { return this._protein; }
  get carbs(): number { return this._carbs; }
  get fat(): number { return this._fat; }

  // ── Setters ──────────────────────────────────────────────────────────────
  set mealName(value: string) { this._mealName = value; }
  set waterIntakeMl(value: number) {
    if (value < 0) throw new Error("Water intake cannot be negative.");
    this._waterIntakeMl = value;
  }
  set caloriesConsumed(value: number) {
    if (value < 0) throw new Error("Calories consumed cannot be negative.");
    this._caloriesConsumed = value;
  }
  set protein(value: number) { this._protein = Math.max(0, value); }
  set carbs(value: number) { this._carbs = Math.max(0, value); }
  set fat(value: number) { this._fat = Math.max(0, value); }

  // ── Method Overriding (Polymorphism) ─────────────────────────────────────
  getSummary(): string {
    return `${this._mealName}: ${this._caloriesConsumed} kcal consumed, ${this._waterIntakeMl} ml water`;
  }

  toPlainObject(): Record<string, unknown> {
    return {
      id: this.id,
      type: this.type,
      date: this.date,
      notes: this.notes,
      mealName: this._mealName,
      waterIntakeMl: this._waterIntakeMl,
      caloriesConsumed: this._caloriesConsumed,
      protein: this._protein,
      carbs: this._carbs,
      fat: this._fat,
    };
  }

  static fromPlainObject(obj: Record<string, unknown>): DietRecord {
    const r = new DietRecord(
      obj.date as string,
      obj.mealName as string,
      obj.waterIntakeMl as number,
      obj.caloriesConsumed as number,
      obj.protein as number,
      obj.carbs as number,
      obj.fat as number,
      obj.notes as string
    );
    r.setId(obj.id as string);
    return r;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MoodRecord – extends HealthRecord (Inheritance)
// Tracks mental wellbeing: mood, energy and stress levels (1–5 scale).
// ─────────────────────────────────────────────────────────────────────────────
export class MoodRecord extends HealthRecord {
  private _mood: number;    // 1 (terrible) → 5 (excellent)
  private _energy: number;  // 1 (exhausted) → 5 (very energetic)
  private _stress: number;  // 1 (very relaxed) → 5 (very stressed)

  constructor(
    date: string,
    mood: number,
    energy: number,
    stress: number,
    notes: string = ""
  ) {
    super(date, notes, "mood");
    this._mood = Math.max(1, Math.min(5, Math.round(mood)));
    this._energy = Math.max(1, Math.min(5, Math.round(energy)));
    this._stress = Math.max(1, Math.min(5, Math.round(stress)));
  }

  // ── Getters ──────────────────────────────────────────────────────────────
  get mood(): number { return this._mood; }
  get energy(): number { return this._energy; }
  get stress(): number { return this._stress; }

  // ── Setters ──────────────────────────────────────────────────────────────
  set mood(value: number) { this._mood = Math.max(1, Math.min(5, Math.round(value))); }
  set energy(value: number) { this._energy = Math.max(1, Math.min(5, Math.round(value))); }
  set stress(value: number) { this._stress = Math.max(1, Math.min(5, Math.round(value))); }

  // ── Method Overriding (Polymorphism) ─────────────────────────────────────
  getSummary(): string {
    const moodLabels = ["", "Terrible", "Bad", "Okay", "Good", "Excellent"];
    const energyLabels = ["", "Exhausted", "Low", "Moderate", "High", "Very High"];
    const stressLabels = ["", "Very Calm", "Calm", "Moderate", "Stressed", "Very Stressed"];
    return `Mood: ${moodLabels[this._mood]}, Energy: ${energyLabels[this._energy]}, Stress: ${stressLabels[this._stress]}`;
  }

  toPlainObject(): Record<string, unknown> {
    return {
      id: this.id,
      type: this.type,
      date: this.date,
      notes: this.notes,
      mood: this._mood,
      energy: this._energy,
      stress: this._stress,
    };
  }

  static fromPlainObject(obj: Record<string, unknown>): MoodRecord {
    const r = new MoodRecord(
      obj.date as string,
      obj.mood as number,
      obj.energy as number,
      obj.stress as number,
      obj.notes as string
    );
    r.setId(obj.id as string);
    return r;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HealthRecordManager – Main class
// Manages all records, saves/loads from localStorage (persistence).
// ─────────────────────────────────────────────────────────────────────────────
export class HealthRecordManager {
  private static BASE_KEY = "healthRecords";
  private storageKey: string;
  private _records: (ActivityRecord | DietRecord | MoodRecord)[] = [];

  constructor(username?: string) {
    this.storageKey = username
      ? `${HealthRecordManager.BASE_KEY}_${username}`
      : HealthRecordManager.BASE_KEY;
    this.loadFromStorage();
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────
  addRecord(record: ActivityRecord | DietRecord | MoodRecord): void {
    this._records.push(record);
    this.saveToStorage();
  }

  deleteRecord(id: string): void {
    this._records = this._records.filter(r => r.id !== id);
    this.saveToStorage();
  }

  updateRecord(id: string, updates: Partial<Record<string, unknown>>): void {
    const record = this._records.find(r => r.id === id);
    if (!record) throw new Error("Record not found.");
    if (updates.notes !== undefined) record.notes = updates.notes as string;
    if (updates.date !== undefined) record.date = updates.date as string;
    if (record instanceof ActivityRecord) {
      if (updates.steps !== undefined) record.steps = updates.steps as number;
      if (updates.caloriesBurned !== undefined) record.caloriesBurned = updates.caloriesBurned as number;
      if (updates.durationMinutes !== undefined) record.durationMinutes = updates.durationMinutes as number;
      if (updates.activityName !== undefined) record.activityName = updates.activityName as string;
    }
    if (record instanceof DietRecord) {
      if (updates.waterIntakeMl !== undefined) record.waterIntakeMl = updates.waterIntakeMl as number;
      if (updates.caloriesConsumed !== undefined) record.caloriesConsumed = updates.caloriesConsumed as number;
      if (updates.mealName !== undefined) record.mealName = updates.mealName as string;
      if (updates.protein !== undefined) record.protein = updates.protein as number;
      if (updates.carbs !== undefined) record.carbs = updates.carbs as number;
      if (updates.fat !== undefined) record.fat = updates.fat as number;
    }
    if (record instanceof MoodRecord) {
      if (updates.mood !== undefined) record.mood = updates.mood as number;
      if (updates.energy !== undefined) record.energy = updates.energy as number;
      if (updates.stress !== undefined) record.stress = updates.stress as number;
    }
    this.saveToStorage();
  }

  getAll(): (ActivityRecord | DietRecord | MoodRecord)[] {
    return [...this._records].sort((a, b) => b.date.localeCompare(a.date));
  }

  getByDate(date: string): (ActivityRecord | DietRecord | MoodRecord)[] {
    return this._records.filter(r => r.date === date);
  }

  getActivityRecords(): ActivityRecord[] {
    return this._records.filter((r): r is ActivityRecord => r instanceof ActivityRecord);
  }

  getDietRecords(): DietRecord[] {
    return this._records.filter((r): r is DietRecord => r instanceof DietRecord);
  }

  getMoodRecords(): MoodRecord[] {
    return this._records.filter((r): r is MoodRecord => r instanceof MoodRecord);
  }

  // Polymorphism – getSummary is called on any record type
  getAllSummaries(): { id: string; summary: string; type: string; date: string }[] {
    return this.getAll().map(r => ({
      id: r.id,
      summary: r.getSummary(),
      type: r.type,
      date: r.date,
    }));
  }

  getTodayStats(today: string) {
    const todayRecords = this.getByDate(today);
    const totalSteps = todayRecords
      .filter((r): r is ActivityRecord => r instanceof ActivityRecord)
      .reduce((sum, r) => sum + r.steps, 0);
    const totalCaloriesBurned = todayRecords
      .filter((r): r is ActivityRecord => r instanceof ActivityRecord)
      .reduce((sum, r) => sum + r.caloriesBurned, 0);
    const totalCaloriesConsumed = todayRecords
      .filter((r): r is DietRecord => r instanceof DietRecord)
      .reduce((sum, r) => sum + r.caloriesConsumed, 0);
    const totalWater = todayRecords
      .filter((r): r is DietRecord => r instanceof DietRecord)
      .reduce((sum, r) => sum + r.waterIntakeMl, 0);
    const moodEntries = todayRecords.filter((r): r is MoodRecord => r instanceof MoodRecord);
    const avgMood = moodEntries.length > 0
      ? moodEntries.reduce((s, r) => s + r.mood, 0) / moodEntries.length
      : null;
    return { totalSteps, totalCaloriesBurned, totalCaloriesConsumed, totalWater, avgMood };
  }

  // ── FIX: properly map stat keys so chart dataKeys match ──────────────────
  getWeeklyChartData(today: string) {
    const days: {
      date: string;
      steps: number;
      caloriesBurned: number;
      caloriesConsumed: number;
      water: number;
      mood: number | null;
    }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const stats = this.getTodayStats(dateStr);
      days.push({
        date: dateStr,
        steps: stats.totalSteps,
        caloriesBurned: stats.totalCaloriesBurned,
        caloriesConsumed: stats.totalCaloriesConsumed,
        water: stats.totalWater,
        mood: stats.avgMood,
      });
    }
    return days;
  }

  // ── Persistence ───────────────────────────────────────────────────────────
  private saveToStorage(): void {
    const plain = this._records.map(r => r.toPlainObject());
    localStorage.setItem(this.storageKey, JSON.stringify(plain));
  }

  private loadFromStorage(): void {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return;
    try {
      const items = JSON.parse(raw) as Record<string, unknown>[];
      this._records = items.map(item => {
        if (item.type === "activity") return ActivityRecord.fromPlainObject(item);
        if (item.type === "mood") return MoodRecord.fromPlainObject(item);
        return DietRecord.fromPlainObject(item);
      });
    } catch {
      this._records = [];
    }
  }

  clearAll(): void {
    this._records = [];
    localStorage.removeItem(this.storageKey);
  }
}
