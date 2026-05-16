import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6 text-center">
      <div className="max-w-md animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 rounded-3xl bg-navy-card border border-navy-border flex items-center justify-center mx-auto mb-8 text-spark">
          <FileQuestion size={40} />
        </div>
        <h1 className="text-6xl font-black text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-muted mb-10 leading-relaxed">
          The page you are looking for might have been moved, removed, or never existed in the first place.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg" icon={Home}>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
