import axios from 'axios';

const adminApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
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
