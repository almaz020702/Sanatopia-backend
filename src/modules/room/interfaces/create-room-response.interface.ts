interface IMessage {
  message: string;
}

export interface CreateRoomResponse extends IMessage {
  roomId: number;
}

export interface CreateRoomsResponse extends IMessage {
  roomIds: number[];
}
