import { Component } from "../core/Component";
import { store } from "../core/store";
import { LanguageSetting } from "./ LanguageSetting";
import { FriendsList } from "./FriendList";
import { GameHistory } from "./GameHistory";
import { Profile } from "./profile";


export class MyInfoModal extends Component {
    private unsubscribe?: () => void;

    setup() {
        // console.log("myInfoModal: setup")
        this.setState({ activeTab : 0 });
        // this.setState({componentsInit: false})

    }
    addEvent(eventType: string, selector: string, callback: (event: Event) => void): void {
		this.$target.addEventListener(eventType, (event: Event) => {
		  // 이벤트가 발생한 요소가 selector와 일치하지 않으면 무시
		const target = event.target as Element;
		if (!target.closest(selector)) return false;
		  callback(event); // selector와 일치하면 콜백 실행
		});
	}

    setEvent (){
        // 모달 외부 클릭 시 닫기 이벤트
        const { closeModal } = this.$props;
        this.addEvent('click', '#modalOverlay', () => {
            closeModal(this.$target);
        });

        // 탭 클릭 이벤트
        this.addEvent('click', '.tab-item', (event) => {
            const target = event.target as Element;
            const tabIndex = parseInt(target.getAttribute('data-tab-index') || '0');
            this.setState({ activeTab: tabIndex });
        });
    } 

    render () {
        this.$target.innerHTML = this.template(); // template() 메서드로 HTML 생성 후 렌더링
        this.mounted(); // 렌더링 후 추가 작업 수행
    }
    template() {
        const { activeTab } = this.$state;
        return `
        <div id="modalOverlay" class="w-full h-full absolute top-0 bg-black opacity-20 transition">
        </div>
        <div class="w-[800px] fixed inset-y-32 transition ">
            <div class="flex flex-row ">
                <div class="tab-item ${activeTab === 0 ? 'bg-backgroundColor' : 'bg-neutral-300 cursor-pointer'}  trapezoid-shape w-[200px] h-[52px] rounded-tl-lg flex justify-center items-center text-center ${activeTab === 0 ? 'active-tab' : ''}" data-tab-index="0">내 정보</div>
                <div class="tab-item ${activeTab === 1 ? 'bg-backgroundColor' : 'bg-neutral-300 cursor-pointer'} trapezoid-shape w-[200px] h-[52px] rounded-tl-lg flex justify-center items-center text-center ${activeTab === 1 ? 'active-tab' : ''}" data-tab-index="1">친구 목록</div>
                <div class="tab-item ${activeTab === 2 ? 'bg-backgroundColor' : 'bg-neutral-300 cursor-pointer'} trapezoid-shape w-[200px] h-[52px] rounded-tl-lg flex justify-center items-center text-center ${activeTab === 2 ? 'active-tab' : ''}" data-tab-index="2">게임 기록</div>
                <div class="tab-item ${activeTab === 3 ? 'bg-backgroundColor' : 'bg-neutral-300 cursor-pointer'} trapezoid-shape w-[200px] h-[52px] rounded-tl-lg flex justify-center items-center text-center ${activeTab === 3 ? 'active-tab' : ''}" data-tab-index="3">언어 설정</div>
            </div>
            <div data-component="myInfo" class="${activeTab === 0 ? '' : 'hidden'} w-full h-full rounded-b-lg rounded-tr-lg"></div>
            <div data-component="myFriends" class="${activeTab === 1 ? '' : 'hidden'} w-full h-full rounded-b-lg rounded-tr-lg"></div>
            <div data-component="myLogs" class="${activeTab === 2 ? '' : 'hidden'} w-full h-full rounded-b-lg rounded-tr-lg"></div>
            <div data-component="myLanguage" class="${activeTab === 3 ? '' : 'hidden'} w-full h-full rounded-b-lg rounded-tr-lg"></div>
        </div>
        `;
    }

    mounted() {
        const user = store.getState().user; // store에서 user 정보 가져오기
        // 구독 시 수행할 함수를 인자로 넘기고 구독 해지 함수를 반환받는다.
        this.unsubscribe = store.subscribe(() => this.render());
        
        // 초기 탭 컴포넌트 마운트
        const $myInfo = this.$target.querySelector('[data-component="myInfo"]') as HTMLElement;
        const $myFriends = this.$target.querySelector('[data-component="myFriends"]') as HTMLElement;
        const $myLogs = this.$target.querySelector('[data-component="myLogs"]') as HTMLElement;
        const $myLanguage = this.$target.querySelector('[data-component="myLanguage"]') as HTMLElement;
        
        // 처음 렌더링 시에만 컴포넌트 생성
            new Profile($myInfo, {user});
            new FriendsList($myFriends, {user});
            new GameHistory($myLogs, {user});
            new LanguageSetting($myLanguage);
    }

    Unmount() {
      //구독 해제
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    }


}