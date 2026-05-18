import React, { useState, useEffect } from 'react';
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
  Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getForms } from '../services/formsService';
import Navbar from '../components/layout/Navbar';
import toast from 'react-hot-toast';

// Live Form Components for Previews
const WaitlistForm = () => (
  <div className="w-full max-w-sm">
    <form className="flex flex-col sm:flex-row gap-0 border-2 border-black">
      <input type="email" placeholder="Your email address" className="flex-1 p-3 bg-white outline-none font-bold text-xs" readOnly />
      <button type="button" className="bg-[#111] text-white px-6 py-3 font-black uppercase text-xs hover:bg-brand-primary hover:text-black transition-colors">Join</button>
    </form>
  </div>
);

const SimpleContact = () => (
  <div className="w-full max-w-md bg-[#FAF9F5] border-4 border-black p-6 shadow-[6px_6px_0_rgba(0,0,0,1)]">
    <form className="space-y-4">
      <div className="space-y-1">
        <label className="text-[9px] font-black uppercase text-black/50">Full Name</label>
        <input type="text" className="w-full border-2 border-black bg-white px-3 py-2 outline-none font-bold text-xs" placeholder="John Doe" readOnly />
      </div>
      <div className="space-y-1">
        <label className="text-[9px] font-black uppercase text-black/50">Email Address</label>
        <input type="email" className="w-full border-2 border-black bg-white px-3 py-2 outline-none font-bold text-xs" placeholder="john@domain.com" readOnly />
      </div>
      <div className="space-y-1">
        <label className="text-[9px] font-black uppercase text-black/50">Message Body</label>
        <textarea className="w-full border-2 border-black bg-white px-3 py-2 outline-none font-bold text-xs h-20 resize-none" placeholder="Hello..." readOnly></textarea>
      </div>
      <button type="button" className="w-full bg-[#111] text-white py-3 font-black uppercase text-xs mt-2 hover:bg-brand-primary hover:text-black transition-colors">Submit Response</button>
    </form>
  </div>
);

const BrutalistContact = () => (
  <div className="w-full max-w-md space-y-6">
    <div className="p-6 border-4 border-black bg-brand-primary shadow-[8px_8px_0_rgba(0,0,0,1)]">
      <h3 className="text-xl font-black uppercase mb-4 tracking-tight">TRANSMIT DATA</h3>
      <form className="space-y-3">
        <input type="text" className="w-full border-2 border-black p-3 bg-white font-bold text-xs" placeholder="NAME" readOnly />
        <input type="email" className="w-full border-2 border-black p-3 bg-white font-bold text-xs" placeholder="EMAIL" readOnly />
        <textarea className="w-full border-2 border-black p-3 bg-white font-bold text-xs h-24" placeholder="MESSAGE" readOnly></textarea>
        <button type="button" className="w-full bg-[#111] text-brand-primary py-3 font-black uppercase text-xs border-2 border-black hover:bg-white hover:text-black transition-colors">PUSH DATA</button>
      </form>
    </div>
  </div>
);

const InlineNewsletter = () => (
  <div className="w-full max-w-xl flex border-4 border-black bg-white overflow-hidden shadow-[4px_4px_0_rgba(0,0,0,1)]">
    <div className="p-3 flex items-center border-r-2 border-black opacity-30">
      <Mail size={16} />
    </div>
    <input type="email" className="flex-1 p-3 bg-transparent outline-none font-bold text-xs" placeholder="teammate@company.com" readOnly />
    <button type="button" className="bg-[#111] text-white px-8 font-black uppercase text-xs hover:bg-brand-primary hover:text-black transition-colors">Join</button>
  </div>
);

const FeedbackBox = () => (
  <div className="w-72 bg-white border-4 border-black p-5 shadow-[6px_6px_0_#FF8A00]">
    <div className="flex items-center gap-2 mb-3">
      <MessageSquare size={14} className="text-brand-primary" />
      <span className="text-[9px] font-black uppercase tracking-widest">Share Feedback</span>
    </div>
    <form className="space-y-3">
      <textarea className="w-full h-24 bg-black/[0.02] border-2 border-black p-3 outline-none font-bold text-xs" placeholder="Tell us what you think..." readOnly></textarea>
      <button type="button" className="w-full bg-brand-primary text-black py-2.5 font-black uppercase text-xs hover:bg-black hover:text-white transition-colors">Submit</button>
    </form>
  </div>
);

