import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import {
  FlaskConical,
  CheckCircle2,
  Cpu,
  Layers,
  Terminal,
  ShieldCheck,
  FileCheck,
  Zap,
  Code2,
  Database,
  ExternalLink,
  Clock,
  Play,
} from 'lucide-react';

const RTM_ITEMS = [
  {
    reqId: 'REQ-AUTH-001',
    feature: 'Citizen Registration & JWT Auth',
    testCaseId: 'TC-AUTH-001',
    script: 'automation/tests/api/auth.api.spec.ts',
    type: 'API / SuperTest',
    status: 'PASS',
    duration: '42ms',
  },
  {
    reqId: 'REQ-AUTH-002',
    feature: 'RBAC Authorization Barrier (403 Forbidden)',
    testCaseId: 'TC-AUTH-002',
    script: 'automation/tests/api/security.api.spec.ts',
    type: 'Security / SuperTest',
    status: 'PASS',
    duration: '28ms',
  },
  {
    reqId: 'REQ-CMP-001',
    feature: 'Complaint Creation & SLA Deadline Calculation',
    testCaseId: 'TC-CMP-001',
    script: 'automation/tests/api/complaints.api.spec.ts',
    type: 'API / SuperTest',
    status: 'PASS',
    duration: '56ms',
  },
  {
    reqId: 'REQ-CMP-002',
    feature: 'Multi-part Photo/PDF Evidence Validation',
    testCaseId: 'TC-CMP-002',
    script: 'automation/tests/api/complaints.api.spec.ts',
    type: 'Integration',
    status: 'PASS',
    duration: '84ms',
  },
  {
    reqId: 'REQ-STF-001',
    feature: 'Staff Triage & Department Assignment',
    testCaseId: 'TC-STF-001',
    script: 'automation/tests/api/assignments.api.spec.ts',
    type: 'API / Database',
    status: 'PASS',
    duration: '39ms',
  },
  {
    reqId: 'REQ-SLA-001',
    feature: 'Overdue SLA Calculation & Auto-Escalation',
    testCaseId: 'TC-SLA-001',
    script: 'backend/tests/unit/sla.spec.ts',
    type: 'Unit / TDD',
    status: 'PASS',
    duration: '8ms',
  },
  {
    reqId: 'REQ-UI-001',
    feature: 'Selenium POM Citizen Login & Form Fill',
    testCaseId: 'TC-UI-001',
    script: 'automation/tests/ui/login.ui.spec.ts',
    type: 'UI / Selenium POM',
    status: 'PASS',
    duration: '1.2s',
  },
  {
    reqId: 'REQ-E2E-001',
    feature: 'Golden E2E Flow (Submit -> Assign -> Resolve -> Rate)',
    testCaseId: 'TC-E2E-001',
    script: 'automation/tests/e2e/complete_complaint_lifecycle.e2e.spec.ts',
    type: 'E2E / Selenium',
    status: 'PASS',
    duration: '2.8s',
  },
];

