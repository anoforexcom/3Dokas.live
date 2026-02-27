
import React, { useState } from 'react';

interface Props {
  onBack: () => void;
  onStart: () => void;
  onPurchase?: (amount: number) => void;
}

const PricingPage: React.FC<Props> = ({ onBack, onStart, onPurchase }) => {
  // We keep the state for potential future use or consistency, 
  // but now the primary action is to redirect to authentication.
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPlan = (pack: any) => {
    // As requested, clicking select takes the user to the registration page.
    // The user will then complete the login/signup and can proceed to the Payments area.
    onStart();
  };

  return (
    <div className="min-h-screen bg-background-dark font-display text-white relative">
      <nav className="border-b border-border-dark bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 group">
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="font-bold">Back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight">Plans and Pricing</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-background-dark/80 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-300">
           <div className="relative size-24">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
           </div>
           <div className="text-center space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-widest">Redirecting to Checkout</h3>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest animate-pulse">Please wait...</p>
           </div>
        </div>
      )}

      <main className="max-w-[1280px] mx-auto p-6 md:p-20 space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold tracking-tight">Transparency in Every Pixel</h2>
          <p className="text-gray-400 text-lg">Pay only for what you use or save with our professional packs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { name: 'Single', price: '5', credits: '100', items: ['5 Transformations', 'Standard Resolution', 'Professional Export', 'Normal Queue'], color: 'border-border-dark' },
             { name: 'Maker Pack', price: '19', credits: '600', items: ['30 Transformations', 'HD Resolution', 'High Fidelity Export', 'Priority Queue'], popular: true, color: 'border-primary' },
             { name: 'Studio Pro', price: '49', credits: '2000', items: ['100 Transformations', 'Ultra 4K Textures', 'Commercial License', 'Priority Support'], color: 'border-border-dark' }
           ].map((p, i) => (
             <div key={i} className={`bg-surface-dark p-12 rounded-[3rem] border transition-all flex flex-col gap-8 relative ${p.popular ? 'border-primary shadow-2xl shadow-primary/10' : 'border-border-dark'}`}>
                {p.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-[10px] font-black uppercase px-6 py-2 rounded-full tracking-widest">Recommended</div>}
                <div className="space-y-1">
                   <h3 className="text-2xl font-bold">{p.name}</h3>
                   <p className="text-gray-500 text-sm">Billed per pack</p>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-6xl font-black">€{p.price}</span>
                   <span className="text-gray-500 text-sm font-bold">/ {p.credits} credits</span>
                </div>
                <ul className="space-y-4 py-8 border-y border-border-dark">
                   {p.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-gray-300">
                         <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                         {item}
                      </li>
                   ))}
                </ul>
                <button onClick={() => handleSelectPlan(p)} className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${p.popular ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-background-dark border border-border-dark text-white hover:bg-white hover:text-background-dark'}`}>
                   Select {p.name}
                </button>
             </div>
           ))}
        </div>

        <div className="bg-surface-dark p-10 md:p-16 rounded-[3rem] border border-border-dark">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-6">
                 <h3 className="text-3xl font-bold">FAQ</h3>
                 <div className="space-y-6">
                    {[
                      { q: 'What are credits?', a: 'Each credit represents a portion of processing power. A typical high-quality transformation consumes 20 credits.' },
                      { q: 'Do credits expire?', a: 'No, your purchased credits never expire and can be used at any time.' },
                      { q: 'Can I 3D print?', a: 'Yes! Our models exported in STL are optimized for slicers like Cura and PrusaSlicer.' }
                    ].map((faq, i) => (
                      <div key={i} className="space-y-2">
                         <h4 className="font-bold text-lg">{faq.q}</h4>
                         <p className="text-gray-400 text-sm">{faq.a}</p>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-primary/5 p-8 rounded-3xl border border-primary/20 flex flex-col justify-center gap-6">
                 <h4 className="text-xl font-bold">Need a business plan?</h4>
                 <p className="text-gray-400 text-sm">We offer API access and bulk processing for e-commerce and game studios.</p>
                 <button className="text-primary font-bold hover:underline flex items-center gap-2">
                    Talk to our team <span className="material-symbols-outlined text-sm">arrow_forward</span>
                 </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default PricingPage;
