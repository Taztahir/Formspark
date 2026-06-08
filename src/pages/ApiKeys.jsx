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
fetch('${import.meta.env.VITE_SUPABASE_URL}/functions/v1/forms/YOUR_FORM_TOKEN/submissions', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ${keyString || 'YOUR_API_KEY'}',
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.catch(err => console.error(err));`,

    curl: `# Fetch form submissions using curl
curl -X GET \\
  "${import.meta.env.VITE_SUPABASE_URL}/functions/v1/forms/YOUR_FORM_TOKEN/submissions" \\
  -H "Authorization: Bearer ${keyString || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json"`,

    python: `# Fetch submissions using python requests library
import requests

url = "${import.meta.env.VITE_SUPABASE_URL}/functions/v1/forms/YOUR_FORM_TOKEN/submissions"
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
      <div className="flex h-screen items-center justify-center bg-brand-bg text-brand-text transition-colors duration-500">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent animate-spin rounded-full"></div>
      </div>
    );
  }

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
              API Tokens
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 md:p-12 max-w-4xl space-y-10 relative z-10 w-full">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-brand-text bg-clip-text text-transparent bg-gradient-to-r from-brand-text to-brand-primary">Developer Credentials</h1>
            <p className="text-sm font-medium text-brand-muted mt-2">Interact with your FormSpark forms, submissions, and settings programmatically using secret access tokens.</p>
          </div>

          {/* Core Key Panel */}
          <div className="bg-brand-card/60 backdrop-blur-xl border border-brand-border/10 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-2xl">
                <KeyIcon />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-brand-text">Secret Developer API Token</h3>
                <p className="text-xs font-medium text-brand-muted mt-1">Keep this credential secret. Do not commit it to GitHub or client frontend code.</p>
              </div>
            </div>

            {apiKey ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input 
                      type="text"
                      readOnly
                      className="w-full bg-brand-bg/50 border border-brand-border/20 rounded-2xl px-5 py-4 outline-none font-mono text-xs text-brand-muted select-all"
                      value={showKey ? keyString : maskedKey}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowKey(!showKey)}
                      className="px-5 py-3.5 border border-brand-border/20 hover:bg-brand-text/5 text-brand-text font-bold text-xs rounded-2xl transition-all shrink-0"
                    >
                      {showKey ? 'Mask Key' : 'Reveal Key'}
                    </button>
                    <button 
                      onClick={() => copyToClipboard(keyString, 'API key copied!')}
                      className="px-5 py-3.5 border border-brand-border/20 hover:bg-brand-text/5 text-brand-text font-bold text-xs rounded-2xl transition-all flex items-center gap-2 shrink-0"
                    >
                      <CopyIcon />
                      Copy Key
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-brand-border/10">
                  <p className="text-xs font-semibold text-brand-muted">Created: {new Date(apiKey.created_at).toLocaleDateString()}</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={handleGenerate}
                      disabled={generating}
                      className="text-xs font-bold text-brand-primary hover:text-brand-primary/80 transition-all flex items-center gap-2"
                    >
                      <RefreshIcon />
                      {generating ? 'Regenerating...' : 'Regenerate API Key'}
                    </button>
                    <button 
                      onClick={handleRevoke}
                      disabled={revoking}
                      className="text-xs font-bold text-red-500 hover:text-red-500/80 transition-all flex items-center gap-2"
                    >
                      <TrashIcon />
                      {revoking ? 'Revoking...' : 'Revoke'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-brand-border/20 rounded-3xl">
                <p className="text-sm font-medium text-brand-muted mb-6">No Developer API Key active for this account.</p>
                <button 
                  onClick={handleGenerate}
                  disabled={generating}
                  className="bg-brand-primary text-brand-bg rounded-2xl px-6 py-3.5 font-bold text-xs hover:opacity-90 transition-all shadow-md"
                >
                  {generating ? 'Generating...' : 'Generate Secret Developer Key'}
                </button>
              </div>
            )}
          </div>

          {/* Documentation Guides */}
          <div className="bg-brand-card/60 backdrop-blur-xl border border-brand-border/10 rounded-3xl p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-brand-primary">API Integration Guide</h3>
              <p className="text-xs font-medium text-brand-muted mt-1">Authenticate requests by passing your token inside the HTTP Headers authorization block.</p>
            </div>

            {/* Language Switch Tabs */}
            <div className="flex border-b border-brand-border/10">
              <button 
                type="button"
                onClick={() => setDocLanguage('js')}
                className={`px-4 py-3 text-xs font-bold transition-all ${
                  docLanguage === 'js' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                JavaScript / Node
              </button>
              <button 
                type="button"
                onClick={() => setDocLanguage('curl')}
                className={`px-4 py-3 text-xs font-bold transition-all ${
                  docLanguage === 'curl' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                cURL Command
              </button>
              <button 
                type="button"
                onClick={() => setDocLanguage('python')}
                className={`px-4 py-3 text-xs font-bold transition-all ${
                  docLanguage === 'python' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                Python Request
              </button>
            </div>

            {/* Snippet Block */}
            <div className="relative">
              <pre className="bg-brand-bg/85 border border-brand-border/15 rounded-2xl p-5 font-mono text-xs text-brand-muted overflow-x-auto leading-relaxed max-w-full">
                {snippets[docLanguage]}
              </pre>
              <button 
                onClick={() => copyToClipboard(snippets[docLanguage], 'Snippet copied!')}
                className="absolute top-3 right-3 bg-brand-primary text-brand-bg rounded-xl px-3.5 py-2 text-xs font-bold hover:opacity-90 transition-all shadow-md"
              >
                Copy snippet
              </button>
            </div>

            <div className="text-xs font-medium text-brand-muted leading-relaxed">
              Note: Replace YOUR_FORM_TOKEN with the unique form token found inside the Form overview page.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApiKeys;
