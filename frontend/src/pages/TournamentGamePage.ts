import { Component } from '../core/Component';
import { waitingModal } from '../components/waitingModal.ts';
import { tournamentTree } from '../components/tournamentTree.ts';
import { TournamentMessage } from '../webSocket/TournamentMessage.ts';
import { TournamentSocket } from '../webSocket/TournamentSocket.ts';
import { tournamentGameResult } from '../components/tournamentGameResult.ts';
import { sendError } from '../errorHandling/sendError.ts';
import { navigate } from '../core/router.ts';
import { TournamentGameWindow } from '../tournamentGame/TournamentGameWindow.ts';
import { tournamentInit, gameEvent, renderObject } from '../tournamentGame/runTournamentGame.ts';

export class TournamentGamePage extends Component {
  socket!: TournamentSocket;
  gameWindow!: TournamentGameWindow;

  template() {
    return `
		<div id="loading" class="w-full h-full top-0 absolute" >서버에 연결 중입니다...</div>
		<div id="gameDiv" class="opacity-0" >
			<div data-component="waitingModal" class="hidden flex items-center justify-center transition"></div>
			<div data-component="tournamentTree" class="hidden flex items-center justify-center transition"></div>
      <div data-component="nicknameInputModal" class="flex items-center justify-center transition"></div>
      <div id="scoreDiv">
        <p id="Player1Nick">PLAYER 1</p>
        <p id="Player1">0</p> : <p id="Player2">0</p>
        <p id="Player2Nick">PLAYER 2</p>
      </div>
      <canvas class="min-h-[600px] min-w-[1500px]" ></canvas>
      <div data-component="tournamentGameResult" class="hidden" ></div>
		</div>
	`;
  }

  async mounted() {
    const $waitingModal = this.$target.querySelector(
      '[data-component="waitingModal"]',
    ) as HTMLElement;
    new waitingModal($waitingModal, {});
    const $tournamentTree = this.$target.querySelector(
      '[data-component="tournamentTree"]',
    ) as HTMLElement;
    new tournamentTree($tournamentTree, {});
    const $resultTarget = this.$target.querySelector(
      '[data-component="tournamentGameResult"]',
    ) as HTMLElement;
    const canvas = this.$target.querySelector('canvas') as HTMLCanvasElement;

    try {
      await this.setWebSocket();
      await this.gameStartSetting($waitingModal);
      await this.listenMessageLoop($waitingModal, $tournamentTree, $resultTarget, canvas);
    } catch (e) {}
  }

  async setWebSocket() {
    // const token = getAccessToekn(); // 임의로 작성해둠
    const token: string = 'tmp';
    this.socket = new TournamentSocket(token);
    try {
      await this.socket.waitForOpen();
    } catch (error) {
      console.error('WebSocket 연결 실패로 인해 setWebSocket 종료됨');
      throw error;
    }
  }

  checkConnection(msg: TournamentMessage) {
    if (msg.subtype === 'failed') sendError(msg.message);
  }

  async gameStartSetting($waitingModal: HTMLElement) {
    const $loading = this.$target.querySelector('#loading') as HTMLElement;
    const $scoreDiv = this.$target.querySelector('#scoreDiv') as HTMLElement;
    const $gameDiv = this.$target.querySelector('#gameDiv') as HTMLElement;
    
    $gameDiv.classList.add('opacity-0');
    this.closeModal($loading);
    this.openModal($scoreDiv);
    this.openModal($gameDiv);
    this.openModal($waitingModal);
  }

  async listenMessageLoop(
    waitingModal: HTMLElement,
    tournamentTree: HTMLElement,
    resultTarget: HTMLElement,
    canvas: HTMLCanvasElement,
  ) {
    // 다음 메세지가 처리되기 전까지 다른 메세지 처리 x
    for await (const msg of this.socket.getMessageStream()) {
      this.socket.msg = msg;
      if (msg.type === 'connection') this.checkConnection(msg);
      gameEvent(canvas, this.socket, this.gameWindow);
      await this.handleMessage(waitingModal, tournamentTree, resultTarget, canvas);
    }
  }

  gameReSetting($waitingModal: HTMLElement, $resultTarget: HTMLElement) {
    this.closeModal($resultTarget);
    this.openModal($waitingModal);
  }

  async handleMessage(
    waitingModal: HTMLElement,
    tournamentTree: HTMLElement,
    resultTarget: HTMLElement,
    canvas: HTMLCanvasElement,
  ) {
    if (!this.socket?.msg) {
      console.warn('msg가 존재하지 않음');
      return;
    }
    const msg: TournamentMessage = this.socket.msg;

    switch (msg.subtype) {
      case 'tournament_tree':
        this.closeModal(waitingModal);
        this.handleTournamentTree(tournamentTree);
        break;
      case 'session_info':
        this.closeModal(tournamentTree);
        this.setNickname(msg.data.nickname1, msg.data.nickname2);
        break;
      case 'match_init_setting':
        tournamentInit(canvas, this.socket, this.gameWindow, msg.data.match_id);
        break;
      case 'match_run':
        renderObject(this.socket, this.gameWindow);
        break;
      case 'match_end':
        await this.endMatch(waitingModal, resultTarget);
        break;
    }
  }

  handleTournamentTree(tournamentTree: HTMLElement) {
    tournamentTree.dispatchEvent(new CustomEvent('update', { detail: this.socket.msg }));
    this.openModal(tournamentTree);
  }

  setNickname(player1Nick: string, player2Nick: string) {
    const $p1 = this.$target.querySelector('#Player1Nick');
    const $p2 = this.$target.querySelector('#Player2Nick');
    if ($p1 && $p2) {
      $p1.textContent = player1Nick || 'PLAYER 1';
      $p2.textContent = player2Nick || 'PLAYER 2';
    }
  }

  closeModal($target: HTMLElement) {
    $target.classList.add('hidden');
  }

  openModal($target: HTMLElement) {
    $target.classList.remove('hidden');
  }

  async endMatch(waitingModal: HTMLElement, resultTarget: HTMLElement) {
    const msg: TournamentMessage = this.socket.msg;
    if (msg.subtype !== 'match_end') return;

    const resultComponent = new tournamentGameResult(resultTarget, { winnerName: null });
    this.openModal(resultTarget);

    const winnerName = msg.data?.winner ?? '';
    resultComponent.setState({ winnerName });

    var isFinal: boolean = msg.data.round === 'final';
    console.log('rount: ' + msg.data.round);

    await this.delay(5000);

    this.gameReSetting(waitingModal, resultTarget);
    if (isFinal) {
      this.socket.sendDisconnectionMessage();
      navigate('/');
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
