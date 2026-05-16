import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Settings, 
  Trash2, 
  MessageSquare,
  Zap,
  Code2,
  Database,
  Search,
  ExternalLink,
  Copy,
  LayoutGrid,
  List,
  Terminal,
  Hash,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import useForms from '../hooks/useForms';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

const Dashboard = () => {
  const { forms, loading, createForm, deleteForm } = useForms();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newFormName, setNewFormName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newFormName.trim()) return;
    setCreating(true);
    try {
      await createForm({ name: newFormName });
      setIsCreateModalOpen(false);
      setNewFormName('');
      toast.success('ENDPOINT_ACTIVE');
    } catch (err) {
      toast.error('INITIALIZATION_FAILED');
    } finally {
      setCreating(false);
    }
  };

  const stats = [
    { label: 'Active Endpoints', value: forms.length, icon: Database, color: 'bg-brand-primary' },
    { label: 'Inbound Payloads', value: forms.reduce((acc, f) => acc + (f.submissions_count || 0), 0), icon: MessageSquare, color: 'bg-brand-text text-brand-bg' },
    { label: 'System Uptime', value: '99.9%', icon: Zap, color: 'bg-brand-primary' }
  ];

  if (loading) {
    return (
      <PageWrapper title="Loading System">
        <div className="flex items-center justify-center py-40">
           <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent animate-spin"></div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Console"
      subtitle="Operational hub for endpoint orchestration and payload monitoring."
      actions={
        <Button 
          onClick={() => setIsCreateModalOpen(true)} 
          size="lg"
          icon={Plus}
        >
          Initialize Endpoint
        </Button>
      }
    >
      <div className="space-y-20">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-brand-border bg-brand-bg shadow-[10px_10px_0px_var(--color-brand-border)]">
          {stats.map((stat, i) => (
            <div key={i} className="p-10 border-r border-brand-border last:border-r-0 flex flex-col justify-between group hover:bg-brand-text hover:text-brand-bg transition-colors duration-500">
              <div className={cn("w-16 h-16 border-2 border-brand-border flex items-center justify-center mb-12 shadow-[4px_4px_0px_var(--color-brand-border)] group-hover:bg-brand-primary group-hover:text-brand-text transition-all", stat.color)}>
                <stat.icon size={28} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2 group-hover:opacity-100">{stat.label}</p>
                <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {forms.length === 0 ? (
          <div className="border border-brand-border p-20 bg-brand-bg/50 flex flex-col items-center text-center">
            <Terminal size={64} className="mb-8 opacity-20" />
            <h2 className="text-2xl font-black uppercase mb-4 tracking-tight">No Active Endpoints</h2>
            <p className="text-lg font-bold opacity-60 max-w-md mb-12">Deploy your first endpoint to start capturing data payloads instantly across your architecture.</p>
            <Button onClick={() => setIsCreateModalOpen(true)} size="lg" icon={Zap}>
              Initialize Protocol
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-brand-border border border-brand-border shadow-[15px_15px_0px_var(--color-brand-border)]">
            <AnimatePresence mode="popLayout">
              {forms.map((form) => (
                <motion.div
                  layout
                  key={form.token}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-brand-bg p-10 flex flex-col group hover:bg-brand-primary transition-colors duration-500"
                >
                  <div className="flex items-start justify-between mb-12">
                    <div className="min-w-0">
                      <h3 className="text-3xl font-black uppercase tracking-tighter truncate mb-4 group-hover:text-brand-text transition-colors">
                        {form.name}
                      </h3>
                      <div className="inline-flex items-center gap-3 px-4 py-1 border border-brand-border text-xs font-black uppercase tracking-widest bg-brand-text text-brand-bg">
                        {form.submissions_count || 0} PAYLOADS
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Link to={`/dashboard/forms/${form.token}/settings`} className="w-12 h-12 border-2 border-brand-border flex items-center justify-center bg-brand-bg text-brand-text hover:bg-brand-text hover:text-brand-bg transition-all shadow-[4px_4px_0px_var(--color-brand-border)]">
                        <Settings size={20} strokeWidth={2.5} />
                      </Link>
                    </div>
                  </div>

                  <div className="mt-auto space-y-8">
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                         <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100">Endpoint ID</span>
                         <button 
                          onClick={() => {
                            navigator.clipboard.writeText(form.token);
                            toast.success('ID_COPIED');
                          }}
                          className="text-xs font-black border-b-2 border-brand-text group-hover:border-brand-bg"
                        >
                          COPY_ID
                        </button>
                      </div>
                      <div className="bg-brand-text text-brand-bg px-6 py-4 font-mono text-sm tracking-widest truncate border border-brand-border">
                        {form.token}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Link to={`/dashboard/submissions/${form.token}`} className="flex-1">
                        <button className="w-full h-14 bg-brand-text text-brand-bg font-black uppercase tracking-widest border border-brand-border hover:bg-brand-primary hover:text-brand-text transition-all flex items-center justify-center gap-3 group-hover:bg-brand-bg group-hover:text-brand-text">
                          <Database size={18} strokeWidth={2.5} />
                          Review Data
                        </button>
                      </Link>
                      <button 
                        onClick={() => {
                          if(confirm(`TERMINATE ENDPOINT: ${form.name}?`)) deleteForm(form.token);
                        }}
                        className="w-14 h-14 border border-brand-border bg-brand-bg text-brand-text flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-[4px_4px_0px_var(--color-brand-border)]"
                      >
                        <Trash2 size={20} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-brand-text/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl bg-brand-bg border-2 border-brand-border p-12 shadow-[20px_20px_0px_var(--color-brand-primary)]"
            >
              <h2 className="text-4xl font-black uppercase tracking-tight mb-8">Initialize Endpoint_</h2>
              <form onSubmit={handleCreate} className="space-y-10">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40">Protocol Label</label>
                  <input
                    type="text"
                    placeholder="e.g. ALPHA_CONTACT_SYSTEM"
                    value={newFormName}
                    onChange={(e) => setNewFormName(e.target.value)}
                    required
                    className="w-full bg-transparent border-b-4 border-brand-border p-4 text-2xl font-bold focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Button className="w-full h-16 text-xl" type="submit" loading={creating}>
                    Deploy Protocol
                  </Button>
                  <button 
                    type="button" 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="w-full h-12 text-xs font-black uppercase tracking-widest hover:text-brand-primary transition-colors"
                  >
                    Discard Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default Dashboard;
