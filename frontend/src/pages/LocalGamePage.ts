import { Component } from "../core/Component";
import { localGameResult } from "../components/localGameResult";

// export function renderLocalGamePage(): string {
//   setTimeout(() => {
//     const script = document.createElement("script");
//     script.src = "/src/game/localGame.ts";
//     script.type = "module";
//     document.body.appendChild(script);
//   }, 0);

//   // PlayerNic은 추후 유저 닉네임 삽입 로직으로 변경할 예정
// 	return `
//     <div id="localGameDiv" class="flex flex-row justify-around items-center w-full">
//       <div id="ScoreDiv">
//         <p id="Player1Nick">USER 1</p>
//         <p id="Player1">0</p> : <p id="Player2">0</p>
//         <p id="Player2Nick">USER 2</p>
//       </div>
//       <canvas></canvas>
//       <div id="WinMsg">
//         <p>USER <span id="WinPlayerId"></span> WIN!!</p>
//         <div class="bg-blue-100 flex flex-row justify-around items-center min-w-80 min-h-40">gif 삽입 위치</div>
//         <div class="bg-blue-100 fixed bottom-0 max-w-3xl w-full h-[84px] right-10 flex justify-center">뒤로가기 아이콘 삽입 위치</div>
//       </div>
//     </div>
// 	`;
// }


export class LocalGamePage extends Component {
  template () { return `
    <div id="localGameDiv">
      <div id="ScoreDiv">
        <p id="Player1Nick">USER 1</p>
        <p id="Player1">0</p> : <p id="Player2">0</p>
        <p id="Player2Nick">USER 2</p>
      </div>
      <canvas></canvas>
      <div data-component="localGameResult"></div>
    </div>
  `; 
  }
  //<div data-component="localGameResult" class="hidden flex items-center justify-center"></div>

  mounted() {
    const $resultTarget = this.$target.querySelector('[data-component="localGameResult"]') as HTMLElement;
    const resultComponent = new localGameResult($resultTarget, { winnerName: null });

    // 컴포넌트가 렌더링된 후 작업 수행
    const script = document.createElement("script");
    script.src = "/src/game/localGame.ts";
    script.type = "module";
    document.body.appendChild(script);

    // 게임 종료 시 승자 닉네임을 받는 콜백
    const handleGameOver = (winnerName: string) => {
      resultComponent.setState({ winnerName });
    };

    // 전역으로 콜백을 전달 (자체 모듈 방식 아님 가정)
    (window as any).onLocalGameOver = handleGameOver;
  }
}