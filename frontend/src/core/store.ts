import { AppState } from '../types';

class Store {
  private state: AppState;
  private listeners: (() => void)[];
  
  constructor() {
    this.state = {
      user: null,
      isLoading: false,
      error: null,
      theme: 'light'
    };
    this.listeners = [];
  }
  
  init(): void {
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
  
  getState(): AppState {
    return { ...this.state };
  }
  
  setState(partialState: Partial<AppState>): void {
    this.state = { ...this.state, ...partialState };
    
    // 상태 변경 시 로컬 스토리지에 저장
    localStorage.setItem('app-state', JSON.stringify(this.state));
    
    // 구독자들에게 알림
    this.notifyListeners();
  }
  
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    
    // 구독 취소 함수 반환
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

export const store = new Store();