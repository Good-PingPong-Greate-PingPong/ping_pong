import { TournamentMessage } from './TournamentMessage.ts';
import { sendError } from '../errorHandling/sendError.ts';

export class TournamentSocket {
  public socket: WebSocket;
  public msg: TournamentMessage;

  constructor(token: string) {
    this.socket = new WebSocket(`/ws/tournament?token=${token}`);
    this.msg = {} as TournamentMessage;
  }

  public waitForOpen(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket.readyState === WebSocket.OPEN) return resolve();

      this.socket.onopen = () => resolve();

      this.socket.onerror = (event) => {
        console.error('WebSocket 연결 오류:', event);
        sendError('서버와의 연결 중 오류가 발생했습니다.');
        reject(new Error('WebSocket 연결 오류'));
      };

      this.socket.onclose = (event) => {
        console.warn('WebSocket 연결 종료:', event.code, event.reason);
        sendError('서버와의 연결이 종료되었습니다.');
        reject(new Error('WebSocket 연결 종료'));
      };
    });
  }

  public sendMessage(msg: TournamentMessage) {
    this.socket.send(JSON.stringify(msg));
  }

  public sendDisconnectionMessage() {
    this.sendMessage({
      type: 'connection',
      subtype: 'disconnection',
      message: 'plz!',
    });
  }

  public sendStartMessage(matchId: number) {
    this.sendMessage({
      type: 'game',
      subtype: 'match_start',
      message: 'go!',
      data: {
        match_id: matchId,
      },
    });
  }

  public sendKeyMessage(isUp: boolean, key: string, matchId: number) {
    this.sendMessage({
      type: 'game',
      subtype: 'key',
      message: isUp ? 'key_up' : 'key_down',
      data: {
        key_set: key,
        match_id: matchId,
      },
    });
  }

  public async *getMessageStream(): AsyncGenerator<TournamentMessage> {
    const queue: TournamentMessage[] = []; // 메세지 큐
    const listener = (event: MessageEvent) => {
      const data: TournamentMessage = JSON.parse(event.data);
      queue.push(data);
    };
    this.socket.addEventListener('message', listener); // onmessage 대신

    try {
      while (true) {
        if (queue.length) {
          yield queue.shift()!; // 큐에 메세지 존재 시 비동기적으로 반환
        } else {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      }
    } finally {
      this.socket.removeEventListener('message', listener);
    }
  }
}
