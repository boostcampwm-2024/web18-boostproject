export interface RoomJoinPayload {
  roomId: string;
  userId: string;
}

export interface RoomJoinResponse {
  success: boolean;
  message?: string;
}
