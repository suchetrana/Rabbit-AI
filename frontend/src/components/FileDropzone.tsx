import React, { useCallback, useRef } from 'react';

interface FileDropzoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const FileDropzone: React.FC<FileDropzoneProps> = ({ file, onFileSelect, onFileClear, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && ACCEPTED_TYPES.includes(droppedFile.type)) {
        onFileSelect(droppedFile);
      }
    },
    [disabled, onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        onFileSelect(selectedFile);
      }
    },
    [onFileSelect]
  );

  if (file) {
    return (
      <div className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-2xl">description</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
          <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
        </div>
        <button
          type="button"
          onClick={onFileClear}
          disabled={disabled}
          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
          aria-label="Remove file"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className="group relative flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 transition-all cursor-pointer ring-offset-4 ring-offset-background-light dark:ring-offset-background-dark hover:ring-2 hover:ring-primary/10"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx"
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />
      <div className="flex flex-col items-center gap-5">
        <div className="size-20 bg-white dark:bg-slate-800 shadow-sm rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform border border-slate-100 dark:border-slate-700">
          <span className="material-symbols-outlined text-4xl">cloud_upload</span>
        </div>
        <div className="text-center space-y-1">
          <p className="text-xl font-bold text-slate-900 dark:text-white">Drag and drop files</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Supported formats: .csv, .xlsx (Max 10MB)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-[1px] w-8 bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or</span>
          <div className="h-[1px] w-8 bg-slate-200 dark:bg-slate-700" />
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
          className="px-8 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        >
          Browse Local Files
        </button>
      </div>
    </div>
  );
};

export default FileDropzone;
