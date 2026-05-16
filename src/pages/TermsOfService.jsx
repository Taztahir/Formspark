import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const TermsOfService = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing or using Formspark, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
    },
    {
      title: "2. Use License",
      content: "Permission is granted to temporarily use the services provided by Formspark for personal or commercial use. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose without an account; or attempt to decompile or reverse engineer any software contained on the Formspark website."
    },
    {
      title: "3. Disclaimer",
      content: "The materials on Formspark's website are provided on an 'as is' basis. Formspark makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
    },
    {
      title: "4. Limitations",
      content: "In no event shall Formspark or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Formspark's website, even if Formspark or a Formspark authorized representative has been notified orally or in writing of the possibility of such damage."
    },
    {
      title: "5. Privacy",
      content: "Your privacy is important to us. It is Formspark's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate."
    },
    {
      title: "6. Governing Law",
      content: "These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-primary selection:text-brand-text"
    >
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-8 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 border border-brand-primary px-3 py-1 mb-8 bg-transparent">
            <div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
            <span className="text-[10px] font-bold text-brand-primary tracking-widest uppercase">Legal Documentation</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
            Terms of <br/>
            <span className="text-brand-primary">Service.</span>
          </h1>
          
          <p className="text-lg font-bold opacity-60 mb-16 max-w-2xl leading-relaxed">
            Last updated: May 16, 2026. Please read these terms carefully before using our platform.
          </p>
        </motion.div>

        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.section 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border-l-4 border-brand-primary pl-8 py-2 group hover:border-brand-text transition-colors"
            >
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4 group-hover:text-brand-primary transition-colors">
                {section.title}
              </h2>
              <p className="text-lg font-medium opacity-80 leading-relaxed max-w-3xl">
                {section.content}
              </p>
            </motion.section>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 pt-12 border-t border-brand-text/10"
        >
          <p className="text-sm font-bold opacity-40">
            If you have any questions about these Terms, please contact us at <a href="mailto:legal@formspark.io" className="text-brand-primary hover:underline">legal@formspark.io</a>.
          </p>
          <div className="mt-8">
            <Link to="/" className="inline-flex items-center gap-2 font-black uppercase text-xs tracking-widest hover:text-brand-primary transition-colors">
              <span>&larr;</span> Back to Home
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Subtle architectural grid background element */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-5"
           style={{
             backgroundImage: 'radial-gradient(var(--color-brand-border) 1.5px, transparent 1.5px)',
             backgroundSize: '40px 40px'
           }}>
      </div>
    </motion.div>
  );
};

export default TermsOfService;
