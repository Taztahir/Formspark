import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, 
  Check, 
  ArrowLeft, 
  Code2, 
  Layout, 
  ChevronRight,
  ChevronLeft,
  Search,
  CheckCircle2,
  Menu,
  X,
  Mail,
  User,
  MessageSquare,
  Send,
  Zap,
  Globe
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';

// Real Form Components for Live View
const WaitlistForm = () => (
  <div className="w-full max-w-sm">
    <form className="flex flex-col sm:flex-row gap-0 border-2 border-brand-border">
      <input type="email" placeholder="Your email" className="flex-1 p-4 bg-brand-bg outline-none font-bold text-sm" />
      <button type="button" className="bg-brand-text text-brand-bg px-8 py-4 font-black uppercase text-xs hover:bg-brand-primary hover:text-brand-text transition-colors">Join</button>
    </form>
  </div>
);

const SimpleContact = () => (
  <div className="w-full max-w-md bg-brand-bg border-2 border-brand-border p-8 shadow-[8px_8px_0_var(--color-brand-border)]">
    <form className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase opacity-50">Full Name</label>
        <input type="text" className="w-full border-b-2 border-brand-border bg-transparent py-2 outline-none font-bold" placeholder="John Doe" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase opacity-50">Email</label>
        <input type="email" className="w-full border-b-2 border-brand-border bg-transparent py-2 outline-none font-bold" placeholder="john@example.com" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase opacity-50">Message</label>
        <textarea className="w-full border-b-2 border-brand-border bg-transparent py-2 outline-none font-bold h-24 resize-none" placeholder="Hello..."></textarea>
      </div>
      <button type="button" className="w-full bg-brand-text text-brand-bg py-4 font-black uppercase text-xs tracking-widest mt-4">Send Message</button>
    </form>
  </div>
);

const BrutalistContact = () => (
  <div className="w-full max-w-md space-y-6">
    <div className="p-8 border-4 border-brand-border bg-brand-primary shadow-[12px_12px_0_var(--color-brand-text)]">
      <h3 className="text-2xl font-black uppercase mb-6 tracking-tighter">Get In Touch</h3>
      <form className="space-y-4">
        <input type="text" className="w-full border-2 border-brand-text p-4 bg-brand-bg font-bold" placeholder="NAME" />
        <input type="email" className="w-full border-2 border-brand-text p-4 bg-brand-bg font-bold" placeholder="EMAIL" />
        <textarea className="w-full border-2 border-brand-text p-4 bg-brand-bg font-bold h-32" placeholder="MESSAGE"></textarea>
        <button type="button" className="w-full bg-brand-text text-brand-primary py-4 font-black uppercase text-sm border-2 border-brand-text">Transmit Data</button>
      </form>
    </div>
  </div>
);

const InlineNewsletter = () => (
  <div className="w-full max-w-xl flex border-4 border-brand-border bg-brand-bg overflow-hidden">
    <div className="p-4 flex items-center border-r-2 border-brand-border opacity-30">
      <Mail size={20} />
    </div>
    <input type="email" className="flex-1 p-4 bg-transparent outline-none font-bold" placeholder="Enter your email address" />
    <button type="button" className="bg-brand-text text-brand-bg px-10 font-black uppercase text-xs">Join</button>
  </div>
);

const FeedbackBox = () => (
  <div className="w-80 bg-brand-bg border-2 border-brand-border p-6 shadow-[10px_10px_0_var(--color-brand-primary)]">
    <div className="flex items-center gap-2 mb-4">
      <MessageSquare size={16} className="text-brand-primary" />
      <span className="text-[10px] font-black uppercase tracking-widest">Share Feedback</span>
    </div>
    <form className="space-y-4">
      <textarea className="w-full h-32 bg-brand-text/5 border-2 border-brand-border p-4 outline-none font-bold text-sm" placeholder="Tell us what you think..."></textarea>
      <button type="button" className="w-full bg-brand-primary text-brand-text py-3 font-black uppercase text-xs">Send &rarr;</button>
    </form>
  </div>
);

