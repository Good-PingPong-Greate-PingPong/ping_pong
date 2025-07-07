import { Component } from '../core/Component';
import onlineIcon from '../assets/online.svg';
import { store } from '../core/store';
import { i18n } from '../types/i18n';

export class Friend extends Component {
  setup() {
    const { id, nickname, profileImage, isFriend, isLogin } = this.$props.friendData;
    const { view } = this.$props;
    this.setState({
      view: view,
      id: id,
      nickname: nickname,
      profileImage: profileImage,
      isFriend: isFriend,
      isLogin: isLogin,
      isLoading: false, // API 요청 중 상태
    });
  }

  setEvent() {
    // 친구 추가/삭제 버튼 클릭 이벤트
    this.addEvent('click', '.friend-action-btn', async (event: Event) => {
      event.preventDefault();
      event.stopPropagation();

      const { isFriend, nickname, isLoading, id } = this.$state;

      // 이미 API 요청 중이면 무시
      if (isLoading) return;

      try {
        this.setState({ isLoading: true });

        if (isFriend) {
          // 친구 삭제
          await this.removeFriend(id);
          this.setState({
            isFriend: false,
            isLoading: false,
          });
          this.$props.clearSearch();
        } else {
          // 친구 추가
          await this.addFriend(nickname);
          this.setState({
            isFriend: true,
            isLoading: false,
          });

          this.$props.clearSearch();
        }
      } catch (error) {
        console.error('친구 관리 실패:', error);
        this.setState({ isLoading: false });

        // 에러 메시지 표시
        // this.showMessage('요청 처리 중 오류가 발생했습니다.', 'error');
      }
    });
  }

  template(): string {
    const { nickname, profileImage, isFriend, isLogin, isLoading } = this.$state;
    const { language } = store.getState();
    const friendMessage: string = isFriend? i18n[language].friendDelete : i18n[language].friendAdd;

    // console.log('template : isFriend :', view);
    return `
    <div data-property-1="1" class="w-80 h-16 relative m-2">
        <!-- 메인 컨테이너 -->
        <div class="w-full h-full rounded-lg bg-white flex">
            <!-- 프로필 이미지 섹션 -->
            ${
              profileImage
                ? `<div class="w-16 h-16 flex justify-center items-center">
                      <div class="w-12 h-12 rounded-full flex justify-center items-center overflow-hidden">
                          <img src="${profileImage}" alt="profile" class="w-full h-full object-cover" />
                      </div>
                  </div>`
                : `<div class="w-16 h-16 flex justify-center items-center">
                      <div class="w-12 h-12 rounded-full bg-gray-200 flex justify-center items-center">
                          <span class="text-gray-500 text-lg">👤</span>
                      </div>
                  </div>`
            }
            
            <!-- 사용자명 섹션 -->
            <div class="flex-1 flex justify-center items-center">
                <span class="text-black text-xl font-bold">${nickname}</span>
            </div>
            
            <!-- 온라인 상태 아이콘 섹션 -->
            <div class="w-16 h-16 flex justify-center items-center relative">
              <img 
                src="${onlineIcon}" 
                alt="online status"
                class="z-10"
              />
              ${
                !isLogin
                  ? `<div class="absolute top-0 left-0 w-full h-full rounded bg-white/70 z-20"></div>`
                  : ''
              }
            </div>
                <!-- 친구 추가/삭제 버튼 섹션 -->
                <div class="w-16 h-16 flex justify-center items-center rounded-tr-lg rounded-br-lg ${
                  isFriend ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                } transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}">
                    <button 
                      class="friend-action-btn w-full h-full flex justify-center items-center text-white text-2xl font-bold ${
                        isLoading ? 'cursor-not-allowed' : 'cursor-pointer'
                      }"
                      ${isLoading ? 'disabled' : ''}
                      title="${friendMessage}"
                    >
                        ${isLoading ? '⏳' : isFriend ? '×' : '+'}
                    </button>
                </div>
              </div>
        
        <!-- 로딩/메시지 오버레이 (선택사항) -->
        ${
          isLoading
            ? `
          <div class="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
            <div class="bg-white px-3 py-1 rounded text-sm">처리중...</div>
          </div>
        `
            : ''
        }
    </div>
    `;
  }

  async addFriend(nickname: string): Promise<void> {
    try {
      const accessToken = store.getState().accessToken;
      console.log('my f', nickname);
      const response = await fetch(`/api/friend?nickname=${nickname}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ nickname }), // body는 필요 없다면 제거
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`친구 추가 실패: ${errorData.message || '알 수 없는 오류'}`);
      }

      console.log(`${nickname}님을 친구로 추가했습니다.`);
    } catch (error) {
      console.error('친구 추가 API 호출 실패:', error);
      throw error;
    }
  }

  async removeFriend(receiverId: number): Promise<void> {
    try {
      const accessToken = store.getState().accessToken;
      const response = await fetch('/api/friend', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ receiverId }), // 반드시 포함!
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`친구 삭제 실패: ${errorData.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('친구 삭제 API 호출 실패:', error);
      throw error;
    }
  }
}
