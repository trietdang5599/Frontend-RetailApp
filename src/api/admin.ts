import { apiClient } from './client';

export const clearCache = () =>
  apiClient.delete<{ message: string }>('/admin/cache').then((r) => r.data);
