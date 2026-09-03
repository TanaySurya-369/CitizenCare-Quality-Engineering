export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export class SLAUtil {
  public static readonly SLA_HOURS: Record<PriorityLevel, number> = {
    CRITICAL: 24,
    HIGH: 48,
    MEDIUM: 72,
    LOW: 168, // 7 days
  };

  /**
   * Calculates the deadline based on priority.
   */
  static calculateExpectedResolutionDate(priority: string, fromDate: Date = new Date()): Date {
    const p = (priority.toUpperCase() as PriorityLevel) || 'MEDIUM';
    const hours = this.SLA_HOURS[p] || 72;
    const deadline = new Date(fromDate.getTime() + hours * 60 * 60 * 1000);
    return deadline;
  }

  /**
   * Checks if an ongoing complaint has passed its expected deadline.
   */
  static isOverdue(expectedDate: Date | string, status: string): boolean {
    const finalStatuses = ['RESOLVED', 'CLOSED', 'REJECTED'];
    if (finalStatuses.includes(status.toUpperCase())) {
      return false;
    }
    const deadline = new Date(expectedDate).getTime();
    return Date.now() > deadline;
  }

  /**
   * Calculates remaining hours until SLA breach. Returns negative number if breached.
   */
  static getRemainingHours(expectedDate: Date | string): number {
    const deadline = new Date(expectedDate).getTime();
    const diffMs = deadline - Date.now();
    return Math.round(diffMs / (1000 * 60 * 60));
  }

  /**
   * Returns human-readable SLA performance classification.
   */
  static getSlaStatus(expectedDate: Date | string, status: string, resolvedDate?: Date | string | null): {
    state: 'ON_TRACK' | 'AT_RISK' | 'BREACHED' | 'RESOLVED_ON_TIME' | 'RESOLVED_LATE';
    label: string;
    badgeColor: string;
    remainingHours: number;
  } {
    const expTime = new Date(expectedDate).getTime();
    const isResolved = ['RESOLVED', 'CLOSED'].includes(status.toUpperCase());

    if (isResolved && resolvedDate) {
      const resTime = new Date(resolvedDate).getTime();
      if (resTime <= expTime) {
        return { state: 'RESOLVED_ON_TIME', label: 'Resolved within SLA', badgeColor: 'emerald', remainingHours: 0 };
      } else {
        return { state: 'RESOLVED_LATE', label: 'Resolved after SLA Breach', badgeColor: 'rose', remainingHours: 0 };
      }
    }

    if (isResolved && !resolvedDate) {
      return { state: 'RESOLVED_ON_TIME', label: 'Resolved', badgeColor: 'emerald', remainingHours: 0 };
    }

    if (status.toUpperCase() === 'REJECTED') {
      return { state: 'RESOLVED_ON_TIME', label: 'Rejected', badgeColor: 'slate', remainingHours: 0 };
    }

    const remainingHours = this.getRemainingHours(expectedDate);

    if (remainingHours < 0) {
      return {
        state: 'BREACHED',
        label: `SLA Overdue by ${Math.abs(remainingHours)}h`,
        badgeColor: 'rose',
        remainingHours,
      };
    } else if (remainingHours <= 12) {
      return {
        state: 'AT_RISK',
        label: `At Risk (${remainingHours}h left)`,
        badgeColor: 'amber',
        remainingHours,
      };
    } else {
      return {
        state: 'ON_TRACK',
        label: `On Track (${remainingHours}h left)`,
        badgeColor: 'teal',
        remainingHours,
      };
    }
  }
}
