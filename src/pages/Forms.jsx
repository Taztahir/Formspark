import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useForms } from '../hooks/useForms';
import useAuth from '../hooks/useAuth';
import Sidebar from '../components/layout/Sidebar';
import toast from 'react-hot-toast';

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = `${title} — FormSpark`;
  }, [title]);
};

// Safe SVGs
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12" y1="17" y2="17"/></svg>
);

const Forms = () => {
  useDocumentTitle('Forms');
  const { user } = useAuth();
  
  const { forms, loading, error, handleCreate, handleDelete } = useForms();

  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Modals data state
  const [selectedForm, setSelectedForm] = useState(null);
  const [formNameInput, setFormNameInput] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [spamProtection, setSpamProtection] = useState(true);

  const [embedTab, setEmbedTab] = useState('script'); // 'script' or 'react'
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Prefill email once user loads
  useEffect(() => {
    if (user?.email) {
      setNotificationEmail(user.email);
    }
  }, [user]);

  // Handle ESC key for closing modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowCreateModal(false);
        setShowEmbedModal(false);
        setShowDeleteModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenCreateModal = () => {
    setFormNameInput('');
    setNotificationEmail(user?.email || '');
    setEmailNotifications(true);
    setSpamProtection(true);
    setShowCreateModal(true);
  };

  const handleFormCreateSubmit = async (e) => {
    e.preventDefault();
    if (formNameInput.length < 3) {
      toast.error('Form name must be at least 3 characters');
      return;
    }
    setSubmitting(true);
    try {
      const newForm = await handleCreate({
        name: formNameInput,
        notification_email: notificationEmail,
        email_notifications: emailNotifications,
        spam_protection: spamProtection,
      });
      toast.success('Form created successfully!');
      setShowCreateModal(false);
      
      // Auto open embed modal for the newly created form
      setSelectedForm(newForm);
      setShowEmbedModal(true);
    } catch (err) {
      toast.error(err.message || 'Failed to create form');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text, message = 'Copied to clipboard!') => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const handleOpenDeleteModal = (form) => {
    setSelectedForm(form);
    setDeleteConfirmName('');
    setShowDeleteModal(true);
  };

  const handleFormDeleteSubmit = async (e) => {
    e.preventDefault();
    if (deleteConfirmName !== selectedForm.name) {
      toast.error('Form name does not match');
      return;
    }
    setSubmitting(true);
    try {
      await handleDelete(selectedForm.token);
      toast.success('Form deleted successfully');
      setShowDeleteModal(false);
    } catch (err) {
      toast.error(err.message || 'Failed to delete form');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredForms = forms.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#F5F5F5] font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="h-20 bg-white border-b border-black/5 flex items-center justify-between px-6 md:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black uppercase tracking-tight text-brand-text">My Forms</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pl-6 border-l border-black/5">
              <div className="text-right">
                <p className="text-[11px] font-black uppercase tracking-tight">{user?.user_metadata?.name || 'Developer'}</p>
                <p className="text-[10px] font-bold text-black/40 lowercase">{user?.email}</p>
              </div>
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black text-xs border border-brand-border">
                {user?.user_metadata?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Forms Content */}
        <div className="p-6 md:p-10 flex-1">
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black/40">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search forms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border-2 border-black/5 px-10 py-2.5 text-xs font-bold outline-none focus:border-brand-primary transition-colors placeholder-black/35"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/library"
                className="px-5 py-2.5 border-2 border-black text-brand-text font-black uppercase tracking-widest text-[10px] hover:bg-black/5 transition-colors text-center shrink-0"
              >
                Browse Templates
              </Link>
              <button
                onClick={handleOpenCreateModal}
                className="bg-brand-primary text-brand-text border-2 border-brand-border px-5 py-2.5 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-[#e67c00] transition-colors shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none shrink-0"
              >
                <PlusIcon />
                Create New Form
              </button>
            </div>
          </div>

          {/* Error handling */}
          {error && (
            <div className="bg-red-50 border-2 border-red-500 p-6 mb-8 text-red-700 flex flex-col gap-4">
              <p className="font-bold text-sm">Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="self-start px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_rgba(0,0,0,0.05)] animate-pulse space-y-6">
                  <div className="h-6 bg-black/10 w-2/3"></div>
                  <div className="h-4 bg-black/5 w-1/2"></div>
                  <div className="pt-6 border-t border-black/5 flex justify-between">
                    <div className="h-8 bg-black/10 w-24"></div>
                    <div className="h-8 bg-black/10 w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredForms.length === 0 && (
            <div className="bg-white border-4 border-black p-16 text-center max-w-2xl mx-auto my-12 shadow-[12px_12px_0_rgba(0,0,0,1)]">
              <div className="w-20 h-20 bg-brand-primary/10 border-2 border-dashed border-brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--color-brand-primary)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">No Forms Found</h2>
              <p className="text-xs font-bold text-black/50 max-w-md mx-auto mb-8 leading-relaxed">
                {search ? "No forms match your search query. Try another keyword!" : "Create your first form and start collecting submissions in minutes without writing backend code."}
              </p>
              {!search && (
                <button
                  onClick={handleOpenCreateModal}
                  className="bg-brand-primary text-brand-text border-2 border-brand-border px-6 py-3 font-black uppercase tracking-widest text-xs hover:bg-[#e67c00] transition-colors shadow-[6px_6px_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  Create Your First Form
                </button>
              )}
            </div>
          )}

          {/* Cards Grid */}
          {!loading && !error && filteredForms.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredForms.map((form) => {
                const dateFormatted = new Date(form.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });
                const subCount = form.submissions?.[0]?.count || 0;

                return (
                  <motion.div
                    key={form.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border-4 border-black p-8 relative flex flex-col justify-between shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0_rgba(0,0,0,1)] transition-all group"
                  >
                    <div>
                      {/* Badge / Count Row */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] font-mono text-black/40 uppercase font-black">{dateFormatted}</span>
                        <div className="bg-brand-primary text-brand-text border border-black px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest">
                          {subCount} SUBMISSIONS
                        </div>
                      </div>

                      {/* Name & Token */}
                      <h3 className="text-xl font-black uppercase tracking-tight text-brand-text group-hover:text-brand-primary transition-colors mb-2 leading-none">
                        {form.name}
                      </h3>

                      {/* Token monospaced chip */}
                      <div className="inline-flex items-center gap-2 bg-[#F5F5F5] border border-black/10 px-3 py-1.5 mb-8 w-full max-w-sm">
                        <span className="font-mono text-[10px] font-bold text-black/60 truncate flex-1">{form.token}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(form.token, 'Token copied!')}
                          className="text-black/45 hover:text-brand-primary transition-colors shrink-0"
                          title="Copy Token"
                        >
                          <CopyIcon />
                        </button>
                      </div>
                    </div>

                    {/* Action buttons footer */}
                    <div className="pt-6 border-t border-black/5 grid grid-cols-2 sm:flex sm:items-center gap-3">
                      <Link
                        to={`/dashboard/submissions/${form.token}`}
                        className="flex-1 bg-black text-white hover:bg-brand-primary hover:text-brand-text border-2 border-black py-2.5 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-center"
                      >
                        <EyeIcon />
                        Data
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedForm(form);
                          setShowEmbedModal(true);
                        }}
                        className="flex-1 border-2 border-black hover:bg-black hover:text-white py-2.5 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                      >
                        <CodeIcon />
                        Embed
                      </button>

                      <Link
                        to={`/dashboard/forms/${form.token}/settings`}
                        className="flex-1 border-2 border-black hover:bg-black hover:text-white py-2.5 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-center"
                      >
                        <SettingsIcon />
                        Config
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleOpenDeleteModal(form)}
                        className="flex-1 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-2.5 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                      >
                        <TrashIcon />
                        Delete
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* CREATE FORM MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="bg-white w-full max-w-md relative z-10 p-8 border-4 border-black shadow-[12px_12px_0_rgba(0,0,0,1)]"
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-black/50 hover:text-black font-black text-lg transition-colors"
              >
                ✕
              </button>

              <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">Create New Form</h2>
              <p className="text-[10px] font-bold text-black/40 mb-6 uppercase tracking-widest">Connect any HTML frontend to start collecting data.</p>

              <form onSubmit={handleFormCreateSubmit} className="space-y-4">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest block mb-1 text-black/70">Form Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Contact Form"
                    className="w-full bg-[#F5F5F5] border-2 border-black px-4 py-2.5 outline-none focus:border-brand-primary font-bold text-xs transition-colors rounded-none"
                    value={formNameInput}
                    onChange={(e) => setFormNameInput(e.target.value)}
                  />
                  <div className="mt-2 text-right">
                    <Link
                      to="/library"
                      onClick={() => setShowCreateModal(false)}
                      className="text-[9px] font-black uppercase text-brand-primary hover:underline"
                    >
                      Start from a template &rarr;
                    </Link>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest block mb-1 text-black/70">Notification Email</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full bg-[#F5F5F5] border-2 border-black px-4 py-2.5 outline-none focus:border-brand-primary font-bold text-xs transition-colors rounded-none"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                  />
                </div>

                {/* Toggles */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-center justify-between cursor-pointer border border-black/5 p-3 hover:bg-black/[0.01] transition-all">
                    <div>
                      <p className="text-[10px] font-black uppercase text-brand-text">Email Notifications</p>
                      <p className="text-[8px] text-black/40 font-bold uppercase tracking-widest">Alert me on new responses</p>
                    </div>
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded-sm border-black text-brand-primary focus:ring-brand-primary accent-brand-primary"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer border border-black/5 p-3 hover:bg-black/[0.01] transition-all">
                    <div>
                      <p className="text-[10px] font-black uppercase text-brand-text">Spam Protection</p>
                      <p className="text-[8px] text-black/40 font-bold uppercase tracking-widest">Verify and block bots</p>
                    </div>
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded-sm border-black text-brand-primary focus:ring-brand-primary accent-brand-primary"
                      checked={spamProtection}
                      onChange={(e) => setSpamProtection(e.target.checked)}
                    />
                  </label>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 border-2 border-black py-3 font-black uppercase tracking-widest text-[10px] hover:bg-black/5 transition-all text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-brand-primary text-brand-text border-2 border-black py-3 font-black uppercase tracking-widest text-[10px] hover:bg-[#e67c00] transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Creating...' : 'Create Form'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EMBED CODE MODAL */}
      <AnimatePresence>
        {showEmbedModal && selectedForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEmbedModal(false)}></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="bg-white w-full max-w-2xl relative z-10 p-8 border-4 border-black shadow-[12px_12px_0_rgba(0,0,0,1)]"
            >
              <button
                onClick={() => setShowEmbedModal(false)}
                className="absolute top-4 right-4 text-black/50 hover:text-black font-black text-lg transition-colors"
              >
                ✕
              </button>

              <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">Integration Snippet</h2>
              <p className="text-[10px] font-bold text-brand-primary mb-6 uppercase tracking-widest">
                Form: {selectedForm.name}
              </p>

              {/* Tabs */}
              <div className="flex border-b-2 border-black mb-6">
                <button
                  type="button"
                  onClick={() => setEmbedTab('script')}
                  className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    embedTab === 'script' ? 'bg-black text-white' : 'text-black/55 hover:bg-black/5'
                  }`}
                >
                  Script Tag
                </button>
                <button
                  type="button"
                  onClick={() => setEmbedTab('react')}
                  className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    embedTab === 'react' ? 'bg-black text-white' : 'text-black/55 hover:bg-black/5'
                  }`}
                >
                  React Component
                </button>
              </div>

              {/* Tab Contents */}
              <div className="relative">
                {embedTab === 'script' ? (
                  <pre className="bg-[#111] text-white p-5 font-mono text-[10px] overflow-x-auto leading-relaxed border border-black mb-6 select-all">
{`<script src="https://formspark.io/formspark.js"></script>
<form data-formspark="${selectedForm.token}">
  <input type="text" name="name" placeholder="Your name" />
  <input type="email" name="email" placeholder="Email address" />
  <textarea name="message" placeholder="Your message"></textarea>
  <button type="submit">Send Message</button>
</form>`}
                  </pre>
                ) : (
                  <pre className="bg-[#111] text-white p-5 font-mono text-[10px] overflow-x-auto leading-relaxed border border-black mb-6 select-all">
{`import { useEffect } from 'react'

export default function ContactForm() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://formspark.io/formspark.js'
    document.body.appendChild(script)
    return () => document.body.removeChild(script)
  }, [])

  return (
    <form data-formspark="${selectedForm.token}">
      <input type="text" name="name" placeholder="Your name" />
      <input type="email" name="email" placeholder="Email address" />
      <textarea name="message" placeholder="Your message" />
      <button type="submit">Send Message</button>
    </form>
  )
}`}
                  </pre>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const text = embedTab === 'script' 
                      ? `<script src="https://formspark.io/formspark.js"></script>\n<form data-formspark="${selectedForm.token}">\n  <input type="text" name="name" placeholder="Your name" />\n  <input type="email" name="email" placeholder="Email address" />\n  <textarea name="message" placeholder="Your message"></textarea>\n  <button type="submit">Send Message</button>\n</form>`
                      : `import { useEffect } from 'react'\n\nexport default function ContactForm() {\n  useEffect(() => {\n    const script = document.createElement('script')\n    script.src = 'https://formspark.io/formspark.js'\n    document.body.appendChild(script)\n    return () => document.body.removeChild(script)\n  }, [])\n\n  return (\n    <form data-formspark="${selectedForm.token}">\n      <input type="text" name="name" placeholder="Your name" />\n      <input type="email" name="email" placeholder="Email address" />\n      <textarea name="message" placeholder="Your message" />\n      <button type="submit">Send Message</button>\n    </form>\n  )\n}`;
                    copyToClipboard(text, 'Snippet copied!');
                  }}
                  className="absolute right-3 top-3 bg-brand-primary text-brand-text border border-black px-3 py-1.5 text-[9px] font-black uppercase tracking-widest hover:bg-[#e67c00] transition-colors"
                >
                  Copy Snippet
                </button>
              </div>

              <p className="text-[10px] font-bold text-black/40 leading-relaxed uppercase tracking-wider">
                Note: Replace TOKEN with your form token. Style the HTML form fields however you like.
              </p>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowEmbedModal(false)}
                  className="bg-black text-white border-2 border-black px-6 py-2.5 font-black uppercase tracking-widest text-[10px] hover:bg-brand-primary hover:text-brand-text transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {showDeleteModal && selectedForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="bg-white w-full max-w-md relative z-10 p-8 border-4 border-red-500 shadow-[12px_12px_0_rgba(0,0,0,1)]"
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                className="absolute top-4 right-4 text-black/50 hover:text-black font-black text-lg transition-colors"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-4">
                <AlertIcon />
                <h2 className="text-2xl font-black uppercase tracking-tighter text-red-500">Delete Form</h2>
              </div>

              <p className="text-xs font-bold text-black/60 mb-6 uppercase tracking-wider leading-relaxed">
                This will permanently delete <span className="text-black font-black">{selectedForm.name}</span> and all associated submissions. <span className="text-red-500 font-black">This action cannot be undone.</span>
              </p>

              <form onSubmit={handleFormDeleteSubmit} className="space-y-4">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest block mb-2 text-black/70">
                    Type <span className="font-black text-black select-all">"{selectedForm.name}"</span> to confirm
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter form name exactly"
                    className="w-full bg-[#F5F5F5] border-2 border-black px-4 py-2.5 outline-none focus:border-red-500 font-bold text-xs transition-colors rounded-none"
                    value={deleteConfirmName}
                    onChange={(e) => setDeleteConfirmName(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 border-2 border-black py-3 font-black uppercase tracking-widest text-[10px] hover:bg-black/5 transition-colors text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || deleteConfirmName !== selectedForm.name}
                    className="flex-1 bg-red-500 text-white border-2 border-red-500 py-3 font-black uppercase tracking-widest text-[10px] hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Forms;
