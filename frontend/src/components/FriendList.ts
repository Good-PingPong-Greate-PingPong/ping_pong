import { Component } from '../core/Component';
import { Friend } from './friend';
import nextIcon from '../assets/next.svg';
import mockImg from '../assets/mock.jpg';

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

const pagedFriendsMockData = [
  {
    totalPage: 3, // 총 페이지 수
    currentPage: 1,
    friends: [
      { id: 1, nickname: 'friend1', profileImage: mockImg },
      { id: 2, nickname: 'friend2', profileImage: mockImg },
      { id: 3, nickname: 'friend3', profileImage: mockImg },
      { id: 4, nickname: 'friend4', profileImage: mockImg },
    ],
  },
  {
    totalPage: 3, // 총 페이지 수
    currentPage: 2,
    friends: [
      { id: 5, nickname: 'friend5', profileImage: mockImg },
      { id: 6, nickname: 'friend6', profileImage: mockImg },
      { id: 7, nickname: 'friend7', profileImage: mockImg },
      { id: 8, nickname: 'friend8', profileImage: mockImg },
    ],
  },
  {
    totalPage: 3, // 총 페이지 수
    currentPage: 3,
    friends: [
      { id: 9, nickname: 'friend9', profileImage: mockImg },
      { id: 10, nickname: 'friend10', profileImage: mockImg },
      { id: 11, nickname: 'friend11', profileImage: mockImg },
      { id: 12, nickname: 'friend12', profileImage: mockImg },
    ],
  },
];

// test
function getMockData(page: number): IFriendsData | undefined {
  return pagedFriendsMockData.find((p) => p.currentPage === page);
}

export class FriendsList extends Component {
  setup() {
    this.fetchFriendsData(1);
  }

  setEvent() {
    this.addEvent('click', '#leftBtn', () => {
      if (this.$state.currentPage > 1) {
        const currentPage = this.$state.currentPage - 1;
        this.fetchFriendsData(currentPage);
      }
    });
    this.addEvent('click', '#rightBtn', () => {
      if (this.$state.currentPage < this.$state.totalPage) {
        const currentPage = this.$state.currentPage + 1;
        this.fetchFriendsData(currentPage);
      }
    });
  }

  template(): string {
    const { friends, currentPage, totalPage } = this.$state;
    if (friends) {
      return `
        <div class="w-full h-full p-16 bg-backgroundColor rounded-b-lg rounded-t-lg">
            <div class="flex flex-row justify-end">
                <div class="w-60 h-11 bg-white rounded-[10px] border-[3px] border-default"></div>
                <div>icon</div>
            </div>
            <div class=" h-full flex flex-col justify-center"">
            <div class="flex flex-row justify-around items-center ">
              <img src="${nextIcon}" id="leftBtn" class="rotate-180 cursor-pointer"/>
              <div class="">
              ${friends
                .map(
                  (_: IFriend, index: number) => `
                <div data-component="friend-${index}" class="bg-red">contents</div>
                `,
                )
                .join('')}
                </div>
              <img src="${nextIcon}" id="rightBtn" class="cursor-pointer"/>
              </div>
                <div class="h-[40px] flex flex-row justify-center items-center gap-2">
                  ${Array.from(
                    { length: totalPage },
                    (_, i) => `
                    <span class="inline-block w-2 h-2 rounded-full ${currentPage === i + 1 ? 'bg-mainColor' : 'bg-gray-300'}"></span>
                  `,
                  ).join('')}
                </div>
            </div>
            </div>
        </div>
        `;
    } else {
      return ``;
    }
  }

  mounted(): void {
    const { friends } = this.$state;
    if (friends) {
      this.$state.friends.forEach((friend: IFriend, index: number) => {
        const $friendContainer = this.$target.querySelector(
          `[data-component="friend-${index}"]`,
        ) as HTMLElement;
        if ($friendContainer) {
          new Friend($friendContainer, { friendData: friend });
        }
      });
    }
  }

  async fetchFriendsData(page: number) {
    const friendsData = await this.getFriendsData(page);
    this.setState({
      friends: friendsData.friends,
      currentPage: friendsData.currentPage,
      totalPage: friendsData.totalPage,
    });
  }

  async getFriendsData(page: number): Promise<IFriendsData> {
    try {
      // const response = await fetch(`/api/friends?page=${page}&offset=${offset}`, {
      //   method: 'GET',
      //   credentials: 'include',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(`${errorData.error_code}: ${errorData.message}`);
      // }
      // const data = await response.json();

      const data = getMockData(page);
      if (!data) {
        throw new Error('No friends data found for the given page.');
      }
      return data;
    } catch (error) {
      console.error(error);
      throw error; // 에러를 상위로 전파
    }
  }
}
