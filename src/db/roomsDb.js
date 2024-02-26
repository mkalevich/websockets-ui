export const roomsDb = [];

export const saveRoomToDb = (room) => {
  roomsDb.push(room);
};

export const addUserToRoomInDb = ({ roomId, user }) => {
  roomsDb.forEach((room) => {
    const isCurrentRoomExists = room.roomId === roomId;

    if (isCurrentRoomExists) {
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
export const getAllRooms = () => roomsDb;
