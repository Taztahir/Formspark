import React from 'react';
import Sidebar from './Sidebar';

const PageWrapper = ({ children, title, subtitle, actions }) => {
  return (
    <div className="min-h-screen bg-brand-bg flex text-brand-text selection:bg-brand-primary selection:text-brand-text">
      <Sidebar />
      <main className="flex-1 min-h-screen relative overflow-x-hidden">
        {/* Persistent Architectural Grid Background */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05]"
             style={{
               backgroundImage: 'linear-gradient(var(--color-brand-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand-border) 1px, transparent 1px)',
               backgroundSize: '40px 40px'
             }}>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto p-6 md:p-12">
          {/* Page Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-12 border-b border-brand-border">
            <div>
              {title && (
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 leading-none">
                  {title}_
                </h1>
              )}
              {subtitle && (
                <p className="text-base font-bold opacity-60 uppercase tracking-widest max-w-2xl">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-4">
                {actions}
              </div>
            )}
          </header>

          {/* Page Content */}
          <div className="reveal active">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PageWrapper;
