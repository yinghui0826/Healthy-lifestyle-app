import { useState } from "react";
import { useNavigate } from "react-router";
import { useHealth } from "../context/HealthContext";
import { ActivityRecord } from "../models/HealthRecord";
import { Dumbbell, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

const today = new Date().toISOString().split("T")[0];

const ACTIVITY_PRESETS = [
  { name: "Walking", stepsPerMin: 100, calsPerMin: 4 },
  { name: "Running", stepsPerMin: 160, calsPerMin: 10 },
  { name: "Cycling", stepsPerMin: 0, calsPerMin: 8 },
  { name: "Swimming", stepsPerMin: 0, calsPerMin: 7 },
  { name: "HIIT", stepsPerMin: 120, calsPerMin: 12 },
  { name: "Yoga", stepsPerMin: 0, calsPerMin: 3 },
  { name: "Weight Training", stepsPerMin: 20, calsPerMin: 6 },
  { name: "Custom", stepsPerMin: 0, calsPerMin: 0 },
];

export function ActivityForm() {
  const { manager, refresh } = useHealth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    date: today,
    activityName: "",
    steps: "",
    caloriesBurned: "",
    durationMinutes: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const applyPreset = (preset: typeof ACTIVITY_PRESETS[0]) => {
    set("activityName", preset.name === "Custom" ? "" : preset.name);
    if (form.durationMinutes) {
      const dur = parseInt(form.durationMinutes);
      if (!isNaN(dur)) {
        set("steps", String(Math.round(preset.stepsPerMin * dur)));
        set("caloriesBurned", String(Math.round(preset.calsPerMin * dur)));
      }
    }
  };

  const handleDurationChange = (val: string) => {
    set("durationMinutes", val);
    const selected = ACTIVITY_PRESETS.find(p => p.name === form.activityName);
    if (selected && selected.name !== "Custom") {
      const dur = parseInt(val);
      if (!isNaN(dur)) {
        setForm(f => ({
          ...f,
          durationMinutes: val,
          steps: String(Math.round(selected.stepsPerMin * dur)),
          caloriesBurned: String(Math.round(selected.calsPerMin * dur)),
        }));
        return;
      }
    }
    set("durationMinutes", val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (!form.activityName.trim()) throw new Error("Activity name is required.");
      const steps = parseInt(form.steps) || 0;
      const cals = parseInt(form.caloriesBurned);
      const dur = parseInt(form.durationMinutes);
      if (isNaN(cals) || cals < 0) throw new Error("Enter valid calories burned.");
      if (isNaN(dur) || dur <= 0) throw new Error("Enter valid duration.");
      const record = new ActivityRecord(form.date, form.activityName.trim(), steps, cals, dur, form.notes.trim());
      manager.addRecord(record);
      refresh();
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="px-6 py-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Log Activity</h1>
        </div>
        <p className="text-sm text-gray-500 ml-12">Record your physical activity and track your progress.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-4">
          <CheckCircle className="w-4 h-4" /> Activity saved successfully! Redirecting…
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Quick Select */}
        <div className="px-6 py-5 border-b border-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-3">Activity Type</label>
          <div className="grid grid-cols-4 gap-2">
            {ACTIVITY_PRESETS.map(p => (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p)}
                className={`py-2 px-2 rounded-xl text-xs transition-all border ${
                  form.activityName === p.name || (p.name === "Custom" && !ACTIVITY_PRESETS.find(x => x.name === form.activityName && x.name !== "Custom"))
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-gray-50 text-gray-600 border-gray-100 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-5 grid gap-5">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
            <input
              type="date"
              value={form.date}
              max={today}
              onChange={e => set("date", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
            />
          </div>

          {/* Activity Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Activity Name *</label>
            <input
              type="text"
              value={form.activityName}
              onChange={e => set("activityName", e.target.value)}
              placeholder="e.g. Morning Walk, Gym Session"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
            />
          </div>

          {/* Duration + Steps */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (minutes) *</label>
              <input
                type="number"
                min="1"
                value={form.durationMinutes}
                onChange={e => handleDurationChange(e.target.value)}
                placeholder="30"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Steps Taken</label>
              <input
                type="number"
                min="0"
                value={form.steps}
                onChange={e => set("steps", e.target.value)}
                placeholder="5000"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Calories Burned */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Calories Burned (kcal) *</label>
            <input
              type="number"
              min="0"
              value={form.caloriesBurned}
              onChange={e => set("caloriesBurned", e.target.value)}
              placeholder="250"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
            />
            <p className="text-xs text-gray-400 mt-1">Auto-calculated when using preset + duration</p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={e => set("notes", e.target.value)}
              placeholder="How did it feel? Any observations…"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={success}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-medium transition-colors"
          >
            Save Activity Record
          </button>
        </div>
      </form>

      {/* Summary Preview */}
      {form.activityName && form.durationMinutes && (
        <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl px-5 py-4">
          <p className="text-xs font-medium text-emerald-700 mb-1">Preview (getSummary)</p>
          <p className="text-sm text-emerald-800">
            {form.activityName}: {parseInt(form.steps || "0").toLocaleString()} steps, {form.caloriesBurned || 0} kcal burned in {form.durationMinutes} min
          </p>
        </div>
      )}
    </div>
  );
}
