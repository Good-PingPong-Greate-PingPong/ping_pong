import { IAppState, Language } from '../types';

class Store {
  private state: IAppState;
  private listeners: (() => void)[];

  constructor() {
    this.state = {
      user: null,
      accessToken: null,
      tmpToken: null,
      language: Language.KR,
      socket: null, // 추가
    };
    this.listeners = [];
  }

  init(): void {
    // TODO : 임시로 로컬스토리지에 저장중. JWT 만 저장하는 방식으로 수정 예정
    // 로컬 스토리지에서 상태 복원 등의 초기화 작업
    const savedState = localStorage.getItem('app-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        this.state = { ...this.state, ...parsedState };
      } catch (error) {
        console.error('Failed to parse saved state:', error);
      }
    }
  }

  getState(): IAppState {
    return { ...this.state };
  }

  //Partial<IAppState> : IAppState 의 속성을 optional 로 만듬. 부분 상태만 업데이트 가능
  setState(partialState: Partial<IAppState>): void {
    this.state = { ...this.state, ...partialState };

    // TODO : 임시로 로컬스토리지에 저장중. 상태 변경 시 로컬 스토리지에 저장
    localStorage.setItem('app-state', JSON.stringify(this.state));

    // 구독자들에게 알림
    this.notifyListeners();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);

    // 구독 취소 함수 반환
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const store = new Store();
