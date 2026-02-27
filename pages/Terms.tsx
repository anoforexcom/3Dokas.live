
import React from 'react';

interface Props {
  onBack: () => void;
}

const Terms: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-background-dark font-display text-white">
      <nav className="border-b border-border-dark bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 group">
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="font-bold">Back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight">Terms of Service</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto p-10 md:p-20 space-y-12 leading-relaxed text-gray-300">
        <section className="space-y-4">
          <h2 className="text-4xl font-bold text-white tracking-tight">1. Acceptance of Terms</h2>
          <p>By accessing and using 3dokas.live, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use our platform.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-4xl font-bold text-white tracking-tight">2. Use of AI Technology</h2>
          <p>3dokas.live uses proprietary artificial intelligence algorithms to process images. The user acknowledges that results may vary depending on the quality of the provided image, and we do not guarantee 100% absolute precision in all reconstructions.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-4xl font-bold text-white tracking-tight">3. Intellectual Property</h2>
          <p>The user retains full ownership of the original images they upload. 3dokas.live grants the user a worldwide license to use, download, and print the generated 3D models for personal (or commercial, depending on the subscribed plan) purposes.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-4xl font-bold text-white tracking-tight">4. Payments and Credits</h2>
          <p>Credit purchases are final and non-refundable, except in cases of proven technical failure in processing that does not result in a generated model. We reserve the right to change prices without prior notice.</p>
        </section>

        <section className="bg-surface-dark p-8 rounded-3xl border border-border-dark text-sm text-gray-500 italic">
          Last updated: May 24, 2024. Continued use of the platform after changes to these terms constitutes acceptance of the new conditions.
        </section>
      </main>
    </div>
  );
};

export default Terms;
