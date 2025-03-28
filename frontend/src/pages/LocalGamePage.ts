export function renderLocalGamePage(): string {
  setTimeout(() => {
    const script = document.createElement("script");
    script.src = "/src/game/localGame.ts";
    script.type = "module";
    document.body.appendChild(script);
  }, 0);

  // PlayerNic은 추후 유저 닉네임 삽입 로직으로 변경할 예정
	return `
    <div id="localGameDiv" class="flex flex-row justify-around items-center w-full">
      <div id="ScoreDiv">
        <p id="Player1Nick">USER 1</p>
        <p id="Player1">0</p> : <p id="Player2">0</p>
        <p id="Player2Nick">USER 2</p>
      </div>
      <canvas></canvas>
      <div id="WinMsg">
        <p>USER <span id="WinPlayerId"></span> WIN!!</p>
        <div class="bg-blue-100 flex flex-row justify-around items-center min-w-80 min-h-40">gif 삽입 위치</div>
        <div class="bg-blue-100 fixed bottom-0 max-w-3xl w-full h-[84px] right-10 flex justify-center">뒤로가기 아이콘 삽입 위치</div>
      </div>
    </div>
	`;
}