const AgencyContact = () => (
  <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 border-2 border-brand-border bg-brand-bg shadow-[15px_15px_0_var(--color-brand-text)]">
    <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-brand-border bg-brand-primary text-brand-text flex flex-col justify-between">
      <h3 className="text-3xl font-black uppercase leading-none tracking-tighter">Let's Build Something.</h3>
      <div className="space-y-2 text-sm font-bold opacity-70 mt-8">
        <p>hello@formspark.io</p>
        <p>+1 234 567 890</p>
      </div>
    </div>
    <form className="p-8 space-y-4 bg-brand-bg">
      <input type="text" placeholder="Name" className="w-full p-4 border-2 border-brand-border bg-transparent font-bold text-sm" />
      <input type="email" placeholder="Email" className="w-full p-4 border-2 border-brand-border bg-transparent font-bold text-sm" />
      <textarea placeholder="Tell us about your project" className="w-full p-4 border-2 border-brand-border bg-transparent font-bold text-sm h-32"></textarea>
      <button type="button" className="w-full bg-brand-text text-brand-bg py-4 font-black uppercase text-xs">Start Project</button>
    </form>
  </div>
);

const MinimalContact = () => (
  <div className="w-full max-w-sm">
    <form className="space-y-6">
      <input type="text" placeholder="NAME" className="w-full bg-transparent border-b border-brand-border py-4 outline-none uppercase text-xs font-bold" />
      <button type="button" className="text-brand-primary font-black uppercase text-xs tracking-widest">Send</button>
    </form>
  </div>
);

const DarkContact = () => (
  <div className="w-full max-w-md bg-brand-text text-brand-bg p-10 border-4 border-brand-primary shadow-[10px_10px_0_var(--color-brand-bg)]">
    <h3 className="text-xl font-black uppercase mb-8 tracking-widest text-brand-primary">Secure_Channel</h3>
    <form className="space-y-4">
      <div className="p-4 bg-brand-bg/10 border border-brand-bg/20 flex items-center gap-4">
        <User size={18} className="opacity-40" />
        <input type="text" placeholder="IDENT_NAME" className="bg-transparent outline-none font-mono text-xs w-full" />
      </div>
      <div className="p-4 bg-brand-bg/10 border border-brand-bg/20 flex items-center gap-4">
        <Mail size={18} className="opacity-40" />
        <input type="email" placeholder="IDENT_MAIL" className="bg-transparent outline-none font-mono text-xs w-full" />
      </div>
      <textarea placeholder="ENCRYPTED_MESSAGE" className="w-full p-4 bg-brand-bg/10 border border-brand-bg/20 outline-none font-mono text-xs h-32"></textarea>
      <button type="button" className="w-full bg-brand-primary text-brand-text py-4 font-black uppercase text-xs">Initialize_Transfer</button>
    </form>
  </div>
);

const SidebarForm = () => (
  <div className="w-64 bg-brand-bg border-2 border-brand-border">
    <div className="bg-brand-text text-brand-bg p-4 flex items-center gap-3">
      <Zap size={16} className="text-brand-primary" />
      <span className="font-black uppercase text-[10px] tracking-widest">Quick Connect</span>
    </div>
    <form className="p-4 space-y-3">
      <input type="text" placeholder="Name" className="w-full p-2 bg-transparent border border-brand-border text-[10px] font-bold" />
      <input type="email" placeholder="Email" className="w-full p-2 bg-transparent border border-brand-border text-[10px] font-bold" />
      <button type="button" className="w-full bg-brand-primary text-brand-text py-2 font-black uppercase text-[10px]">Go</button>
    </form>
  </div>
);

