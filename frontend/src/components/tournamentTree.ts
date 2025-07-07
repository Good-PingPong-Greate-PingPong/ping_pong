import { Component } from '../core/Component';
import { TournamentMessage } from '../webSocket/TournamentMessage.ts';
import tree from '../assets/tree.svg';
import { store } from '../core/store.ts';
import { i18n } from '../types/i18n.ts';

export class tournamentTree extends Component {
  addEvent(eventType: string, selector: string, callback: (event: Event) => void): void {
    this.$target.addEventListener(eventType, (event: Event) => {
      // 이벤트가 발생한 요소가 selector와 일치하지 않으면 무시
      const target = event.target as Element;
      if (!target.closest(selector)) return false;
      callback(event); // selector와 일치하면 콜백 실행
    });
  }

  template() {
    const { language } = store.getState();
    const tournament = i18n[language].tournament;
    return `
    <div id="modalOverlay" class="w-full h-full absolute top-0 bg-black opacity-20 transition"></div>
    <div id="gameModal">
      <p id="modalTitle">${tournament}</p>
      <div id="modalContent">
        <img src="${tree}" alt="tree" class="w-[80%] h-[100%] justify-center" >
        <div id="playerNickname">
          <div id="player1" class="absolute top-3 left-2 bg-white w-[250px] break-words text-center">Player1</div>
          <div id="player2" class="absolute bottom-5 left-2 bg-white w-[250px] break-words text-center">Player2</div>
          <div id="player3" class="absolute top-3 right-2 bg-white w-[250px] break-words text-center">Player3</div>
          <div id="player4" class="absolute bottom-5 right-2 bg-white w-[250px] break-words text-center">Player4</div>
          <div id="player5" class="absolute top-[40%] left-[26%] bg-white w-[150px] break-words text-center"></div>
          <div id="player6" class="absolute top-[40%] right-[26%] bg-white w-[150px] break-words text-center"></div>
        </div>
      </div>
    </div>
    `;
  }

  mounted() {
    this.$target.addEventListener('update', (e: Event) => {
      this.update((e as CustomEvent).detail);
    });
  }

  update(msg: TournamentMessage) {
    console.log('Tournament 트리 데이터 수신:', msg);
    if (msg.subtype !== 'tournament_tree') return;
    const $player1 = this.$target.querySelector('#player1') as HTMLElement;
    $player1.textContent = msg.data.bracket[0][0];
    const $player2 = this.$target.querySelector('#player2') as HTMLElement;
    $player2.textContent = msg.data.bracket[0][1];
    const $player3 = this.$target.querySelector('#player3') as HTMLElement;
    $player3.textContent = msg.data.bracket[1][0];
    const $player4 = this.$target.querySelector('#player4') as HTMLElement;
    $player4.textContent = msg.data.bracket[1][1];
    if (msg.data.winner.length) {
      const $player5 = this.$target.querySelector('#player5') as HTMLElement;
      $player5.textContent = msg.data.winner[0];
      const $player6 = this.$target.querySelector('#player6') as HTMLElement;
      $player6.textContent = msg.data.winner[1];
    }
  }
}
