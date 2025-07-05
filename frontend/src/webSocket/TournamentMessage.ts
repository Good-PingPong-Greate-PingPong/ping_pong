export interface BaseSocketMessage {
  type: string;
  subtype: string;
  message: string;
}

export interface TournamentTreeMessage extends BaseSocketMessage {
  type: "game";
  subtype: "tournament_tree";
  data: {
    winner: [] | [string, string];
    bracket: [string, string][];
  };
}

interface SessionInfoMessage extends BaseSocketMessage {
  type: "game";
  subtype: "session_info";
  data: {
    round: "semi" | "final";
    nickname1: string;
    nickname2: string;
  };
}

interface MatchRunMessage extends BaseSocketMessage {
  type: "game";
  subtype: "match_run";
  match_id: number;
  data: {
    ball: {
      status: string;
      x: number;
      y: number;
    };
    paddle1: {
      x: number;
      y: number;
    };
    paddle2: {
      x: number;
      y: number;
    };
    score: {
      player1: number;
      player2: number;
    };
  };
}

interface MatchInitSettingMessage extends BaseSocketMessage {
  type: "game";
  subtype: "match_init_setting";
  data: {
    ball: {
      x: number;
      y: number;
      radius: number;
    };
    paddle1: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    paddle2: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    nickname: {
      player1: string;
      player2: string;
    };
  };
}

interface MatchEndMessage extends BaseSocketMessage {
  type: "game";
  subtype: "match_end";
  data: {
    round: "semi" | "final";
    score: {
      player1: number;
      player2: number;
    }
    winner: string;
  };
}

export interface KeyMessage extends BaseSocketMessage {
  type: "game";
  subtype: "key_down";
  message: "key!";
  data: {
    key_set: string;
  }
}

interface ConnectionMessage extends BaseSocketMessage {
  type: "connection";
  subtype: "success" | "failed";
}

export type TournamentMessage = TournamentTreeMessage | SessionInfoMessage | MatchRunMessage | MatchInitSettingMessage | ConnectionMessage| MatchEndMessage;