export interface IUser {
  id: Number;
  nickname: string;
  email: string;
  profileImage: string;
}

export interface IAppState {
  user: IUser | null;
  accessToken: string | null;
  language: Language;
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
