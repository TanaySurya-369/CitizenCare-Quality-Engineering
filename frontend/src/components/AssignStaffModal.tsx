import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { X, UserPlus, Shield, Check } from 'lucide-react';
import api from '../services/api';

interface AssignStaffModalProps {
  complaintId: string;
  complaintNumber: string;
  departmentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssignStaffModal: React.FC<AssignStaffModalProps> = ({
  complaintId,
  complaintNumber,
  departmentId,
  onClose,
  onSuccess,
}) => {
  const [staffList, setStaffList] = useState<User[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingStaff, setFetchingStaff] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setFetchingStaff(true);
        const res = await api.get(`/admin/staff?departmentId=${departmentId}`);
        if (res.data.success) {
          const list: User[] = res.data.data.staff;
          setStaffList(list);
          if (list.length > 0) {
            setSelectedStaffId(list[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load department staff', err);
      } finally {
        setFetchingStaff(false);
      }
    };

    fetchStaff();
  }, [departmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) return;

    setLoading(true);
    setError(null);

    try {
      await api.patch(`/complaints/${complaintId}/assign`, {
        staffId: selectedStaffId,
        notes: notes.trim() || undefined,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to assign staff.');
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
          <div className="inline-flex p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 mb-3 border border-indigo-500/30">
            <UserPlus className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Assign Technician: #{complaintNumber}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select a qualified municipal officer or field technician.
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
              Available Department Personnel
            </label>

            {fetchingStaff ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading staff directory...</div>
            ) : staffList.length === 0 ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                No active staff found in this specific department. All available technicians will be shown.
              </div>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {staffList.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStaffId(st.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedStaffId === st.id
                        ? 'bg-brand-500/20 border-brand-400 text-white shadow-glow-teal'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{st.name}</p>
                      <p className="text-[10px] text-slate-400">{st.email} • {st.phone || 'No phone'}</p>
                    </div>
                    {selectedStaffId === st.id && (
                      <div className="w-5 h-5 rounded-full bg-brand-400 text-navy-950 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Internal Triage / Dispatch Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Priority asphalt patch needed before morning commute..."
              className="w-full bg-navy-950/80 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 resize-none"
            />
          </div>

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
              disabled={loading || !selectedStaffId}
              className="w-1/2 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-navy-950 text-xs font-bold shadow-glow-teal transition-all disabled:opacity-50"
            >
              {loading ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
