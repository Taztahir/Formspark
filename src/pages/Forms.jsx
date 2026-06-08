import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useForms } from '../hooks/useForms';
import useAuth from '../hooks/useAuth';
import Sidebar from '../components/layout/Sidebar';
import toast from 'react-hot-toast';

// Custom tab title hook
const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = `${title} — FormSpark`;
  }, [title]);
};

// Safe SVGs
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12" y1="17" y2="17"/></svg>
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
    <div className="flex flex-col lg:flex-row h-screen bg-brand-bg text-brand-text font-sans overflow-hidden transition-colors duration-500 relative">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-bg via-brand-bg to-brand-primary/10 pointer-events-none z-0"></div>
      
      <Sidebar className="z-10 relative" />

      <main className="flex-1 flex flex-col overflow-y-auto relative z-10">
        {/* Glassmorphic Header */}
        <header className="h-24 bg-brand-bg/60 backdrop-blur-xl border-b border-brand-border/10 flex items-center justify-between px-8 md:px-12 shrink-0 transition-colors duration-500 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-brand-text bg-clip-text text-transparent bg-gradient-to-r from-brand-text to-brand-primary">My Forms</h1>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold tracking-tight">{user?.user_metadata?.name || 'Developer'}</p>
                <p className="text-xs font-medium text-brand-muted">{user?.email}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-tr from-brand-primary to-orange-400 text-brand-bg rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-brand-primary/20">
                {user?.user_metadata?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Forms Content */}
        <div className="p-8 md:p-12 flex-1 max-w-7xl mx-auto w-full">
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            {/* Search */}
            <div className="relative w-full sm:max-w-md group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-muted group-focus-within:text-brand-primary transition-colors">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search forms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-brand-card/40 backdrop-blur-sm text-brand-text border border-brand-border/20 rounded-2xl px-12 py-4 text-sm font-medium outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all placeholder-brand-muted shadow-sm hover:bg-brand-card/60"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <Link
                to="/library"
                className="px-6 py-4 rounded-2xl border border-brand-border/20 bg-brand-card/40 backdrop-blur-sm text-brand-text font-bold text-sm hover:bg-brand-card/80 hover:shadow-md transition-all text-center shrink-0 flex items-center justify-center"
              >
                Browse Templates
              </Link>
              <button
                onClick={handleOpenCreateModal}
                className="bg-brand-primary text-brand-bg rounded-2xl px-8 py-4 font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 hover:shadow-xl hover:shadow-brand-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 shrink-0"
              >
                <PlusIcon />
                Create New Form
              </button>
            </div>
          </div>

          {/* Error handling */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-500/10 border border-red-500/20 backdrop-blur-md rounded-2xl p-6 mb-8 text-red-600 flex flex-col gap-4 shadow-lg shadow-red-500/5"
              >
                <p className="font-bold">Error: {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="self-start px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-colors shadow-md"
                >
                  Retry
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Skeleton */}
          {loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-brand-card/30 backdrop-blur-xl border border-brand-border/10 rounded-3xl p-8 shadow-sm animate-pulse space-y-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-4 bg-brand-text/10 rounded-full w-24"></div>
                    <div className="h-6 bg-brand-text/10 rounded-full w-20"></div>
                  </div>
                  <div className="h-6 bg-brand-text/10 rounded-full w-2/3 mb-4"></div>
                  <div className="h-10 bg-brand-text/5 rounded-xl w-full"></div>
                  <div className="pt-6 border-t border-brand-border/10 flex justify-between gap-4 mt-6">
                    <div className="h-10 bg-brand-text/10 rounded-xl w-full"></div>
                    <div className="h-10 bg-brand-text/10 rounded-xl w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredForms.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-brand-card/50 backdrop-blur-2xl border border-brand-border/10 rounded-[32px] p-16 text-center max-w-2xl mx-auto my-16 shadow-2xl shadow-brand-border/5"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-brand-primary/10">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4 text-brand-text">No Forms Found</h2>
              <p className="text-sm font-medium text-brand-muted max-w-md mx-auto mb-10 leading-relaxed">
                {search ? "No forms match your search query. Try another keyword!" : "Create your first form and start collecting submissions in minutes without writing backend code."}
              </p>
              {!search && (
                <button
                  onClick={handleOpenCreateModal}
                  className="bg-gradient-to-r from-brand-primary to-[#ff9e33] text-brand-bg rounded-full px-8 py-4 font-bold text-sm hover:opacity-90 transition-all shadow-xl shadow-brand-primary/20 hover:-translate-y-1 inline-flex items-center gap-2"
                >
                  <PlusIcon /> Create Your First Form
                </button>
              )}
            </motion.div>
          )}

          {/* Cards Grid */}
          {!loading && !error && filteredForms.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredForms.map((form, i) => {
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
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="bg-brand-card/60 backdrop-blur-xl border border-brand-border/10 rounded-3xl p-8 relative flex flex-col justify-between shadow-lg shadow-brand-border/5 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all hover:-translate-y-1 group"
                    >
                      {/* Decorative Background Glow on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/0 to-brand-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                      <div className="relative z-10">
                        {/* Badge / Count Row */}
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-xs font-medium text-brand-muted">{dateFormatted}</span>
                          <div className="bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-full px-3 py-1 text-xs font-bold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse"></span>
                            {subCount} Submissions
                          </div>
                        </div>

                        {/* Name & Token */}
                        <h3 className="text-2xl font-bold tracking-tight text-brand-text mb-4 leading-tight">
                          {form.name}
                        </h3>

                        {/* Token chip */}
                        <div className="flex items-center gap-3 bg-brand-bg/80 border border-brand-border/10 rounded-2xl px-4 py-3 mb-8 w-full group-hover:bg-brand-bg transition-colors">
                          <span className="font-mono text-xs text-brand-muted truncate flex-1">{form.token}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(form.token, 'Token copied!')}
                            className="text-brand-muted hover:text-brand-primary transition-colors p-1"
                            title="Copy Token"
                          >
                            <CopyIcon />
                          </button>
                        </div>
                      </div>

                      {/* Action buttons footer */}
                      <div className="pt-6 border-t border-brand-border/10 grid grid-cols-4 gap-3 relative z-10">
                        <Link
                          to={`/dashboard/submissions/${form.token}`}
                          title="View Data"
                          className="flex items-center justify-center bg-brand-text/5 hover:bg-brand-primary hover:text-brand-bg text-brand-text rounded-xl py-3 transition-colors"
                        >
                          <EyeIcon />
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedForm(form);
                            setShowEmbedModal(true);
                          }}
                          title="Embed Code"
                          className="flex items-center justify-center bg-brand-text/5 hover:bg-brand-primary hover:text-brand-bg text-brand-text rounded-xl py-3 transition-colors"
                        >
                          <CodeIcon />
                        </button>

                        <Link
                          to={`/dashboard/forms/${form.token}/settings`}
                          title="Settings"
                          className="flex items-center justify-center bg-brand-text/5 hover:bg-brand-primary hover:text-brand-bg text-brand-text rounded-xl py-3 transition-colors"
                        >
                          <SettingsIcon />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleOpenDeleteModal(form)}
                          title="Delete"
                          className="flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl py-3 transition-colors"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* CREATE FORM MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-bg/80 backdrop-blur-md" onClick={() => setShowCreateModal(false)} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-brand-card/90 backdrop-blur-2xl w-full max-w-lg relative z-10 p-10 border border-brand-border/20 rounded-[32px] shadow-2xl shadow-brand-border/10"
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-6 right-6 text-brand-muted hover:text-brand-text font-bold text-xl transition-colors p-2"
              >
                ✕
              </button>

              <h2 className="text-3xl font-bold tracking-tight mb-2">Create Form</h2>
              <p className="text-sm font-medium text-brand-muted mb-8">Connect any HTML frontend to start collecting data.</p>

              <form onSubmit={handleFormCreateSubmit} className="space-y-6">
                <div>
                  <label className="text-xs font-bold block mb-2 text-brand-text">Form Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Contact Form"
                    className="w-full bg-brand-bg/50 border border-brand-border/20 rounded-2xl px-5 py-4 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 text-brand-text font-medium text-sm transition-all"
                    value={formNameInput}
                    onChange={(e) => setFormNameInput(e.target.value)}
                  />
                  <div className="mt-3 text-right">
                    <Link
                      to="/library"
                      onClick={() => setShowCreateModal(false)}
                      className="text-xs font-bold text-brand-primary hover:text-brand-primary/80 transition-colors flex items-center justify-end gap-1"
                    >
                      Start from a template <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Link>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-2 text-brand-text">Notification Email</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full bg-brand-bg/50 border border-brand-border/20 rounded-2xl px-5 py-4 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 text-brand-text font-medium text-sm transition-all"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                  />
                </div>

                {/* Toggles */}
                <div className="space-y-4 pt-4">
                  <label className="flex items-center justify-between cursor-pointer border border-brand-border/10 rounded-2xl p-5 hover:bg-brand-bg/50 transition-all bg-brand-card/50">
                    <div>
                      <p className="text-sm font-bold text-brand-text">Email Notifications</p>
                      <p className="text-xs text-brand-muted font-medium mt-1">Alert me on new responses</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${emailNotifications ? 'bg-brand-primary' : 'bg-brand-border/20'}`}>
                       <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${emailNotifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer border border-brand-border/10 rounded-2xl p-5 hover:bg-brand-bg/50 transition-all bg-brand-card/50">
                    <div>
                      <p className="text-sm font-bold text-brand-text">Spam Protection</p>
                      <p className="text-xs text-brand-muted font-medium mt-1">Verify and block bots</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${spamProtection ? 'bg-brand-primary' : 'bg-brand-border/20'}`}>
                       <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${spamProtection ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={spamProtection}
                      onChange={(e) => setSpamProtection(e.target.checked)}
                    />
                  </label>
                </div>

                <div className="flex gap-4 pt-8">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 border border-brand-border/20 rounded-full text-brand-text py-4 font-bold text-sm hover:bg-brand-text/5 transition-all text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-brand-primary text-brand-bg rounded-full py-4 font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-brand-primary/20"
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-brand-bg/80 backdrop-blur-md" onClick={() => setShowEmbedModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-brand-card/90 backdrop-blur-2xl w-full max-w-2xl relative z-10 p-10 border border-brand-border/20 rounded-[32px] shadow-2xl shadow-brand-border/10"
            >
              <button
                onClick={() => setShowEmbedModal(false)}
                className="absolute top-6 right-6 text-brand-muted hover:text-brand-text font-bold text-xl transition-colors p-2"
              >
                ✕
              </button>

              <h2 className="text-3xl font-bold tracking-tight mb-2">Integration Snippet</h2>
              <p className="text-sm font-medium text-brand-primary mb-8">
                Form: <span className="font-bold">{selectedForm.name}</span>
              </p>

              {/* Tabs */}
              <div className="flex gap-2 p-1 bg-brand-bg/50 rounded-2xl mb-8">
                <button
                  type="button"
                  onClick={() => setEmbedTab('script')}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                    embedTab === 'script' ? 'bg-brand-card shadow-sm text-brand-text' : 'text-brand-muted hover:text-brand-text'
                  }`}
                >
                  HTML Script
                </button>
                <button
                  type="button"
                  onClick={() => setEmbedTab('react')}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                    embedTab === 'react' ? 'bg-brand-card shadow-sm text-brand-text' : 'text-brand-muted hover:text-brand-text'
                  }`}
                >
                  React Component
                </button>
              </div>

              {/* Tab Contents */}
              <div className="relative group">
                <pre className="bg-[#111111] text-[#F4F4F0] p-6 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-[#333] mb-8 select-all">
                  {embedTab === 'script' ? (
`<script src="https://formspark-five.vercel.app/plugin/formspark.js"></script>
<form data-formspark="${selectedForm.token}">
  <input type="text" name="name" placeholder="Your name" />
  <input type="email" name="email" placeholder="Email address" />
  <textarea name="message" placeholder="Your message"></textarea>
  <button type="submit">Send Message</button>
</form>`
                  ) : (
`import { useEffect } from 'react'

export default function ContactForm() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://formspark-five.vercel.app/plugin/formspark.js'
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
}`
                  )}
                </pre>

                <button
                  type="button"
                  onClick={() => {
                    const text = embedTab === 'script' 
                      ? `<script src="https://formspark-five.vercel.app/plugin/formspark.js"></script>\n<form data-formspark="${selectedForm.token}">\n  <input type="text" name="name" placeholder="Your name" />\n  <input type="email" name="email" placeholder="Email address" />\n  <textarea name="message" placeholder="Your message"></textarea>\n  <button type="submit">Send Message</button>\n</form>`
                      : `import { useEffect } from 'react'\n\nexport default function ContactForm() {\n  useEffect(() => {\n    const script = document.createElement('script')\n    script.src = 'https://formspark-five.vercel.app/plugin/formspark.js'\n    document.body.appendChild(script)\n    return () => document.body.removeChild(script)\n  }, [])\n\n  return (\n    <form data-formspark="${selectedForm.token}">\n      <input type="text" name="name" placeholder="Your name" />\n      <input type="email" name="email" placeholder="Email address" />\n      <textarea name="message" placeholder="Your message" />\n      <button type="submit">Send Message</button>\n    </form>\n  )\n}`;
                    copyToClipboard(text, 'Snippet copied!');
                  }}
                  className="absolute right-4 top-4 bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2 text-xs font-bold transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2"
                >
                  <CopyIcon /> Copy
                </button>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-xs font-medium text-brand-muted leading-relaxed">
                  Replace TOKEN with your form token. Style fields however you like.
                </p>
                <button
                  onClick={() => setShowEmbedModal(false)}
                  className="bg-brand-text text-brand-bg rounded-full px-8 py-3 font-bold text-sm hover:opacity-90 transition-colors"
                >
                  Done
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-brand-bg/80 backdrop-blur-md" onClick={() => setShowDeleteModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-brand-card/90 backdrop-blur-2xl w-full max-w-lg relative z-10 p-10 border border-red-500/20 rounded-[32px] shadow-2xl shadow-red-500/10"
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                className="absolute top-6 right-6 text-brand-muted hover:text-brand-text font-bold text-xl transition-colors p-2"
              >
                ✕
              </button>

              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <AlertIcon />
              </div>
              
              <h2 className="text-3xl font-bold tracking-tight text-red-500 mb-4">Delete Form</h2>

              <p className="text-sm font-medium text-brand-text mb-8 leading-relaxed">
                This will permanently delete <span className="font-bold">{selectedForm.name}</span> and all associated submissions. <span className="text-red-500 font-bold">This action cannot be undone.</span>
              </p>

              <form onSubmit={handleFormDeleteSubmit} className="space-y-6">
                <div>
                  <label className="text-xs font-bold block mb-2 text-brand-text">
                    Type <span className="font-mono bg-brand-bg px-2 py-1 rounded text-red-500 select-all">{selectedForm.name}</span> to confirm
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter form name exactly"
                    className="w-full bg-brand-bg/50 border border-brand-border/20 rounded-2xl px-5 py-4 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-brand-text font-medium text-sm transition-all"
                    value={deleteConfirmName}
                    onChange={(e) => setDeleteConfirmName(e.target.value)}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 border border-brand-border/20 rounded-full text-brand-text py-4 font-bold text-sm hover:bg-brand-text/5 transition-all text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || deleteConfirmName !== selectedForm.name}
                    className="flex-1 bg-red-500 text-white rounded-full py-4 font-bold text-sm hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
                  >
                    {submitting ? 'Deleting...' : 'Yes, Delete Form'}
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
