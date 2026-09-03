import { expect } from 'chai';
import { DBClient } from '../utilities/DBClient';
import request from 'supertest';
import app from '../../../backend/src/app';
import { TokenManager } from '../../api/utilities/TokenManager';

describe('SQL Database Validation: Transactional Status History & Audit Logs', () => {
  const prisma = DBClient.getClient();
  let citizenToken: string;
  let staffToken: string;
  let complaintId: string;

  before(async () => {
    citizenToken = await TokenManager.getCitizenToken();
    staffToken = await TokenManager.getStaffToken();

    const cat = await prisma.complaintCategory.findFirst();
    const res = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        title: 'Status History DB Audit Test',
        description: 'Verifying SQL transactional integrity across transitions.',
        categoryId: cat!.id,
        location: '100 Broadway',
      });
    complaintId = res.body.data.complaint.id;
  });

  after(async () => {
    await DBClient.disconnect();
  });

  it('should verify database status history rows match sequential state transitions', async () => {
    // Step 1: ACKNOWLEDGED
    await request(app)
      .patch(`/api/complaints/${complaintId}/status`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ status: 'ACKNOWLEDGED', remarks: 'DB audit step 1' });

    // Step 2: IN_PROGRESS
    await request(app)
      .patch(`/api/complaints/${complaintId}/status`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ status: 'IN_PROGRESS', remarks: 'DB audit step 2' });

    // Direct SQL inspection
    const historyRows = await prisma.complaintStatusHistory.findMany({
      where: { complaintId },
      orderBy: { createdAt: 'asc' },
    });

    expect(historyRows.length).to.be.at.least(3); // SUBMITTED, ACKNOWLEDGED, IN_PROGRESS
    expect(historyRows[0].newStatus).to.equal('SUBMITTED');
    expect(historyRows[1].newStatus).to.equal('ACKNOWLEDGED');
    expect(historyRows[2].newStatus).to.equal('IN_PROGRESS');
  });

  it('should verify audit log entries generated for each mutation', async () => {
    const auditLogs = await DBClient.getAuditLogsForEntity('COMPLAINT', complaintId);
    expect(auditLogs.length).to.be.greaterThan(0);
    expect(auditLogs.map((l) => l.action)).to.include('UPDATE_STATUS');
  });
});
