export const usersDb = [];

export const userTurn = {
  nextUserTurnId: "",
};

export const saveUserToDb = (user) => {
  usersDb.push(user);
};
