export class Room {
  id: string;
  createdAt: Date;

  constructor(partial: Partial<Room>) {
    Object.assign(this, partial);
  }
}
