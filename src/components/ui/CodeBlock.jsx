import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const CodeBlock = ({ code, language = 'html' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="relative group rounded-xl overflow-hidden bg-[#0D1117] border border-navy-border">
      <div className="flex items-center justify-between px-4 py-2 bg-navy-card border-b border-navy-border">
        <span className="text-xs font-bold text-gray-muted uppercase tracking-wider">{language}</span>
        <button
          onClick={handleCopy}
          className="p-1.5 text-gray-muted hover:text-white transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-cyan-400 whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
