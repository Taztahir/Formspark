import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Code, 
  Shield, 
  Webhook, 
  Mail, 
  Copy, 
  LayoutTemplate, 
  Terminal,
  MessageSquare,
  Check
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';

// Lite Real Form Components for Landing Preview
const WaitlistLite = () => (
  <form className="flex border-2 border-brand-border w-full max-w-[200px] overflow-hidden" onClick={(e) => e.preventDefault()}>
    <input type="email" placeholder="Email" className="flex-1 h-10 bg-brand-bg px-3 text-[10px] outline-none" disabled />
    <button type="button" className="w-12 h-10 bg-brand-text text-brand-bg text-[10px] font-bold">JOIN</button>
  </form>
);

const ContactLite = () => (
  <form className="space-y-2 w-full max-w-[180px]" onClick={(e) => e.preventDefault()}>
    <input type="text" placeholder="Name" className="h-8 w-full border-2 border-brand-border bg-brand-bg px-2 text-[10px] outline-none" disabled />
    <textarea placeholder="Message" className="h-16 w-full border-2 border-brand-border bg-brand-bg px-2 py-1 text-[10px] outline-none resize-none" disabled />
    <button type="button" className="h-10 bg-brand-text text-brand-bg w-full text-[10px] font-bold uppercase">Send</button>
  </form>
);

const FeedbackLite = () => (
  <form className="p-4 border-2 border-brand-border bg-brand-bg space-y-3 shadow-[4px_4px_0_var(--color-brand-primary)] w-full max-w-[180px]" onClick={(e) => e.preventDefault()}>
    <input type="text" placeholder="Feedback" className="h-8 w-full border border-brand-border bg-brand-bg px-2 text-[10px] outline-none" disabled />
    <button type="button" className="h-6 bg-brand-primary text-brand-text w-1/2 ml-auto text-[9px] font-black uppercase">Submit</button>
  </form>
);

