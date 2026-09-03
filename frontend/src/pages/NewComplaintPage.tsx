import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ComplaintCategory, Priority } from '../types';
import { GlassCard } from '../components/GlassCard';
import { PriorityBadge } from '../components/PriorityBadge';
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  MapPin,
  Clock,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';

export const NewComplaintPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ComplaintCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<number | null>(40.7128);
  const [longitude, setLongitude] = useState<number | null>(-74.006);
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setFetchingCategories(true);
        const res = await api.get('/categories');
        if (res.data.success) {
          const list: ComplaintCategory[] = res.data.data.categories;
          setCategories(list);
          if (list.length > 0) {
            setSelectedCategoryId(list[0].id);
            setPriority(list[0].defaultPriority);
          }
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setFetchingCategories(false);
      }
    };
    fetchCats();
  }, []);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId);
    const cat = categories.find((c) => c.id === catId);
    if (cat) {
      setPriority(cat.defaultPriority);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      const newFiles = [...files, ...selected].slice(0, 5); // Max 5 files
      setFiles(newFiles);

      // Generate preview URLs
      const newPreviews = newFiles.map((file) => {
        if (file.type.startsWith('image/')) {
          return URL.createObjectURL(file);
        }
        return '';
      });
      setPreviews(newPreviews);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId) {
      setError('Please select a complaint category.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('categoryId', selectedCategoryId);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('priority', priority);
      if (latitude !== null) formData.append('latitude', latitude.toString());
      if (longitude !== null) formData.append('longitude', longitude.toString());

      files.forEach((file) => {
        formData.append('attachments', file);
      });

      const res = await api.post('/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        const createdComplaint = res.data.data.complaint;
        navigate(`/complaints/${createdComplaint.id}?created=true`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit complaint. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back link */}
      <Link
        to="/citizen"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Citizen Dashboard
      </Link>

      <div className="text-left space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Report a Civic Problem</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Provide accurate details and evidence to expedite municipal inspection and repair.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selector Grid */}
        <GlassCard className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs flex items-center justify-center font-mono">
              1
            </span>
            Select Issue Category
          </h2>

          {fetchingCategories ? (
            <div className="py-6 text-center text-xs text-slate-400">Loading civic categories...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedCategoryId === cat.id
                      ? 'bg-brand-500/20 border-brand-400 shadow-glow-teal'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{cat.name}</span>
                    <PriorityBadge priority={cat.defaultPriority} showIcon={false} />
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{cat.description}</p>
                  <div className="mt-3 flex items-center gap-1 text-[10px] text-brand-300 font-semibold">
                    <Clock className="w-3 h-3" /> SLA Guarantee: {cat.slaHours} Hours
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Issue Details & Location */}
        <GlassCard className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs flex items-center justify-center font-mono">
              2
            </span>
            Describe Problem & Location
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Complaint Title *
              </label>
              <input
                type="text"
                required
                id="complaint-title-input"
                minLength={5}
                maxLength={150}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Deep pothole causing tire damage near school crossing"
                className="w-full bg-navy-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Detailed Description *
              </label>
              <textarea
                rows={4}
                required
                id="complaint-desc-input"
                minLength={10}
                maxLength={2000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide specific details about the severity, dimensions, hazards, or previous occurrences..."
                className="w-full bg-navy-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> Street Location / Landmark *
              </label>
              <input
                type="text"
                required
                id="complaint-location-input"
                minLength={3}
                maxLength={255}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., 424 Broadway & Grand St Intersection, Manhattan"
                className="w-full bg-navy-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>
        </GlassCard>

        {/* Evidence Uploads */}
        <GlassCard className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs flex items-center justify-center font-mono">
              3
            </span>
            Attach Photo or Document Evidence (Optional, max 5)
          </h2>

          <div className="border-2 border-dashed border-white/15 rounded-2xl p-6 text-center hover:border-brand-500/40 transition-colors bg-white/[0.02]">
            <input
              type="file"
              id="file-upload-input"
              multiple
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-upload-input" className="cursor-pointer flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center shadow-glow-teal">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-white mt-1">Click or drag files to upload</p>
              <p className="text-[11px] text-slate-400">Supported: JPG, PNG, WebP, PDF (Max 5MB each)</p>
            </label>
          </div>

          {/* Uploaded File Previews */}
          {files.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden bg-navy-950 border border-white/10 p-2 text-center"
                >
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-md bg-rose-500 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {previews[idx] ? (
                    <img
                      src={previews[idx]}
                      alt="Preview"
                      className="w-full h-20 object-cover rounded-lg mb-1"
                    />
                  ) : (
                    <div className="w-full h-20 rounded-lg bg-white/5 flex items-center justify-center text-brand-400 mb-1">
                      <FileText className="w-8 h-8" />
                    </div>
                  )}
                  <p className="text-[10px] text-slate-300 truncate">{file.name}</p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/citizen"
            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            id="submit-complaint-btn"
            disabled={loading}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 text-navy-950 font-bold text-xs shadow-glow-teal hover:opacity-95 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? 'Registering Complaint...' : 'Submit Civic Complaint'} <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
