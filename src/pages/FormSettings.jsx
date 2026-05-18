import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formsService } from '../services/formsService';
import { teamService } from '../services/teamService';
import { apiKeyService } from '../services/apiKeyService';
import Sidebar from '../components/layout/Sidebar';
import toast from 'react-hot-toast';

// Safe SVG Icons
const SaveIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>
);

const FormSettings = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchForm();
  }, [token]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const data = await formsService.getFormByToken(token);
      setForm(data);
      setFormData(data);
    } catch (err) {
      toast.error('Failed to load form settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await formsService.updateForm(token, formData);
      toast.success('Settings saved successfully');
      setForm(formData);
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmName = prompt(`To delete this form, type its name: "${form.name}"`);
    if (confirmName !== form.name) {
      if (confirmName !== null) toast.error('Name mismatch. Deletion cancelled.');
      return;
    }
    
    try {
      await formsService.deleteForm(token);
      toast.success('Form deleted successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to delete form');
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
            <span className="text-[11px] font-black uppercase tracking-widest text-brand-primary border-b-2 border-brand-primary pb-7 mt-7">Settings</span>
          </div>
          
          <button 
            onClick={handleUpdate}
            disabled={saving}
            className="bg-black text-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-brand-primary transition-all disabled:opacity-50"
          >
            {saving ? <div className="w-3 h-3 border-2 border-white border-t-transparent animate-spin"></div> : <SaveIcon />}
            Save Changes
          </button>
        </header>

        <div className="p-10 max-w-4xl">
          <div className="mb-12">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Form Settings</h1>
            <p className="text-[13px] font-bold text-black/50 mt-1">Configure your form endpoint, notifications, and security.</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-10 pb-24">
            {/* General Section */}
            <SettingsSection title="General" description="Basic configuration for your form.">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40 block mb-2">Form Name</label>
                  <input 
                    type="text"
                    className="w-full bg-white border border-black/5 px-4 py-3 outline-none focus:border-brand-primary font-bold text-sm transition-colors"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40 block mb-2">Form Token</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      readOnly
                      className="flex-1 bg-black/[0.02] border border-black/5 px-4 py-3 outline-none font-mono text-xs text-black/40"
                      value={form.token}
                    />
                    <button 
                      type="button"
                      onClick={() => { navigator.clipboard.writeText(form.token); toast.success('Token copied!'); }}
                      className="px-4 border border-black/5 hover:border-black transition-colors text-[10px] font-black uppercase"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </SettingsSection>

            {/* Notifications */}
            <SettingsSection title="Notifications" description="Manage how you receive alerts for new submissions.">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black uppercase tracking-tight">Email Notifications</p>
                    <p className="text-[11px] font-bold text-black/40">Receive an email for every new submission.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, email_notifications: !formData.email_notifications })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${formData.email_notifications ? 'bg-brand-primary' : 'bg-black/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.email_notifications ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
                {formData.email_notifications && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 block mb-2">Notification Email</label>
                    <input 
                      type="email"
                      placeholder="leave blank to use account email"
                      className="w-full bg-white border border-black/5 px-4 py-3 outline-none focus:border-brand-primary font-bold text-sm transition-colors"
                      value={formData.notification_email || ''}
                      onChange={(e) => setFormData({ ...formData, notification_email: e.target.value })}
                    />
                  </div>
                )}
              </div>
            </SettingsSection>

            {/* Redirects */}
            <SettingsSection title="Redirects" description="Where to send users after they submit your form.">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 block mb-2">Redirect URL</label>
                <input 
                  type="url"
                  placeholder="https://your-site.com/thanks"
                  className="w-full bg-white border border-black/5 px-4 py-3 outline-none focus:border-brand-primary font-bold text-sm transition-colors"
                  value={formData.redirect_url || ''}
                  onChange={(e) => setFormData({ ...formData, redirect_url: e.target.value })}
                />
              </div>
            </SettingsSection>

            {/* Security */}
            <SettingsSection title="Security" description="Protect your form from spam and unauthorized access.">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40 block mb-2">Allowed Origins (CORS)</label>
                  <input 
                    type="text"
                    placeholder="https://mysite.com, https://api.mysite.com"
                    className="w-full bg-white border border-black/5 px-4 py-3 outline-none focus:border-brand-primary font-bold text-sm transition-colors"
                    value={formData.allowed_origins?.join(', ') || ''}
                    onChange={(e) => setFormData({ ...formData, allowed_origins: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  />
                  <p className="text-[10px] font-bold text-black/30 mt-2">Comma-separated list of domains that can submit to this form.</p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40 block mb-2">Spam Blacklist</label>
                  <textarea 
                    placeholder="crypto, giveaway, bot (one per line or comma-separated)"
                    className="w-full bg-white border border-black/5 px-4 py-3 outline-none focus:border-brand-primary font-bold text-sm transition-colors min-h-[100px]"
                    value={formData.spam_blacklist?.join(', ') || ''}
                    onChange={(e) => setFormData({ ...formData, spam_blacklist: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  />
                </div>
              </div>
            </SettingsSection>

            {/* Danger Zone */}
            <div className="pt-10 border-t-4 border-red-500/20">
              <div className="bg-red-50 border border-red-200 p-8 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-red-600">Danger Zone</h3>
                  <p className="text-[11px] font-bold text-red-600/60 uppercase tracking-widest mt-1">Irreversible actions ahead.</p>
                </div>
                <button 
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors shadow-[4px_4px_0_rgba(220,38,38,0.2)]"
                >
                  Delete Form
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

const SettingsSection = ({ title, description, children }) => (
  <div className="bg-white border border-black/5 p-8">
    <div className="mb-8">
      <h3 className="text-[11px] font-black uppercase tracking-widest">{title}</h3>
      <p className="text-[11px] font-bold text-black/30 uppercase mt-1 tracking-wider">{description}</p>
    </div>
    {children}
  </div>
);

export default FormSettings;
