import { TournamentMessage } from '../webSocket/TournamentMessage';
import { TournamentSocket } from '../webSocket/TournamentSocket';
import { TournamentGameWindow } from './TournamentGameWindow';
import { TournamentBall, TournamentPad } from './TournamentGameObject';

export function tournamentInit(
  canvas: HTMLCanvasElement,
  socket: TournamentSocket,
  gameWindow: TournamentGameWindow,
  matchId: number,
) {
  const msg: TournamentMessage = socket.msg;
  if (msg.subtype !== 'match_init_setting') return;

  gameWindow.stopRenderLoop();

  const ball = new TournamentBall(msg.data.ball.x, msg.data.ball.y, msg.data.ball.radius);
  const pad1 = new TournamentPad(
    msg.data.paddle1.x,
    msg.data.paddle1.y,
    msg.data.paddle1.radius,
    msg.data.paddle1.height,
  );
  const pad2 = new TournamentPad(
    msg.data.paddle2.x,
    msg.data.paddle2.y,
    msg.data.paddle2.radius,
    msg.data.paddle2.height,
  );
  gameWindow = new TournamentGameWindow(canvas, ball, pad1, pad2, matchId);
  gameWindow.drawTargetFrame(
    msg.data.paddle1.x,
    msg.data.paddle1.y,
    msg.data.paddle2.x,
    msg.data.paddle2.y,
    msg.data.ball.x,
    msg.data.ball.y,
  );
}

export function gameEvent(
  canvas: HTMLCanvasElement,
  socket: TournamentSocket,
  gameWindow: TournamentGameWindow,
) {
  document.addEventListener('keydown', (e) => {
    if (gameWindow.RequestFrame && (e.key === 'ArrowUp' || e.key === 'ArrowDown'))
      socket.sendKeyMessage(false, e.key, gameWindow.matchId);
  });

  document.addEventListener('keyup', (e) => {
    if (gameWindow.RequestFrame && (e.key === 'ArrowUp' || e.key === 'ArrowDown'))
      socket.sendKeyMessage(true, e.key, gameWindow.matchId);
  });

  canvas.onclick = () => {
    if (!gameWindow.RequestFrame) {
      gameWindow.RequestFrame = true;
      socket.sendStartMessage(gameWindow.matchId);
      gameWindow.startRenderLoop();
    }
  };
}

export function renderObject(socket: TournamentSocket, gameWindow: TournamentGameWindow) {
  const msg: TournamentMessage = socket.msg;
  if (msg.subtype !== 'match_run') return;

  gameWindow.drawTargetFrame(
    msg.data.paddle1.x,
    msg.data.paddle1.y,
    msg.data.paddle2.x,
    msg.data.paddle2.y,
    msg.data.ball.x,
    msg.data.ball.y,
  );
  const player1 = document.querySelector('#Player1') as HTMLElement;
  const player2 = document.querySelector('#Player2') as HTMLElement;
  player1.innerHTML = msg.data.score.player1.toString();
  player2.innerHTML = msg.data.score.player2.toString();
}
