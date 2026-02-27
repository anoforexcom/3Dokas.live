
import React from 'react';

interface Props {
  onBack: () => void;
}

const Privacy: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-background-dark font-display text-white">
      <nav className="border-b border-border-dark bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 group">
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="font-bold">Back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight">Privacy Policy</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto p-10 md:p-20 space-y-12 leading-relaxed text-gray-300">
        <section className="space-y-4">
          <h2 className="text-4xl font-bold text-white tracking-tight">Privacy First</h2>
          <p>At 3dokas.live, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information and image data that you process on our platform.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Data We Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Information:</strong> Name, email, and avatar provided during registration.</li>
            <li><strong>Processing Images:</strong> Photos you upload for 3D conversion.</li>
            <li><strong>Payment Data:</strong> Processed securely by third parties (Stripe); we never store your card details.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">How We Use Data</h2>
          <p>Your images are used exclusively to generate the requested 3D model. We do not sell your images nor use them to train public AI models without your explicit consent.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Security</h2>
          <p>We use bank-level SSL encryption for all data transmissions. Generated files are stored on secure servers with restricted access.</p>
        </section>

        <div className="bg-primary/10 border border-primary/20 p-8 rounded-3xl flex items-center gap-6">
           <span className="material-symbols-outlined text-primary text-4xl">gpp_good</span>
           <div>
              <h4 className="font-bold">GDPR Compliant</h4>
              <p className="text-xs text-gray-400">You can request the total deletion of your account and all associated data at any time through your settings panel.</p>
           </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
