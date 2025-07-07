import { Component } from '../core/Component';
import { store } from '../core/store';
import { i18n } from '../types/i18n';

export class TwoFactorModal extends Component {
  setup() {
    const { view } = this.$props;
    this.setState({
      view: view, // 'qr' 또는 'pin'
      qrCode: null,
      authCode: ['', '', '', '', '', ''],
      error: '',
      currentFocusIndex: 0,
      isResetRequested: false, // 추가된 부분
    });
    if (view === 'qr') {
      this.getTwoFactor();
    }
  }

  setEvent(): void {
    const {language} = store.getState();
    const authCodeError = i18n[language].authCodeError;

    this.addEvent('input', '.auth-digit-input', (event) => {
      const input = event.target as HTMLInputElement;
      const idx = Number(input.dataset.index);
      const value = input.value.replace(/\D/g, '').slice(0, 1); // 한 글자만 허용

      // input 값 직접 업데이트 (setState 사용하지 않음)
      input.value = value;

      // 다음 칸으로 자동 이동
      if (value && idx < 5) {
        const nextInput = this.$target.querySelector(
          `.auth-digit-input[data-index="${idx + 1}"]`,
        ) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    });

    // 백스페이스 키로 이전 칸으로 이동
    this.addEvent('keydown', '.auth-digit-input', (event) => {
      const keyboardEvent = event as KeyboardEvent;
      const input = event.target as HTMLInputElement;
      const idx = Number(input.dataset.index);

      // 백스페이스 키를 눌렀을 때
      if (keyboardEvent.key === 'Backspace') {
        // 현재 칸이 비어있고 첫 번째 칸이 아닌 경우 이전 칸으로 이동
        if (input.value === '' && idx > 0) {
          const prevInput = this.$target.querySelector(
            `.auth-digit-input[data-index="${idx - 1}"]`,
          ) as HTMLInputElement;
          if (prevInput) {
            prevInput.focus();
            // 이전 칸의 값도 지우기
            prevInput.value = '';
          }
        }
        // 현재 칸에 값이 있는 경우 값만 지우기 (이동하지 않음)
        else if (input.value !== '') {
          input.value = '';
        }
      }
    });

    // QR 화면 이벤트
    this.addEvent('click', '#confirmButton', () => {
      const { view } = this.$state;

      if (view === 'qr') {
        // this.setState({ view: 'pin' });
        this.$props.handleModal();
        // window.location.replace('#/');
      }
      if (view === 'pin') {
        // 확인 버튼 클릭 시 input 값들을 읽어서 상태에 저장
        const inputs = this.$target.querySelectorAll(
          '.auth-digit-input',
        ) as NodeListOf<HTMLInputElement>;
        const authCodeArr = Array.from(inputs).map((input) => input.value);
        this.setState({ authCode: authCodeArr });

        const authCode = authCodeArr.join('');
        if (!authCode || authCode.length !== 6) {
          this.setState({ error: `${authCodeError}` });
          return;
        }
        this.fetchPinNumber(authCode);
      }
    });
    this.addEvent('click', '#cancelButton', () => {
      this.$props.handleModal('login');
    });

    this.addEvent('click', '#reset2faBtn', () => {
      this.request2faReset();
    });

    // 배경 클릭 시 취소 이벤트
    this.addEvent('click', '[data-modal-overlay]', () => {
      // this.$props.handleModal('login');
      const { view } = this.$state;
      if (view === 'qr') {
        this.$props.handleModal();
      }
    });
  }

  template() {
    const { view, qrCode, error, isResetRequested } = this.$state;
    const {language} = store.getState();
    const confirm = i18n[language].confirm;
    const cancel = i18n[language].cancel;
    const qrCodeMessage = i18n[language].qrCodeMessage;
    const googleOtp = i18n[language].googleOtp;
    const reset2fa = i18n[language].reset2fa;

    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div data-modal-overlay class="absolute inset-0 bg-gray-800 bg-opacity-60"></div>
        <div class="relative z-10 w-[500px] h-[462.97px] shadow-[0px_0px_15.47743034362793px_0px_rgba(0,0,0,0.25)]">
          <div class="w-[500px] h-96 left-0 top-0 absolute bg-white rounded-2xl">
            <div class="left-[83px] top-[55px] absolute text-center justify-start text-mainColor text-3xl font-semibold font-['Inter']">
              ${view === 'qr' ? `${googleOtp}` : `${qrCodeMessage}`}
            </div>
            <div class="w-44 h-44 left-[163px] top-[148px] absolute">
              ${
                view === 'qr'
                  ? `<div class="bg-red-100 w-44 h-44"><img src="${qrCode}" /></div>`
                  : `<div class="flex justify-center items-center space-x-2">
                     ${[0, 1, 2, 3, 4, 5]
                       .map(
                         (idx: number) => `
                     <input type="text" class="auth-digit-input w-8 h-12 text-center border-2 border-gray-300 rounded text-lg font-semibold" 
                            data-index="${idx}" value="" maxlength="1" />
                   `,
                       )
                       .join('')}
                 </div>
                 ${
                   error
                     ? `
                   <div class="error text-red-500 text-sm mt-2 text-center">
                     ${error}
                     <button 
                       id="reset2faBtn"
                       class="ml-2 px-2 py-1 bg-mainColor text-white rounded text-xs ${isResetRequested ? 'opacity-50 cursor-not-allowed' : ''}"
                       type="button"
                       ${isResetRequested ? 'disabled' : ''}
                     >${reset2fa}</button>
                   </div>
                 `
                     : ''
                 }`
              }
          </div>
          <div class="w-[500px] left-0 top-[370.10px] absolute inline-flex justify-between items-center">
            <div class="w-64 h-24 bg-stone-300 rounded-bl-2xl"></div>
            <div class="w-64 h-24 bg-mainColor rounded-br-2xl"></div>
          </div>
          <div class="w-16 h-10 left-[340.83px] top-[397.73px] absolute justify-start text-white text-4xl font-extrabold font-['Inter']" 
               id="confirmButton">${confirm}</div>
          <div class="w-16 h-10 left-[90.83px] top-[397.73px] absolute justify-start text-zinc-600 text-4xl font-extrabold font-['Inter']" 
               id="cancelButton">${cancel}</div>
        </div>
      </div>
    `;
  }

  async getTwoFactor() {
    try {
      const url = `/api/2fa/setup`;
      const accessToken = store.getState().accessToken;
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // 토큰이 있다면 헤더에 추가
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.error_code}: ${errorData.message}`);
      }
      const data = await response.json();
      this.setState({
        qrCode: data.qrCode,
      });
    } catch (error) {
      console.log(error, ' 큐알 불러오기 실패');

      const url = `/api/auth/refresh`;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include', // 쿠키 자동 전송
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // body는 없어도 되지만, Fastify 스키마에 따라 빈 객체라도 보내는 것이 안전
      });

      const authHeader = (await response).headers.get('Authorization');

      if (authHeader) {
        // 토큰 타입과 값 분리
        const parts = authHeader.split(' ');
        const tokenType = parts[0]; // 'Bearer'
        const token = parts[1]; // 실제 토큰 값

        // 토큰 타입 검증
        if (tokenType === 'Bearer') {
          localStorage.setItem('accessToken', token);
          console.log('Bearer 토큰이 정상적으로 수신되었습니다.');
          store.setState({ accessToken: token });
          this.getTwoFactor();
        } else {
          console.warn('예상하지 못한 토큰 타입:', tokenType);
        }
      } else {
        console.error('Authorization 헤더가 없습니다.');
      }
      throw error;
    }
  }

  // PIN 입력 관련 focusInput 등 유틸 함수도 이 클래스에 포함
  async fetchPinNumber(code: string) {
    const {language} = store.getState();
    const failed2fa = i18n[language].failed2fa;
    const error2fa = i18n[language].error2fa;

    try {
      const response = await fetch('/api/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${store.getState().tmpToken}`,
        },
        body: JSON.stringify({ code }),
      });
      const data = await response.json(); // 반드시 한 번만!
      if (!response.ok) {
        alert(data.message || `${failed2fa}`);
        return;
      }
      store.setState({ user: data.user });
      store.setState({ accessToken: data.user.accessToken });
      window.location.replace('#/');
      // 성공 처리
    } catch (error) {
      alert(`${error2fa}`);
    }
  }

  async request2faReset() {
    const {language} = store.getState();
    const failedReset2fa = i18n[language].failedReset2fa;
    const sendLoginLink = i18n[language].sendLoginLink;

    try {
      const url = `/api/2fa/reset/request`;
      const tmpToken = store.getState().tmpToken;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tmpToken}`,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.error_code}: ${errorData.message}`);
      }
      // 요청 성공 시 버튼 비활성화
      this.setState({
        error: `${sendLoginLink}`,
        isResetRequested: true,
      });
    } catch (error) {
      console.error(`${failedReset2fa}:`, error);
    }
  }
}
