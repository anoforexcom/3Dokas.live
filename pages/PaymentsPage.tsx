
import React, { useState } from 'react';
import { User } from '../types';
import Sidebar from '../components/Sidebar';
import { useSales } from '../context/SalesContext';

interface Props {
  user: User;
  onNavigate: (view: string) => void;
  logout: () => void;
  onPurchase: (amount: number) => void;
}

const PaymentsPage: React.FC<Props> = ({ user, onNavigate, logout, onPurchase }) => {
  const { addOrder, getOrdersByUser } = useSales();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'SELECT' | 'DETAILS'>('SELECT');
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const handlePackClick = (pack: any) => {
    setSelectedPack(pack);
    setShowPaymentModal(true);
    setPaymentStep('SELECT');
  };

  const handleConfirmPayment = () => {
    setShowPaymentModal(false);
    setIsProcessing(true);

    // Simulate payment processing flow
    setTimeout(() => {
      if (selectedPack) {
        onPurchase(parseInt(selectedPack.credits));
        addOrder({
          id: Math.random().toString(36).substr(2, 9),
          userId: user.id,
          userName: user.name,
          description: selectedPack.name,
          amount: parseFloat(selectedPack.price),
          date: new Date().toISOString(),
          status: 'completed',
          packId: selectedPack.name
        });
      }
      setIsProcessing(false);
      setSelectedPack(null);
      setSelectedMethod('');
      alert(`Success! Credits have been added to your account.`);
    }, 2500);
  };

  return (
    <div className="flex h-screen bg-background-dark font-display text-white relative">
      <Sidebar user={user} current="PAYMENTS" onNavigate={onNavigate} logout={logout} />

      {/* Payment Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[110] bg-background-dark/80 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-300">
          <div className="relative size-24">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black uppercase tracking-widest">Secure Payment</h3>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest animate-pulse">Contacting Banking Services...</p>
          </div>
          <div className="flex items-center gap-4 opacity-40">
            <span className="material-symbols-outlined text-xl">verified_user</span>
            <span className="text-[10px] font-black uppercase tracking-widest">PCI-DSS Compliant Gateway</span>
          </div>
        </div>
      )}

      {/* Payment Choice Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)}></div>
          <div className="relative w-full max-w-md bg-surface-dark border border-border-dark rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-border-dark flex justify-between items-center">
              <h3 className="text-xl font-bold">Checkout - {selectedPack?.name}</h3>
              <button onClick={() => setShowPaymentModal(false)} className="size-10 rounded-full hover:bg-white/5 flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-8 space-y-6">
              {paymentStep === 'SELECT' ? (
                <div className="space-y-4">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Select Payment Method</p>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'card', name: 'Credit Card', icon: 'credit_card', desc: 'Visa, Mastercard' },
                      { id: 'mbway', name: 'MB Way', icon: 'smartphone', desc: 'Fast mobile payment' },
                      { id: 'paypal', name: 'PayPal', icon: 'account_balance_wallet', desc: 'Digital wallet' }
                    ].map(method => (
                      <button
                        key={method.id}
                        onClick={() => {
                          setSelectedMethod(method.id);
                          setPaymentStep('DETAILS');
                        }}
                        className="flex items-center gap-4 p-5 bg-background-dark border border-border-dark rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                      >
                        <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <span className="material-symbols-outlined">{method.icon}</span>
                        </div>
                        <div>
                          <span className="block font-bold">{method.name}</span>
                          <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest">{method.desc}</span>
                        </div>
                        <span className="material-symbols-outlined ml-auto text-gray-600 group-hover:text-white transition-all">chevron_right</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <button onClick={() => setPaymentStep('SELECT')} className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Change Method
                  </button>

                  {selectedMethod === 'card' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase">Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase">Expiry Date</label>
                          <input type="text" placeholder="MM/YY" className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase">CVV</label>
                          <input type="text" placeholder="123" className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'mbway' && (
                    <div className="space-y-4">
                      <div className="space-y-2 text-center py-4">
                        <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                          <span className="material-symbols-outlined text-3xl">smartphone</span>
                        </div>
                        <p className="text-sm text-gray-400">Enter your phone number to receive the MB Way notification.</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase">Phone Number</label>
                        <input type="tel" placeholder="912 345 678" className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" />
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'paypal' && (
                    <div className="space-y-4 py-10 text-center">
                      <p className="text-sm text-gray-400">You will be redirected to PayPal to complete your purchase safely.</p>
                      <div className="flex justify-center gap-1 font-black italic text-2xl text-blue-400">
                        PayPal
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleConfirmPayment}
                    className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
                  >
                    Pay €{selectedPack?.price}.00 Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border-dark pb-10">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Plans & Credits</h1>
              <p className="text-gray-400 text-lg">Pay per transformation or choose a discounted pack.</p>
            </div>
            <div className="px-6 py-3 rounded-2xl bg-surface-dark border border-border-dark flex items-center gap-4 shadow-xl">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">token</span>
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase text-gray-500 tracking-widest">Current Balance</span>
                <span className="font-black text-xl">{user.credits} Credits</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <h2 className="text-2xl font-bold tracking-tight">Choose the Ideal Pack</h2>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">VAT included where applicable</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Starter', price: '5', credits: '100', disc: '0%', items: ['5 Transformations', 'Standard Resolution', 'Professional Export'], popular: false },
                { name: 'Maker Pack', price: '19', credits: '600', disc: '15%', items: ['30 Transformations', 'HD Resolution', 'High Fidelity Export'], popular: true },
                { name: 'Studio Pro', price: '49', credits: '2000', disc: '30%', items: ['100 Transformations', 'Ultra 4K Textures', 'Commercial License'], popular: false }
              ].map((p, i) => (
                <div key={i} className={`bg-surface-dark p-10 rounded-[2.5rem] border transition-all flex flex-col gap-8 relative group hover:-translate-y-2 ${p.popular ? 'border-primary shadow-2xl shadow-primary/10 scale-105 z-10' : 'border-border-dark hover:border-primary/50'}`}>
                  {p.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-[10px] font-black uppercase px-6 py-2 rounded-full tracking-widest shadow-xl">Best Seller</div>
                  )}
                  {p.disc !== '0%' && (
                    <div className="absolute top-8 right-8 bg-green-500/20 text-green-400 text-[10px] font-black px-3 py-1 rounded-lg border border-green-500/20">-{p.disc}</div>
                  )}

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight">{p.name}</h3>
                    <p className="text-gray-500 text-sm font-medium">Ideal for independent creators</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-black tracking-tighter">€{p.price}</span>
                    </div>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{p.credits} Credits included</p>
                  </div>

                  <button
                    onClick={() => handlePackClick(p)}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl ${p.popular ? 'bg-primary text-white shadow-primary/20 hover:bg-primary/90' : 'bg-background-dark border border-border-dark text-white hover:bg-white hover:text-background-dark shadow-black/20'}`}>
                    Get Pack
                  </button>

                  <ul className="space-y-4 pt-8 border-t border-border-dark">
                    {p.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-4 text-sm font-medium text-gray-300">
                        <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-[10px] font-black">check</span>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-10">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">Payments History</h2>
              <div className="bg-surface-dark rounded-[2rem] border border-border-dark overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <tr>
                      <th className="px-8 py-6">Issue Date</th>
                      <th className="px-8 py-6">Description</th>
                      <th className="px-8 py-6">Total Amount</th>
                      <th className="px-8 py-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-dark">
                    {getOrdersByUser(user.id).map((order) => (
                      <tr key={order.id} className="hover:bg-white/5 transition-all group">
                        <td className="px-8 py-6 text-sm font-bold">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="px-8 py-6 text-sm text-gray-400">{order.description}</td>
                        <td className="px-8 py-6 font-black text-white">€{order.amount.toFixed(2)}</td>
                        <td className="px-8 py-6 text-right">
                          <span className="text-[10px] font-black uppercase px-3 py-1 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">{order.status}</span>
                        </td>
                      </tr>
                    ))}
                    {getOrdersByUser(user.id).length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-8 py-8 text-center text-sm text-gray-500">No payment history found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentsPage;
