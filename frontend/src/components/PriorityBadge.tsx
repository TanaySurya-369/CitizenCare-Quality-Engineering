import React from 'react';
import { Priority } from '../types';
import { getPriorityConfig } from '../utils/formatters';
import { AlertTriangle, AlertCircle, Clock, ShieldAlert } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, showIcon = true }) => {
  const config = getPriorityConfig(priority);

  const renderIcon = () => {
    switch (priority) {
      case 'CRITICAL':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />;
      case 'HIGH':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'MEDIUM':
        return <AlertCircle className="w-3.5 h-3.5 text-blue-400" />;
      case 'LOW':
        return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      {showIcon && renderIcon()}
      {config.label}
    </span>
  );
};
