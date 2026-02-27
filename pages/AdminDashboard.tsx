
import React, { useState } from 'react';
import { User } from '../types';
import Sidebar from '../components/Sidebar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSales } from '../context/SalesContext';
import { useTransformations } from '../context/TransformationContext';
import { useSales } from '../context/SalesContext';
import { useTransformations } from '../context/TransformationContext';

interface Props {
   user: User;
   onNavigate: (view: string) => void;
   logout: () => void;
}

const data = [
   { name: 'Jan', value: 4200 },
   { name: 'Feb', value: 3800 },
   { name: 'Mar', value: 6500 },
   { name: 'Apr', value: 8900 },
   { name: 'May', value: 12450 },
];

const AdminDashboard: React.FC<Props> = ({ user, onNavigate, logout }) => {
   const { orders, getTotalRevenue, getMonthlyRevenue } = useSales();
   const { transformations } = useTransformations();
   const [adminSection, setAdminSection] = useState<'STATS' | 'PAYMENTS' | 'CMS'>('STATS');
   const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('ALL');
   const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);

   // Calculate real stats
   const totalRevenue = getTotalRevenue();
   const totalTransformations = transformations.length;

   // We are using a simplified New Users metric for now (based on transformations unique authors or just 0 as we don't track all users globally)
   const newUsers = new Set(transformations.map(t => t.userId)).size;

   // Get real chart data
   const monthlyRevenue = getMonthlyRevenue();

   const getChartData = (range: string) => {
      // Mapping real data to chart format
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      return months.map((month, index) => ({
         name: month,
         value: monthlyRevenue[index]
      }));
   };

   return (
      <div className="flex h-screen bg-background-dark font-display text-white">
         <Sidebar user={user} current="ADMIN" onNavigate={onNavigate} logout={logout} />

         <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-10">

               <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div className="space-y-1">
                     <h2 className="text-4xl font-bold tracking-tight">Administrative Panel</h2>
                     <p className="text-gray-400">Full control over the 3dokas.live ecosystem.</p>
                  </div>
                  <div className="bg-surface-dark p-1 rounded-2xl border border-border-dark flex gap-1">
                     <button
                        onClick={() => setAdminSection('STATS')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${adminSection === 'STATS' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-white'}`}
                     >
                        Metrics
                     </button>
                  </div>
               </div>

               {adminSection === 'STATS' && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                           { label: 'Net Revenue', val: `€${totalRevenue.toFixed(2)}`, trend: '+100%', icon: 'payments', color: 'text-gray-400' },
                           { label: 'Active Makers', val: user.role === 'ADMIN' ? newUsers.toString() : '1', trend: '+100%', icon: 'person_add', color: 'text-primary' },
                           { label: 'Transformations', val: totalTransformations.toString(), trend: '+100%', icon: 'precision_manufacturing', color: 'text-purple-400' },
                        ].map((k, i) => (
                           <div key={i} className="bg-surface-dark p-6 rounded-3xl border border-border-dark flex flex-col justify-between min-h-[160px] group hover:border-primary/50 transition-all">
                              <div className="flex justify-between items-start">
                                 <div className={`size-12 rounded-2xl bg-white/5 flex items-center justify-center ${k.color}`}>
                                    <span className="material-symbols-outlined">{k.icon}</span>
                                 </div>
                                 <div className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-white/5 border border-white/10">{k.trend}</div>
                              </div>
                              <div>
                                 <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{k.label}</p>
                                 <h3 className="text-3xl font-bold">{k.val}</h3>
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-surface-dark p-8 rounded-3xl border border-border-dark space-y-8">
                           <div className="flex justify-between items-center relative">
                              <div>
                                 <h3 className="text-xl font-bold">Monthly Revenue</h3>
                                 <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
                                    {timeRange === '1M' && 'Last 30 Days'}
                                    {timeRange === '3M' && 'Last Quarter'}
                                    {timeRange === '6M' && 'Last 6 Months'}
                                    {timeRange === '1Y' && 'Last Year'}
                                    {timeRange === 'ALL' && 'All Time'}
                                 </p>
                              </div>
                              <div className="flex gap-2 relative">
                                 <button
                                    onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
                                    className={`size-8 rounded-lg border flex items-center justify-center transition-all ${isDateMenuOpen ? 'bg-primary border-primary text-white' : 'bg-background-dark border-border-dark text-gray-500 hover:text-white'}`}
                                 >
                                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                                 </button>

                                 {isDateMenuOpen && (
                                    <div className="absolute right-0 top-10 w-32 bg-surface-dark border border-border-dark rounded-xl shadow-2xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                                       {['1M', '3M', '6M', '1Y', 'ALL'].map((range) => (
                                          <button
                                             key={range}
                                             onClick={() => {
                                                setTimeRange(range as any);
                                                setIsDateMenuOpen(false);
                                             }}
                                             className={`w-full text-left px-4 py-3 text-xs font-bold hover:bg-white/5 transition-colors ${timeRange === range ? 'text-primary' : 'text-gray-400'}`}
                                          >
                                             {range === '1M' && 'Last Month'}
                                             {range === '3M' && '3 Months'}
                                             {range === '6M' && '6 Months'}
                                             {range === '1Y' && '1 Year'}
                                             {range === 'ALL' && 'All Time'}
                                          </button>
                                       ))}
                                    </div>
                                 )}
                              </div>
                           </div>
                           <div className="h-80 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={getChartData(timeRange)}>
                                    <defs>
                                       <linearGradient id="colorAdmin" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#5b2bee" stopOpacity={0.4} />
                                          <stop offset="95%" stopColor="#5b2bee" stopOpacity={0} />
                                       </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2c2839" />
                                    <XAxis dataKey="name" stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value / 1000}k`} />
                                    <Tooltip
                                       contentStyle={{ backgroundColor: '#151022', border: '1px solid #2c2839', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                                       itemStyle={{ color: '#5b2bee', fontWeight: '900' }}
                                       formatter={(value: number) => [`€${value.toLocaleString()}`, 'Revenue']}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#5b2bee" fillOpacity={1} fill="url(#colorAdmin)" strokeWidth={4} />
                                 </AreaChart>
                              </ResponsiveContainer>
                           </div>
                        </div>

                        <div className="bg-surface-dark p-8 rounded-3xl border border-border-dark space-y-6">
                           <h3 className="text-xl font-bold">Conversion by Plan</h3>
                           <div className="space-y-6">
                              {[
                                 { label: 'Single (€5)', perc: 0, color: 'bg-blue-500' },
                                 { label: 'Maker (€19)', perc: 0, color: 'bg-primary' },
                                 { label: 'Studio (€49)', perc: 0, color: 'bg-purple-500' }
                              ].map((p, i) => (
                                 <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                       <span>{p.label}</span>
                                       <span className="text-white">{p.perc}%</span>
                                    </div>
                                    <div className="h-2.5 bg-background-dark rounded-full overflow-hidden">
                                       <div className={`${p.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${p.perc}%` }}></div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                           <div className="pt-6 mt-6 border-t border-border-dark space-y-4">
                              <button className="w-full py-4 rounded-2xl bg-background-dark border border-border-dark hover:bg-border-dark transition-all text-xs font-black uppercase tracking-widest">
                                 View Sales Report
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {adminSection === 'PAYMENTS' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-surface-dark border border-border-dark p-8 rounded-3xl space-y-6">
                           <div className="flex items-center gap-4">
                              <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                 <span className="material-symbols-outlined">account_balance</span>
                              </div>
                              <h4 className="font-bold">Stripe Connect</h4>
                           </div>
                           <div className="flex justify-between items-center bg-background-dark p-4 rounded-2xl border border-border-dark">
                              <span className="text-xs font-bold text-gray-500">Status</span>
                              <span className="text-xs font-black text-green-400 uppercase tracking-widest">Active</span>
                           </div>
                           <button className="w-full py-3 bg-border-dark rounded-xl text-xs font-bold hover:bg-white hover:text-background-dark transition-all">Configure API Keys</button>
                        </div>
                        <div className="bg-surface-dark border border-border-dark p-8 rounded-3xl space-y-6">
                           <div className="flex items-center gap-4">
                              <div className="size-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                                 <span className="material-symbols-outlined">payments</span>
                              </div>
                              <h4 className="font-bold">Multibanco / MBWay</h4>
                           </div>
                           <div className="flex justify-between items-center bg-background-dark p-4 rounded-2xl border border-border-dark">
                              <span className="text-xs font-bold text-gray-500">Variable Fee</span>
                              <span className="text-xs font-black text-white uppercase">1.2% + €0.20</span>
                           </div>
                           <button className="w-full py-3 bg-border-dark rounded-xl text-xs font-bold hover:bg-white hover:text-background-dark transition-all">Edit Fees</button>
                        </div>
                        <div className="bg-surface-dark border border-border-dark p-8 rounded-3xl space-y-6">
                           <div className="flex items-center gap-4">
                              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                 <span className="material-symbols-outlined">card_giftcard</span>
                              </div>
                              <h4 className="font-bold">Promo Codes</h4>
                           </div>
                           <div className="flex justify-between items-center bg-background-dark p-4 rounded-2xl border border-border-dark">
                              <span className="text-xs font-bold text-gray-500">Active</span>
                              <span className="text-xs font-black text-white uppercase">12 Coupons</span>
                           </div>
                           <button className="w-full py-3 bg-primary rounded-xl text-xs font-bold hover:bg-primary/80 transition-all">Generate New Code</button>
                        </div>
                     </div>

                     <div className="bg-surface-dark rounded-3xl border border-border-dark overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-border-dark flex justify-between items-center">
                           <h3 className="text-xl font-bold">Payment Methods Management</h3>
                           <button className="bg-primary px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20">Add Method</button>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead className="bg-white/5 border-b border-border-dark text-[10px] font-black uppercase tracking-widest text-gray-500">
                                 <tr>
                                    <th className="px-8 py-5">Provider</th>
                                    <th className="px-8 py-5">Type</th>
                                    <th className="px-8 py-5">Currency</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-border-dark">
                                 {[
                                    { p: 'Stripe', t: 'Credit Card', m: 'EUR', s: 'Active' },
                                    { p: 'PayPal', t: 'Digital Wallet', m: 'EUR/USD', s: 'Active' },
                                    { p: 'Ifthenpay', t: 'MBWay / Multibanco', m: 'EUR', s: 'Maintenance' },
                                    { p: 'Coinbase', t: 'Crypto (BTC/ETH)', m: 'Crypto', s: 'Inactive' },
                                 ].map((row, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-all group">
                                       <td className="px-8 py-6 font-bold">{row.p}</td>
                                       <td className="px-8 py-6 text-sm text-gray-400">{row.t}</td>
                                       <td className="px-8 py-6 text-sm font-black text-primary">{row.m}</td>
                                       <td className="px-8 py-6">
                                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${row.s === 'Active' ? 'bg-green-400/10 text-green-400' :
                                             row.s === 'Inactive' ? 'bg-red-400/10 text-red-400' : 'bg-orange-400/10 text-orange-400'
                                             }`}>
                                             {row.s}
                                          </span>
                                       </td>
                                       <td className="px-8 py-6 text-right">
                                          <button className="material-symbols-outlined text-gray-500 hover:text-white transition-all">settings</button>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               )}

               {adminSection === 'CMS' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-left-4 duration-500">
                     <div className="lg:col-span-4 space-y-6">
                        <div className="bg-surface-dark p-8 rounded-3xl border border-border-dark space-y-8">
                           <h3 className="text-xl font-bold border-b border-border-dark pb-6">Edit Menu</h3>
                           <div className="flex flex-col gap-2">
                              {['Landing Page', 'User Dashboard', '3D Editor UI', 'Transactional Emails', 'Terms & Legal'].map((m, i) => (
                                 <button key={i} className={`text-left px-4 py-4 rounded-2xl text-sm font-bold transition-all ${i === 0 ? 'bg-primary text-white' : 'hover:bg-white/5 text-gray-400'}`}>
                                    {m}
                                 </button>
                              ))}
                           </div>
                           <div className="pt-6 border-t border-border-dark">
                              <button className="w-full py-4 bg-green-500 hover:bg-green-600 transition-all rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-green-500/10">
                                 Publish Changes
                              </button>
                           </div>
                        </div>
                     </div>
                     <div className="lg:col-span-8 space-y-6">
                        <div className="bg-surface-dark border border-border-dark rounded-3xl overflow-hidden shadow-2xl">
                           <div className="p-8 border-b border-border-dark flex items-center justify-between">
                              <h3 className="text-xl font-bold">Block Editor: Hero Section</h3>
                              <div className="flex gap-2">
                                 <span className="material-symbols-outlined text-gray-500">desktop_windows</span>
                                 <span className="material-symbols-outlined text-gray-500">smartphone</span>
                              </div>
                           </div>
                           <div className="p-8 space-y-8">
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Main Title</label>
                                 <input
                                    type="text"
                                    defaultValue="From Photo to 3D Reality"
                                    className="w-full bg-background-dark border border-border-dark rounded-2xl px-6 py-4 font-bold text-lg focus:border-primary outline-none transition-all"
                                 />
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Description (Hero)</label>
                                 <textarea
                                    rows={4}
                                    defaultValue="Instantly convert your favorite 2D images into high-fidelity 3D models. Perfect for 3D printing."
                                    className="w-full bg-background-dark border border-border-dark rounded-2xl px-6 py-4 text-gray-300 focus:border-primary outline-none transition-all resize-none"
                                 ></textarea>
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                 <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Primary Color</label>
                                    <div className="flex items-center gap-3 bg-background-dark border border-border-dark p-3 rounded-2xl">
                                       <div className="size-8 rounded-lg bg-[#5b2bee] shadow-lg"></div>
                                       <span className="font-mono text-xs uppercase">#5B2BEE</span>
                                    </div>
                                 </div>
                                 <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Button Style</label>
                                    <select className="w-full bg-background-dark border border-border-dark rounded-2xl px-6 py-3 font-bold text-xs outline-none">
                                       <option>Rounded XL</option>
                                       <option>Square</option>
                                       <option>Pill</option>
                                    </select>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

            </div>
         </main>
      </div>
   );
};

export default AdminDashboard;
