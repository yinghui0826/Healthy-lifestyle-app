import { NavLink, Outlet } from "react-router";
import {
  LayoutDashboard,
  Dumbbell,
  Salad,
  ClipboardList,
  Heart,
  TrendingUp,
  LogOut,
  User,
  Brain,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/activity", label: "Log Activity", icon: Dumbbell },
  { to: "/diet", label: "Log Diet", icon: Salad },
  { to: "/mood", label: "Log Mood", icon: Brain },
  { to: "/history", label: "History", icon: ClipboardList },
  { to: "/trends", label: "Trends", icon: TrendingUp },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-[#f4f7f6]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 leading-none">HealthTrack</div>
            <div className="text-xs text-gray-400 mt-0.5">Personal Health Records</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4.5 h-4.5 ${isActive ? "text-emerald-600" : ""}`} />
                  <span className="text-sm">{label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-emerald-700">
                {user ? getInitials(user.displayName) : "?"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800 truncate">{user?.displayName}</div>
              <div className="text-xs text-gray-400 truncate">@{user?.username}</div>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex justify-around px-2 py-2 shadow-lg">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all ${
                isActive ? "text-emerald-600" : "text-gray-400"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? "text-emerald-500" : ""}`} />
                <span className="text-[10px]">{label}</span>
              </>
            )}
          </NavLink>
        ))}
        {/* Mobile logout */}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all text-gray-400 hover:text-red-500"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px]">Logout</span>
        </button>
      </nav>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-900">HealthTrack</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-emerald-700">
              {user ? getInitials(user.displayName) : <User className="w-3.5 h-3.5" />}
            </span>
          </div>
          <span className="text-xs text-gray-500">{user?.displayName}</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 pt-14 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
