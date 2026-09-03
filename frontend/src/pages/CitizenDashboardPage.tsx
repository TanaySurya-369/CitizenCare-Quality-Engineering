import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Complaint } from '../types';
import { ComplaintCard } from '../components/ComplaintCard';
import { FeedbackRatingModal } from '../components/FeedbackRatingModal';
import { GlassCard } from '../components/GlassCard';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Filter,
  Star,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';

export const CitizenDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ratingComplaint, setRatingComplaint] = useState<Complaint | null>(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get('/complaints');
      if (res.data.success) {
        setComplaints(res.data.data.complaints);
      }
    } catch (err) {
      console.error('Failed to load citizen complaints', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Filter complaints
  const filtered = complaints.filter((c) => {
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'ACTIVE') {
        if (!['SUBMITTED', 'ACKNOWLEDGED', 'ASSIGNED', 'IN_PROGRESS'].includes(c.status)) return false;
      } else if (statusFilter === 'RESOLVED') {
        if (!['RESOLVED', 'CLOSED'].includes(c.status)) return false;
      } else if (statusFilter === 'OVERDUE') {
        if (c.slaInfo?.state !== 'BREACHED') return false;
      } else if (c.status !== statusFilter) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = c.complaintNumber.toLowerCase().includes(q);
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchLoc = c.location.toLowerCase().includes(q);
      const matchCat = c.category?.name.toLowerCase().includes(q);
      return matchNum || matchTitle || matchLoc || matchCat;
    }

    return true;
  });

  const totalCount = complaints.length;
  const activeCount = complaints.filter((c) =>
    ['SUBMITTED', 'ACKNOWLEDGED', 'ASSIGNED', 'IN_PROGRESS'].includes(c.status)
  ).length;
  const resolvedCount = complaints.filter((c) => ['RESOLVED', 'CLOSED'].includes(c.status)).length;
  const needsRatingCount = complaints.filter(
    (c) => (c.status === 'RESOLVED' || c.status === 'CLOSED') && !c.feedback
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {user?.name || 'Citizen'}
            </h1>
            <span className="px-2 py-0.5 text-xs bg-brand-500/20 text-brand-300 rounded-full font-bold border border-brand-500/30">
              Verified Citizen
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your civic requests, monitor live response SLAs, and verify resolved issues.
          </p>
        </div>

        <Link
          to="/complaints/new"
          id="new-complaint-btn"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 text-navy-950 font-bold text-xs shadow-glow-teal hover:opacity-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Report New Problem
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{totalCount}</div>
            <div className="text-xs font-semibold text-slate-400">Total Submitted</div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{activeCount}</div>
            <div className="text-xs font-semibold text-slate-400">Active / In Progress</div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{resolvedCount}</div>
            <div className="text-xs font-semibold text-slate-400">Resolved Issues</div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{needsRatingCount}</div>
            <div className="text-xs font-semibold text-slate-400">Awaiting Rating</div>
          </div>
        </GlassCard>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            id="citizen-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, title, road, category..."
            className="w-full bg-navy-950/80 border border-white/15 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { key: 'ALL', label: 'All Requests' },
            { key: 'ACTIVE', label: 'In Progress' },
            { key: 'RESOLVED', label: 'Resolved' },
            { key: 'OVERDUE', label: 'SLA Overdue' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === tab.key
                  ? 'bg-brand-500 text-navy-950 shadow-glow-teal'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-400 animate-pulse">
          Loading your civic complaints...
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/15 text-brand-400 flex items-center justify-center mx-auto border border-brand-500/30">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No Complaints Found</h3>
          <p className="text-xs text-slate-400">
            {searchQuery || statusFilter !== 'ALL'
              ? 'No matching complaints match your active filter criteria.'
              : 'You have not registered any civic complaints yet. Notice something broken in your community?'}
          </p>
          <Link
            to="/complaints/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-navy-950 font-bold text-xs rounded-xl transition-all shadow-glow-teal"
          >
            <PlusCircle className="w-4 h-4" /> Report Issue Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              userRole="CITIZEN"
              onRate={() => setRatingComplaint(complaint)}
            />
          ))}
        </div>
      )}

      {/* Feedback Modal */}
      {ratingComplaint && (
        <FeedbackRatingModal
          complaintId={ratingComplaint.id}
          complaintNumber={ratingComplaint.complaintNumber}
          title={ratingComplaint.title}
          onClose={() => setRatingComplaint(null)}
          onSuccess={() => {
            setRatingComplaint(null);
            fetchComplaints();
          }}
        />
      )}
    </div>
  );
};
