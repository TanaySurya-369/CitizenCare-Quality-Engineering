import React from 'react';
import { ComplaintStatus, ComplaintStatusHistory } from '../types';
import { formatDate } from '../utils/formatters';
import { CheckCircle2, Circle, Clock, AlertOctagon, UserCheck, Wrench, ThumbsUp, Send } from 'lucide-react';

interface ComplaintTimelineProps {
  currentStatus: ComplaintStatus;
  history: ComplaintStatusHistory[];
}

const LIFECYCLE_STAGES: Array<{ status: ComplaintStatus; label: string; icon: any }> = [
  { status: 'SUBMITTED', label: 'Complaint Registered', icon: Send },
  { status: 'ACKNOWLEDGED', label: 'Acknowledged', icon: Clock },
  { status: 'ASSIGNED', label: 'Staff Assigned', icon: UserCheck },
  { status: 'IN_PROGRESS', label: 'Investigation & Work', icon: Wrench },
  { status: 'RESOLVED', label: 'Work Completed', icon: CheckCircle2 },
  { status: 'CLOSED', label: 'Citizen Feedback & Closed', icon: ThumbsUp },
];

export const ComplaintTimeline: React.FC<ComplaintTimelineProps> = ({ currentStatus, history }) => {
  const isRejected = currentStatus === 'REJECTED';

  const getStageIndex = (status: ComplaintStatus) => {
    return LIFECYCLE_STAGES.findIndex((s) => s.status === status);
  };

  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="space-y-6">
      {/* Visual Stepper Bar */}
      {!isRejected ? (
        <div className="relative flex items-center justify-between pb-6 pt-2 overflow-x-auto">
          {/* Connector Track */}
          <div className="absolute top-7 left-6 right-6 h-0.5 bg-white/10 -z-0" />
          <div
            className="absolute top-7 left-6 h-0.5 bg-gradient-to-r from-brand-500 to-cyan-400 transition-all duration-500 -z-0"
            style={{
              width: `${(Math.max(0, currentIndex) / (LIFECYCLE_STAGES.length - 1)) * 90}%`,
            }}
          />

          {LIFECYCLE_STAGES.map((stage, idx) => {
            const isCompleted = currentIndex >= idx;
            const isCurrent = currentStatus === stage.status;
            const Icon = stage.icon;

            return (
              <div key={stage.status} className="flex flex-col items-center group relative min-w-[70px] z-10">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isCurrent
                      ? 'bg-brand-500 text-navy-950 shadow-glow-teal ring-4 ring-brand-500/20 scale-110'
                      : isCompleted
                      ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40'
                      : 'bg-navy-900 text-slate-500 border border-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[11px] mt-2 text-center font-medium max-w-[80px] leading-tight ${
                    isCurrent
                      ? 'text-brand-300 font-bold'
                      : isCompleted
                      ? 'text-slate-200'
                      : 'text-slate-500'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-3">
          <AlertOctagon className="w-6 h-6 text-rose-400 shrink-0" />
          <div>
            <p className="font-semibold text-sm text-rose-300">Complaint Rejected</p>
            <p className="text-xs text-slate-300">
              This request was reviewed and closed as rejected by the municipal department.
            </p>
          </div>
        </div>
      )}

      {/* Detailed Status Mutation History Stream */}
      <div className="mt-6 space-y-4">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Resolution Audit Trail ({history.length} events)
        </h4>

        <div className="relative border-l border-white/10 ml-3 space-y-6 pl-6">
          {history.map((event, idx) => (
            <div key={event.id || idx} className="relative group">
              {/* Bullet Node */}
              <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-brand-500/20 border-2 border-brand-400 shadow-glow-teal" />

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 transition-colors hover:bg-white/[0.07]">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">
                      Status changed to <span className="text-brand-300">{event.newStatus}</span>
                    </span>
                    {event.oldStatus && (
                      <span className="text-[10px] text-slate-400">
                        (from {event.oldStatus})
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formatDate(event.createdAt)}
                  </span>
                </div>

                {event.remarks && (
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-black/20 p-2.5 rounded-lg border border-white/5">
                    "{event.remarks}"
                  </p>
                )}

                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                  <span>Logged by:</span>
                  <span className="text-slate-200 font-medium">{event.changedBy?.name || 'System'}</span>
                  {event.changedBy?.role && (
                    <span className="px-1.5 py-0.2 text-[9px] bg-white/10 rounded font-semibold text-slate-300">
                      {event.changedBy.role}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
