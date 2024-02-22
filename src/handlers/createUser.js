import { WEBSOCKET_COMMANDS } from "../controllers/constants.js";
import { saveUserToDb } from "../db/usersDb.js";

export const createUser = (user, ws) => {
  const createUserPayload = {
    type: WEBSOCKET_COMMANDS.REG,
    data: JSON.stringify({
      name: user.name,
      index: user.id,
      error: false,
      errorText: "",
    }),
    id: 0,
  };

  saveUserToDb(user);

  ws.send(JSON.stringify(createUserPayload));
};
