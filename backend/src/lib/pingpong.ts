import { tournamentManager } from './global.util';

const pingpongUtil = () => {
  const sendSessionInfo = (
    tournamentId: number,
    nickname1: string,
    nickname2: string,
  ) => {
    const msg = {
      type: 'game',
      subtype: 'session_info',
      message: '',
      data: {
        round: 'semi',
        nickname1,
        nickname2,
      },
    };
    tournamentManager.boradcasting(tournamentId, JSON.stringify(msg));
  };

  const sendMatchInitSetting = (
    tournamentId: number,
    nickname1: string,
    nickname2: string,
  ) => {
    const msg = {
      type: 'game',
      subtype: 'match_init_setting',
      message: '',
      data: {
        nickname1,
        nickname2,
        ballSpeed: 5,
        matchPoint: 5,
      },
    };
    tournamentManager.boradcasting(tournamentId, JSON.stringify(msg));
  };

  return {
    sendSessionInfo,
    sendMatchInitSetting,
  };
};

export default pingpongUtil();
