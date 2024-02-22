import { WEBSOCKET_COMMANDS } from "../constants.js";
import { registerUser } from "../../handlers/registerUser.js";
import { createRoom } from "../../handlers/createRoom.js";
import { addUserToRoomHandler } from "../../handlers/addUserToRoomHandler.js";
import { getAllRooms } from "../../db/roomsDb.js";
import { ATTACK_STATUSES, MAX_ROOM_PLAYERS_COUNT } from "./constants.js";
import { createGameHandler } from "../../handlers/createGameHandler.js";
import { wss } from "../../../index.js";
import { WebSocket } from "ws";
import { getAllBoardData } from "../../db/boardDb.js";
import { addShipsHandler } from "../../handlers/addShipsHandler.js";
import { attackHandler } from "../../handlers/attackHandler.js";

export const websocketCommandsAllocator = ({ response, ws }) => {
  const websocketCommand = response.type;

  switch (websocketCommand) {
    case WEBSOCKET_COMMANDS.REG:
      registerUser(response.data, ws);

      break;
    case WEBSOCKET_COMMANDS.CREATE_ROOM:
      createRoom(ws);

      break;
    case WEBSOCKET_COMMANDS.ADD_USER_TO_ROOM:
      const { indexRoom } = JSON.parse(response.data);

      addUserToRoomHandler(indexRoom, ws);

      const { roomUsers } =
        getAllRooms().find(({ roomId }) => roomId === indexRoom) ?? [];

      const isGameReadyToCreate = roomUsers.length === MAX_ROOM_PLAYERS_COUNT;

      createGameHandler(isGameReadyToCreate, ws);

      break;
    case WEBSOCKET_COMMANDS.ADD_SHIPS:
      addShipsHandler(response.data, ws);

      break;
    case WEBSOCKET_COMMANDS.ATTACK:
      attackHandler(response);

      break;
    case WEBSOCKET_COMMANDS.RANDOM_ATTACK:
      // const { gameId, indexPlayer } = JSON.parse(response.data);

      break;
  }
};
