import { Component } from "../core/Component";
import { FriendsList } from "./FriendList";
import { GameHistory } from "./GameHistory";
import { Profile } from "./profile";


export class MyInfoModal extends Component {

    setup() {
        // console.log("myInfoModal: setup")
        this.setState({ activeTab : 0 });
        this.setState({componentsInit: false})

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
        // console.log("myInfoModal: render", "this.$state.componentsInit : ",this.$state.componentsInit)
        this.$target.innerHTML = this.template(); // template() 메서드로 HTML 생성 후 렌더링
        this.mounted(); // 렌더링 후 추가 작업 수행
    }
    template() {
        const { activeTab } = this.$state;
        // console.log("myInfoModal : template ",activeTab)
        return `
        <div id="modalOverlay" class="w-full h-full absolute top-0 bg-black opacity-20 transition">
        </div>
        <div class="w-[800px] fixed inset-y-32 transition">
            <div class="flex flex-row ">
                <div class="tab-item trapezoid-shape w-[199px] h-[52px] rounded-tl-lg flex justify-center items-center text-center ${activeTab === 0 ? 'active-tab' : ''}" data-tab-index="0">내 정보</div>
                <div class="tab-item trapezoid-shape w-[199px] h-[52px] rounded-tl-lg flex justify-center items-center text-center ${activeTab === 1 ? 'active-tab' : ''}" data-tab-index="1">친구 목록</div>
                <div class="tab-item trapezoid-shape w-[199px] h-[52px] rounded-tl-lg flex justify-center items-center text-center ${activeTab === 2 ? 'active-tab' : ''}" data-tab-index="2">게임 기록</div>
            </div>
            <div data-component="myInfo" class="${activeTab === 0 ? '' : 'hidden'} w-full h-full rounded-b-lg rounded-tr-lg"></div>
            <div data-component="myFriends" class="${activeTab === 1 ? '' : 'hidden'} bg-white w-full h-full rounded-b-lg rounded-tr-lg"></div>
            <div data-component="myLogs" class="${activeTab === 2 ? '' : 'hidden'} bg-white w-full h-full rounded-b-lg rounded-tr-lg"></div>
        </div>
        `;
    }

    mounted() {
        // console.log("myInfoModal: mounted")
        // const { activeTab } = this.$state;
            // this.setState({componentsInit: true})
        
        // 초기 탭 컴포넌트 마운트
        const $myInfo = this.$target.querySelector('[data-component="myInfo"]') as HTMLElement;
        const $myFriends = this.$target.querySelector('[data-component="myFriends"]') as HTMLElement;
        const $myLogs = this.$target.querySelector('[data-component="myLogs"]') as HTMLElement;
        
        // 처음 렌더링 시에만 컴포넌트 생성
        // console.log(this.$state.componentsInit)
        // if (!this.$state.componentsInit) {
            // console.log("myInfoModal: componentsInit : ", this.$state.componentsInit)
            new Profile($myInfo);
            new FriendsList($myFriends);
            new GameHistory($myLogs);
            
            // setState를 사용하여 상태 업데이트
            // this.setState({ componentsInit: true });
            // 여기서 setState를 사용하면 render()가 다시 호출되어 무한 루프가 될 수 있으므로
            // 상태 업데이트 후 바로 반환
            // return;
        // }
    }


}