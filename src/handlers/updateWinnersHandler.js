import { WEBSOCKET_COMMANDS } from "../controllers/constants.js";
import { getAllRooms, roomsDb } from "../db/roomsDb.js";
import { wss } from "../../index.js";
import { WebSocket } from "ws";
import { getAttackPayload } from "../helpers.js";
import { ATTACK_STATUSES } from "../controllers/websocket-commands-allocator/constants.js";

export const updateWinnersHandler = (userName, winsNumber) => {
  const updateWinnersPayload = {
    type: WEBSOCKET_COMMANDS.UPDATE_WINNERS,
    data: JSON.stringify([
      {
        name: userName,
        wins: winsNumber,
      },
    ]),
    id: 0,
  };

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(updateWinnersPayload));
    }
  });
};
