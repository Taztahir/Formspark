import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { formsService } from '../services/formsService';
import { submissionsService } from '../services/submissionsService';
import toast from 'react-hot-toast';
import Sidebar from '../components/layout/Sidebar';

// Safe SVG Icons
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
);

const FormIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M7 7h10M7 12h10M7 17h10"/></svg>
);

const SubmissionIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
);

const IntegrationIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"/><path d="M12 8v8M8 12h8"/></svg>
);

const KeyIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3L15.5 7.5z"/></svg>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [forms, setForms] = useState([]);
  const [stats, setStats] = useState({ totalForms: 0, totalSubmissions: 0, integrations: 8, apiKeys: 5 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newFormName, setNewFormName] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const formsData = await formsService.getForms();
      setForms(formsData);
      
      // Calculate total submissions across all forms
      // This is a placeholder logic as real stats would need more queries
      setStats(prev => ({ ...prev, totalForms: formsData.length }));
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForm = async (e) => {
    e.preventDefault();
    if (!newFormName) return;
    
    try {
      await formsService.createForm(newFormName);
      toast.success('Form created successfully');
      setNewFormName('');
      setShowModal(false);
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to create form');
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5] font-sans overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="h-20 bg-white border-b border-black/5 flex items-center justify-between px-10 shrink-0">
          <div className="flex gap-8">
            <span className="text-[11px] font-black uppercase tracking-widest text-brand-primary border-b-2 border-brand-primary pb-7">Overview</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors cursor-pointer pb-7">Forms</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors cursor-pointer pb-7">Submissions</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors cursor-pointer pb-7">Integrations</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-black/60 hover:text-black transition-colors">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-primary text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">3</span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-black/5">
              <div className="text-right">
                <p className="text-[11px] font-black uppercase tracking-tight">{user?.user_metadata?.name || 'User'}</p>
                <p className="text-[10px] font-bold text-black/40 lowercase">{user?.email}</p>
              </div>
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black text-xs">
                {user?.user_metadata?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-10 flex-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter">Dashboard</h1>
              <p className="text-[13px] font-bold text-black/50 mt-1">Welcome back! Here's what's happening with your forms.</p>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-black text-white px-6 py-3 font-black uppercase tracking-widest text-[11px] flex items-center gap-2 hover:bg-brand-primary transition-colors active:scale-95"
            >
              <PlusIcon />
              New Form
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Forms" value={stats.totalForms} change="+12%" icon={<FormIcon />} color="text-orange-500" />
            <StatCard title="Total Submissions" value={stats.totalSubmissions} change="+18%" icon={<SubmissionIcon />} color="text-blue-500" />
            <StatCard title="Integrations" value={stats.integrations} change="No change" icon={<IntegrationIcon />} color="text-purple-500" />
            <StatCard title="API Keys" value={stats.apiKeys} change="+25%" icon={<KeyIcon />} color="text-green-500" />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-black/5 p-8 h-[400px]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[11px] font-black uppercase tracking-widest">Submissions Over Time</h3>
                  <select className="bg-[#F5F5F5] border-none text-[10px] font-black uppercase px-3 py-1 outline-none">
                    <option>Last 30 days</option>
                  </select>
                </div>
                <div className="w-full h-[280px] flex items-end gap-2 px-2">
                  {[40, 60, 45, 70, 85, 60, 75, 90, 65, 80, 55, 70].map((h, i) => (
                    <div key={i} className="flex-1 bg-brand-primary/10 relative group">
                      <div className="absolute bottom-0 left-0 right-0 bg-brand-primary group-hover:bg-black transition-colors" style={{ height: `${h}%` }}></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 px-2">
                  <span className="text-[10px] font-bold text-black/30 uppercase">May 5</span>
                  <span className="text-[10px] font-bold text-black/30 uppercase">May 19</span>
                  <span className="text-[10px] font-bold text-black/30 uppercase">Jun 2</span>
                </div>
              </div>

              {/* Top Forms */}
              <div className="bg-white border border-black/5 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[11px] font-black uppercase tracking-widest">Top Forms</h3>
                  <span className="text-[10px] font-black text-brand-primary uppercase cursor-pointer hover:underline">View all</span>
                </div>
                <div className="space-y-6">
                  {forms.slice(0, 4).map((form, i) => (
                    <div key={form.id} className="flex items-center justify-between">
                      <span className="text-[13px] font-black uppercase">{form.name}</span>
                      <div className="flex items-center gap-4 flex-1 max-w-[200px] ml-8">
                        <div className="h-1.5 bg-[#F5F5F5] flex-1 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-primary" style={{ width: `${80 - i * 15}%` }}></div>
                        </div>
                        <span className="text-[11px] font-black text-black/40 min-w-[30px]">{632 - i * 140}</span>
                      </div>
                    </div>
                  ))}
                  {forms.length === 0 && (
                    <div className="text-center py-4 text-black/30 font-bold uppercase text-xs">No forms yet</div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side Info */}
            <div className="space-y-6">
              {/* Recent Submissions */}
              <div className="bg-white border border-black/5 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[11px] font-black uppercase tracking-widest">Recent Submissions</h3>
                  <span className="text-[10px] font-black text-brand-primary uppercase cursor-pointer hover:underline">View all</span>
                </div>
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center justify-between border-b border-black/5 pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="text-[11px] font-black uppercase">Contact Form</p>
                        <p className="text-[10px] font-bold text-black/40">sam@acme.com</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-black/30">JUN 2</p>
                        <span className="text-[9px] font-black px-2 py-0.5 bg-green-100 text-green-600 rounded-full uppercase">New</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Snippet */}
              <div className="bg-[#111] border border-black p-8 rounded-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Quick Embed</h3>
                  <span className="text-[10px] font-mono text-white/30">01_CODE</span>
                </div>
                <div className="font-mono text-[11px] space-y-1">
                  <p className="text-brand-primary">{"<form"}</p>
                  <p className="text-white">{"  action=\"https://formspark.io/f/id\""}</p>
                  <p className="text-white">{"  method=\"POST\""}</p>
                  <p className="text-brand-primary">{">"}</p>
                  <p className="text-white">{"  <input type=\"email\" ... />"}</p>
                  <p className="text-brand-primary">{"</form>"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* New Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md relative z-10 p-10 border-4 border-black shadow-[12px_12px_0_rgba(0,0,0,0.1)]"
          >
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Create New Form</h2>
            <p className="text-xs font-bold text-black/50 mb-8 uppercase tracking-widest">Give your form a memorable name.</p>
            
            <form onSubmit={handleCreateForm} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest block mb-2">Form Name</label>
                <input 
                  type="text"
                  autoFocus
                  required
                  placeholder="e.g. Contact Form, Newsletter"
                  className="w-full bg-[#F5F5F5] border-2 border-black/5 px-4 py-3 outline-none focus:border-brand-primary font-bold text-sm transition-colors"
                  value={newFormName}
                  onChange={(e) => setNewFormName(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border-2 border-black px-6 py-3 font-black uppercase tracking-widest text-[11px] hover:bg-black/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-brand-primary text-brand-text px-6 py-3 font-black uppercase tracking-widest text-[11px] hover:bg-[#e67c00] transition-colors shadow-[4px_4px_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                >
                  Create Form
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, change, icon, color }) => (
  <div className="bg-white border border-black/5 p-8 group hover:border-black transition-all">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 bg-brand-primary/5 rounded-lg group-hover:bg-brand-primary/10 transition-colors ${color}`}>
        {icon}
      </div>
      <div className={`text-[10px] font-black uppercase tracking-widest ${change.includes('+') ? 'text-green-500' : 'text-black/30'}`}>
        {change} <span className="text-black/20 ml-1 font-bold">vs last month</span>
      </div>
    </div>
    <p className="text-[10px] font-black text-black/30 uppercase tracking-widest mb-1">{title}</p>
    <h4 className="text-3xl font-black tabular-nums">{value.toLocaleString()}</h4>
  </div>
);

export default Dashboard;
