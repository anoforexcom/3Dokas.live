
import React, { useState } from 'react';
import { User } from '../types';
import Sidebar from '../components/Sidebar';

interface Props {
  user: User;
  onNavigate: (view: string) => void;
  logout: () => void;
}

const AdminUsers: React.FC<Props> = ({ user, onNavigate, logout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Pending' | 'Suspended'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Generate 0 mock users for initial app state
  const generateMockUsers = () => {
    return []; // Empty array for no users
  };

  const [allUsers] = useState(generateMockUsers());

  // Calculate stats
  const totalRegistered = allUsers.length;

  const newThisMonth = allUsers.filter(u => {
    const now = new Date();
    return u.joinedDate.getMonth() === now.getMonth() && u.joinedDate.getFullYear() === now.getFullYear();
  }).length;

  const newToday = allUsers.filter(u => {
    const now = new Date();
    return u.joinedDate.toDateString() === now.toDateString();
  }).length;

  // Filter logic
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Pagination for display
  const displayUsers = filteredUsers.slice(0, 10);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID,Name,Email,Status,Credits,Joined Date'];
    const rows = filteredUsers.map(u =>
      `${u.id},"${u.name}",${u.email},${u.status},${u.credits},"${u.joined}"`
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen bg-background-dark font-display text-white">
      <Sidebar user={user} current="USERS" onNavigate={onNavigate} logout={logout} />

      <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-10">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-1">
              <h2 className="text-4xl font-bold tracking-tight">User Management</h2>
              <p className="text-gray-400">Manage community access, credits, and permissions.</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-surface-dark border border-border-dark rounded-2xl pl-12 pr-6 py-3.5 text-sm focus:border-primary outline-none transition-all"
                />
              </div>
              <button className="bg-primary hover:bg-primary/90 px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">person_add</span>
                Invite
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-dark p-6 rounded-[2rem] border border-border-dark">
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Total Registered</p>
              <h3 className="text-4xl font-black">{totalRegistered.toLocaleString()}</h3>
              <p className="text-green-400 text-xs font-bold mt-2">0% this month</p>
            </div>
            <div className="bg-surface-dark p-6 rounded-[2rem] border border-border-dark">
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">New This Month</p>
              <h3 className="text-4xl font-black">{newThisMonth}</h3>
              <p className="text-blue-400 text-xs font-bold mt-2">Active Growth</p>
            </div>
            <div className="bg-surface-dark p-6 rounded-[2rem] border border-border-dark">
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">New Today</p>
              <h3 className="text-4xl font-black">{newToday}</h3>
              <p className="text-primary text-xs font-bold mt-2">Stable average</p>
            </div>
          </div>

          <div className="bg-surface-dark rounded-[2.5rem] border border-border-dark overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-border-dark flex justify-between items-center bg-white/5">
              <h3 className="font-bold">User Directory</h3>
              <div className="flex gap-2 relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${filterStatus !== 'All' || isFilterOpen ? 'bg-primary border-primary text-white' : 'bg-background-dark border-border-dark text-gray-500 hover:text-white'}`}
                >
                  {filterStatus === 'All' ? 'Filter' : filterStatus}
                  <span className="material-symbols-outlined text-sm">filter_list</span>
                </button>

                {isFilterOpen && (
                  <div className="absolute top-12 left-0 w-32 bg-surface-dark border border-border-dark rounded-xl shadow-xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                    {['All', 'Active', 'Pending', 'Suspended'].map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(status as any);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold hover:bg-white/5 transition-colors ${filterStatus === status ? 'text-primary' : 'text-gray-400'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-background-dark border border-border-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all text-gray-500 flex items-center gap-2"
                >
                  Export CSV
                  <span className="material-symbols-outlined text-sm">download</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-border-dark text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <tr>
                    <th className="px-8 py-5">User</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Credits</th>
                    <th className="px-8 py-5">Registered</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-dark">
                  {displayUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-xl bg-background-dark flex items-center justify-center text-gray-500">
                            <span className="material-symbols-outlined">person</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm">{u.name}</span>
                            <span className="text-xs text-gray-500">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.status === 'Active' ? 'bg-green-500/10 text-green-400' :
                          u.status === 'Suspended' ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'
                          }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 font-black text-sm text-primary">
                          <span className="material-symbols-outlined text-sm">bolt</span>
                          {u.credits}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-400">{u.joined}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="size-9 rounded-xl bg-background-dark border border-border-dark flex items-center justify-center text-gray-400 hover:text-primary transition-all">
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button className="size-9 rounded-xl bg-background-dark border border-border-dark flex items-center justify-center text-gray-400 hover:text-red-400 transition-all">
                            <span className="material-symbols-outlined text-sm">block</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-white/5 flex justify-between items-center text-xs text-gray-500 font-bold">
              <span>Showing {displayUsers.length} of {totalRegistered.toLocaleString()} users</span>
              <div className="flex gap-2">
                <button className="size-8 rounded-lg bg-background-dark flex items-center justify-center border border-border-dark hover:text-white transition-all"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                <button className="size-8 rounded-lg bg-background-dark flex items-center justify-center border border-border-dark hover:text-white transition-all"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
