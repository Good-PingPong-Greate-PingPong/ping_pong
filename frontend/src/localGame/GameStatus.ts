export class GameStatus {
    public WKeyState: boolean;
    public SKeyState: boolean;
    public OKeyState: boolean;
    public LKeyState: boolean;
    public Score1: number;
    public Score2: number;
    public RequestFrame: boolean;
    public ballAnimation: number;

    constructor() {
        this.WKeyState = false;
        this.SKeyState = false;
        this.OKeyState = false;
        this.LKeyState = false;
        this.Score1 = 0;
        this.Score2 = 0;
        this.RequestFrame = false;
        this.ballAnimation = 0;
    }
}