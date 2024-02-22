import { WEBSOCKET_COMMANDS } from "../controllers/constants.js";
import { randomUUID } from "crypto";
import { broadcastMessage } from "../controllers/heplers.js";
import { wss } from "../../index.js";
import { WebSocket } from "ws";

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

    const updateRoomPayload = {
      type: WEBSOCKET_COMMANDS.UPDATE_ROOM,
      data: JSON.stringify([]),
      id: 0,
    };

    broadcastMessage(updateRoomPayload);
  }
};
