import { Component } from "../core/Component";
import { Profile } from "./profile";


export class myInfoModal extends Component {
    addEvent(eventType: string, selector: string, callback: (event: Event) => void): void {
		this.$target.addEventListener(eventType, (event: Event) => {
		  // 이벤트가 발생한 요소가 selector와 일치하지 않으면 무시
		const target = event.target as Element;
		if (!target.closest(selector)) return false;
		  callback(event); // selector와 일치하면 콜백 실행
		});
	}

    setEvent (){
        const { closeModal } = this.$props;
        this.addEvent('click', '#modalOverlay', () => {
            closeModal(this.$target);
        })
    } 

    template() {
        return `
        <div id="modalOverlay" class="w-full h-full absolute top-0 bg-black opacity-20 transition">
        </div>
        <div class="w-[800px] fixed inset-y-32 transition">
            <div class="flex flex-row ">
                <div class="trapezoid-shape w-[199px] h-[52px] rounded-tl-lg flex justify-center items-center text-center">내 정보</div>
                <div class="trapezoid-shape w-[199px] h-[52px] rounded-tl-lg flex justify-center items-center text-center">내 정보</div>
                <div class="trapezoid-shape w-[199px] h-[52px] rounded-tl-lg flex justify-center items-center text-center">내 정보</div>
            </div>
            <div data-component="myInfo" class="bg-white w-full h-full rounded-b-lg rounded-tr-lg"></div>
        </div>
        `;
    }

    mounted() {
        const $myInfo = this.$target.querySelector('[data-component="myInfo"]') as HTMLElement;

        new Profile($myInfo);

    }
}