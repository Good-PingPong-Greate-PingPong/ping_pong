import { Component } from '../core/Component';
import { Friend } from './friend';
import nextIcon from '../assets/next.svg';
import { store } from '../core/store';

interface IFriend {
  id: number;
  nickname: string;
  profileImage: string;
  isFriend?: boolean;
  isLogin?: boolean;
}

interface IFriendsData {
  totalPage: number;
  currentPage: number;
  friends: IFriend[];
}

interface ISearchData {
  totalPage: number;
  currentPage: number;
  users: {
    id: number;
    nickname: string;
    // profileImage: string;
    isFriend: boolean;
    isLogin: boolean;
  }[];
}

export class FriendsList extends Component {
  setup() {
    this.setState({
      friends: [],
      currentPage: 1,
      totalPage: 1,
      searchTerm: '',
      isSearching: false,
      searchResults: [],
    });
    this.fetchFriendsData(1);
  }

  setEvent() {
    // 페이지네이션 버튼 이벤트
    this.addEvent('click', '#leftBtn', () => {
      if (this.$state.currentPage > 1) {
        const currentPage = this.$state.currentPage - 1;
        if (this.$state.isSearching) {
          this.performSearch(this.$state.searchTerm, currentPage);
        } else {
          this.fetchFriendsData(currentPage);
        }
      }
    });

    this.addEvent('click', '#rightBtn', () => {
      if (this.$state.currentPage < this.$state.totalPage) {
        const currentPage = this.$state.currentPage + 1;
        if (this.$state.isSearching) {
          this.performSearch(this.$state.searchTerm, currentPage);
        } else {
          this.fetchFriendsData(currentPage);
        }
      }
    });

    // // 검색 입력 이벤트 (상태만 업데이트)
    // this.addEvent('input', '#searchInput', (event: Event) => {
    //   const target = event.target as HTMLInputElement;
    //   const searchTerm = target.value.trim();

    //   this.setState({
    //     searchTerm: searchTerm
    //   });
    // });

    // 검색 버튼 클릭 이벤트
    this.addEvent('click', '#searchBtn', () => {
      const searchInput = this.$target.querySelector('#searchInput') as HTMLInputElement;
      const searchTerm = searchInput ? searchInput.value.trim() : '';

      if (searchTerm === '') {
        // 검색어가 비어있으면 친구 목록으로 돌아가기
        this.setState({
          isSearching: false,
          searchResults: [],
        });
        this.fetchFriendsData(1);
        return;
      }

      // 검색 수행
      this.setState({
        isSearching: true,
        searchTerm, // input 값을 state에도 반영
      });
      this.performSearch(searchTerm, 1);
    });

    // Enter 키 검색 이벤트
    this.addEvent('keydown', '#searchInput', (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key === 'Enter') {
        const searchBtn = this.$target.querySelector('#searchBtn') as HTMLButtonElement;
        if (searchBtn) {
          searchBtn.click();
        }
      }
    });

