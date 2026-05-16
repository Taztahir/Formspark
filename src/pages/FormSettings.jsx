import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Globe, 
  Trash2,
  ChevronLeft,
  Webhook,
  MailCheck,
  Zap,
  ArrowLeft,
  Save,
  Loader2
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { formsAPI } from '../services/api';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

const FormSettings = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  const fetchForm = async () => {
    try {
      const res = await formsAPI.getForm(token);
      setForm(res.data.form);
    } catch (err) {
      toast.error('FAILED_TO_SYNC_PROTOCOL');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForm();
  }, [token]);

  const handleUpdate = async (section, data) => {
    setSaving(true);
    try {
      await formsAPI.updateForm(token, data);
      toast.success(`${section.toUpperCase()}_SYNCED`);
      setForm({ ...form, ...data });
    } catch (err) {
      toast.error('SYNCHRONIZATION_ERROR');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper title="Syncing Protocol">
        <div className="flex items-center justify-center py-40">
           <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent animate-spin"></div>
        </div>
      </PageWrapper>
    );
  }

  const sections = [
    {
      id: 'general',
      title: 'Infrastructure',
      icon: Globe,
      fields: [
        { key: 'name', label: 'Protocol Label', type: 'text', placeholder: 'e.g. ALPHA_SYSTEM_v1' },
        { key: 'allowed_origins', label: 'Allowed Domains', type: 'text', placeholder: 'https://mysite.com, https://api.mysite.com' },
        { key: 'redirect_url', label: 'Response Redirect', type: 'text', placeholder: 'https://mysite.com/success' },
      ]
    },
    {
      id: 'notifications',
      title: 'Automation',
      icon: MailCheck,
      toggle: 'email_notifications',
      fields: [
        { key: 'autoresponse_message', label: 'Auto-Response Schema', type: 'textarea', placeholder: 'Payload received. System response initialized.' },
      ]
    },
    {
      id: 'security',
      title: 'Shield_v2',
      icon: Shield,
      fields: [
        { key: 'spam_blacklist', label: 'Pattern Blacklist', type: 'text', placeholder: 'crypto, giveaway, bot (comma separated)' },
      ]
    },
    {
      id: 'webhooks',
      title: 'Integrations',
      icon: Webhook,
      fields: [
        { key: 'webhook_url', label: 'Webhook Endpoint', type: 'text', placeholder: 'https://hooks.zapier.com/...' },
      ]
    }
  ];

  return (
    <PageWrapper
      title="Settings"
      subtitle={`Configure operational parameters for: ${token}`}
      actions={
        <Link to="/dashboard">
          <Button variant="outline" size="sm" icon={ArrowLeft}>Back</Button>
        </Link>
      }
    >
      <div className="max-w-4xl mx-auto space-y-16">
        {sections.map((section, idx) => (
          <div key={section.id} className="border border-brand-border bg-brand-bg shadow-[10px_10px_0px_var(--color-brand-border)] overflow-hidden">
            <div className="p-10 border-b border-brand-border bg-brand-text text-brand-bg flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 border-2 border-brand-bg flex items-center justify-center text-brand-primary shadow-[4px_4px_0px_var(--color-brand-primary)]">
                  <section.icon size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">{section.title}</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Section_{idx + 1}</p>
                </div>
              </div>

              {section.toggle && (
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Status_</span>
                  <button 
                    onClick={() => handleUpdate(section.title, { [section.toggle]: !form[section.toggle] })}
                    className={cn(
                      "w-20 h-10 border-2 transition-all flex items-center px-1",
                      form[section.toggle] ? "bg-brand-primary border-brand-bg" : "bg-brand-bg/20 border-brand-bg/40"
                    )}
                  >
                    <div className={cn(
                      "w-7 h-7 border-2 border-brand-bg transition-transform",
                      form[section.toggle] ? "translate-x-10 bg-brand-text" : "translate-x-0 bg-brand-text/40"
                    )} />
                  </button>
                </div>
              )}
            </div>

            <div className="p-10 space-y-12">
              {section.fields.map((field) => (
                <div key={field.key} className="space-y-4">
                   <label className="text-xs font-black uppercase tracking-widest opacity-40 block">
                    {field.label}
                   </label>
                   {field.type === 'textarea' ? (
                    <textarea
                      className="w-full bg-brand-text/5 border-2 border-brand-border p-6 text-brand-text font-bold focus:outline-none focus:border-brand-primary transition-colors min-h-[150px] text-lg leading-tight uppercase placeholder:opacity-20"
                      defaultValue={form[field.key]}
                      onBlur={(e) => handleUpdate(section.title, { [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                    />
                   ) : (
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      defaultValue={form[field.key]}
                      onBlur={(e) => handleUpdate(section.title, { [field.key]: e.target.value })}
                      className="w-full h-16 bg-brand-text/5 border-2 border-brand-border px-6 text-lg font-bold uppercase tracking-tight focus:outline-none focus:border-brand-primary transition-colors placeholder:opacity-20"
                    />
                   )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="border border-red-500 bg-red-500/5 p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[15px_15px_0px_var(--color-brand-border)]">
          <div className="flex items-center gap-8 text-center md:text-left">
             <div className="w-20 h-20 border-4 border-red-500 flex items-center justify-center text-red-500 shadow-[8px_8px_0px_#f00]">
               <Trash2 size={32} strokeWidth={3} />
             </div>
             <div>
                <h3 className="text-3xl font-black text-brand-text tracking-tighter uppercase mb-2">Destruction_Sequence</h3>
                <p className="text-sm font-bold opacity-60 uppercase tracking-widest max-w-sm">Permanently decommission this endpoint and wipe all intercepted data packets.</p>
             </div>
          </div>
          <button 
            onClick={() => {
              if(confirm('INITIATE DESTRUCTION SEQUENCE? ALL DATA WILL BE LOST.')) {
                toast.error('PROTOCOL_LOCKED_IN_DEMO');
              }
            }}
            className="h-16 px-12 bg-red-500 text-white font-black uppercase tracking-widest hover:bg-black transition-colors shadow-[10px_10px_0px_#000]"
          >
            Purge Endpoint
          </button>
        </div>
      </div>

      {/* Floating Save Status */}
      <AnimatePresence>
        {saving && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-12 right-12 bg-brand-text text-brand-bg px-8 py-4 border-2 border-brand-primary flex items-center gap-4 z-[100] shadow-[10px_10px_0px_var(--color-brand-primary)]"
          >
            <Loader2 className="animate-spin" size={18} strokeWidth={3} />
            <span className="text-xs font-black uppercase tracking-widest">Applying Protocol_</span>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default FormSettings;
