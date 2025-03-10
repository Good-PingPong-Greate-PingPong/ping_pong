import { renderHomePage } from '../pages/HomePage';
import { renderTournamentGamePage } from '../pages/TournamentGamePage';
import { renderLocalGamePage } from '../pages/LocalGamePage';
import { renderNotFoundPage } from '../pages/NotFoundPage';
import { Route } from '../types';

class Router {
  private routes: Route[];

  constructor() {
    this.routes = [
      { path: '/', component: renderHomePage },
      { path: '/tournament-game', component: renderTournamentGamePage },
      { path: '/local-game', component: renderLocalGamePage },
      // 더 많은 라우트 추가 가능
    ];
  }

  init(): void {
    // 링크 클릭 이벤트 위임 처리
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('/')) {
        e.preventDefault();
        const href = target.getAttribute('href') || '/';
        this.navigateTo(href);
      }
    });
  }

  navigateTo(path: string): void {
    window.history.pushState(null, '', path);
    // popstate 이벤트를 수동으로 발생시키지 않기 때문에
    // 아래에서 렌더링을 트리거해야 함
    window.dispatchEvent(new Event('popstate'));
  }

  getCurrentRoute(): string {
    return window.location.pathname;
  }

  renderCurrentRoute(): string {
    const path = this.getCurrentRoute();
    const route = this.routes.find((route) => route.path === path);

    if (route) {
      return route.component();
    }

    // 404 페이지
    return renderNotFoundPage();
  }
}

export const router = new Router();
