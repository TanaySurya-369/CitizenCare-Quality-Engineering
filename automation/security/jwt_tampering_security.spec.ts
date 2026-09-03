import request from 'supertest';
import { expect } from 'chai';
import app from '../../backend/src/app';
import { TokenManager } from '../api/utilities/TokenManager';

describe('Security & JWT Test Suite: Signature Tampering & Expiry', () => {
  let validToken: string;

  before(async () => {
    validToken = await TokenManager.getCitizenToken();
  });

  it('should reject JWT with altered payload signature (401 Invalid Token)', async () => {
    const tampered = validToken.slice(0, -8) + 'xyz999aa';

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${tampered}`)
      .expect(401);

    expect(res.body.success).to.be.false;
    expect(res.body.errorCode).to.equal('INVALID_TOKEN');
  });

  it('should reject malformed Bearer strings', async () => {
    await request(app)
      .get('/api/complaints')
      .set('Authorization', 'Bearer random-junk-string')
      .expect(401);
  });
});