const libraryItems = [
  {
    id: 'waitlist-form',
    category: 'Forms',
    name: 'Waitlist Form',
    description: 'A simple way to collect email addresses for your upcoming launch.',
    html: `<form action="https://api.formspark.io/YOUR_ID" method="POST">\n  <input type="email" name="email" placeholder="Your email" required />\n  <button type="submit">Join Waitlist</button>\n</form>`,
    react: `export const Waitlist = () => (\n  <form action="https://api.formspark.io/YOUR_ID" method="POST" className="flex border-2 border-black">\n    <input type="email" name="email" className="flex-1 p-4 bg-white" placeholder="Your email" required />\n    <button className="bg-black text-white px-8 font-bold uppercase">Join</button>\n  </form>\n);`,
    Preview: WaitlistForm
  },
  {
    id: 'simple-contact',
    category: 'Forms',
    name: 'Simple Contact',
    description: 'A clean contact form with clear text fields and labels.',
    html: `<form action="https://api.formspark.io/YOUR_ID" method="POST">\n  <input type="text" name="name" placeholder="Name" />\n  <input type="email" name="email" placeholder="Email" />\n  <textarea name="message" placeholder="Message"></textarea>\n  <button type="submit">Send Message</button>\n</form>`,
    react: `export const Contact = () => (\n  <form action="https://api.formspark.io/YOUR_ID" method="POST" className="p-8 border-2 border-black space-y-4">\n    <input type="text" name="name" className="w-full border-b-2 border-black p-2" placeholder="Name" />\n    <input type="email" name="email" className="w-full border-b-2 border-black p-2" placeholder="Email" />\n    <textarea name="message" className="w-full border-b-2 border-black p-2 h-32" placeholder="Message"></textarea>\n    <button className="w-full bg-black text-white p-4 font-bold uppercase">Send</button>\n  </form>\n);`,
    Preview: SimpleContact
  },
  {
    id: 'brutalist-contact',
    category: 'Forms',
    name: 'Bold Contact',
    description: 'A striking contact form with thick borders and an orange background.',
    html: `<form action="https://api.formspark.io/YOUR_ID" method="POST">\n  <input type="text" name="name" />\n  <textarea name="message"></textarea>\n  <button type="submit">Send</button>\n</form>`,
    react: `export const BoldContact = () => (\n  <div className="p-8 border-4 border-black bg-orange-500 shadow-[12px_12px_0_#000]">\n    <form className="space-y-4">\n      <input type="text" className="w-full border-2 border-black p-4" placeholder="NAME" />\n      <textarea className="w-full border-2 border-black p-4 h-32" placeholder="MESSAGE"></textarea>\n      <button className="w-full bg-black text-orange-500 py-4 font-black uppercase">Send</button>\n    </form>\n  </div>\n);`,
    Preview: BrutalistContact
  },
  {
    id: 'minimal-contact',
    category: 'Forms',
    name: 'Minimal Contact',
    description: 'A very simple contact form with just lines and no boxes.',
    html: `<form action="https://api.formspark.io/YOUR_ID" method="POST">\n  <input type="text" name="name" />\n  <button type="submit">Send</button>\n</form>`,
    react: `export const MinimalContact = () => (\n  <form className="space-y-6">\n    <input type="text" placeholder="NAME" className="w-full bg-transparent border-b border-black py-4 outline-none uppercase text-xs" />\n    <button className="text-orange-500 font-black uppercase text-xs">Send</button>\n  </form>\n);`,
    Preview: MinimalContact
  },
  {
    id: 'agency-contact',
    category: 'Forms',
    name: 'Agency Contact',
    description: 'A professional split-screen form for creative agencies and studios.',
    html: `<form action="https://api.formspark.io/YOUR_ID" method="POST">\n  <input type="text" name="name" />\n  <input type="email" name="email" />\n  <textarea name="message"></textarea>\n  <button type="submit">Start Project</button>\n</form>`,
    react: `export const AgencyContact = () => (\n  <div className="grid grid-cols-2 border-2 border-black">\n    <div className="p-8 bg-orange-500 font-black">Let's Build.</div>\n    <form className="p-8 space-y-4">\n      <input type="text" placeholder="Name" className="w-full p-4 border-2 border-black" />\n      <button className="w-full bg-black text-white py-4 font-black">Start</button>\n    </form>\n  </div>\n);`,
    Preview: AgencyContact
  },
  {
    id: 'dark-contact',
    category: 'Forms',
    name: 'Dark Contact',
    description: 'A high-tech dark form with mono-spaced fonts and orange highlights.',
    html: `<form action="https://api.formspark.io/YOUR_ID" method="POST">\n  <input type="text" name="name" />\n  <button type="submit">Send</button>\n</form>`,
    react: `export const DarkContact = () => (\n  <div className="bg-black text-white p-10 border-4 border-orange-500">\n    <h3 className="font-mono text-xs mb-8 text-orange-500">Secure_Channel</h3>\n    <form className="space-y-4">\n      <input type="text" placeholder="IDENT_NAME" className="w-full p-4 bg-white/10 border border-white/20 font-mono text-xs" />\n      <button className="w-full bg-orange-500 text-black py-4 font-black uppercase text-xs">Initialize</button>\n    </form>\n  </div>\n);`,
    Preview: DarkContact
  },
  {
    id: 'newsletter-inline',
    category: 'Forms',
    name: 'Newsletter Form',
    description: 'A small form that fits perfectly in your website footer or sidebar.',
    html: `<form action="https://api.formspark.io/YOUR_ID" method="POST">\n  <input type="email" name="email" placeholder="Subscribe" />\n  <button type="submit">Join</button>\n</form>`,
    react: `export const Newsletter = () => (\n  <form action="https://api.formspark.io/YOUR_ID" method="POST" className="flex border-4 border-black">\n    <input type="email" name="email" className="flex-1 p-4 outline-none" placeholder="Email" />\n    <button className="bg-black text-white px-8 font-bold uppercase">Join</button>\n  </form>\n);`,
    Preview: InlineNewsletter
  },
  {
    id: 'sidebar-form',
    category: 'Forms',
    name: 'Sidebar Form',
    description: 'A thin form designed to sit in a narrow sidebar or mobile menu.',
    html: `<form action="https://api.formspark.io/YOUR_ID" method="POST">\n  <input type="text" name="name" />\n  <button type="submit">Go</button>\n</form>`,
    react: `export const SidebarForm = () => (\n  <div className="w-64 border-2 border-black">\n    <div className="bg-black text-white p-4 font-black text-[10px]">Quick Connect</div>\n    <form className="p-4 space-y-3">\n      <input type="text" className="w-full border border-black p-2 text-[10px]" />\n      <button className="w-full bg-orange-500 py-2 font-black text-[10px]">Go</button>\n    </form>\n  </div>\n);`,
    Preview: SidebarForm
  },
  {
    id: 'feedback-box',
    category: 'Feedback',
    name: 'Feedback Box',
    description: 'A simple box for users to share their thoughts or report bugs.',
    html: `<form action="https://api.formspark.io/YOUR_ID" method="POST">\n  <textarea name="feedback" placeholder="Message"></textarea>\n  <button type="submit">Send</button>\n</form>`,
    react: `export const Feedback = () => (\n  <form action="https://api.formspark.io/YOUR_ID" method="POST" className="p-6 border-2 border-black bg-white">\n    <textarea name="feedback" className="w-full border-2 border-black p-4 mb-4" />\n    <button className="w-full bg-orange-500 text-white p-4 font-bold">Send</button>\n  </form>\n);`,
    Preview: FeedbackBox
  }
];

