import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { getFormByToken } from '../services/formsService';
import { useSubmissions } from '../hooks/useSubmissions';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/layout/Sidebar';
import toast from 'react-hot-toast';

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = `${title} — FormSpark`;
  }, [title]);
};

// Safe SVG Icons
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
);

const Submissions = () => {
  const { token } = useParams();
  useDocumentTitle('Submissions');

  const [form, setForm] = useState(null);
  const [formLoading, setFormLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  // Search input local state to avoid slow re-renders while typing
  const [searchInput, setSearchInput] = useState('');

  // Fetch form details by token
  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        setFormLoading(true);
        const data = await getFormByToken(token);
        setForm(data);
      } catch (err) {
        toast.error('Form not found or access denied');
      } finally {
        setFormLoading(false);
      }
    };
    if (token) fetchFormDetails();
  }, [token]);

  // Connect useSubmissions hook using form's ID once loaded
  const { 
    submissions, 
    stats, 
    loading: subsLoading, 
    filters, 
    setFilters, 
    handleDelete, 
    handleExport, 
    addSubmission 
  } = useSubmissions(form?.id);

  // Set up Realtime Supabase Subscription
  useEffect(() => {
    if (!form?.id) return;

    const channel = supabase
      .channel(`realtime-submissions-${form.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'submissions',
          filter: `form_id=eq.${form.id}`
        },
        (payload) => {
          addSubmission(payload.new);
          toast.success('New submission received in real-time!', {
            icon: '⚡',
            style: {
              borderRadius: '16px',
              border: '1px solid var(--color-brand-border)',
              background: 'var(--color-brand-card)',
              color: 'var(--color-brand-text)',
              padding: '16px',
              fontWeight: '700',
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [form?.id, addSubmission]);

  // Sync search input to hook state after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, setFilters]);

  const handleQuickDelete = async (id) => {
    if (window.confirm('Delete this submission permanently? This action cannot be undone.')) {
      try {
        await handleDelete(id);
        toast.success('Submission deleted');
      } catch (err) {
        toast.error('Failed to delete submission');
      }
    }
  };

  const handleExportCSV = async () => {
    if (!form) return;
    try {
      toast.loading('Preparing download...', { id: 'csv-export' });
      await handleExport(form.name);
      toast.success('Export completed!', { id: 'csv-export' });
    } catch (err) {
      toast.error('Export failed', { id: 'csv-export' });
    }
  };

  const isLoading = formLoading || subsLoading;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-brand-bg text-brand-text font-sans overflow-hidden transition-colors duration-500 relative">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-bg via-brand-bg to-brand-primary/10 pointer-events-none z-0"></div>

      <Sidebar className="z-10 relative" />
      
      <main className="flex-1 flex flex-col overflow-y-auto relative z-10">
        {/* Header */}
        <header className="h-24 bg-brand-bg/60 backdrop-blur-xl border-b border-brand-border/10 flex items-center justify-between px-8 md:px-12 shrink-0 transition-colors duration-500 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-xs font-semibold text-brand-muted hover:text-brand-text transition-colors">Dashboard</Link>
            <span className="text-brand-muted/30">/</span>
            <span className="text-xs font-bold text-brand-primary">
              Submissions
            </span>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handleExportCSV}
              disabled={isLoading || !submissions.length}
              className="px-6 py-3.5 rounded-2xl border border-brand-border/20 bg-brand-card/40 backdrop-blur-sm text-brand-text font-bold text-sm hover:bg-brand-card/80 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <DownloadIcon />
              Export CSV
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8 md:p-12 flex-1 max-w-7xl mx-auto w-full">
          {/* Subheader and Filters */}
          <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 mb-12">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-brand-text bg-clip-text text-transparent bg-gradient-to-r from-brand-text to-brand-primary">
                {form ? form.name : 'Form Submissions'}
              </h1>
              <p className="text-sm font-medium text-brand-muted mt-2">
                {form ? `Viewing real-time submissions for token: ${form.token}` : 'Loading form details...'}
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Date Filters */}
              <div className="flex items-center gap-3 bg-brand-card/40 backdrop-blur-sm border border-brand-border/10 rounded-2xl px-4 py-2.5 hover:bg-brand-card/60 transition-all shadow-sm">
                <span className="text-[10px] font-bold text-brand-muted uppercase">From</span>
                <input 
                  type="date" 
                  className="bg-transparent border-none text-xs font-bold outline-none cursor-pointer text-brand-text"
                  value={filters.startDate || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value || null }))}
                />
                <span className="text-[10px] font-bold text-brand-muted uppercase">To</span>
                <input 
                  type="date" 
                  className="bg-transparent border-none text-xs font-bold outline-none cursor-pointer text-brand-text"
                  value={filters.endDate || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value || null }))}
                />
              </div>

              {/* Search input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-muted group-focus-within:text-brand-primary transition-colors">
                  <SearchIcon />
                </div>
                <input 
                  type="text"
                  placeholder="Search values..."
                  className="bg-brand-card/40 backdrop-blur-sm text-brand-text border border-brand-border/20 rounded-2xl pl-12 pr-4 py-3 text-xs font-medium outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all placeholder-brand-muted hover:bg-brand-card/60 w-full sm:w-auto min-w-[220px] shadow-sm"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>

              {/* Spam toggle */}
              <button 
                onClick={() => setFilters(prev => ({ ...prev, showSpam: !prev.showSpam }))}
                className={`px-5 py-3 rounded-2xl border transition-all text-xs font-bold ${
                  filters.showSpam 
                    ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-sm' 
                    : 'bg-brand-card/40 border-brand-border/20 text-brand-muted hover:bg-brand-card/60'
                }`}
              >
                {filters.showSpam ? '🔥 Showing Spam' : '🛡️ Hide Spam'}
              </button>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-brand-card/60 backdrop-blur-xl border border-brand-border/10 rounded-3xl p-6 shadow-sm">
              <p className="text-xs font-semibold text-brand-muted mb-2">Total Submissions</p>
              <h4 className="text-3xl font-bold tracking-tight text-brand-text tabular-nums">{stats.total}</h4>
            </div>
            <div className="bg-brand-card/60 backdrop-blur-xl border border-brand-border/10 rounded-3xl p-6 shadow-sm">
              <p className="text-xs font-semibold text-brand-primary mb-2">Today</p>
              <h4 className="text-3xl font-bold tracking-tight text-brand-primary tabular-nums">{stats.today}</h4>
            </div>
            <div className="bg-brand-card/60 backdrop-blur-xl border border-brand-border/10 rounded-3xl p-6 shadow-sm">
              <p className="text-xs font-semibold text-red-500 mb-2">Spam Blocked</p>
              <h4 className="text-3xl font-bold tracking-tight text-red-500 tabular-nums">{stats.spam}</h4>
            </div>
            <div className="bg-brand-card/60 backdrop-blur-xl border border-brand-border/10 rounded-3xl p-6 shadow-sm">
              <p className="text-xs font-semibold text-blue-500 mb-2">Daily Avg</p>
              <h4 className="text-3xl font-bold tracking-tight text-blue-500 tabular-nums">{stats.avgPerDay}</h4>
            </div>
          </div>

          {/* Traffic analytics chart */}
          {stats.chartData?.length > 0 && (
            <div className="bg-brand-card/60 backdrop-blur-xl border border-brand-border/10 rounded-3xl p-8 mb-12 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold tracking-tight text-brand-primary">Submission Analytics (Last 30 Days)</h3>
                <span className="text-xs font-semibold text-brand-muted">Data Traffic Flow</span>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chartData}>
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: 'var(--color-brand-muted)' }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: 'var(--color-brand-muted)' }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,138,0,0.05)' }}
                      contentStyle={{ 
                        backgroundColor: 'var(--color-brand-card)', 
                        border: '1px solid var(--color-brand-border)',
                        borderRadius: '12px',
                        padding: '12px' 
                      }}
                      itemStyle={{ color: 'var(--color-brand-primary)', fontWeight: 700, fontSize: '12px' }}
                      labelStyle={{ color: 'var(--color-brand-text)', fontWeight: 600, fontSize: '10px' }}
                    />
                    <Bar dataKey="count" fill="var(--color-brand-primary)" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Submissions List Container */}
          <div className="bg-brand-card/60 backdrop-blur-xl border border-brand-border/10 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-border/10 bg-brand-bg/50">
                    <th className="px-6 py-5 text-xs font-bold text-brand-muted uppercase w-[100px]">Status</th>
                    <th className="px-6 py-5 text-xs font-bold text-brand-muted uppercase w-[180px]">Received At</th>
                    <th className="px-6 py-5 text-xs font-bold text-brand-muted uppercase">Data Snapshot</th>
                    <th className="px-6 py-5 text-xs font-bold text-brand-muted uppercase text-right w-[100px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/10">
                  {submissions.map((sub) => {
                    const parsedDate = new Date(sub.created_at);
                    const formattedDate = parsedDate.toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    });
                    const formattedTime = parsedDate.toLocaleTimeString();

                    return (
                      <React.Fragment key={sub.id}>
                        <tr 
                          onClick={() => setExpandedRow(expandedRow === sub.id ? null : sub.id)}
                          className={`hover:bg-brand-primary/5 cursor-pointer transition-colors ${
                            expandedRow === sub.id ? 'bg-brand-primary/10' : ''
                          }`}
                        >
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full border ${
                              sub.is_spam 
                                ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                                : 'bg-green-500/10 text-green-500 border-green-500/20'
                            }`}>
                              {sub.is_spam ? 'Spam' : 'Clean'}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sm font-bold text-brand-text">{formattedDate}</p>
                            <p className="text-xs text-brand-muted">{formattedTime}</p>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-wrap gap-2 max-w-xl">
                              {Object.entries(sub.data || {}).slice(0, 3).map(([key, value]) => (
                                <div 
                                  key={key} 
                                  className="bg-brand-bg border border-brand-border/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-brand-text truncate max-w-[180px]"
                                  title={`${key}: ${value}`}
                                >
                                  <span className="text-brand-muted text-[10px] font-bold mr-1 uppercase">{key}:</span>
                                  {String(value)}
                                </div>
                              ))}
                              {Object.keys(sub.data || {}).length > 3 && (
                                <span className="text-xs font-bold text-brand-primary flex items-center">
                                  +{Object.keys(sub.data || {}).length - 3} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickDelete(sub.id);
                              }}
                              className="text-brand-muted hover:text-red-500 p-2.5 hover:bg-red-500/10 rounded-xl transition-all"
                              title="Delete Submission"
                            >
                              <TrashIcon />
                            </button>
                          </td>
                        </tr>

                        {/* Expander Drawer Tray */}
                        <AnimatePresence>
                          {expandedRow === sub.id && (
                            <tr>
                              <td colSpan="4" className="bg-brand-bg/40 backdrop-blur-md border-b border-brand-border/10 p-0">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 border-l-2 border-brand-primary">
                                    {/* Left side: Arbitrary key-value list */}
                                    <div>
                                      <h4 className="text-sm font-bold tracking-tight text-brand-primary mb-6">Submitted Payload</h4>
                                      <div className="space-y-4">
                                        {Object.entries(sub.data || {}).map(([key, val]) => (
                                          <div key={key} className="border-b border-brand-border/10 pb-3">
                                            <p className="text-[10px] font-bold uppercase text-brand-muted mb-1">{key}</p>
                                            <p className="text-sm font-semibold text-brand-text break-words select-all">{String(val)}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Right side: Metadata cards */}
                                    <div className="bg-brand-card/80 border border-brand-border/10 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
                                      <div>
                                        <h4 className="text-xs font-bold uppercase text-brand-muted mb-4">Submission Meta</h4>
                                        <div className="space-y-4">
                                          <div>
                                            <p className="text-[10px] font-bold uppercase text-brand-muted">Global IP ID</p>
                                            <p className="text-xs font-mono font-semibold">{sub.ip_hash || 'Hidden / Anonymized'}</p>
                                          </div>
                                          <div>
                                            <p className="text-[10px] font-bold uppercase text-brand-muted">Client User Agent</p>
                                            <p className="text-xs font-mono font-semibold leading-normal text-brand-muted break-words">
                                              {sub.user_agent || 'Not provided'}
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="pt-4 border-t border-brand-border/10 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-brand-muted">Unique ID</span>
                                        <span className="font-mono text-xs text-brand-muted select-all">{sub.id}</span>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}

                  {/* Empty Submissions state */}
                  {!isLoading && submissions.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-24 text-center">
                        <div className="max-w-md mx-auto">
                          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-4 text-brand-muted"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                          <h4 className="text-base font-bold text-brand-text mb-2">No Submissions Found</h4>
                          <p className="text-xs font-medium text-brand-muted leading-relaxed">
                            {searchInput || filters.startDate || filters.endDate 
                              ? 'Change your active search filters above and try again.' 
                              : 'Waiting for payloads... Connect your form to start receiving responses!'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Submissions;
