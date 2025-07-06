import { tournamentManager } from './global.util';

const pingpongUtil = () => {
  const sendTournamentTree = (
    tournamentId: number,
    winner: string[],
    bracket: [string, string][],
  ) => {
    const msg = {
      type: 'game',
      subtype: 'tournament_tree',
      message: '',
      data: {
        winner,
        bracket,
      },
    };
    tournamentManager.broadcasting(tournamentId, JSON.stringify(msg));
  };

  const sendSessionInfo = (
    matchId: number,
    round: 'semi' | 'final',
    nickname1: string,
    nickname2: string,
  ) => {
    const msg = {
      type: 'game',
      subtype: 'session_info',
      message: '',
      data: {
        round,
        match_id: matchId,
        nickname1,
        nickname2,
      },
    };
    tournamentManager.sendToMatch(matchId, JSON.stringify(msg));
  };

  const sendMatchInitSetting = (
    matchId: number,
    player1: string,
    player2: string,
    player1Score: number,
    player2Score: number,
  ) => {
    const msg = {
      type: 'game',
      subtype: 'match_init_setting',
      message: '',
      data: {
        match_id: matchId,
        ball: { x: 50, y: 50, radius: 1 },
        paddle1: { x: 10, y: 50, radius: 1, height: 20 },
        paddle2: { x: 90, y: 50, radius: 1, height: 20 },
        nickname: {
          player1,
          player2,
        },
        score: {
          player1: player1Score,
          player2: player2Score,
        },
      },
    };

    tournamentManager.sendToMatch(matchId, JSON.stringify(msg));
  };

  const sendMatchRun = (
    matchId: number,
    payload: {
      ball: { x: number; y: number };
      paddle1: { x: number; y: number };
      paddle2: { x: number; y: number };
      score: { player1: number; player2: number };
    },
  ) => {
    const msg = {
      type: 'game',
      subtype: 'match_run',
      message: '',
      data: {
        match_id: matchId,
        ...payload,
      },
    };
    tournamentManager.sendToMatch(matchId, JSON.stringify(msg));
  };

  const sendMatchEnd = (
    matchId: number,
    round: 'semi' | 'final',
    score: { player1: number; player2: number },
    winner: string,
  ) => {
    const msg = {
      type: 'game',
      subtype: 'match_end',
      message: '',
      data: {
        match_id: matchId,
        round,
        score,
        winner,
      },
    };
    tournamentManager.sendToMatch(matchId, JSON.stringify(msg));
  };

  return {
    sendTournamentTree,
    sendSessionInfo,
    sendMatchInitSetting,
    sendMatchRun,
    sendMatchEnd,
  };
};

export default pingpongUtil();
