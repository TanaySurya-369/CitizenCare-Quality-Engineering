import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Building2,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Users,
  MapPin,
  TrendingUp,
  FileCheck,
  HelpCircle,
  ChevronDown,
  Star,
  Activity,
  Flame,
  Droplets,
  Lightbulb,
  Trash2,
  Trees,
  Bus,
} from 'lucide-react';
import api from '../services/api';

const CATEGORIES = [
  {
    icon: Flame,
    name: 'Road & Asphalt Damage',
    sla: '48 Hours',
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400',
    desc: 'Deep potholes, broken tarmac, cave-ins, and dangerous curbs.',
  },
  {
    icon: Lightbulb,
    name: 'Power & Streetlights',
    sla: '72 Hours',
    color: 'from-yellow-500/20 to-amber-500/20 text-yellow-400',
    desc: 'Dark road stretches, blinking fixtures, and damaged poles.',
  },
  {
    icon: Trash2,
    name: 'Sanitation & Waste',
    sla: '48 Hours',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400',
    desc: 'Overflowing public bins, missed trash pickups, and illegal dumping.',
  },
  {
    icon: Droplets,
    name: 'Water Supply & Sewage',
    sla: '24 Hours (Critical)',
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400',
    desc: 'Pipeline bursts, water contamination, low pressure, and sewage blockages.',
  },
  {
    icon: Trees,
    name: 'Public Parks & Spaces',
    sla: '7 Days',
    color: 'from-green-500/20 to-emerald-500/20 text-green-400',
    desc: 'Damaged playground fixtures, hazardous branches, and broken benches.',
  },
  {
    icon: Bus,
    name: 'Public Transit & Stops',
    sla: '72 Hours',
    color: 'from-purple-500/20 to-indigo-500/20 text-purple-400',
    desc: 'Damaged bus shelters, timetable signage, and transit accessibility.',
  },
];

const FAQS = [
  {
    q: 'How does the automated SLA monitoring system work?',
    a: 'Each complaint category is bound to a strict Service Level Agreement (24h to 7d). When registered, the system calculates the exact resolution deadline. If unresolved within the target window, the ticket is flagged as Overdue and escalated to department supervisors.',
  },
  {
    q: 'What types of evidence can citizens upload?',
    a: 'Citizens can upload high-resolution JPG, PNG, and PDF documentation up to 5MB. Files are verified for secure MIME headers and scanned before municipal field dispatch.',
  },
  {
    q: 'How are municipal staff assigned to incoming issues?',
    a: 'Complaints are routed to specific municipal departments (Roads, Water, Sanitation, Power). Supervisors and field officers can claim tasks or administrators can auto-dispatch technicians with internal notes.',
  },
  {
    q: 'How do citizens confirm and rate the completed service?',
    a: 'Once a technician marks work as RESOLVED, the citizen receives an instant in-app notification. The citizen inspects the work, provides a 1–5 star rating with comments, and confirms closure.',
  },
];

