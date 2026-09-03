import { expect } from 'chai';
import { DatabaseHelper } from '../../utilities/DatabaseHelper';
import request from 'supertest';
import app from '../../../backend/src/app';
import { TestDataManager } from '../../utilities/TestDataManager';

describe('Database Level Validation Suite: SQL State & Audit Consistency', () => {
  const prisma = DatabaseHelper.getClient();
  const users = TestDataManager.getUsers();
  let citizenToken: string;
  let createdComplaintNumber: string;

  before(async () => {
    const citRes = await request(app)
      .post('/api/auth/login')
      .send({ email: users.validUsers.citizen.email, password: users.validUsers.citizen.password });
    citizenToken = citRes.body.data.token;
  });

  after(async () => {
    await DatabaseHelper.disconnect();
  });

  it('should verify seeded departments and categories in the database', async () => {
    const departments = await prisma.department.findMany({ include: { categories: true } });
    expect(departments).to.be.an('array');
    expect(departments.length).to.be.at.least(5);

    const categories = await prisma.complaintCategory.findMany();
    expect(categories.length).to.be.at.least(6);
  });

  it('should verify database row creation, status history, and audit log after API complaint submission', async () => {
    const cat = await prisma.complaintCategory.findFirst();
    expect(cat).to.not.be.null;

    const payload = {
      title: 'Database Verification: Blocked storm drainage',
      description: 'Stagnant road water accumulating over sidewalk due to drain blockage.',
      categoryId: cat!.id,
      location: '124 Main Boulevard',
      priority: 'HIGH',
    };

    const res = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${citizenToken}`)
      .send(payload)
      .expect(201);

    createdComplaintNumber = res.body.data.complaint.complaintNumber;

    // DIRECT SQL DATABASE VALIDATION
    const dbRecord = await DatabaseHelper.findComplaintByNumber(createdComplaintNumber);
    expect(dbRecord).to.not.be.null;
    expect(dbRecord!.title).to.equal(payload.title);
    expect(dbRecord!.status).to.equal('SUBMITTED');
    expect(dbRecord!.expectedResolutionDate).to.be.instanceOf(Date);

    // Verify status history row was created in same transaction
    expect(dbRecord!.statusHistory).to.be.an('array');
    expect(dbRecord!.statusHistory.length).to.be.at.least(1);
    expect(dbRecord!.statusHistory[0].newStatus).to.equal('SUBMITTED');

    // Verify audit log record exists
    const auditLog = await prisma.auditLog.findFirst({
      where: { entity: 'COMPLAINT', entityId: dbRecord!.id },
    });
    expect(auditLog).to.not.be.null;
    expect(auditLog!.action).to.equal('CREATE_COMPLAINT');
  });
});
