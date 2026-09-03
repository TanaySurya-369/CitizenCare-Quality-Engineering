import React from 'react';
import { Attachment } from '../types';
import { X, Download, FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface EvidenceModalViewerProps {
  attachment: Attachment | null;
  onClose: () => void;
}

export const EvidenceModalViewer: React.FC<EvidenceModalViewerProps> = ({ attachment, onClose }) => {
  if (!attachment) return null;

  const isPdf = attachment.mimeType === 'application/pdf' || attachment.fileName.endsWith('.pdf');
  const isImage = attachment.mimeType.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(attachment.fileName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl glass-panel p-6 shadow-2xl border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-500/20 text-brand-400">
              {isPdf ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white truncate max-w-md">
                {attachment.originalName || attachment.fileName}
              </h3>
              <p className="text-xs text-slate-400">
                {(attachment.fileSize / (1024 * 1024)).toFixed(2)} MB • {attachment.mimeType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={attachment.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
              title="Open full resolution"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="mt-6 flex items-center justify-center min-h-[300px] max-h-[65vh] overflow-hidden rounded-xl bg-navy-950/80 border border-white/5 p-2">
          {isImage ? (
            <img
              src={attachment.fileUrl}
              alt={attachment.originalName}
              className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-lg"
              onError={(e) => {
                // Fallback for placeholder demonstration
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1515260268569-9271009adfdb?auto=format&fit=crop&w=800&q=80';
              }}
            />
          ) : isPdf ? (
            <div className="text-center p-8 space-y-4">
              <FileText className="w-16 h-16 text-brand-400 mx-auto animate-bounce" />
              <div>
                <p className="font-semibold text-white">PDF Evidence Document</p>
                <p className="text-xs text-slate-400 mt-1">Preview or download the attached municipal documentation.</p>
              </div>
              <a
                href={attachment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-400 text-navy-950 font-bold text-xs rounded-xl shadow-glow-teal transition-all"
              >
                <Download className="w-4 h-4" /> Download / Open PDF
              </a>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">File preview not supported for this format.</p>
          )}
        </div>
      </div>
    </div>
  );
};
