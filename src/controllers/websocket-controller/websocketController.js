import { parseJsonResponse } from "../heplers.js";
import { websocketCommandsAllocator } from "../websocket-commands-allocator/websocketCommandsAllocator.js";

export const websocketController = (ws) => {
  ws.on("message", (clientResponse) => {
    const response = parseJsonResponse(clientResponse);

    websocketCommandsAllocator({ response, ws });
  });
};
