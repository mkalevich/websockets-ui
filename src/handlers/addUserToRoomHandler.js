import { addUserToRoomInDb, getAllRooms } from "../db/roomsDb.js";
import { WEBSOCKET_COMMANDS } from "../controllers/constants.js";
import { broadcastMessage } from "../controllers/heplers.js";

export const addUserToRoomHandler = (indexRoom, ws) => {
  const user = {
    name: ws.user.name,
    id: ws.user.id,
  };

  addUserToRoomInDb({ roomId: indexRoom, user: user });

  const { roomUsers } =
    getAllRooms().find(({ roomId }) => roomId === indexRoom) ?? [];

  const roomsExcludingIndexRoom = getAllRooms().filter(
    (room) => room.roomId !== indexRoom,
  );

  const addUserToRoomPayload = {
    type: WEBSOCKET_COMMANDS.UPDATE_ROOM,
    data: JSON.stringify([
      ...roomsExcludingIndexRoom,
      {
        roomId: indexRoom,
        roomUsers,
      },
    ]),
    id: 0,
  };

  broadcastMessage(addUserToRoomPayload);
};
