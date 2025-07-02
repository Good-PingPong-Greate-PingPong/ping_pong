import { Component } from '../core/Component';
import { waitingModal } from "../components/waitingModal.ts";
import { tournamentTree } from '../components/tournamentTree.ts';
import { TreeMessage } from '../types/webSocket/TreeMessage.ts'
import { navigate } from '../core/router';

export class TournamentGamePage extends Component {
	socket!: WebSocket;

	template () {
		return `
		<div id="loading" class="w-full h-full">서버에 연결 중입니다...</div>
		<div id="gameDiv">
			<div data-component="waitingModal" class="hidden flex items-center justify-center transition"></div>
			<div data-component="tournamentTree" class="hidden flex items-center justify-center transition"></div>
			게임화면
		</div>
	`; 
	}

	mounted() {
		this.setWebSocket();
	}

	setWebSocket() {
		const $waitingModal = this.$target.querySelector('[data-component="waitingModal"]') as HTMLElement;
		new waitingModal($waitingModal, {});
		var isConnected: boolean = false;
		// const token = getAccessToekn(); // 임의로 작성해둠
		const token: string = "tmp";
		this.socket = new WebSocket(`/ws/tournament?token=${token}`);

		this.socket.onopen = () => {
			console.log("websocket 연결됨");
			if (!isConnected) {
				isConnected = true;
				const $loading = this.$target.querySelector('#loading') as HTMLElement;
				this.closeModal($loading);
				const $gameDiv = this.$target.querySelector('#gameDiv') as HTMLElement;
				this.openModal($gameDiv);
				this.openModal($waitingModal);
			}
		}
		this.socket.onmessage = (event: MessageEvent) => this.handleMessage(event, $waitingModal);
		this.socket.onerror = (event: Event) => {
			console.error("websocket 오류 발생: ", event);
			this.handleSocketTermination("서버와의 연결 중 오류가 발생했습니다.");
		};
		this.socket.onclose = (event: CloseEvent) => {
			console.warn("websocket 연결 종료: ", event.code, event.reason);
			this.handleSocketTermination("서버와의 연결이 종료되었습니다.");
		};
	}

	handleSocketTermination(message: string) {
		alert(message);
		navigate("/");
	}

	handleMessage(event: MessageEvent, waitingModal: HTMLElement) {
    const msg: TreeMessage = JSON.parse(event.data);

    if (msg.type === 'game' && msg.subtype === 'tournament_tree') {
			this.closeModal(waitingModal);
      this.handleTournamentTree(msg.data);
    }
  }

  handleTournamentTree(data: TreeMessage["data"]) {
    // 토너먼트 트리 보이기(임시 코드)
		const $tournamentTree = this.$target.querySelector('[data-component="tournamentTree"]') as HTMLElement;
    new tournamentTree($tournamentTree, {});
		$tournamentTree.dispatchEvent(new CustomEvent('update', { detail: data }));
		this.openModal($tournamentTree);
		setTimeout(() => {
    	this.closeModal($tournamentTree);
    }, 3000);
  }

	closeModal($target : HTMLElement) {
		$target.classList.add("hidden");
	}

	openModal($target : HTMLElement) {
		$target.classList.remove("hidden");
	}
}