const TypewriterCode = () => {
  const lines = [
    { text: '<form', color: 'text-brand-primary' },
    { text: '  action="https://api.formspark.io/f/your-id"', color: 'text-brand-bg' },
    { text: '  method="POST"', color: 'text-brand-bg' },
    { text: '>', color: 'text-brand-primary' },
    { text: '  <input type="email" name="email" />', color: 'text-brand-bg' },
    { text: '  <textarea name="message"></textarea>', color: 'text-brand-bg' },
    { text: '  <button type="submit">Send</button>', color: 'text-brand-bg' },
    { text: '</form>', color: 'text-brand-primary' }
  ];
  
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex < lines.length) {
      if (currentCharIndex < lines[currentLineIndex].text.length) {
        const timeout = setTimeout(() => {
          setCurrentCharIndex(prev => prev + 1);
        }, 15);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, 100);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentLineIndex, currentCharIndex, lines]);

  return (
    <div className="font-mono text-[10px] sm:text-xs md:text-sm lg:text-base space-y-1.5 md:space-y-2">
      {lines.map((line, idx) => {
        if (idx > currentLineIndex) return null;
        
        const content = idx === currentLineIndex 
          ? line.text.slice(0, currentCharIndex) 
          : line.text;
          
        return (
          <div key={idx} className="flex gap-3 md:gap-4">
            <span className="w-6 md:w-8 text-right opacity-20 select-none text-brand-bg">{(idx + 1).toString().padStart(2, '0')}</span>
            <div className={`${line.color} font-bold whitespace-pre`}>
              {content}
              {idx === currentLineIndex && (
                <motion.span 
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-1.5 h-3 md:w-2 md:h-4 bg-brand-primary ml-1 align-middle"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Landing = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen pt-[80px] relative">
      <Navbar />

      {/* Persistent Architectural Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.05] dark:opacity-[0.1]"
           style={{
             backgroundImage: 'radial-gradient(var(--color-brand-border) 1.5px, transparent 1.5px)',
             backgroundSize: '40px 40px'
           }}>
      </div>

      <main className="grid-container relative z-10 bg-brand-bg shadow-[0_0_100px_rgba(0,0,0,0.1)]">
        {/* Massive Background Text behind Hero */}
        <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none opacity-5 dark:opacity-10 h-[85vh] flex items-center justify-center overflow-hidden">
           <motion.h1 style={{ y: y1 }} className="text-[15vw] font-black tracking-tighter whitespace-nowrap leading-none select-none">
             FORMSPARK
           </motion.h1>
        </div>

        {/* Hero Section */}
        <section className="grid-section min-h-[70vh] flex flex-col xl:flex-row overflow-hidden relative">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="w-full xl:w-1/2 border-r border-brand-border p-8 md:p-12 flex flex-col justify-between relative z-10 bg-brand-bg/80 backdrop-blur-sm"
          >
            <div>
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 border border-brand-primary text-brand-primary text-xs font-black uppercase tracking-widest mb-12">
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
                System Operational
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-[10vw] xl:text-[5vw] leading-[0.85] mb-8 mt-4 tracking-tighter uppercase font-black">
                FORMS.<br/>
                <span className="text-brand-primary">SOLVED.</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg md:text-xl font-bold max-w-lg leading-snug opacity-80">
                The developer-first form backend. Build your custom UI, point your action to our API, and we handle the spam, emails, and integrations.
              </motion.p>
            </div>
            
            <motion.div variants={fadeInUp} className="mt-16 flex flex-col sm:flex-row gap-6">
              <Link to="/signup">
                <Button size="lg" icon={ArrowRight}>Get Your Endpoint</Button>
              </Link>
              <Link to="/library">
                <Button size="lg" variant="secondary" icon={LayoutTemplate}>Explore UI Library</Button>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Hero Visual - Code Only */}
          <div className="w-full xl:w-1/2 flex flex-col relative z-10 bg-brand-bg/90">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 border-brand-border bg-brand-text text-brand-bg p-8 flex flex-col justify-center relative overflow-hidden group"
            >
              <div className="absolute top-4 right-4 text-brand-primary font-bold flex items-center gap-2">
                <Terminal size={16} /> 01_CODE
              </div>
              
              {/* Interactive Typing Code */}
              <div className="scale-110">
                <TypewriterCode />
              </div>
              
              {/* Decorative grid in code block */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none"
                   style={{
                     backgroundImage: 'radial-gradient(var(--color-brand-primary) 1.5px, transparent 1.5px)',
                     backgroundSize: '30px 30px'
                   }}>
              </div>
            </motion.div>
          </div>
        </section>

        {/* UI Library Section */}
        <section id="library" className="grid-section bg-brand-bg overflow-hidden relative">
          <motion.div style={{ y: y2 }} className="absolute -left-20 top-40 text-[15vw] font-black opacity-5 pointer-events-none select-none text-brand-text transform -rotate-90">
            COMPONENTS
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="border-b border-brand-border p-8 md:p-16 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10 bg-brand-bg/80 backdrop-blur-md"
          >
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">Library_</h2>
              <p className="text-lg md:text-xl font-bold max-w-xl opacity-80">
                Copy and paste our simple form components directly into your project.
              </p>
            </div>
            <Link to="/library">
              <Button variant="secondary" icon={Copy} className="bg-brand-bg text-brand-text">Browse All Components</Button>
            </Link>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 relative z-10"
          >
            {[
              { 
                name: 'Waitlist Form', 
                desc: 'Get emails for your next launch.', 
                preview: <WaitlistLite />,
                code: `<form className="flex border-2 border-black">\n  <input type="email" placeholder="Email" />\n  <button>JOIN</button>\n</form>`
              },
              { 
                name: 'Simple Contact', 
                desc: 'A clean way for users to message you.', 
                preview: <ContactLite />,
                code: `<form className="space-y-4">\n  <input type="text" placeholder="Name" />\n  <textarea placeholder="Message" />\n  <button>SEND</button>\n</form>`
              },
              { 
                name: 'Feedback Box', 
                desc: 'Hear what your users think.', 
                preview: <FeedbackLite />,
                code: `<form className="p-6 border-2 border-black">\n  <textarea placeholder="Feedback" />\n  <button>SUBMIT</button>\n</form>`
              },
            ].map((component, i) => {
              const [copied, setCopied] = React.useState(false);

              const handleCopy = (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(component.code);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              };

              return (
                <motion.div 
                  variants={fadeInUp} 
                  key={i} 
                  onClick={handleCopy}
                  className="card-editorial group cursor-pointer relative overflow-hidden bg-brand-bg hover:bg-brand-primary min-h-[400px] lg:h-[400px]"
                >
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzExMSIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-50 dark:invert transition-opacity group-hover:opacity-10"></div>
                  
                  {/* Visual Preview Area */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 transition-transform duration-500 group-hover:-translate-y-8">
                    <div className="w-full flex justify-center">
                      {component.preview}
                    </div>
                    <div className="mt-8 text-center">
                      <p className="text-xl font-black uppercase tracking-tighter">{component.name}</p>
                      <p className="text-sm font-bold opacity-60 mt-1">{component.desc}</p>
                    </div>
                  </div>

                  {/* Code Reveal Overlay on Hover */}
                  <div className="absolute inset-0 bg-brand-text p-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1] z-20 flex flex-col justify-center">
                    <pre className="text-brand-primary font-mono text-[10px] leading-relaxed overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                      {component.code}
                    </pre>
                    <div className="absolute bottom-8 right-8 text-brand-primary flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
                      {copied ? (
                        <>
                          <Check size={14} className="text-green-500" />
                          <span className="text-green-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Click to Copy</span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Backend Features Section */}
        <section id="backend" className="grid-section">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="border-b border-brand-border p-8 md:p-16 bg-brand-text text-brand-bg relative overflow-hidden"
          >
             {/* Decorative abstract circle */}
             <div className="absolute -right-40 -top-40 w-96 h-96 border-[40px] border-brand-primary rounded-full opacity-20 pointer-events-none"></div>

            <h2 className="text-4xl md:text-6xl font-black text-brand-primary relative z-10 uppercase tracking-tighter">Backend_</h2>
            <p className="text-lg md:text-2xl font-bold max-w-2xl mt-4 text-brand-bg relative z-10 opacity-80">
              Your HTML handles the UI. Our API handles the heavy lifting.
            </p>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { title: 'Spam Protection', desc: 'Automatic honeypots, reCAPTCHA, and AI-driven filtering. Zero bots.', icon: Shield },
              { title: 'Email Routing', desc: 'Instantly route submissions to your team via customizable email templates.', icon: Mail },
              { title: 'Webhooks', desc: 'Pipe your form data to your own servers or internal APIs in real-time.', icon: Webhook },
              { title: 'Auto-Responders', desc: 'Send branded confirmation emails to your users the second they submit.', icon: ArrowRight },
            ].map((feature, i) => (
              <motion.div variants={fadeInUp} key={i} className="card-editorial group bg-brand-bg min-h-[300px] xl:h-[350px]">
                <feature.icon size={56} strokeWidth={1.5} className="mb-12 text-brand-primary group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500" />
                <div>
                  <h3 className="text-2xl font-black mb-4 uppercase">{feature.title}</h3>
                  <p className="text-lg font-medium opacity-80 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="grid-section">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="border-b border-brand-border p-8 md:p-12 flex justify-between items-end"
          >
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Pricing_</h2>
            <div className="hidden md:block w-20 h-20 border-4 border-brand-primary rounded-full animate-[spin_10s_linear_infinite] border-t-transparent"></div>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3"
          >
            {[
              { name: 'DEV', price: '$0', desc: '250 submissions/mo. Unlimited forms. UI Library access.', btn: 'secondary' },
              { name: 'PRO', price: '$15', desc: '5,000 submissions/mo. Webhooks. Auto-responders. Remove branding.', btn: 'primary' },
              { name: 'AGENCY', price: '$49', desc: 'Unlimited submissions. Priority support. Custom domains.', btn: 'secondary' },
            ].map((plan, i) => (
              <motion.div variants={fadeInUp} key={i} className="border-r border-brand-border last:border-r-0 p-8 md:p-16 flex flex-col group hover:bg-brand-text hover:text-brand-bg transition-colors duration-500">
                <h3 className="text-3xl font-black mb-4 uppercase tracking-widest opacity-50 group-hover:opacity-100 group-hover:text-brand-primary">{plan.name}</h3>
                <div className="text-7xl font-black mb-8 flex items-end gap-2">
                  {plan.price}<span className="text-2xl opacity-50 mb-2">/MO</span>
                </div>
                <p className="text-xl font-bold mb-12 flex-1">{plan.desc}</p>
                <Button variant={plan.btn} className="w-full group-hover:bg-brand-primary group-hover:text-brand-text group-hover:border-transparent group-hover:shadow-[8px_8px_0_#fff] dark:group-hover:shadow-[8px_8px_0_#000]">Procure Architecture</Button>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-border bg-brand-text text-brand-bg pt-20 pb-12 relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none"
             style={{
               backgroundImage: 'linear-gradient(var(--color-brand-primary) 2px, transparent 2px), linear-gradient(90deg, var(--color-brand-primary) 2px, transparent 2px)',
               backgroundSize: '40px 40px'
             }}>
        </div>
        <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
          <div>
            <h2 className="text-[8vw] md:text-6xl font-black mb-6 tracking-tighter text-brand-primary leading-none">FORM.SPARK</h2>
            <p className="text-xl font-bold opacity-80 max-w-sm">The absolute easiest way to collect data from your React, Vue, and HTML websites.</p>
          </div>
          <div className="flex md:justify-end">
            <div className="grid grid-cols-2 gap-16">
              <div className="flex flex-col gap-6">
                <span className="text-xs font-black text-brand-primary uppercase tracking-widest border-b border-brand-primary pb-2">Product</span>
                <a href="#library" className="font-bold hover:text-brand-primary transition-colors text-lg">UI Library</a>
                <a href="#backend" className="font-bold hover:text-brand-primary transition-colors text-lg">Features</a>
                <a href="#pricing" className="font-bold hover:text-brand-primary transition-colors text-lg">Economics</a>
                <Link to="/terms" className="font-bold hover:text-brand-primary transition-colors text-lg">Terms of Service</Link>
              </div>
              <div className="flex flex-col gap-6">
                <span className="text-xs font-black text-brand-primary uppercase tracking-widest border-b border-brand-primary pb-2">Developers</span>
                <a href="#" className="font-bold hover:text-brand-primary transition-colors text-lg">Documentation</a>
                <a href="#" className="font-bold hover:text-brand-primary transition-colors text-lg">API Reference</a>
                <a href="#" className="font-bold hover:text-brand-primary transition-colors text-lg">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
