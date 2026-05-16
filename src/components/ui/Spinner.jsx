import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-[1.5px]',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]',
  };

  return (
    <div className={`animate-spin rounded-full border-white border-t-transparent ${sizes[size]} ${className}`}></div>
  );
};

export default Spinner;
