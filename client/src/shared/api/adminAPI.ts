import axios from 'axios';

const adminApi = axios.create({
  baseURL: `http://localhost:3000/api`,
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
