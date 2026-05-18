import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import { getForms } from '../../services/formsService';
import { supabase } from '../../lib/supabase';

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
);

const Sidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [newSubmissionsCount, setNewSubmissionsCount] = useState(0);

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
        const forms = await getForms();
        activeFormIds = forms.map(f => f.id);
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
    <div className="flex flex-col h-full bg-[#111111]">
      {/* Brand */}
      <div className="h-20 flex items-center justify-between px-8 border-b border-white/5 shrink-0">
        <Link to="/" onClick={onLinkClick} className="text-xl font-black tracking-tighter uppercase text-brand-primary">Formspark</Link>
        <button onClick={onLinkClick} className="lg:hidden p-2 text-white/50 hover:text-white border-2 border-black active:translate-x-0.5 active:translate-y-0.5">
          <XIcon />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-8 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => {
              if (item.name === 'Submissions') setNewSubmissionsCount(0);
              if (onLinkClick) onLinkClick();
            }}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all
              ${isActive 
                ? 'bg-brand-primary text-brand-text shadow-[4px_4px_0_rgba(0,0,0,1)] translate-x-1 -translate-y-1' 
                : 'text-white/40 hover:text-white hover:bg-white/5'}
            `}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.icon} />
            </svg>
            <span className="flex-1">{item.name}</span>
            {item.name === 'Submissions' && newSubmissionsCount > 0 && (
              <span className="bg-red-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] animate-bounce shrink-0">
                {newSubmissionsCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Status */}
      <div className="px-8 mb-6 shrink-0">
        <div className="inline-flex items-center gap-2 border border-brand-primary/30 px-3 py-1 bg-transparent">
          <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse"></div>
          <span className="text-[9px] font-bold text-brand-primary tracking-widest uppercase">System Operational</span>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="px-4 pb-8 space-y-1 shrink-0">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-white/40 hover:text-white transition-colors">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>
          Help Center
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-white/40 hover:text-white transition-colors">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8v4M12 16h.01"/></svg>
          What's New?
        </button>
        
        <div className="mt-6 pt-6 border-t border-white/5">
          <button className="w-full bg-[#1A1A1A] border border-brand-primary/20 p-4 flex items-center justify-between group hover:border-brand-primary transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 rounded text-brand-primary group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase text-white tracking-widest">Business Plan</p>
                <p className="text-[9px] font-bold text-white/40">Upgrade</p>
              </div>
            </div>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/20 group-hover:translate-x-1 transition-transform"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full mt-4 flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          Terminate
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sticky Header Bar */}
      <div className="lg:hidden flex items-center justify-between w-full h-20 bg-[#111111] px-6 border-b border-black shrink-0 z-40">
        <Link to="/" className="text-xl font-black tracking-tighter uppercase text-brand-primary">Formspark</Link>
        <button 
          onClick={() => setIsOpen(true)} 
          className="p-3 bg-brand-primary text-brand-text border-2 border-black shadow-[3px_3px_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 h-full bg-[#111111] border-r border-black flex-col shrink-0">
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
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Sidebar drawer body */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-[85vw] h-full bg-[#111111] border-r-4 border-black flex flex-col z-10"
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
