import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, History, LogOut, Radar, Shield, ShieldAlert, Users } from 'lucide-react';
import { clearTokens } from '../api/client';

const nav = [
  { to: '/app', label: 'Dashboard', icon: BarChart3, end: true },
  { to: '/app/scan', label: 'Scan', icon: Radar },
  { to: '/app/history', label: 'History', icon: History },
  { to: '/app/admin', label: 'Admin', icon: Users },
];

export default function AppShell() {
  const navigate = useNavigate();

  const logout = () => {
    clearTokens();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-shield-black aurora">
      <div className="fixed inset-0 cyber-grid opacity-50" />
      <div className="relative flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-black/25 p-5 backdrop-blur-xl lg:block">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-shield-blue/15 p-3 text-shield-blue">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <div>
              <p className="font-bold">AI CyberShield</p>
              <p className="text-xs text-slate-400">Threat Intelligence Console</p>
            </div>
          </div>
          <nav className="mt-10 space-y-2">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-shield-blue/15 text-shield-blue' : 'text-slate-300 hover:bg-white/8 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={logout}
            className="mt-10 flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/8"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-shield-black/70 px-4 py-3 backdrop-blur-xl lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-shield-emerald lg:hidden" />
                <div>
                  <p className="text-sm text-slate-400">Live Operations</p>
                  <h1 className="text-lg font-semibold">Real-time phishing defense</h1>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-md border border-shield-emerald/20 bg-shield-emerald/10 px-3 py-2 text-sm text-shield-emerald">
                <span className="h-2 w-2 rounded-full bg-shield-emerald" />
                API Online
              </div>
            </div>
            <nav className="mt-3 grid grid-cols-4 gap-2 lg:hidden">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center justify-center rounded-md p-2 ${isActive ? 'bg-shield-blue/15 text-shield-blue' : 'bg-white/5 text-slate-300'}`
                  }
                  title={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </NavLink>
              ))}
            </nav>
          </header>

          <motion.div className="p-4 lg:p-8" layout>
            <Outlet />
          </motion.div>
        </section>
      </div>
    </div>
  );
}
