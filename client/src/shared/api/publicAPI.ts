import axios, { AxiosError, AxiosInstance } from 'axios';
import { ERROR_MESSAGE } from './errorMessage';

// class APIError extends Error {
//   statueCode: number;
//   originalError: Error;

//   constructor(statueCode: number, message: string, originalError: Error) {
//     super(message);
//     this.name = 'APIError';
//     this.statueCode = statueCode;
//     this.originalError = originalError;
//   }
// }

enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN',
}

const publicInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

publicInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let errorType: ErrorType = ErrorType.UNKNOWN;
    let errorMessage = '알 수 없는 에러가 발생했습니다.';

    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          errorType = ErrorType.NETWORK_ERROR;
          errorMessage = ERROR_MESSAGE.HTTP[400];
          break;
        case 403:
          errorType = ErrorType.NETWORK_ERROR;
          errorMessage = ERROR_MESSAGE.HTTP[403];
          break;
        case 404:
          errorType = ErrorType.NOT_FOUND;
          errorMessage = ERROR_MESSAGE.HTTP[404];
          break;
        case 500:
          errorType = ErrorType.SERVER_ERROR;
          errorMessage = ERROR_MESSAGE.HTTP[500];
          break;
        case 502:
          errorType = ErrorType.SERVER_ERROR;
          errorMessage = ERROR_MESSAGE.HTTP[502];
          break;
        default:
          errorMessage = `${status} ${error.response.statusText}`;
      }

      console.error(
        `[API Error] ${status}: ${errorMessage}`,
        error.response.data,
      );
    } else if (error.request) {
      // 요청 에러 처리
      console.error('[API Error] Network Error');
    } else {
      // 기타 에러 처리
      console.error('[API Error] Unknown Error');
    }
    return Promise.reject(error);
  },
);

export const publicAPI = {
  getAlbumSidebar: async () => {
    try {
      const { data } = await publicInstance.get('/album/sidebar');
      return data;
    } catch (error) {
      throw error;
    }
  },
  getAlbumBanner: async () => {
    try {
      const { data } = await publicInstance.get('/album/banner');
      return data;
    } catch (error) {
      throw error;
    }
  },
};
