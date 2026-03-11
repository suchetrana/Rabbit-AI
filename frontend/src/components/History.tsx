import React from 'react';
import { useApp } from '../context/AppContext';

const History: React.FC = () => {
  const { notifications, setPage } = useApp();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Activity History
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Recent notifications and AI brief generations.
          </p>
        </div>
        <button
          onClick={() => setPage('dashboard')}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Brief
        </button>
      </div>

      {/* Timeline */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl text-slate-400">inbox</span>
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            No activity yet
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            Generate your first AI Brief from the Dashboard to see activity appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl"
            >
              <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {n.message}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {n.time.toLocaleString()}
                </p>
              </div>
              {!n.read && (
                <span className="size-2.5 rounded-full bg-primary flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
