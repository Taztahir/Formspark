import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: 'Library', href: '/library' },
    { name: 'Features', href: '/#backend' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-brand-bg border-b border-brand-border h-[80px]">
      <div className="max-w-[1400px] mx-auto h-full border-x border-brand-border flex">
        {/* Brand */}
        <Link to="/" className="h-full px-8 border-r border-brand-border flex items-center bg-brand-primary text-brand-text hover:bg-brand-text hover:text-brand-primary transition-colors">
          <span className="text-2xl font-black tracking-tighter uppercase">Formspark</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex h-full">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            const isHash = link.href.includes('#');

            return !isHash ? (
              <Link 
                key={link.name} 
                to={link.href} 
                className={`h-full px-8 flex items-center border-r border-brand-border text-sm font-bold uppercase tracking-widest transition-colors ${isActive ? 'bg-brand-primary text-brand-text' : 'hover:bg-brand-text hover:text-brand-bg'}`}
              >
                {link.name}
              </Link>
            ) : (
              <a 
                key={link.name} 
                href={link.href} 
                className="h-full px-8 flex items-center border-r border-brand-border text-sm font-bold uppercase tracking-widest hover:bg-brand-text hover:text-brand-bg transition-colors"
              >
                {link.name}
              </a>
            );
          })}
        </div>

        <div className="flex-1"></div>

        {/* Auth Actions & Theme */}
        <div className="hidden md:flex h-full items-center">
          <Link to="/login" className="h-full px-8 flex items-center border-l border-brand-border text-sm font-bold uppercase tracking-widest hover:bg-brand-text hover:text-brand-bg transition-colors">
            Log In
          </Link>
          <Link to="/signup" className="h-full px-8 flex items-center border-l border-brand-border text-sm font-black uppercase tracking-widest bg-brand-text text-brand-bg hover:bg-brand-primary hover:text-brand-text transition-colors">
            Init
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile Toggle & Theme */}
        <div className="md:hidden flex h-full items-center border-l border-brand-border">
          <ThemeToggle />
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="h-full px-6 border-l border-brand-border flex items-center justify-center hover:bg-brand-text hover:text-brand-bg transition-colors"
          >
            {mobileOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-[80px] left-0 w-full md:hidden z-50 bg-brand-bg border-b border-brand-border overflow-hidden"
          >
            <div className="flex flex-col">
              {navLinks.map((link) => {
                const isHash = link.href.includes('#');
                return !isHash ? (
                  <Link 
                    key={link.name} 
                    to={link.href} 
                    onClick={() => setMobileOpen(false)}
                    className="p-6 border-b border-brand-border text-xl font-bold uppercase tracking-widest"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setMobileOpen(false)}
                    className="p-6 border-b border-brand-border text-xl font-bold uppercase tracking-widest"
                  >
                    {link.name}
                  </a>
                );
              })}
              <div className="grid grid-cols-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="p-6 border-r border-brand-border text-center font-bold uppercase">Log In</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="p-6 bg-brand-text text-brand-bg text-center font-bold uppercase">Init</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
