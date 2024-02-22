import { addGameDataToDb, getAllBoardData } from "../db/boardDb.js";
import {
  MAX_PLAYER_SHIPS_PER_GAME,
  MAX_ROOM_PLAYERS_COUNT,
} from "../controllers/websocket-commands-allocator/constants.js";
import { startGameHandler } from "./startGameHandler.js";

export const addShipsHandler = (data, ws) => {
  const { gameId, ships } = JSON.parse(data);

  const formattedShips = ships.map((ship) => {
    ship.positions = [];
    ship.positionsAroundShip = [];
    ship.state = true;

    for (let i = 0; i < ship.length; i++) {
      if (ship.direction) {
        ship.positions.push({
          x: ship.position.x,
          y: ship.position.y + i,
          status: true,
        });

        ship.positionsAroundShip.push({
          x: ship.position.x - 1,
          y: ship.position.y + i,
        });
        ship.positionsAroundShip.push({
          x: ship.position.x + 1,
          y: ship.position.y + i,
        });
      } else {
        ship.positions.push({
          x: ship.position.x + i,
          y: ship.position.y,
          status: true,
        });

        ship.positionsAroundShip.push({
          x: ship.position.x + i,
          y: ship.position.y - 1,
        });
        ship.positionsAroundShip.push({
          x: ship.position.x + i,
          y: ship.position.y + 1,
        });
      }

      if (ship.direction) {
        ship.positionsAroundShip.push({
          x: ship.position.x - 1,
          y: ship.position.y - 1,
        });
        ship.positionsAroundShip.push({
          x: ship.position.x + 1,
          y: ship.position.y - 1,
        });

        ship.positionsAroundShip.push({
          x: ship.position.x - 1,
          y: ship.position.y + ship.length,
        });
        ship.positionsAroundShip.push({
          x: ship.position.x + 1,
          y: ship.position.y + ship.length,
        });
      } else {
        ship.positionsAroundShip.push({
          x: ship.position.x - 1,
          y: ship.position.y - 1,
        });
        ship.positionsAroundShip.push({
          x: ship.position.x - 1,
          y: ship.position.y + 1,
        });
        ship.positionsAroundShip.push({
          x: ship.position.x + ship.length,
          y: ship.position.y - 1,
        });
        ship.positionsAroundShip.push({
          x: ship.position.x + ship.length,
          y: ship.position.y + 1,
        });
      }

      if (ship.direction) {
        ship.positionsAroundShip.push({
          x: ship.position.x,
          y: ship.position.y - 1,
        });
        ship.positionsAroundShip.push({
          x: ship.position.x,
          y: ship.position.y + ship.length,
        });
      } else {
        ship.positionsAroundShip.push({
          x: ship.position.x - 1,
          y: ship.position.y,
        });
        ship.positionsAroundShip.push({
          x: ship.position.x + ship.length,
          y: ship.position.y,
        });
      }
    }

    return ship;
  });

  addGameDataToDb(formattedShips, gameId, ws.user.id);

  const allBoardData = getAllBoardData();

  const usersShipsAmountCollection = allBoardData.map(
    ({ ships }) => ships.length,
  );

  // Todo: Clear state from previous game to be able to start new one

  const isGameReadyToStart =
    usersShipsAmountCollection.length === MAX_ROOM_PLAYERS_COUNT &&
    usersShipsAmountCollection.every(
      (userShipsAmount) => userShipsAmount === MAX_PLAYER_SHIPS_PER_GAME,
    );

  console.log();

  isGameReadyToStart && startGameHandler(allBoardData, ws);
};
