import { useState, useCallback } from 'react';
import { uploadFile } from '../services/api';
import { AxiosError } from 'axios';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UseUploadReturn {
  upload: (file: File, email: string) => Promise<void>;
  status: UploadStatus;
  message: string;
  summary: string;
}

export const useUpload = (): UseUploadReturn => {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [message, setMessage] = useState('');
  const [summary, setSummary] = useState('');

  const upload = useCallback(async (file: File, email: string) => {
    setStatus('uploading');
    setMessage('Analyzing your data and generating report...');
    setSummary('');

    try {
      const result = await uploadFile(file, email);
      setStatus('success');
      setMessage(result.message);
      setSummary(result.summaryHtml || result.summary || '');
    } catch (err) {
      setStatus('error');
      setSummary('');
      if (err instanceof AxiosError) {
        setMessage(err.response?.data?.error || 'Upload failed. Please try again.');
      } else {
        setMessage('An unexpected error occurred.');
      }
    }
  }, []);

  return { upload, status, message, summary };
};
