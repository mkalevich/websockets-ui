import { randomUUID } from "crypto";
import { createUser } from "./createUser.js";
import { updateRoom } from "./updateRoom.js";
import { updateWinnersHandler } from "./updateWinnersHandler.js";

export const registerUser = (data, ws) => {
  const { name, password } = JSON.parse(data);

  const user = {
    id: randomUUID(),
    name,
    password,
  };

  // Save user data to WebSocket instance to be able to identify by id
  ws.user = user;

  createUser(user, ws);

  updateRoom(ws);

  updateWinnersHandler();
};
