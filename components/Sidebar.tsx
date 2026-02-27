
import React from 'react';
import { User, UserRole } from '../types';

interface SidebarProps {
  user: User;
  current: string;
  onNavigate: (view: string) => void;
  logout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, current, onNavigate, logout }) => {
  const isAdmin = user.role === UserRole.ADMIN;

  const userItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: 'dashboard' },
    { id: 'EDITOR', label: '3D Editor', icon: 'view_in_ar' },
    { id: 'PAYMENTS', label: 'Payments', icon: 'credit_card' },
  ];

  const adminItems = [
    { id: 'ADMIN', label: 'Overview', icon: 'dashboard' },
    { id: 'USERS', label: 'Users', icon: 'group' },
    { id: 'PAYMENTS_CONFIG', label: 'Finance Config', icon: 'payments' },
    { id: 'CMS', label: 'Web App Editor', icon: 'edit_note' },
  ];

  const items = isAdmin ? adminItems : userItems;

  return (
    <aside className="w-72 hidden lg:flex flex-col bg-background-dark border-r border-border-dark p-8 justify-between shrink-0">
      <div className="space-y-12">
        <div className="flex items-center gap-3 text-primary group cursor-pointer" onClick={() => onNavigate(isAdmin ? 'ADMIN' : 'DASHBOARD')}>
          <div className="size-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#5b2bee", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#a855f7", stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="url(#grad4)" stroke="#151022" strokeWidth="2" />
              <path d="M50 5 L50 45 L90 25 M50 45 L10 25 M50 45 L50 95" stroke="#white" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">3dokas.live</span>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <div className="relative">
              <div className="size-12 rounded-2xl border-2 border-primary/20 bg-surface-dark flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div className="absolute -bottom-1 -right-1 size-4 bg-green-500 border-2 border-background-dark rounded-full"></div>
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold truncate text-white text-sm">{user.name}</h3>
              <p className="text-[10px] font-black uppercase truncate text-primary tracking-widest">{user.plan}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${current === item.id
                  ? 'bg-primary text-white shadow-xl shadow-primary/20'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="space-y-4">
        {/* Toggle Mode Button (Demo Only) */}
        <div className="p-4 bg-surface-dark border border-border-dark rounded-2xl space-y-3">
          <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest text-center">Demo Mode</p>
          <button
            onClick={() => onNavigate(isAdmin ? 'DASHBOARD' : 'ADMIN')}
            className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">{isAdmin ? 'person' : 'admin_panel_settings'}</span>
            View as {isAdmin ? 'Client' : 'Admin'}
          </button>
        </div>

        {!isAdmin && (
          <button
            onClick={() => onNavigate('EDITOR')}
            className="w-full h-14 flex items-center justify-center gap-3 bg-white text-background-dark hover:bg-gray-200 transition-all rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-black/50"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Create 3D Model
          </button>
        )}
        <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-4 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px]">
          <span className="material-symbols-outlined text-lg">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
