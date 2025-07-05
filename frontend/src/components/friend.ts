import { Component } from '../core/Component';

export class Friend extends Component {
  setup() {
    const { id, nickname, profileImage } = this.$props.friendData;

    this.setState({
      id: id,
      nickname: nickname,
      profileImage: profileImage,
    });
  }
  template(): string {
    const { nickname, profileImage } = this.$state;
    return `
    <div data-property-1="1" class="w-80 h-16 relative m-2">
        <!-- 메인 컨테이너 - 보라색 테두리 -->
        <div class="w-full h-full  rounded-lg bg-white flex">
            <!-- 프로필 이미지 섹션 -->
            <div class="w-16 h-16 flex justify-center items-center ">
                <div class="w-12 h-12 rounded-full flex justify-center items-center overflow-hidden">
                      <img src="${profileImage}" class=""/>
                </div>
            </div>
            
            <!-- 사용자명 섹션 -->
            <div class="flex-1 flex justify-center items-center ">
                <span class="text-black text-xl font-bold">${nickname}</span>
            </div>
            
            <!-- 분할 아이콘 섹션 -->
            <div class="w-16 h-16 flex justify-center items-center ">
                <div class="flex flex-col items-center gap-1">
                    <div class="w-3 h-3 bg-black rounded-full"></div>
                    <div class="w-4 h-0.5 bg-black"></div>
                    <div class="w-3 h-3 bg-black rounded-full"></div>
                </div>
            </div>
            
            <!-- X 버튼 섹션 -->
            <div class="w-16 h-16 bg-black flex justify-center items-center rounded-tr-lg rounded-br-lg">
                <div class="text-white text-2xl font-bold">×</div>
            </div>
        </div>
    </div>
        `;
  }
}
