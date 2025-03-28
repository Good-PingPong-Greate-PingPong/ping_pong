abstract class GameObject {
  public color: string;
  public x: number;
  public y: number;
  public radius: number;
  
  constructor(x: number, y: number, radius: number) {
    this.color = "black";
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  public abstract drawObject(ctx: CanvasRenderingContext2D): void;
}

export class Ball extends GameObject {
  public speed: number;

  constructor(x: number, y: number, radius: number) {
    super(x, y, radius);
    this.speed = 10;
  }

  public drawObject(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

export class Pad extends GameObject {
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