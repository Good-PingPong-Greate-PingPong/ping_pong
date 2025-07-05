import { TournamentMessage } from './TournamentMessage.ts';

export class TournamentSocket {
  public socket: WebSocket;
  public msg: TournamentMessage;

  constructor(token: string) {
    this.socket = new WebSocket(`/ws/tournament?token=${token}`);
    this.msg = {} as TournamentMessage;
  }

  public isOpenWebSocket(): boolean {
    var result: boolean = true;

    this.socket.onerror = (event: Event) => {
      console.error('websocket 오류 발생: ', event);
      alert('서버와의 연결 중 오류가 발생했습니다.');
      result = false;
    };
    this.socket.onclose = (event: CloseEvent) => {
      console.warn('websocket 연결 종료: ', event.code, event.reason);
      alert('서버와의 연결이 종료되었습니다.');
      result = false;
    };
    return result;
  }

  public setMessage() {
    this.socket.onmessage = (event: MessageEvent) => {
      this.msg = JSON.parse(event.data);
    };
  }
}
