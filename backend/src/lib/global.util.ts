import * as WS from 'ws';
import { prisma } from '../plugins/prisma';

type Info = {
  socket: WS.WebSocket;
  nickname: string;
};

class TournamentWaitingRoom {
  private waitingPlayers = new Map<number, Info>();

  addPlayer(userId: number, socket: WS.WebSocket, nickname: string) {
    if (this.waitingPlayers.has(userId) || tournamentManager.isPlayer(userId)) {
      socket.send(
        JSON.stringify({
          type: 'connection_failed',
          mode: 'online',
          message: 'You are not connected!',
        }),
      );
      socket.close();
      throw new Error('이미 참여중인 게임이 있습니다.');
    } else {
      this.waitingPlayers.set(userId, { socket, nickname });
      socket.send(
        JSON.stringify({
          type: 'connection_established',
          mode: 'online',
          message: 'You are now connected!',
        }),
      );
    }
  }

  findPlayer(userId: number): Info | undefined {
    return this.waitingPlayers.get(userId);
  }

  removePlayer(userId: number) {
    if (!this.waitingPlayers.has(userId)) return;
    const info = this.waitingPlayers.get(userId);
    if (info) info.socket.close();
    this.waitingPlayers.delete(userId);
  }

  size(): number {
    return this.waitingPlayers.size;
  }

  getAll() {
    return this.waitingPlayers;
  }

  clear() {
    this.waitingPlayers.clear();
  }
}

export const tournamentWaitingRoom = new TournamentWaitingRoom();

class TournamentRoom {
  private players = new Map<number, Info>();
  private matchPlayers = new Map<number, [WS.WebSocket, WS.WebSocket]>();

  addPlayer(userId: number, info: Info) {
    this.players.set(userId, info);
  }

  isPlayer(userId: number) {
    return this.players.has(userId);
  }

  getInfo(userId: number) {
    return this.players.get(userId);
  }

  getSocket(userId: number) {
    return this.players.get(userId)?.socket;
  }

  getNickname(userId: number) {
    return this.players.get(userId)?.nickname;
  }

  removePlayer(userId: number) {
    const info = this.players.get(userId);
    if (info) info.socket.close();
    this.players.delete(userId);
  }

  registerMatch(matchId: number, userId1: number, userId2: number) {
    const socket1 = this.getSocket(userId1);
    const socket2 = this.getSocket(userId2);
    if (socket1 && socket2) {
      this.matchPlayers.set(matchId, [socket1, socket2]);
    }
  }

  sendToMatch(matchId: number, msg: string) {
    const sockets = this.matchPlayers.get(matchId);
    if (!sockets) return;
    sockets.forEach((sock) => sock.send(msg));
  }

  broadcasting(msg: string) {
    for (const { socket } of this.players.values()) {
      socket.send(msg);
    }
  }

  clear() {
    for (const { socket } of this.players.values()) {
      socket.close();
    }
    this.players.clear();
    this.matchPlayers.clear();
  }
}

class TournamentManager {
  private rooms: Map<number, TournamentRoom> = new Map();
  private matchIdToRoom: Map<number, TournamentRoom> = new Map();

  createRoom(tournamentId: number, players: Map<number, Info>) {
    if (this.rooms.has(tournamentId))
      throw new Error('❌ 토너먼트 생성 중 오류');

    const room = new TournamentRoom();
    this.rooms.set(tournamentId, room);

    for (const [userId, info] of players) {
      room.addPlayer(userId, info);
    }
  }

  registerMatchRoom(
    matchId: number,
    tournamentId: number,
    userId1: number,
    userId2: number,
  ) {
    const room = this.rooms.get(tournamentId);
    if (!room) throw new Error('❌ 매치 등록 실패: 토너먼트 룸 없음');
    room.registerMatch(matchId, userId1, userId2);
    this.matchIdToRoom.set(matchId, room);
  }

  sendToMatch(matchId: number, msg: string) {
    const room = this.matchIdToRoom.get(matchId);
    if (!room) {
      console.warn(`❌ matchId ${matchId}에 해당하는 룸을 찾을 수 없음`);
      return;
    }
    room.sendToMatch(matchId, msg);
  }

  removeRoom(tournamentId: number) {
    const room = this.rooms.get(tournamentId);
    if (room) room.clear();
    this.rooms.delete(tournamentId);
  }

  getRoom(tournamentId: number) {
    return this.rooms.get(tournamentId);
  }

  getAllRooms() {
    return Array.from(this.rooms.keys());
  }

  isPlayer(userId: number): boolean {
    for (const room of this.rooms.values()) {
      if (room.isPlayer(userId)) return true;
    }
    return false;
  }

  broadcasting(tournamentId: number, msg: string) {
    const room = this.rooms.get(tournamentId);
    if (room) room.broadcasting(msg);
    else throw new Error('❌ 브로드캐스팅 실패');
  }

  clear() {}
}

export const tournamentManager = new TournamentManager();
