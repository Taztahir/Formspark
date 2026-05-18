import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getApiKey, generateApiKey, deleteApiKey } from '../services/apiKeyService';
import Sidebar from '../components/layout/Sidebar';
import toast from 'react-hot-toast';

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = `${title} — FormSpark`;
  }, [title]);
};

// Safe SVGs
const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);

const KeyIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3M17 6l3 3"/></svg>
);

const ApiKeys = () => {
  useDocumentTitle('API Keys');
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [revoking, setRevoking] = useState(false);
  
  // Documentation language tab state
  const [docLanguage, setDocLanguage] = useState('js'); // 'js', 'curl', 'python'

  useEffect(() => {
    fetchApiKey();
  }, []);

  const fetchApiKey = async () => {
    try {
      setLoading(true);
      const data = await getApiKey();
      setApiKey(data);
    } catch (err) {
      toast.error('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (apiKey) {
      const confirmText = 'Generating a new API key will immediately revoke and invalidate your current key. Any applications using it will lose access. Continue?';
      if (!window.confirm(confirmText)) return;
    }
    setGenerating(true);
    try {
      const data = await generateApiKey();
      setApiKey(data);
      setShowKey(true);
      toast.success('Developer API Key generated!');
    } catch (err) {
      toast.error('Failed to generate key');
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async () => {
    if (!apiKey) return;
    if (!window.confirm('Are you sure you want to revoke this API Key? Programmatic accesses relying on it will immediately fail.')) return;
    setRevoking(true);
    try {
      await deleteApiKey(apiKey.id);
      setApiKey(null);
      toast.success('API Key revoked successfully');
    } catch (err) {
      toast.error('Failed to revoke API key');
    } finally {
      setRevoking(false);
    }
  };

  const copyToClipboard = (text, message = 'Copied to clipboard!') => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const keyString = apiKey?.id || apiKey?.key || '';
  const maskedKey = keyString ? `fs_live_${keyString.substring(0, 8)}****************` : '';

  // Snippets definition
  const snippets = {
    js: `// Fetch form submissions via FormSpark Developer API
fetch('https://api.formspark.io/v1/forms/YOUR_FORM_TOKEN/submissions', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ${keyString || 'YOUR_API_KEY'}',
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));`,

    curl: `# Fetch form submissions using curl
curl -X GET \\
  "https://api.formspark.io/v1/forms/YOUR_FORM_TOKEN/submissions" \\
  -H "Authorization: Bearer ${keyString || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json"`,

    python: `# Fetch submissions using python requests library
import requests

url = "https://api.formspark.io/v1/forms/YOUR_FORM_TOKEN/submissions"
headers = {
    "Authorization": "Bearer ${keyString || 'YOUR_API_KEY'}",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)
if response.status_code == 200:
    submissions = response.json()
    print(submissions)
else:
    print(f"Failed: {response.status_code}")`
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5F5F5]">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#F5F5F5] font-sans overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="h-20 bg-white border-b border-black/5 flex items-center justify-between px-6 md:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-[11px] font-black uppercase text-black/40 hover:text-black transition-colors">Dashboard</Link>
            <span className="text-black/20">/</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-brand-primary border-b-2 border-brand-primary pb-7 mt-7">
              API Tokens
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-10 max-w-4xl space-y-12">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Developer Credentials</h1>
            <p className="text-[13px] font-bold text-black/50 mt-1">Interact with your FormSpark forms, submissions, and settings programmatically using secret access tokens.</p>
          </div>

          {/* Core Key Panel */}
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-primary/10 border border-brand-primary text-brand-primary">
                <KeyIcon />
              </div>
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-widest">Secret Developer API Token</h3>
                <p className="text-[9px] font-bold text-black/40 uppercase mt-0.5 tracking-wider">Keep this credential secret. Do not commit it to GitHub or client frontend code.</p>
              </div>
            </div>

            {apiKey ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input 
                      type={showKey ? "text" : "text"}
                      readOnly
                      className="w-full bg-[#111] text-white border-2 border-black px-4 py-3 outline-none font-mono text-[10px] select-all"
                      value={showKey ? keyString : maskedKey}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowKey(!showKey)}
                      className="px-4 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors text-[9px] font-black uppercase tracking-wider shrink-0"
                    >
                      {showKey ? 'Mask Key' : 'Reveal Key'}
                    </button>
                    <button 
                      onClick={() => copyToClipboard(keyString, 'API key copied!')}
                      className="px-4 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors text-[9px] font-black uppercase tracking-wider flex items-center gap-2 shrink-0"
                    >
                      <CopyIcon />
                      Copy Key
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-black/5">
                  <p className="text-[9px] font-bold text-black/40 uppercase tracking-widest">Created: {new Date(apiKey.created_at).toLocaleDateString()}</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={handleGenerate}
                      disabled={generating}
                      className="text-[9px] font-black text-brand-primary uppercase hover:underline flex items-center gap-1.5"
                    >
                      <RefreshIcon />
                      {generating ? 'Regenerating...' : 'Regenerate API Key'}
                    </button>
                    <button 
                      onClick={handleRevoke}
                      disabled={revoking}
                      className="text-[9px] font-black text-red-500 uppercase hover:underline flex items-center gap-1.5"
                    >
                      <TrashIcon />
                      {revoking ? 'Revoking...' : 'Revoke'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-black/10">
                <p className="text-[10px] text-black/35 font-bold uppercase mb-6">No Developer API Key active for this account.</p>
                <button 
                  onClick={handleGenerate}
                  disabled={generating}
                  className="bg-brand-primary text-brand-text border-2 border-black px-6 py-3 font-black uppercase tracking-widest text-[9px] hover:bg-[#e67c00] transition-colors shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  {generating ? 'Generating...' : 'Generate Secret Developer Key'}
                </button>
              </div>
            )}
          </div>

          {/* Documentation Guides */}
          <div className="bg-[#111] border-4 border-black p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] text-white space-y-6">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">API Integration Guide</h3>
              <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest mt-1">Authenticate requests by passing your token inside the HTTP Headers authorization block.</p>
            </div>

            {/* Language Switch Tabs */}
            <div className="flex border-b border-white/10">
              <button 
                type="button"
                onClick={() => setDocLanguage('js')}
                className={`px-4 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all ${
                  docLanguage === 'js' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-white/45 hover:text-white'
                }`}
              >
                JavaScript / Node
              </button>
              <button 
                type="button"
                onClick={() => setDocLanguage('curl')}
                className={`px-4 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all ${
                  docLanguage === 'curl' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-white/45 hover:text-white'
                }`}
              >
                cURL Command
              </button>
              <button 
                type="button"
                onClick={() => setDocLanguage('python')}
                className={`px-4 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all ${
                  docLanguage === 'python' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-white/45 hover:text-white'
                }`}
              >
                Python Request
              </button>
            </div>

            {/* Snippet Block */}
            <div className="relative">
              <pre className="bg-[#0a0a0a] border border-white/5 p-5 font-mono text-[9px] text-white/80 overflow-x-auto leading-relaxed max-w-full">
                {snippets[docLanguage]}
              </pre>
              <button 
                onClick={() => copyToClipboard(snippets[docLanguage], 'Snippet copied!')}
                className="absolute top-3 right-3 bg-brand-primary text-brand-text border border-black px-3 py-1.5 text-[8px] font-black uppercase tracking-widest hover:bg-[#e67c00] transition-colors"
              >
                Copy snippet
              </button>
            </div>

            <div className="pt-2 text-[8px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">
              Note: Replace YOUR_FORM_TOKEN with the unique form token found inside the Form overview page.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApiKeys;
