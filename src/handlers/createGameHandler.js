import { WEBSOCKET_COMMANDS } from "../controllers/constants.js";
import { randomUUID } from "crypto";
import { wss } from "../../index.js";
import { WebSocket } from "ws";
import { roomsDb } from "../db/roomsDb.js";
import { updateRoom } from "./updateRoom.js";
import { getFilledRoomDataByUserId } from "../helpers.js";

export const createGameHandler = (isGameReadyToCreate, ws) => {
  if (isGameReadyToCreate) {
    const idGame = randomUUID();

    wss.clients.forEach((client) => {
      const idPlayer = client.user.id;

      const startGamePayload = {
        type: WEBSOCKET_COMMANDS.CREATE_GAME,
        data: JSON.stringify({ idGame, idPlayer }),
        id: 0,
      };

      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(startGamePayload));
      }
    });

    const roomIndex = roomsDb.findIndex(
      ({ roomId }) => roomId === getFilledRoomDataByUserId(ws.user.id).roomId,
    );
    roomsDb.splice(roomIndex, 1);

    updateRoom();
  }
};
