import { WebSocket } from "ws";
import { wss } from "../../index.js";
import { WEBSOCKET_COMMANDS } from "../controllers/constants.js";
import { userTurn } from "../db/usersDb.js";

export const finishGameHandler = () => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const finishPayload = {
        type: WEBSOCKET_COMMANDS.FINISH,
        data: JSON.stringify({
          winPlayer: userTurn.nextUserTurnId,
        }),
        id: 0,
      };

      client.send(JSON.stringify(finishPayload));
    }
  });
};
