import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { submissionsService } from '../services/submissionsService';
import Sidebar from '../components/layout/Sidebar';
import toast from 'react-hot-toast';

// Safe SVG Icons
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
);

const FilterIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
);

const Submissions = () => {
  const { token } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0, spam: 0, avgPerDay: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSpam, setShowSpam] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, [token]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      // In a real app, we'd look up formId by token first
      const formId = token; // Placeholder
      const data = await submissionsService.getSubmissions(formId);
      setSubmissions(data);
      
      const statsData = await submissionsService.getSubmissionStats(formId);
      setStats(statsData);
    } catch (err) {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    try {
      await submissionsService.deleteSubmission(id);
      toast.success('Submission deleted');
      fetchSubmissions();
    } catch (err) {
      toast.error('Failed to delete submission');
    }
  };

  const handleExport = async () => {
    try {
      await submissionsService.exportCSV(token);
      toast.success('Exporting CSV...');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const filteredData = submissions.filter(s => {
    const matchesSearch = JSON.stringify(s.data).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpam = showSpam ? true : !s.is_spam;
    return matchesSearch && matchesSpam;
  });

  // Mock data for chart
  const chartData = [
    { name: 'May 5', submissions: 200 },
    { name: 'May 12', submissions: 400 },
    { name: 'May 19', submissions: 600 },
    { name: 'May 26', submissions: 450 },
    { name: 'Jun 2', submissions: 300 },
  ];

  return (
    <div className="flex h-screen bg-[#F5F5F5] font-sans overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 bg-white border-b border-black/5 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-[11px] font-black uppercase text-black/40 hover:text-black transition-colors">Dashboard</Link>
            <span className="text-black/20">/</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-brand-primary border-b-2 border-brand-primary pb-7 mt-7">Submissions</span>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handleExport}
              className="bg-white border border-black/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black hover:text-white transition-all"
            >
              <DownloadIcon />
              Export CSV
            </button>
          </div>
        </header>

        <div className="p-10 flex-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter">Submissions</h1>
              <p className="text-[13px] font-bold text-black/50 mt-1">Manage and analyze your form data in real-time.</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black/30">
                  <SearchIcon />
                </div>
                <input 
                  type="text"
                  placeholder="Search submissions..."
                  className="bg-white border border-black/5 pl-10 pr-4 py-2.5 outline-none focus:border-brand-primary font-bold text-xs min-w-[300px] transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setShowSpam(!showSpam)}
                className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${showSpam ? 'bg-red-500 text-white border-red-500' : 'bg-white border-black/5 text-black/60 hover:border-black'}`}
              >
                <FilterIcon />
                {showSpam ? 'Showing Spam' : 'Hide Spam'}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <MiniStatCard title="Total" value={stats.total} color="text-black" />
            <MiniStatCard title="Today" value={stats.today} color="text-brand-primary" />
            <MiniStatCard title="Spam Caught" value={stats.spam} color="text-red-500" />
            <MiniStatCard title="Avg per Day" value={stats.avgPerDay} color="text-blue-500" />
          </div>

          {/* Analytics Chart */}
          <div className="bg-white border border-black/5 p-8 mb-8">
            <h3 className="text-[11px] font-black uppercase tracking-widest mb-8">Data Traffic</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#999' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#999' }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '4px', padding: '12px' }}
                    itemStyle={{ color: '#FF8A00', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase' }}
                    labelStyle={{ color: '#666', fontWeight: 700, fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase' }}
                  />
                  <Bar dataKey="submissions" fill="#FF8A00" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white border border-black/5 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5 bg-black/[0.02]">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-black/40">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-black/40">Date / Time</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-black/40">Data Summary</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-black/40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredData.map((sub) => (
                  <React.Fragment key={sub.id}>
                    <tr 
                      className={`hover:bg-black/[0.01] transition-colors cursor-pointer ${expandedRow === sub.id ? 'bg-black/[0.01]' : ''}`}
                      onClick={() => setExpandedRow(expandedRow === sub.id ? null : sub.id)}
                    >
                      <td className="px-8 py-5">
                        {sub.is_spam ? (
                          <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                        ) : (
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-[12px] font-black uppercase tracking-tight">{new Date(sub.created_at).toLocaleDateString()}</p>
                        <p className="text-[10px] font-bold text-black/30">{new Date(sub.created_at).toLocaleTimeString()}</p>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex gap-2">
                          {Object.entries(sub.data).slice(0, 3).map(([k, v]) => (
                            <div key={k} className="bg-[#F5F5F5] px-2 py-1 rounded text-[10px] font-bold border border-black/5 max-w-[150px] truncate">
                              <span className="text-black/30">{k}:</span> {String(v)}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(sub.id); }}
                          className="text-black/20 hover:text-red-500 transition-colors p-2"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Detail View */}
                    <AnimatePresence>
                      {expandedRow === sub.id && (
                        <tr>
                          <td colSpan="4" className="bg-[#FAFAFA] border-b border-black/5">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div>
                                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary mb-6">Full Data Set</h4>
                                  <div className="space-y-4">
                                    {Object.entries(sub.data).map(([k, v]) => (
                                      <div key={k} className="border-l-2 border-brand-primary pl-4 py-1">
                                        <p className="text-[9px] font-black uppercase text-black/30 mb-1">{k}</p>
                                        <p className="text-sm font-bold break-all">{String(v)}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="bg-white border border-black/5 p-6 space-y-4">
                                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-2">Meta Information</h4>
                                  <div>
                                    <p className="text-[9px] font-black uppercase text-black/20">IP Address</p>
                                    <p className="text-xs font-mono font-bold">{sub.ip_hash || '127.0.0.1'}</p>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-black uppercase text-black/20">User Agent</p>
                                    <p className="text-xs font-mono font-bold leading-relaxed">{sub.user_agent || 'Mozilla/5.0...'}</p>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-20 text-center text-black/30 font-black uppercase tracking-widest text-sm">
                      No submissions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const MiniStatCard = ({ title, value, color }) => (
  <div className="bg-white border border-black/5 p-6 hover:border-black transition-all">
    <p className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em] mb-1">{title}</p>
    <h4 className={`text-2xl font-black tabular-nums ${color}`}>{value}</h4>
  </div>
);

export default Submissions;
