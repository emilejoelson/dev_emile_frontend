import { Injectable } from '@angular/core';

import { ConfigService } from './config.service';
import { LocalStorageService } from './local-storage.service';
import { LogedUser } from '../../auth/models/LoggedUser';

const USER_KEY = 'auth-user';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private accessTokenKey: string;
  private refreshTokenKey: string;

  constructor(
    private configService: ConfigService,
    private localStorageService: LocalStorageService
  ) {
    const authSettings = this.configService.getAuthSettings();
    this.accessTokenKey = authSettings.accessTokenKey || 'accessToken';
    this.refreshTokenKey = authSettings.refreshTokenKey || 'refreshToken';
  }

  getAccessToken(): string {
    return this.localStorageService.getItem(this.accessTokenKey) as string;
  }

  saveAccessToken(token: string) {
    this.localStorageService.setItem(this.accessTokenKey, token);
  }

  getRefreshToken(): string {
    return this.localStorageService.getItem(this.refreshTokenKey) as string;
  }

  saveRefreshToken(token: string) {
    this.localStorageService.setItem(this.refreshTokenKey, token);
  }

  saveTokens(accessToken: string, refreshToken: string) {
    this.saveAccessToken(accessToken);
    this.saveRefreshToken(refreshToken);
  }

  removeTokens() {
    this.localStorageService.removeItem(this.accessTokenKey);
    this.localStorageService.removeItem(this.refreshTokenKey);
  }

  saveUser(user: LogedUser): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  signOut(): void {
    this.localStorageService.clear();
  }
}