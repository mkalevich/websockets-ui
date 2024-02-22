import { randomUUID } from "crypto";
import { WEBSOCKET_COMMANDS } from "../controllers/constants.js";
import { saveRoomToDb } from "../db/roomsDb.js";
import { wss } from "../../index.js";
import { WebSocket } from "ws";
import { addUserToRoomHandler } from "./addUserToRoomHandler.js";

export const createRoom = (ws) => {
  const roomId = randomUUID();

  saveRoomToDb({
    roomId: roomId,
    roomUsers: [],
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const createRoomPayload = {
        type: WEBSOCKET_COMMANDS.UPDATE_ROOM,
        data: JSON.stringify([
          {
            roomId: roomId,
            roomUsers: [],
          },
        ]),
        id: 0,
      };

      client.send(JSON.stringify(createRoomPayload));
    }
  });

  addUserToRoomHandler(roomId, ws);
};
