import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { credentialJsonPath } from '../../../Config';
import { logger } from '../../../Logger';
import { readJson, writeJson } from '../../../Utility/json';
import {
  IUser,
  IUserService,
  UserDocument,
  USER_IOC_SYMBOLS,
} from '../../User/Types';
import { IAccountService } from '../Types';
import { getLoginStatusApi } from './accountApi';

@injectable()
class AccountService implements IAccountService {
  mode: 'cookie' | 'non-cookie' = 'non-cookie';
  private cookie: string = '';
  private user: IUser | null = null;
  private userService: IUserService;
  constructor(
    @inject(USER_IOC_SYMBOLS.IUserService) userService: IUserService,
  ) {
    this.userService = userService;
  }
  async init() {
    const cookie: string = await this.readCookieLocal();
    const isCookieValid: boolean = await this.validateCookie(cookie);
    if (!cookie) {
      this.mode = 'non-cookie';
      this.cookie = '';
      const nonCookieModeLogMessage: string = `Starting in non-cookie mode`;
      logger.info(nonCookieModeLogMessage);
      return;
    }
    this.mode = 'cookie';
    this.cookie = cookie;
    logger.info(`Starting in cookie mode`);
    if (isCookieValid) {
      const userInfo: IUser = await this.getUserByCookie(
        this.cookie,
        this.userService,
      );
      this.user = userInfo;
      logger.info(
        `use account ${this.user.username}, id ${this.user.id} as the crawling account`,
      );
    }
  }

  private async readCookieLocal(): Promise<string> {
    try {
      const json: any = await readJson(credentialJsonPath);
      return json.cookie as string;
    } catch (error) {
      return '';
    }
  }

  async validateCookie(cookie: string): Promise<boolean> {
    if (!cookie) {
      return false;
    } else {
      const { login, uid } = await getLoginStatusApi(cookie).data;
      if (login && uid) {
        return true;
      }
    }
    return false;
  }

  async getUserByCookie(
    cookie: string,
    userService: IUserService,
  ): Promise<IUser> {
    const { uid } = await (await getLoginStatusApi(cookie)).data?.data;
    const userDoc: UserDocument | null = await userService.fetchUser(uid);
    if (userDoc) {
      return userDoc.toJSON();
    } else {
      throw new Error(`user ${uid} doesn't exist`);
    }
  }

  getCookie(): string {
    if (this.mode === 'non-cookie') return '';
    return this.cookie;
  }

  getMode(): 'cookie' | 'non-cookie' {
    return this.mode;
  }

  getUserProfile(): IUser | null {
    if (this.mode === 'cookie' && this.user) return this.user;
    return null;
  }

  async setCookie(cookie: string) {
    const jsonObj: any = await readJson(credentialJsonPath);
    jsonObj['cookie'] = cookie;
    const hasWrite: boolean = await writeJson(credentialJsonPath, jsonObj);
    await this.init();
    return hasWrite;
  }
}

export { AccountService };
