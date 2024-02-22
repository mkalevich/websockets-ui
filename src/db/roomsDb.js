export const roomsDb = [];

export const saveRoomToDb = (room) => {
  roomsDb.push(room);
};

export const addUserToRoom = ({ roomId, user }) => {
  roomsDb.forEach((room) => {
    if (room.roomId === roomId) {
      const isUserExistsInRoom = room?.roomUsers.find(
        (userInRoom) => userInRoom.index === user.id,
      );

      if (!isUserExistsInRoom) {
        room.roomUsers = [
          ...room.roomUsers,
          { name: user.name, index: user.id },
        ];
      }
    }
  });
};
export const getAllRooms = () => {
  return roomsDb;
};
