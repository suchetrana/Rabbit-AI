import React, { useState, useEffect } from 'react';
import FileDropzone from './FileDropzone';
import StatusBanner, { BannerStatus } from './StatusBanner';
import { useUpload } from '../hooks/useUpload';
import { useApp } from '../context/AppContext';

const DRAFT_KEY = 'rabbitt_draft';

interface Draft {
  email: string;
  projectRef: string;
  context: string;
}

const UploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [projectRef, setProjectRef] = useState('');
  const [context, setContext] = useState('');
  const { upload, status, message, summary } = useUpload();
  const { addNotification } = useApp();

  const isSubmitting = status === 'uploading';

  // Load saved draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const draft: Draft = JSON.parse(saved);
        setEmail(draft.email || '');
        setProjectRef(draft.projectRef || '');
        setContext(draft.context || '');
      }
    } catch { /* ignore corrupt data */ }
  }, []);

  // Reset form on success
  useEffect(() => {
    if (status === 'success') {
      setFile(null);
      setEmail('');
      setProjectRef('');
      setContext('');
      localStorage.removeItem(DRAFT_KEY);
      addNotification(message || 'AI Brief generated and emailed successfully!');
    }
  }, [status, message, addNotification]);

  const handleSaveDraft = () => {
    const draft: Draft = { email, projectRef, context };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    addNotification('Draft saved');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !email) return;
    await upload(file, email);
  };

  return (
    <form className="space-y-10" onSubmit={handleSubmit}>
      {/* Hero Banner */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1.5">
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Generate AI Brief
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Process complex documents and generate instant intelligent responses.
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-emerald-50 dark:bg-emerald-500/10 px-5 py-2.5 rounded-full border border-emerald-100 dark:border-emerald-500/20">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
            System Online
          </span>
        </div>
      </div>

      {/* Status Banner */}
      <StatusBanner status={status as BannerStatus} message={message} />

      {/* AI Summary Result */}
      {summary && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary fill-1">auto_awesome</span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">AI-Generated Summary</h4>
          </div>
          <div
            className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300"
            dangerouslySetInnerHTML={{ __html: summary }}
          />
        </div>
      )}

      {/* File Dropzone */}
      <FileDropzone
        file={file}
        onFileSelect={setFile}
        onFileClear={() => setFile(null)}
        disabled={isSubmitting}
      />

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label htmlFor="email" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
            Recipient Email
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px] transition-colors group-focus-within:text-primary">
              mail
            </span>
            <input
              id="email"
              type="email"
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm"
              placeholder="client@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
            Project Reference
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px] transition-colors group-focus-within:text-primary">
              label
            </span>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm"
              placeholder="e.g. Q3-Report-2024"
              value={projectRef}
              onChange={(e) => setProjectRef(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Additional Context */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
          Additional Context
        </label>
        <textarea
          className="w-full p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm resize-none leading-relaxed"
          placeholder="Provide specific instructions or details for the AI to consider while generating the brief..."
          rows={6}
          value={context}
          onChange={(e) => setContext(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={handleSaveDraft}
          className="px-8 py-3.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          disabled={isSubmitting}
        >
          Save Draft
        </button>
        <button
          type="submit"
          className="flex items-center gap-3 px-12 py-3.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 shadow-xl shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={!file || !email || isSubmitting}
        >
          <span className="material-symbols-outlined text-[20px] fill-1">auto_awesome</span>
          {isSubmitting ? 'Generating...' : 'Generate AI Brief'}
        </button>
      </div>

      {/* Footer Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-slate-200 dark:border-slate-800 pt-10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">
            security
          </span>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Secure Transfer</p>
            <p className="text-[10px] text-slate-500">End-to-end encrypted</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">
            speed
          </span>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Instant Analysis</p>
            <p className="text-[10px] text-slate-500">Powered by Rabbitt V4</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">
            storage
          </span>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Auto Archiving</p>
            <p className="text-[10px] text-slate-500">Stored in history for 30d</p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UploadForm;
