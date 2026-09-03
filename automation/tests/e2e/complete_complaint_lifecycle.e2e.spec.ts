import request from 'supertest';
import { expect } from 'chai';
import app from '../../../backend/src/app';
import { DatabaseHelper } from '../../utilities/DatabaseHelper';
import { TestDataManager } from '../../utilities/TestDataManager';

describe('Golden E2E Test Suite: Complete Municipal Complaint Lifecycle Journey', () => {
  const users = TestDataManager.getUsers();
  let citizenToken: string;
  let citizenId: string;
  let staffToken: string;
  let staffId: string;
  let adminToken: string;
  let categoryId: string;
  let complaintId: string;
  let complaintNumber: string;

  before(async () => {
    // 1. Citizen Login
    const citRes = await request(app)
      .post('/api/auth/login')
      .send({ email: users.validUsers.citizen.email, password: users.validUsers.citizen.password });
    citizenToken = citRes.body.data.token;
    citizenId = citRes.body.data.user.id;

    // 2. Staff Login
    const stfRes = await request(app)
      .post('/api/auth/login')
      .send({ email: users.validUsers.staffRoads.email, password: users.validUsers.staffRoads.password });
    staffToken = stfRes.body.data.token;
    staffId = stfRes.body.data.user.id;

    // 3. Admin Login
    const admRes = await request(app)
      .post('/api/auth/login')
      .send({ email: users.validUsers.admin.email, password: users.validUsers.admin.password });
    adminToken = admRes.body.data.token;

    // 4. Fetch Category
    const catRes = await request(app).get('/api/categories');
    categoryId = catRes.body.data.categories[0].id;
  });

  after(async () => {
    await DatabaseHelper.disconnect();
  });

  it('Step 1: Citizen submits a new municipal complaint with geolocation & priority', async () => {
    const payload = {
      title: 'E2E Flow: Broken asphalt and waterlogging on 5th Avenue',
      description: 'Severe road surface damage causing vehicle hazards and traffic diversion.',
      categoryId,
      location: '5th Ave & 23rd St, Ward 4',
      priority: 'HIGH',
      latitude: 40.7418,
      longitude: -73.9893,
    };

    const res = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${citizenToken}`)
      .send(payload)
      .expect(201);

    expect(res.body.success).to.be.true;
    const comp = res.body.data.complaint;
    complaintId = comp.id;
    complaintNumber = comp.complaintNumber;

    expect(comp.status).to.equal('SUBMITTED');
    expect(comp.priority).to.equal('HIGH');
    expect(comp.slaInfo.state).to.be.oneOf(['ON_TRACK', 'AT_RISK']);
  });

  it('Step 2: Database verifies complaint record, initial status history, and audit log', async () => {
    const dbRecord = await DatabaseHelper.findComplaintByNumber(complaintNumber);
    expect(dbRecord).to.not.be.null;
    expect(dbRecord!.status).to.equal('SUBMITTED');
    expect(dbRecord!.statusHistory.length).to.be.at.least(1);

    const audit = await DatabaseHelper.getLatestAuditLogForEntity('COMPLAINT', complaintId);
    expect(audit).to.not.be.null;
    expect(audit!.action).to.equal('CREATE_COMPLAINT');
  });

  it('Step 3: Staff/Admin assigns field technician to the complaint', async () => {
    const res = await request(app)
      .patch(`/api/complaints/${complaintId}/assign`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        staffId,
        notes: 'Priority dispatch: Dispatch asphalt repair unit.',
      })
      .expect(200);

    expect(res.body.success).to.be.true;
    expect(res.body.data.complaint.status).to.equal('ASSIGNED');
    expect(res.body.data.complaint.assignedStaffId).to.equal(staffId);
  });

  it('Step 4: Staff updates status to IN_PROGRESS during on-site investigation', async () => {
    const res = await request(app)
      .patch(`/api/complaints/${complaintId}/status`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        status: 'IN_PROGRESS',
        remarks: 'Asphalt milling machine on site. Repair in progress.',
      })
      .expect(200);

    expect(res.body.success).to.be.true;
    expect(res.body.data.complaint.status).to.equal('IN_PROGRESS');
  });

  it('Step 5: Staff completes work and marks complaint as RESOLVED', async () => {
    const res = await request(app)
      .patch(`/api/complaints/${complaintId}/status`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        status: 'RESOLVED',
        remarks: 'Asphalt hot-mix applied, compacted, and road reopened to traffic.',
      })
      .expect(200);

    expect(res.body.success).to.be.true;
    expect(res.body.data.complaint.status).to.equal('RESOLVED');
    expect(res.body.data.complaint.resolvedDate).to.not.be.null;
  });

  it('Step 6: Citizen receives notification and submits 5-Star feedback rating with confirmation', async () => {
    const feedbackRes = await request(app)
      .post(`/api/complaints/${complaintId}/feedback`)
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        rating: 5,
        comment: 'Outstanding repair speed! Fixed cleanly ahead of schedule.',
        resolutionConfirmed: true,
      })
      .expect(201);

    expect(feedbackRes.body.success).to.be.true;
    expect(feedbackRes.body.data.feedback.rating).to.equal(5);

    // Complaint status auto-progresses to CLOSED
    const checkRes = await request(app)
      .get(`/api/complaints/${complaintId}`)
      .set('Authorization', `Bearer ${citizenToken}`);

    expect(checkRes.body.data.complaint.status).to.equal('CLOSED');
  });

  it('Step 7: Admin KPI analytics reflects the resolution, SLA metrics, and feedback score', async () => {
    const analyticsRes = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const kpis = analyticsRes.body.data;
    expect(kpis.resolvedComplaints).to.be.greaterThan(0);
    expect(kpis.citizenSatisfactionScore).to.be.greaterThan(4.0);
    expect(kpis.slaComplianceRate).to.be.greaterThan(90.0);
  });
});
