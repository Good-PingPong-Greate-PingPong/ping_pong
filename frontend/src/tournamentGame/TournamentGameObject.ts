abstract class TournamentGameObject {
  public color: string;
  public x: number;
  public y: number;
  public targetX: number;
  public targetY: number;
  public radius: number;

  constructor(x: number, y: number, radius: number) {
    this.color = 'black';
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.radius = radius;
  }

  public setXY(x: number, y: number) {
    this.targetX = x;
    this.targetY = y;
  }

  public interpolate(speed: number = 0.2) {
    this.x += (this.targetX - this.x) * speed;
    this.y += (this.targetY - this.y) * speed;
  }

  public abstract drawObject(ctx: CanvasRenderingContext2D): void;
}

export class TournamentBall extends TournamentGameObject {
  constructor(x: number, y: number, radius: number) {
    super(x, y, radius);
  }

  public drawObject(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

export class TournamentPad extends TournamentGameObject {
  public height: number;

  constructor(x: number, y: number, radius: number, height: number) {
    super(x, y, radius);
    this.height = height;
  }

  public drawObject(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.radius, this.height);
  }
}
