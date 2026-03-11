import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 60000, // 60s — AI generation can take time
});

export interface UploadResponse {
  success: boolean;
  message: string;
  summary: string;
  summaryHtml: string;
  emailSent: boolean;
}

export const uploadFile = async (file: File, email: string): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('email', email);

  const { data } = await api.post<UploadResponse>('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
};

export default api;
