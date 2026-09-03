import React, { useState, useEffect } from 'react';
import { SystemKPIs, Complaint } from '../types';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { SLATimerBadge } from '../components/SLATimerBadge';
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Star,
  Users,
  Activity,
  Layers,
  Search,
  Eye,
  FileSpreadsheet,
  ArrowUpRight,
} from 'lucide-react';
import { formatDate } from '../utils/formatters';
import { Link } from 'react-router-dom';
import api from '../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [kpis, setKpis] = useState<SystemKPIs | null>(null);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ALL_COMPLAINTS' | 'AUDIT_LOGS'>('OVERVIEW');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [kpiRes, compRes, auditRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/complaints?limit=10'),
        api.get('/admin/audit-logs?limit=15'),
      ]);

      if (kpiRes.data.success) setKpis(kpiRes.data.data);
      if (compRes.data.success) setRecentComplaints(compRes.data.data.complaints);
      if (auditRes.data.success) setAuditLogs(auditRes.data.data.logs);
    } catch (err) {
      console.error('Failed to load admin analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading || !kpis) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm text-slate-400 animate-pulse">
        Aggregating city-wide municipal analytics & audit logs...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              City Administration Command Center
            </h1>
            <span className="px-2 py-0.5 text-xs bg-rose-500/20 text-rose-300 rounded-full font-bold border border-rose-500/30">
              Executive Admin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time municipal telemetry, SLA compliance monitoring, and immutable audit logs.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'OVERVIEW'
                ? 'bg-brand-500 text-navy-950 shadow-glow-teal'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Analytics & KPIs
          </button>
          <button
            onClick={() => setActiveTab('ALL_COMPLAINTS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ALL_COMPLAINTS'
                ? 'bg-brand-500 text-navy-950 shadow-glow-teal'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Recent Work Orders
          </button>
          <button
            onClick={() => setActiveTab('AUDIT_LOGS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'AUDIT_LOGS'
                ? 'bg-brand-500 text-navy-950 shadow-glow-teal'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Audit Stream
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total System Complaints</span>
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">{kpis.totalComplaints}</div>
            <div className="text-[11px] text-slate-400 mt-1">Across 5 departments</div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between border-brand-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-300">SLA Compliance Rate</span>
            <div className="p-2 rounded-lg bg-brand-500/20 text-brand-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-brand-400">{kpis.slaComplianceRate}%</div>
            <div className="text-[11px] text-slate-400 mt-1">Target: ≥ 95.0%</div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Avg Resolution Duration</span>
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">{kpis.averageResolutionHours}h</div>
            <div className="text-[11px] text-slate-400 mt-1">From submit to resolved</div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300">Citizen Satisfaction</span>
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-amber-300">
              {kpis.citizenSatisfactionScore} <span className="text-sm font-normal text-slate-400">/ 5.0</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{kpis.totalFeedbacks} verified reviews</div>
          </div>
        </GlassCard>
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="space-y-8">
          {/* Charts & Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Workload Distribution */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Department Workload Volume</span>
                <Building2 className="w-4 h-4 text-brand-400" />
              </h3>

              <div className="space-y-3 pt-2">
                {kpis.byDepartment.map((dept) => {
                  const pct = kpis.totalComplaints > 0 ? Math.round((dept.count / kpis.totalComplaints) * 100) : 0;
                  return (
                    <div key={dept.departmentId} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-300">{dept.name}</span>
                        <span className="font-mono text-brand-400 font-bold">{dept.count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-navy-950 overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-brand-500 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Priority & Severity Distribution */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Priority & Urgency Distribution</span>
                <ShieldCheck className="w-4 h-4 text-rose-400" />
              </h3>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((pLevel) => {
                  const count = kpis.byPriority.find((p) => p.priority === pLevel)?.count || 0;
                  return (
                    <div
                      key={pLevel}
                      className={`p-4 rounded-xl border flex flex-col justify-between ${
                        pLevel === 'CRITICAL'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          : pLevel === 'HIGH'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          : pLevel === 'MEDIUM'
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                          : 'bg-slate-500/10 border-slate-500/30 text-slate-300'
                      }`}
                    >
                      <span className="text-xs font-extrabold">{pLevel}</span>
                      <span className="text-2xl font-black mt-2">{count}</span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Quick Recent Overview Table */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Recent City Work Orders</h3>
              <button
                onClick={() => setActiveTab('ALL_COMPLAINTS')}
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
              >
                View full queue <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-white/10 pb-2">
                    <th className="pb-3 font-semibold">ID</th>
                    <th className="pb-3 font-semibold">Title & Category</th>
                    <th className="pb-3 font-semibold">Priority</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">SLA Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentComplaints.slice(0, 5).map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 font-mono font-bold text-brand-300">#{c.complaintNumber}</td>
                      <td className="py-3 max-w-xs">
                        <div className="font-semibold text-white truncate">{c.title}</div>
                        <div className="text-[11px] text-slate-400 truncate">{c.category?.name}</div>
                      </td>
                      <td className="py-3"><PriorityBadge priority={c.priority} /></td>
                      <td className="py-3"><StatusBadge status={c.status} /></td>
                      <td className="py-3"><SLATimerBadge slaInfo={c.slaInfo} /></td>
                      <td className="py-3 text-right">
                        <Link
                          to={`/complaints/${c.id}`}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-brand-500/20 text-brand-300 font-semibold"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ALL COMPLAINTS TAB */}
      {activeTab === 'ALL_COMPLAINTS' && (
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Full City Complaint Registry</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 pb-2">
                  <th className="pb-3 font-semibold">ID</th>
                  <th className="pb-3 font-semibold">Title</th>
                  <th className="pb-3 font-semibold">Department</th>
                  <th className="pb-3 font-semibold">Reported Date</th>
                  <th className="pb-3 font-semibold">Priority</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-mono font-bold text-brand-300">#{c.complaintNumber}</td>
                    <td className="py-3 font-semibold text-white max-w-sm truncate">{c.title}</td>
                    <td className="py-3 text-slate-300">{c.department?.name}</td>
                    <td className="py-3 text-slate-400 font-mono">{formatDate(c.createdAt)}</td>
                    <td className="py-3"><PriorityBadge priority={c.priority} /></td>
                    <td className="py-3"><StatusBadge status={c.status} /></td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/complaints/${c.id}`}
                        className="px-2.5 py-1 rounded bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 font-semibold"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'AUDIT_LOGS' && (
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-400" />
              Live Immutable Audit Event Log
            </h3>
            <span className="text-[11px] text-slate-400">SOC2 & Compliance Tracking</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 pb-2">
                  <th className="pb-3 font-semibold">Timestamp</th>
                  <th className="pb-3 font-semibold">Action</th>
                  <th className="pb-3 font-semibold">Entity</th>
                  <th className="pb-3 font-semibold">Initiated By</th>
                  <th className="pb-3 font-semibold">IP Address</th>
                  <th className="pb-3 font-semibold">Payload Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 text-slate-400">{formatDate(log.createdAt)}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-300">{log.entity}</td>
                    <td className="py-2.5 text-white font-sans font-medium">
                      {log.user?.name || 'System / Anonymous'} ({log.user?.role || 'SYS'})
                    </td>
                    <td className="py-2.5 text-slate-400">{log.ipAddress || '127.0.0.1'}</td>
                    <td className="py-2.5 text-slate-400 max-w-xs truncate">{log.details || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
