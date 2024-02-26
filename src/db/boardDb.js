export const boardDb = [];

export const addGameDataToDb = (ships, gameId, userId) => {
  const gameData = {
    gameId,
    userId,
    ships,
  };

  boardDb.push(gameData);
};

export const getAllBoardData = () => boardDb;

export const clearBoard = () => {
  boardDb.length = 0;
};
