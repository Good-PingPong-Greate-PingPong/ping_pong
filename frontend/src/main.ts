// src/main.ts - 애플리케이션 진입점
import './style.css';
import { App } from './app';

// DOM이 로드된 후 앱 시작
document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.querySelector('#app') as HTMLElement;

  if (appContainer) {
    try {
      const app = new App(appContainer);
      app.init();
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
