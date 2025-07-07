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
      // 실제 로그인 API 호출
      try {
        const response = await this.loginWithGoogle();
        if (response.status === 206) {
          // 2차 인증 필요
          // const tmpToken = response.token;
          // // 임시 토큰 저장 (예: store 또는 localStorage)
          // store.setState({ tmpToken });
          // this.setState({ currentView: 'twoFactor' });
        } else if (response.status === 201) {
          // 로그인 성공
          store.setState({ user: response.user });
          window.location.replace('#/');
        } else {
          alert('로그인 실패');
        }
      } catch (error) {
        alert('로그인 중 오류가 발생했습니다.');
      }
    });
  }

  // 로그인 API 함수
  async loginWithGoogle() {
    // 실제로는 구글 OAuth 인증 후 받은 코드를 서버에 전달해야 함
    // 여기서는 예시로 바로 fetch 호출
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify({ code: "구글에서 받은 인증코드" })
    });

    const data = await res.json();

    // 2FA 필요 시
    if (res.status === 206) {
      return {
        status: 206,
        token: res.headers.get('Authorization')?.replace('Bearer ', ''),
        ...data,
      };
    }
    // 로그인 성공 시
    if (res.status === 201) {
      return {
        status: 201,
        user: data.user,
        ...data,
      };
    }
    // 기타 에러
    throw new Error(data.message || '로그인 실패');
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
      new Modal($twoFactor, { qr: '큐알입니다' });
    }
  }
}
