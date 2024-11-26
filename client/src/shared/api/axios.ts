import axios from 'axios';

const adminApi = axios.create({
  baseURL: '/api',
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('authorization');
  if (token) {
    config.headers.Authorization = token.startsWith('Bearer ')
      ? token
      : `Bearer ${token}`;
  }
  return config;
});

export const albumAPI = {
  createAlbum: async (formData: FormData) => {
    return adminApi.post('/admin/album', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
