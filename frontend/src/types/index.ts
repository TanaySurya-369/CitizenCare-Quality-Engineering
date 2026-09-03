export type Role = 'CITIZEN' | 'STAFF' | 'ADMIN';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ComplaintStatus =
  | 'SUBMITTED'
  | 'ACKNOWLEDGED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  status: string;
  departmentId?: string | null;
  department?: Department | null;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  email?: string | null;
  headName?: string | null;
  categories?: ComplaintCategory[];
}

export interface ComplaintCategory {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  departmentId: string;
  department?: Department;
  defaultPriority: Priority;
  slaHours: number;
  icon?: string | null;
}

export interface Attachment {
  id: string;
  complaintId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  fileUrl: string;
  uploadedById: string;
  uploadedBy?: { id: string; name: string };
  createdAt: string;
}

export interface ComplaintStatusHistory {
  id: string;
  complaintId: string;
  oldStatus?: string | null;
  newStatus: ComplaintStatus;
  changedById: string;
  changedBy: { id: string; name: string; role: Role };
  remarks?: string | null;
  createdAt: string;
}

export interface StaffAssignment {
  id: string;
  complaintId: string;
  staffId: string;
  staff: { id: string; name: string; email: string };
  assignedById: string;
  assignedBy: { id: string; name: string };
  assignedAt: string;
  notes?: string | null;
  isActive: boolean;
}

export interface Feedback {
  id: string;
  complaintId: string;
  citizenId: string;
  citizen?: { id: string; name: string; email: string };
  rating: number;
  comment?: string | null;
  resolutionConfirmed: boolean;
  createdAt: string;
}

export interface SLAInfo {
  state: 'ON_TRACK' | 'AT_RISK' | 'BREACHED' | 'RESOLVED_ON_TIME' | 'RESOLVED_LATE';
  label: string;
  badgeColor: string;
  remainingHours: number;
}

export interface Complaint {
  id: string;
  complaintNumber: string;
  citizenId: string;
  citizen?: { id: string; name: string; email: string; phone?: string | null };
  categoryId: string;
  category: ComplaintCategory;
  departmentId: string;
  department: Department;
  title: string;
  description: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  priority: Priority;
  status: ComplaintStatus;
  assignedStaffId?: string | null;
  assignedStaff?: { id: string; name: string; email: string; phone?: string | null } | null;
  expectedResolutionDate: string;
  resolvedDate?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  attachments?: Attachment[];
  statusHistory?: ComplaintStatusHistory[];
  assignments?: StaffAssignment[];
  feedback?: Feedback | null;
  slaInfo?: SLAInfo;
}

export interface Notification {
  id: string;
  userId: string;
  complaintId?: string | null;
  complaint?: { id: string; complaintNumber: string; title: string; status: string } | null;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface SystemKPIs {
  totalComplaints: number;
  openComplaints: number;
  resolvedComplaints: number;
  overdueComplaints: number;
  slaComplianceRate: number;
  averageResolutionHours: number;
  citizenSatisfactionScore: number;
  totalFeedbacks: number;
  byCategory: Array<{ categoryId: string; name: string; count: number }>;
  byPriority: Array<{ priority: string; count: number }>;
  byDepartment: Array<{ departmentId: string; name: string; count: number }>;
  feedbackDistribution: Record<number, number>;
}
