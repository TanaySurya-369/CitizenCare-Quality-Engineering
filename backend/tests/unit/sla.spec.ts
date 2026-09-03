import { expect } from 'chai';
import { SLAUtil } from '../../src/utils/sla.util';

describe('TDD Unit Test Suite: SLA & Priority Resolution Engine', () => {
  it('should accurately calculate a 24-hour deadline for CRITICAL complaints', () => {
    const baseDate = new Date('2026-09-01T10:00:00.000Z');
    const deadline = SLAUtil.calculateExpectedResolutionDate('CRITICAL', baseDate);
    const expectedTime = new Date('2026-09-02T10:00:00.000Z').getTime();

    expect(deadline.getTime()).to.equal(expectedTime);
  });

  it('should calculate 48-hour deadline for HIGH priority complaints', () => {
    const baseDate = new Date('2026-09-01T10:00:00.000Z');
    const deadline = SLAUtil.calculateExpectedResolutionDate('HIGH', baseDate);
    const expectedTime = new Date('2026-09-03T10:00:00.000Z').getTime();

    expect(deadline.getTime()).to.equal(expectedTime);
  });

  it('should calculate 72-hour deadline for MEDIUM priority complaints', () => {
    const baseDate = new Date('2026-09-01T10:00:00.000Z');
    const deadline = SLAUtil.calculateExpectedResolutionDate('MEDIUM', baseDate);
    const expectedTime = new Date('2026-09-04T10:00:00.000Z').getTime();

    expect(deadline.getTime()).to.equal(expectedTime);
  });

  it('should calculate 7-day (168h) deadline for LOW priority complaints', () => {
    const baseDate = new Date('2026-09-01T10:00:00.000Z');
    const deadline = SLAUtil.calculateExpectedResolutionDate('LOW', baseDate);
    const expectedTime = new Date('2026-09-08T10:00:00.000Z').getTime();

    expect(deadline.getTime()).to.equal(expectedTime);
  });

  it('should identify overdue status when deadline has passed for active complaints', () => {
    const pastDate = new Date(Date.now() - 5 * 60 * 60 * 1000); // 5 hours ago
    const isOverdue = SLAUtil.isOverdue(pastDate, 'IN_PROGRESS');
    expect(isOverdue).to.be.true;
  });

  it('should NOT mark resolved or closed complaints as overdue even if deadline passed', () => {
    const pastDate = new Date(Date.now() - 5 * 60 * 60 * 1000);
    const isOverdueResolved = SLAUtil.isOverdue(pastDate, 'RESOLVED');
    const isOverdueClosed = SLAUtil.isOverdue(pastDate, 'CLOSED');

    expect(isOverdueResolved).to.be.false;
    expect(isOverdueClosed).to.be.false;
  });

  it('should return AT_RISK state when remaining hours is 12 or less', () => {
    const atRiskDate = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hours left
    const result = SLAUtil.getSlaStatus(atRiskDate, 'ASSIGNED');

    expect(result.state).to.equal('AT_RISK');
    expect(result.badgeColor).to.equal('amber');
  });
});
