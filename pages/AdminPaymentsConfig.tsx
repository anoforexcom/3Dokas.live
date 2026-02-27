
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
  type: 'success' | 'info' | 'warning';
  id: number;
}

interface Gateway {
  id: string;
  name: string;
  icon: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
  desc: string;
  apiKey: string;
  fixedFee: number;
  variableFee: number;
}

const AdminPaymentsConfig: React.FC<Props> = ({ user, onNavigate, logout }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [vat, setVat] = useState(23);
  const [currency, setCurrency] = useState('EUR (€) - Euro');
  
  const [gateways, setGateways] = useState<Gateway[]>([
    { id: 'stripe', name: 'Stripe Connect', icon: 'credit_card', status: 'Active', desc: 'Credit card processing and Apple Pay', apiKey: 'sk_live_51P...x92j', fixedFee: 0.25, variableFee: 1.4 },
    { id: 'mb', name: 'Multibanco/MBWay', icon: 'payments', status: 'Active', desc: 'Local gateway via Ifthenpay', apiKey: 'IFT_KEY_8829...002', fixedFee: 0.20, variableFee: 1.2 },
    { id: 'paypal', name: 'PayPal Direct', icon: 'account_balance_wallet', status: 'Maintenance', desc: 'Digital wallet payments', apiKey: 'PAYPAL_CID_92...kL1', fixedFee: 0.35, variableFee: 2.9 },
    { id: 'crypto', name: 'Crypto Payments', icon: 'currency_bitcoin', status: 'Inactive', desc: 'BTC, ETH, and USDT via Coinbase', apiKey: 'CB_SEC_771...99x', fixedFee: 0.00, variableFee: 1.0 }
  ]);

  const [editingGateway, setEditingGateway] = useState<Gateway | null>(null);

  const addNotification = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addNotification(`Global settings saved. VAT: ${vat}%, Currency: ${currency}`);
    }, 1200);
  };

  const updateGateway = (gateway: Gateway) => {
    setGateways(prev => prev.map(g => g.id === gateway.id ? gateway : g));
    addNotification(`Settings for ${gateway.name} updated successfully.`);
    setEditingGateway(null);
  };

  const handleGenerateCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    addNotification(`New promo code generated: 3dokas.live-${code}`, 'info');
  };

  const handleDownloadReport = () => {
    addNotification('Preparing financial report for March 2024...', 'info');
    setTimeout(() => {
      addNotification('Report downloaded successfully.', 'success');
    }, 2000);
  };

  const toggleMaintenance = () => {
    const newState = !isMaintenance;
    setIsMaintenance(newState);
    addNotification(newState ? 'Finance system entered Maintenance Mode.' : 'Finance system is back Online.', newState ? 'warning' : 'success');
  };

  const handleTalkToConsultant = () => {
    addNotification('Connecting to your dedicated Stripe Account Manager...', 'info');
  };

  return (
    <div className="flex h-screen bg-background-dark font-display text-white relative">
      <Sidebar user={user} current="PAYMENTS_CONFIG" onNavigate={onNavigate} logout={logout} />
      
      {/* Toast Notifications */}
      <div className="fixed top-8 right-8 z-[110] flex flex-col gap-3 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-right-8 duration-300 ${
            n.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
            n.type === 'warning' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
            'bg-primary/10 border-primary/20 text-primary'
          }`}>
            <span className="material-symbols-outlined text-sm">
              {n.type === 'success' ? 'check_circle' : n.type === 'warning' ? 'warning' : 'info'}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest leading-none">{n.message}</span>
          </div>
        ))}
      </div>

      {/* Gateway Configuration Modal */}
      {editingGateway && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditingGateway(null)}></div>
          <div className="relative w-full max-w-lg bg-surface-dark border border-border-dark rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-border-dark flex justify-between items-center">
               <h3 className="text-xl font-bold flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">{editingGateway.icon}</span>
                  Configure {editingGateway.name}
               </h3>
               <button onClick={() => setEditingGateway(null)} className="size-10 rounded-full hover:bg-white/5 flex items-center justify-center">
                  <span className="material-symbols-outlined">close</span>
               </button>
            </div>
            <div className="p-8 space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Secret API Key</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={editingGateway.apiKey}
                      onChange={(e) => setEditingGateway({...editingGateway, apiKey: e.target.value})}
                      className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-600 text-sm">key</span>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Fixed Fee (€)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={editingGateway.fixedFee}
                      onChange={(e) => setEditingGateway({...editingGateway, fixedFee: parseFloat(e.target.value) || 0})}
                      className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Variable Fee (%)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={editingGateway.variableFee}
                      onChange={(e) => setEditingGateway({...editingGateway, variableFee: parseFloat(e.target.value) || 0})}
                      className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                    />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Gateway Status</label>
                  <div className="flex gap-2">
                     {['Active', 'Inactive', 'Maintenance'].map(s => (
                       <button 
                        key={s}
                        onClick={() => setEditingGateway({...editingGateway, status: s as any})}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          editingGateway.status === s ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-background-dark border-border-dark text-gray-500 hover:text-white'
                        }`}
                       >
                         {s}
                       </button>
                     ))}
                  </div>
               </div>
            </div>
            <div className="p-8 bg-background-dark/50 border-t border-border-dark flex gap-3">
               <button onClick={() => setEditingGateway(null)} className="flex-1 py-4 bg-transparent border border-border-dark rounded-2xl font-bold text-xs uppercase tracking-widest">Cancel</button>
               <button onClick={() => updateGateway(editingGateway)} className="flex-1 py-4 bg-primary rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20">Apply Settings</button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-1">
              <h2 className="text-4xl font-bold tracking-tight">Finance & Gateways</h2>
              <p className="text-gray-400">Configure payment methods, global taxes, and commercial packs.</p>
            </div>
            <button 
              onClick={handleSaveAll}
              disabled={isSaving}
              className={`bg-primary hover:bg-primary/90 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 transition-all flex items-center gap-3 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
               {isSaving ? <span className="animate-spin material-symbols-outlined text-sm">sync</span> : null}
               {isSaving ? 'Saving...' : 'Save Global Changes'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
               <div className="bg-surface-dark p-10 rounded-[2.5rem] border border-border-dark space-y-10">
                  <h3 className="text-xl font-bold border-b border-border-dark pb-6 flex items-center gap-3">
                     <span className="material-symbols-outlined text-primary">account_balance</span>
                     Active Gateways
                  </h3>
                  <div className="space-y-6">
                     {gateways.map((g, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-background-dark rounded-3xl border border-border-dark hover:border-primary/50 transition-all group">
                           <div className="flex items-center gap-6">
                              <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                 <span className="material-symbols-outlined text-2xl">{g.icon}</span>
                              </div>
                              <div className="flex flex-col">
                                 <div className="flex items-center gap-2">
                                    <span className="font-bold">{g.name}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                                      g.status === 'Active' ? 'bg-green-500/10 text-green-400' : 
                                      g.status === 'Inactive' ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'
                                    }`}>{g.status}</span>
                                 </div>
                                 <span className="text-xs text-gray-500">{g.desc}</span>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="hidden md:flex flex-col items-end mr-4">
                                 <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Fees</span>
                                 <span className="text-xs font-bold text-gray-400">€{g.fixedFee.toFixed(2)} + {g.variableFee}%</span>
                              </div>
                              <button 
                                onClick={() => setEditingGateway({...g})}
                                className="px-5 py-2.5 bg-white/5 border border-border-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2"
                              >
                                 <span className="material-symbols-outlined text-sm">settings</span>
                                 Edit
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="bg-surface-dark p-10 rounded-[2.5rem] border border-border-dark space-y-8">
                  <h3 className="text-xl font-bold border-b border-border-dark pb-6">Global Tax Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">VAT (Value Added Tax)</label>
                        <div className="relative">
                           <input 
                            type="number" 
                            value={vat} 
                            onChange={(e) => setVat(parseInt(e.target.value) || 0)}
                            className="w-full bg-background-dark border border-border-dark rounded-2xl px-6 py-4 font-black text-xl focus:border-primary outline-none transition-all" 
                           />
                           <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-500">%</span>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Reference Currency</label>
                        <select 
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full bg-background-dark border border-border-dark rounded-2xl px-6 py-4 font-black text-lg focus:border-primary outline-none cursor-pointer"
                        >
                           <option>EUR (€) - Euro</option>
                           <option>USD ($) - Dollar</option>
                           <option>GBP (£) - Pound</option>
                        </select>
                     </div>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
               <div className="bg-surface-dark p-8 rounded-[2.5rem] border border-border-dark space-y-8">
                  <h3 className="text-xl font-bold border-b border-border-dark pb-6">Quick Actions</h3>
                  <div className="space-y-4">
                     <button 
                        onClick={() => setEditingGateway({...gateways[0]})}
                        className="w-full py-4 bg-white/5 border border-border-dark rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-bold text-sm"
                     >
                        <span className="material-symbols-outlined text-lg">settings_input_component</span>
                        Manage API Credentials
                     </button>
                     <button 
                        onClick={handleGenerateCode}
                        className="w-full py-4 bg-white/5 border border-border-dark rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-bold text-sm"
                     >
                        <span className="material-symbols-outlined text-lg">card_giftcard</span>
                        Generate Promo Code
                     </button>
                     <button 
                        onClick={handleDownloadReport}
                        className="w-full py-4 bg-white/5 border border-border-dark rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-bold text-sm"
                     >
                        <span className="material-symbols-outlined text-lg">download</span>
                        Export Financial Log
                     </button>
                     <button 
                        onClick={toggleMaintenance}
                        className={`w-full py-4 border rounded-2xl flex items-center justify-center gap-3 transition-all font-bold text-sm ${isMaintenance ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/5 border-border-dark text-gray-400 hover:text-red-400'}`}
                     >
                        <span className="material-symbols-outlined text-lg">warning</span>
                        {isMaintenance ? 'Payments Offline' : 'Toggle Maintenance'}
                     </button>
                  </div>
               </div>

               <div className="bg-gradient-to-br from-primary to-purple-800 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 space-y-6">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">Financial Health</h3>
                    <p className="text-sm opacity-80 mt-2">All systems running smoothly. Stripe connection is verified.</p>
                  </div>
                  <button 
                    onClick={handleTalkToConsultant}
                    className="w-full py-4 bg-white text-primary rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all shadow-xl"
                  >
                     Check Gateway Status
                  </button>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPaymentsConfig;
