import React, { useState } from 'react';
import { Star, X, CheckCircle2, MessageSquare } from 'lucide-react';
import api from '../services/api';
import confetti from 'canvas-confetti';

interface FeedbackRatingModalProps {
  complaintId: string;
  complaintNumber: string;
  title: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const FeedbackRatingModal: React.FC<FeedbackRatingModalProps> = ({
  complaintId,
  complaintNumber,
  title,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [confirmed, setConfirmed] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post(`/complaints/${complaintId}/feedback`, {
        rating,
        comment: comment.trim() || undefined,
        resolutionConfirmed: confirmed,
      });

      if (rating >= 4) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit feedback rating.');
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

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center mx-auto mb-3 text-brand-400 shadow-glow-teal">
            <Star className="w-6 h-6 fill-brand-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Rate Resolution Quality</h3>
          <p className="text-xs text-slate-300 mt-1">
            Complaint #{complaintNumber} • <span className="text-slate-400 font-normal truncate">{title}</span>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star Rating Selectors */}
          <div className="flex flex-col items-center gap-2 py-3 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-amber-300">
              {rating === 5 && '★★★★★ Outstanding Resolution'}
              {rating === 4 && '★★★★☆ Very Good Service'}
              {rating === 3 && '★★★☆☆ Satisfactory'}
              {rating === 2 && '★★☆☆☆ Needs Improvement'}
              {rating === 1 && '★☆☆☆☆ Unsatisfactory'}
            </span>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-brand-400" />
              Citizen Feedback / Comments (Optional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g., The road was patched swiftly and cleanly before morning peak traffic..."
              className="w-full bg-navy-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 resize-none"
            />
          </div>

          {/* Resolution Confirmation Checkbox */}
          <label className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-brand-500 focus:ring-0 border-white/20 bg-navy-950"
            />
            <span className="text-xs text-slate-300 leading-snug">
              I verify that the public service problem has been investigated and resolved on-site to my satisfaction.
            </span>
          </label>

          {/* Actions */}
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
              className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 text-navy-950 text-xs font-bold shadow-glow-teal hover:opacity-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
