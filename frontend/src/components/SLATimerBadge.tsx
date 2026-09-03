import React from 'react';
import { SLAInfo } from '../types';
import { Clock, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface SLATimerBadgeProps {
  slaInfo?: SLAInfo;
  className?: string;
}

export const SLATimerBadge: React.FC<SLATimerBadgeProps> = ({ slaInfo, className = '' }) => {
  if (!slaInfo) return null;

  switch (slaInfo.state) {
    case 'BREACHED':
      return (
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 text-xs font-semibold animate-pulse shadow-glow-rose ${className}`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>{slaInfo.label}</span>
        </div>
      );

    case 'AT_RISK':
      return (
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-medium ${className}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>{slaInfo.label}</span>
        </div>
      );

    case 'ON_TRACK':
      return (
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-medium ${className}`}
        >
          <Clock className="w-3.5 h-3.5 text-teal-400" />
          <span>{slaInfo.label}</span>
        </div>
      );

    case 'RESOLVED_ON_TIME':
      return (
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{slaInfo.label}</span>
        </div>
      );

    case 'RESOLVED_LATE':
      return (
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-medium ${className}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>{slaInfo.label}</span>
        </div>
      );

    default:
      return null;
  }
};
