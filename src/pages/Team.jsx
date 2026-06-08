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
      <div className="flex h-screen items-center justify-center bg-brand-bg text-brand-text">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent animate-spin rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-brand-bg text-brand-text font-sans overflow-hidden transition-colors duration-500 relative">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-bg via-brand-bg to-brand-primary/10 pointer-events-none z-0"></div>

      <Sidebar className="z-10 relative" />
      
      <main className="flex-1 flex flex-col overflow-y-auto relative z-10">
        {/* Header */}
        <header className="h-24 bg-brand-bg/60 backdrop-blur-xl border-b border-brand-border/10 flex items-center justify-between px-8 md:px-12 shrink-0 transition-colors duration-500 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-xs font-semibold text-brand-muted hover:text-brand-text transition-colors">Dashboard</Link>
            <span className="text-brand-muted/30">/</span>
            <span className="text-xs font-bold text-brand-primary">
              Team Portal
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 md:p-12 max-w-4xl space-y-10 relative z-10 w-full">
          {/* Headline */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-brand-text bg-clip-text text-transparent bg-gradient-to-r from-brand-text to-brand-primary">Global Collaboration</h1>
            <p className="text-sm font-medium text-brand-muted mt-2">Manage team access and invite developers across all your active form endpoints.</p>
          </div>

          {/* Metric stats card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-brand-card/60 backdrop-blur-xl border border-brand-border/10 rounded-3xl p-6 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-2xl">
                <UsersIcon />
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-muted">Global Collaborators</p>
                <h4 className="text-3xl font-bold text-brand-text mt-1">{uniqueEmails.length}</h4>
              </div>
            </div>

            <div className="bg-brand-card/60 backdrop-blur-xl border border-brand-border/10 rounded-3xl p-6 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-2xl">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-muted">Assigned Form Edits</p>
                <h4 className="text-3xl font-bold text-brand-text mt-1">{members.length}</h4>
              </div>
            </div>
          </div>

          {/* Invitation Portal */}
          {forms.length > 0 ? (
            <div className="bg-brand-card/60 backdrop-blur-xl border border-brand-border/10 rounded-3xl p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-brand-text">Invite New Collaborator</h3>
                <p className="text-xs font-medium text-brand-muted mt-1">Provide their account email, role authorization, and target form endpoint.</p>
              </div>

              <form onSubmit={handleInviteSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end pt-2">
                <div className="md:col-span-1">
                  <label className="text-xs font-bold block mb-2 text-brand-text">Invitee email</label>
                  <input 
                    type="email"
                    required
                    placeholder="teammate@company.com"
                    className="w-full bg-brand-bg/50 border border-brand-border/20 rounded-2xl px-5 py-4 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 text-brand-text font-medium text-sm transition-all placeholder-brand-muted"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-2 text-brand-text">Form Endpoint</label>
                  <select
                    className="w-full bg-brand-bg/50 border border-brand-border/20 rounded-2xl px-5 py-4 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 text-brand-text font-medium text-sm transition-all"
                    value={selectedFormId}
                    onChange={(e) => setSelectedFormId(e.target.value)}
                  >
                    {forms.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-2 text-brand-text">Role</label>
                  <select
                    className="w-full bg-brand-bg/50 border border-brand-border/20 rounded-2xl px-5 py-4 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 text-brand-text font-medium text-sm transition-all"
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
                  className="w-full bg-brand-text text-brand-bg rounded-full py-4 font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-md"
                >
                  {inviting ? 'Inviting...' : 'Invite Member'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-brand-card/60 backdrop-blur-xl border border-brand-border/10 rounded-3xl p-8 text-center">
              <p className="text-xs font-medium text-brand-muted mb-4">You must create at least one form endpoint before inviting collaborators.</p>
              <Link
                to="/dashboard"
                className="inline-block bg-brand-primary text-brand-bg rounded-2xl px-6 py-3.5 font-bold text-xs hover:opacity-90 transition-all shadow-md"
              >
                Go to Dashboard
              </Link>
            </div>
          )}

          {/* Roster of members */}
          <div className="bg-brand-card/60 backdrop-blur-xl border border-brand-border/10 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-8 py-5 bg-brand-bg/50 border-b border-brand-border/10 flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-tight text-brand-text">Collaborator Database Grouped By Endpoint</h3>
              <span className="text-xs font-semibold text-brand-muted">{members.length} members assigned</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-border/10 bg-brand-bg/50">
                    <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase">Collaborator</th>
                    <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase">Assigned Endpoint</th>
                    <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase">Token</th>
                    <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase">Permission Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/10">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-brand-primary/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-brand-text">{member.profiles?.name || 'Developer Candidate'}</p>
                        <p className="text-xs text-brand-muted mt-0.5">{member.profiles?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          to={`/dashboard/submissions/${member.formToken}`}
                          className="text-xs font-bold text-brand-primary hover:underline"
                        >
                          {member.formName}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-brand-muted select-all">{member.formToken}</span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          className="bg-transparent border-none text-xs font-bold text-brand-primary py-1 outline-none cursor-pointer"
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
                          className="text-brand-muted hover:text-red-500 hover:bg-red-500/10 p-2.5 rounded-xl transition-all"
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
                        <p className="text-xs font-semibold text-brand-muted">No active collaborator accounts assigned.</p>
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
