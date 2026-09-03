import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import {
  Building2,
  Bell,
  CheckCheck,
  PlusCircle,
  LayoutDashboard,
  ShieldCheck,
  Briefcase,
  LogOut,
  User,
  FlaskConical,
  Menu,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';
import { formatShortDate } from '../utils/formatters';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } =
    useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000); // 15s poll
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotifications]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'STAFF') return '/staff';
    return '/citizen';
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0b132b]/80 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 p-0.5 shadow-glow-teal transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-brand-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                  Citizen<span className="text-brand-400">Care</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded uppercase tracking-wider">
                  Civic AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Smart Public Service Resolution
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-brand-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Overview
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to={getDashboardPath()}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/citizen') ||
                    location.pathname.startsWith('/staff') ||
                    location.pathname.startsWith('/admin')
                      ? 'text-brand-400 bg-brand-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                {user?.role === 'CITIZEN' && (
                  <Link
                    to="/complaints/new"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium bg-brand-500 text-navy-950 font-semibold hover:bg-brand-400 transition-all shadow-glow-teal"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Report Issue
                  </Link>
                )}
              </>
            )}

            {/* QA Automation Console Link */}
            <Link
              to="/qa-portal"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
                location.pathname === '/qa-portal'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-lg'
                  : 'bg-purple-500/10 text-purple-300/80 border-purple-500/20 hover:bg-purple-500/20 hover:text-purple-200'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
              QE Automation Hub
            </Link>
          </nav>

          {/* Right Actions: Notifications & User Profile */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* In-App Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-lg animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-panel p-4 shadow-2xl z-50 border border-white/15 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm text-white">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 text-xs bg-brand-500/20 text-brand-300 rounded-full font-medium">
                              {unreadCount} unread
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-medium"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="mt-2 max-h-80 overflow-y-auto space-y-2 pr-1">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-6">
                            No notifications yet
                          </p>
                        ) : (
                          notifications.slice(0, 10).map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                markAsRead(n.id);
                                if (n.complaintId) {
                                  navigate(`/complaints/${n.complaintId}`);
                                  setShowNotifications(false);
                                }
                              }}
                              className={`p-3 rounded-xl cursor-pointer text-left transition-colors text-xs ${
                                !n.isRead
                                  ? 'bg-brand-500/10 border border-brand-500/20 hover:bg-brand-500/15'
                                  : 'bg-white/5 hover:bg-white/10 border border-transparent'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-slate-200">{n.title}</span>
                                <span className="text-[10px] text-slate-400">
                                  {formatShortDate(n.createdAt)}
                                </span>
                              </div>
                              <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">
                                {n.message}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Capsule */}
                <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-white leading-none">{user?.name}</p>
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          user?.role === 'ADMIN'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : user?.role === 'STAFF'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                        }`}
                      >
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-brand-500 text-navy-950 hover:bg-brand-400 rounded-xl transition-all shadow-glow-teal"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-navy-950 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 text-sm font-medium"
          >
            Overview
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-brand-400 text-sm font-medium"
              >
                Dashboard ({user?.role})
              </Link>
              {user?.role === 'CITIZEN' && (
                <Link
                  to="/complaints/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-brand-300 text-sm font-medium"
                >
                  Report an Issue
                </Link>
              )}
              <Link
                to="/qa-portal"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-purple-300 text-sm font-medium"
              >
                QE Automation Hub
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2 text-rose-400 text-sm font-medium"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-medium bg-white/5 rounded-xl text-slate-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold bg-brand-500 text-navy-950 rounded-xl"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
