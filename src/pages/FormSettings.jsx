import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getFormByToken, updateForm, deleteForm } from '../services/formsService';
import { getTeamMembers, inviteMember, updateMemberRole, removeMember } from '../services/teamService';
import { getApiKey, generateApiKey, deleteApiKey } from '../services/apiKeyService';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/layout/Sidebar';
import toast from 'react-hot-toast';

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = `${title} — FormSpark`;
  }, [title]);
};

// Safe SVGs
const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12" y1="17" y2="17"/></svg>
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
    e.preventDefault();
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
    e.preventDefault();
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
    e.preventDefault();
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
    e.preventDefault();
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
    e.preventDefault();
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
              Configuration
            </span>
          </div>
        </header>

        {/* Content Panel */}
        <div className="p-6 md:p-10 max-w-4xl space-y-12 pb-24">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Endpoint Configuration</h1>
            <p className="text-[13px] font-bold text-black/50 mt-1">Configure your form endpoint, integrations, webhooks, and team access.</p>
          </div>

          {/* GENERAL SECTION */}
          <SettingsSection 
            title="General Settings" 
            description="Basic branding identifiers for your form endpoint."
            onSubmit={saveGeneral}
            saving={savingGeneral}
          >
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest block mb-2 text-black/70">Form Name</label>
                <input 
                  type="text"
                  required
                  className="w-full bg-[#F5F5F5] border-2 border-black px-4 py-2.5 outline-none focus:border-brand-primary font-bold text-xs rounded-none transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest block mb-2 text-black/70">Form Token (Monospace Identifier)</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    readOnly
                    className="flex-1 bg-black/[0.02] border-2 border-dashed border-black/10 px-4 py-2.5 outline-none font-mono text-[10px] text-black/50 rounded-none"
                    value={form?.token || ''}
                  />
                  <button 
                    type="button"
                    onClick={() => { navigator.clipboard.writeText(form?.token); toast.success('Token copied!'); }}
                    className="px-4 border-2 border-black hover:bg-black hover:text-white transition-colors text-[9px] font-black uppercase tracking-wider flex items-center gap-2"
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
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer border border-black/5 p-3 hover:bg-black/[0.01]">
                <div>
                  <p className="text-[10px] font-black uppercase text-brand-text">Enable Email Alerts</p>
                  <p className="text-[8px] text-black/40 font-bold uppercase tracking-widest">Receive automated emails for every submit event</p>
                </div>
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded-sm border-black text-brand-primary focus:ring-brand-primary accent-brand-primary"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
              </label>

              {emailNotifications && (
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest block mb-2 text-black/70">Recipient Notification Email</label>
                  <input 
                    type="email"
                    required
                    placeholder="Enter email to notify"
                    className="w-full bg-[#F5F5F5] border-2 border-black px-4 py-2.5 outline-none focus:border-brand-primary font-bold text-xs rounded-none transition-colors"
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
              <label className="text-[9px] font-black uppercase tracking-widest block mb-2 text-black/70">Custom Redirect URL</label>
              <input 
                type="url"
                placeholder="https://mysite.com/thank-you"
                className="w-full bg-[#F5F5F5] border-2 border-black px-4 py-2.5 outline-none focus:border-brand-primary font-bold text-xs rounded-none transition-colors"
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
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer border border-black/5 p-3 hover:bg-black/[0.01]">
                <div>
                  <p className="text-[10px] font-black uppercase text-brand-text">Enable Spam Filter (CAPTCHA / Bots)</p>
                  <p className="text-[8px] text-black/40 font-bold uppercase tracking-widest">Intercept automated robot submits with honey-pot algorithms</p>
                </div>
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded-sm border-black text-brand-primary focus:ring-brand-primary accent-brand-primary"
                  checked={spamProtection}
                  onChange={(e) => setSpamProtection(e.target.checked)}
                />
              </label>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest block mb-2 text-black/70">Allowed Origin CORS Domains (Comma Separated)</label>
                <input 
                  type="text"
                  placeholder="e.g. https://domain.com, http://localhost:3000"
                  className="w-full bg-[#F5F5F5] border-2 border-black px-4 py-2.5 outline-none focus:border-brand-primary font-bold text-xs rounded-none transition-colors"
                  value={allowedOrigins}
                  onChange={(e) => setAllowedOrigins(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest block mb-2 text-black/70">Blacklisted Submission Keywords (Comma Separated)</label>
                <textarea 
                  placeholder="e.g. crypto, viagra, bot, promo"
                  className="w-full bg-[#F5F5F5] border-2 border-black px-4 py-2.5 outline-none focus:border-brand-primary font-bold text-xs rounded-none min-h-[80px] transition-colors"
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
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest block mb-2 text-black/70">Payload Delivery Webhook URL</label>
                <input 
                  type="url"
                  placeholder="https://api.thirdparty.com/webhook"
                  className="w-full bg-[#F5F5F5] border-2 border-black px-4 py-2.5 outline-none focus:border-brand-primary font-bold text-xs rounded-none transition-colors"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
              </div>

              {webhookUrl && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded-sm border-black text-brand-primary focus:ring-brand-primary accent-brand-primary"
                      checked={webhookSignatureEnabled}
                      onChange={(e) => setWebhookSignatureEnabled(e.target.checked)}
                    />
                    <div>
                      <p className="text-[10px] font-black uppercase text-brand-text">HMAC Signature Header validation</p>
                      <p className="text-[8px] text-black/40 font-bold uppercase tracking-widest">Secures hook payloads with verify tokens</p>
                    </div>
                  </label>

                  <button
                    type="button"
                    onClick={handleTestWebhook}
                    disabled={testingWebhook}
                    className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-text px-4 py-2 text-[9px] font-black uppercase tracking-widest disabled:opacity-50 transition-colors shrink-0"
                  >
                    {testingWebhook ? 'Dispatching...' : 'Test Webhook Destination'}
                  </button>
                </div>
              )}
            </div>
          </SettingsSection>

          {/* TEAM ROSTER SECTION */}
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] space-y-6">
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-widest">Authorized Team Members</h3>
              <p className="text-[9px] font-bold text-black/40 uppercase mt-1 tracking-wider">Share this form endpoint with other developer profiles.</p>
            </div>

            {/* Invite Form */}
            <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-2">
              <div className="sm:col-span-1">
                <label className="text-[9px] font-black uppercase tracking-widest block mb-2 text-black/70">Invite email</label>
                <input 
                  type="email"
                  required
                  placeholder="colleague@domain.com"
                  className="w-full bg-[#F5F5F5] border-2 border-black px-4 py-2 outline-none focus:border-brand-primary font-bold text-xs rounded-none transition-colors"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest block mb-2 text-black/70">Role</label>
                <select 
                  className="w-full bg-[#F5F5F5] border-2 border-black px-4 py-2 outline-none focus:border-brand-primary font-bold text-xs rounded-none"
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
                className="w-full bg-black hover:bg-brand-primary text-white hover:text-brand-text border-2 border-black py-2.5 text-[9px] font-black uppercase tracking-widest disabled:opacity-50 transition-colors text-center"
              >
                {inviting ? 'Inviting...' : 'Invite Member'}
              </button>
            </form>

            {/* Members List */}
            {fetchingTeam ? (
              <p className="text-[10px] font-black uppercase text-black/30 animate-pulse">Loading team members...</p>
            ) : (
              <div className="border border-black/5 divide-y divide-black/5">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-[#FAF9F5]">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-tight">{member.profiles?.name || 'Pending Invite'}</p>
                      <p className="text-[9px] font-bold text-black/45">{member.profiles?.email || 'No email associated'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        className="bg-transparent border-none text-[10px] font-black uppercase text-brand-primary py-1 focus:outline-none"
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
                        className="text-black/30 hover:text-red-500 p-2"
                        title="Remove member"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}

                {teamMembers.length === 0 && (
                  <p className="text-[10px] text-black/35 font-bold uppercase py-4 text-center">No additional team members invited yet.</p>
                )}
              </div>
            )}
          </div>

          {/* DEVELOPER API KEYS SECTION */}
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] space-y-6">
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-widest">Developer Integration Access Keys</h3>
              <p className="text-[9px] font-bold text-black/40 uppercase mt-1 tracking-wider">Configure your secret API tokens for command line and script integrations.</p>
            </div>

            {fetchingApiKey ? (
              <p className="text-[10px] font-black uppercase text-black/30 animate-pulse">Checking credentials...</p>
            ) : apiKey ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input 
                      type={showApiKey ? "text" : "password"}
                      readOnly
                      className="w-full bg-[#111] text-white border-2 border-black px-4 py-2.5 outline-none font-mono text-[10px] rounded-none select-all"
                      value={apiKey.id}
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => { navigator.clipboard.writeText(apiKey.id); toast.success('API Key copied!'); }}
                    className="px-4 py-2.5 border-2 border-black hover:bg-black hover:text-white transition-colors text-[9px] font-black uppercase"
                  >
                    Copy Key
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="px-4 py-2.5 border-2 border-black hover:bg-black hover:text-white transition-colors text-[9px] font-black uppercase"
                  >
                    {showApiKey ? 'Hide' : 'Reveal'}
                  </button>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={handleGenerateApiKey}
                    disabled={generatingApiKey}
                    className="bg-[#111] hover:bg-brand-primary text-white hover:text-brand-text border-2 border-black px-5 py-2.5 text-[9px] font-black uppercase tracking-widest disabled:opacity-50 transition-colors"
                  >
                    {generatingApiKey ? 'Generating...' : 'Re-Generate API Key'}
                  </button>
                  <button 
                    onClick={handleRevokeApiKey}
                    className="border-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 px-5 py-2.5 text-[9px] font-black uppercase tracking-widest transition-colors"
                  >
                    Revoke API Key
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-[10px] text-black/40 font-bold uppercase mb-4">No developer API keys active for this profile.</p>
                <button 
                  onClick={handleGenerateApiKey}
                  disabled={generatingApiKey}
                  className="bg-brand-primary text-brand-text border-2 border-black px-6 py-3 font-black uppercase tracking-widest text-[9px] hover:bg-[#e67c00] transition-colors shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  {generatingApiKey ? 'Generating...' : 'Generate Secret Developer Key'}
                </button>
              </div>
            )}
          </div>

          {/* DANGER ZONE SECTION */}
          <div className="border-4 border-red-500 bg-red-50 p-8 shadow-[8px_8px_0_rgba(220,38,38,0.1)] space-y-6">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-red-600">Danger Zone</h3>
              <p className="text-[9px] font-bold text-red-600/60 uppercase tracking-widest mt-1">Permanently discard this form endpoint and all collected responses.</p>
            </div>
            
            <div className="pt-2">
              <button 
                type="button"
                onClick={() => {
                  setDeleteConfirmName('');
                  setShowDeleteModal(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white border-2 border-black px-6 py-3 text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
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
                This will permanently delete <span className="text-black font-black">{form.name}</span> and all associated submissions. <span className="text-red-500 font-black">This action cannot be undone.</span>
              </p>

              <form onSubmit={handleFormDelete} className="space-y-4">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest block mb-2 text-black/70">
                    Type <span className="font-black text-black select-all">"{form.name}"</span> to confirm
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
                    disabled={deletingForm || deleteConfirmName !== form.name}
                    className="flex-1 bg-red-500 text-white border-2 border-red-500 py-3 font-black uppercase tracking-widest text-[10px] hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingForm ? 'Deleting...' : 'Delete'}
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
  <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_rgba(0,0,0,1)]">
    <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div>
        <h3 className="text-[11px] font-black uppercase tracking-widest">{title}</h3>
        <p className="text-[9px] font-bold text-black/40 uppercase mt-1 tracking-wider">{description}</p>
      </div>
      <button
        type="button"
        onClick={onSubmit}
        disabled={saving}
        className="bg-black hover:bg-brand-primary text-white hover:text-brand-text border-2 border-black px-5 py-2 text-[9px] font-black uppercase tracking-widest transition-colors shrink-0 disabled:opacity-50 flex items-center justify-center min-w-[110px]"
      >
        {saving ? 'Saving...' : 'Save Section'}
      </button>
    </div>
    <form onSubmit={onSubmit} className="border-t border-black/5 pt-6">
      {children}
    </form>
  </div>
);

export default FormSettings;
