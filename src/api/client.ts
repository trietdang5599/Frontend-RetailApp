import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ error?: string; errors?: string[] }>) => {
    const data = error.response?.data;
    const message =
      data?.errors?.join(', ') ||
      data?.error ||
      error.message ||
      'An unexpected error occurred';

    if (error.response?.status !== 404) {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);
