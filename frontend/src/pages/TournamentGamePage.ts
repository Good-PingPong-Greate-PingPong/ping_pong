import { Component } from '../core/Component';
import { waitingModal } from '../components/waitingModal.ts';
import { tournamentTree } from '../components/tournamentTree.ts';
import { TournamentMessage } from '../webSocket/TournamentMessage.ts';
import { TournamentSocket } from '../webSocket/TournamentSocket.ts';
import { tournamentGameResult } from '../components/tournamentGameResult.ts';
import { navigate } from '../core/router.ts';

export class TournamentGamePage extends Component {
  socket!: TournamentSocket;

  template() {
    return `
		<div id="loading" class="w-full h-full absolute">서버에 연결 중입니다...</div>
		<div id="gameDiv">
			<div data-component="waitingModal" class="hidden flex items-center justify-center transition"></div>
			<div data-component="tournamentTree" class="hidden flex items-center justify-center transition"></div>
      <div data-component="nicknameInputModal" class="flex items-center justify-center transition"></div>
      <div id="scoreDiv">
        <p id="Player1Nick">PLAYER 1</p>
        <p id="Player1">0</p> : <p id="Player2">0</p>
        <p id="Player2Nick">PLAYER 2</p>
      </div>
      <canvas></canvas>
      <div data-component="tournamentGameResult" class="hidden" ></div>
		</div>
	`;
  }

  mounted() {
    this.setWebSocket();
    // test용
    // var msgList = new Array<TournamentMessage>;
    // // msgList.push({
    // // 		type: "connection",
    // // 		subtype: "failed",
    // // 		message: "You are not connected!"
    // // });
    // msgList.push({
    // 	type: "game",
    // 	subtype: "tournament_tree",
    // 	message: "",
    // 	data: {
    // 		winner: ["krgreenteabro", "bbbb"],
    // 		bracket: [["krgreenteabro", "ccccds"], ["bbbb", "dddd"]]
    // 	}
    // });
    // msgList.push({
    // 	type: "game",
    // 	subtype: "session_info",
    // 	message: "",
    // 	data: {
    // 		round: "final",
    // 		nickname1: "jimchoi",
    // 		nickname2:"jeakim"
    // 	}
    // });
    // msgList.push({
    // 		type: "game",
    // 		subtype: "match_end",
    // 		message: "",
    // 		data: {
    // 			round: "semi", // semi/final
    // 			score: {
    // 				player1: 9,
    // 				player2: 3,
    // 			},
    // 			winner : "j"
    // 		}
    // });
    // // test end
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

    this.gameStartSetting($waitingModal);
    this.tournamentLoop($waitingModal, $tournamentTree, $resultTarget);
  }

  tournamentLoop(
    waitingModal: HTMLElement,
    tournamentTree: HTMLElement,
    resultTarget: HTMLElement,
  ) {
    this.socket.setMessage();
    // this.socket.msg = msgList[idx]; // test용
    // idx = idx + 1; // test용

    if (this.socket.msg.type === 'connection') this.checkConnection(this.socket.msg);

    setTimeout(
      (socket: TournamentSocket) => {
        this.socket = socket;
        this.socket.msg = socket.msg;
        this.handleMessage(waitingModal, tournamentTree, resultTarget);

        this.tournamentLoop(waitingModal, tournamentTree, resultTarget);
      },
      2000,
      this.socket,
    );
  }

  checkConnection(msg: TournamentMessage) {
    if (msg.subtype === 'failed') {
      navigate('/');
      alert(msg.message);
    }
  }

  gameStartSetting($waitingModal: HTMLElement) {
    const $loading = this.$target.querySelector('#loading') as HTMLElement;
    const $scoreDiv = this.$target.querySelector('#scoreDiv') as HTMLElement;
    const $gameDiv = this.$target.querySelector('#gameDiv') as HTMLElement;

    this.closeModal($loading);
    this.openModal($scoreDiv);
    this.openModal($gameDiv);
    this.openModal($waitingModal);
  }

  gameReSetting($waitingModal: HTMLElement, $resultTarget: HTMLElement) {
    this.closeModal($resultTarget);
    this.openModal($waitingModal);
  }

  setWebSocket() {
    // const token = getAccessToekn(); // 임의로 작성해둠
    const token: string = 'tmp';
    this.socket = new TournamentSocket(token);
    //this.socket.msg = msg;
    // if (this.socket.isOpenWebSocket())
    // 	navigate('/');
  }

  handleMessage(waitingModal: HTMLElement, tournamentTree: HTMLElement, resultTarget: HTMLElement) {
    if (!this.socket?.msg) {
      console.warn('msg가 존재하지 않음');
      return;
    }
    if (this.socket.msg.subtype === 'tournament_tree') {
      this.closeModal(waitingModal);
      this.handleTournamentTree(tournamentTree);
    } else if (this.socket.msg.subtype === 'session_info') {
      this.closeModal(tournamentTree);
      this.setNickname(this.socket.msg.data.nickname1, this.socket.msg.data.nickname2);
    } else if (this.socket.msg.subtype === 'match_init_setting') {
      return;
    } else if (this.socket.msg.subtype === 'match_run') {
      return;
    } else if (this.socket.msg.subtype === 'match_end') {
      const resultComponent = new tournamentGameResult(resultTarget, { winnerName: null });
      this.openModal(resultTarget);
      const winnerName = this.socket.msg.data?.winner ?? '';
      resultComponent.setState({ winnerName });
      var isFinal: boolean = false;
      if (this.socket.msg.data.round === 'final') isFinal = true;
      setTimeout(
        (isFinal: boolean) => {
          this.gameReSetting(waitingModal, resultTarget);
          if (isFinal) navigate('/');
        },
        5000,
        isFinal,
      );
    }
  }

  handleTournamentTree(tournamentTree: HTMLElement) {
    // 토너먼트 트리 보이기(임시 코드)
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
}
