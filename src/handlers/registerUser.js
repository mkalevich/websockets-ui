import { randomUUID } from "crypto";
import { createUser } from "./createUser.js";
import { updateRoom } from "./updateRoom.js";

export const users = new Map();

export const registerUser = (data, ws) => {
  const { name, password } = JSON.parse(data);

  const user = {
    id: randomUUID(),
    name,
    password,
  };

  ws.user = user;

  users.set(ws, user.id);

  createUser(user, ws);

  updateRoom(ws);
};
