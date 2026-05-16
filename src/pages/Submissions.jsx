import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Trash2, 
  Search, 
  ChevronRight,
  Mail,
  Clock,
  Terminal,
  Filter,
  CheckCircle2,
  XCircle,
  Hash,
  ArrowLeft,
  Calendar,
  Globe
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import useSubmissions from '../hooks/useSubmissions';
import Button from '../components/ui/Button';
import { cn } from '../utils/cn';

const Submissions = () => {
  const { token } = useParams();
  const { submissions, analytics, loading, deleteSubmission, exportCSV } = useSubmissions(token);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSpam, setShowSpam] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = JSON.stringify(s.data).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpam = showSpam ? true : !s.is_spam;
    return matchesSearch && matchesSpam;
  });

  if (loading) {
    return (
      <PageWrapper title="Extracting Data">
        <div className="flex items-center justify-center py-40">
           <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent animate-spin"></div>
        </div>
      </PageWrapper>
    );
  }

  const stats = [
    { label: 'Total Payloads', value: analytics?.total || 0, icon: Mail },
    { label: 'Active 24h', value: analytics?.last24h || 0, icon: Clock },
    { label: 'Spam Blocked', value: analytics?.spam_count || 0, icon: XCircle },
    { label: 'Filter Matches', value: filteredSubmissions.length, icon: Filter },
  ];

  return (
    <PageWrapper
      title="Data_Feed"
      subtitle={`Intercepted payloads for endpoint: ${token}`}
      actions={
        <div className="flex gap-4">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" icon={ArrowLeft}>Back</Button>
          </Link>
          <Button onClick={exportCSV} size="sm" icon={Download}>Export_CSV</Button>
        </div>
      }
    >
      <div className="space-y-16">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-brand-border bg-brand-bg shadow-[10px_10px_0px_var(--color-brand-border)]">
          {stats.map((stat, i) => (
            <div key={i} className="p-8 border-r border-brand-border last:border-r-0 hover:bg-brand-primary transition-colors group">
              <div className="flex items-center gap-3 mb-6 opacity-40 group-hover:opacity-100">
                <stat.icon size={16} strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
              </div>
              <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-brand-border">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 opacity-20" size={18} />
            <input
              type="text"
              placeholder="Filter by field data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-brand-text/5 border-2 border-brand-border p-5 pl-16 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>
          <button 
            onClick={() => setShowSpam(!showSpam)}
            className={cn(
              "h-16 flex items-center gap-4 px-10 text-xs font-black tracking-widest uppercase border-2 transition-all shadow-[6px_6px_0px_var(--color-brand-border)] hover:shadow-none hover:translate-x-1 hover:translate-y-1",
              showSpam 
                ? "bg-red-500 text-white border-red-500" 
                : "bg-brand-bg border-brand-border text-brand-text hover:bg-brand-text hover:text-brand-bg"
            )}
          >
            <Filter size={16} strokeWidth={2.5} />
            {showSpam ? "Showing Spam" : "Spam Filter Off"}
          </button>
        </div>

        {/* Submissions List */}
        <div className="space-y-1">
          {filteredSubmissions.length === 0 ? (
            <div className="p-20 text-center border border-dashed border-brand-border opacity-40">
              <h3 className="text-2xl font-black uppercase italic">Zero Payloads Located</h3>
            </div>
          ) : (
            filteredSubmissions.map((sub) => (
              <div
                key={sub.id}
                className={cn(
                  "border border-brand-border bg-brand-bg overflow-hidden transition-all duration-300",
                  expandedRow === sub.id ? "shadow-[15px_15px_0px_var(--color-brand-primary)] ring-2 ring-brand-text" : "hover:border-brand-primary"
                )}
              >
                <div 
                  className="p-8 cursor-pointer flex flex-col md:flex-row md:items-center gap-8"
                  onClick={() => setExpandedRow(expandedRow === sub.id ? null : sub.id)}
                >
                  <div className={cn(
                    "w-14 h-14 border-2 flex items-center justify-center shrink-0 shadow-[4px_4px_0px_var(--color-brand-border)]",
                    sub.is_spam ? "bg-red-500 text-white border-red-500" : "bg-brand-primary text-brand-text border-brand-border"
                  )}>
                    {sub.is_spam ? <XCircle size={24} strokeWidth={2.5} /> : <CheckCircle2 size={24} strokeWidth={2.5} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-sm font-black uppercase tracking-tighter bg-brand-text text-brand-bg px-3 py-1">
                        {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      <span className="text-xs font-bold opacity-40 uppercase tracking-widest">
                        {new Date(sub.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                       {Object.entries(sub.data).slice(0, 4).map(([k, v], idx) => (
                         <div key={idx} className="text-[10px] font-black uppercase tracking-widest border border-brand-border px-3 py-1">
                           <span className="opacity-40">{k}:</span> {String(v)}
                         </div>
                       ))}
                       {Object.keys(sub.data).length > 4 && <span className="text-[10px] font-black opacity-40">+{Object.keys(sub.data).length - 4} MORE</span>}
                    </div>
                  </div>

                  <ChevronRight size={24} strokeWidth={3} className={cn("hidden md:block transition-transform duration-500", expandedRow === sub.id && "rotate-90 text-brand-primary")} />
                </div>

                <AnimatePresence>
                  {expandedRow === sub.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                    >
                      <div className="p-12 border-t border-brand-border bg-brand-text/5 grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div className="space-y-10">
                          <div className="flex items-center gap-4 border-b-2 border-brand-border pb-4">
                            <Terminal size={20} className="text-brand-primary" />
                            <h4 className="text-xs font-black uppercase tracking-[0.3em]">Payload Schema</h4>
                          </div>
                          <div className="grid grid-cols-1 gap-8">
                            {Object.entries(sub.data).map(([key, value]) => (
                              <div key={key} className="border-l-4 border-brand-primary pl-6 py-2">
                                <span className="block text-[10px] font-black uppercase opacity-40 mb-2 tracking-widest">{key}</span>
                                <div className="text-lg font-bold break-all leading-tight">
                                  {String(value)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-12">
                          <div className="space-y-8">
                            <div className="flex items-center gap-4 border-b-2 border-brand-border pb-4">
                              <Globe size={20} className="text-brand-primary" />
                              <h4 className="text-xs font-black uppercase tracking-[0.3em]">Environment Data</h4>
                            </div>
                            <div className="space-y-6">
                              {[
                                { label: "Transaction ID", value: sub.id, icon: Hash },
                                { label: "Origin IP Address", value: sub.ip_address || "MASKED", icon: Shield },
                                { label: "User Agent Protocol", value: sub.user_agent || "RAW_API_CALL", icon: Calendar }
                              ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest opacity-40">
                                    <item.icon size={10} /> {item.label}
                                  </div>
                                  <span className="text-xs font-mono font-bold break-all bg-brand-text/10 p-3 border border-brand-border">{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              if(confirm('PURGE TRANSACTION RECORD FOREVER?')) deleteSubmission(sub.id);
                            }}
                            className="w-full h-16 bg-red-500 text-white font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-black transition-colors shadow-[10px_10px_0px_#000]"
                          >
                            <Trash2 size={20} strokeWidth={2.5} />
                            Purge Records
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Submissions;
