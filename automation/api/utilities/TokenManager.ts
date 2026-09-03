import request from 'supertest';
import app from '../../../backend/src/app';
import { AuthPayloads } from '../payloads/auth.payloads';

export class TokenManager {
  private static tokenCache: Map<string, string> = new Map();

  static async getCitizenToken(): Promise<string> {
    if (!this.tokenCache.has('citizen')) {
      const res = await request(app).post('/api/auth/login').send(AuthPayloads.loginCitizen);
      this.tokenCache.set('citizen', res.body.data.token);
    }
    return this.tokenCache.get('citizen')!;
  }

  static async getStaffToken(): Promise<string> {
    if (!this.tokenCache.has('staff')) {
      const res = await request(app).post('/api/auth/login').send(AuthPayloads.loginStaffRoads);
      this.tokenCache.set('staff', res.body.data.token);
    }
    return this.tokenCache.get('staff')!;
  }

  static async getAdminToken(): Promise<string> {
    if (!this.tokenCache.has('admin')) {
      const res = await request(app).post('/api/auth/login').send(AuthPayloads.loginAdmin);
      this.tokenCache.set('admin', res.body.data.token);
    }
    return this.tokenCache.get('admin')!;
  }
}