const AgencyContact = () => (
  <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 border-4 border-black bg-white shadow-[10px_10px_0_rgba(0,0,0,1)]">
    <div className="p-6 bg-brand-primary text-brand-text flex flex-col justify-between border-b-2 sm:border-b-0 sm:border-r-2 border-black">
      <h3 className="text-2xl font-black uppercase leading-none tracking-tight">Let's build.</h3>
      <div className="space-y-1 text-[10px] font-bold opacity-75 mt-6">
        <p>hello@formspark.io</p>
        <p>+1 234 567 890</p>
      </div>
    </div>
    <form className="p-6 space-y-3 bg-white">
      <input type="text" placeholder="Name" className="w-full p-2.5 border-2 border-black bg-transparent font-bold text-xs" readOnly />
      <input type="email" placeholder="Email" className="w-full p-2.5 border-2 border-black bg-transparent font-bold text-xs" readOnly />
      <textarea placeholder="Your request" className="w-full p-2.5 border-2 border-black bg-transparent font-bold text-xs h-20 resize-none" readOnly></textarea>
      <button type="button" className="w-full bg-[#111] text-white py-3 font-black uppercase text-xs hover:bg-brand-primary hover:text-black transition-colors">Start Project</button>
    </form>
  </div>
);

const DarkContact = () => (
  <div className="w-full max-w-sm bg-[#111] text-white p-8 border-4 border-brand-primary shadow-[8px_8px_0_rgba(255,255,255,1)]">
    <h3 className="text-base font-black uppercase mb-6 tracking-widest text-brand-primary">Secure_Endpoint</h3>
    <form className="space-y-3">
      <div className="p-3 bg-white/5 border border-white/10 flex items-center gap-3">
        <User size={14} className="opacity-40" />
        <input type="text" placeholder="IDENT_NAME" className="bg-transparent outline-none font-mono text-[10px] w-full text-white" readOnly />
      </div>
      <div className="p-3 bg-white/5 border border-white/10 flex items-center gap-3">
        <Mail size={14} className="opacity-40" />
        <input type="email" placeholder="IDENT_MAIL" className="bg-transparent outline-none font-mono text-[10px] w-full text-white" readOnly />
      </div>
      <textarea placeholder="TRANSMIT_PAYLOAD" className="w-full p-3 bg-white/5 border border-white/10 outline-none font-mono text-[10px] h-20 resize-none text-white" readOnly></textarea>
      <button type="button" className="w-full bg-brand-primary text-black py-3 font-black uppercase text-xs">Initialize_Transfer</button>
    </form>
  </div>
);

