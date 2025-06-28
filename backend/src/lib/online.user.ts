// lib/user-online.ts
import * as WS from 'ws';

const onlineUsers = new Map<number, WS.WebSocket>();

const userOnlineUtil = {
  addOnlineUser: (userId: number, socket: WS.WebSocket) => {
    onlineUsers.set(userId, socket);
  },
  removeOnlineUser: (userId: number) => {
    onlineUsers.delete(userId);
  },
  getOnlineUser: (userId: number) => {
    return onlineUsers.get(userId);
  },
  isUserOnline: (userId: number) => {
    return onlineUsers.has(userId);
  },
};

export default userOnlineUtil;
