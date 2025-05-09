import { Component } from "../core/Component";
import { navigate } from '../core/router';
import back from '../assets/back.svg';
import dancing from '../assets/dancing.gif';

export class localGameResult extends Component {
    addEvent(eventType: string, selector: string, callback: (event: Event) => void): void {
        this.$target.addEventListener(eventType, (event: Event) => {
        const target = event.target as Element;
        if (!target.closest(selector)) return false;
          callback(event);
        });
    }

    setEvent (){
        this.addEvent('click', '#backBtn', ()=> navigate("/"));
    }

    template() {
        const winnerName = this.$state?.winnerName ?? '';
        console.log("winnerName: " + winnerName);
        if (!winnerName) return '';
        return `
        <div id="ResultView">
            <div id="WinMsg">
                <p><span id="WinPlayerName">${winnerName}</span> WIN!!</p>
                <div id="WinImageBox">
                    <img src="${dancing}" alt="dancing man" >
                </div>
            </div>
			<button id="backBtn">
				<img src="${back}" alt="back">
			</button>
        </div>
        `;
    }
}