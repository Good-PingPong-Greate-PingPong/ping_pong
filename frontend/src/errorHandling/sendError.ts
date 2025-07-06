import { navigate } from '../core/router';

export function sendError(msg: string) {
  navigate('/');
  alert(msg);
}
