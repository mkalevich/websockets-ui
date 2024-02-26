import { randomUUID } from "crypto";
import { saveRoomToDb } from "../db/roomsDb.js";
import { addUserToRoomHandler } from "./addUserToRoomHandler.js";

export const createRoom = (ws) => {
  const roomId = randomUUID();

  saveRoomToDb({
    roomId: roomId,
    roomUsers: [],
  });

  addUserToRoomHandler(roomId, ws);
};