const Library = () => {
  const [selectedId, setSelectedId] = useState(libraryItems[0].id);
  const [codeType, setCodeType] = useState('react');
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const activeItem = libraryItems.find(item => item.id === selectedId);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeItem[codeType]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredItems = libraryItems.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  const slideIn = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="h-screen bg-brand-bg text-brand-text overflow-hidden flex flex-col pt-[80px] transition-colors duration-500">
      <Navbar />

      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] bg-brand-primary text-brand-text p-4 rounded-full shadow-2xl border-2 border-brand-border"
      >
        {mobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar Toggle Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`
            hidden lg:flex absolute top-1/2 -translate-y-1/2 z-[51]
            w-8 h-12 bg-brand-text text-brand-bg items-center justify-center
            border-2 border-brand-border hover:bg-brand-primary hover:text-brand-text transition-all duration-300
            ${sidebarOpen ? 'left-[288px]' : 'left-0'}
          `}
        >
          {sidebarOpen ? <ChevronLeft size={20} strokeWidth={3} /> : <ChevronRight size={20} strokeWidth={3} />}
        </button>

        {/* Sidebar */}
        <motion.aside 
          initial="hidden"
          animate="visible"
          variants={slideIn}
          className={`
          fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto
          bg-brand-bg flex flex-col shrink-0 transition-all duration-300 ease-[0.16,1,0.3,1]
          ${sidebarOpen ? 'w-72 border-r-2 border-brand-border' : 'w-0 overflow-hidden border-r-0'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6 border-b-2 border-brand-border min-w-[288px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={16} />
              <input 
                type="text" 
                placeholder="Search forms..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-brand-bg border-2 border-brand-border p-3 pl-10 font-bold focus:outline-none focus:border-brand-primary transition-colors placeholder:opacity-50 text-sm"
              />
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar min-w-[288px]">
            {['Forms', 'Feedback'].map((cat, catIdx) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: catIdx * 0.1 }}
                key={cat} 
                className="space-y-1"
              >
                <p className="px-4 py-2 text-[10px] font-black uppercase opacity-40 tracking-widest">{cat}</p>
                {filteredItems.filter(i => i.category === cat).map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedId(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 font-bold uppercase text-xs flex items-center justify-between group transition-all
                      ${selectedId === item.id ? 'bg-brand-text text-brand-bg' : 'hover:bg-brand-primary hover:text-brand-text'}
                    `}
                  >
                    {item.name}
                    <ChevronRight size={14} className={`transition-transform ${selectedId === item.id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
                  </button>
                ))}
              </motion.div>
            ))}
          </nav>

          <div className="p-6 border-t-2 border-brand-border bg-brand-text text-brand-bg flex items-center justify-between min-w-[288px]">
            <span className="font-bold uppercase text-[10px]">Library Ready</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 relative no-scrollbar transition-all duration-300">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
               style={{
                 backgroundImage: 'linear-gradient(var(--color-brand-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand-border) 1px, transparent 1px)',
                 backgroundSize: '40px 40px'
               }}>
          </div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-4xl mx-auto space-y-10 relative z-10"
          >
            {/* Header */}
            <div className="space-y-3 border-b-2 border-brand-border pb-10">
              <span className="text-brand-primary font-black uppercase tracking-widest text-xs">Live Preview</span>
              <AnimatePresence mode="wait">
                <motion.h1 
                  key={activeItem.id + 'title'}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none"
                >
                  {activeItem.name}
                </motion.h1>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.p 
                  key={activeItem.id + 'desc'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  exit={{ opacity: 0 }}
                  className="text-lg md:text-xl font-bold max-w-2xl leading-snug"
                >
                  {activeItem.description}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Preview - Running Real Code */}
              <div className="space-y-6">
                <div className="bg-brand-bg border-2 border-brand-border p-8 md:p-10 min-h-[350px] md:min-h-[450px] flex items-center justify-center relative shadow-[8px_8px_0_var(--color-brand-border)]">
                  <div className="absolute top-4 left-4 text-[10px] font-black uppercase opacity-20 tracking-widest">Active Component</div>
                  
                  <div className="w-full flex justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeItem.id}
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.02, y: -10 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full flex justify-center"
                      >
                        <activeItem.Preview />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Responsive', icon: CheckCircle2 },
                    { label: 'Dark Mode', icon: CheckCircle2 },
                    { label: 'Ready to Use', icon: CheckCircle2 },
                  ].map(feat => (
                    <div key={feat.label} className="border border-brand-border p-3 flex items-center gap-3 bg-brand-bg">
                      <feat.icon size={14} className="text-green-500" />
                      <span className="font-bold text-[9px] uppercase tracking-wider">{feat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code */}
              <div className="flex flex-col h-full min-h-[350px]">
                <div className="flex border-2 border-brand-border bg-brand-bg">
                  <button 
                    onClick={() => setCodeType('react')}
                    className={`flex-1 py-3 font-black uppercase text-[10px] border-r-2 border-brand-border transition-all ${codeType === 'react' ? 'bg-brand-text text-brand-bg' : 'hover:bg-brand-primary hover:text-brand-text'}`}
                  >
                    React
                  </button>
                  <button 
                    onClick={() => setCodeType('html')}
                    className={`flex-1 py-4 font-black uppercase text-[10px] transition-all ${codeType === 'html' ? 'bg-brand-text text-brand-bg' : 'hover:bg-brand-primary hover:text-brand-text'}`}
                  >
                    HTML
                  </button>
                </div>

                <div className="flex-1 bg-brand-text text-brand-primary p-6 font-mono text-xs relative mt-4 border-2 border-brand-border shadow-[8px_8px_0_var(--color-brand-primary)] overflow-hidden">
                  <button 
                    onClick={handleCopy}
                    className="absolute top-4 right-4 bg-brand-primary text-brand-text p-2 hover:bg-white hover:text-black transition-all font-black uppercase text-[9px] z-10"
                  >
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                  <AnimatePresence mode="wait">
                    <motion.pre 
                      key={activeItem.id + codeType}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="mt-6 overflow-x-auto whitespace-pre-wrap relative z-0 max-h-[400px] overflow-y-auto no-scrollbar"
                    >
                      <code>{activeItem[codeType]}</code>
                    </motion.pre>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-brand-bg border-2 border-brand-border p-8 mb-12 shadow-[6px_6px_0_var(--color-brand-border)]">
               <h3 className="text-2xl font-black uppercase mb-6 tracking-tight">How to use</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <span className="text-3xl font-black opacity-10">01</span>
                    <p className="font-bold text-base leading-tight">Pick a form you like from the list on the left.</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-3xl font-black opacity-10">02</span>
                    <p className="font-bold text-base leading-tight">Click the "Copy Code" button to grab the code.</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-3xl font-black opacity-10">03</span>
                    <p className="font-bold text-base leading-tight">Paste it into your website and add your Form ID.</p>
                  </div>
               </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Library;