const libraryItems = [
  {
    id: 'waitlist-form',
    category: 'Forms',
    name: 'Waitlist Form',
    description: 'A simple way to collect email addresses for your upcoming launch.',
    html: (token) => `<form action="https://api.formspark.io/v1/submit/${token}" method="POST">
  <input type="email" name="email" placeholder="Your email" required />
  <button type="submit">Join Waitlist</button>
</form>`,
    react: (token) => `export const Waitlist = () => (
  <form action="https://api.formspark.io/v1/submit/${token}" method="POST" className="flex border-2 border-black">
    <input type="email" name="email" className="flex-1 p-4 bg-white" placeholder="Your email" required />
    <button className="bg-black text-white px-8 font-bold uppercase">Join</button>
  </form>
);`,
    Preview: WaitlistForm
  },
  {
    id: 'simple-contact',
    category: 'Forms',
    name: 'Simple Contact',
    description: 'A clean contact form with clear text fields and labels.',
    html: (token) => `<form action="https://api.formspark.io/v1/submit/${token}" method="POST">
  <input type="text" name="name" placeholder="Name" required />
  <input type="email" name="email" placeholder="Email" required />
  <textarea name="message" placeholder="Message"></textarea>
  <button type="submit">Send Message</button>
</form>`,
    react: (token) => `export const Contact = () => (
  <form action="https://api.formspark.io/v1/submit/${token}" method="POST" className="p-8 border-2 border-black space-y-4">
    <input type="text" name="name" className="w-full border-b-2 border-black p-2" placeholder="Name" required />
    <input type="email" name="email" className="w-full border-b-2 border-black p-2" placeholder="Email" required />
    <textarea name="message" className="w-full border-b-2 border-black p-2 h-32" placeholder="Message"></textarea>
    <button className="w-full bg-black text-white p-4 font-bold uppercase">Send</button>
  </form>
);`,
    Preview: SimpleContact
  },
  {
    id: 'brutalist-contact',
    category: 'Forms',
    name: 'Bold Contact',
    description: 'A striking contact form with thick borders and an orange background.',
    html: (token) => `<form action="https://api.formspark.io/v1/submit/${token}" method="POST">
  <input type="text" name="name" required />
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>`,
    react: (token) => `export const BoldContact = () => (
  <div className="p-8 border-4 border-black bg-orange-500 shadow-[12px_12px_0_#000]">
    <form action="https://api.formspark.io/v1/submit/${token}" method="POST" className="space-y-4">
      <input type="text" name="name" className="w-full border-2 border-black p-4" placeholder="NAME" required />
      <textarea name="message" className="w-full border-2 border-black p-4 h-32" placeholder="MESSAGE" required></textarea>
      <button className="w-full bg-black text-orange-500 py-4 font-black uppercase">Send</button>
    </form>
  </div>
);`,
    Preview: BrutalistContact
  },
  {
    id: 'agency-contact',
    category: 'Forms',
    name: 'Agency Contact',
    description: 'A professional split-screen form for creative agencies and studios.',
    html: (token) => `<form action="https://api.formspark.io/v1/submit/${token}" method="POST">
  <input type="text" name="name" required />
  <input type="email" name="email" required />
  <textarea name="message"></textarea>
  <button type="submit">Start Project</button>
</form>`,
    react: (token) => `export const AgencyContact = () => (
  <div className="grid grid-cols-2 border-2 border-black">
    <div className="p-8 bg-orange-500 font-black">Let's Build.</div>
    <form action="https://api.formspark.io/v1/submit/${token}" method="POST" className="p-8 space-y-4">
      <input type="text" name="name" placeholder="Name" className="w-full p-4 border-2 border-black" required />
      <button className="w-full bg-black text-white py-4 font-black">Start</button>
    </form>
  </div>
);`,
    Preview: AgencyContact
  },
  {
    id: 'dark-contact',
    category: 'Forms',
    name: 'Dark Contact',
    description: 'A high-tech dark form with mono-spaced fonts and orange highlights.',
    html: (token) => `<form action="https://api.formspark.io/v1/submit/${token}" method="POST">
  <input type="text" name="name" required />
  <button type="submit">Send</button>
</form>`,
    react: (token) => `export const DarkContact = () => (
  <div className="bg-black text-white p-10 border-4 border-orange-500">
    <h3 className="font-mono text-xs mb-8 text-orange-500">Secure_Channel</h3>
    <form action="https://api.formspark.io/v1/submit/${token}" method="POST" className="space-y-4">
      <input type="text" name="name" placeholder="IDENT_NAME" className="w-full p-4 bg-white/10 border border-white/20 font-mono text-xs" required />
      <button className="w-full bg-orange-500 text-black py-4 font-black uppercase text-xs">Initialize</button>
    </form>
  </div>
);`,
    Preview: DarkContact
  },
  {
    id: 'newsletter-inline',
    category: 'Forms',
    name: 'Newsletter Form',
    description: 'A small form that fits perfectly in your website footer or sidebar.',
    html: (token) => `<form action="https://api.formspark.io/v1/submit/${token}" method="POST">
  <input type="email" name="email" placeholder="Subscribe" required />
  <button type="submit">Join</button>
</form>`,
    react: (token) => `export const Newsletter = () => (
  <form action="https://api.formspark.io/v1/submit/${token}" method="POST" className="flex border-4 border-black">
    <input type="email" name="email" className="flex-1 p-4 outline-none" placeholder="Email" required />
    <button className="bg-black text-white px-8 font-bold uppercase">Join</button>
  </form>
);`,
    Preview: InlineNewsletter
  },
  {
    id: 'feedback-box',
    category: 'Feedback',
    name: 'Feedback Box',
    description: 'A simple box for users to share their thoughts or report bugs.',
    html: (token) => `<form action="https://api.formspark.io/v1/submit/${token}" method="POST">
  <textarea name="feedback" placeholder="Message" required></textarea>
  <button type="submit">Send</button>
</form>`,
    react: (token) => `export const Feedback = () => (
  <form action="https://api.formspark.io/v1/submit/${token}" method="POST" className="p-6 border-2 border-black bg-white">
    <textarea name="feedback" className="w-full border-2 border-black p-4 mb-4" required />
    <button className="w-full bg-orange-500 text-white p-4 font-bold">Send</button>
  </form>
);`,
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

  // Supabase dynamic form wiring
  const [forms, setForms] = useState([]);
  const [selectedToken, setSelectedToken] = useState('YOUR_FORM_TOKEN');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [useCounts, setUseCounts] = useState({});

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        const userForms = await getForms();
        setForms(userForms);
        if (userForms.length > 0) {
          setSelectedToken(userForms[0].token);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = () => {
    const textToCopy = codeType === 'react' 
      ? activeItem.react(selectedToken)
      : activeItem.html(selectedToken);
      
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);

    // Track use count
    setUseCounts(prev => ({
      ...prev,
      [selectedId]: (prev[selectedId] || 0) + 1
    }));
  };

  const activeItem = libraryItems.find(item => item.id === selectedId);
  const filteredItems = libraryItems.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen bg-brand-bg text-brand-text overflow-hidden flex flex-col pt-[80px] transition-colors duration-500">
      <Navbar />

      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] bg-brand-primary text-brand-text p-4 rounded-full shadow-2xl border-2 border-brand-border"
      >
        {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar Toggle Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`
            hidden lg:flex absolute top-1/2 -translate-y-1/2 z-[51]
            w-8 h-12 bg-black text-white items-center justify-center
            border-2 border-black hover:bg-brand-primary hover:text-black transition-all duration-300
            ${sidebarOpen ? 'left-[288px]' : 'left-0'}
          `}
        >
          {sidebarOpen ? <ChevronLeft size={16} strokeWidth={3} /> : <ChevronRight size={16} strokeWidth={3} />}
        </button>

        {/* Sidebar */}
        <motion.aside 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`
            fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto
            bg-[#F5F5F5] flex flex-col shrink-0 transition-all duration-300 ease-[0.16,1,0.3,1]
            ${sidebarOpen ? 'w-72 border-r-2 border-black' : 'w-0 overflow-hidden border-r-0'}
            ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="p-6 border-b-2 border-black min-w-[288px] bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-35" size={14} />
              <input 
                type="text" 
                placeholder="Search templates..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#FAF9F5] border-2 border-black p-2.5 pl-10 font-bold focus:outline-none focus:border-brand-primary transition-colors placeholder:opacity-50 text-xs"
              />
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar min-w-[288px]">
            {['Forms', 'Feedback'].map((cat) => (
              <div key={cat} className="space-y-1">
                <p className="px-4 py-1.5 text-[9px] font-black uppercase opacity-40 tracking-widest">{cat}</p>
                {filteredItems.filter(i => i.category === cat).map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedId(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 font-bold uppercase text-[11px] flex items-center justify-between group transition-all border-2 ${
                      selectedId === item.id 
                        ? 'bg-black text-white border-black' 
                        : 'bg-transparent border-transparent hover:bg-black/5 hover:border-black/10'
                    }`}
                  >
                    {item.name}
                    <div className="flex items-center gap-2">
                      {useCounts[item.id] > 0 && (
                        <span className="text-[8px] px-1.5 py-0.5 bg-brand-primary text-black font-black uppercase rounded-sm border border-black/10">
                          {useCounts[item.id]} copied
                        </span>
                      )}
                      <ChevronRight size={12} className={`transition-transform ${selectedId === item.id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <div className="p-6 border-t-2 border-black bg-black text-white flex items-center justify-between min-w-[288px]">
            <span className="font-black uppercase text-[9px] tracking-widest">Library status</span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-green-400">ONLINE</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 relative no-scrollbar transition-all duration-300">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
               style={{
                 backgroundImage: 'linear-gradient(var(--color-brand-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand-border) 1px, transparent 1px)',
                 backgroundSize: '40px 40px'
               }}>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-10 relative z-10"
          >
            {/* Header */}
            <div className="space-y-2 border-b-2 border-black pb-8">
              <span className="text-brand-primary font-black uppercase tracking-widest text-[10px]">Live Interactive Preview</span>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                {activeItem.name}
              </h1>
              <p className="text-sm font-bold text-black/50 max-w-2xl leading-snug">
                {activeItem.description}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Preview Rendering */}
              <div className="space-y-6">
                <div className="bg-[#FAF9F5] border-4 border-black p-8 md:p-10 min-h-[300px] flex items-center justify-center relative shadow-[8px_8px_0_rgba(0,0,0,1)]">
                  <div className="absolute top-4 left-4 text-[9px] font-black uppercase opacity-25 tracking-widest">Interactive Component Mock</div>
                  <div className="w-full flex justify-center">
                    <activeItem.Preview />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Responsive', icon: CheckCircle2 },
                    { label: 'Neo-Brutalist', icon: CheckCircle2 },
                    { label: 'Tested Code', icon: CheckCircle2 },
                  ].map(feat => (
                    <div key={feat.label} className="border-2 border-black p-2.5 flex items-center gap-2 bg-white">
                      <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                      <span className="font-black text-[8px] uppercase tracking-wider">{feat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Blocks & Token Wiring */}
              <div className="flex flex-col space-y-6">
                {/* Wiring Section */}
                <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0_rgba(0,0,0,1)] space-y-4">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Form Token Connection</h3>
                    <p className="text-[9px] font-bold text-black/40 uppercase mt-0.5">Wire this snippet directly to an endpoint in your account.</p>
                  </div>

                  {isAuthenticated ? (
                    forms.length > 0 ? (
                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase text-black/55 tracking-wider block">Connected Form</label>
                        <select
                          className="w-full bg-[#F5F5F5] border-2 border-black px-4 py-2 outline-none font-bold text-xs rounded-none"
                          value={selectedToken}
                          onChange={(e) => setSelectedToken(e.target.value)}
                        >
                          {forms.map(f => (
                            <option key={f.id} value={f.token}>{f.name} ({f.token})</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="p-3 bg-brand-primary/10 border border-brand-primary text-xs font-bold text-black/70">
                        No form endpoints active. We're using placeholder tokens. Create a form in <Link to="/dashboard" className="underline font-black">Dashboard</Link> first.
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-brand-primary/5 border border-brand-primary/20">
                      <p className="text-[9px] font-bold text-black/50 uppercase tracking-wide">Login to automatically wire your actual form tokens.</p>
                      <Link to="/login" className="bg-black text-white px-3 py-1.5 text-[9px] font-black uppercase tracking-widest shrink-0">Login</Link>
                    </div>
                  )}
                </div>

                {/* Code display */}
                <div className="flex flex-col">
                  <div className="flex border-2 border-black bg-white">
                    <button 
                      onClick={() => setCodeType('react')}
                      className={`flex-1 py-2 font-black uppercase text-[9px] border-r-2 border-black transition-all ${codeType === 'react' ? 'bg-black text-white' : 'hover:bg-brand-primary hover:text-black'}`}
                    >
                      React Component
                    </button>
                    <button 
                      onClick={() => setCodeType('html')}
                      className={`flex-1 py-2 font-black uppercase text-[9px] transition-all ${codeType === 'html' ? 'bg-black text-white' : 'hover:bg-brand-primary hover:text-black'}`}
                    >
                      Raw HTML5 Form
                    </button>
                  </div>

                  <div className="bg-[#111] text-brand-primary p-5 font-mono text-[10px] relative mt-3 border-4 border-black shadow-[6px_6px_0_#FF8A00] overflow-hidden min-h-[220px]">
                    <button 
                      onClick={handleCopy}
                      className="absolute top-3 right-3 bg-brand-primary text-black px-3 py-1.5 hover:bg-white hover:text-black transition-all font-black uppercase text-[8px] border border-black z-10"
                    >
                      {copied ? 'Copied!' : 'Copy snippet'}
                    </button>
                    
                    <pre className="mt-6 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto text-white/90">
                      <code>
                        {codeType === 'react' 
                          ? activeItem.react(selectedToken)
                          : activeItem.html(selectedToken)
                        }
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Help / Workflow */}
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_rgba(0,0,0,1)]">
               <h3 className="text-xl font-black uppercase mb-6 tracking-tight">How to deploy live forms</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-1">
                    <span className="text-3xl font-black text-brand-primary opacity-30 block">01.</span>
                    <p className="font-bold text-xs uppercase tracking-wide">Pick a template form from the sidebar catalog list.</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-3xl font-black text-brand-primary opacity-30 block">02.</span>
                    <p className="font-bold text-xs uppercase tracking-wide">Select your active endpoint token from the selector.</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-3xl font-black text-brand-primary opacity-30 block">03.</span>
                    <p className="font-bold text-xs uppercase tracking-wide">Copy snippet directly to your client code base and deploy.</p>
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
