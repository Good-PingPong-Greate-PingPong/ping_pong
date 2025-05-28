import { Component } from "../core/Component";
import { localGameResult } from "../components/localGameResult";
import { nicknameInputModal } from "../components/nicknameInputModal.ts";

export class LocalGamePage extends Component {
  template () { return `
    <div id="localGameDiv">
      <div data-component="nicknameInputModal" class="flex items-center justify-center transition"></div>
      <div id="ScoreDiv">
        <p id="Player1Nick">PLAYER 1</p>
        <p id="Player1">0</p> : <p id="Player2">0</p>
        <p id="Player2Nick">PLAYER 2</p>
      </div>
      <canvas></canvas>
      <div data-component="localGameResult"></div>
    </div>
  `; 
  }

  mounted() {
    const $nicknameModal = this.$target.querySelector('[data-component="nicknameInputModal"]') as HTMLElement;
    
    new nicknameInputModal($nicknameModal, {
      closeModal: this.closeModal.bind(this)
    });

    const $resultTarget = this.$target.querySelector('[data-component="localGameResult"]') as HTMLElement;
    const resultComponent = new localGameResult($resultTarget, { winnerName: null });

    // 게임 시작
    const canvas = this.$target.querySelector('canvas') as HTMLCanvasElement;
    import('../game/localGame.ts').then((module) => {
      module.startLocalGame(canvas);
    });

    // 게임 종료 시 승자 닉네임을 받는 콜백
    const handleGameOver = (winnerName: string) => {
      resultComponent.setState({ winnerName });
    };

    // 전역으로 콜백을 전달 (자체 모듈 방식 아님 가정)
    (window as any).onLocalGameOver = handleGameOver;

    // 커스텀 이벤트 수신
    window.addEventListener('startLocalGame', (e: Event) => {
    const { player1, player2 } = (e as CustomEvent).detail;

    const $p1 = this.$target.querySelector('#Player1Nick');
    const $p2 = this.$target.querySelector('#Player2Nick');
    if ($p1 && $p2) {
      $p1.textContent = player1 || 'PLAYER 1';
      $p2.textContent = player2 || 'PLAYER 2';
    }});
  }

  closeModal($target : HTMLElement) {
    $target.classList.add("hidden");
  }
}