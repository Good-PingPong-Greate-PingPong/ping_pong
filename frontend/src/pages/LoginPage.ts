import { Modal } from '../components/Modal';
import { Component } from '../core/Component';
import { store } from '../core/store';

export class LoginPage extends Component {
  setup() {
    this.$state = {
      currentView: 'login', // 'login', 'twoFactor'
    };
  }

  setEvent(): void {
    this.addEvent('click', '#loginButton', async () => {
      const popup = window.open(
        '/api/auth/google', // 서버에서 Google OAuth 인증 시작
        '_blank',
        'width=500,height=600',
      );

      if (!popup) {
        alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
        return;
      }

      const listener = (event: MessageEvent) => {
        // 보안상 origin 체크 필수
        if (event.origin !== window.location.origin) return;

        const data = event.data;

        if (data.status === 206) {
          // 2FA 필요
          store.setState({ tmpToken: data.token });
          this.setState({ currentView: 'twoFactor' });
        } else if (data.status === 201) {
          // 로그인 성공
          store.setState({ user: data.user });
          window.location.replace('#/');
        } else {
          alert(data.message || '로그인 실패');
        }

        // 이벤트 리스너 제거 (한 번만 받도록)
        window.removeEventListener('message', listener);
      };

      window.addEventListener('message', listener);
    });
  }

  template() {
    const { currentView } = this.$state;

    if (currentView === 'login') {
      return `
        <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
          <button id="loginButton"> 구글 계정으로 로그인 </button>
          <div data-component="modal"></div>
        </div>
      `;
    } else if (currentView === 'twoFactor') {
      return `
        <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
          <div data-component="modal"></div>
        </div>
      `;
    } else {
      return `<div>error</div>`;
    }
  }

  mounted(): void {
    if (this.$state.currentView === 'twoFactor') {
      const $twoFactor = document.querySelector('[data-component="modal"]') as HTMLElement;
      const tmpToken = store.getState().tmpToken;

      // 실제 QR코드 URL이 있다면 이쪽으로
      new Modal($twoFactor, {
        qr: '큐알입니다', // or store.state.qr
        token: tmpToken,
      });
    }
  }
}
