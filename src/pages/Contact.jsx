import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, CheckCircle, HelpCircle, ArrowRight, ExternalLink } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { supabase } from '../lib/supabase';
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
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  // In local development, inject the local Formspark script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'http://localhost:3000/plugin/formspark.js';
    script.onerror = () => {
      // Fallback to production script if local server is down
      script.src = 'https://formspark.io/formspark.js';
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('All required fields must be completed.');
      return;
    }

    setLoading(true);
    try {
      const contactFormToken = 'e940eef0-797e-46a9-ac86-0b4ffe26a31c';
      
      const payload = JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });

      // 1. Transmit to local backend server first
      const localBackendUrl = `http://localhost:3000/submit/${contactFormToken}`;
      let serverResponseOk = false;

      try {
        const response = await fetch(localBackendUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: payload
        });
        if (response.ok) {
          serverResponseOk = true;
        }
      } catch (netErr) {
        console.warn('Local Node server offline. Falling back to Supabase Edge Function.');
      }

      // 2. Fallback: Call the deployed Supabase Edge Function directly.
      //    This uses the service role key server-side so it bypasses RLS and
      //    also fires the Resend email notification automatically.
      if (!serverResponseOk) {
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://clfzdsolflhvbkqxszhg.supabase.co';
        const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZnpkc29sZmxodmJrcXhzemhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NzA5MDEsImV4cCI6MjA5NDQ0NjkwMX0.OAPBm7NU-Cobm-0Fmuzfbvv9FT_UvnJBy-HaEUqYGI4';
        const edgeUrl = `${SUPABASE_URL}/functions/v1/submit/${contactFormToken}`;
        const edgeResponse = await fetch(edgeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: payload
        });
        if (!edgeResponse.ok) {
          const errData = await edgeResponse.json().catch(() => ({}));
          throw new Error(errData.error || 'Edge function submission failed.');
        }
      }

      setSubmitted(true);
      toast.success('Message sent! We\'ll get back to you shortly.');
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };


  const resetForm = () => {
    setFormData({ name: '', email: '', subject: 'general', message: '' });
    setSubmitted(false);
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
          className="border-b-4 border-black pb-8 mb-12 md:mb-16"
        >
          <span className="text-brand-primary font-black uppercase tracking-widest text-xs md:text-sm">Connect with our support team</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mt-2">
            Contact Us
          </h1>
          <p className="text-sm md:text-base font-bold text-black/55 mt-4 max-w-xl">
            Have questions about pricing, limits, custom webhook delivery, or enterprise scale? Fire away! Our team is standing by to route your request.
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
            <div className="p-8 border-4 border-black bg-[#FAF9F5] shadow-[6px_6px_0_rgba(0,0,0,1)] space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tight">Rapid Response</h2>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-brand-primary border-2 border-black text-black">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-black/50">Direct Email</h3>
                    <p className="font-bold text-sm">support@formspark.io</p>
                    <p className="text-[10px] text-black/40 font-bold uppercase mt-0.5">Response within 3 hours</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-brand-primary border-2 border-black text-black">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-black/50">Live Chat Hub</h3>
                    <p className="font-bold text-sm">Discord Server Channel</p>
                    <p className="text-[10px] text-black/40 font-bold uppercase mt-0.5">Instant community assistance</p>
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
                className="p-5 border-2 border-black bg-white shadow-[4px_4px_0_rgba(0,0,0,1)] hover:bg-[#FF8A00] hover:text-black transition-all flex flex-col justify-between group h-32"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/50 group-hover:text-black">Community</span>
                  <ExternalLink size={12} className="opacity-40 group-hover:opacity-100" />
                </div>
                <span className="font-black text-sm uppercase tracking-wide">Join Discord</span>
              </a>

              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-5 border-2 border-black bg-white shadow-[4px_4px_0_rgba(0,0,0,1)] hover:bg-[#FF8A00] hover:text-black transition-all flex flex-col justify-between group h-32"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/50 group-hover:text-black">Open Source</span>
                  <ExternalLink size={12} className="opacity-40 group-hover:opacity-100" />
                </div>
                <span className="font-black text-sm uppercase tracking-wide">Git repository</span>
              </a>
            </div>

            {/* Documentation Alert */}
            <div className="p-6 border-2 border-black bg-brand-primary/10 flex gap-4 items-start">
              <HelpCircle size={20} className="text-brand-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider">Need integration code guides?</h4>
                <p className="text-[11px] font-bold text-black/60 mt-1">Check out our developer catalogs in the Library tab for pre-baked React & HTML snippets ready to deploy instantly.</p>
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
            <div className="p-8 md:p-10 border-4 border-black bg-white shadow-[10px_10px_0_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF8A00]/10 rounded-full blur-2xl pointer-events-none"></div>

              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-brand-primary text-black border-4 border-black rounded-full flex items-center justify-center mx-auto shadow-[4px_4px_0_rgba(0,0,0,1)]">
                    <CheckCircle size={32} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black uppercase">Message Encrypted</h2>
                    <p className="text-xs font-bold text-black/50 max-w-sm mx-auto uppercase">Thank you! Your payload has been processed. We will get back to you shortly.</p>
                  </div>
                  <button 
                    onClick={resetForm}
                    className="px-6 py-3 bg-[#111] text-white font-black uppercase text-xs hover:bg-[#FF8A00] hover:text-black border-2 border-black transition-colors"
                  >
                    Submit New Ticket
                  </button>
                </motion.div>
              ) : (
                <form 
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-black/60">Full Name *</label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                        className="w-full bg-[#FAF9F5] border-2 border-black px-4 py-3 outline-none font-bold text-xs focus:bg-white focus:border-[#FF8A00] transition-colors rounded-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-black/60">Email Address *</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                        className="w-full bg-[#FAF9F5] border-2 border-black px-4 py-3 outline-none font-bold text-xs focus:bg-white focus:border-[#FF8A00] transition-colors rounded-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/60">Topic Category</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full bg-[#FAF9F5] border-2 border-black px-4 py-3 outline-none font-bold text-xs focus:bg-white focus:border-[#FF8A00] transition-colors rounded-none"
                    >
                      <option value="general">General Support inquiry</option>
                      <option value="sales">Sales & Business Plan pricing</option>
                      <option value="limits">API limits & custom integrations</option>
                      <option value="abuse">Spam report / abuse incident</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/60">Message Body *</label>
                    <textarea 
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Detail your request..."
                      className="w-full bg-[#FAF9F5] border-2 border-black p-4 outline-none font-bold text-xs focus:bg-white focus:border-[#FF8A00] transition-colors h-36 resize-none rounded-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-brand-primary text-black border-4 border-black py-4 font-black uppercase text-xs hover:bg-[#111] hover:text-white transition-all shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 group"
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
