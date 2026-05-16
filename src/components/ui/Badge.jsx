import React from 'react';
import { cn } from '../../utils/cn';

const Badge = ({ children, variant = 'gray', className = '' }) => {
  const variants = {
    green: 'bg-emerald-400 text-black border-brutal-black',
    red: 'bg-red-400 text-black border-brutal-black',
    orange: 'bg-orange-400 text-black border-brutal-black',
    gray: 'bg-zinc-200 text-black border-brutal-black',
    blue: 'bg-blue-400 text-black border-brutal-black',
    accent: 'bg-brutal-accent text-black border-brutal-black',
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-none text-[9px] font-black uppercase tracking-[0.1em] border-2",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;
