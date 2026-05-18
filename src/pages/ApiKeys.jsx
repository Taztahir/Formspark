import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { apiKeyService } from '../services/apiKeyService';
import Sidebar from '../components/layout/Sidebar';
import toast from 'react-hot-toast';

// Safe SVG Icons
const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
);

const ApiKeys = () => {
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    fetchApiKey();
  }, []);

  const fetchApiKey = async () => {
    try {
      setLoading(true);
      const data = await apiKeyService.getApiKey();
      setApiKey(data);
    } catch (err) {
      toast.error('Failed to load API key');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (apiKey && !confirm('Generating a new key will immediately revoke your current key. Continue?')) return;
    try {
      const data = await apiKeyService.generateApiKey();
      setApiKey(data);
      toast.success('New API key generated');
      setShowKey(true);
    } catch (err) {
      toast.error('Failed to generate key');
    }
  };

  const handleCopy = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey.key);
    toast.success('API key copied to clipboard');
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
            <span className="text-[11px] font-black uppercase tracking-widest text-brand-primary border-b-2 border-brand-primary pb-7 mt-7">API Keys</span>
          </div>
        </header>

        <div className="p-10 max-w-4xl">
          <div className="mb-12">
            <h1 className="text-4xl font-black uppercase tracking-tighter">API Management</h1>
            <p className="text-[13px] font-bold text-black/50 mt-1">Use your secret key to interact with Formspark programmatically.</p>
          </div>

          <div className="space-y-10">
            {/* Key Display */}
            <div className="bg-white border border-black/5 p-10">
              <h3 className="text-[11px] font-black uppercase tracking-widest mb-6">Your Secret Key</h3>
              
              {apiKey ? (
                <div className="space-y-6">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input 
                        type={showKey ? "text" : "password"}
                        readOnly
                        className="w-full bg-black/[0.02] border border-black/5 px-4 py-4 outline-none font-mono text-sm tracking-widest"
                        value={apiKey.key}
                      />
                      <button 
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors"
                      >
                        <EyeIcon />
                      </button>
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="px-6 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary transition-all flex items-center gap-2"
                    >
                      <CopyIcon />
                      Copy
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-black/30">
                    <p>Created on {new Date(apiKey.created_at).toLocaleDateString()}</p>
                    <span className="w-1 h-1 bg-black/10 rounded-full"></span>
                    <button 
                      onClick={handleGenerate}
                      className="text-brand-primary hover:underline flex items-center gap-1"
                    >
                      <RefreshIcon />
                      Regenerate Key
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-black/5">
                  <p className="text-[11px] font-black uppercase text-black/30 tracking-widest mb-6">No active secret key found</p>
                  <button 
                    onClick={handleGenerate}
                    className="bg-brand-primary text-brand-text px-8 py-3 text-[11px] font-black uppercase tracking-widest shadow-[4px_4px_0_rgba(0,0,0,0.1)] hover:bg-[#e67c00] transition-colors"
                  >
                    Generate First Key
                  </button>
                </div>
              )}
            </div>

            {/* Implementation Guide */}
            <div className="bg-[#111] border border-black p-10 text-white">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary mb-8">Implementation Guide</h3>
              
              <div className="space-y-10">
                <div className="space-y-4">
                  <p className="text-xs font-bold text-white/60 uppercase tracking-widest">1. Authentication Header</p>
                  <div className="bg-white/5 p-4 font-mono text-xs border border-white/5">
                    <span className="text-brand-primary">Authorization:</span> Bearer {"<YOUR_SECRET_KEY>"}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-bold text-white/60 uppercase tracking-widest">2. Example Fetch (Submissions)</p>
                  <pre className="bg-white/5 p-6 font-mono text-xs border border-white/5 leading-relaxed overflow-x-auto">
{`fetch('https://formspark.io/api/v1/submissions', {
  headers: {
    'Authorization': 'Bearer \$\{YOUR_KEY\}',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApiKeys;
