import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  Settings, 
  Shield, 
  LogOut, 
  Zap,
  ChevronRight,
  Terminal
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { cn } from '../../utils/cn';
import ThemeToggle from '../ui/ThemeToggle';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Console', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Submissions', path: '/dashboard', icon: Database },
    { name: 'Infrastructure', path: '/dashboard', icon: Settings },
    { name: 'Security', path: '/dashboard', icon: Shield },
  ];

  return (
    <aside className="w-72 h-screen bg-brand-bg border-r border-brand-border flex flex-col shrink-0 relative z-20">
      {/* Brand */}
      <Link to="/" className="p-8 border-b border-brand-border bg-brand-primary text-brand-text hover:bg-brand-text hover:text-brand-primary transition-colors flex items-center justify-between group">
        <div className="flex items-center gap-3">
          <Zap className="h-6 w-6" strokeWidth={3} />
          <span className="text-xl font-black tracking-tighter uppercase">FormSpark</span>
        </div>
        <ChevronRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        <div className="px-4 mb-6 text-[10px] font-black text-brand-text opacity-40 uppercase tracking-[0.2em]">Core Protocol</div>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center justify-between px-6 py-4 border border-transparent transition-all group",
              isActive 
                ? "bg-brand-text text-brand-bg border-brand-border shadow-[4px_4px_0px_var(--color-brand-primary)]" 
                : "text-brand-text opacity-60 hover:opacity-100 hover:border-brand-border hover:bg-brand-text hover:text-brand-bg"
            )}
          >
            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest">
              <item.icon size={18} strokeWidth={2.5} />
              {item.name}
            </div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-6 border-t border-brand-border bg-brand-bg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-brand-border bg-brand-primary flex items-center justify-center text-lg font-black text-brand-text shadow-[4px_4px_0px_var(--color-brand-text)]">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-brand-text truncate">{user?.name || 'Operator'}</p>
              <p className="text-[10px] text-brand-text opacity-40 uppercase tracking-widest font-black">Admin Access</p>
            </div>
          </div>
          <div className="w-10 h-10 border border-brand-border">
             <ThemeToggle />
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 h-12 border border-brand-border bg-brand-bg text-xs font-black uppercase tracking-widest text-brand-text hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-[4px_4px_0px_var(--color-brand-border)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
        >
          <LogOut size={16} strokeWidth={2.5} />
          Terminate Session
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
