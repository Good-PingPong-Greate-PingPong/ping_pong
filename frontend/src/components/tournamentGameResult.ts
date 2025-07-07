import { Component } from '../core/Component';
import firework from '../assets/firework.gif';
import { store } from '../core/store';
import { i18n } from '../types/i18n';

export class tournamentGameResult extends Component {
  addEvent(eventType: string, selector: string, callback: (event: Event) => void): void {
    this.$target.addEventListener(eventType, (event: Event) => {
      const target = event.target as Element;
      if (!target.closest(selector)) return false;
      callback(event);
    });
  }

  template() {
    const { language } = store.getState();
    const win = i18n[language].win;
    const winnerName = this.$state?.winnerName ?? '';
    console.log('winnerName: ' + winnerName);
    if (!winnerName) return '';
    return `
      <div id="modalOverlay" class="w-full h-full fixed top-0 left-0 bg-black opacity-40 transition"></div>
      <div id="resultView">
        <div id="tournamentWinMsg">
          <div id="tournamentWinImageBox">
            <img src="${firework}" alt="firework 1">
            <img src="${firework}" alt="firework 2">
          </div>
          <p id="winPlayerName">${winnerName}</p>
          <p>${win}</p>
          </div>
      </div>
    `;
  }
}
