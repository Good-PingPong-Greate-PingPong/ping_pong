export interface TreeMessage {
  type: string;
  subtype: string;
  message: string;
  data: {
    winner: [string, string];
    bracket: [string, string][];
  };
}