import { router } from './core/router';
import { store } from './core/store';
// import { renderHeader } from './components/common/Header';
// import { renderFooter } from './components/common/Footer';

export class App {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  init(): void {
    // 앱 초기화 로직
    store.init();
    router.init();

    // 초기 렌더링
    this.render();

    // 라우트 변경 이벤트 구독
    window.addEventListener('popstate', () => this.render());
  }

  render(): void {
    // 현재 라우트에 따라 적절한 페이지 렌더링
    const currentRoute = router.getCurrentRoute();
    const pageContent = router.renderCurrentRoute();

    // 앱 레이아웃 구성
    this.container.innerHTML = `
      <div id="app-container" class="border-2 ",>
        <main id="app-content", class=" w-full h-full flex flex-col justify-center items-center">${pageContent}</main>
      </div>
    `;

    // 공통 컴포넌트 마운트
    // const headerElement = document.getElementById('app-header');
    // const footerElement = document.getElementById('app-footer');

    // if (headerElement) renderHeader(headerElement);
    // if (footerElement) renderFooter(footerElement);
  }
}
