import { getAllRooms, roomsDb } from "../db/roomsDb.js";
import { WEBSOCKET_COMMANDS } from "../controllers/constants.js";
import { broadcastMessage } from "../controllers/heplers.js";

export const updateRoom = (ws) => {
  const allRooms = roomsDb.length ? [...getAllRooms()] : [];

  const updateRoomPayload = {
    type: WEBSOCKET_COMMANDS.UPDATE_ROOM,
    data: JSON.stringify(allRooms),
    id: 0,
  };

  broadcastMessage(JSON.stringify(updateRoomPayload));
};
