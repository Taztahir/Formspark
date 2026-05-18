import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

// Safe SVG Icons
const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
);

const TypewriterCode = () => {
  const lines = [
    { text: '<form', color: 'text-brand-primary' },
    { text: '  action="https://api.formspark.io/register"', color: 'text-white' },
    { text: '  method="POST"', color: 'text-white' },
    { text: '>', color: 'text-brand-primary' },
    { text: '  <input type="text" name="name" />', color: 'text-white' },
    { text: '  <input type="email" name="email" />', color: 'text-white' },
    { text: '  <input type="password" name="password" />', color: 'text-white' },
    { text: '  <button type="submit">Sign Up</button>', color: 'text-white' },
    { text: '</form>', color: 'text-brand-primary' }
  ];

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex < lines.length) {
      if (currentCharIndex < lines[currentLineIndex].text.length) {
        const timeout = setTimeout(() => {
          setCurrentCharIndex(prev => prev + 1);
        }, 20); // Typing speed
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, 200); // Delay between lines
        return () => clearTimeout(timeout);
      }
    }
  }, [currentLineIndex, currentCharIndex, lines]);

  return (
    <div className="relative z-10 flex text-xs sm:text-sm font-mono leading-loose">
      <div className="flex flex-col text-white/30 mr-8 select-none text-right">
        {lines.map((_, idx) => (
          <span key={idx}>{(idx + 1).toString().padStart(2, '0')}</span>
        ))}
        <span>10</span>
        <span>11</span>
      </div>
      <div className="flex flex-col text-white whitespace-pre">
        {lines.map((line, idx) => {
          if (idx > currentLineIndex) return null;
          const content = idx === currentLineIndex ? line.text.slice(0, currentCharIndex) : line.text;
          return (
            <div key={idx} className={line.color}>
              {content}
              {idx === currentLineIndex && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-brand-primary ml-1 align-middle"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signUp, signInWithGoogle, signInWithGithub } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(formData.email, formData.password, formData.name);
      toast.success('Check your email to confirm your account!');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      toast.error(err.message || 'Google sign in failed');
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithGithub();
    } catch (err) {
      toast.error(err.message || 'GitHub sign in failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="h-screen w-full flex flex-row-reverse bg-brand-bg font-sans overflow-hidden"
    >

      {/* RIGHT SIDE - Form */}
      <div className="w-full lg:w-[45%] h-full flex flex-col relative bg-brand-bg border-l border-brand-text overflow-y-auto">

        {/* Subtle dot grid background */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none min-h-full"
          style={{ backgroundImage: 'radial-gradient(var(--color-brand-border) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Inner Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-12 min-h-full"
        >

          <div className="w-full max-w-[320px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 border border-brand-primary px-3 py-1 mb-6 bg-transparent">
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
                <span className="text-[9px] font-bold text-brand-primary tracking-widest uppercase">Create an account</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black uppercase text-brand-text leading-[0.85] tracking-tighter">
                START<br />
                <span className="text-brand-primary">BUILDING.</span>
              </h1>
              <p className="mt-4 text-[11px] font-semibold text-brand-text/80 leading-relaxed">
                Create your Formspark account to start receiving submissions instantly. No code required.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-3 w-full"
            >

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text/60">
                  <UserIcon />
                </div>
                <input
                  type="text"
                  required
                  className="w-full bg-transparent border border-brand-text px-10 py-2.5 text-brand-text placeholder-brand-text/50 outline-none focus:border-brand-primary transition-colors text-xs font-bold"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text/60">
                  <MailIcon />
                </div>
                <input
                  type="email"
                  required
                  className="w-full bg-transparent border border-brand-text px-10 py-2.5 text-brand-text placeholder-brand-text/50 outline-none focus:border-brand-primary transition-colors text-xs font-bold"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text/60">
                  <LockIcon />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-transparent border border-brand-text px-10 py-2.5 text-brand-text placeholder-brand-text/50 outline-none focus:border-brand-primary transition-colors text-xs font-bold"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-text/60 hover:text-brand-text"
                >
                  <EyeIcon />
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" required className="w-3.5 h-3.5 rounded-sm border-brand-text/40 text-brand-primary focus:ring-brand-primary bg-transparent accent-brand-primary" />
                  <span className="text-[10px] font-bold text-brand-text">I agree to the <Link to="/terms" className="text-brand-primary hover:underline">Terms of Service</Link></span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary text-brand-text font-black uppercase tracking-widest py-3 px-6 flex items-center justify-center gap-2 hover:bg-[#e67c00] transition-colors disabled:opacity-50 text-[11px]"
              >
                SIGN UP
                <ArrowRightIcon />
              </button>

              <div className="py-3 flex items-center justify-center gap-4">
                <div className="h-px bg-brand-text/20 flex-1"></div>
                <span className="text-[9px] font-bold text-brand-text/50 uppercase tracking-widest">Or connect with</span>
                <div className="h-px bg-brand-text/20 flex-1"></div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex-1 bg-transparent border border-brand-text text-brand-text font-bold uppercase tracking-widest py-2.5 px-2 flex items-center justify-center gap-2 hover:bg-brand-text/[0.03] transition-colors text-[10px]"
                >
                  <GoogleIcon />
                  GOOGLE
                </button>
                <button
                  type="button"
                  onClick={handleGithubSignIn}
                  className="flex-1 bg-transparent border border-brand-text text-brand-text font-bold uppercase tracking-widest py-2.5 px-2 flex items-center justify-center gap-2 hover:bg-brand-text/[0.03] transition-colors text-[10px]"
                >
                  <GitHubIcon />
                  GITHUB
                </button>
              </div>

            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8"
            >
              <p className="text-xs font-bold text-brand-text">
                Already have an account? <Link to="/login" className="text-brand-primary hover:underline ml-1">Log in <span className="inline-block ml-1">&rarr;</span></Link>
              </p>
            </motion.div>
          </div>

        </motion.div>
      </div>

      {/* LEFT SIDE - Code Display */}
      <div className="hidden lg:flex w-[55%] h-full bg-[#111111] relative overflow-hidden flex-col justify-center pl-16">

        {/* Subtle orange dot grid */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(var(--color-brand-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Top Left Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute top-10 left-10 z-20"
        >
          <span className="text-brand-primary font-mono font-bold text-sm tracking-widest">{">"} AUTH_REGISTER</span>
        </motion.div>

        {/* Character-by-Character Typewriter Code */}
        <TypewriterCode />

      </div>

    </motion.div>
  );
};

export default Signup;
