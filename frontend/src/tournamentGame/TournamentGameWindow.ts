import { sendError } from '../errorHandling/sendError';
import { TournamentBall, TournamentPad } from './TournamentGameObject';

export class TournamentGameWindow {
  public canvas: HTMLCanvasElement;
  public ctx!: CanvasRenderingContext2D;
  public ball!: TournamentBall;
  public pad1!: TournamentPad;
  public pad2!: TournamentPad;
  public DocHeight: number;
  public DocWidth: number;
  public RequestFrame: boolean;
  private animationFrameId: number | null = null;
  public matchId: number;

  constructor(
    canvas: HTMLCanvasElement,
    ball: TournamentBall,
    pad1: TournamentPad,
    pad2: TournamentPad,
    matchId: number,
  ) {
    this.DocHeight = window.innerHeight;
    this.DocWidth = window.innerWidth;
    this.pad1 = pad1;
    this.pad2 = pad2;
    this.ball = ball;
    this.RequestFrame = false;
    this.matchId = matchId;

    this.canvas = canvas;
    try {
      const ctsRes = this.canvas.getContext('2d');
      if (!ctsRes || !(ctsRes instanceof CanvasRenderingContext2D)) throw new Error();
      this.ctx = ctsRes;
      this.canvas.height = this.DocHeight;
      this.canvas.width = this.DocWidth;
      this.canvas.style.background = 'white';
    } catch (error) {
      sendError('Failed to get 2D context');
    }
  }

  public startRenderLoop() {
    const loop = () => {
      this.renderFrame();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    if (!this.animationFrameId) loop();
  }

  public stopRenderLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private renderFrame() {
    this.ctx.clearRect(0, 0, this.DocWidth + 100, this.DocHeight);

    this.pad1.interpolate();
    this.pad2.interpolate();
    this.ball.interpolate();

    this.pad1.drawObject(this.ctx);
    this.pad2.drawObject(this.ctx);
    this.ball.drawObject(this.ctx);
  }

  public drawTargetFrame(
    pad1Xpos: number,
    pad1Ypos: number,
    pad2Xpos: number,
    pad2Ypos: number,
    ballXpos: number,
    ballYpos: number,
  ) {
    this.pad1.setXY(pad1Xpos, pad1Ypos);
    this.pad2.setXY(pad2Xpos, pad2Ypos);
    this.ball.setXY(ballXpos, ballYpos);
  }
}
