import './style.css';
import { App } from './app';

// DOM이 로드된 후 앱 시작
document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.querySelector('#app') as HTMLElement;

  if (appContainer) {
    try {
      new App(appContainer);
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  } else { 
	console.error('App container not found!');
  }
});

// 전역 에러 처리
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});
