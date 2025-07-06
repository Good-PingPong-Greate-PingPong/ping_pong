import { Component } from '../core/Component';
import { navigate } from '../core/router';
import x_button from '../assets/x_button.svg';
import { store } from '../core/store';
import { i18n } from '../types/i18n';

export class nicknameInputModal extends Component {
  addEvent(eventType: string, selector: string, callback: (event: Event) => void): void {
    this.$target.addEventListener(eventType, (event: Event) => {
      // 이벤트가 발생한 요소가 selector와 일치하지 않으면 무시
      const target = event.target as Element;
      if (!target.closest(selector)) return false;
      callback(event); // selector와 일치하면 콜백 실행
    });
  }

  setEvent() {
    this.addEvent('click', '#xBtn', () => navigate('/'));
    const { closeModal } = this.$props;
    this.addEvent('click', '#startBtn', () => {
      const player1 = (this.$target.querySelector('#player1Form') as HTMLInputElement).value;
      const player2 = (this.$target.querySelector('#player2Form') as HTMLInputElement).value;

      const event = new CustomEvent('startLocalGame', {
        detail: { player1, player2 },
      });

      window.dispatchEvent(event); // 또는 this.$target.dispatchEvent(event); 로 지역화 가능
      closeModal(this.$target);
    });
  }

  template() {
    const { language } = store.getState();
    const localGame = i18n[language].localGame;
    const gameStart = i18n[language].gameStart;
    const defaultPlayer1 = i18n[language].defaultPlayer1;
    const defaultPlayer2 = i18n[language].defaultPlayer2;

    return `
    <div id="modalOverlay" class="w-full h-full absolute top-0 bg-black opacity-20 transition"></div>
    <div id="gameModal">
      <button id="xBtn">
        <img src="${x_button}" alt="x_button" class="w-[3rem] h-[3rem]">
      </button>
      <p id="modalTitle">${localGame}</p>
      <form id="nickInputForm">
        <div class="flex flex-col items-start ml-[150px]">
          <label for="player1Form">${defaultPlayer1}</label>
          <input type="text" id="player1Form" name="player1Form" maxlength="10" class="w-[310px] h-[70px]">
        </div>
        <div class="flex flex-col items-end mr-[150px]">
          <label for="player2Form">${defaultPlayer2}</label>
          <input type="text" id="player2Form" name="player2Form" maxlength="10" class="w-[310px] h-[70px]">
        </div>
      </form>
      <button id="startBtn">${gameStart}</button>
    </div>
    `;
  }
}
