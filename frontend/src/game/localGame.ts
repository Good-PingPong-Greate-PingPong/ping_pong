import { Ball } from "./GameObject";
import { GameWindow } from "./GameWindow";
import { GameStatus } from "./GameStatus";

export function startLocalGame(canvas: HTMLCanvasElement) {
  const gameStatus = new GameStatus();
  const gameWindow = new GameWindow(canvas);

  gameWindow.drawCanvas();

  // 키보드 입력 처리
  document.addEventListener('keydown', (e) => {
    if (e.key === "w") gameStatus.WKeyState = true;
    if (e.key === "s") gameStatus.SKeyState = true;
    if (e.key === "ArrowUp") gameStatus.OKeyState = true;
    if (e.key === "ArrowDown") gameStatus.LKeyState = true;
    if (e.key === "Enter") {
      if (!gameStatus.RequestFrame) {
        const ball = new Ball(gameWindow.DocWidth / 2, gameWindow.DocHeight / 2, 30);
        ball.drawObject(gameWindow.ctx);
        gameStatus.RequestFrame = true;
        MoveBallLoop(ball);
      }
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === "w") gameStatus.WKeyState = false;
    if (e.key === "s") gameStatus.SKeyState = false;
    if (e.key === "ArrowUp") gameStatus.OKeyState = false;
    if (e.key === "ArrowDown") gameStatus.LKeyState = false;
  });

  window.addEventListener('resize', () => {
    gameWindow.DocHeight = window.innerHeight;
    gameWindow.DocWidth = window.innerWidth;
    gameWindow.canvas.height = gameWindow.DocHeight;
    gameWindow.canvas.width = gameWindow.DocWidth;
    gameWindow.drawCanvas();
  });

  canvas.onclick = () => {
    if (!gameStatus.RequestFrame) {
      const ball = new Ball(gameWindow.DocWidth / 2, gameWindow.DocHeight / 2, 30);
      ball.drawObject(gameWindow.ctx);
      gameStatus.RequestFrame = true;
      MoveBallLoop(ball);
    }
  };

  function MoveBallLoop(ball: Ball) {
    if (gameStatus.WKeyState && gameWindow.Pad1YPos > 0)
      gameWindow.Pad1YPos -= 10;
    if (gameStatus.SKeyState && gameWindow.Pad1YPos < window.innerHeight - 100)
      gameWindow.Pad1YPos += 10;
    if (gameStatus.OKeyState && gameWindow.Pad2YPos > 0)
      gameWindow.Pad2YPos -= 10;
    if (gameStatus.LKeyState && gameWindow.Pad2YPos < window.innerHeight - 100)
      gameWindow.Pad2YPos += 10;

    gameWindow.moveBall(ball, gameStatus);

    if (gameStatus.RequestFrame)
      requestAnimationFrame(() => MoveBallLoop(ball));
  }
}