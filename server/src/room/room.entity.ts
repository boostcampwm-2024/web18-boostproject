export class Room {
  id: string;
  name: string;
  hostId: string;
  createdAt: Date;
  
  constructor(partial: Partial<Room>) {
    Object.assign(this, partial);
  }
}