import { useHealth } from "../context/HealthContext";
import { ActivityRecord, DietRecord, MoodRecord } from "../models/HealthRecord";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  Footprints,
  Flame,
  Droplets,
  UtensilsCrossed,
  Plus,
  ArrowRight,
  Dumbbell,
  Salad,
  TrendingUp,
  Calendar,
  Brain,
  Zap,
  Wind,
} from "lucide-react";
import { format } from "date-fns";

const today = new Date().toISOString().split("T")[0];
const todayLabel = format(new Date(), "EEEE, MMMM d");

// ── Mood helpers ──────────────────────────────────────────────────────────────
const MOOD_EMOJIS = ["", "😢", "😕", "😐", "😊", "😄"];
const MOOD_LABELS = ["", "Terrible", "Bad", "Okay", "Good", "Excellent"];
const MOOD_COLORS = [
  "",
  "text-red-500",
  "text-orange-500",
  "text-yellow-500",
  "text-emerald-500",
  "text-green-600",
];
const MOOD_BG = [
  "",
  "bg-red-50 border-red-100",
  "bg-orange-50 border-orange-100",
  "bg-yellow-50 border-yellow-100",
  "bg-emerald-50 border-emerald-100",
  "bg-green-50 border-green-100",
];

// ── StatCard ──────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit: string;
  goal?: number;
  current?: number;
  color: string;
  bg: string;
  /** Explicit Tailwind bg class for the progress bar fill (avoids dynamic class purging) */
  barBg: string;
}

