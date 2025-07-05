import * as WS from 'ws';
import { prisma } from '../plugins/prisma';

type Info = {
  socket: WS.WebSocket;
  nickname: String;
};

class TournamentWaitingRoom {
  private waitingPlayers = new Map<number, Info>();

  //참가자 추가
  addPlayer(userId: number, socket: WS.WebSocket, nickname: String) {
    // 중복 참가 방지
    if (this.waitingPlayers.has(userId) || tournamentManager.isPlayer(userId)) {
      //1-3. 커넥션 연결 실패 메시지 전송
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
      //1-2. 커넥션 연결 성공 메시지 전송
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

  //중도 이탈 처리
  removePlayer(userId: number) {
    if (!this.waitingPlayers.has(userId)) return;
    const info = this.waitingPlayers.get(userId);
    if (info) info.socket.close();
    this.waitingPlayers.delete(userId);
  }

  //
  size(): number {
    return this.waitingPlayers.size;
  }

  getAll() {
    return this.waitingPlayers;
  }

  clear() {
    //socket close X!!!
    this.waitingPlayers.clear();
  }
}

export const tournamentWaitingRoom = new TournamentWaitingRoom();

class TournamentRoom {
  private players = new Map<number, Info>();

  constructor() {}

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
    const info = this.players.get(userId);
    if (info) return info.socket;
  }

  getNickname(userId: number) {
    const info = this.players.get(userId);
    if (info) return info.nickname;
  }

  removePlayer(userId: number) {
    const info = this.players.get(userId);
    if (info) info.socket.close();
    this.players.delete(userId);
  }

  broadcasting(msg: string) {
    for (const [userId, { socket, nickname }] of this.players) {
      socket.send(msg);
    }
  }

  clear() {
    for (const [userId, { socket, nickname }] of this.players) {
      socket.close();
    }
    this.players.clear();
  }
}

class TournamentManager {
  private rooms: Map<number, TournamentRoom> = new Map();

  createRoom(tournamentId: number, players: Map<number, Info>) {
    if (this.rooms.has(tournamentId))
      throw new Error('❌ 토너먼트 생성 중 오류');

    const room = new TournamentRoom();
    this.rooms.set(tournamentId, room);

    for (const [userId, { socket, nickname }] of players) {
      room.addPlayer(userId, { socket, nickname });
    }
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

  boradcasting(tournamentId: number, msg: string) {
    const room = this.rooms.get(tournamentId);
    if (room) room.broadcasting(msg);
    else throw new Error('❌ 브로드캐스팅 실패');
  }

  clear() {}
}

export const tournamentManager = new TournamentManager();
