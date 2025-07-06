import { Component } from '../core/Component';
import settingIcon from '../assets/setting.svg';
import saveIcon from '../assets/save.svg';
// import mockImg from '../assets/mock.jpg';
import uploadIcon from '../assets/upload.svg';
import { store } from '../core/store';

export class Profile extends Component {
  setup() {
    this.setState({
      isEditMode: false,
    });
    this.getProfileData();
  }

  setEvent(): void {
    this.addEvent('submit', '.profile-form', (event) => {
      event.preventDefault();
      console.log('폼 제출');
      this.handleSubmit();
    });

    this.addEvent('click', '.editBtn', (event) => {
      event.preventDefault();
      console.log('버튼 클릭');
      const mode = this.$state.isEditMode;

      if (mode) {
        // 수정 모드에서는 폼 제출
        const form = this.$target.querySelector('.profile-form') as HTMLFormElement;
        if (form) {
          form.requestSubmit();
        }
      } else {
        // 편집 모드로 전환
        this.setState({ isEditMode: !mode });
      }
    });
    this.addEvent('change', '.profile-image-input', (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.setState({ profileImage: reader.result });
        };
        reader.readAsDataURL(file);
      }
    });
  }

  handleSubmit() {
    const formData = new FormData(this.$target.querySelector('.profile-form') as HTMLFormElement);

    const updatedData = {
      nickname: formData.get('nickname') as string,
      isTwoFactor: formData.get('twoFactor') === 'true',
      profileImage: this.$state.profileImage, // 파일은 별도 처리
    };

    console.log('제출할 데이터:', updatedData);

    // 여기서 API 호출
    this.updateProfileData(updatedData);

    // 편집 모드 종료
    this.setState({ isEditMode: false });
  }

  template() {
    const { user } = this.$props;

    if (!user) {
      return `<div>로그인 정보가 없습니다.</div>`;
    }

    const { nickname, profileImage, isTwoFactor, isEditMode } = this.$state;

    return `
    <div class="w-full max-w-4xl mx-auto h-full flex flex-col bg-backgroundColor">
        <!-- 헤더 영역 -->
        <div class="flex justify-end p-4">
            <!-- 설정/저장 버튼 -->
            <button 
              type="${isEditMode ? 'submit' : 'button'}"
              form="${isEditMode ? 'profile-form' : ''}"
              class="editBtn cursor-pointer border-none bg-transparent"
            >
              <img 
                src="${isEditMode ? saveIcon : settingIcon}" 
                alt="${isEditMode ? '저장' : '설정'} 아이콘"
              />
            </button>
        </div>

        <!-- 메인 컨텐츠 -->
        <div class="flex-1 flex flex-col items-center justify-center px-16">
            <!-- 프로필 폼 -->
            <form id="profile-form" class="profile-form flex items-start gap-16 w-full max-w-2xl">
                <!-- 프로필 이미지 -->
                <div class="flex-shrink-0 relative">
                  <img src="${profileImage}" alt="프로필 이미지" class="w-48 h-48 rounded-full object-cover"/>
                  ${
                    isEditMode
                      ? `
                        <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer hover:bg-opacity-60 transition-all">
                          <div class="text-white text-center">
                            <img src="${uploadIcon}"/>
                          </div>
                          <input 
                            type="file" 
                            accept="image/*" 
                            name="profileImage"
                            class="profile-image-input absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                          />
                        </div>
                      `
                      : ''
                  }
                </div>
                
                <!-- 폼 필드 영역 -->
                <div class="flex-1 space-y-8">
                    <!-- 닉네임 섹션 -->
                    <div class="space-y-3">
                        <label for="nickname" class="block text-xl font-bold text-gray-800">닉네임</label>
                        <div class="relative">
                            <input 
                                id="nickname"
                                name="nickname"
                                type="text" 
                                value="${nickname || ''}" 
                                class="w-full px-4 py-3 text-lg bg-white border-3 border-black rounded-lg focus:outline-none focus:border-blue-500"
                                ${isEditMode ? '' : 'readonly'}
                            />
                        </div>
                    </div>

                    <!-- 2차 인증 섹션 -->
                    <div class="space-y-3">
                        <label class="block text-xl font-bold text-gray-800">2차 인증</label>
                        <div class="flex items-center gap-3">
                          ${
                            isEditMode
                              ? `
                                <label class="...">
                                  <input type="radio" name="twoFactor" value="false" class="peer hidden" ${!isTwoFactor ? 'checked' : ''} />
                                  <span class="peer-checked:bg-mainColor peer-checked:text-white bg-gray-200 text-gray-400 px-6 py-3 rounded-lg">비활성</span>
                                </label>
                                <label class="...">
                                  <input type="radio" name="twoFactor" value="true" class="peer hidden" ${isTwoFactor ? 'checked' : ''} />
                                  <span class="peer-checked:bg-mainColor peer-checked:text-white bg-gray-200 text-gray-400 px-6 py-3 rounded-lg">활성</span>
                                </label>
                            `
                              : `
                                <label class="...">
                                  <span class="bg-mainColor text-white px-6 py-3 rounded-lg">${isTwoFactor ? '활성' : '비활성'}</span>
                                </label>
                            `
                          }
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
        `;
  }

  mounted() {}

  async updateProfileData(data: any) {
    try {
      // const user = this.$props.user; // 또는 store에서 가져오기
      // const url = `/api/info?user_id=${user?.id}`;

      // const requestBody = {
      //   nickname: data.nickname,
      //   two_factor_enabled: data.isTwoFactor,
      //   profile_image: data.profileImage
      // };

      // const response = await fetch(url, {
      //   method: 'PUT',
      //   credentials: 'include',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(requestBody),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(`${errorData.error_code}: ${errorData.message}`);
      // }

      // // const result = await response.json();
      // // console.log('프로필 업데이트 성공:', result.message);

      // // 상태 업데이트
      // this.setState({
      //   nickname: data.nickname,
      //   profileImage: data.profileImage,
      //   isTwoFactor: data.isTwoFactor,
      // });

      // 목 데이터로 테스트
      console.log('프로필 업데이트:', data);

      // 성공 응답 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 500));

      this.setState({
        nickname: data.nickname,
        profileImage: data.profileImage,
        isTwoFactor: data.isTwoFactor,
      });
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      throw error;
    }
  }
  async getProfileData() {
    try {
      const { user } = this.$props;
      const accessToken = store.getState().accessToken;
      const url = `/api/users/info?userId=${user?.id}`;
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
      // 목 데이터로 테스트
      // const data = {
      //   nickname: 'testUser123',
      //   profileImage: mockImg,
      //   isTwoFactor: true,
      // };

      this.setState({
        nickname: data.nickname,
        profileImage: data.profileImage,
        isTwoFactor: data.isTwoFactor,
      });
    } catch (error) {
      console.log(error, ' 기본정보 불러오기 실패');
      throw error;
    }
  }
}
