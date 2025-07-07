import { Component } from '../core/Component';
import nextIcon from '../assets/next.svg';
import { Record } from './Record';
export interface IRecord {
  user1Nickname: string;
  user2Nickname: string;
  user1Score: number;
  user2Score: number;
  user1Image?: string;
  user2Image?: string;
  createdAt: string;
}
interface IGameRecord {
  totalPage: number;
  currentPage: number;
  records: IRecord[];
}

const mockData = [
  {
    totalPage: 3,
    currentPage: 1,
    records: [
      {
        user1Nickname: 'friend1',
        user2Nickname: 'friend2',
        user1Score: 6,
        user2Score: 5,
        createdAt: '2024-01-15T10:30:00Z',
      },
      {
        user1Nickname: 'friend1',
        user2Nickname: 'friend3',
        user1Score: 7,
        user2Score: 2,
        createdAt: '2024-01-14T14:20:00Z',
      },
      {
        user1Nickname: 'friend1',
        user2Nickname: 'friend4',
        user1Score: 1,
        user2Score: 8,
        createdAt: '2024-01-13T09:15:00Z',
      },
    ],
  },
  {
    totalPage: 3,
    currentPage: 2,
    records: [
      {
        user1Nickname: 'friend1',
        user2Nickname: 'friend5',
        user1Score: 6,
        user2Score: 4,
        createdAt: '2024-01-12T16:45:00Z',
      },
      {
        user1Nickname: 'friend1',
        user2Nickname: 'friend6',
        user1Score: 2,
        user2Score: 9,
        createdAt: '2024-01-11T11:30:00Z',
      },
      {
        user1Nickname: 'friend1',
        user2Nickname: 'friend7',
        user1Score: 8,
        user2Score: 3,
        createdAt: '2024-01-10T13:25:00Z',
      },
    ],
  },
  {
    totalPage: 3,
    currentPage: 3,
    records: [
      {
        user1Nickname: 'friend1',
        user2Nickname: 'friend8',
        user1Score: 4,
        user2Score: 6,
        createdAt: '2024-01-09T08:10:00Z',
      },
      {
        user1Nickname: 'friend1',
        user2Nickname: 'friend9',
        user1Score: 9,
        user2Score: 1,
        createdAt: '2024-01-08T15:55:00Z',
      },
      {
        user1Nickname: 'friend1',
        user2Nickname: 'friend10',
        user1Score: 5,
        user2Score: 7,
        createdAt: '2024-01-07T12:40:00Z',
      },
    ],
  },
];

function getMockData(page: number): IGameRecord | undefined {
  return mockData.find((p) => p.currentPage === page);
}

export class GameHistory extends Component {
  setup() {
    this.setState({ category: 0 });
    this.fetchHistory(1, this.$state.category);
  }

  setEvent(): void {
    this.addEvent('click', '#leftBtn', () => {
      if (this.$state.currentPage > 1) {
        const currentPage = this.$state.currentPage - 1;
        this.fetchHistory(currentPage, this.$state.category);
      }
    });
    this.addEvent('click', '#rightBtn', () => {
      if (this.$state.currentPage < this.$state.totalPage) {
        const currentPage = this.$state.currentPage + 1;
        this.fetchHistory(currentPage, this.$state.category);
      }
    });

    this.addEvent('click', '.category-item', (event) => {
      const target = event.target as Element;
      const tabIndex = parseInt(target.getAttribute('data-category-index') || '0');
      if (this.$state.category === tabIndex) return; // 이미 활성화된 탭이면 아무것도 하지 않음
      this.setState({ category: tabIndex });
      this.fetchHistory(1, tabIndex);
    });
  }
  template(): string {
    const { category } = this.$state;
    const { records, currentPage, totalPage } = this.$state;
    if (records) {
      return `
        <div class="w-full h-full p-16 bg-backgroundColor rounded-b-lg rounded-t-lg">
            <div class="flex flex-row justify-end">
              <div class="w-[70px] h-6 ${category === 0 ? 'bg-mainColor' : 'bg-gray-300'} rounded inline-flex justify-center items-center gap-1.5">
                  <div data-category-index="0" class="category-item ${category === 0 ? 'active-tab cursor-default text-white' : 'cursor-pointer text-mainColor'} text-center justify-center text-base font-extrabold font-['Inter']">토너먼트</div>
              </div>
              <div class="w-[70px] h-6 ${category === 1 ? 'bg-mainColor' : 'bg-gray-300'} rounded inline-flex justify-center items-center gap-1.5">
                  <div data-category-index="1" class="category-item ${category === 1 ? 'active-tab cursor-default text-white' : 'cursor-pointer text-mainColor'} text-center justify-center text-base font-extrabold font-['Inter']">로컬</div>
              </div>
            </div>
            <div class=" h-full flex flex-col justify-center"">
            <div class="flex flex-row justify-around items-center ">
              <img src="${nextIcon}" id="leftBtn" class="rotate-180 cursor-pointer"/>
              <div class="">
              ${records
                .map(
                  (_: IRecord, index: number) => `
                <div data-component="record-${index}" class="bg-red">contents</div>
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
        </div>
        `;
    } else {
      return ``;
    }
  }

  mounted() {
    const { records } = this.$state;
    if (records) {
      records.forEach((record: IRecord, index: number) => {
        const $recordContainer = this.$target.querySelector(
          `[data-component="record-${index}"]`,
        ) as HTMLElement;
        if ($recordContainer) {
          const isTournament = false;
          new Record($recordContainer, { record, isTournament });
        }
      });
    }
  }

  async fetchHistory(page: number, category: number) {
    const gameHistory = await this.getGameHistory(page, category);
    this.setState({
      currentPage: gameHistory.currentPage,
      totalPage: gameHistory.totalPage,
      records: gameHistory.records,
    });
  }

  async getGameHistory(page: number, category: number): Promise<IGameRecord> {
    try {
      console.log(category);
      // const url = category === 0
      //   ? `/api/tournaments/results?page=${page}&offset=${offset}`
      //   : `/api/localgame/results?page=${page}&offset=${offset}`;
      // const response = await fetch(url, {
      //   method: 'GET',
      //   credentials: 'include',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // // });
      // console.log(response);
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
