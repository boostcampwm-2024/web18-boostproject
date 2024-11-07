import { http, HttpResponse } from 'msw';
import rooms from './model/rooms.json';

const getRooms = () => {
  return HttpResponse.json({
    statusCode: 200,
    body: rooms,
    message: 'Rooms fetched successfully.',
  });
};

export const handlers = [http.get('/rooms', getRooms)];
