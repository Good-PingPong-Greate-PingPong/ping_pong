import { Component } from '../core/Component';
import nextIcon from '../assets/next.svg';
import { Record } from './Record';
import { store } from '../core/store';
import { i18n } from '../types/i18n';

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
    const { category, records = [], currentPage, totalPage } = this.$state;
    const { language } = store.getState();
    const { history, tournament, local } = i18n[language];

    return `
      <div class="w-full h-full p-16 bg-backgroundColor rounded-b-lg rounded-t-lg">
        <div class="flex flex-row justify-end">
          <div class="w-[70px] h-6 ${category === 0 ? 'bg-mainColor' : 'bg-gray-300'} rounded inline-flex justify-center items-center gap-1.5">
              <div data-category-index="0" class="category-item ${category === 0 ? 'active-tab cursor-default text-white' : 'cursor-pointer text-mainColor'} text-center justify-center text-base font-extrabold font-['Inter']">${tournament}</div>
          </div>
          <div class="w-[70px] h-6 ${category === 1 ? 'bg-mainColor' : 'bg-gray-300'} rounded inline-flex justify-center items-center gap-1.5">
              <div data-category-index="1" class="category-item ${category === 1 ? 'active-tab cursor-default text-white' : 'cursor-pointer text-mainColor'} text-center justify-center text-base font-extrabold font-['Inter']">${local}</div>
          </div>
        </div>
        <div class="h-full flex flex-col justify-center">
          <div class="flex flex-row justify-around items-center">
            <img src="${nextIcon}" id="leftBtn" class="rotate-180 cursor-pointer"/>
            <div>
              ${
                records.length > 0
                  ? records
                      .map(
                        (_: IRecord, index: number) => `
                      <div data-component="record-${index}" class="bg-red">contents</div>
                    `,
                      )
                      .join('')
                  : `<div class="text-gray-400 text-center py-8">${history}</div>`
              }
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
    `;
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
      const accessToken = store.getState().accessToken;
      const url =
        category === 0
          ? `/api/tournaments/results?page=${page}&offset=${3}`
          : `/api/localgame/results?page=${page}&offset=${3}`;
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log(response);
      const data = await response.json();
      // const data = getMockData(page);
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
