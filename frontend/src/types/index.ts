export interface IUser {
  id: Number;
  nickname: string;
  email: string;
  profileImage: string;
}

export interface IAppState {
  user: IUser | null;
  accessToken: string | null;
  tmpToken: string | null; // 임시 토큰, 예를 들어 구글 OAuth 인증 후 사용
  language: Language;
  socket: WebSocket | null;
    // isLoading: boolean;
    // error: string | null;
  }
  
  export interface IRoute {
	path: string;
	component: () => string;
  }

export interface IFriend {
  id: number;
  nickname: string;
  profile_image: string;
  is_friend: boolean;
  is_login: boolean;
}

export enum Language {
  KR,
  EN,
  FN,
}
