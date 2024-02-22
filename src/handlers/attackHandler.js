import { getAllBoardData } from "../db/boardDb.js";
import { ATTACK_STATUSES } from "../controllers/websocket-commands-allocator/constants.js";
import { wss } from "../../index.js";
import { WebSocket } from "ws";
import { getAttackPayload, getTurnPayload } from "../helpers.js";
import { usersDb, userTurn } from "../db/usersDb.js";
import { finishGameHandler } from "./finishGameHandler.js";
import { updateWinnersHandler } from "./updateWinnersHandler.js";
import { winnersDb } from "../db/winnersDb.js";

export const attackHandler = (data) => {
  const { x, y, gameId, indexPlayer } = JSON.parse(data);

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
        ship.state = false;

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

  const isGameFinished = enemyData?.ships.every((ship) => !ship.state);

  if (isGameFinished) {
    finishGameHandler();

    const currentUser = usersDb.find((user) => user.id === indexPlayer);

    const winner = winnersDb.find((user) => user.username === currentUser.name);

    if (winner) {
      winnersDb.forEach((u) => {
        if (u.username === currentUser.name) {
          u.wins += u.wins;

          updateWinnersHandler(u.username, u.wins);
        }
      });
    } else {
      winnersDb.push({ username: currentUser.name, wins: 1 });
      updateWinnersHandler(currentUser.name, 1);
    }
  }
};
