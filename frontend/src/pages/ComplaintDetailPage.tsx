import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Complaint, Attachment } from '../types';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { SLATimerBadge } from '../components/SLATimerBadge';
import { ComplaintTimeline } from '../components/ComplaintTimeline';
import { EvidenceModalViewer } from '../components/EvidenceModalViewer';
import { FeedbackRatingModal } from '../components/FeedbackRatingModal';
import { StatusTransitionModal } from '../components/StatusTransitionModal';
import { AssignStaffModal } from '../components/AssignStaffModal';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Building,
  User,
  Star,
  Paperclip,
  Share2,
  Wrench,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { formatDate } from '../utils/formatters';
import api from '../services/api';

export const ComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isNew = searchParams.get('created') === 'true';

  const { user } = useAuthStore();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/complaints/${id}`);
      if (res.data.success) {
        setComplaint(res.data.data.complaint);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load complaint details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-sm text-slate-400 animate-pulse">
        Loading complaint tracking data...
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm">
          {error || 'Complaint not found.'}
        </div>
        <Link to="/" className="inline-block text-brand-400 text-xs font-semibold hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  const isStaffOrAdmin = user?.role === 'STAFF' || user?.role === 'ADMIN';
  const isCitizenOwner = user?.role === 'CITIZEN' && user.id === complaint.citizenId;
  const canRate = (complaint.status === 'RESOLVED' || complaint.status === 'CLOSED') && !complaint.feedback && isCitizenOwner;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner if Just Created */}
      {isNew && (
        <div className="p-4 rounded-2xl bg-brand-500/20 border border-brand-400 text-white flex items-center justify-between shadow-glow-teal animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand-300 shrink-0" />
            <div>
              <p className="text-xs font-bold text-brand-200">Complaint Successfully Registered!</p>
              <p className="text-[11px] text-slate-300">
                Your municipal ticket #{complaint.complaintNumber} is now live and monitored under the {complaint.category.slaHours}h SLA.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <Link
          to={user?.role === 'ADMIN' ? '/admin' : user?.role === 'STAFF' ? '/staff' : '/citizen'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Staff & Admin Action Buttons */}
        <div className="flex items-center gap-2">
          {isStaffOrAdmin && (
            <>
              <button
                onClick={() => setShowAssignModal(true)}
                id="assign-staff-btn"
                className="px-3.5 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <UserPlus className="w-4 h-4" /> Reassign Technician
              </button>

              <button
                onClick={() => setShowStatusModal(true)}
                id="update-status-btn"
                className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-navy-950 text-xs font-bold shadow-glow-teal flex items-center gap-1.5 transition-all"
              >
                <Wrench className="w-4 h-4" /> Update Status
              </button>
            </>
          )}

          {canRate && (
            <button
              onClick={() => setShowRatingModal(true)}
              id="rate-service-btn"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all"
            >
              <Star className="w-4 h-4 fill-navy-950" /> Rate Resolution Experience
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Details + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Evidence (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-extrabold px-3 py-1 rounded-lg bg-white/10 text-brand-300 border border-white/15">
                  #{complaint.complaintNumber}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{complaint.department?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={complaint.priority} />
                <StatusBadge status={complaint.status} size="lg" />
              </div>
            </div>

            <h2 className="text-xl font-extrabold text-white leading-snug">{complaint.title}</h2>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-navy-950/60 p-4 rounded-xl border border-white/5">
              {complaint.description}
            </p>

            {/* Location & Map Landmark */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
              <MapPin className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-white">{complaint.location}</p>
                {complaint.latitude && complaint.longitude && (
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    GPS Coordinates: {complaint.latitude.toFixed(4)}, {complaint.longitude.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Evidence Attachments Card */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-brand-400" />
              Attached Evidence ({complaint.attachments?.length || 0})
            </h3>

            {!complaint.attachments || complaint.attachments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No photographic or document evidence was attached.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {complaint.attachments.map((att) => {
                  const isImg = att.mimeType.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(att.fileName);
                  return (
                    <div
                      key={att.id}
                      onClick={() => setSelectedAttachment(att)}
                      className="group relative cursor-pointer rounded-xl overflow-hidden bg-navy-950 border border-white/10 p-2 text-center hover:border-brand-400 transition-colors"
                    >
                      {isImg ? (
                        <div className="relative h-24 w-full overflow-hidden rounded-lg mb-1.5">
                          <img
                            src={att.fileUrl}
                            alt={att.originalName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1515260268569-9271009adfdb?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="h-24 w-full rounded-lg bg-white/5 flex items-center justify-center text-brand-400 mb-1.5">
                          <Paperclip className="w-8 h-8" />
                        </div>
                      )}
                      <p className="text-[10px] text-slate-300 truncate">{att.originalName}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>

          {/* Citizen Feedback Card if available */}
          {complaint.feedback && (
            <GlassCard className="p-6 space-y-3 border-amber-500/30 bg-amber-500/[0.04]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  Citizen Resolution Review
                </h3>
                <div className="flex text-amber-400">
                  {[...Array(complaint.feedback.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
              </div>
              {complaint.feedback.comment && (
                <p className="text-xs text-slate-200 italic bg-navy-950/60 p-3 rounded-xl border border-white/5">
                  "{complaint.feedback.comment}"
                </p>
              )}
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>Verified by Citizen: {complaint.citizen?.name}</span>
                <span>Submitted: {formatDate(complaint.feedback.createdAt)}</span>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right Column: SLA & Visual Workflow Timeline (1 Col) */}
        <div className="space-y-6">
          {/* SLA Performance Card */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-400" /> SLA Deadline Target
            </h3>

            <div className="space-y-3">
              <div>
                <SLATimerBadge slaInfo={complaint.slaInfo} />
              </div>

              <div className="text-xs space-y-1.5 pt-2 border-t border-white/10 text-slate-400">
                <div className="flex justify-between">
                  <span>Category Target:</span>
                  <span className="text-white font-semibold">{complaint.category.slaHours} Hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Expected Deadline:</span>
                  <span className="text-white font-mono">{formatDate(complaint.expectedResolutionDate)}</span>
                </div>
                {complaint.resolvedDate && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Resolved Date:</span>
                    <span className="font-mono">{formatDate(complaint.resolvedDate)}</span>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Assigned Technician Card */}
          <GlassCard className="p-6 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-brand-400" /> Assigned Municipal Technician
            </h3>

            {complaint.assignedStaff ? (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 text-xs">
                <p className="font-bold text-white">{complaint.assignedStaff.name}</p>
                <p className="text-slate-400">{complaint.assignedStaff.email}</p>
                {complaint.assignedStaff.phone && (
                  <p className="text-brand-300 font-mono">{complaint.assignedStaff.phone}</p>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                Pending staff assignment in {complaint.department?.name} queue.
              </div>
            )}
          </GlassCard>

          {/* Progress Timeline Tracker */}
          <GlassCard className="p-6 space-y-4">
            <ComplaintTimeline
              currentStatus={complaint.status}
              history={complaint.statusHistory || []}
            />
          </GlassCard>
        </div>
      </div>

      {/* Modals */}
      {selectedAttachment && (
        <EvidenceModalViewer
          attachment={selectedAttachment}
          onClose={() => setSelectedAttachment(null)}
        />
      )}

      {showRatingModal && (
        <FeedbackRatingModal
          complaintId={complaint.id}
          complaintNumber={complaint.complaintNumber}
          title={complaint.title}
          onClose={() => setShowRatingModal(false)}
          onSuccess={() => {
            setShowRatingModal(false);
            fetchComplaint();
          }}
        />
      )}

      {showStatusModal && (
        <StatusTransitionModal
          complaintId={complaint.id}
          complaintNumber={complaint.complaintNumber}
          currentStatus={complaint.status}
          onClose={() => setShowStatusModal(false)}
          onSuccess={() => {
            setShowStatusModal(false);
            fetchComplaint();
          }}
        />
      )}

      {showAssignModal && (
        <AssignStaffModal
          complaintId={complaint.id}
          complaintNumber={complaint.complaintNumber}
          departmentId={complaint.departmentId}
          onClose={() => setShowAssignModal(false)}
          onSuccess={() => {
            setShowAssignModal(false);
            fetchComplaint();
          }}
        />
      )}
    </div>
  );
};
