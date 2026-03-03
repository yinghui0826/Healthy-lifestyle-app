import { useState } from "react";
import { useNavigate } from "react-router";
import { useHealth } from "../context/HealthContext";
import { DietRecord } from "../models/HealthRecord";
import { Salad, CheckCircle, AlertCircle, Droplets } from "lucide-react";

const today = new Date().toISOString().split("T")[0];

const MEAL_PRESETS = [
  { name: "Breakfast", cals: 400, water: 300, protein: 20, carbs: 50, fat: 12 },
  { name: "Lunch", cals: 650, water: 500, protein: 35, carbs: 70, fat: 20 },
  { name: "Dinner", cals: 700, water: 400, protein: 40, carbs: 75, fat: 22 },
  { name: "Snack", cals: 200, water: 200, protein: 8, carbs: 25, fat: 7 },
  { name: "Smoothie", cals: 300, water: 500, protein: 15, carbs: 45, fat: 5 },
  { name: "Custom", cals: 0, water: 0, protein: 0, carbs: 0, fat: 0 },
];

export function DietForm() {
  const { manager, refresh } = useHealth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    date: today,
    mealName: "",
    waterIntakeMl: "",
    caloriesConsumed: "",
    protein: "",
    carbs: "",
    fat: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const applyPreset = (preset: typeof MEAL_PRESETS[0]) => {
    setForm(f => ({
      ...f,
      mealName: preset.name === "Custom" ? "" : preset.name,
      caloriesConsumed: preset.cals ? String(preset.cals) : f.caloriesConsumed,
      waterIntakeMl: preset.water ? String(preset.water) : f.waterIntakeMl,
      protein: preset.protein ? String(preset.protein) : f.protein,
      carbs: preset.carbs ? String(preset.carbs) : f.carbs,
      fat: preset.fat ? String(preset.fat) : f.fat,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (!form.mealName.trim()) throw new Error("Meal name is required.");
      const water = parseInt(form.waterIntakeMl) || 0;
      const cals = parseInt(form.caloriesConsumed);
      if (isNaN(cals) || cals < 0) throw new Error("Enter valid calories consumed.");
      const record = new DietRecord(
        form.date,
        form.mealName.trim(),
        water,
        cals,
        parseInt(form.protein) || 0,
        parseInt(form.carbs) || 0,
        parseInt(form.fat) || 0,
        form.notes.trim()
      );
      manager.addRecord(record);
      refresh();
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const totalMacroCalories =
    (parseInt(form.protein) || 0) * 4 +
    (parseInt(form.carbs) || 0) * 4 +
    (parseInt(form.fat) || 0) * 9;

  return (
    <div className="px-6 py-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
            <Salad className="w-5 h-5 text-blue-500" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Log Diet</h1>
        </div>
        <p className="text-sm text-gray-500 ml-12">Track your meals, water intake and nutrition.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl mb-4">
          <CheckCircle className="w-4 h-4" /> Meal saved successfully! Redirecting…
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Meal Quick Select */}
        <div className="px-6 py-5 border-b border-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-3">Meal Type</label>
          <div className="grid grid-cols-3 gap-2">
            {MEAL_PRESETS.map(p => (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p)}
                className={`py-2 px-2 rounded-xl text-xs transition-all border ${
                  form.mealName === p.name
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-50 text-gray-600 border-gray-100 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
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
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          {/* Meal Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Meal Name *</label>
            <input
              type="text"
              value={form.mealName}
              onChange={e => set("mealName", e.target.value)}
              placeholder="e.g. Oatmeal with Berries"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          {/* Calories + Water */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Calories Consumed (kcal) *</label>
              <input
                type="number"
                min="0"
                value={form.caloriesConsumed}
                onChange={e => set("caloriesConsumed", e.target.value)}
                placeholder="500"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-400" /> Water Intake (ml)
              </label>
              <input
                type="number"
                min="0"
                value={form.waterIntakeMl}
                onChange={e => set("waterIntakeMl", e.target.value)}
                placeholder="500"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Macronutrients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Macronutrients (grams)</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Protein</div>
                <input
                  type="number"
                  min="0"
                  value={form.protein}
                  onChange={e => set("protein", e.target.value)}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Carbs</div>
                <input
                  type="number"
                  min="0"
                  value={form.carbs}
                  onChange={e => set("carbs", e.target.value)}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Fat</div>
                <input
                  type="number"
                  min="0"
                  value={form.fat}
                  onChange={e => set("fat", e.target.value)}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>
            </div>
            {totalMacroCalories > 0 && (
              <p className="text-xs text-gray-400 mt-1.5">
                Macro calories: {totalMacroCalories} kcal (P×4 + C×4 + F×9)
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={e => set("notes", e.target.value)}
              placeholder="How did you feel? Appetite level, meal quality…"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={success}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-medium transition-colors"
          >
            Save Diet Record
          </button>
        </div>
      </form>

      {/* Summary Preview */}
      {form.mealName && form.caloriesConsumed && (
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl px-5 py-4">
          <p className="text-xs font-medium text-blue-700 mb-1">Preview (getSummary)</p>
          <p className="text-sm text-blue-800">
            {form.mealName}: {form.caloriesConsumed} kcal consumed, {form.waterIntakeMl || 0} ml water
          </p>
        </div>
      )}
    </div>
  );
}
