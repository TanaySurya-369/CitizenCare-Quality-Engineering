import React from 'react';
import { Building2, ShieldCheck, Code2, Cpu, Globe, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#080d1e] text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-brand-400" />
              </div>
              <span className="font-bold text-lg text-white">Citizen<span className="text-brand-400">Care</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Next-generation municipal civic complaint resolution and automated quality engineering showcase platform.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Municipal Services Online
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Platform Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-brand-400 transition-colors">Citizen Self-Service</Link></li>
              <li><Link to="/login" className="hover:text-brand-400 transition-colors">Municipal Staff Queue</Link></li>
              <li><Link to="/login" className="hover:text-brand-400 transition-colors">City Admin Command Center</Link></li>
              <li><Link to="/qa-portal" className="hover:text-brand-400 transition-colors">QE Automation Dashboard</Link></li>
            </ul>
          </div>

          {/* Civic Services */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Civic Departments</h4>
            <ul className="space-y-2 text-xs">
              <li>Roads & Asphalt Resurfacing (48h SLA)</li>
              <li>Power & Street Illumination (72h SLA)</li>
              <li>Sanitation & Solid Waste (48h SLA)</li>
              <li>Water Supply & Sewage (24h SLA)</li>
              <li>Parks & Urban Greenery (7d SLA)</li>
            </ul>
          </div>

          {/* QE & Tech Stack */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Architecture & QE</h4>
            <div className="flex flex-wrap gap-1.5">
              {['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma', 'Selenium POM', 'SuperTest', 'Mocha / Chai', 'Jenkins CI/CD', 'Docker', 'AWS Cloud'].map((tech) => (
                <span key={tech} className="px-2 py-0.5 text-[11px] rounded bg-white/5 border border-white/10 text-slate-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CitizenCare. Designed for Enterprise Full-Stack & Quality Engineering Excellence.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-brand-400" /> ISO 27001 & SOC2 Architecture</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 100% Automated QA Coverage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
