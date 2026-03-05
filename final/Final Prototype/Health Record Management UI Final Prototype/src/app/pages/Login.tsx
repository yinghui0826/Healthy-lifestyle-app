import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Heart,
  Eye,
  EyeOff,
  AlertCircle,
  Dumbbell,
  Salad,
  TrendingUp,
  User,
} from "lucide-react";
import { motion } from "motion/react";

type Tab = "login" | "register";

export function Login() {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Login fields
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  // Register fields
  const [regForm, setRegForm] = useState({ username: "", displayName: "", password: "", confirm: "" });

  const setLogin = (k: string, v: string) => setLoginForm(f => ({ ...f, [k]: v }));
  const setReg = (k: string, v: string) => setRegForm(f => ({ ...f, [k]: v }));

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result = login(loginForm.username, loginForm.password);
      if (!result.success) setError(result.error || "Login failed.");
      setLoading(false);
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (regForm.password !== regForm.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = register(regForm.username, regForm.displayName, regForm.password);
      if (!result.success) setError(result.error || "Registration failed.");
      setLoading(false);
    }, 400);
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setError("");
    setShowPassword(false);
  };

  const fillDemo = () => {
    if (tab === "login") {
      setLoginForm({ username: "demo", password: "demo123" });
      // Auto-register demo if not present
      register("demo", "Demo User", "demo123");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex">
      {/* Left Panel – Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-emerald-500 to-emerald-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-lg font-semibold">HealthTrack</span>
        </div>

        <div>
          <h1 className="text-white text-4xl font-semibold leading-snug mb-4">
            Your personal<br />health journal.
          </h1>
          <p className="text-emerald-100 text-sm leading-relaxed mb-10">
            Log activities, track meals, monitor your water intake,
            and visualise your progress — all saved securely on your device.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3">
            {[
              { icon: <Dumbbell className="w-4 h-4" />, label: "Activity & Exercise Logging" },
              { icon: <Salad className="w-4 h-4" />, label: "Nutrition & Meal Tracking" },
              { icon: <TrendingUp className="w-4 h-4" />, label: "7-Day Charts & Analytics" },
              { icon: <User className="w-4 h-4" />, label: "Mood & Mental Health Tracking" },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                <div className="text-emerald-200">{f.icon}</div>
                <span className="text-white text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-emerald-300 text-xs">
          Data is stored locally on your device. No account servers involved.
        </p>
      </div>

      {/* Right Panel – Auth Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-900 font-semibold">HealthTrack</span>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            {tab === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {tab === "login"
              ? "Sign in to access your health records."
              : "Start tracking your health journey today."}
          </p>

          {/* Tab switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {(["login", "register"] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  tab === t
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <Field label="Username">
                <input
                  type="text"
                  autoComplete="username"
                  value={loginForm.username}
                  onChange={e => setLogin("username", e.target.value)}
                  placeholder="your_username"
                  required
                  className="auth-input"
                />
              </Field>

              <Field label="Password">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={loginForm.password}
                    onChange={e => setLogin("password", e.target.value)}
                    placeholder="••••••••"
                    required
                    className="auth-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-medium transition-colors mt-2"
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <button
                type="button"
                onClick={fillDemo}
                className="w-full border border-gray-200 hover:bg-gray-50 text-gray-600 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" /> Continue as Demo User
              </button>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <Field label="Display Name">
                <input
                  type="text"
                  autoComplete="name"
                  value={regForm.displayName}
                  onChange={e => setReg("displayName", e.target.value)}
                  placeholder="Alex Johnson"
                  required
                  className="auth-input"
                />
              </Field>

              <Field label="Username">
                <input
                  type="text"
                  autoComplete="username"
                  value={regForm.username}
                  onChange={e => setReg("username", e.target.value)}
                  placeholder="alex_johnson"
                  required
                  className="auth-input"
                />
                <p className="text-xs text-gray-400 mt-1">Letters, numbers, and underscores only.</p>
              </Field>

              <Field label="Password">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={regForm.password}
                    onChange={e => setReg("password", e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="auth-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>

              <Field label="Confirm Password">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={regForm.confirm}
                  onChange={e => setReg("confirm", e.target.value)}
                  placeholder="Repeat your password"
                  required
                  className="auth-input"
                />
              </Field>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-medium transition-colors"
              >
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>
          )}

          <p className="text-xs text-gray-400 text-center mt-6">
            All data is stored locally on your device only.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
