import { expect } from 'chai';
import { DBClient } from '../utilities/DBClient';
import request from 'supertest';
import app from '../../../backend/src/app';
import { TokenManager } from '../../api/utilities/TokenManager';

describe('SQL Database Validation: Complaint State & Schema Integrity', () => {
  const prisma = DBClient.getClient();
  let citizenToken: string;
  let complaintId: string;

  before(async () => {
    citizenToken = await TokenManager.getCitizenToken();
  });

  after(async () => {
    await DBClient.disconnect();
  });

  it('should verify database row persistence and foreign keys on complaint creation', async () => {
    const cat = await prisma.complaintCategory.findFirst();
    expect(cat).to.not.be.null;

    const res = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        title: 'SQL DB Validation: Broken water valve',
        description: 'High pressure water backflow observed on sidewalk.',
        categoryId: cat!.id,
        location: '55 Water St',
        priority: 'CRITICAL',
      })
      .expect(201);

    complaintId = res.body.data.complaint.id;

    // DIRECT SQL VALIDATION
    const dbRecord = await DBClient.findComplaintById(complaintId);
    expect(dbRecord).to.not.be.null;
    expect(dbRecord!.status).to.equal('SUBMITTED');
    expect(dbRecord!.priority).to.equal('CRITICAL');
    expect(dbRecord!.departmentId).to.equal(cat!.departmentId);
    expect(dbRecord!.expectedResolutionDate).to.be.instanceOf(Date);
  });
});
