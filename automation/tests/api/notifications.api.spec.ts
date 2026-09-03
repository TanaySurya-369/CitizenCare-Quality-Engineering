import request from 'supertest';
import { expect } from 'chai';
import app from '../../../backend/src/app';
import { TestDataManager } from '../../utilities/TestDataManager';

describe('REST API Test Suite: In-App Notification Center', () => {
  const users = TestDataManager.getUsers();
  let citizenToken: string;

  before(async () => {
    const citRes = await request(app)
      .post('/api/auth/login')
      .send({ email: users.validUsers.citizen.email, password: users.validUsers.citizen.password });
    citizenToken = citRes.body.data.token;
  });

  describe('GET /api/notifications', () => {
    it('should retrieve list of in-app notifications and unread count', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('notifications');
      expect(res.body.data.notifications).to.be.an('array');
      expect(res.body.data).to.have.property('unreadCount');
    });
  });

  describe('PATCH /api/notifications/read-all', () => {
    it('should mark all unread notifications as read', async () => {
      const res = await request(app)
        .patch('/api/notifications/read-all')
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(200);

      expect(res.body.success).to.be.true;

      // Verify unread count is now 0
      const checkRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${citizenToken}`);

      expect(checkRes.body.data.unreadCount).to.equal(0);
    });
  });
});
