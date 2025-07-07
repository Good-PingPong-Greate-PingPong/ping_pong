import { Component } from '../core/Component';
import { navigate } from '../core/router';
import back from '../assets/back.svg';
import dancing from '../assets/dancing.gif';
import flower from '../assets/flower.gif';
import { i18n } from '../types/i18n';
import { store } from '../core/store';

export class localGameResult extends Component {
  addEvent(eventType: string, selector: string, callback: (event: Event) => void): void {
    this.$target.addEventListener(eventType, (event: Event) => {
      const target = event.target as Element;
      if (!target.closest(selector)) return false;
      callback(event);
    });
  }

  setEvent() {
    this.addEvent('click', '#backBtn', () => navigate('/'));
  }

  template() {
    const { language } = store.getState();
    const win = i18n[language].win;
    const winnerName = this.$state?.winnerName ?? '';
    console.log('winnerName: ' + winnerName);
    if (!winnerName) return '';
    return `
    <div id="resultView">
      <div id="winMsg">
        <p><span id="WinPlayerName">${winnerName}</span> ${win}</p>
        <div id="winImageBox">
          <img src="${flower}" alt="flower 1">
          <img src="${dancing}" alt="dancing man">
          <img src="${flower}" alt="flower 2">
        </div>
      </div>
			<button id="backBtn">
				<img src="${back}" alt="back">
			</button>
    </div>
    `;
  }
}
