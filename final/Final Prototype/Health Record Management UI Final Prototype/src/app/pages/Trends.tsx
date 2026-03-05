import { useHealth } from "../context/HealthContext";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";
import { TrendingUp, Footprints, Flame, Droplets, UtensilsCrossed, Brain } from "lucide-react";

const today = new Date().toISOString().split("T")[0];

const COLORS = ["#10b981", "#f97316", "#8b5cf6", "#3b82f6"];
const MOOD_EMOJIS = ["", "😢", "😕", "😐", "😊", "😄"];

export function Trends() {
  const { manager } = useHealth();

  // weekData now has properly named keys: steps, caloriesBurned, caloriesConsumed, water, mood
  const weekData = manager.getWeeklyChartData(today).map(d => ({
    ...d,
    day: format(new Date(d.date + "T12:00:00"), "EEE"),
    net: d.caloriesConsumed - d.caloriesBurned,
  }));

  const activityRecords = manager.getActivityRecords();
  const dietRecords = manager.getDietRecords();
  const moodRecords = manager.getMoodRecords();

  // Protein, Carbs, Fat totals for pie
  const totalProtein = dietRecords.reduce((s, r) => s + r.protein, 0);
  const totalCarbs = dietRecords.reduce((s, r) => s + r.carbs, 0);
  const totalFat = dietRecords.reduce((s, r) => s + r.fat, 0);
  const macroData = [
    { name: "Protein", value: totalProtein },
    { name: "Carbs", value: totalCarbs },
    { name: "Fat", value: totalFat },
  ].filter(d => d.value > 0);

  // Activity breakdown
  const activityBreakdown: Record<string, number> = {};
  activityRecords.forEach(r => {
    activityBreakdown[r.activityName] = (activityBreakdown[r.activityName] || 0) + r.caloriesBurned;
  });
  const activityPieData = Object.entries(activityBreakdown).map(([name, value]) => ({ name, value }));

  const totalSteps = activityRecords.reduce((s, r) => s + r.steps, 0);
  const totalCalsBurned = activityRecords.reduce((s, r) => s + r.caloriesBurned, 0);
  const totalCalsConsumed = dietRecords.reduce((s, r) => s + r.caloriesConsumed, 0);
  const totalWater = dietRecords.reduce((s, r) => s + r.waterIntakeMl, 0);

  // Average mood (all-time)
  const avgMoodAllTime = moodRecords.length > 0
    ? moodRecords.reduce((s, r) => s + r.mood, 0) / moodRecords.length
    : null;

  const hasMoodData = moodRecords.length > 0;
  const hasMoodInWeek = weekData.some(d => d.mood !== null);

  const hasData = manager.getAll().filter(r => r.type !== "mood").length > 0;

  // Custom tooltip for mood chart
  const MoodTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload && payload.length && payload[0].value != null) {
      const val = Math.round(payload[0].value);
      return (
        <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm text-xs">
          <div className="font-medium text-gray-700">{label}</div>
          <div className="text-violet-600 mt-0.5">
            {MOOD_EMOJIS[val]} {["", "Terrible", "Bad", "Okay", "Good", "Excellent"][val]}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="px-6 py-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Trends & Analytics</h1>
          <p className="text-sm text-gray-500">7-day overview and all-time stats</p>
        </div>
      </div>

      {!hasData && !hasMoodData && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">📊</div>
          <div className="text-gray-500 text-sm">Start logging records to see your trends here.</div>
        </div>
      )}

      {(hasData || hasMoodData) && (
        <>
          {/* All-time totals */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <TotalCard icon={<Footprints className="w-4 h-4 text-emerald-600" />} label="Total Steps" value={totalSteps.toLocaleString()} bg="bg-emerald-50" color="text-emerald-700" />
            <TotalCard icon={<Flame className="w-4 h-4 text-orange-500" />} label="Total Burned" value={`${totalCalsBurned.toLocaleString()} kcal`} bg="bg-orange-50" color="text-orange-700" />
            <TotalCard icon={<UtensilsCrossed className="w-4 h-4 text-purple-500" />} label="Total Consumed" value={`${totalCalsConsumed.toLocaleString()} kcal`} bg="bg-purple-50" color="text-purple-700" />
            <TotalCard icon={<Droplets className="w-4 h-4 text-blue-500" />} label="Total Water" value={`${(totalWater / 1000).toFixed(1)} L`} bg="bg-blue-50" color="text-blue-700" />
          </div>

          {hasData && (
            <>
              {/* Steps Chart */}
              <ChartCard title="Daily Steps (7 Days)">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={weekData} margin={{ top: 4, right: 10, bottom: 0, left: -10 }}>
                    <defs>
                      <linearGradient id="stepsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
                    <Area type="monotone" dataKey="steps" stroke="#10b981" fill="url(#stepsGrad)" strokeWidth={2} name="Steps" dot={{ r: 3, fill: "#10b981" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Calorie Balance */}
              <ChartCard title="Calorie Balance (7 Days)">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weekData} margin={{ top: 4, right: 10, bottom: 0, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Bar dataKey="caloriesConsumed" fill="#8b5cf6" name="Consumed" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="caloriesBurned" fill="#f97316" name="Burned" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Water intake */}
              <ChartCard title="Water Intake (7 Days)">
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={weekData} margin={{ top: 4, right: 10, bottom: 0, left: -10 }}>
                    <defs>
                      <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                      formatter={(v: number) => [`${v} ml`, "Water"]}
                    />
                    <Area type="monotone" dataKey="water" stroke="#3b82f6" fill="url(#waterGrad)" strokeWidth={2} name="Water (ml)" dot={{ r: 3, fill: "#3b82f6" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </>
          )}

          {/* Mood Trend */}
          {hasMoodInWeek && (
            <ChartCard title="Mood Trend (7 Days)">
              <div className="flex items-center gap-4 mb-3">
                <Brain className="w-4 h-4 text-violet-500" />
                <span className="text-xs text-gray-500">1 = Terrible · 5 = Excellent</span>
                {avgMoodAllTime !== null && (
                  <span className="ml-auto text-xs text-violet-600 font-medium">
                    Avg: {MOOD_EMOJIS[Math.round(avgMoodAllTime)]} {avgMoodAllTime.toFixed(1)}
                  </span>
                )}
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={weekData} margin={{ top: 4, right: 10, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis
                    domain={[1, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => MOOD_EMOJIS[v]}
                  />
                  <Tooltip content={<MoodTooltip />} />
                  <ReferenceLine y={3} stroke="#e5e7eb" strokeDasharray="4 4" />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    dot={{ r: 5, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6 }}
                    connectNulls={false}
                    name="Mood"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {/* Macros + Activity Pies */}
          {hasData && (
            <div className="grid md:grid-cols-2 gap-4">
              {macroData.length > 0 && (
                <ChartCard title="Macronutrient Distribution">
                  <div className="flex items-center gap-4">
                    <PieChart width={140} height={140}>
                      <Pie data={macroData} cx={65} cy={65} innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                        {macroData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: "10px", fontSize: "11px" }} formatter={(v: number) => [`${v}g`]} />
                    </PieChart>
                    <div className="space-y-2">
                      {macroData.map((d, i) => (
                        <div key={d.name} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                          <span className="text-xs text-gray-600">{d.name}: <span className="font-medium">{d.value}g</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ChartCard>
              )}
              {activityPieData.length > 0 && (
                <ChartCard title="Calories Burned by Activity">
                  <div className="flex items-center gap-4">
                    <PieChart width={140} height={140}>
                      <Pie data={activityPieData} cx={65} cy={65} innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                        {activityPieData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: "10px", fontSize: "11px" }} formatter={(v: number) => [`${v} kcal`]} />
                    </PieChart>
                    <div className="space-y-2 overflow-hidden">
                      {activityPieData.map((d, i) => (
                        <div key={d.name} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                          <span className="text-xs text-gray-600 truncate">{d.name}: <span className="font-medium">{d.value} kcal</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ChartCard>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TotalCard({ icon, label, value, bg, color }: { icon: React.ReactNode; label: string; value: string; bg: string; color: string }) {
  return (
    <div className={`${bg} rounded-2xl p-4 border border-white`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className={`text-xs ${color}`}>{label}</span>
      </div>
      <div className={`text-lg font-semibold ${color}`}>{value}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-5 mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}
