import React from 'react';
import { cn } from '../../utils/cn';

const Input = ({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  containerClassName = '',
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      {label && (
        <label className="text-sm font-bold uppercase tracking-widest text-brand-text">
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          className={cn(
            "input-editorial",
            error ? "border-red-500" : "",
            className
          )}
          {...props}
        />
        {Icon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text opacity-30 group-focus-within:opacity-100 group-focus-within:text-brand-primary transition-colors pointer-events-none">
            <Icon size={24} strokeWidth={2} />
          </div>
        )}
      </div>
      {error && (
        <span className="text-sm font-bold uppercase text-red-500 mt-2">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
