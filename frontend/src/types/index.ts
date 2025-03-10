export interface User {
	id: string;
	username: string;
	email: string;
  }
  
  export interface AppState {
	user: User | null;
	isLoading: boolean;
	error: string | null;
	theme: 'light' | 'dark';
  }
  
  export interface Route {
	path: string;
	component: () => string;
  }