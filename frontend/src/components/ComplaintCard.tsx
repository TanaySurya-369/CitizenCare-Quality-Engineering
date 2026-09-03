import React from 'react';
import { Complaint } from '../types';
import { GlassCard } from './GlassCard';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { SLATimerBadge } from './SLATimerBadge';
import { MapPin, Calendar, User, ArrowUpRight, Star, Paperclip } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import { Link } from 'react-router-dom';

interface ComplaintCardProps {
  complaint: Complaint;
  onAction?: () => void;
  onRate?: () => void;
  userRole?: string;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  onAction,
  onRate,
  userRole = 'CITIZEN',
}) => {
  const hasFeedback = !!complaint.feedback;
  const isResolvedOrClosed = complaint.status === 'RESOLVED' || complaint.status === 'CLOSED';

  return (
    <GlassCard className="flex flex-col justify-between border-white/10 hover:border-brand-500/30">
      <div>
        {/* Top Header: ID, Category, Priority */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-white/10 text-brand-300 border border-white/10">
              #{complaint.complaintNumber}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 truncate max-w-[150px]">
              {complaint.category?.name || 'Civic'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        {/* Title & Description */}
        <Link to={`/complaints/${complaint.id}`} className="group block">
          <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-1">
            {complaint.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {complaint.description}
          </p>
        </Link>

        {/* Location & Metadata */}
        <div className="mt-4 pt-3 border-t border-white/10 space-y-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{complaint.location}</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Reported: {formatDate(complaint.createdAt)}</span>
            </div>

            {complaint.attachments && complaint.attachments.length > 0 && (
              <span className="flex items-center gap-1 text-slate-400">
                <Paperclip className="w-3 h-3 text-brand-400" />
                {complaint.attachments.length} attachment(s)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer / SLA & Actions */}
      <div className="mt-5 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        {/* SLA Status Indicator */}
        <div>
          <SLATimerBadge slaInfo={complaint.slaInfo} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {userRole === 'CITIZEN' && isResolvedOrClosed && !hasFeedback && onRate && (
            <button
              onClick={onRate}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 flex items-center gap-1 transition-all"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400" /> Rate Service
            </button>
          )}

          {hasFeedback && (
            <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{complaint.feedback?.rating}.0</span>
            </div>
          )}

          <Link
            to={`/complaints/${complaint.id}`}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30 transition-all"
          >
            View Tracker <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </GlassCard>
  );
};
