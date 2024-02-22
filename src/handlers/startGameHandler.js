import { WebSocket } from "ws";
import { wss } from "../../index.js";
import { WEBSOCKET_COMMANDS } from "../controllers/constants.js";
import { getTurnPayload } from "../helpers.js";
import { userTurn } from "../db/usersDb.js";

export const startGameHandler = (allGameData, ws) => {
  wss.clients.forEach((client) => {
    const gameData = allGameData.find(
      ({ userId }) => userId === client.user.id,
    );

    const startGamePayload = {
      type: WEBSOCKET_COMMANDS.START_GAME,
      data: JSON.stringify({
        ships: gameData?.ships ?? [],
        currentPlayerIndex: client.user.id,
      }),
      id: 0,
    };

    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(startGamePayload));

      userTurn.nextUserTurnId = ws.user.id;
      const turnPayload = getTurnPayload(ws.user.id);
      client.send(JSON.stringify(turnPayload));
    }
  });
};
