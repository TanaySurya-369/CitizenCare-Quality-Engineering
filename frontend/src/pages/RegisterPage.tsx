import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Building2, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import api from '../services/api';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        phone: phone.trim() || undefined,
        password,
        role: 'CITIZEN',
      });

      if (res.data.success) {
        const { token, user } = res.data.data;
        login(token, user);
        navigate('/citizen');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center mx-auto text-brand-400 shadow-glow-teal">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create Citizen Account</h2>
          <p className="text-xs text-slate-400">Join CitizenCare to report & track municipal services</p>
        </div>

        {/* Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border-white/15 shadow-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-brand-400" /> Full Name
              </label>
              <input
                type="text"
                required
                id="register-name-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Eleanor Shellstrop"
                className="w-full bg-navy-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-brand-400" /> Email Address
              </label>
              <input
                type="email"
                required
                id="register-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@example.com"
                className="w-full bg-navy-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-brand-400" /> Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="register-phone-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-0199"
                className="w-full bg-navy-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-brand-400" /> Password (min 6 characters)
              </label>
              <input
                type="password"
                required
                minLength={6}
                id="register-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-navy-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
              />
            </div>

            <button
              type="submit"
              id="register-submit-btn"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 text-navy-950 font-bold text-xs shadow-glow-teal hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Register as Citizen'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
