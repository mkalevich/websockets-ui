import { addUserToRoom, getAllRooms } from "../db/roomsDb.js";
import { WEBSOCKET_COMMANDS } from "../controllers/constants.js";
import { broadcastMessage } from "../controllers/heplers.js";

export const addUserToRoomHandler = (indexRoom, ws) => {
  const user = {
    name: ws.user.name,
    id: ws.user.id,
  };

  addUserToRoom({ roomId: indexRoom, user: user });

  const { roomUsers } =
    getAllRooms().find(({ roomId }) => roomId === indexRoom) ?? [];

  const addUserToRoomPayload = {
    type: WEBSOCKET_COMMANDS.UPDATE_ROOM,
    data: JSON.stringify([
      {
        roomId: indexRoom,
        roomUsers,
      },
    ]),
    id: 0,
  };

  broadcastMessage(addUserToRoomPayload);
};
