import { Ball, Pad } from "./GameObject";
import { GameStatus } from "./GameStatus";

export class GameWindow {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public Pad2YPos: number;
  public Pad1YPos: number;
  public DocHeight: number;
  public DocWidth: number;
  public dirX: boolean;
  public dirY: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.DocHeight = window.innerHeight;
    this.DocWidth = window.innerWidth;
    this.Pad2YPos = this.DocHeight / 2 - 50;
    this.Pad1YPos = this.DocHeight / 2 - 50;
    this.dirX = this.generateRandomDir();
    this.dirY = this.generateRandomDir();

    this.canvas = canvas;
    const ctsRes = this.canvas.getContext("2d");
    if (!ctsRes || !(ctsRes instanceof CanvasRenderingContext2D)) {
      throw new Error('Failed to get 2D context');
      // error handling 상의해보기
    }
    this.ctx = ctsRes;
    this.canvas.height = this.DocHeight;
    this.canvas.width = this.DocWidth;
    this.canvas.style.background = "white";
  }

  public generateRandomDir(): boolean {
    return Boolean(Math.floor(Math.random() * 2));
  }

  public drawCanvas(): void;
  public drawCanvas(ball: Ball): void;

  public drawCanvas(ball?: Ball): void {
    this.ctx.clearRect(0, 0, this.DocWidth + 100, this.DocHeight);
    this.drawPads();
    if (ball == undefined) {
        let ball: Ball = new Ball(this.DocWidth / 2, this.DocHeight / 2, 30);
        ball.drawObject(this.ctx);
    }
    else ball.drawObject(this.ctx);
  }

  public drawPads() {
    let Pad1: Pad = new Pad(50, this.Pad1YPos, 25, 100);
    let Pad2: Pad = new Pad(this.DocWidth - 50, this.Pad2YPos, 25, 100);
  
    Pad1.drawObject(this.ctx);
    Pad2.drawObject(this.ctx);
  }

  public moveBall(ball: Ball, gameStatus: GameStatus): void {
    if (this.dirY) ball.y += ball.speed;
    if (this.dirX) ball.x += ball.speed;
    if (!this.dirY) ball.y -= ball.speed;
    if (!this.dirX) ball.x -= ball.speed;
  
    if (ball.y > this.DocHeight) this.dirY = false;
    if (ball.x > this.DocWidth) {
      this.dirX = this.generateRandomDir();
      this.dirY = this.generateRandomDir();
      ball.y = this.DocHeight / 2;
      ball.x = this.DocWidth / 2;

      gameStatus.Score1++;
      gameStatus.RequestFrame = false;
      this.drawCanvas(ball);
    }
  
    if (ball.y < 0) this.dirY = true;
    if (ball.x < 0) {
      this.dirX = this.generateRandomDir();
    	this.dirY = this.generateRandomDir();
      ball.y = this.DocHeight / 2;
      ball.x = this.DocWidth / 2;

      gameStatus.Score2++;
      gameStatus.RequestFrame = false;
      this.drawCanvas(ball);
    }

    const player1 = document.querySelector("#Player1") as HTMLElement;
    const player2 = document.querySelector("#Player2") as HTMLElement;
    player1.innerHTML = gameStatus.Score1.toString();
    player2.innerHTML = gameStatus.Score2.toString();

		this.drawCanvas(ball);
		this.checkCollision(ball, gameStatus);
  }

  // 게임 종료 시 우승자 닉네임 결정
  private gameOver(winnerName: string) {
    const onLocalGameOver = (window as any).onLocalGameOver;
    if (typeof onLocalGameOver === 'function') {
      onLocalGameOver(winnerName);
    }
  }

  private checkCollision(ball: Ball, gameStatus: GameStatus): void {
    let LoclPad1XPos = 50 + 25;
    let distance1 = Math.abs(ball.x - LoclPad1XPos);
  
		// 플레이어 1 충돌 감지
    if (distance1 < 30 && ball.y < (this.Pad1YPos + 130) && ball.y > (this.Pad1YPos - 30))
			this.dirX = true;

    let LoclPad2XPos = this.DocWidth - 50;
    let distance2 = Math.abs(ball.x - LoclPad2XPos);

		// 플레이어 2 충돌 감지
    if (distance2 < 30 && ball.y < (this.Pad2YPos + 130) && ball.y > (this.Pad2YPos - 30))
			this.dirX = false;

		// 게임 종료 판정
    if (gameStatus.Score1 > 2){
      gameStatus.RequestFrame = false;
      this.canvas.onclick=()=>{};
      const winnerNickname = document.querySelector("#Player1Nick") as HTMLElement;
      console.log(winnerNickname.innerText);
      this.gameOver(winnerNickname.innerText);
    }

    if (gameStatus.Score2 > 2){
      gameStatus.RequestFrame = false;
      this.canvas.onclick=()=>{};
      const winnerNickname = document.querySelector("#Player2Nick") as HTMLElement;
      console.log(winnerNickname.innerText);
      this.gameOver(winnerNickname.innerText);
    }
  }
}