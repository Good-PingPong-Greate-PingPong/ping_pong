import { Component } from '../core/Component';
import logoutUrl from '../assets/logout.svg';
import { navigate } from '../core/router';
import { MyInfoModal } from '../components/myInfoModal';

export class HomePage extends Component {

	addEvent(eventType: string, selector: string, callback: (event: Event) => void): void {
		this.$target.addEventListener(eventType, (event: Event) => {
		  // 이벤트가 발생한 요소가 selector와 일치하지 않으면 무시
		const target = event.target as Element;
		if (!target.closest(selector)) return false;
		  callback(event); // selector와 일치하면 콜백 실행
		});
	}
	setEvent(){
		this.addEvent("click", ".navigate-tournament", ()=> navigate("/tournament-game"))
		this.addEvent("click", "#logoutBtn", ()=> navigate("/login", true))
		this.addEvent("click", "#myInfoBtn", ()=> this.openModal('[data-component="myInfoModal"]'))
		
	}
	
	setup () {
		console.log("home")
	};
	template () { return `
		<div class="w-full h-full flex flex-col justify-between ">
			<div class="flex flex-row justify-around items-center border-2 w-full h-full">
				<ul class="border-2  min-h-60 flex flex-col justify-around items-center text-white text-center">
					<li class="min-w-40 min-h-14 bg-black rounded-lg flex flex-col justify-around"><a href="#/local-game">로컬</a></li>
					<li class="min-w-40 min-h-14 bg-black rounded-lg flex flex-col justify-around"><a href="#/tournament-game">토너먼트</a></li>
					<li id="myInfoBtn" class="min-w-40 min-h-14 bg-black rounded-lg flex flex-col justify-around"><a >내 정보</a></li>
				</ul>
				<div class="bg-blue-100 w-80 min-h-48">gif 삽입 위치</div>
			</div>
			<div data-component="myInfoModal" class="hidden flex items-center justify-center bg-blue-200"></div>
			<footer class="w-full h-16 flex flex-row justify-end items-center">
			<button class="mr-3" id="logoutBtn">
				<img src="${logoutUrl}" alt="logout" class="w-8 h-8 cursor-pointer" >
			</button>
			</footer>
		</div>
	`; 
	}
	render () {
		this.$target.innerHTML = this.template(); // template() 메서드로 HTML 생성 후 렌더링
		this.mounted()
	}
	mounted() {
		const $myInfoModal = this.$target.querySelector('[data-component="myInfoModal"]') as HTMLElement;

		new MyInfoModal($myInfoModal, {
			closeModal: this.closeModal.bind(this)
		});
	}

	closeModal($target : HTMLElement) {
		$target.classList.add("hidden");
	}

	openModal(target : string) {
		const $target = document.querySelector(target) as HTMLElement;
		$target.classList.remove("hidden");
	}
}

