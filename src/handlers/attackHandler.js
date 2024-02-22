import { getAllBoardData } from "../db/boardDb.js";
import { ATTACK_STATUSES } from "../controllers/websocket-commands-allocator/constants.js";
import { wss } from "../../index.js";
import { WebSocket } from "ws";
import { getAttackPayload, getTurnPayload } from "../helpers.js";
import { userTurn } from "../db/usersDb.js";
import { WEBSOCKET_COMMANDS } from "../controllers/constants.js";

export const attackHandler = (response) => {
  const { x, y, gameId, indexPlayer } = JSON.parse(response.data);

  if (indexPlayer !== userTurn.nextUserTurnId) return;

  let status = ATTACK_STATUSES.MISS;

  const enemyData = getAllBoardData().find(
    (data) => data.userId !== indexPlayer,
  );

  enemyData.ships.forEach((ship) => {
    const currentShipPosition = ship.positions.find(
      (shipPosition) => shipPosition.x === x && shipPosition.y === y,
    );

    if (currentShipPosition?.status) {
      currentShipPosition.status = false;
      status = ATTACK_STATUSES.SHOT;
    }

    if (currentShipPosition) {
      const isAllShipPositionsKilled = ship.positions.every(
        ({ status }) => !status,
      );

      if (isAllShipPositionsKilled) {
        status = ATTACK_STATUSES.KILLED;

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            ship.positions.forEach(({ x, y }) => {
              const killedShipPayload = getAttackPayload(
                x,
                y,
                indexPlayer,
                status,
              );

              client.send(JSON.stringify(killedShipPayload));
            });

            ship.positionsAroundShip.forEach(({ x, y }) => {
              const killedShipPositionsAroundPayload = getAttackPayload(
                x,
                y,
                indexPlayer,
                ATTACK_STATUSES.MISS,
              );

              client.send(JSON.stringify(killedShipPositionsAroundPayload));
            });
          }
        });
      }
    }

    const isGameFinished = ship.positions.every((position) => !position.status);

    if (isGameFinished) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          const finishPayload = {
            type: WEBSOCKET_COMMANDS.FINISH,
            data: {
              winPlayer: userTurn.nextUserTurnId,
            },
            id: 0,
          };

          client.send(JSON.stringify(finishPayload));
        }
      });
    }
  });

  status !== ATTACK_STATUSES.KILLED &&
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const attackPayload = getAttackPayload(x, y, indexPlayer, status);
        client.send(JSON.stringify(attackPayload));
      }
    });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const nextPlayerId =
        status === ATTACK_STATUSES.MISS ? enemyData?.userId : indexPlayer;

      userTurn.nextUserTurnId = nextPlayerId;
      const turnPayload = getTurnPayload(nextPlayerId);
      client.send(JSON.stringify(turnPayload));
    }
  });
};
