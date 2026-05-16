import React from 'react';
import Button from './Button';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-24 px-8 text-center bg-white border-[4px] border-brutal-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] ${className}`}>
      {Icon && (
        <div className="w-16 h-16 bg-brutal-accent border-[3px] border-brutal-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-8">
          <Icon className="text-black" size={32} strokeWidth={3} />
        </div>
      )}
      <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">{title}</h3>
      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest max-w-sm mb-10 leading-tight">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary" className="h-12 px-8">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
