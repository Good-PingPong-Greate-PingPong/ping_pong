import { TournamentMessage } from './TournamentMessage.ts';
import { sendError } from '../errorHandling/sendError.ts';
import { store } from '../core/store.ts';
import { i18n } from '../types/i18n.ts';

export class TournamentSocket {
  public socket: WebSocket;
  public msg: TournamentMessage;

  constructor(token: string) {
    const url = process.env.BACKEND_ORIGIN
    this.socket = new WebSocket(`wss://${url}/ws/tournament?token=${token}`);
    this.msg = {} as TournamentMessage;
  }

  public waitForOpen(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket.readyState === WebSocket.OPEN) return resolve();

      this.socket.onopen = () => resolve();

      const { language } = store.getState();

      this.socket.onerror = (event) => {
        console.error('WebSocket 연결 오류:', event);
        sendError(i18n[language].socketError);
        reject(new Error('WebSocket 연결 오류'));
      };

      this.socket.onclose = (event) => {
        console.warn('WebSocket 연결 종료:', event.code, event.reason);
        sendError(i18n[language].socketClose);
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
    this.socket.close();
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
        match_id: matchId,
        key_set: key,
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
