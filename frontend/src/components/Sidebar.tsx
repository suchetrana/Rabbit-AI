import React from 'react';
import { useApp, Page } from '../context/AppContext';

const navItems: { icon: string; label: string; page: Page }[] = [
  { icon: 'dashboard', label: 'Dashboard', page: 'dashboard' },
  { icon: 'history', label: 'History', page: 'history' },
  { icon: 'description', label: 'API Docs', page: 'api-docs' },
];

const Sidebar: React.FC = () => {
  const { page, setPage } = useApp();

  const handleNav = (target: Page) => {
    if (target === 'api-docs') {
      window.open(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api-docs`, '_blank');
      return;
    }
    setPage(target);
  };

  return (
    <aside className="w-72 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between p-6">
      <div className="flex flex-col gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">bolt</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 dark:text-white text-base font-bold leading-none">
              Rabbitt AI
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
              Response Engine
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = item.page !== 'api-docs' && page === item.page;
            return (
              <button
                key={item.label}
                onClick={() => handleNav(item.page)}
                className={
                  isActive
                    ? 'flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white shadow-md shadow-primary/20'
                    : 'flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all'
                }
              >
                <span className={`material-symbols-outlined text-[22px]${isActive ? ' fill-1' : ''}`}>
                  {item.icon}
                </span>
                <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
                {item.page === 'api-docs' && (
                  <span className="material-symbols-outlined text-[16px] ml-auto opacity-50">open_in_new</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              SYSTEM READY
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            All models operational. Latency: 24ms
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
