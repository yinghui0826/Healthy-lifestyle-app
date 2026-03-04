import { useState } from "react";
import { useNavigate } from "react-router";
import { useHealth } from "../context/HealthContext";
import { MoodRecord } from "../models/HealthRecord";
import { Brain, CheckCircle, AlertCircle, Zap, Wind } from "lucide-react";

const today = new Date().toISOString().split("T")[0];

const MOOD_OPTIONS = [
  { value: 1, emoji: "😢", label: "Terrible", color: "border-red-300 bg-red-50 text-red-600", activeColor: "border-red-500 bg-red-500 text-white" },
  { value: 2, emoji: "😕", label: "Bad", color: "border-orange-300 bg-orange-50 text-orange-600", activeColor: "border-orange-500 bg-orange-500 text-white" },
  { value: 3, emoji: "😐", label: "Okay", color: "border-yellow-300 bg-yellow-50 text-yellow-600", activeColor: "border-yellow-500 bg-yellow-500 text-white" },
  { value: 4, emoji: "😊", label: "Good", color: "border-emerald-300 bg-emerald-50 text-emerald-700", activeColor: "border-emerald-500 bg-emerald-500 text-white" },
  { value: 5, emoji: "😄", label: "Excellent", color: "border-green-300 bg-green-50 text-green-700", activeColor: "border-green-500 bg-green-500 text-white" },
];

const ENERGY_OPTIONS = [
  { value: 1, emoji: "🪫", label: "Exhausted" },
  { value: 2, emoji: "😴", label: "Tired" },
  { value: 3, emoji: "😌", label: "Moderate" },
  { value: 4, emoji: "⚡", label: "Energetic" },
  { value: 5, emoji: "🔥", label: "Full Power" },
];

const STRESS_OPTIONS = [
  { value: 1, emoji: "🧘", label: "Very Calm" },
  { value: 2, emoji: "😌", label: "Calm" },
  { value: 3, emoji: "😐", label: "Moderate" },
  { value: 4, emoji: "😤", label: "Stressed" },
  { value: 5, emoji: "🤯", label: "Very Stressed" },
];

const STRESS_ACTIVE_COLORS = [
  "", "bg-emerald-500 border-emerald-500", "bg-teal-500 border-teal-500",
  "bg-yellow-500 border-yellow-500", "bg-orange-500 border-orange-500", "bg-red-500 border-red-500",
];

function LevelSelector({
  label,
  icon,
  options,
  value,
  onChange,
  activeClass,
}: {
  label: string;
  icon: React.ReactNode;
  options: { value: number; emoji: string; label: string }[];
  value: number;
  onChange: (v: number) => void;
  activeClass?: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {value > 0 && (
          <span className="ml-auto text-xs text-gray-500">{options.find(o => o.value === value)?.label}</span>
        )}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {options.map(opt => {
          const isActive = value === opt.value;
          const ac = activeClass ? activeClass(opt.value) : "bg-violet-500 border-violet-500 text-white";
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${
                isActive ? `${ac} text-white shadow-md scale-105` : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white"
              }`}
            >
              <span className="text-xl">{opt.emoji}</span>
              <span className={`text-[10px] font-medium ${isActive ? "text-white" : "text-gray-500"}`}>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MoodForm() {
  const { manager, refresh } = useHealth();
  const navigate = useNavigate();

  const [date, setDate] = useState(today);
  const [mood, setMood] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [stress, setStress] = useState(0);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mood === 0) { setError("Please select your mood."); return; }
    if (energy === 0) { setError("Please select your energy level."); return; }
    if (stress === 0) { setError("Please select your stress level."); return; }
    try {
      const record = new MoodRecord(date, mood, energy, stress, notes.trim());
      manager.addRecord(record);
      refresh();
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  // Selected mood option for preview color
  const selectedMood = MOOD_OPTIONS.find(o => o.value === mood);

  return (
    <div className="px-6 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-violet-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Log Mood</h1>
        </div>
        <p className="text-sm text-gray-500 ml-12">Track your mental wellbeing and emotional state.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 px-4 py-3 rounded-xl mb-4">
          <CheckCircle className="w-4 h-4" /> Mood logged successfully! Redirecting…
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 grid gap-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              max={today}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
            />
          </div>

          {/* Mood */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🧠</span>
              <label className="text-sm font-medium text-gray-700">How are you feeling? *</label>
              {mood > 0 && (
                <span className="ml-auto text-xs text-gray-500">{MOOD_OPTIONS.find(o => o.value === mood)?.label}</span>
              )}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {MOOD_OPTIONS.map(opt => {
                const isActive = mood === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setMood(opt.value)}
                    className={`flex flex-col items-center gap-1.5 py-4 rounded-xl border-2 transition-all ${
                      isActive ? `${opt.activeColor} shadow-md scale-105` : `${opt.color} hover:scale-102`
                    }`}
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <span className={`text-[10px] font-medium ${isActive ? "text-white" : ""}`}>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Energy Level */}
          <LevelSelector
            label="Energy Level *"
            icon={<Zap className="w-4 h-4 text-yellow-500" />}
            options={ENERGY_OPTIONS}
            value={energy}
            onChange={setEnergy}
            activeClass={() => "bg-yellow-500 border-yellow-500"}
          />

          {/* Stress Level */}
          <LevelSelector
            label="Stress Level *"
            icon={<Wind className="w-4 h-4 text-violet-500" />}
            options={STRESS_OPTIONS}
            value={stress}
            onChange={setStress}
            activeClass={(v) => STRESS_ACTIVE_COLORS[v]}
          />

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="What's on your mind? Any thoughts about your day…"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={success}
            className="w-full bg-violet-500 hover:bg-violet-600 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-medium transition-colors"
          >
            Save Mood Entry
          </button>
        </div>
      </form>

      {/* Preview */}
      {mood > 0 && energy > 0 && stress > 0 && selectedMood && (
        <div className="mt-4 bg-violet-50 border border-violet-100 rounded-xl px-5 py-4">
          <p className="text-xs font-medium text-violet-700 mb-1">Preview (getSummary)</p>
          <p className="text-sm text-violet-800">
            {new MoodRecord(date, mood, energy, stress, notes).getSummary()}
          </p>
        </div>
      )}
    </div>
  );
}
