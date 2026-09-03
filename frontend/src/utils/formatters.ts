import { ComplaintStatus, Priority } from '../types';

export const formatDate = (dateStr: string | Date | null | undefined): string => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatShortDate = (dateStr: string | Date | null | undefined): string => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusConfig = (status: ComplaintStatus) => {
  switch (status) {
    case 'SUBMITTED':
      return {
        label: 'Submitted',
        bgColor: 'bg-blue-500/15',
        textColor: 'text-blue-400',
        borderColor: 'border-blue-500/30',
        dotColor: 'bg-blue-400',
      };
    case 'ACKNOWLEDGED':
      return {
        label: 'Acknowledged',
        bgColor: 'bg-cyan-500/15',
        textColor: 'text-cyan-400',
        borderColor: 'border-cyan-500/30',
        dotColor: 'bg-cyan-400',
      };
    case 'ASSIGNED':
      return {
        label: 'Assigned',
        bgColor: 'bg-indigo-500/15',
        textColor: 'text-indigo-400',
        borderColor: 'border-indigo-500/30',
        dotColor: 'bg-indigo-400',
      };
    case 'IN_PROGRESS':
      return {
        label: 'In Progress',
        bgColor: 'bg-amber-500/15',
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500/30',
        dotColor: 'bg-amber-400 animate-pulse',
      };
    case 'RESOLVED':
      return {
        label: 'Resolved',
        bgColor: 'bg-emerald-500/15',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        dotColor: 'bg-emerald-400',
      };
    case 'CLOSED':
      return {
        label: 'Closed',
        bgColor: 'bg-teal-500/15',
        textColor: 'text-teal-400',
        borderColor: 'border-teal-500/30',
        dotColor: 'bg-teal-400',
      };
    case 'REJECTED':
      return {
        label: 'Rejected',
        bgColor: 'bg-rose-500/15',
        textColor: 'text-rose-400',
        borderColor: 'border-rose-500/30',
        dotColor: 'bg-rose-400',
      };
    default:
      return {
        label: status,
        bgColor: 'bg-slate-500/15',
        textColor: 'text-slate-400',
        borderColor: 'border-slate-500/30',
        dotColor: 'bg-slate-400',
      };
  }
};

export const getPriorityConfig = (priority: Priority) => {
  switch (priority) {
    case 'CRITICAL':
      return {
        label: 'Critical (24h)',
        bgColor: 'bg-rose-500/20',
        textColor: 'text-rose-400',
        borderColor: 'border-rose-500/40',
        badge: 'bg-rose-600',
      };
    case 'HIGH':
      return {
        label: 'High (48h)',
        bgColor: 'bg-amber-500/20',
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500/40',
        badge: 'bg-amber-600',
      };
    case 'MEDIUM':
      return {
        label: 'Medium (72h)',
        bgColor: 'bg-blue-500/20',
        textColor: 'text-blue-400',
        borderColor: 'border-blue-500/40',
        badge: 'bg-blue-600',
      };
    case 'LOW':
      return {
        label: 'Low (7d)',
        bgColor: 'bg-slate-500/20',
        textColor: 'text-slate-300',
        borderColor: 'border-slate-500/40',
        badge: 'bg-slate-600',
      };
    default:
      return {
        label: priority,
        bgColor: 'bg-slate-500/20',
        textColor: 'text-slate-400',
        borderColor: 'border-slate-500/40',
        badge: 'bg-slate-600',
      };
  }
};
