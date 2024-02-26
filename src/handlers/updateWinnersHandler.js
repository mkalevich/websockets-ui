import { WEBSOCKET_COMMANDS } from "../controllers/constants.js";
import { wss } from "../../index.js";
import { WebSocket } from "ws";
import { winnersDb } from "../db/winnersDb.js";

export const updateWinnersHandler = () => {
  const updateWinnersPayload = {
    type: WEBSOCKET_COMMANDS.UPDATE_WINNERS,
    data: JSON.stringify(winnersDb),
    id: 0,
  };

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(updateWinnersPayload));
    }
  });
};
