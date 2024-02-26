import { WEBSOCKET_COMMANDS } from "./controllers/constants.js";
import { roomsDb } from "./db/roomsDb.js";

export const getAttackPayload = (x, y, currentPlayer, status) => ({
  type: WEBSOCKET_COMMANDS.ATTACK,
  data: JSON.stringify({
    position: {
      x,
      y,
    },
    currentPlayer,
    status,
  }),
  id: 0,
});

export const getTurnPayload = (currentPlayer) => ({
  type: WEBSOCKET_COMMANDS.TURN,
  data: JSON.stringify({
    currentPlayer,
  }),
  id: 0,
});

export const getFilledRoomDataByUserId = (userId) => {
  return roomsDb.reduce((acc, room) => {
    const allUsersInRoom = room.roomUsers.filter((u) => u.index === userId);

    if (allUsersInRoom.length === 2) {
      return room.roomId;
    }

    return { roomId: acc, allUsersInRoom };
  }, 0);
};
