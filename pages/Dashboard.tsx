
import React from 'react';
import { User, TransformStatus } from '../types';
import Sidebar from '../components/Sidebar';
import { useTransformations } from '../context/TransformationContext';

interface Props {
   user: User;
   onNavigate: (view: string) => void;
   logout: () => void;
}

const Dashboard: React.FC<Props> = ({ user, onNavigate, logout }) => {
   const { getTransformationsByUser } = useTransformations();
   const userTransformations = getTransformationsByUser(user.id);

   const recentTransforms = userTransformations.slice(0, 4).map(t => ({
      id: t.id,
      name: t.name,
      status: t.status === 'completed' ? TransformStatus.COMPLETED : t.status === 'processing' ? TransformStatus.PROCESSING : TransformStatus.ERROR,
      time: new Date(t.date).toLocaleDateString(),
      thumb: t.imageUrl
   }));

   // Total transformations count derived from actual context data
   const totalTransformations = userTransformations.filter(t => t.status === 'completed').length;

   return (
      <div className="flex h-screen bg-background-dark font-display text-white">
         <Sidebar user={user} current="DASHBOARD" onNavigate={onNavigate} logout={logout} />

         <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
            <div className="max-w-6xl mx-auto space-y-10">

               {/* Welcome Header - Background Image Removed */}
               <div className="relative h-64 rounded-[2rem] overflow-hidden border border-border-dark flex flex-col justify-end p-8 md:p-12 group bg-surface-dark/40">
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10"></div>

                  <div className="relative z-20 space-y-2">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-primary mb-2">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-primary mr-2 animate-pulse"></span>
                        {user.plan}
                     </div>
                     <h1 className="text-4xl md:text-5xl font-black tracking-tight">Hello, {user.name.split(' ')[0]}!</h1>
                     <p className="text-gray-300 max-w-lg text-sm md:text-base">You have {user.credits} credits available to transform your ideas into 3D reality.</p>
                  </div>

                  <div className="absolute top-8 right-8 z-20 hidden md:flex items-center gap-4">
                     <button onClick={() => onNavigate('EDITOR')} className="px-6 py-3 bg-white text-background-dark rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-gray-200 transition-all">
                        New Transformation
                     </button>
                  </div>
               </div>

               {/* Stats Row */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-surface-dark p-8 rounded-[2rem] border border-border-dark space-y-6 hover:border-primary/50 transition-all">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-500 tracking-widest">
                        Remaining Credits <span className="material-symbols-outlined text-green-400 text-sm">bolt</span>
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-5xl font-black tracking-tighter">{user.credits}</h4>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Available Balance</p>
                     </div>
                     <div className="h-2 bg-background-dark rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" style={{ width: `${Math.min((user.credits / 500) * 100, 100)}%` }}></div>
                     </div>
                     <button onClick={() => onNavigate('PAYMENTS')} className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline">Reload Credits</button>
                  </div>

                  <div className="bg-surface-dark p-8 rounded-[2rem] border border-border-dark space-y-6 hover:border-blue-500/50 transition-all">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-500 tracking-widest">
                        Total Transformations <span className="material-symbols-outlined text-blue-500 text-sm">view_in_ar</span>
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-5xl font-black tracking-tighter">{totalTransformations}</h4>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Completed Models</p>
                     </div>
                     <div className="h-2 bg-background-dark rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                     </div>
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Usage History</p>
                  </div>

                  <div className="bg-surface-dark p-8 rounded-[2rem] border border-border-dark space-y-6 hover:border-purple-500/50 transition-all">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-500 tracking-widest">
                        Performance <span className="material-symbols-outlined text-purple-500 text-sm">auto_awesome</span>
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-5xl font-black tracking-tighter">Ultra</h4>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Rendering Level</p>
                     </div>
                     <div className="h-2 bg-background-dark rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '100%' }}></div>
                     </div>
                     <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest">Active Engine</p>
                  </div>
               </div>

               {/* Recent transforms */}
               <div className="space-y-6">
                  <div className="flex justify-between items-center px-2">
                     <h2 className="text-2xl font-bold tracking-tight">Recent Transformations</h2>
                     <button
                        onClick={() => onNavigate('EDITOR')}
                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                     >
                        View Full History
                     </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                     {recentTransforms.map(t => (
                        <div key={t.id} className="bg-surface-dark rounded-3xl border border-border-dark overflow-hidden group hover:shadow-2xl hover:shadow-black/50 transition-all">
                           <div className="aspect-[4/3] relative overflow-hidden">
                              <img src={t.thumb} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
                              <div className="absolute top-4 right-4">
                                 <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border backdrop-blur-md shadow-2xl ${t.status === TransformStatus.PROCESSING ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                                    t.status === TransformStatus.COMPLETED ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                                       'bg-gray-500/20 text-gray-300 border-gray-500/30'
                                    }`}>
                                    {t.status === TransformStatus.PROCESSING ? 'Processing' : t.status}
                                 </span>
                              </div>
                           </div>
                           <div className="p-6 space-y-4">
                              <div>
                                 <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{t.name}</h3>
                                 <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{t.time}</p>
                              </div>
                              {t.status === TransformStatus.COMPLETED ? (
                                 <div className="flex gap-2">
                                    <button className="flex-1 h-10 rounded-xl bg-background-dark border border-border-dark hover:bg-white hover:text-background-dark transition-all text-[10px] font-black uppercase tracking-widest">
                                       Export GLB
                                    </button>
                                    <button onClick={() => onNavigate('EDITOR')} className="size-10 flex items-center justify-center rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white transition-all">
                                       <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                 </div>
                              ) : t.status === TransformStatus.PROCESSING ? (
                                 <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase text-blue-400">
                                       <span>Rendering</span>
                                       <span>65%</span>
                                    </div>
                                    <div className="h-1 bg-background-dark rounded-full overflow-hidden">
                                       <div className="h-full bg-blue-500 animate-pulse w-2/3"></div>
                                    </div>
                                 </div>
                              ) : (
                                 <button onClick={() => onNavigate('EDITOR')} className="w-full h-10 rounded-xl border-2 border-dashed border-border-dark text-[10px] text-gray-500 font-black uppercase tracking-widest hover:text-primary hover:border-primary/50 transition-all">
                                    Continue Upload
                                 </button>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

            </div>
         </main>
      </div>
   );
};

export default Dashboard;
