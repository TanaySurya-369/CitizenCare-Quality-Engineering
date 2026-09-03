import request from 'supertest';
import { expect } from 'chai';
import app from '../../../backend/src/app';
import { TokenManager } from '../utilities/TokenManager';

describe('Enterprise REST API: Notifications & In-App Alerts', () => {
  let citizenToken: string;

  before(async () => {
    citizenToken = await TokenManager.getCitizenToken();
  });

  describe('GET /api/notifications', () => {
    it('should retrieve list of notifications and unread count', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(200);

      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('notifications');
      expect(res.body.data).to.have.property('unreadCount');
    });
  });

  describe('PATCH /api/notifications/read-all', () => {
    it('should mark all notifications as read', async () => {
      const res = await request(app)
        .patch('/api/notifications/read-all')
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(200);

      expect(res.body.success).to.be.true;
    });
  });
});
