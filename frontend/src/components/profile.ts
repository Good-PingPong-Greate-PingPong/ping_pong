import { Component } from '../core/Component';
import settingIcon from '../assets/setting.svg';
import saveIcon from '../assets/save.svg';
// import mockImg from '../assets/mock.jpg';
import uploadIcon from '../assets/upload.svg';
import { store } from '../core/store';
import { TwoFactorModal } from './TwoFactorModal';

export class Profile extends Component {
  setup() {
    this.setState({
      isQrView: false,
      isEditMode: false,
      profileImageFile: undefined,
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
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
          alert('지원하지 않는 이미지 파일입니다. (jpg, jpeg, png 만 가능합니다.)');
          // 파일 input 비우기
          (event.target as HTMLInputElement).value = '';
          return;
        }
        // 1. 파일 객체도 상태에 저장
        this.setState({
          profileImage: URL.createObjectURL(file),
          profileImageFile: file, // ← 파일 객체 저장
        });
      }
    });
    this.addEvent('click', '#twoFactorEnableBtn', () => {
      // 모달 띄우기
      const $modal = document.querySelector('[data-component="modal"]') as HTMLElement;
      new TwoFactorModal($modal, {
        view: 'qr',
        handleModal: () => {
          this.setState({ isQrView: false });
        },
      });
      this.setState({ isQrView: true });
      setTimeout(() => {
        const $modal = document.querySelector('[data-component="modal"]') as HTMLElement;
        if ($modal) {
          new TwoFactorModal($modal, {
            view: 'qr',
            handleModal: () => {
              this.setState({ isQrView: false });
            },
          });
        }
      }, 0);
    });
  }

  handleSubmit() {
    const form = this.$target.querySelector('.profile-form') as HTMLFormElement;
    const formData = new FormData(form);

    // 파일 객체가 상태에 있으면 FormData에 추가
    if (this.$state.profileImageFile) {
      formData.set('profileImage', this.$state.profileImageFile);
    } else {
      // 파일을 새로 선택하지 않았다면 FormData에서 profileImage 필드를 제거
      formData.delete('profileImage');
    }

    this.updateProfileData(formData);
    this.setState({ isEditMode: false, profileImageFile: undefined }); // 파일 객체 초기화
  }

  template() {
    const { nickname, profileImage, twoFactorEnabled, isEditMode } = this.$state;
    // console.log('template : ', nickname, profileImage, twoFactorEnabled, isEditMode);
    // console.log('twoFactorEnabled : ', twoFactorEnabled, typeof twoFactorEnabled);
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
                                  <input type="radio" name="twoFactorEnabled" value="false" class="peer hidden" ${!twoFactorEnabled ? 'checked' : ''} />
                                  <span class="peer-checked:bg-mainColor peer-checked:text-white bg-gray-200 text-gray-400 px-6 py-3 rounded-lg">비활성</span>
                                </label>
                                <label class="...">
                                  <input type="radio" name="" value="true" class="peer hidden" ${twoFactorEnabled ? 'checked' : ''} />
                                  <span class="peer-checked:bg-mainColor peer-checked:text-white bg-gray-200 text-gray-400 px-6 py-3 rounded-lg">활성</span>
                                </label>
                                <button id="twoFactorEnableBtn" class="" > 큐알 </button>
                            `
                              : `
                                <label class="...">
                                  <span class="bg-mainColor text-white px-6 py-3 rounded-lg">${twoFactorEnabled === false ? '비활성' : '활성'}</span>
                                </label>
                            `
                          }
                          </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="">
<div data-component="modal" class=""></div>
        </div>

    </div>
    
        `;
  }

  mounted() {
    if (this.$state.isQrView) {
      const $modal = this.$target.querySelector('[data-component="modal"]') as HTMLElement;
      if ($modal) {
        new TwoFactorModal($modal, {
          view: 'qr',
          handleModal: () => {
            this.setState({ isQrView: false });
          },
        });
      }
    }
  }

  async updateProfileData(formData: FormData) {
    try {
      const user = this.$props.user; // 또는 store에서 가져오기
      const url = `/api/users/info?userId=${user?.id}`;

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${store.getState().accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.error_code}: ${errorData.message}`);
      }

      await this.getProfileData();
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

      // console.log('getProfileData : ', data);
      const nickname = data.user.nickname;
      const profileImage = 'https://localhost:443' + data.user.profileImage; // test
      const twoFactorEnabled =
        data.user.twoFactorEnabled === true || data.user.twoFactorEnabled === 'true';

      this.setState({
        nickname: nickname,
        profileImage: profileImage,
        twoFactorEnabled: twoFactorEnabled,
      });
    } catch (error) {
      console.log(error, ' 기본정보 불러오기 실패');
      throw error;
    }
  }
}
