import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('PASSWORDS DO NOT MATCH');
      return;
    }

    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password);
      toast.success('INITIALIZATION COMPLETE');
      navigate('/dashboard');
    } catch (err) {
      toast.error('INITIALIZATION FAILED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-row-reverse overflow-hidden font-sans">

      {/* ── Right: Form Panel (Now visually on the Right) ──────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full lg:w-[480px] flex flex-col px-10 py-10 md:px-12 md:py-12 bg-white border-l-2 border-gray-100 z-10 overflow-y-auto no-scrollbar"
      >

        {/* Logo */}
        <motion.div variants={itemVariants}>
          <Link to="/" className="flex items-center gap-3 mb-10 text-gray-900 hover:text-brand-primary transition-colors group">
            <div className="w-9 h-9 rounded-md bg-brand-primary border-2 border-gray-900 flex items-center justify-center font-black text-white shadow-[2px_2px_0_#111] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
              F
            </div>
            <span className="text-xl font-black uppercase tracking-tighter">Formspark</span>
          </Link>
        </motion.div>

        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
          {/* Heading */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900 mb-2">
              Start Building.
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Bypass the backend. Deploy instantly.
            </p>
          </motion.div>

          {/* GitHub SSO */}
          <motion.button variants={itemVariants} className="w-full bg-white border-2 border-gray-900 rounded-full py-3.5 px-4 text-[11px] font-black uppercase tracking-widest text-gray-900 transition-all flex items-center justify-center gap-3 mb-6 shadow-[4px_4px_0_#111] active:shadow-none active:translate-x-1 active:translate-y-1 hover:bg-gray-50">
            <GitHubIcon />
            Sign Up with Github
          </motion.button>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-[2px] bg-gray-100" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Or</span>
            <div className="flex-1 h-[2px] bg-gray-100" />
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Name */}
            <motion.div variants={itemVariants} className="mb-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">
                Name<span className="text-brand-primary ml-1">*</span>
              </label>
              <input
                id="signup-name"
                type="text"
                placeholder="Developer"
                className="w-full bg-transparent border-b-2 border-gray-200 py-3 outline-none text-lg font-bold text-gray-900 placeholder:text-gray-300 focus:border-brand-primary transition-colors"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants} className="mb-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">
                Email<span className="text-brand-primary ml-1">*</span>
              </label>
              <input
                id="signup-email"
                type="email"
                placeholder="johndoe@gmail.com"
                className="w-full bg-transparent border-b-2 border-gray-200 py-3 outline-none text-lg font-bold text-gray-900 placeholder:text-gray-300 focus:border-brand-primary transition-colors"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} className="mb-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">
                Password<span className="text-brand-primary ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  className="w-full bg-transparent border-b-2 border-gray-200 py-3 pr-10 outline-none text-lg font-bold text-gray-900 placeholder:text-gray-300 focus:border-brand-primary transition-colors"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-3 text-gray-300 hover:text-brand-primary transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            {/* Confirm Password */}
            <motion.div variants={itemVariants} className="mb-8">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">
                Confirm Password<span className="text-brand-primary ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm 8 characters"
                  className="w-full bg-transparent border-b-2 border-gray-200 py-3 pr-10 outline-none text-lg font-bold text-gray-900 placeholder:text-gray-300 focus:border-brand-primary transition-colors"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 bottom-3 text-gray-300 hover:text-brand-primary transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary border-2 border-gray-900 text-white rounded-full py-4 px-4 text-xs font-black uppercase tracking-widest transition-all shadow-[4px_4px_0_#111] active:shadow-none active:translate-x-1 active:translate-y-1 hover:bg-[#e67c00] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-1 disabled:translate-y-1"
            >
              {loading ? 'Initializing...' : 'Initialize Account'}
            </motion.button>
          </form>

          {/* Login Link */}
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Already initialized?{' '}
              <Link to="/login" className="text-gray-900 hover:text-brand-primary transition-colors border-b-2 border-transparent hover:border-brand-primary pb-0.5">
                Login Here
              </Link>
            </p>
          </motion.div>
        </div>

      </motion.div>

      {/* ── Left: Visual Panel (Now visually on the Left) ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:block flex-1 relative overflow-hidden bg-brand-primary m-4 border-2 border-gray-900 shadow-[8px_8px_0_#111]"      >

        {/* Subtle Background Image with high brightness so it blends with the orange */}
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="/login_visual_brutalist_1778958079330.png"
          alt="Visual Background"
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply grayscale"
        />

        {/* Soft White to Orange Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-[#ff991f] to-[#ff7a00]"></div>

        {/* Brutalist Dot Grid Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(#111 1.5px, transparent 1.5px)',
            backgroundSize: '32px 32px'
          }}>
        </motion.div>

        {/* Large Background Text */}
        <div className="absolute bottom-32 left-0 right-0 flex justify-center overflow-hidden opacity-[0.07] pointer-events-none select-none mix-blend-overlay">
          <motion.h2
            initial={{ x: 0 }}
            animate={{ x: "-10%" }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            className="text-[15vw] font-black uppercase text-[#111] whitespace-nowrap"
          >
            CODE • DEPLOY • SHIP
          </motion.h2>
        </div>

        {/* Main headline text */}
        <div className="absolute bottom-16 left-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-[7vw] leading-[0.85] font-black uppercase tracking-tighter text-white mb-6 drop-shadow-md">
              Form<br />spark.
            </h2>
            <div className="inline-flex items-center gap-3 px-4 py-2 border-2 border-white/30 bg-white/10 backdrop-blur-sm rounded-full">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white">
                Bypass the backend. Deploy instantly.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Floating Logo Icon (Top Right) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { delay: 0.8, duration: 0.5 },
            scale: { delay: 0.8, duration: 0.5, ease: "easeOut" },
            y: { delay: 1.3, duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-10 right-10"
        >
          <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border-2 border-white/30 shadow-lg">
            <span className="text-white font-black text-xl italic">F</span>
          </div>
        </motion.div>
      </motion.div>

    </div>
  );
};

export default Signup;
