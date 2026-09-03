import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Building2, Lock, Mail, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import api from '../services/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token, user } = res.data.data;
        login(token, user);

        if (user.role === 'ADMIN') {
          navigate('/admin');
        } else if (user.role === 'STAFF') {
          navigate('/staff');
        } else {
          navigate('/citizen');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center mx-auto text-brand-400 shadow-glow-teal">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400">Sign in to your municipal CitizenCare portal</p>
        </div>

        {/* Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border-white/15 shadow-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-brand-400" /> Email Address
              </label>
              <input
                type="email"
                required
                id="login-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@citizencare.gov"
                className="w-full bg-navy-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-brand-400" /> Password
              </label>
              <input
                type="password"
                required
                id="login-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-navy-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
              />
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 text-navy-950 font-bold text-xs shadow-glow-teal hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Fill Credentials */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Quick-Fill Demo Roles
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('citizen@citizencare.gov', 'Citizen@123')}
                className="p-2 text-left rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] transition-colors"
              >
                <div className="font-semibold text-brand-300">👤 Citizen</div>
                <div className="text-[9px] text-slate-400">citizen@citizencare.gov</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('staff.roads@citizencare.gov', 'Staff@123')}
                className="p-2 text-left rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] transition-colors"
              >
                <div className="font-semibold text-amber-300">👷 Staff (Roads)</div>
                <div className="text-[9px] text-slate-400">staff.roads@citizencare.gov</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('staff.power@citizencare.gov', 'Staff@123')}
                className="p-2 text-left rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] transition-colors"
              >
                <div className="font-semibold text-cyan-300">⚡ Staff (Power)</div>
                <div className="text-[9px] text-slate-400">staff.power@citizencare.gov</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin@citizencare.gov', 'Admin@123')}
                className="p-2 text-left rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] transition-colors"
              >
                <div className="font-semibold text-rose-300">👑 City Admin</div>
                <div className="text-[9px] text-slate-400">admin@citizencare.gov</div>
              </button>
            </div>
          </div>

          {/* Footer link */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-brand-400 font-semibold hover:underline">
              Create citizen account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
