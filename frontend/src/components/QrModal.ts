import { Component } from '../core/Component';
import { store } from '../core/store';

export class QrModal extends Component {
  setup() {
    this.getTwoFactor();
  }
  setEvent(): void {
    this.addEvent('click', '#loginButton', () => {
      //구글 로그인 리다이렉트 처리
    });

    this.addEvent('click', '#confirmButton', () => {
      // 확인 버튼 클릭 시 처리
      this.$props.handleModal('twoFactorPin')
      // 예: 모달 닫기, 인증 완료 처리 등
    });

    this.addEvent('click', '#cancelButton', () => {
      // 취소 버튼 클릭 시 처리
      this.$props.handleModal('login')

      // 예: 모달 닫기, 상태 초기화 등
    });
  }
  template() {
    
    const { qrCode } = this.$state;
    if (!qrCode) {
      return '';
    }
    return `
        <div class="w-[500px] h-[462.97px] relative shadow-[0px_0px_15.47743034362793px_0px_rgba(0,0,0,0.25)]">
            <div class="w-[500px] h-96 left-0 top-0 absolute bg-gray rounded-2xl">
                <div class="left-[83px] top-[55px] absolute text-center justify-start text-mainColor text-3xl font-semibold font-['Inter']">Google OTP<br/> 인증 코드를 생성하세요. </div>
                <div class="bg-red-100 w-44 h-44 left-[163px] top-[148px] absolute">
                <img src="${qrCode}" />
                </div>
            </div>
            <div class="w-[500px] left-0 top-[370.10px] absolute inline-flex justify-between items-center">
                <div class="w-64 h-24 bg-stone-300 rounded-bl-2xl"></div>
                <div class="w-64 h-24 bg-mainColor rounded-br-2xl"></div>
            </div>
            <div class="w-16 h-10 left-[340.83px] top-[397.73px] absolute justify-start text-white text-4xl font-extrabold font-['Inter']" id="confirmButton">확인</div>
            <div class="w-16 h-10 left-[90.83px] top-[397.73px] absolute justify-start text-zinc-600 text-4xl font-extrabold font-['Inter']" id="cancelButton">취소</div>
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
      throw error;
    }
  }
}
