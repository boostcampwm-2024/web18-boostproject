import axios from 'axios';

const adminInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

adminInstance.interceptors.request.use((config) => {
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
    return adminInstance.post('/admin/album', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
