
import React, { useState } from 'react';
import { User } from '../types';
import Sidebar from '../components/Sidebar';

interface Props {
  user: User;
  onNavigate: (view: string) => void;
  logout: () => void;
}

interface Notification {
  message: string;
  type: 'success' | 'info';
  id: number;
}

const AdminCMS: React.FC<Props> = ({ user, onNavigate, logout }) => {
  const [activeTab, setActiveTab] = useState('LANDING');
  const [isPublishing, setIsPublishing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      addNotification(`Changes to ${activeTab.replace('_', ' ')} published successfully!`);
    }, 1500);
  };

  const renderEditorContent = () => {
    switch (activeTab) {
      case 'LANDING':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-bold border-b border-border-dark pb-6 flex justify-between items-center">
              <span>Hero Section Content</span>
              <span className="text-[10px] bg-primary/20 text-primary px-3 py-1 rounded-full font-black uppercase tracking-widest">Public Landing</span>
            </h3>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Main Headline (H1)</label>
                <input type="text" defaultValue="From Photo to 3D Reality" className="w-full bg-background-dark border border-border-dark rounded-2xl px-6 py-4 font-bold text-xl focus:border-primary outline-none transition-all" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Description Text</label>
                <textarea rows={3} defaultValue="Instantly convert your favorite 2D images into high-fidelity 3D models using our professional AI Engine." className="w-full bg-background-dark border border-border-dark rounded-2xl px-6 py-4 text-gray-400 focus:border-primary outline-none resize-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Primary Button Label</label>
                  <input type="text" defaultValue="Start Transformation" className="w-full bg-background-dark border border-border-dark rounded-2xl px-6 py-3 font-bold text-sm focus:border-primary outline-none transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Secondary Button Label</label>
                  <input type="text" defaultValue="View Gallery" className="w-full bg-background-dark border border-border-dark rounded-2xl px-6 py-3 font-bold text-sm focus:border-primary outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'DASHBOARD_UI':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-bold border-b border-border-dark pb-6 flex justify-between items-center">
              <span>Dashboard Interface</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-black uppercase tracking-widest">User Area</span>
            </h3>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Welcome Message Header</label>
                <input type="text" defaultValue="Hello, {user.name}!" className="w-full bg-background-dark border border-border-dark rounded-2xl px-6 py-4 font-bold text-xl focus:border-primary outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Theme Accent Color</label>
                  <div className="flex items-center gap-3 bg-background-dark border border-border-dark p-4 rounded-2xl">
                    <input type="color" defaultValue="#5b2bee" className="size-8 rounded-lg bg-transparent border-none cursor-pointer" />
                    <span className="font-mono text-xs text-gray-400">#5B2BEE</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Interface Style</label>
                  <select className="w-full bg-background-dark border border-border-dark rounded-2xl px-6 py-4 font-bold text-xs outline-none cursor-pointer">
                    <option>Glassmorphism (Default)</option>
                    <option>Minimal Dark</option>
                    <option>High Contrast</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Sidebar Toggle Logic</label>
                <div className="flex gap-4">
                  <button className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-[10px] uppercase tracking-widest">Always Expanded</button>
                  <button className="flex-1 py-3 rounded-xl bg-background-dark border border-border-dark text-gray-500 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-all">Auto-Collapse</button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'EMAILS':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-bold border-b border-border-dark pb-6 flex justify-between items-center">
              <span>Transactional Emails</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full font-black uppercase tracking-widest">Notifications</span>
            </h3>
            <div className="space-y-10">
              <div className="bg-background-dark p-8 rounded-[2rem] border border-border-dark space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-primary tracking-widest">Welcome Email</span>
                  <button className="text-[10px] text-gray-500 hover:text-white font-bold uppercase underline">Preview HTML</button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-600 uppercase">Subject Line</label>
                    <input type="text" defaultValue="Welcome to 3dokas.live - Your 3D Journey Starts Here!" className="w-full bg-surface-dark border border-border-dark rounded-xl px-4 py-3 font-bold text-xs outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-600 uppercase">Body Copy</label>
                    <textarea rows={3} defaultValue="Hi {{name}}, we're thrilled to have you! Start your first transformation today." className="w-full bg-surface-dark border border-border-dark rounded-xl px-4 py-3 text-xs text-gray-400 outline-none resize-none" />
                  </div>
                </div>
              </div>
              <div className="bg-background-dark p-8 rounded-[2rem] border border-border-dark space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-primary tracking-widest">Model Ready Notification</span>
                  <button className="text-[10px] text-gray-500 hover:text-white font-bold uppercase underline">Preview HTML</button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-600 uppercase">Subject Line</label>
                    <input type="text" defaultValue="Your 3D Model is Ready for Download!" className="w-full bg-surface-dark border border-border-dark rounded-xl px-4 py-3 font-bold text-xs outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-600 uppercase">Body Copy</label>
                    <textarea rows={3} defaultValue="The {{model_name}} you requested has been successfully processed using our standard professional engine." className="w-full bg-surface-dark border border-border-dark rounded-xl px-4 py-3 text-xs text-gray-400 outline-none resize-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'LEGAL':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-bold border-b border-border-dark pb-6 flex justify-between items-center">
              <span>Legal & Compliance</span>
              <span className="text-[10px] bg-red-500/20 text-red-400 px-3 py-1 rounded-full font-black uppercase tracking-widest">Legal Docs</span>
            </h3>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Terms of Service (Markdown)</label>
                <textarea rows={8} className="w-full bg-background-dark border border-border-dark rounded-2xl px-6 py-4 text-xs text-gray-400 focus:border-primary outline-none resize-none font-mono transition-all" defaultValue={`# Terms of Service\n\n1. Acceptance\nBy using 3dokas.live, you agree to these terms...`} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Privacy Policy (Markdown)</label>
                <textarea rows={8} className="w-full bg-background-dark border border-border-dark rounded-2xl px-6 py-4 text-xs text-gray-400 focus:border-primary outline-none resize-none font-mono transition-all" defaultValue={`# Privacy Policy\n\nWe value your privacy. Your data is encrypted and secure...`} />
              </div>
              <div className="flex items-center gap-4 p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
                <span className="material-symbols-outlined text-red-400">gavel</span>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Warning: Updating these documents will require all users to re-accept the terms on their next login.</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background-dark font-display text-white relative">
      <Sidebar user={user} current="CMS" onNavigate={onNavigate} logout={logout} />

      {/* Toast Notifications */}
      <div className="fixed top-8 right-8 z-[110] flex flex-col gap-3 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl border bg-primary/10 border-primary/20 text-primary backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-right-8 duration-300">
            <span className="material-symbols-outlined text-sm">{n.type === 'success' ? 'check_circle' : 'info'}</span>
            <span className="text-xs font-bold uppercase tracking-widest leading-none">{n.message}</span>
          </div>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-10">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-1">
              <h2 className="text-4xl font-bold tracking-tight">Editor Web App</h2>
              <p className="text-gray-400">Configure public content, user experience, and automated communications.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => addNotification('Configuration reset.', 'info')} className="px-6 py-3 bg-surface-dark border border-border-dark rounded-2xl font-black uppercase tracking-widest text-[10px] hover:text-white transition-all text-gray-500">Reset</button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="bg-primary hover:bg-primary/90 px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 flex items-center gap-2 disabled:opacity-50 transition-all"
              >
                {isPublishing ? <span className="animate-spin material-symbols-outlined text-sm">sync</span> : <span className="material-symbols-outlined text-sm">cloud_upload</span>}
                {isPublishing ? 'Publishing...' : 'Publish Site'}
              </button>
            </div>
          </div>

          <div className="bg-surface-dark border border-border-dark rounded-[2.5rem] p-1.5 flex gap-1 mb-10 w-fit">
            {[
              { id: 'LANDING', label: 'Landing Page', icon: 'home' },
              { id: 'DASHBOARD_UI', label: 'Dashboard UI', icon: 'dashboard' },
              { id: 'EMAILS', label: 'Emails', icon: 'mail' },
              { id: 'LEGAL', label: 'Legal', icon: 'gavel' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-white'}`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-surface-dark p-8 rounded-[2.5rem] border border-border-dark space-y-8">
                <h3 className="text-xl font-bold border-b border-border-dark pb-6">Global Styles</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Brand Logo (Dark Mode)</label>
                    <div className="aspect-video bg-background-dark border-2 border-dashed border-border-dark rounded-2xl flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-primary/5 transition-all">
                      <span className="material-symbols-outlined text-gray-500 group-hover:text-primary transition-all">upload_file</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">SVG, PNG only</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Font Family</label>
                    <select className="w-full bg-background-dark border border-border-dark rounded-2xl px-6 py-4 font-bold text-xs outline-none cursor-pointer">
                      <option>Space Grotesk (Brand)</option>
                      <option>Inter (Modern)</option>
                      <option>JetBrains Mono (Technical)</option>
                    </select>
                  </div>
                </div>
              </div>


            </div>

            <div className="lg:col-span-8">
              <div className="bg-surface-dark p-10 rounded-[2.5rem] border border-border-dark min-h-[500px]">
                {renderEditorContent()}

                <div className="pt-10 mt-10 border-t border-border-dark flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Preview Mode Active</span>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={handlePublish} className="flex-1 md:flex-none px-10 py-4 bg-primary rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminCMS;
