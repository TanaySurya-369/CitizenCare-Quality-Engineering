import request from 'supertest';
import { expect } from 'chai';
import app from '../../backend/src/app';
import { TokenManager } from '../api/utilities/TokenManager';

describe('Security & Sanitization Test Suite: SQL Injection Immunity', () => {
  let citizenToken: string;

  before(async () => {
    citizenToken = await TokenManager.getCitizenToken();
  });

  const injectionVectors = [
    "' OR '1'='1",
    "'; DROP TABLE complaints; --",
    "admin' --",
    "' UNION SELECT * FROM users --",
    "1; WAITFOR DELAY '0:0:5'--",
  ];

  it('should safely sanitize all search and filter query parameters', async () => {
    for (const vector of injectionVectors) {
      const res = await request(app)
        .get(`/api/complaints?search=${encodeURIComponent(vector)}`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.data.complaints).to.be.an('array');
    }
  });
});
