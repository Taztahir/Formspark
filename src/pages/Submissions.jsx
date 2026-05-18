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
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
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
              border: '2px border-black',
              padding: '16px',
              fontWeight: '900',
              fontFamily: 'monospace',
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
    <div className="flex h-screen bg-[#F5F5F5] font-sans overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="h-20 bg-white border-b border-black/5 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-[11px] font-black uppercase text-black/40 hover:text-black transition-colors">Dashboard</Link>
            <span className="text-black/20">/</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-brand-primary border-b-2 border-brand-primary pb-7 mt-7">
              Submissions
            </span>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handleExportCSV}
              disabled={isLoading || !submissions.length}
              className="bg-white border-2 border-black px-5 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <DownloadIcon />
              Export CSV
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-10 flex-1">
          {/* Subheader and Filters */}
          <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter">
                {form ? form.name : 'Form Submissions'}
              </h1>
              <p className="text-[13px] font-bold text-black/50 mt-1">
                {form ? `Viewing real-time submissions for token: ${form.token}` : 'Loading form details...'}
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Date Filters */}
              <div className="flex items-center gap-2 bg-white border-2 border-black/5 px-3 py-1.5">
                <span className="text-[8px] font-black uppercase text-black/40">From</span>
                <input 
                  type="date" 
                  className="bg-transparent border-none text-[10px] font-bold outline-none cursor-pointer"
                  value={filters.startDate || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value || null }))}
                />
                <span className="text-[8px] font-black uppercase text-black/40">To</span>
                <input 
                  type="date" 
                  className="bg-transparent border-none text-[10px] font-bold outline-none cursor-pointer"
                  value={filters.endDate || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value || null }))}
                />
              </div>

              {/* Search input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black/35">
                  <SearchIcon />
                </div>
                <input 
                  type="text"
                  placeholder="Search values..."
                  className="bg-white border-2 border-black/5 pl-9 pr-4 py-2 text-xs font-bold min-w-[200px] outline-none focus:border-brand-primary transition-colors placeholder-black/30"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>

              {/* Spam toggle */}
              <button 
                onClick={() => setFilters(prev => ({ ...prev, showSpam: !prev.showSpam }))}
                className={`px-4 py-2 border-2 transition-all font-black uppercase tracking-widest text-[9px] ${
                  filters.showSpam 
                    ? 'bg-red-500 text-white border-black shadow-[3px_3px_0_rgba(0,0,0,1)]' 
                    : 'bg-white border-black/5 text-black/55 hover:border-black'
                }`}
              >
                {filters.showSpam ? '🔥 Showing Spam' : '🛡️ Hide Spam'}
              </button>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_rgba(0,0,0,1)]">
              <p className="text-[9px] font-black text-black/40 uppercase tracking-widest mb-1">Total Submissions</p>
              <h4 className="text-3xl font-black text-black tabular-nums">{stats.total}</h4>
            </div>
            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_rgba(0,0,0,1)]">
              <p className="text-[9px] font-black text-brand-primary uppercase tracking-widest mb-1">Today</p>
              <h4 className="text-3xl font-black text-brand-primary tabular-nums">{stats.today}</h4>
            </div>
            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_rgba(0,0,0,1)]">
              <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">Spam Blocked</p>
              <h4 className="text-3xl font-black text-red-500 tabular-nums">{stats.spam}</h4>
            </div>
            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_rgba(0,0,0,1)]">
              <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Daily Avg</p>
              <h4 className="text-3xl font-black text-blue-500 tabular-nums">{stats.avgPerDay}</h4>
            </div>
          </div>

          {/* Traffic analytics chart */}
          {stats.chartData?.length > 0 && (
            <div className="bg-[#111] border-4 border-black p-8 mb-10 shadow-[8px_8px_0_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Submission Analytics (Last 30 Days)</h3>
                <span className="text-[9px] font-mono text-white/30 uppercase">Data Traffic Flow</span>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chartData}>
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fontWeight: 900, fill: '#666' }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fontWeight: 900, fill: '#666' }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,138,0,0.05)' }}
                      contentStyle={{ backgroundColor: '#000', border: '2px solid #FF8A00', padding: '10px' }}
                      itemStyle={{ color: '#FF8A00', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase' }}
                      labelStyle={{ color: '#fff', fontWeight: 700, fontSize: '9px', textTransform: 'uppercase' }}
                    />
                    <Bar dataKey="count" fill="#FF8A00" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Submissions List Container */}
          <div className="bg-white border-4 border-black overflow-hidden shadow-[8px_8px_0_rgba(0,0,0,1)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-4 border-black bg-black/[0.02]">
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black/55 w-[80px]">Status</th>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black/55 w-[180px]">Received At</th>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black/55">Data Snapshot</th>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black/55 text-right w-[100px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black/5">
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
                          className={`hover:bg-brand-primary/[0.02] cursor-pointer transition-colors ${
                            expandedRow === sub.id ? 'bg-brand-primary/[0.04]' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-0.5 text-[8px] font-black uppercase rounded-full border ${
                              sub.is_spam 
                                ? 'bg-red-50 text-red-500 border-red-500' 
                                : 'bg-green-50 text-green-500 border-green-500'
                            }`}>
                              {sub.is_spam ? 'Spam' : 'Clean'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-[11px] font-black uppercase tracking-tight">{formattedDate}</p>
                            <p className="text-[9px] font-bold text-black/35">{formattedTime}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2 max-w-xl">
                              {Object.entries(sub.data || {}).slice(0, 3).map(([key, value]) => (
                                <div 
                                  key={key} 
                                  className="bg-[#F5F5F5] border border-black/10 px-2.5 py-1 text-[10px] font-bold truncate max-w-[180px]"
                                  title={`${key}: ${value}`}
                                >
                                  <span className="text-black/40 uppercase text-[8px] tracking-wide mr-1">{key}:</span>
                                  {String(value)}
                                </div>
                              ))}
                              {Object.keys(sub.data || {}).length > 3 && (
                                <span className="text-[9px] font-black text-brand-primary flex items-center">
                                  +{Object.keys(sub.data || {}).length - 3} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickDelete(sub.id);
                              }}
                              className="text-black/35 hover:text-red-500 p-2 hover:bg-red-50 transition-colors"
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
                              <td colSpan="4" className="bg-[#FAF9F5] border-b-2 border-black/15 p-0">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 border-l-4 border-brand-primary">
                                    {/* Left side: Arbitrary key-value list */}
                                    <div>
                                      <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-6">Submitted Payload</h4>
                                      <div className="space-y-4">
                                        {Object.entries(sub.data || {}).map(([key, val]) => (
                                          <div key={key} className="border-b border-black/5 pb-2">
                                            <p className="text-[8px] font-black uppercase text-black/30 tracking-widest mb-0.5">{key}</p>
                                            <p className="text-xs font-bold text-brand-text break-words select-all">{String(val)}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Right side: Metadata cards */}
                                    <div className="bg-white border-2 border-black p-6 space-y-6 flex flex-col justify-between">
                                      <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-4">Submission Meta</h4>
                                        <div className="space-y-4">
                                          <div>
                                            <p className="text-[8px] font-black uppercase text-black/30 tracking-widest">Global IP ID</p>
                                            <p className="text-[10px] font-mono font-bold">{sub.ip_hash || 'Hidden / Anonymized'}</p>
                                          </div>
                                          <div>
                                            <p className="text-[8px] font-black uppercase text-black/30 tracking-widest">Client User Agent</p>
                                            <p className="text-[10px] font-mono font-bold leading-normal text-black/60 break-words">
                                              {sub.user_agent || 'Not provided'}
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                                        <span className="text-[9px] font-black text-black/40 uppercase">Unique ID</span>
                                        <span className="font-mono text-[9px] text-black/40 select-all">{sub.id}</span>
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
                          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-4 text-black/30"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                          <h4 className="text-sm font-black uppercase mb-1">No Submissions Found</h4>
                          <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
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
