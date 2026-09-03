import request from 'supertest';
import { expect } from 'chai';
import app from '../../backend/src/app';
import { TokenManager } from '../api/utilities/TokenManager';
import { DBClient } from '../database/utilities/DBClient';

describe('Integration Test Suite: Multi-Service Orchestration & Telemetry', () => {
  let citizenToken: string;
  let staffToken: string;
  let adminToken: string;
  let categoryId: string;
  let complaintId: string;

  before(async () => {
    citizenToken = await TokenManager.getCitizenToken();
    staffToken = await TokenManager.getStaffToken();
    adminToken = await TokenManager.getAdminToken();

    const catRes = await request(app).get('/api/categories');
    categoryId = catRes.body.data.categories[0].id;
  });

  after(async () => {
    await DBClient.disconnect();
  });

  it('Integration Flow 1: Complaint Creation -> Notification Dispatch -> Database Persistence', async () => {
    const res = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        title: 'Integration Test: Water pipe burst',
        description: 'Flooding in intersection due to burst pipe.',
        categoryId,
        location: '77 Wall St',
        priority: 'HIGH',
      })
      .expect(201);

    complaintId = res.body.data.complaint.id;

    // Verify Notification Created
    const notifRes = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${citizenToken}`)
      .expect(200);

    expect(notifRes.body.data.notifications.length).to.be.greaterThan(0);

    // Verify Direct DB Persistence
    const dbRecord = await DBClient.findComplaintById(complaintId);
    expect(dbRecord).to.not.be.null;
    expect(dbRecord!.status).to.equal('SUBMITTED');
  });

  it('Integration Flow 2: Status Transition -> SLA Telemetry -> Audit Trail Insertion', async () => {
    // Transition status
    await request(app)
      .patch(`/api/complaints/${complaintId}/status`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ status: 'ACKNOWLEDGED', remarks: 'Reviewed by field lead' })
      .expect(200);

    // Verify Audit Log inserted
    const auditLogs = await DBClient.getAuditLogsForEntity('COMPLAINT', complaintId);
    expect(auditLogs.length).to.be.greaterThan(0);
    expect(auditLogs[0].action).to.equal('UPDATE_STATUS');
  });
});
