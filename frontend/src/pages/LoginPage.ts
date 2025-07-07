import { TwoFactorModal } from '../components/TwoFactorModal';
import { Component } from '../core/Component';
import { store } from '../core/store';
import { i18n } from '../types/i18n';

export class LoginPage extends Component {
  setup() {
    this.$state = {
      currentView: 'login', // 'login', 'twoFactor'
    };
  }

  setEvent(): void {
    this.addEvent('click', '#loginButton', () => {
      const { language } = store.getState();
      const { popUp, loginFail } = i18n[language];

      const popup = window.open(
        '/api/auth/google', // 서버에서 Google OAuth 인증 시작
        '_blank',
        'width=500,height=600',
      );

      if (!popup) {
        alert(popUp);
        return;
      }

      const listener = (event: MessageEvent) => {
        // 보안상 origin 체크 필수
        if (event.origin !== window.location.origin) return;

        const data = event.data;

        if (data.status === 206) {
          // 2FA 필요
          console.log(data.token);
          store.setState({ tmpToken: data.token });
          this.setState({ currentView: 'twoFactor' });
        } else if (data.status === 201) {
          // 로그인 성공
          console.log(data.token);

          console.log('로그인 성공');
          store.setState({ user: data.user });
          store.setState({ accessToken: data.token });

          // 이미 연결된 소켓이 있으면 재연결하지 않음
          let socket = store.getState().socket;
          if (!socket || socket.readyState !== WebSocket.OPEN) {
            const url = process.env.BACKEND_ORIGIN
            socket = new WebSocket(`wss://${url}/ws?token=` + data.token);
            socket.addEventListener('open', () => {
              console.log(' WebSocket 연결 성공');
            });
            store.setState({ socket }); // 소켓을 store에 저장
          } else {
            console.log('이미 연결된 소켓이 있습니다.');
          }

          window.location.replace('#/');
        } else {
          alert(data.message || loginFail);
        }

        // 이벤트 리스너 제거 (한 번만 받도록)
        window.removeEventListener('message', listener);
      };

      window.addEventListener('message', listener);
    });
  }

  template() {
    const { currentView } = this.$state;
    const { language } = store.getState();
    const { googleLogin } = i18n[language];

    if (currentView === 'login') {
      return `
        <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
          <button id="loginButton"> ${googleLogin} </button>
          <div data-component="modal"></div>
        </div>
      `;
    } else {
      return `
        <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
          <div data-component="modal"></div>
        </div>
      `;
    }
  }

  mounted(): void {
    if (this.$state.currentView === 'twoFactor') {
      const $twoFactor = document.querySelector('[data-component="modal"]') as HTMLElement;
      const tmpToken = store.getState().tmpToken;

      new TwoFactorModal($twoFactor, {
        view: 'pin',
        handleModal: this.handleModal.bind(this),
        token: tmpToken,
      });
    }
  }

  handleModal(view: string) {
    this.setState({ currentView: view });
  }
}
