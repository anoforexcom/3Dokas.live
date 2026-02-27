
import React, { useState } from 'react';

interface Props {
  onBack: () => void;
}

const allFaqs = [
  { q: "What is 3dokas.live?", a: "3dokas.live is an AI-powered platform that converts your 2D photos into high-fidelity 3D models. It uses advanced neural networks to reconstruct depth and geometry instantly." },
  { q: "How do I take the best photos for conversion?", a: "For best results, use clear, well-lit photos with a neutral background. Avoid blurred shots and ensure the object is the main focus of the image." },
  { q: "Which file formats are supported for export?", a: "We currently support GLB, OBJ, and STL. These formats are compatible with most 3D software and 3D printing slicers." },
  { q: "Can I use the models for commercial purposes?", a: "Yes, our Studio Pro plan includes a full commercial license for all generated models. Individual and Maker plans are for personal use." },
  { q: "Do credits expire?", a: "No, credits purchased at 3dokas.live never expire. You can use them whenever you need to transform a new photo." },
  { q: "How long does a transformation take?", a: "Most transformations take between 30 and 60 seconds. Larger batches might take slightly longer depending on the resolution selected." },
  { q: "Do I need a 3D printer to use 3dokas.live?", a: "Not at all! You can use our models for digital art, gaming, VR/AR projects, or simply as interactive 3D elements on websites." },
  { q: "What is the polycount of the generated models?", a: "Depending on your detail settings, polycounts typically range from 50k for drafts to over 500k for Ultra HD models." },
  { q: "Can I edit the generated models in other software?", a: "Yes, you can import our OBJ files into Blender, Maya, ZBrush, or any other standard 3D modeling software for further refinement." },
  { q: "Are textures included in the export?", a: "Yes, our models include high-resolution textures (up to 4K on Pro plans) including Albedo, Normal, and Metallic maps." },
  { q: "What happens if a transformation fails?", a: "If a transformation fails due to technical reasons, the credit will be automatically refunded to your account balance." },
  { q: "Can I process multiple images at once?", a: "Yes, our Batch Editor allows you to upload and process several images simultaneously to save time." },
  { q: "Is there a mobile app?", a: "Currently, 3dokas.live is a web-based platform optimized for desktop and mobile browsers. A native mobile app is in our roadmap." },
  { q: "What is the difference between plans?", a: "Plans differ in resolution quality, texture detail, export formats, and licensing rights. Check our pricing page for a full comparison." },
  { q: "Is my data secure?", a: "We use bank-level encryption for all data transmissions. Your images are only used for your transformations and are never sold to third parties." },
  { q: "Can I request a custom API integration?", a: "Yes, we offer enterprise API solutions for high-volume needs. Please contact our support for custom pricing." },
  { q: "Do you support video-to-3D conversion?", a: "Currently, we specialize in image-to-3D. We are researching video-based reconstruction for future updates." },
  { q: "Can I 3D print the models directly?", a: "Our STL exports are manifold and optimized for slicing software, making them ready for direct 3D printing." },
  { q: "What is the maximum file size for uploads?", a: "We support image uploads up to 25MB per file for standard users and up to 100MB for Studio Pro users." },
  { q: "How do I delete my account and data?", a: "You can request account deletion at any time through your profile settings. All your data and models will be permanently wiped." }
];

const Faqs: React.FC<Props> = ({ onBack }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background-dark font-display text-white">
      <nav className="border-b border-border-dark bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 group">
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="font-bold">Back to Home</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight">Full Help Center</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-[800px] mx-auto p-6 md:p-12 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">All your questions answered</h2>
          <p className="text-gray-400 text-lg">Find deep technical insights and platform information here.</p>
        </div>

        <div className="space-y-4">
          {allFaqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`border rounded-2xl transition-all overflow-hidden ${openIndex === idx ? 'bg-surface-dark border-primary/50' : 'bg-surface-dark border-border-dark'}`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-bold text-lg">{faq.q}</span>
                <span className={`material-symbols-outlined transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-primary' : 'text-gray-500'}`}>
                  keyboard_arrow_down
                </span>
              </button>
              <div 
                className={`px-6 transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="bg-primary/10 border border-primary/20 p-12 rounded-[3rem] text-center space-y-6">
          <h3 className="text-2xl font-bold">Still have questions?</h3>
          <p className="text-gray-300">Our support team is available 24/7 to help you with your 3D journey.</p>
          <button className="bg-primary hover:bg-primary/90 transition-all px-8 py-3 rounded-xl font-bold">
            Contact Support
          </button>
        </section>
      </main>
    </div>
  );
};

export default Faqs;
