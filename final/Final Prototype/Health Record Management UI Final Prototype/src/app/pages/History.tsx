import { useState } from "react";
import { useHealth } from "../context/HealthContext";
import { ActivityRecord, DietRecord, MoodRecord } from "../models/HealthRecord";
import { format } from "date-fns";
import {
  Search,
  Trash2,
  Dumbbell,
  Salad,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Footprints,
  Flame,
  Droplets,
  UtensilsCrossed,
  Clock,
  Brain,
  Zap,
  Wind,
} from "lucide-react";

const MOOD_EMOJIS = ["", "😢", "😕", "😐", "😊", "😄"];
const MOOD_LABELS = ["", "Terrible", "Bad", "Okay", "Good", "Excellent"];

export function History() {
  const { manager, records, refresh } = useHealth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "activity" | "diet" | "mood">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = records.filter(r => {
    const matchType = filter === "all" || r.type === filter;
    const matchSearch =
      search === "" ||
      r.getSummary().toLowerCase().includes(search.toLowerCase()) ||
      r.date.includes(search);
    return matchType && matchSearch;
  });

  // Group by date
  const grouped: Record<string, typeof filtered> = {};
  filtered.forEach(r => {
    if (!grouped[r.date]) grouped[r.date] = [];
    grouped[r.date].push(r);
  });
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const handleDelete = (id: string) => {
    manager.deleteRecord(id);
    refresh();
    setConfirmDelete(null);
    setExpanded(null);
  };

  function getRecordIcon(r: ActivityRecord | DietRecord | MoodRecord) {
    if (r instanceof ActivityRecord) return <Dumbbell className="w-4 h-4 text-emerald-600" />;
    if (r instanceof DietRecord) return <Salad className="w-4 h-4 text-blue-500" />;
    return <Brain className="w-4 h-4 text-violet-500" />;
  }

  function getRecordBg(r: ActivityRecord | DietRecord | MoodRecord) {
    if (r instanceof ActivityRecord) return "bg-emerald-50";
    if (r instanceof DietRecord) return "bg-blue-50";
    return "bg-violet-50";
  }

  function getRecordBadge(r: ActivityRecord | DietRecord | MoodRecord) {
    if (r instanceof ActivityRecord) return "bg-emerald-50 text-emerald-700";
    if (r instanceof DietRecord) return "bg-blue-50 text-blue-700";
    return "bg-violet-50 text-violet-700";
  }

  function getRecordTitle(r: ActivityRecord | DietRecord | MoodRecord) {
    if (r instanceof ActivityRecord) return r.activityName;
    if (r instanceof DietRecord) return r.mealName;
    const m = r as MoodRecord;
    return `${MOOD_EMOJIS[m.mood]} Mood – ${MOOD_LABELS[m.mood]}`;
  }

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
          <ClipboardList className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Health History</h1>
          <p className="text-sm text-gray-500">{records.length} records saved</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search records…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          />
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
          {(["all", "activity", "diet", "mood"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                filter === f
                  ? f === "all"
                    ? "bg-gray-800 text-white"
                    : f === "activity"
                    ? "bg-emerald-500 text-white"
                    : f === "diet"
                    ? "bg-blue-500 text-white"
                    : "bg-violet-500 text-white"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Records */}
      {sortedDates.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <div className="text-gray-500">No records found.</div>
        </div>
      ) : (
        <div className="space-y-5">
          {sortedDates.map(date => (
            <div key={date}>
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                {format(new Date(date + "T12:00:00"), "EEEE, MMMM d, yyyy")}
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                {grouped[date].map(r => (
                  <div key={r.id}>
                    {/* Row */}
                    <button
                      className="w-full text-left px-5 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${getRecordBg(r)}`}>
                        {getRecordIcon(r)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-800 truncate">{getRecordTitle(r)}</div>
                        <div className="text-xs text-gray-400 mt-0.5 truncate">{r.getSummary()}</div>
                      </div>
                      <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getRecordBadge(r)}`}>
                          {r.type}
                        </span>
                        {expanded === r.id
                          ? <ChevronUp className="w-4 h-4 text-gray-400" />
                          : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </button>

                    {/* Expanded Detail */}
                    {expanded === r.id && (
                      <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100">
                        <div className="pt-3 grid grid-cols-2 gap-3">
                          {r instanceof ActivityRecord && (
                            <>
                              <Detail icon={<Footprints className="w-3.5 h-3.5 text-emerald-500" />} label="Steps" value={r.steps.toLocaleString()} />
                              <Detail icon={<Flame className="w-3.5 h-3.5 text-orange-500" />} label="Calories Burned" value={`${r.caloriesBurned} kcal`} />
                              <Detail icon={<Clock className="w-3.5 h-3.5 text-gray-400" />} label="Duration" value={`${r.durationMinutes} min`} />
                            </>
                          )}
                          {r instanceof DietRecord && (
                            <>
                              <Detail icon={<UtensilsCrossed className="w-3.5 h-3.5 text-purple-500" />} label="Calories" value={`${r.caloriesConsumed} kcal`} />
                              <Detail icon={<Droplets className="w-3.5 h-3.5 text-blue-400" />} label="Water" value={`${r.waterIntakeMl} ml`} />
                              <Detail icon={null} label="Protein" value={`${r.protein}g`} />
                              <Detail icon={null} label="Carbs" value={`${r.carbs}g`} />
                              <Detail icon={null} label="Fat" value={`${r.fat}g`} />
                            </>
                          )}
                          {r instanceof MoodRecord && (
                            <>
                              <Detail icon={<span className="text-base">{MOOD_EMOJIS[r.mood]}</span>} label="Mood" value={MOOD_LABELS[r.mood]} />
                              <Detail icon={<Zap className="w-3.5 h-3.5 text-yellow-500" />} label="Energy" value={`${r.energy}/5`} />
                              <Detail icon={<Wind className="w-3.5 h-3.5 text-violet-400" />} label="Stress" value={`${r.stress}/5`} />
                            </>
                          )}
                        </div>
                        {r.notes && (
                          <div className="mt-3 bg-white rounded-lg px-3 py-2 text-xs text-gray-600 border border-gray-100">
                            📝 {r.notes}
                          </div>
                        )}

                        {/* Delete */}
                        <div className="mt-3 flex justify-end">
                          {confirmDelete === r.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Are you sure?</span>
                              <button
                                onClick={() => handleDelete(r.id)}
                                className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(r.id)}
                              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete Record
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-xs text-gray-500">{label}:</span>
      <span className="text-xs font-medium text-gray-800">{value}</span>
    </div>
  );
}
