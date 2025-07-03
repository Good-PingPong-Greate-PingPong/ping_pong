import { Component } from '../core/Component';


export class Record extends Component {
  setup() {
    const isTournament = this.$state.isTournament;
    const {
      user1Nickname,
      user2Nickname,
      user1Score,
      user2Score,
      user1Image,
      user2Image,
      createdAt,
    } = this.$props.record;

    this.setState({
      user1Nickname,
      user2Nickname,
      user1Score,
      user2Score,
      user1Image: isTournament ? undefined : user1Image,
      user2Image: isTournament ? undefined : user2Image,
      createdAt,
      isTournament,
    });
  }
  template(): string {
    const {       
      user1Nickname,
      user2Nickname,
      user1Score,
      user2Score,
      user1Image,
      user2Image,
      createdAt,
      isTournament,
    } = this.$state;


    // 날짜 포맷팅 함수
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}/${month}/${day} ${hours}:${minutes}`;
    };

    // 승자 판별
    const isUser1Winner = user1Score > user2Score;
    const isUser2Winner = user2Score > user1Score;

    return `
        <div class="w-[500px] max-w-2xl mx-auto mb-4">
            <!-- 날짜 표시 -->
            <div class="text-gray-600 text-lg font-medium mb-2 px-2">
                ${formatDate(createdAt)}
            </div>
            
            <!-- 게임 결과 카드 -->
            <div class="w-full h-20 bg-white rounded-lg shadow-sm flex overflow-hidden">
              <div class="flex-1 ${isUser1Winner ? 'bg-mainColor' : 'bg-gray-300'} flex items-center justify-between px-6 text-white">
              ${isTournament
                ? `<div class="w-12 h-12 rounded-full flex justify-center items-center overflow-hidden">
                      <img src="${user1Image}" class="w-full h-full object-cover" />
                  </div>`
                : ''
              }
                <div class="flex flex-col items-center justify-center text-2xl">
                  ${isUser1Winner ? '👑' : '💀'}
                  <div class="text-xl font-bold">${user1Nickname}</div>
                </div>
                <div class="text-5xl font-bold">${user1Score}</div>
              </div>

              <div class="flex-1 ${isUser2Winner ? 'bg-mainColor' : 'bg-gray-300'} flex items-center justify-between px-6 text-white">
                  <div class="text-5xl font-bold">${user2Score}</div>
                  <div class="flex flex-col items-center justify-center  text-2xl">
                    ${isUser2Winner ? '👑' : '💀'}
                    <div class="text-xl font-bold">${user2Nickname}</div>
                  </div>
                  ${isTournament
                    ? `<div class="w-12 h-12 rounded-full flex justify-center items-center overflow-hidden">
                          <img src="${user2Image}" class="w-full h-full object-cover" />
                      </div>`
                    : ''
                  }
                </div>
            </div>
        </div>
    `;
  }
}
