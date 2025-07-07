import { Component } from '../core/Component';
import movingBall from '../assets/movingBall.gif';
import logoutIcon from '../assets/logout.svg';
import { navigate } from '../core/router';
import { MyInfoModal } from '../components/myInfoModal';
import { store } from '../core/store';

export class HomePage extends Component {
  addEvent(eventType: string, selector: string, callback: (event: Event) => void): void {
    this.$target.addEventListener(eventType, (event: Event) => {
      // 이벤트가 발생한 요소가 selector와 일치하지 않으면 무시
      const target = event.target as Element;
      if (!target.closest(selector)) return false;
      callback(event); // selector와 일치하면 콜백 실행
    });
  }
  setEvent() {
    this.addEvent('click', '.navigate-tournament', () => navigate('/tournament-game'));

    this.addEvent('click', '#logoutBtn', () => {
      store.setState({ user: null });
      localStorage.removeItem('app-state');
      const socket = store.getState().socket;
      if (socket) {
        socket.close();
        store.setState({ socket: null });
      }
      navigate('/login', true);
    });

    this.addEvent('click', '#myInfoBtn', () => this.openModal('[data-component="myInfoModal"]'));
  }

  setup() {
    console.log('home');
  }
  template() {
    const user = store.getState().user;
    const accessToken = store.getState().accessToken;
    if (!user) {
      return `<div>🔒 로그인 후 이용해주세요.</div>
						<footer class="w-full h-16 flex flex-row justify-end items-center">
			<button class="mr-3" id="logoutBtn">
				<img src="${logoutIcon}" alt="logout" class="w-8 h-8 cursor-pointer" >

			</button>
			</footer>`;
    }
    return `
		<div class="p-6">
        	<h1 class="text-2xl">🎉 환영합니다, ${user.nickname}님!</h1>
        	<p>이메일: ${user.email}, 토큰: ${accessToken}</p>
      	</div>
		<div class="w-full h-full flex flex-col justify-between ">
			<div class="flex flex-row justify-around items-center border-2 w-full h-full">
				<ul class="min-h-60 flex flex-col justify-around items-center text-white text-center">
					<li class="min-w-40 min-h-14 bg-black rounded-lg flex flex-col justify-around"><a href="#/local-game">로컬</a></li>
					<li class="min-w-40 min-h-14 bg-black rounded-lg flex flex-col justify-around"><a href="#/tournament-game">토너먼트</a></li>
					<li id="myInfoBtn" class="min-w-40 min-h-14 bg-black rounded-lg flex flex-col justify-around"><a >내 정보</a></li>
				</ul>
				<div class="min-h-1/3 min-w-1/3 h-1/3 w-1/3 top-1/2" >
          <img src="${movingBall}">
        </div>
			</div>
			<div data-component="myInfoModal" class="hidden flex items-center justify-center bg-blue-200"></div>
			<footer class="w-full h-16 flex flex-row justify-end items-center">
			<button class="mr-3" id="logoutBtn">
				<img src="${logoutIcon}" alt="logout" class="w-8 h-8 cursor-pointer" >

			</button>
			</footer>
		</div>
	`;
  }
  render() {
    this.$target.innerHTML = this.template(); // template() 메서드로 HTML 생성 후 렌더링
    this.mounted();
  }
  mounted() {
    const $myInfoModal = this.$target.querySelector(
      '[data-component="myInfoModal"]',
    ) as HTMLElement;

    new MyInfoModal($myInfoModal, {
      closeModal: this.closeModal.bind(this),
    });
  }

  closeModal($target: HTMLElement) {
    $target.classList.add('hidden');
  }

  openModal(target: string) {
    const $target = document.querySelector(target) as HTMLElement;
    $target.classList.remove('hidden');
  }
}
