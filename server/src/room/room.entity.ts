export class Room {
  id: string;
  hostId: string;
  createdAt: Date;
  
  constructor(partial: Partial<Room>) {
    Object.assign(this, partial);
  }
}