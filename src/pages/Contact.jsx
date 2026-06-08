import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, CheckCircle, HelpCircle, ArrowRight, ExternalLink } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  });
  const [honey, setHoney] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const submitTimeRef = React.useRef(Date.now());

  // Pre-fill name and email when user is logged in so they don't have to start afresh
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const sanitizeInput = (str) => {
    if (typeof str !== 'string') return '';
    return str
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim()
      .slice(0, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('All required fields must be completed.');
      return;
    }

    // --- Honeypot check ---
    if (honey) {
      setSubmitted(true);
      return;
    }

    // --- Timing check ---
    if (Date.now() - submitTimeRef.current < 1500) {
      setSubmitted(true);
      return;
    }

    const sanitized = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      subject: sanitizeInput(formData.subject),
      message: sanitizeInput(formData.message)
    };

    setLoading(true);
    try {
      const contactFormToken = import.meta.env.VITE_FORMSPARK_TOKEN;
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const edgeUrl = `${SUPABASE_URL}/functions/v1/submit/${contactFormToken}`;
      const edgeResponse = await fetch(edgeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(sanitized)
      });

      if (edgeResponse.status === 429) {
        throw new Error('Too many submissions. Please wait a few minutes and try again.');
      }

      if (edgeResponse.status === 403) {
        throw new Error('This form is not authorized to submit from this domain.');
      }

      if (!edgeResponse.ok) {
        const errData = await edgeResponse.json().catch(() => ({}));
        throw new Error(errData.error || 'Submission failed. Please try again.');
      }

      setSubmitted(true);
      toast.success('Message sent! We\'ll get back to you shortly.');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };


  const resetForm = () => {
    setFormData({ name: '', email: '', subject: 'general', message: '' });
    setHoney('');
    setSubmitted(false);
    submitTimeRef.current = Date.now();
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text pt-[80px] flex flex-col relative transition-colors duration-500">
      <Navbar />

      {/* Visual Dot Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
           style={{
             backgroundImage: 'linear-gradient(var(--color-brand-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand-border) 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 md:px-12 py-12 md:py-20 relative z-10 flex flex-col justify-center">
        {/* Header Block */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b-4 border-brand-border pb-8 mb-12 md:mb-16"
        >
          <span className="text-brand-primary font-black uppercase tracking-widest text-xs md:text-sm">Connect with our support team</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mt-2">
            Contact Us
          </h1>
          <p className="text-sm md:text-base font-bold text-brand-muted mt-4 max-w-xl">
            Have questions about limits, custom webhook delivery, or self-hosted deployments? Fire away! Our team is standing by to route your request.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Support Channels */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="p-8 border-4 border-brand-border bg-brand-light-bg shadow-[6px_6px_0_var(--color-brand-shadow)] space-y-6 transition-colors duration-500">
              <h2 className="text-2xl font-black uppercase tracking-tight">Rapid Response</h2>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-brand-primary border-2 border-brand-border text-brand-text">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-brand-muted">Direct Email</h3>
                    <p className="font-bold text-sm">support@formspark-five.vercel.app</p>
                    <p className="text-[10px] text-brand-muted font-bold uppercase mt-0.5">Response within 3 hours</p>
                  </div>
                </div>
 
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-brand-primary border-2 border-brand-border text-brand-text">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-brand-muted">Live Chat Hub</h3>
                    <p className="font-bold text-sm">Discord Server Channel</p>
                    <p className="text-[10px] text-brand-muted font-bold uppercase mt-0.5">Instant community assistance</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Helper Links */}
            <div className="grid grid-cols-2 gap-4">
              <a 
                href="https://discord.gg" 
                target="_blank" 
                rel="noreferrer"
                className="p-5 border-2 border-brand-border bg-brand-card shadow-[4px_4px_0_var(--color-brand-shadow)] hover:bg-brand-primary hover:text-brand-text transition-all flex flex-col justify-between group h-32"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-muted group-hover:text-brand-text">Community</span>
                  <ExternalLink size={12} className="opacity-40 group-hover:opacity-100" />
                </div>
                <span className="font-black text-sm uppercase tracking-wide">Join Discord</span>
              </a>

              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-5 border-2 border-brand-border bg-brand-card shadow-[4px_4px_0_var(--color-brand-shadow)] hover:bg-brand-primary hover:text-brand-text transition-all flex flex-col justify-between group h-32"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-muted group-hover:text-brand-text">Open Source</span>
                  <ExternalLink size={12} className="opacity-40 group-hover:opacity-100" />
                </div>
                <span className="font-black text-sm uppercase tracking-wide">Git repository</span>
              </a>
            </div>

            {/* Documentation Alert */}
            <div className="p-6 border-2 border-brand-border bg-brand-primary/10 flex gap-4 items-start">
              <HelpCircle size={20} className="text-brand-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider">Need integration code guides?</h4>
                <p className="text-[11px] font-bold text-brand-muted mt-1">Check out our developer catalogs in the Library tab for pre-baked React & HTML snippets ready to deploy instantly.</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="p-8 md:p-10 border-4 border-brand-border bg-brand-card shadow-[10px_10px_0_var(--color-brand-shadow)] relative overflow-hidden transition-colors duration-500">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF8A00]/10 rounded-full blur-2xl pointer-events-none"></div>

              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-brand-primary text-brand-text border-4 border-brand-border rounded-full flex items-center justify-center mx-auto shadow-[4px_4px_0_var(--color-brand-shadow)]">
                    <CheckCircle size={32} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black uppercase">Message Encrypted</h2>
                    <p className="text-xs font-bold text-brand-muted max-w-sm mx-auto uppercase">Thank you! Your payload has been processed. We will get back to you shortly.</p>
                  </div>
                  <button 
                    onClick={resetForm}
                    className="px-6 py-3 bg-brand-text text-brand-bg font-black uppercase text-xs hover:bg-brand-primary hover:text-brand-text border-2 border-brand-border transition-colors"
                  >
                    Submit New Ticket
                  </button>
                </motion.div>
              ) : (
                <form 
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  {/* Honeypot field */}
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
                    <input
                      type="text"
                      name="_honey"
                      value={honey}
                      onChange={(e) => setHoney(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted">Full Name *</label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                        className="w-full bg-brand-light-bg border-2 border-brand-border px-4 py-3 outline-none font-bold text-xs text-brand-text focus:bg-brand-card focus:border-[#FF8A00] transition-colors rounded-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted">Email Address *</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                        className="w-full bg-brand-light-bg border-2 border-brand-border px-4 py-3 outline-none font-bold text-xs text-brand-text focus:bg-brand-card focus:border-[#FF8A00] transition-colors rounded-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted">Topic Category</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full bg-brand-light-bg border-2 border-brand-border px-4 py-3 outline-none font-bold text-xs text-brand-text focus:bg-brand-card focus:border-[#FF8A00] transition-colors rounded-none"
                    >
                      <option value="general">General Support inquiry</option>
                      <option value="hosting">Self-hosted deployments</option>
                      <option value="limits">API limits & custom integrations</option>
                      <option value="abuse">Spam report / abuse incident</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted">Message Body *</label>
                    <textarea 
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Detail your request..."
                      className="w-full bg-brand-light-bg border-2 border-brand-border p-4 outline-none font-bold text-xs text-brand-text focus:bg-brand-card focus:border-[#FF8A00] transition-colors h-36 resize-none rounded-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-brand-primary text-brand-text border-4 border-brand-border py-4 font-black uppercase text-xs hover:bg-brand-text hover:text-brand-bg transition-all shadow-[4px_4px_0_var(--color-brand-shadow)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 group"
                  >
                    {loading ? (
                      <span className="animate-pulse">ROUTING PAYLOAD...</span>
                    ) : (
                      <>
                        <span>TRANSMIT PAYLOAD</span>
                        <Send size={12} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
