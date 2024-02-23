import { WebSocketServer } from "ws";
import { httpServer } from "./src/http_server/index.js";
import { websocketController } from "./src/controllers/websocket-controller/websocketController.js";

const HTTP_PORT = 8180;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

export const wss = new WebSocketServer({ port: 3000 });

wss.on("connection", websocketController);
