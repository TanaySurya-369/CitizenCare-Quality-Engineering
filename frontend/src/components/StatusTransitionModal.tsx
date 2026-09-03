import React, { useState } from 'react';
import { ComplaintStatus } from '../types';
import { X, Wrench, CheckCircle2, XCircle, ArrowRightCircle } from 'lucide-react';
import api from '../services/api';

interface StatusTransitionModalProps {
  complaintId: string;
  complaintNumber: string;
  currentStatus: ComplaintStatus;
  onClose: () => void;
  onSuccess: () => void;
}

export const StatusTransitionModal: React.FC<StatusTransitionModalProps> = ({
  complaintId,
  complaintNumber,
  currentStatus,
  onClose,
  onSuccess,
}) => {
  // Determine allowed next statuses
  const getNextOptions = (): ComplaintStatus[] => {
    switch (currentStatus) {
      case 'SUBMITTED':
        return ['ACKNOWLEDGED', 'ASSIGNED', 'REJECTED'];
      case 'ACKNOWLEDGED':
        return ['ASSIGNED', 'IN_PROGRESS', 'REJECTED'];
      case 'ASSIGNED':
        return ['IN_PROGRESS', 'RESOLVED', 'REJECTED'];
      case 'IN_PROGRESS':
        return ['RESOLVED', 'REJECTED'];
      case 'RESOLVED':
        return ['CLOSED'];
      default:
        return [];
    }
  };

  const options = getNextOptions();
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>(options[0] || 'IN_PROGRESS');
  const [remarks, setRemarks] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.patch(`/complaints/${complaintId}/status`, {
        status: selectedStatus,
        remarks: remarks.trim() || undefined,
        rejectionReason: selectedStatus === 'REJECTED' ? rejectionReason.trim() : undefined,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update complaint status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel p-6 shadow-2xl border border-white/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-left mb-6">
          <div className="inline-flex p-2.5 rounded-xl bg-brand-500/20 text-brand-400 mb-3 border border-brand-500/30">
            <ArrowRightCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Update Status: #{complaintNumber}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Current Status: <span className="font-semibold text-brand-300">{currentStatus}</span>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Target Workflow Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedStatus(opt)}
                  className={`p-3 rounded-xl text-left border text-xs font-medium transition-all ${
                    selectedStatus === opt
                      ? 'bg-brand-500/20 border-brand-400 text-brand-300 shadow-glow-teal'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="font-bold">{opt}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {opt === 'IN_PROGRESS' && 'Field crew on site'}
                    {opt === 'RESOLVED' && 'Repair completed'}
                    {opt === 'REJECTED' && 'Out of municipal scope'}
                    {opt === 'CLOSED' && 'Final closure'}
                    {opt === 'ASSIGNED' && 'Queue assigned'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Investigation / Work Remarks
            </label>
            <textarea
              rows={3}
              required
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g., Replacement LED luminaires installed and circuit test verified..."
              className="w-full bg-navy-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 resize-none"
            />
          </div>

          {selectedStatus === 'REJECTED' && (
            <div>
              <label className="block text-xs font-semibold text-rose-300 mb-1">
                Reason for Rejection
              </label>
              <textarea
                rows={2}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="State the official municipal reason why this request cannot be processed..."
                className="w-full bg-navy-950/80 border border-rose-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 resize-none"
              />
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-navy-950 text-xs font-bold shadow-glow-teal transition-all disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Confirm Transition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
