import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getFormByToken, updateForm, deleteForm } from '../services/formsService';
import { getTeamMembers, inviteMember, updateMemberRole, removeMember } from '../services/teamService';
import { getApiKey, generateApiKey, deleteApiKey } from '../services/apiKeyService';
import { supabase } from '../lib/supabase'; // used for team/webhook/api-key operations
import Sidebar from '../components/layout/Sidebar';
import toast from 'react-hot-toast';

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = `${title} — FormSpark`;
  }, [title]);
};

// Safe SVGs
const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12" y1="17" y2="17"/></svg>
);

const FormSettings = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  useDocumentTitle('Form Configuration');

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  // General state
  const [name, setName] = useState('');
  const [savingGeneral, setSavingGeneral] = useState(false);

  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notificationEmail, setNotificationEmail] = useState('');
  const [savingNotifications, setSavingNotifications] = useState(false);
  

  // Redirects state
  const [redirectUrl, setRedirectUrl] = useState('');
  const [savingRedirects, setSavingRedirects] = useState(false);

  // Security state
  const [allowedOrigins, setAllowedOrigins] = useState('');
  const [spamBlacklist, setSpamBlacklist] = useState('');
  const [spamProtection, setSpamProtection] = useState(true);
  const [savingSecurity, setSavingSecurity] = useState(false);

  // Webhooks state
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSignatureEnabled, setWebhookSignatureEnabled] = useState(true);
  const [savingWebhooks, setSavingWebhooks] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);

  // Team state
  const [teamMembers, setTeamMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [inviting, setInviting] = useState(false);
  const [fetchingTeam, setFetchingTeam] = useState(false);

  // API Keys state
  const [apiKey, setApiKey] = useState(null);
  const [fetchingApiKey, setFetchingApiKey] = useState(false);
  const [generatingApiKey, setGeneratingApiKey] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Danger Zone delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [deletingForm, setDeletingForm] = useState(false);

  useEffect(() => {
    const loadAllFormSettings = async () => {
      try {
        setLoading(true);
        const data = await getFormByToken(token);
        setForm(data);
        
        // Map general data
        setName(data.name || '');
        setEmailNotifications(data.email_notifications ?? true);
        setNotificationEmail(data.notification_email || '');
        setRedirectUrl(data.redirect_url || '');
        setAllowedOrigins(data.allowed_origins?.join(', ') || '');
        setSpamBlacklist(data.spam_blacklist?.join(', ') || '');
        setSpamProtection(data.spam_protection ?? true);
        setWebhookUrl(data.webhook_url || '');
        setWebhookSignatureEnabled(data.webhook_signature_enabled ?? true);
      } catch (err) {
        toast.error('Form settings failed to load');
      } finally {
        setLoading(false);
      }
    };
    if (token) loadAllFormSettings();
  }, [token]);

  // Load team members and API keys once form exists
  useEffect(() => {
    if (!form?.id) return;
    loadTeamList();
    loadDeveloperApiKey();
  }, [form]);

  const loadTeamList = async () => {
    try {
      setFetchingTeam(true);
      const members = await getTeamMembers(form.id);
      setTeamMembers(members);
    } catch (err) {
      console.error('Failed to load team members:', err);
    } finally {
      setFetchingTeam(false);
    }
  };

  const loadDeveloperApiKey = async () => {
    try {
      setFetchingApiKey(true);
      const key = await getApiKey();
      setApiKey(key);
    } catch (err) {
      console.error('Failed to load API keys:', err);
    } finally {
      setFetchingApiKey(false);
    }
  };

  // Section Save actions
  const saveGeneral = async (e) => {
    if (e) e.preventDefault();
    if (name.length < 3) return toast.error('Name must be at least 3 characters');
    setSavingGeneral(true);
    try {
      const updated = await updateForm(token, { name });
      setForm(updated);
      toast.success('General settings saved!');
    } catch (err) {
      toast.error('Failed to save name');
    } finally {
      setSavingGeneral(false);
    }
  };

  const saveNotifications = async (e) => {
    if (e) e.preventDefault();
    setSavingNotifications(true);
    try {
      const updated = await updateForm(token, {
        email_notifications: emailNotifications,
        notification_email: notificationEmail
      });
      setForm(updated);
      toast.success('Notification settings saved!');
    } catch (err) {
      toast.error('Failed to save notification settings');
    } finally {
      setSavingNotifications(false);
    }
  };

  const saveRedirects = async (e) => {
    if (e) e.preventDefault();
    setSavingRedirects(true);
    try {
      const updated = await updateForm(token, { redirect_url: redirectUrl });
      setForm(updated);
      toast.success('Redirect settings saved!');
    } catch (err) {
      toast.error('Failed to save redirect url');
    } finally {
      setSavingRedirects(false);
    }
  };

  const saveSecurity = async (e) => {
    if (e) e.preventDefault();
    setSavingSecurity(true);
    try {
      const originsArray = allowedOrigins.split(',').map(s => s.trim()).filter(Boolean);
      const blacklistArray = spamBlacklist.split(',').map(s => s.trim()).filter(Boolean);

      const updated = await updateForm(token, {
        allowed_origins: originsArray,
        spam_blacklist: blacklistArray,
        spam_protection: spamProtection
      });
      setForm(updated);
      toast.success('Security configurations saved!');
    } catch (err) {
      toast.error('Failed to save security settings');
    } finally {
      setSavingSecurity(false);
    }
  };

  const saveWebhooks = async (e) => {
    if (e) e.preventDefault();
    setSavingWebhooks(true);
    try {
      const updated = await updateForm(token, {
        webhook_url: webhookUrl,
        webhook_signature_enabled: webhookSignatureEnabled
      });
      setForm(updated);
      toast.success('Webhook configurations saved!');
    } catch (err) {
      toast.error('Failed to save webhook settings');
    } finally {
      setSavingWebhooks(false);
    }
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl) return toast.error('Please enter a webhook URL first');
    setTestingWebhook(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-webhook', {
        body: { webhook_url: webhookUrl }
      });
      if (error) throw error;
      toast.success('Test payload dispatched successfully!');
    } catch (err) {
      toast.error(err.message || 'Webhook trigger test failed');
    } finally {
      setTestingWebhook(false);
    }
  };

  // Team Invite actions
  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviting(true);
    try {
      await inviteMember(form.id, inviteEmail, inviteRole);
      toast.success(`Invitation sent to ${inviteEmail}!`);
      setInviteEmail('');
      loadTeamList();
    } catch (err) {
      toast.error(err.message || 'Failed to invite team member');
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await updateMemberRole(memberId, newRole);
      toast.success('Role updated');
      loadTeamList();
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        await removeMember(memberId);
        toast.success('Team member removed');
        loadTeamList();
      } catch (err) {
        toast.error('Failed to remove team member');
      }
    }
  };

  // Developer API Key Actions
  const handleGenerateApiKey = async () => {
    setGeneratingApiKey(true);
    try {
      const key = await generateApiKey();
      setApiKey(key);
      toast.success('Developer API Key generated!');
      setShowApiKey(true);
    } catch (err) {
      toast.error('Failed to generate API Key');
    } finally {
      setGeneratingApiKey(false);
    }
  };

  const handleRevokeApiKey = async () => {
    if (!apiKey) return;
    if (window.confirm('Revoke developer key? Any applications relying on it will immediately fail.')) {
      try {
        await deleteApiKey(apiKey.id);
        setApiKey(null);
        toast.success('API Key revoked successfully');
      } catch (err) {
        toast.error('Failed to revoke API Key');
      }
    }
  };

  const handleFormDelete = async (e) => {
    e.preventDefault();
    if (deleteConfirmName !== form.name) {
      toast.error('Form name does not match');
      return;
    }
    setDeletingForm(true);
    try {
      await deleteForm(token);
      toast.success('Form deleted permanently');
      setShowDeleteModal(false);
      navigate('/dashboard');
    } catch (err) {
      toast.error('Deletion failed');
    } finally {
      setDeletingForm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-bg text-brand-text">
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
              Configuration
            </span>
          </div>
        </header>

        {/* Content Panel */}
        <div className="p-8 md:p-12 max-w-4xl space-y-10 pb-24 relative z-10 w-full">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-brand-text bg-clip-text text-transparent bg-gradient-to-r from-brand-text to-brand-primary">Endpoint Configuration</h1>
            <p className="text-sm font-medium text-brand-muted mt-2">Configure your form endpoint, integrations, webhooks, and team access.</p>
          </div>

          {/* GENERAL SECTION */}
          <SettingsSection 
            title="General Settings" 
            description="Basic branding identifiers for your form endpoint."
            onSubmit={saveGeneral}
            saving={savingGeneral}
          >
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold block mb-2 text-brand-text">Form Name</label>
                <input 
                  type="text"
                  required
                  className="w-full bg-brand-bg/50 border border-brand-border/20 rounded-2xl px-5 py-4 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 text-brand-text font-medium text-sm transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-2 text-brand-text">Form Token (Monospace Identifier)</label>
                <div className="flex gap-4">
                  <input 
                    type="text"
                    readOnly
                    className="flex-1 bg-brand-bg/85 border border-brand-border/15 rounded-2xl px-5 py-4 outline-none font-mono text-xs text-brand-muted"
                    value={form?.token || ''}
                  />
                  <button 
                    type="button"
                    onClick={() => { navigator.clipboard.writeText(form?.token); toast.success('Token copied!'); }}
                    className="px-6 bg-brand-primary text-brand-bg rounded-2xl font-bold text-xs flex items-center gap-2 hover:opacity-90 transition-all shadow-md shrink-0"
                  >
                    <CopyIcon />
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* NOTIFICATIONS SECTION */}
          <SettingsSection 
            title="Notification Alerts" 
            description="Configure alerts whenever your form collects data responses."
            onSubmit={saveNotifications}
            saving={savingNotifications}
          >
            <div className="space-y-6">
              <label className="flex items-center justify-between cursor-pointer border border-brand-border/10 rounded-2xl p-5 hover:bg-brand-bg/50 transition-all bg-brand-card/50">
                <div>
                  <p className="text-sm font-bold text-brand-text">Enable Email Alerts</p>
                  <p className="text-xs text-brand-muted font-medium mt-1">Receive automated emails for every submit event</p>
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

              {emailNotifications && (
                <div>
                  <label className="text-xs font-bold block mb-2 text-brand-text">Recipient Notification Email</label>
                  <input 
                    type="email"
                    required
                    placeholder="Enter email to notify"
                    className="w-full bg-brand-bg/50 border border-brand-border/20 rounded-2xl px-5 py-4 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 text-brand-text font-medium text-sm transition-all"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                  />
                </div>
              )}

            </div>
          </SettingsSection>

          {/* REDIRECTS SECTION */}
          <SettingsSection 
            title="Custom Redirects" 
            description="Control destination after user submits data. Leave blank to show default thank you page."
            onSubmit={saveRedirects}
            saving={savingRedirects}
          >
            <div>
              <label className="text-xs font-bold block mb-2 text-brand-text">Custom Redirect URL</label>
              <input 
                type="url"
                placeholder="https://mysite.com/thank-you"
                className="w-full bg-brand-bg/50 border border-brand-border/20 rounded-2xl px-5 py-4 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 text-brand-text font-medium text-sm transition-all"
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
              />
            </div>
          </SettingsSection>

          {/* SECURITY CONFIGS SECTION */}
          <SettingsSection 
            title="Access Security & Protection" 
            description="Manage origin whitelist protection and custom blacklisted phrases."
            onSubmit={saveSecurity}
            saving={savingSecurity}
          >
            <div className="space-y-6">
              <label className="flex items-center justify-between cursor-pointer border border-brand-border/10 rounded-2xl p-5 hover:bg-brand-bg/50 transition-all bg-brand-card/50">
                <div>
                  <p className="text-sm font-bold text-brand-text">Enable Spam Filter (CAPTCHA / Bots)</p>
                  <p className="text-xs text-brand-muted font-medium mt-1">Intercept automated robot submits with honey-pot algorithms</p>
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

              <div>
                <label className="text-xs font-bold block mb-2 text-brand-text">Allowed Origin CORS Domains (Comma Separated)</label>
                <input 
                  type="text"
                  placeholder="e.g. https://domain.com, http://localhost:3000"
                  className="w-full bg-brand-bg/50 border border-brand-border/20 rounded-2xl px-5 py-4 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 text-brand-text font-medium text-sm transition-all placeholder-brand-muted"
                  value={allowedOrigins}
                  onChange={(e) => setAllowedOrigins(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-2 text-brand-text">Blacklisted Submission Keywords (Comma Separated)</label>
                <textarea 
                  placeholder="e.g. crypto, viagra, bot, promo"
                  className="w-full bg-brand-bg/50 border border-brand-border/20 rounded-2xl px-5 py-4 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 text-brand-text font-medium text-sm min-h-[100px] transition-all placeholder-brand-muted"
                  value={spamBlacklist}
                  onChange={(e) => setSpamBlacklist(e.target.value)}
                />
              </div>
            </div>
          </SettingsSection>

          {/* WEBHOOKS CONFIGURATION */}
          <SettingsSection 
            title="Outgoing HTTP Webhooks" 
            description="Trigger HTTP POST events to external web services with payload."
            onSubmit={saveWebhooks}
            saving={savingWebhooks}
          >
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold block mb-2 text-brand-text">Payload Delivery Webhook URL</label>
                <input 
                  type="url"
                  placeholder="https://api.thirdparty.com/webhook"
                  className="w-full bg-brand-bg/50 border border-brand-border/20 rounded-2xl px-5 py-4 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 text-brand-text font-medium text-sm transition-all placeholder-brand-muted"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
              </div>

              {webhookUrl && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
                  <label className="flex items-center justify-between cursor-pointer border border-brand-border/10 rounded-2xl p-5 hover:bg-brand-bg/50 transition-all bg-brand-card/50 flex-1">
                    <div>
                      <p className="text-sm font-bold text-brand-text">HMAC Signature Header validation</p>
                      <p className="text-xs text-brand-muted font-medium mt-1">Secures hook payloads with verify tokens</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${webhookSignatureEnabled ? 'bg-brand-primary' : 'bg-brand-border/20'}`}>
                       <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${webhookSignatureEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={webhookSignatureEnabled}
                      onChange={(e) => setWebhookSignatureEnabled(e.target.checked)}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleTestWebhook}
                    disabled={testingWebhook}
                    className="px-5 py-4 rounded-2xl border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-bg font-bold text-xs transition-all disabled:opacity-50 shrink-0"
                  >
                    {testingWebhook ? 'Dispatching...' : 'Test Webhook Destination'}
                  </button>
                </div>
              )}
            </div>
          </SettingsSection>

          {/* TEAM ROSTER SECTION */}
          <div className="bg-brand-card/60 backdrop-blur-xl border border-brand-border/10 rounded-3xl p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-brand-text">Authorized Team Members</h3>
              <p className="text-xs font-medium text-brand-muted mt-1">Share this form endpoint with other developer profiles.</p>
            </div>

            {/* Invite Form */}
            <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-2">
              <div className="sm:col-span-1">
                <label className="text-xs font-bold block mb-2 text-brand-text">Invite email</label>
                <input 
                  type="email"
                  required
                  placeholder="colleague@domain.com"
                  className="w-full bg-brand-bg/50 border border-brand-border/20 rounded-2xl px-5 py-4 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 text-brand-text font-medium text-sm transition-all placeholder-brand-muted"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-2 text-brand-text">Role</label>
                <select 
                  className="w-full bg-brand-bg/50 border border-brand-border/20 rounded-2xl px-5 py-4 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 text-brand-text font-medium text-sm transition-all"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                >
                  <option value="viewer">Viewer</option>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={inviting}
                className="w-full bg-brand-text text-brand-bg rounded-full py-4 font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-md"
              >
                {inviting ? 'Inviting...' : 'Invite Member'}
              </button>
            </form>

            {/* Members List */}
            {fetchingTeam ? (
              <p className="text-xs font-semibold text-brand-muted animate-pulse">Loading team members...</p>
            ) : (
              <div className="space-y-3 pt-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-5 bg-brand-bg/40 hover:bg-brand-bg/70 border border-brand-border/10 rounded-2xl transition-all">
                    <div>
                      <p className="text-sm font-bold text-brand-text">{member.profiles?.name || 'Pending Invite'}</p>
                      <p className="text-xs text-brand-muted mt-0.5">{member.profiles?.email || 'No email associated'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <select
                        className="bg-transparent border-none text-xs font-bold text-brand-primary py-1 focus:outline-none cursor-pointer"
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      >
                        <option value="viewer">Viewer</option>
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                      
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-brand-muted hover:text-red-500 hover:bg-red-500/10 p-2.5 rounded-xl transition-all"
                        title="Remove member"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}

                {teamMembers.length === 0 && (
                  <p className="text-xs text-brand-muted font-medium py-4 text-center">No additional team members invited yet.</p>
                )}
              </div>
            )}
          </div>

          {/* DEVELOPER API KEYS SECTION */}
          <div className="bg-brand-card/60 backdrop-blur-xl border border-brand-border/10 rounded-3xl p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-brand-text">Developer Integration Access Keys</h3>
              <p className="text-xs font-medium text-brand-muted mt-1">Configure your secret API tokens for command line and script integrations.</p>
            </div>

            {fetchingApiKey ? (
              <p className="text-xs font-semibold text-brand-muted animate-pulse">Checking credentials...</p>
            ) : apiKey ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input 
                      type={showApiKey ? "text" : "password"}
                      readOnly
                      className="w-full bg-brand-bg/85 border border-brand-border/15 rounded-2xl px-5 py-4 outline-none font-mono text-xs text-brand-muted select-all"
                      value={apiKey.id}
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => { navigator.clipboard.writeText(apiKey.id); toast.success('API Key copied!'); }}
                    className="px-5 py-3 border border-brand-border/20 hover:bg-brand-text/5 text-brand-text font-bold text-xs rounded-2xl transition-all shrink-0"
                  >
                    Copy Key
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="px-5 py-3 border border-brand-border/20 hover:bg-brand-text/5 text-brand-text font-bold text-xs rounded-2xl transition-all shrink-0"
                  >
                    {showApiKey ? 'Hide' : 'Reveal'}
                  </button>
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={handleGenerateApiKey}
                    disabled={generatingApiKey}
                    className="bg-brand-primary text-brand-bg rounded-2xl px-6 py-3.5 font-bold text-xs hover:opacity-90 transition-all disabled:opacity-50 shadow-md"
                  >
                    {generatingApiKey ? 'Generating...' : 'Re-Generate API Key'}
                  </button>
                  <button 
                    onClick={handleRevokeApiKey}
                    className="border border-red-500/30 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-2xl px-6 py-3.5 font-bold text-xs transition-all"
                  >
                    Revoke API Key
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium text-brand-muted mb-4">No developer API keys active for this profile.</p>
                <button 
                  onClick={handleGenerateApiKey}
                  disabled={generatingApiKey}
                  className="bg-brand-primary text-brand-bg rounded-2xl px-6 py-3.5 font-bold text-xs hover:opacity-90 transition-all disabled:opacity-50 shadow-md"
                >
                  {generatingApiKey ? 'Generating...' : 'Generate Secret Developer Key'}
                </button>
              </div>
            )}
          </div>

          {/* DANGER ZONE SECTION */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-red-500 tracking-tight">Danger Zone</h3>
              <p className="text-xs font-medium text-red-500/70 mt-1">Permanently discard this form endpoint and all collected responses.</p>
            </div>
            
            <div className="pt-2">
              <button 
                type="button"
                onClick={() => {
                  setDeleteConfirmName('');
                  setShowDeleteModal(true);
                }}
                className="bg-red-500 hover:bg-red-600 text-white rounded-2xl px-8 py-4 font-bold text-sm hover:shadow-xl hover:shadow-red-500/10 transition-all"
              >
                Delete Form Permanently
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* DELETE FORM CONFIRMATION MODAL */}
      <AnimatePresence>
        {showDeleteModal && form && (
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
                This will permanently delete <span className="font-bold">{form.name}</span> and all associated submissions. <span className="text-red-500 font-bold">This action cannot be undone.</span>
              </p>

              <form onSubmit={handleFormDelete} className="space-y-6">
                <div>
                  <label className="text-xs font-bold block mb-2 text-brand-text">
                    Type <span className="font-mono bg-brand-bg px-2 py-1 rounded text-red-500 select-all">{form.name}</span> to confirm
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
                    disabled={deletingForm || deleteConfirmName !== form.name}
                    className="flex-1 bg-red-500 text-white rounded-full py-4 font-bold text-sm hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
                  >
                    {deletingForm ? 'Deleting...' : 'Yes, Delete Form'}
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

// Isolated card styling for setting segments with save action
const SettingsSection = ({ title, description, onSubmit, saving, children }) => (
  <div className="bg-brand-card/60 backdrop-blur-xl border border-brand-border/10 rounded-3xl p-8 shadow-sm">
    <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div>
        <h3 className="text-lg font-bold tracking-tight text-brand-text">{title}</h3>
        <p className="text-xs font-medium text-brand-muted mt-1">{description}</p>
      </div>
      <button
        type="button"
        onClick={onSubmit}
        disabled={saving}
        className="bg-brand-text text-brand-bg rounded-2xl px-5 py-3 font-bold text-xs hover:opacity-90 transition-all shrink-0 disabled:opacity-50 flex items-center justify-center min-w-[120px] shadow-sm"
      >
        {saving ? 'Saving...' : 'Save Section'}
      </button>
    </div>
    <form onSubmit={onSubmit} className="border-t border-brand-border/10 pt-6">
      {children}
    </form>
  </div>
);

export default FormSettings;