function StatCard({ icon, label, value, unit, goal, current, color, bg, barBg }: StatCardProps) {
  const pct = goal && current !== undefined ? Math.min(100, Math.round((current / goal) * 100)) : null;
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        {pct !== null && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${bg} ${color}`}>{pct}%</span>
        )}
      </div>
      <div className={`text-2xl font-semibold ${color}`}>{typeof value === "number" ? value.toLocaleString() : value}</div>
      <div className="text-xs text-gray-400 mt-0.5">{unit}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
      {pct !== null && (
        <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barBg}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

// ── Mini level bar (for mood widget) ─────────────────────────────────────────
function LevelBar({ value, max = 5, fillClass }: { value: number; max?: number; fillClass: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${i < value ? fillClass : "bg-gray-200"}`}
        />
      ))}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export function Dashboard() {
  const { manager, records } = useHealth();
  const { user } = useAuth();
  const stats = manager.getTodayStats(today);
  const todayRecords = records.filter(r => r.date === today);
  const recentRecords = records.filter(r => r.type !== "mood").slice(0, 5);

  const netCalories = stats.totalCaloriesConsumed - stats.totalCaloriesBurned;

  // Today's mood record (latest one if multiple)
  const todayMoodRecords = todayRecords.filter((r): r is MoodRecord => r instanceof MoodRecord);
  const todayMood = todayMoodRecords.length > 0 ? todayMoodRecords[todayMoodRecords.length - 1] : null;

  return (
    <div className="px-6 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Good {getGreeting()}, {user?.displayName?.split(" ")[0]}! 👋</h1>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-3.5 h-3.5" /> {todayLabel}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/activity"
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-3 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Activity
          </Link>
          <Link
            to="/diet"
            className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Diet
          </Link>
        </div>
      </div>

      {/* Today Stats */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Today's Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={<Footprints className="w-5 h-5 text-emerald-600" />}
            label="Steps Taken"
            value={stats.totalSteps}
            unit="steps"
            goal={10000}
            current={stats.totalSteps}
            color="text-emerald-600"
            bg="bg-emerald-50"
            barBg="bg-emerald-500"
          />
          <StatCard
            icon={<Flame className="w-5 h-5 text-orange-500" />}
            label="Calories Burned"
            value={stats.totalCaloriesBurned}
            unit="kcal"
            goal={500}
            current={stats.totalCaloriesBurned}
            color="text-orange-500"
            bg="bg-orange-50"
            barBg="bg-orange-500"
          />
          <StatCard
            icon={<UtensilsCrossed className="w-5 h-5 text-purple-500" />}
            label="Calories Consumed"
            value={stats.totalCaloriesConsumed}
            unit="kcal"
            goal={2000}
            current={stats.totalCaloriesConsumed}
            color="text-purple-500"
            bg="bg-purple-50"
            barBg="bg-purple-500"
          />
          <StatCard
            icon={<Droplets className="w-5 h-5 text-blue-500" />}
            label="Water Intake"
            value={stats.totalWater >= 1000 ? (stats.totalWater / 1000).toFixed(1) + " L" : stats.totalWater}
            unit={stats.totalWater >= 1000 ? "litres" : "ml"}
            goal={2000}
            current={stats.totalWater}
            color="text-blue-500"
            bg="bg-blue-50"
            barBg="bg-blue-500"
          />
        </div>
      </section>

      {/* Net Calories Banner + Mood Card */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Net Calorie Balance */}
        <div className={`rounded-2xl px-5 py-4 flex items-center justify-between ${netCalories > 0 ? "bg-orange-50 border border-orange-100" : "bg-emerald-50 border border-emerald-100"}`}>
          <div className="flex items-center gap-3">
            <TrendingUp className={`w-5 h-5 ${netCalories > 0 ? "text-orange-500" : "text-emerald-600"}`} />
            <div>
              <div className={`text-sm font-medium ${netCalories > 0 ? "text-orange-700" : "text-emerald-700"}`}>
                Net Calorie Balance
              </div>
              <div className="text-xs text-gray-500">Consumed − Burned</div>
            </div>
          </div>
          <div className={`text-xl font-semibold ${netCalories > 0 ? "text-orange-600" : "text-emerald-600"}`}>
            {netCalories > 0 ? "+" : ""}{netCalories} kcal
          </div>
        </div>

        {/* Today's Mood Widget */}
        {todayMood ? (
          <div className={`rounded-2xl px-5 py-4 border ${MOOD_BG[todayMood.mood]}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-500" />
                <span className="text-sm font-medium text-gray-700">Today's Mood</span>
              </div>
              <Link to="/mood" className="text-xs text-violet-600 hover:underline flex items-center gap-0.5">
                Update <Plus className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{MOOD_EMOJIS[todayMood.mood]}</span>
              <div className="flex-1 space-y-2">
                <div className={`text-sm font-medium ${MOOD_COLORS[todayMood.mood]}`}>
                  {MOOD_LABELS[todayMood.mood]}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                    <LevelBar value={todayMood.energy} fillClass="bg-yellow-400" />
                    <span className="text-xs text-gray-400 w-14">Energy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="w-3 h-3 text-violet-400 flex-shrink-0" />
                    <LevelBar value={todayMood.stress} fillClass="bg-violet-400" />
                    <span className="text-xs text-gray-400 w-14">Stress</span>
                  </div>
                </div>
              </div>
            </div>
            {todayMood.notes && (
              <p className="text-xs text-gray-500 mt-2 italic truncate">"{todayMood.notes}"</p>
            )}
          </div>
        ) : (
          <div className="rounded-2xl px-5 py-4 border border-violet-100 bg-violet-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-violet-500" />
              <div>
                <div className="text-sm font-medium text-violet-700">No mood logged today</div>
                <div className="text-xs text-gray-500">How are you feeling?</div>
              </div>
            </div>
            <Link
              to="/mood"
              className="flex items-center gap-1.5 bg-violet-500 hover:bg-violet-600 text-white text-xs px-3 py-2 rounded-xl transition-colors"
            >
              <Plus className="w-3 h-3" /> Log Mood
            </Link>
          </div>
        )}
      </div>

      {/* Today's Logs */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Activity Today */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-800">Today's Activities</span>
            </div>
            <Link to="/activity" className="text-xs text-emerald-600 hover:underline flex items-center gap-0.5">
              Add <Plus className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {todayRecords.filter((r): r is ActivityRecord => r instanceof ActivityRecord).length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No activity logged today</div>
            ) : (
              todayRecords
                .filter((r): r is ActivityRecord => r instanceof ActivityRecord)
                .map(r => (
                  <div key={r.id} className="px-5 py-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-gray-800">{r.activityName}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{r.durationMinutes} min • {r.steps.toLocaleString()} steps</div>
                      </div>
                      <div className="text-sm text-orange-500 font-medium">{r.caloriesBurned} kcal</div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Diet Today */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Salad className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-800">Today's Meals</span>
            </div>
            <Link to="/diet" className="text-xs text-blue-500 hover:underline flex items-center gap-0.5">
              Add <Plus className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {todayRecords.filter((r): r is DietRecord => r instanceof DietRecord).length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No meals logged today</div>
            ) : (
              todayRecords
                .filter((r): r is DietRecord => r instanceof DietRecord)
                .map(r => (
                  <div key={r.id} className="px-5 py-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-gray-800">{r.mealName}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{r.waterIntakeMl} ml water • P:{r.protein}g C:{r.carbs}g F:{r.fat}g</div>
                      </div>
                      <div className="text-sm text-purple-500 font-medium">{r.caloriesConsumed} kcal</div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Records */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <span className="text-sm font-medium text-gray-800">Recent Records</span>
          <Link to="/history" className="text-xs text-emerald-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {recentRecords.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="text-4xl mb-3">📋</div>
            <div className="text-sm text-gray-500">No records yet. Start by logging an activity or meal!</div>
            <div className="flex justify-center gap-3 mt-4">
              <Link to="/activity" className="bg-emerald-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors">Log Activity</Link>
              <Link to="/diet" className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">Log Meal</Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentRecords.map(r => (
              <div key={r.id} className="px-5 py-3 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${r.type === "activity" ? "bg-emerald-50" : "bg-blue-50"}`}>
                  {r.type === "activity" ? <Dumbbell className="w-4 h-4 text-emerald-600" /> : <Salad className="w-4 h-4 text-blue-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-800 truncate">{r.getSummary()}</div>
                  <div className="text-xs text-gray-400">{format(new Date(r.date + "T12:00:00"), "MMM d, yyyy")}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${r.type === "activity" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
                  {r.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  return "Evening";
}
