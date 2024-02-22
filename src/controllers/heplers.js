import { wss } from "../../index.js";
import { WebSocket } from "ws";

export const parseJsonResponse = (response) => {
  return JSON.parse(response.toString());
};

export const broadcastMessage = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};
