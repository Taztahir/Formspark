import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getForms } from '../services/formsService';
import { getTeamMembers, inviteMember, removeMember, updateMemberRole } from '../services/teamService';
import Sidebar from '../components/layout/Sidebar';
import toast from 'react-hot-toast';

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = `${title} — FormSpark`;
  }, [title]);
};

// Safe SVGs
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const Team = () => {
  useDocumentTitle('Team Collaborators');
  
  const [forms, setForms] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Invite states
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [selectedFormId, setSelectedFormId] = useState('');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    loadGlobalTeamData();
  }, []);

  const loadGlobalTeamData = async () => {
    try {
      setLoading(true);
      // 1. Fetch user's forms
      const userForms = await getForms();
      setForms(userForms);

      if (userForms.length > 0) {
        setSelectedFormId(userForms[0].id);

        // 2. Fetch team members for each form
        const allMembersPromise = userForms.map(async (f) => {
          const formMembers = await getTeamMembers(f.id);
          return formMembers.map((m) => ({
            ...m,
            formName: f.name,
            formToken: f.token,
            formId: f.id
          }));
        });
        const results = await Promise.all(allMembersPromise);
        setMembers(results.flat());
      }
    } catch (err) {
      toast.error('Failed to load team database');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteEmail || !selectedFormId) return;
    setInviting(true);
    
    const targetForm = forms.find(f => f.id === selectedFormId);

    try {
      await inviteMember(selectedFormId, inviteEmail, inviteRole);
      toast.success(`Invited ${inviteEmail} to ${targetForm.name}!`);
      setInviteEmail('');
      loadGlobalTeamData();
    } catch (err) {
      toast.error(err.message || 'Invitation failed');
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await updateMemberRole(memberId, newRole);
      toast.success('Role modified successfully');
      loadGlobalTeamData();
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const handleQuickRemove = async (memberId, memberName, formName) => {
    const confirmMessage = `Remove ${memberName || 'collaborator'} from form "${formName}"?`;
    if (window.confirm(confirmMessage)) {
      try {
        await removeMember(memberId);
        toast.success('Collaborator removed');
        loadGlobalTeamData();
      } catch (err) {
        toast.error('Failed to remove collaborator');
      }
    }
  };

  // Distinct collaborators list by email
  const uniqueEmails = [...new Set(members.map(m => m.profiles?.email).filter(Boolean))];

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
        {/* Header */}
        <header className="h-20 bg-white border-b border-black/5 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-[11px] font-black uppercase text-black/40 hover:text-black transition-colors">Dashboard</Link>
            <span className="text-black/20">/</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-brand-primary border-b-2 border-brand-primary pb-7 mt-7">
              Team Portal
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-10 max-w-4xl space-y-12">
          {/* Headline */}
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Global Collaboration</h1>
            <p className="text-[13px] font-bold text-black/50 mt-1">Manage team access and invite developers across all your active form endpoints.</p>
          </div>

          {/* Metric stats card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_rgba(0,0,0,1)] flex items-center gap-4">
              <div className="p-3 bg-brand-primary/10 border border-brand-primary text-brand-primary">
                <UsersIcon />
              </div>
              <div>
                <p className="text-[8px] font-black text-black/40 uppercase tracking-widest">Global Collaborators</p>
                <h4 className="text-2xl font-black text-black">{uniqueEmails.length}</h4>
              </div>
            </div>

            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_rgba(0,0,0,1)] flex items-center gap-4">
              <div className="p-3 bg-brand-primary/10 border border-brand-primary text-brand-primary">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div>
                <p className="text-[8px] font-black text-black/40 uppercase tracking-widest">Assigned Form Edits</p>
                <h4 className="text-2xl font-black text-black">{members.length}</h4>
              </div>
            </div>
          </div>

          {/* Invitation Portal */}
          {forms.length > 0 ? (
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] space-y-6">
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-widest">Invite New Collaborator</h3>
                <p className="text-[9px] font-bold text-black/40 uppercase mt-0.5 tracking-wider">Provide their account email, role authorization, and target form endpoint.</p>
              </div>

              <form onSubmit={handleInviteSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end pt-2">
                <div className="md:col-span-1.5">
                  <label className="text-[8px] font-black uppercase tracking-widest block mb-2 text-black/70">Invitee email</label>
                  <input 
                    type="email"
                    required
                    placeholder="teammate@company.com"
                    className="w-full bg-[#F5F5F5] border-2 border-black px-4 py-2 outline-none focus:border-brand-primary font-bold text-xs rounded-none transition-colors"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-[8px] font-black uppercase tracking-widest block mb-2 text-black/70">Form Endpoint</label>
                  <select
                    className="w-full bg-[#F5F5F5] border-2 border-black px-4 py-2 outline-none focus:border-brand-primary font-bold text-xs rounded-none"
                    value={selectedFormId}
                    onChange={(e) => setSelectedFormId(e.target.value)}
                  >
                    {forms.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[8px] font-black uppercase tracking-widest block mb-2 text-black/70">Role</label>
                  <select
                    className="w-full bg-[#F5F5F5] border-2 border-black px-4 py-2 outline-none focus:border-brand-primary font-bold text-xs rounded-none"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                  >
                    <option value="viewer">Viewer</option>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={inviting}
                  className="w-full bg-black hover:bg-brand-primary text-white hover:text-brand-text border-2 border-black py-2.5 text-[9px] font-black uppercase tracking-widest disabled:opacity-50 transition-colors text-center"
                >
                  {inviting ? 'Inviting...' : 'Invite Member'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white border-4 border-black p-8 text-center">
              <p className="text-[10px] text-black/40 font-bold uppercase mb-4">You must create at least one form endpoint before inviting collaborators.</p>
              <Link
                to="/dashboard"
                className="inline-block bg-brand-primary text-brand-text border-2 border-black px-6 py-3 font-black uppercase tracking-widest text-[9px] hover:bg-[#e67c00] transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          )}

          {/* Roster of members */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0_rgba(0,0,0,1)] overflow-hidden">
            <div className="px-8 py-5 bg-black/[0.02] border-b-2 border-black flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-widest">Collaborator Database Grouped By Endpoint</h3>
              <span className="text-[9px] font-mono text-black/40 uppercase font-black">{members.length} members assigned</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/10 bg-black/[0.01]">
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black/45">Collaborator</th>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black/45">Assigned Endpoint</th>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black/45">Token</th>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black/45">Permission Role</th>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black/45 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-black/[0.01] transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-xs font-black uppercase tracking-tight text-brand-text">{member.profiles?.name || 'Developer Candidate'}</p>
                        <p className="text-[9px] font-bold text-black/45 leading-none">{member.profiles?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          to={`/dashboard/submissions/${member.formToken}`}
                          className="text-xs font-bold text-brand-primary hover:underline uppercase"
                        >
                          {member.formName}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-[9px] text-black/35 select-all">{member.formToken}</span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          className="bg-transparent border-none text-[10px] font-black uppercase text-brand-primary py-1 outline-none cursor-pointer"
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        >
                          <option value="viewer">Viewer</option>
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleQuickRemove(member.id, member.profiles?.name, member.formName)}
                          className="text-black/35 hover:text-red-500 p-2 hover:bg-red-50 transition-colors"
                          title="Remove collaborator"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {members.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-16 text-center">
                        <p className="text-[10px] text-black/35 font-bold uppercase tracking-widest">No active collaborator accounts assigned.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Team;