export const LandingPage: React.FC = () => {
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [quickLoading, setQuickLoading] = useState<string | null>(null);

  const handleQuickLogin = async (email: string, pass: string, targetPath: string) => {
    try {
      setQuickLoading(email);
      const res = await api.post('/auth/login', { email, password: pass });
      if (res.data.success) {
        login(res.data.data.token, res.data.data.user);
        navigate(targetPath);
      }
    } catch (err) {
      console.error('Quick login failed', err);
    } finally {
      setQuickLoading(null);
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-8 backdrop-blur-xl shadow-glow-teal animate-pulse-slow">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Civic Tech 2.0 • Real-Time SLA Resolution Engine</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
            Empowering Citizens. <br />
            <span className="text-gradient">Resolving Civic Issues</span> in Real Time.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Report potholes, water leaks, streetlight failures, and garbage accumulation directly to municipal departments. Track progress live from dispatch to verified resolution.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? '/citizen' : '/register'}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 via-teal-400 to-cyan-400 text-navy-950 font-extrabold text-sm hover:opacity-95 transition-all shadow-glow-teal flex items-center gap-2"
            >
              Report a Civic Problem <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/qa-portal"
              className="px-8 py-4 rounded-xl glass-panel text-white font-semibold text-sm hover:border-purple-500/40 hover:text-purple-300 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" /> QE Automation Architecture
            </Link>
          </div>

          {/* Quick Demo Login Bar for Reviewers & Interviewers */}
          <div className="mt-14 max-w-4xl mx-auto glass-panel p-5 rounded-2xl border-white/10 text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-amber-400" /> Instant 1-Click Interactive Demo Personas
              </span>
              <span className="text-[11px] text-brand-300">Click any role to test live</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleQuickLogin('citizen@citizencare.gov', 'Citizen@123', '/citizen')}
                disabled={!!quickLoading}
                className="p-3 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 text-left transition-all group"
              >
                <div className="text-xs font-bold text-brand-300 group-hover:text-brand-200">👤 Citizen Portal</div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate">John Doe (citizen@citizencare.gov)</div>
              </button>

              <button
                onClick={() => handleQuickLogin('staff.roads@citizencare.gov', 'Staff@123', '/staff')}
                disabled={!!quickLoading}
                className="p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition-all group"
              >
                <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200">👷 Staff (Roads)</div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate">Marcus Chen (Road Crew)</div>
              </button>

              <button
                onClick={() => handleQuickLogin('staff.power@citizencare.gov', 'Staff@123', '/staff')}
                disabled={!!quickLoading}
                className="p-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-left transition-all group"
              >
                <div className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200">⚡ Staff (Power)</div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate">Alex Patel (Illumination)</div>
              </button>

              <button
                onClick={() => handleQuickLogin('admin@citizencare.gov', 'Admin@123', '/admin')}
                disabled={!!quickLoading}
                className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-left transition-all group"
              >
                <div className="text-xs font-bold text-rose-300 group-hover:text-rose-200">👑 City Admin</div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate">Sarah Jenkins (Director)</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE MUNICIPAL METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-6 rounded-2xl text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-white">96.4%</div>
            <div className="text-xs font-semibold text-brand-400 mt-1 uppercase tracking-wider">SLA Compliance</div>
            <p className="text-[11px] text-slate-400 mt-1">Resolved on time</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-white">28.5 hrs</div>
            <div className="text-xs font-semibold text-cyan-400 mt-1 uppercase tracking-wider">Avg Resolution</div>
            <p className="text-[11px] text-slate-400 mt-1">Across all 5 departments</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-1">
              4.9 <Star className="w-5 h-5 text-amber-400 fill-amber-400 inline" />
            </div>
            <div className="text-xs font-semibold text-amber-400 mt-1 uppercase tracking-wider">Citizen Rating</div>
            <p className="text-[11px] text-slate-400 mt-1">Verified resolutions</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl text-center border-purple-500/30">
            <div className="text-3xl sm:text-4xl font-extrabold text-purple-300">100%</div>
            <div className="text-xs font-semibold text-purple-400 mt-1 uppercase tracking-wider">Automated QA</div>
            <p className="text-[11px] text-slate-400 mt-1">Mocha, SuperTest & Selenium</p>
          </div>
        </div>
      </section>

      {/* 3. CIVIC CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Civic Service Categories with Guaranteed SLAs
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Every category has strict municipal response timelines enforced through automated quality triggers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl group hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${cat.color} border border-white/10`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 text-xs font-bold bg-white/10 rounded-full text-slate-300 border border-white/10">
                      SLA: {cat.sla}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{cat.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-brand-400 font-medium">Auto-Dispatched</span>
                  <Link to="/complaints/new" className="text-slate-300 hover:text-white flex items-center gap-1 font-semibold">
                    Report <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. HOW IT WORKS (THE 4-STEP GOLDEN JOURNEY) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 md:p-12 rounded-3xl border-brand-500/20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Transparent Civic Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              From Report to Verified Resolution in 4 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 font-mono font-bold flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="font-bold text-white text-sm">Submit with Evidence</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Capture the problem with photos or PDFs, pinpoint the location, and receive an instant complaint tracking ID.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="font-bold text-white text-sm">Department Triage</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Municipal coordinators review the issue and dispatch certified field technicians with work order notes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="font-bold text-white text-sm">Live SLA Countdown</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Watch the visual progress timeline and remaining SLA hours countdown. Automated alerts trigger if overdue.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center text-sm">
                04
              </div>
              <h3 className="font-bold text-white text-sm">Rate & Close</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive notification of completion, inspect the repair quality, submit 1–5 star feedback, and close the loop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What Citizens & Officials Say</h2>
          <p className="text-sm text-slate-400 mt-2">Real municipal impact across thousands of resolved requests.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "The pothole on 5th Avenue was fixed in under 36 hours. Being able to see the technician assigned and track the SLA gave our community immense peace of mind."
            </p>
            <div className="pt-2 border-t border-white/10">
              <p className="text-xs font-bold text-white">Jonathan Vance</p>
              <p className="text-[10px] text-slate-400">North Ward Resident</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "CitizenCare transformed our department's backlog triage. We eliminated manual routing, lowered our average resolution time to 28 hours, and met our SLA goals."
            </p>
            <div className="pt-2 border-t border-white/10">
              <p className="text-xs font-bold text-white">Elena Rodriguez</p>
              <p className="text-[10px] text-slate-400">Sanitation Supervisor</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "The full test automation suite and real-time audit trail provide bulletproof accountability. It's the most dependable civic platform we have deployed."
            </p>
            <div className="pt-2 border-t border-white/10">
              <p className="text-xs font-bold text-white">David Wallace</p>
              <p className="text-[10px] text-slate-400">City Operations Commissioner</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-400 mt-2">Everything you need to know about the platform and SLA standards.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl overflow-hidden border-white/10 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-white hover:text-brand-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-brand-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel-glow p-10 md:p-14 rounded-3xl text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Experience Next-Gen Civic Resolution?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Create an account in seconds or test using pre-loaded municipal personas.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3.5 bg-brand-500 hover:bg-brand-400 text-navy-950 font-extrabold text-sm rounded-xl shadow-glow-teal transition-all"
              >
                Register Citizen Account
              </Link>
              <Link
                to="/qa-portal"
                className="px-8 py-3.5 glass-panel text-white font-semibold text-sm hover:border-purple-500/40 rounded-xl transition-all"
              >
                View QA Automation Engine
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