    // 검색 취소 버튼 이벤트
    this.addEvent('click', '#clearSearch', () => {
      this.clearSearch();
    });
  }

  template(): string {
    const { friends, currentPage, totalPage, searchTerm, isSearching, searchResults } = this.$state;
    const displayData = isSearching ? searchResults : friends;

    return `
      <div class="w-full h-full p-16 bg-backgroundColor rounded-b-lg rounded-t-lg">
        <div class="flex flex-row justify-end items-center gap-2 mb-4">
          <div class="relative flex-1 max-w-xs">
            <input 
              type="text" 
              id="searchInput" 
              placeholder="친구 검색..." 
              value="${searchTerm}"
              class="w-full h-11 px-4 pr-10 bg-white rounded-[10px] border-[3px] border-default focus:outline-none focus:border-mainColor"
            />
            ${
              searchTerm
                ? `
              <button 
                id="clearSearch" 
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            `
                : ''
            }
          </div>
          <button 
            id="searchBtn"
            class="w-11 h-11 bg-mainColor rounded-[10px] flex items-center justify-center hover:bg-opacity-80 transition-colors"
          >
            <span class="text-white text-lg">🔍</span>
          </button>
        </div>
        
        <div class="h-full flex flex-col justify-center">
          <div class="flex flex-row justify-around items-center">
            <img 
              src="${nextIcon}" 
              id="leftBtn" 
              class="rotate-180 cursor-pointer ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''}"
            />
            <div class="min-h-[200px] flex flex-col justify-center">
              ${
                displayData && displayData.length > 0
                  ? displayData
                      .map(
                        (_: IFriend, index: number) => `
                          <div data-component="friend-${index}" class="friend-item"></div>
                        `,
                      )
                      .join('')
                  : `<div class="text-gray-400 text-center py-8">
                      ${
                        isSearching
                          ? `"${searchTerm}"에 대한 검색 결과가 없습니다.`
                          : '친구가 없습니다.'
                      }
                    </div>`
              }
            </div>
            <img 
              src="${nextIcon}" 
              id="rightBtn" 
              class="cursor-pointer ${currentPage >= totalPage ? 'opacity-50 cursor-not-allowed' : ''}"
            />
          </div>
          
          ${
            totalPage > 1
              ? `
            <div class="h-[40px] flex flex-row justify-center items-center gap-2">
              ${Array.from(
                { length: totalPage },
                (_, i) => `
                  <span class="inline-block w-2 h-2 rounded-full ${currentPage === i + 1 ? 'bg-mainColor' : 'bg-gray-300'}"></span>
                `,
              ).join('')}
            </div>
          `
              : ''
          }
          
          ${
            isSearching
              ? `
            <div class="text-center text-sm text-gray-500 mt-2">
              검색 결과: ${displayData.length}개
            </div>
          `
              : ''
          }
        </div>
      </div>
    `;
  }

  mounted(): void {
    const { friends, isSearching, searchResults } = this.$state;
    const displayData = isSearching ? searchResults : friends;
    // console.log('mounted : display : ', displayData);

    if (displayData && displayData.length > 0) {
      displayData.forEach((friend: IFriend, index: number) => {
        const $friendContainer = this.$target.querySelector(
          `[data-component="friend-${index}"]`,
        ) as HTMLElement;
        if ($friendContainer) {
          new Friend($friendContainer, {
            view: isSearching ? 'search':'list',
            friendData: friend,
            clearSearch: this.clearSearch.bind(this),
          });
        }
      });
    }
  }

  async fetchFriendsData(page: number) {
    try {
      const friendsData = await this.getFriendsData(page);
      this.setState({
        friends: friendsData.friends,
        currentPage: friendsData.currentPage,
        totalPage: friendsData.totalPage,
      });
    } catch (error) {
      console.error('친구 목록 조회 실패:', error);
    }
  }

  async performSearch(searchTerm: string, page: number = 1) {
    try {
      const searchData = await this.getSearchData(searchTerm, page);

      // API 응답을 내부 인터페이스 형태로 변환
      const transformedResults = (Array.isArray(searchData?.users) ? searchData.users : []).map(
        (user) => ({
          id: user.id,
          nickname: user.nickname,
          // profileImage: user.profileImage || user.profile_image || '',
          isFriend: user.isFriend ?? false,
          isLogin: user.isLogin ?? false,
        }),
      );
      console.log('performSearch : transformedResults ', transformedResults);
      console.log('performSearch : searchData ', searchData);

      this.setState({
        isSearching: true,
        searchResults: transformedResults,
        currentPage: searchData.currentPage,
        totalPage: searchData.totalPage,
      });
    } catch (error) {
      console.error('검색 실패:', error);
      this.setState({
        searchResults: [],
        currentPage: 1,
        totalPage: 1,
      });
    }
  }

  async getSearchData(nickname: string, page: number = 1): Promise<ISearchData> {
    try {
      const accessToken = store.getState().accessToken;
      const response = await fetch(
        `/api/users/info/list?nickname=${encodeURIComponent(nickname)}&page=${page}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.error_code}: ${errorData.message}`);
      }

      const responseData = await response.json();
      // data가 없으므로 전체에서 꺼내서 반환
      return {
        totalPage: responseData.totalPage ?? 1,
        currentPage: responseData.currentPage ?? 1,
        users: Array.isArray(responseData.users) ? responseData.users : [],
      };
    } catch (error) {
      console.error('검색 API 호출 실패:', error);
      throw error;
    }
  }

  async getFriendsData(page: number): Promise<IFriendsData> {
    try {
      const accessToken = store.getState().accessToken;
      const response = await fetch(`/api/friend?page=${page}&offset=4`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.error_code}: ${errorData.message}`);
      }

      const responseData = await response.json();
      // data.data.friend가 실제 친구 배열임
      return {
        totalPage: responseData.data.totalPage ?? 1,
        currentPage: responseData.data.currentPage ?? 1,
        friends: Array.isArray(responseData.data.friend) ? responseData.data.friend : [],
      };
    } catch (error) {
      console.error('친구 목록 API 호출 실패:', error);
      throw error;
    }
  }

  clearSearch(): void {
    // 검색 입력 필드 클리어
    const searchInput = this.$target.querySelector('#searchInput') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }

    // 상태 초기화 및 친구 목록 복원
    this.setState({
      searchTerm: '',
      isSearching: false,
      searchResults: [],
    });

    this.fetchFriendsData(1);
  }
}
