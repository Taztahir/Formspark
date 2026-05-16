import React from 'react';
import { cn } from '../../utils/cn';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  icon: Icon, 
  className = '', 
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
  };

  const sizes = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-8 py-5 text-base',
    lg: 'px-12 py-6 text-xl',
  };

  return (
    <button 
      className={cn(variants[variant], sizes[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="font-black uppercase tracking-widest">LOADING_</span>
      ) : (
        <div className="flex items-center gap-3">
          {children}
          {Icon && <Icon className="h-6 w-6" strokeWidth={2.5} />}
        </div>
      )}
    </button>
  );
};

export default Button;
