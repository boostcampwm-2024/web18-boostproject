import axios, { AxiosError, AxiosInstance, HttpStatusCode } from 'axios';
import { ERROR_MESSAGE } from './errorMessage';

class APIError extends Error {
  statueCode: number;
  originalError: Error;

  constructor(statueCode: number, message: string, originalError?: Error) {
    super(message);
    this.name = 'APIError';
    this.statueCode = statueCode;
    this.originalError = originalError || new Error(message);
  }
}

const publicInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomError';
  }
}

export const publicAPI = {
  getAlbumSidebar: async () => {
    const { data } = await publicInstance.get(`/album/sidebar`);
    return data;
  },
  getAlbumBanner: async () => {
    try {
      const { data } = await publicInstance.get('/album/banner');
      return data;
    } catch (error) {
      throw error;
    }
  },
  getRoomInfo: async (roomId: string) => {
    const { data } = await publicInstance.get(`/room/${roomId}`);
    return data;
  },
  getAlbumEnded: async () => {
    try {
      const { data } = await publicInstance.get('/album/ended');
      return data;
    } catch (error) {
      throw error;
    }
  },
};