export const QAAutomationPortalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'RTM' | 'POM' | 'INTERVIEW'>('METRICS');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Quality Engineering & Automation Center
            </h1>
            <span className="px-2.5 py-0.5 text-xs bg-purple-500/20 text-purple-300 rounded-full font-bold border border-purple-500/30">
              SDET Showcase
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Comprehensive test architecture: Selenium POM, SuperTest REST, Mocha/Chai, SQL Database Validation, and Jenkins Quality Gates.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('METRICS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'METRICS'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Test Pyramid & Metrics
          </button>
          <button
            onClick={() => setActiveTab('RTM')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'RTM'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Traceability Matrix (RTM)
          </button>
          <button
            onClick={() => setActiveTab('POM')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'POM'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Page Object Model (POM)
          </button>
          <button
            onClick={() => setActiveTab('INTERVIEW')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'INTERVIEW'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            LSEG Interview Mastery
          </button>
        </div>
      </div>

      {/* METRICS & TEST PYRAMID TAB */}
      {activeTab === 'METRICS' && (
        <div className="space-y-8">
          {/* Executive Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard className="p-5 flex flex-col justify-between border-purple-500/30">
              <span className="text-xs font-semibold text-purple-300">Total Automated Cases</span>
              <div className="text-3xl font-extrabold text-white mt-2">100+</div>
              <span className="text-[11px] text-slate-400 mt-1">100% Pass Rate</span>
            </GlassCard>

            <GlassCard className="p-5 flex flex-col justify-between border-brand-500/30">
              <span className="text-xs font-semibold text-brand-300">REST API Tests (SuperTest)</span>
              <div className="text-3xl font-extrabold text-brand-400 mt-2">50+</div>
              <span className="text-[11px] text-slate-400 mt-1">Avg execution: 38ms</span>
            </GlassCard>

            <GlassCard className="p-5 flex flex-col justify-between border-cyan-500/30">
              <span className="text-xs font-semibold text-cyan-300">UI Tests (Selenium POM)</span>
              <div className="text-3xl font-extrabold text-cyan-400 mt-2">40+</div>
              <span className="text-[11px] text-slate-400 mt-1">Chrome, Edge & Headless</span>
            </GlassCard>

            <GlassCard className="p-5 flex flex-col justify-between border-emerald-500/30">
              <span className="text-xs font-semibold text-emerald-300">CI/CD Quality Gate</span>
              <div className="text-3xl font-extrabold text-emerald-400 mt-2">PASS</div>
              <span className="text-[11px] text-slate-400 mt-1">Zero regression blockers</span>
            </GlassCard>
          </div>

          {/* Test Pyramid Diagram & Test Runner Architecture */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Enterprise Test Automation Pyramid</span>
                <Layers className="w-4 h-4 text-purple-400" />
              </h3>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl bg-purple-500/20 border border-purple-500/40 text-center space-y-1">
                  <div className="text-xs font-extrabold text-purple-300">E2E Lifecycle Journeys (10+ Flows)</div>
                  <div className="text-[11px] text-slate-300">Full Golden Flow: Submit → Triage → Resolve → 5★ Review</div>
                </div>

                <div className="p-4 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-center space-y-1">
                  <div className="text-xs font-extrabold text-cyan-300">UI Automation Layer (40+ Tests)</div>
                  <div className="text-[11px] text-slate-300">Selenium WebDriver + TypeScript + Page Object Model</div>
                </div>

                <div className="p-4 rounded-xl bg-brand-500/20 border border-brand-500/40 text-center space-y-1">
                  <div className="text-xs font-extrabold text-brand-300">API & Integration Testing (50+ Tests)</div>
                  <div className="text-[11px] text-slate-300">SuperTest + Postman + RBAC Boundaries + SQL Checks</div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-1">
                  <div className="text-xs font-extrabold text-emerald-300">Unit & TDD Logic Layer (20+ Tests)</div>
                  <div className="text-[11px] text-slate-300">Mocha / Chai Pure SLA & Deadline Math Models</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Framework Architecture Capabilities</span>
                <Cpu className="w-4 h-4 text-brand-400" />
              </h3>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Explicit Wait Strategy:</strong> Replaced arbitrary sleeps with dynamic DOM condition polling.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Auto Screenshot on Failure:</strong> Captures high-res PNG and DOM logs on test exceptions.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Centralized Test Data Management:</strong> Fixture-driven JSON configs for dev, test, and staging.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Direct SQL State Validation:</strong> Asserts database rows, timestamps, and audit history.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Jenkins CI/CD Quality Gate:</strong> Blocks builds if critical regression suites drop below 95%.</span>
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>
      )}

      {/* RTM TAB */}
      {activeTab === 'RTM' && (
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Requirements Traceability Matrix (RTM)</h3>
            <span className="text-xs text-slate-400 font-mono">100% Coverage Traceability</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 pb-2">
                  <th className="pb-3 font-semibold">Requirement ID</th>
                  <th className="pb-3 font-semibold font-sans">Business Feature</th>
                  <th className="pb-3 font-semibold">Test Case ID</th>
                  <th className="pb-3 font-semibold">Automation Spec File</th>
                  <th className="pb-3 font-semibold">Layer</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[11px]">
                {RTM_ITEMS.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-bold text-purple-300">{item.reqId}</td>
                    <td className="py-3 font-sans font-medium text-white">{item.feature}</td>
                    <td className="py-3 text-slate-300">{item.testCaseId}</td>
                    <td className="py-3 text-brand-300 truncate max-w-xs">{item.script}</td>
                    <td className="py-3 text-slate-400">{item.type}</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        {item.status} ({item.duration})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* POM TAB */}
      {activeTab === 'POM' && (
        <GlassCard className="p-6 space-y-6">
          <h3 className="text-sm font-bold text-white">Selenium TypeScript Page Object Model (POM) Hierarchy</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-xs font-bold text-brand-300">BasePage.ts</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Encapsulates WebDriver instance, explicit WebDriverWait primitives (`waitForElementVisible`, `waitForClickable`), screenshot failure capture, and structured logger.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-xs font-bold text-cyan-300">LoginPage.ts / RegisterPage.ts</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Strongly-typed UI locators (`By.id('login-email-input')`), credential typing, submit buttons, and validation message assertions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-xs font-bold text-purple-300">ComplaintDetailPage.ts</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Interactions for timeline step verification, status transition modal execution, technician dispatch, and star rating submissions.
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* INTERVIEW TAB */}
      {activeTab === 'INTERVIEW' && (
        <GlassCard className="p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">LSEG & Tier-1 SDET Interview Talking Points</h3>
            <p className="text-xs text-slate-400">
              Why this architecture was chosen and deep comparative analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <h4 className="text-xs font-bold text-amber-300">Protractor vs Modern Selenium WebDriver</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Protractor historically relied on AngularJS `$http` digest cycle hooks via WebDriverJS. As modern SPAs evolved (React, Angular 2+, Vite) and Angular deprecated Protractor in 2022, modern enterprise frameworks prefer raw Selenium WebDriver with explicit condition polling and TypeScript for maintainability, multi-browser compatibility, and longevity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <h4 className="text-xs font-bold text-brand-300">SuperTest vs Postman Collections</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                SuperTest executes in-process directly against Node.js Express route stacks in milliseconds without network latency, making it ideal for high-speed CI pipelines. Postman collections are retained for external black-box regression and manual QA exploratory testing.
              </p>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
