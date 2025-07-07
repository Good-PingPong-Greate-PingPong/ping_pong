import { Component } from '../core/Component';
import settingIcon from '../assets/setting.svg';
import saveIcon from '../assets/save.svg';
import mockImg from '../assets/mock.jpg';
import uploadIcon from '../assets/upload.svg';
import { store } from '../core/store';
import { TwoFactorModal } from './TwoFactorModal';
import { i18n } from '../types/i18n';

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
    const { language } = store.getState();
    const imageType = i18n[language].imageType;
    const imageSize = i18n[language].imageSize;

    this.addEvent('submit', '.profile-form', (event) => {
      event.preventDefault();
      this.handleSubmit();
    });

    this.addEvent('click', '.editBtn', (event) => {
      event.preventDefault();
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
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (!allowedTypes.includes(file.type)) {
          alert(imageType);
          (event.target as HTMLInputElement).value = '';
          return;
        }
        if (file.size > maxSize) {
          alert(imageSize);
          (event.target as HTMLInputElement).value = '';
          return;
        }
        this.setState({
          profileImage: URL.createObjectURL(file),
          profileImageFile: file,
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
    this.addEvent('change', 'input[name="twoFactorEnabled"]', (event) => {
      const value = (event.target as HTMLInputElement).value === 'true';
      this.setState({ twoFactorEnabled: value });
    });
  }

  handleSubmit() {
    const form = this.$target.querySelector('.profile-form') as HTMLFormElement;
    const formData = new FormData(form);
    const { language } = store.getState();
    const { nicknameInput, nicknameType, nicknameSpace } = i18n[language];

    // 닉네임 유효성 검사
    const nickname = formData.get('nickname')?.toString().trim() || '';
    const nicknameRegex = /^[가-힣a-zA-Z0-9]{1,16}$/;

    if (!nickname) {
      alert(nicknameInput);
      return;
    }
    if (!nicknameRegex.test(nickname)) {
      alert(nicknameType);
      return;
    }

    // 모두 공백으로만 이루어진 경우도 막기
    if (nickname.replace(/[\s]/g, '').length === 0) {
      alert(nicknameSpace);
      return;
    }

    // 파일 객체가 상태에 있으면 FormData에 추가
    if (this.$state.profileImageFile) {
      formData.set('profileImage', this.$state.profileImageFile);
    } else {
      formData.delete('profileImage');
    }

    this.updateProfileData(formData);
    this.setState({ isEditMode: false, profileImageFile: undefined });
  }

  template() {
    const { nickname, profileImage, twoFactorEnabled, isEditMode } = this.$state;
    const { language } = store.getState();
    const {
      save,
      modified,
      profileImageText,
      nicknameText,
      twoFactorText,
      enable,
      disable,
      generateQR,
    } = i18n[language];

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
                alt="${isEditMode ? `${save} 아이콘` : `${modified} 아이콘`}"
              />
            </button>
        </div>

        <!-- 메인 컨텐츠 -->
        <div class="flex-1 flex flex-col items-center justify-center px-16">
            <!-- 프로필 폼 -->
            <form id="profile-form" class="profile-form flex items-start gap-16 w-full max-w-2xl">
                <!-- 프로필 이미지 -->
                <div class="flex-shrink-0 relative">
                  <img src="${profileImage}" alt="${profileImageText}" class="w-48 h-48 rounded-full object-cover"/>
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
                        <label for="nickname" class="block text-xl font-bold text-gray-800">${nicknameText}</label>
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
                        <label class="block text-xl font-bold text-gray-800">${twoFactorText}</label>
                        <div class="flex items-center gap-3">
                          ${
                            isEditMode
                              ? `
                                <label class="...">
                                  <input type="radio" name="twoFactorEnabled" value="false" class="peer hidden" ${!twoFactorEnabled ? 'checked' : ''} />
                                  <span class="peer-checked:bg-mainColor peer-checked:text-white bg-gray-200 text-gray-400 px-6 py-3 rounded-lg">${disable}</span>
                                </label>
                                <label class="...">
                                  <input type="radio" name="twoFactorEnabled" value="true" class="peer hidden" ${twoFactorEnabled ? 'checked' : ''} />
                                  <span class="peer-checked:bg-mainColor peer-checked:text-white bg-gray-200 text-gray-400 px-6 py-3 rounded-lg">${enable}</span>
                                </label>
                                <button id="twoFactorEnableBtn" class="bg-white px-6 py-3 border-1 border-mainColor rounded-lg" > ${generateQR} </button>
                            `
                              : `
                                <label class="...">
                                  <span class="bg-mainColor text-white px-6 py-3 rounded-lg">${twoFactorEnabled === false ? disable : enable}</span>
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
      const { language } = store.getState();
      const { changes } = i18n[language];

      // 변경사항 비교
      const prevNickname = this.$state.nickname;
      const prevTwoFactor = this.$state.twoFactorEnabled;
      const newNickname = formData.get('nickname')?.toString().trim() || '';
      const newTwoFactor = formData.get('twoFactorEnabled');
      const fileChanged = !!this.$state.profileImageFile;

      // 변경사항이 없으면 요청하지 않음
      if (newNickname === prevNickname && prevTwoFactor === newTwoFactor && !fileChanged) {
        alert(changes);
        return;
      }

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

      window.location.replace('#/');
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

      const nickname = data.user.nickname;
      let profileImage = 'https://localhost:443' + data.user.profileImage;

      if (!profileImage) {
        profileImage = mockImg;
      }
      const twoFactorEnabled =
        data.user.twoFactorEnabled === true || data.user.twoFactorEnabled === 'true';
      console.log(nickname, profileImage, twoFactorEnabled);
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
