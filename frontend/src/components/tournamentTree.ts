import { Component } from "../core/Component";
import { TreeMessage } from '../types/webSocket/TreeMessage.ts'

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
    return `
    <div id="modalOverlay" class="w-full h-full absolute top-0 bg-black opacity-20 transition"></div>
    <div id="gameModal">
      <p id="modalTitle">토너먼트 게임</p>
      
    </div>
    `;
  }

  mounted() {
    this.$target.addEventListener('update', (e: Event) => {
      this.update((e as CustomEvent).detail);
    });
  }

  update(data: TreeMessage["data"]) {
    // 트리 UI 업데이트 로직
    console.log("Tournament 트리 데이터 수신:", data);
    // ... 실제 렌더링 로직
  }
}