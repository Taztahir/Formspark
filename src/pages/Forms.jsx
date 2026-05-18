import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formsService } from '../services/formsService';
import Sidebar from '../components/layout/Sidebar';
import toast from 'react-hot-toast';

// Safe SVG Icons
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/></svg>
);

const Forms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newFormName, setNewFormName] = useState('');

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const data = await formsService.getForms();
      setForms(data);
    } catch (err) {
      toast.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newFormName) return;
    try {
      await formsService.createForm(newFormName);
      toast.success('Form created');
      setNewFormName('');
      setShowModal(false);
      fetchForms();
    } catch (err) {
      toast.error('Failed to create form');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5F5F5]">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F5F5F5] font-sans overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 bg-white border-b border-black/5 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-[11px] font-black uppercase text-black/40 hover:text-black transition-colors">Dashboard</Link>
            <span className="text-black/20">/</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-brand-primary border-b-2 border-brand-primary pb-7 mt-7">Forms</span>
          </div>
          
          <button 
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-brand-primary transition-all"
          >
            <PlusIcon />
            New Form
          </button>
        </header>

        <div className="p-10">
          <div className="mb-12">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Your Forms</h1>
            <p className="text-[13px] font-bold text-black/50 mt-1">Manage all your active form endpoints.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div key={form.id} className="bg-white border border-black/5 p-8 group hover:border-black transition-all">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight mb-1">{form.name}</h3>
                    <p className="text-[10px] font-mono text-black/30 truncate max-w-[150px]">{form.token}</p>
                  </div>
                  <Link 
                    to={`/dashboard/forms/${form.token}/settings`}
                    className="p-2 border border-black/5 text-black/20 hover:text-brand-primary hover:border-brand-primary transition-colors"
                  >
                    <SettingsIcon />
                  </Link>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-black/5">
                  <div className="text-left">
                    <p className="text-[9px] font-black uppercase text-black/20 mb-1">Submissions</p>
                    <p className="text-lg font-black tabular-nums">0</p>
                  </div>
                  <Link 
                    to={`/dashboard/submissions/${form.token}`}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-primary hover:underline"
                  >
                    View Data
                    <ExternalLinkIcon />
                  </Link>
                </div>
              </div>
            ))}
            
            {forms.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-black/5">
                <p className="text-[11px] font-black uppercase text-black/20 tracking-widest mb-6">No forms found</p>
                <button 
                  onClick={() => setShowModal(true)}
                  className="bg-brand-primary text-brand-text px-8 py-3 text-[11px] font-black uppercase tracking-widest"
                >
                  Create Your First Form
                </button>
              </div>
            )}
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
            className="bg-white w-full max-w-md relative z-10 p-10 border-4 border-black"
          >
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Create Form</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest block mb-2">Name</label>
                <input 
                  type="text"
                  autoFocus
                  required
                  className="w-full bg-[#F5F5F5] border border-black/10 px-4 py-3 outline-none focus:border-brand-primary font-bold text-sm"
                  value={newFormName}
                  onChange={(e) => setNewFormName(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-brand-primary text-brand-text px-6 py-4 font-black uppercase tracking-widest text-[11px] hover:bg-black transition-colors"
              >
                Create
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Forms;
