import { Component } from "../core/Component";
import { navigate } from '../core/router';
import x_button from '../assets/x_button.svg';
import circle from '../assets/circle.gif';

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
    this.addEvent('click', '#xBtn', ()=> navigate("/"));
  }

  template() {
    return `
    <div id="modalOverlay" class="w-full h-full absolute top-0 bg-black opacity-20 transition"></div>
    <div id="gameModal">
      <button id="xBtn">
        <img src="${x_button}" alt="x_button" class="w-[3rem] h-[3rem]">
      </button>
      <p id="modalTitle">토너먼트 게임</p>
      <div id="modalContent">
        <p id="modalMessage">다른 참가자가 모두 준비되면 자동으로 시작됩니다...</p>
        <img src="${circle}" alt="circle">
      </div>
    </div>
    `;
  }
}