import { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import { getForms } from '../../services/formsService';
import { supabase } from '../../lib/supabase';

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
);

const Sidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [newSubmissionsCount, setNewSubmissionsCount] = useState(0);
  const [forms, setForms] = useState([]);
  const [expandedForms, setExpandedForms] = useState({});

  useEffect(() => {
    let activeFormIds = [];

    const channel = supabase
      .channel('sidebar-new-submissions-badge')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'submissions' },
        (payload) => {
          if (activeFormIds.includes(payload.new.form_id)) {
            setNewSubmissionsCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    const loadActiveForms = async () => {
      try {
        const fetchedForms = await getForms();
        activeFormIds = fetchedForms.map(f => f.id);
        setForms(fetchedForms);
      } catch (err) {
        console.error('Sidebar badge active forms fetch failed:', err);
      }
    };

    loadActiveForms();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
    { name: 'Forms', path: '/dashboard/forms', icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' },
    { name: 'Submissions', path: '/dashboard/submissions', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
    { name: 'API Keys', path: '/dashboard/api-keys', icon: 'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3L15.5 7.5z' },
    { name: 'Team', path: '/dashboard/team', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75' },
    { name: 'Settings', path: '/dashboard/settings', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' }
  ];

  const SidebarContent = ({ onLinkClick }) => (
    <div className="flex flex-col h-full bg-brand-card/40 backdrop-blur-xl border-r border-brand-border/10">
      {/* Brand */}
      <div className="h-24 flex items-center justify-between px-8 border-b border-brand-border/10 shrink-0">
        <Link to="/" onClick={onLinkClick} className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-orange-400">
          Formspark
        </Link>
        <button onClick={onLinkClick} className="lg:hidden p-2.5 text-brand-muted hover:text-brand-text border border-brand-border/20 rounded-xl transition-all">
          <XIcon />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-8 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <div key={item.name}>
            <NavLink
              to={item.path}
              onClick={() => {
                if (item.name === 'Submissions') setNewSubmissionsCount(0);
                if (onLinkClick) onLinkClick();
              }}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3.5 text-sm font-bold transition-all rounded-2xl
                ${isActive
                  ? 'bg-brand-primary/10 text-brand-primary shadow-sm'
                  : 'text-brand-muted hover:text-brand-text hover:bg-brand-text/5'}
              `}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d={item.icon} />
              </svg>
              <span className="flex-1">{item.name}</span>
              {item.name === 'Submissions' && newSubmissionsCount > 0 && (
                <span className="bg-red-500 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shrink-0">
                  {newSubmissionsCount}
                </span>
              )}
            </NavLink>

            {/* Forms Dropdown Logic */}
            {item.name === 'Forms' && forms.length > 0 && (
              <div className="ml-6 pl-4 border-l border-brand-border/10 mt-2 space-y-1.5">
                {forms.map(form => (
                  <div key={form.id} className="flex flex-col">
                    <div
                      className="flex items-center justify-between text-xs font-semibold text-brand-muted hover:text-brand-text py-2.5 cursor-pointer transition-colors"
                      onClick={() => setExpandedForms(prev => ({ ...prev, [form.id]: !prev[form.id] }))}
                    >
                      <span className="truncate pr-2">{form.name}</span>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className={`transform transition-transform ${expandedForms[form.id] ? 'rotate-180' : ''}`}>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                    {expandedForms[form.id] && (
                      <div className="pl-3 py-1 space-y-1.5 border-l border-brand-border/10 ml-1">
                        <NavLink
                          to={`/dashboard/forms/${form.token}/settings`}
                          onClick={onLinkClick}
                          className={({ isActive }) => `block text-[11px] font-bold py-1.5 transition-colors ${isActive ? 'text-brand-primary' : 'text-brand-muted hover:text-brand-text'}`}
                        >
                          Settings
                        </NavLink>
                        <NavLink
                          to={`/dashboard/forms/${form.token}/template/notification`}
                          onClick={onLinkClick}
                          className={({ isActive }) => `block text-[11px] font-bold py-1.5 transition-colors ${isActive ? 'text-brand-primary' : 'text-brand-muted hover:text-brand-text'}`}
                        >
                          Email Templates
                        </NavLink>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Status */}
      <div className="px-6 mb-6 shrink-0">
        <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full px-4 py-2 w-full justify-center">
          <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-brand-primary tracking-wide">System Operational</span>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="px-4 pb-8 space-y-1.5 shrink-0">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-brand-muted hover:text-brand-text hover:bg-brand-text/5 rounded-2xl transition-all">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" /></svg>
          Help Center
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-brand-muted hover:text-brand-text hover:bg-brand-text/5 rounded-2xl transition-all">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8v4M12 16h.01" /></svg>
          What's New?
        </button>

        <div className="mt-4 pt-4 border-t border-brand-border/10">
          <div className="w-full bg-brand-primary/5 border border-brand-primary/15 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-brand-text leading-tight">Community Plan</p>
                <p className="text-[11px] font-semibold text-brand-primary mt-0.5">100% Free & Unlimited</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-4 flex items-center gap-3 px-4 py-3.5 text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all border border-red-500/10 rounded-2xl"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sticky Header Bar */}
      <div className="lg:hidden flex items-center justify-between w-full h-20 bg-brand-card/60 backdrop-blur-md px-6 border-b border-brand-border/10 shrink-0 z-40">
        <Link to="/" className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-orange-400">
          Formspark
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="p-3 bg-brand-primary text-brand-bg rounded-xl hover:opacity-90 shadow-md transition-all"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 h-full shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay Slider */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-brand-bg/80 backdrop-blur-md"
            />

            {/* Sidebar drawer body */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-[85vw] h-full bg-brand-card border-r border-brand-border/10 flex flex-col z-10"
            >
              <SidebarContent onLinkClick={() => setIsOpen(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
