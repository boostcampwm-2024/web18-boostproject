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
  getComment: async (albumId: string) => {
    const { data } = await publicInstance.get(`/comment/album/${albumId}`);
    return data;
  },
  getAlbumInfo: async (albumId: string) => {
    const { data } = await publicInstance.get(`/album/${albumId}`);
    return data;
  },
  createComment: async (albumId: string, content: string) => {
    if (content.length === 0 || content.length > 200) {
      alert(ERROR_MESSAGE.COMMENT.COMMENT_MESSAGE_TO_LONG);
      throw new CustomError(ERROR_MESSAGE.COMMENT.COMMENT_MESSAGE_TO_LONG);
    }
    const { data } = await publicInstance.post(`/comment/album/${albumId}`, {
      content,
    });
    return data;
  },
};
