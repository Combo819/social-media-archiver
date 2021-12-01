import { IUser } from '../../User/Types';

interface IAccountService {
  mode: 'cookie' | 'non-cookie';
  init: () => Promise<void>;
  getMode: () => 'cookie' | 'non-cookie';
  getCookie: () => string;
  getUserProfile(): IUser | null;
  setCookie(cookie: string): Promise<boolean>;
  validateCookie(cookie: string): Promise<boolean>;
}

export { IAccountService };
