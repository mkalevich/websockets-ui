import { WEBSOCKET_COMMANDS } from "./controllers/constants.js";

export const getAttackPayload = (x, y, currentPlayer, status) => ({
  type: WEBSOCKET_COMMANDS.ATTACK,
  data: JSON.stringify({
    position: {
      x,
      y,
    },
    currentPlayer,
    status,
  }),
  id: 0,
});

export const getTurnPayload = (currentPlayer) => ({
  type: WEBSOCKET_COMMANDS.TURN,
  data: JSON.stringify({
    currentPlayer,
  }),
  id: 0,
});
