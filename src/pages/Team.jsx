import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { teamService } from '../services/teamService';
import Sidebar from '../components/layout/Sidebar';
import toast from 'react-hot-toast';

// Safe SVG Icons
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      // In a real app, you'd pass a formId or fetch account-wide team
      const data = await teamService.getTeamMembers('default');
      setMembers(data);
    } catch (err) {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviting(true);
    try {
      await teamService.inviteMember('default', inviteEmail);
      toast.success('Invitation sent');
      setInviteEmail('');
      fetchTeam();
    } catch (err) {
      toast.error('User not found or invite failed');
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (id) => {
    if (!confirm('Remove this member from your team?')) return;
    try {
      await teamService.removeMember(id);
      toast.success('Member removed');
      fetchTeam();
    } catch (err) {
      toast.error('Failed to remove member');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5F5F5]">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F5F5F5] font-sans overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 bg-white border-b border-black/5 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-[11px] font-black uppercase text-black/40 hover:text-black transition-colors">Dashboard</Link>
            <span className="text-black/20">/</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-brand-primary border-b-2 border-brand-primary pb-7 mt-7">Team</span>
          </div>
        </header>

        <div className="p-10 max-w-4xl">
          <div className="mb-12">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Team Collaboration</h1>
            <p className="text-[13px] font-bold text-black/50 mt-1">Manage who can view and manage your forms.</p>
          </div>

          <div className="grid grid-cols-1 gap-10">
            {/* Invite Form */}
            <div className="bg-white border border-black/5 p-10">
              <h3 className="text-[11px] font-black uppercase tracking-widest mb-6">Invite New Member</h3>
              <form onSubmit={handleInvite} className="flex gap-4">
                <input 
                  type="email"
                  required
                  placeholder="colleague@company.com"
                  className="flex-1 bg-black/[0.02] border border-black/5 px-4 py-3 outline-none focus:border-brand-primary font-bold text-sm transition-colors"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={inviting}
                  className="px-8 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {inviting ? <div className="w-3 h-3 border-2 border-white border-t-transparent animate-spin"></div> : <PlusIcon />}
                  Invite
                </button>
              </form>
            </div>

            {/* Members List */}
            <div className="bg-white border border-black/5 overflow-hidden">
              <div className="px-8 py-5 border-b border-black/5 bg-black/[0.02]">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-black/40">Active Members</h3>
              </div>
              <div className="divide-y divide-black/5">
                {members.length > 0 ? members.map((member) => (
                  <div key={member.id} className="px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black text-xs uppercase">
                        {member.profiles?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-tight">{member.profiles?.name || 'User'}</p>
                        <p className="text-[10px] font-bold text-black/30">{member.profiles?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-[#F5F5F5] border border-black/5">
                        {member.role}
                      </span>
                      <button 
                        onClick={() => handleRemove(member.id)}
                        className="text-black/20 hover:text-red-500 transition-colors"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="px-8 py-12 text-center">
                    <p className="text-[10px] font-black uppercase text-black/20 tracking-widest">No team members yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Team;
