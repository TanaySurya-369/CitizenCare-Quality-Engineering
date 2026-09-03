import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Complaint } from '../types';
import { ComplaintCard } from '../components/ComplaintCard';
import { GlassCard } from '../components/GlassCard';
import { StatusTransitionModal } from '../components/StatusTransitionModal';
import { AssignStaffModal } from '../components/AssignStaffModal';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  Search,
  Filter,
  ArrowRightCircle,
  UserCheck,
  Building,
} from 'lucide-react';
import api from '../services/api';

export const StaffDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active modal targets
  const [targetComplaint, setTargetComplaint] = useState<Complaint | null>(null);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get('/complaints');
      if (res.data.success) {
        setComplaints(res.data.data.complaints);
      }
    } catch (err) {
      console.error('Failed to load staff complaints', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filtered = complaints.filter((c) => {
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'MY_ASSIGNED') {
        if (c.assignedStaffId !== user?.id) return false;
      } else if (statusFilter === 'UNASSIGNED') {
        if (c.assignedStaffId) return false;
      } else if (statusFilter === 'OVERDUE') {
        if (c.slaInfo?.state !== 'BREACHED') return false;
      } else if (c.status !== statusFilter) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.complaintNumber.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        (c.category?.name || '').toLowerCase().includes(q)
      );
    }

    return true;
  });

  const totalAssigned = complaints.filter((c) => c.assignedStaffId === user?.id).length;
  const totalInProgress = complaints.filter((c) => c.status === 'IN_PROGRESS').length;
  const totalOverdue = complaints.filter((c) => c.slaInfo?.state === 'BREACHED').length;
  const totalResolved = complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Municipal Staff Workspace
            </h1>
            <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-300 rounded-full font-bold border border-amber-500/30">
              {user?.department?.name || 'Department Officer'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Triage civic work orders, meet strict SLA targets, and log on-site resolution evidence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-400" />
            <span>Logged in: <strong className="text-white">{user?.name}</strong></span>
          </div>
        </div>
      </div>

      {/* Staff KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{totalAssigned}</div>
            <div className="text-xs font-semibold text-slate-400">My Assigned Tasks</div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{totalInProgress}</div>
            <div className="text-xs font-semibold text-slate-400">Work In Progress</div>
          </div>
        </GlassCard>

        <GlassCard className={`p-5 flex items-center gap-4 ${totalOverdue > 0 ? 'border-rose-500/40 bg-rose-500/[0.05]' : ''}`}>
          <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-rose-300">{totalOverdue}</div>
            <div className="text-xs font-semibold text-slate-400">SLA Breached / Overdue</div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{totalResolved}</div>
            <div className="text-xs font-semibold text-slate-400">Resolved Work Orders</div>
          </div>
        </GlassCard>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            id="staff-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter queue by ID, road, keyword..."
            className="w-full bg-navy-950/80 border border-white/15 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { key: 'ALL', label: 'All Department Queue' },
            { key: 'MY_ASSIGNED', label: 'Assigned To Me' },
            { key: 'UNASSIGNED', label: 'Unassigned' },
            { key: 'IN_PROGRESS', label: 'In Progress' },
            { key: 'OVERDUE', label: 'Overdue Breaches' },
            { key: 'RESOLVED', label: 'Resolved' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === tab.key
                  ? 'bg-amber-500 text-navy-950 shadow-md font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Queue List */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-400 animate-pulse">
          Loading municipal work orders...
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center max-w-lg mx-auto space-y-3">
          <CheckCircle2 className="w-12 h-12 text-brand-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Queue is Clear!</h3>
          <p className="text-xs text-slate-400">
            No complaints currently pending under the selected filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((complaint) => (
            <div key={complaint.id} className="relative group">
              <ComplaintCard complaint={complaint} userRole="STAFF" />

              {/* Staff Quick Action Overlay Buttons */}
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    setTargetComplaint(complaint);
                    setShowStatusModal(true);
                  }}
                  className="w-1/2 py-2 rounded-xl bg-white/5 hover:bg-brand-500/20 text-slate-200 hover:text-brand-300 text-xs font-semibold border border-white/10 transition-all flex items-center justify-center gap-1"
                >
                  <ArrowRightCircle className="w-3.5 h-3.5 text-brand-400" /> Update Status
                </button>

                <button
                  onClick={() => {
                    setTargetComplaint(complaint);
                    setShowAssignModal(true);
                  }}
                  className="w-1/2 py-2 rounded-xl bg-white/5 hover:bg-indigo-500/20 text-slate-200 hover:text-indigo-300 text-xs font-semibold border border-white/10 transition-all flex items-center justify-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Assign Tech
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showStatusModal && targetComplaint && (
        <StatusTransitionModal
          complaintId={targetComplaint.id}
          complaintNumber={targetComplaint.complaintNumber}
          currentStatus={targetComplaint.status}
          onClose={() => {
            setShowStatusModal(false);
            setTargetComplaint(null);
          }}
          onSuccess={() => {
            setShowStatusModal(false);
            setTargetComplaint(null);
            fetchComplaints();
          }}
        />
      )}

      {showAssignModal && targetComplaint && (
        <AssignStaffModal
          complaintId={targetComplaint.id}
          complaintNumber={targetComplaint.complaintNumber}
          departmentId={targetComplaint.departmentId}
          onClose={() => {
            setShowAssignModal(false);
            setTargetComplaint(null);
          }}
          onSuccess={() => {
            setShowAssignModal(false);
            setTargetComplaint(null);
            fetchComplaints();
          }}
        />
      )}
    </div>
  );
};
