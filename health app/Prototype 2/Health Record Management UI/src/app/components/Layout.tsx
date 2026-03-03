import { NavLink, Outlet } from "react-router";
import {
  LayoutDashboard,
  Dumbbell,
  Salad,
  ClipboardList,
  Heart,
  TrendingUp,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/activity", label: "Log Activity", icon: Dumbbell },
  { to: "/diet", label: "Log Diet", icon: Salad },
  { to: "/history", label: "History", icon: ClipboardList },
  { to: "/trends", label: "Trends", icon: TrendingUp },
];

export function Layout() {
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

        <div className="px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">Data saved locally on your device.</p>
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
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}