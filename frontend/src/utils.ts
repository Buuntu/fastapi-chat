import { MESSAGE_TYPES } from './types';

export const startTyping = (ws: WebSocket, user: string) => {
  ws.send(JSON.stringify({
    type: MESSAGE_TYPES.USER_TYPING,
    data: {
      user: user,
    },
  }));
}

export const stopTyping = (ws: WebSocket, user: string) => {
  ws.send(JSON.stringify({
    type: MESSAGE_TYPES.USER_STOPPED_TYPING,
    data: {
      user: user,
    },
  }));
}

export const sendMessage = (ws: WebSocket, user: string, msg: string) => {
  ws.send(JSON.stringify({
    type: MESSAGE_TYPES.MESSAGE_SENT,
    data: {
      user: user,
      message: msg,
    },
  }));
}