import React from 'react';

export type BannerStatus = 'idle' | 'uploading' | 'success' | 'error';

interface StatusBannerProps {
  status: BannerStatus;
  message?: string;
}

const config: Record<Exclude<BannerStatus, 'idle'>, { icon: string; bg: string; border: string; text: string }> = {
  uploading: {
    icon: 'hourglass_top',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    text: 'text-primary',
  },
  success: {
    icon: 'check_circle',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-100 dark:border-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
  },
  error: {
    icon: 'error',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    border: 'border-rose-100 dark:border-rose-500/20',
    text: 'text-rose-700 dark:text-rose-400',
  },
};

const StatusBanner: React.FC<StatusBannerProps> = ({ status, message }) => {
  if (status === 'idle') return null;

  const { icon, bg, border, text } = config[status];

  return (
    <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border ${bg} ${border}`} role="alert">
      <span className={`material-symbols-outlined text-[20px] ${text} ${status === 'uploading' ? 'animate-spin' : ''}`}>
        {icon}
      </span>
      <span className={`text-sm font-medium ${text}`}>{message}</span>
    </div>
  );
};

export default StatusBanner;
