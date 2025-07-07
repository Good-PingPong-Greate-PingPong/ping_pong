import { Component } from '../core/Component';
import x_button from '../assets/x_button.svg';
import circle from '../assets/circle.gif';
import { store } from '../core/store';
import { i18n } from '../types/i18n';

export class waitingModal extends Component {
  addEvent(eventType: string, selector: string, callback: (event: Event) => void): void {
    this.$target.addEventListener(eventType, (event: Event) => {
      // 이벤트가 발생한 요소가 selector와 일치하지 않으면 무시
      const target = event.target as Element;
      if (!target.closest(selector)) return false;
      callback(event); // selector와 일치하면 콜백 실행
    });
  }

  setEvent() {
    const xBtn = this.$target.querySelector('#xBtn');
    xBtn?.addEventListener('click', () => {
      this.$props.onClose?.(); // 전달된 콜백 실행
    });
  }

  template() {
    const { language } = store.getState();
    const tournamentGame = i18n[language].tournamentGame;
    const waitingMessage = i18n[language].waitingMessage;
    return `
    <div id="modalOverlay" class="w-full h-full absolute top-0 bg-black opacity-20 transition"></div>
    <div id="gameModal">
      <button id="xBtn">
        <img src="${x_button}" alt="x_button" class="w-[3rem] h-[3rem]">
      </button>
      <p id="modalTitle">${tournamentGame}</p>
      <div id="modalContent">
        <p id="modalMessage">${waitingMessage}</p>
        <img src="${circle}" alt="circle">
      </div>
    </div>
    `;
  }
}
