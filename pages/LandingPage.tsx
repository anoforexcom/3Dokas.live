
import React, { useState } from 'react';
import { ViewType } from '../App';

interface Props {
  onNavigate: (view: ViewType) => void;
}

const LandingPage: React.FC<Props> = ({ onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [adminClickCount, setAdminClickCount] = useState(0);

  const handleAdminSecret = () => {
    setAdminClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 5) {
        onNavigate('AUTH'); // Navigate to Auth
        // In a real app we might pass a 'forceAdmin' param or similar, 
        // but here relying on the user typing 'admin' in email as per AuthPage logic
        // Or better, let's just trigger the navigate.
        // The AuthPage logic I saw earlier checks "if email includes 'admin' -> login as admin".
        alert("Admin Access Unlocked: Please login with any email containing 'admin' and password 'admin'");
        return 0;
      }
      return newCount;
    });
  };

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleMobileNav = (view: ViewType) => {
    setIsMobileMenuOpen(false);
    onNavigate(view);
  };

  const navLinks = [
    { label: 'How It Works', view: 'HOW_IT_WORKS' as ViewType, icon: 'info' },
    { label: 'Pricing', view: 'PRICING_PAGE' as ViewType, icon: 'payments' },
    { label: 'Gallery', view: 'GALLERY' as ViewType, icon: 'gallery_thumbnail' },
    { label: 'Testimonials', view: 'TESTIMONIALS' as ViewType, icon: 'reviews' },
    { label: 'FAQs', view: 'FAQS' as ViewType, icon: 'help' },
  ];

  const featuredTestimonials = [
    { name: "Sarah Jenkins", role: "Indie Game Developer", text: "The OBJ export quality is insane. Saved me weeks of modeling.", avatar: "https://i.pravatar.cc/150?u=sarah" },
    { name: "Marco Silva", role: "3D Printing Hobbyist", text: "Perfect STL files every time. My printer loves 3dokas.live.", avatar: "https://i.pravatar.cc/150?u=marco" },
    { name: "Elena Rossi", role: "Architect", text: "Visualizing site photos in 3D changed my workflow forever.", avatar: "https://i.pravatar.cc/150?u=elena" },
    { name: "Alex Thompson", role: "3D Artist", text: "The reconstruction accuracy is mind-blowing. Top notch quality.", avatar: "https://i.pravatar.cc/150?u=alex" },
    { name: "Sofia Garcia", role: "Unity Developer", text: "Saved me hundreds of dollars in custom assets. GLB is ready.", avatar: "https://i.pravatar.cc/150?u=sofia" },
  ];

  const homeFaqs = [
    { q: "What is 3dokas.live?", a: "3dokas.live is an AI-powered platform that converts your 2D photos into high-fidelity 3D models. It uses advanced neural networks to reconstruct depth and geometry instantly." },
    { q: "How do I take the best photos for conversion?", a: "For best results, use clear, well-lit photos with a neutral background. Avoid blurred shots and ensure the object is the main focus of the image." },
    { q: "Which file formats are supported for export?", a: "We currently support GLB, OBJ, and STL. These formats are compatible with most 3D software and 3D printing slicers." },
    { q: "Can I use the models for commercial purposes?", a: "Yes, our Studio Pro plan includes a full commercial license for all generated models. Individual and Maker plans are for personal use." },
    { q: "Do credits expire?", a: "No, credits purchased at 3dokas.live never expire. You can use them whenever you need to transform a new photo." }
  ];

  return (
    <div className="flex flex-col w-full bg-background-dark text-white font-display">
      {/* Navbar */}
      <nav className="border-b border-border-dark bg-background-dark/80 backdrop-blur-md sticky top-0 z-[60]">
        <div className="flex justify-center px-4 md:px-10 py-3">
          <header className="flex w-full max-w-[1280px] items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onNavigate('LANDING')}>
              <div className="size-8 text-primary">
                <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "#5b2bee", stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: "#a855f7", stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="url(#grad1)" stroke="#151022" strokeWidth="2" />
                  <path d="M50 5 L50 45 L90 25 M50 45 L10 25 M50 45 L50 95" stroke="#1e1c27" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
              <h2 className="text-xl font-bold tracking-tight">3dokas.live</h2>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
                <button onClick={() => onNavigate('HOW_IT_WORKS')} className="hover:text-white transition-colors">How It Works</button>
                <button onClick={() => onNavigate('PRICING_PAGE')} className="hover:text-white transition-colors">Pricing</button>
                <button onClick={() => onNavigate('GALLERY')} className="hover:text-white transition-colors">Gallery</button>
                <button onClick={() => onNavigate('TESTIMONIALS')} className="hover:text-white transition-colors">Testimonials</button>
                <button onClick={() => onNavigate('FAQS')} className="hover:text-white transition-colors">FAQs</button>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => onNavigate('AUTH')} className="hover:text-primary transition-colors font-medium">Login</button>
                <button
                  onClick={() => onNavigate('EDITOR')}
                  className="bg-primary hover:bg-primary/90 transition-colors px-4 py-2 rounded-lg font-bold shadow-lg shadow-primary/25"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={toggleMenu}
              className="md:hidden size-10 flex items-center justify-center bg-surface-dark border border-border-dark rounded-xl text-white active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-2xl">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </header>
        </div>
      </nav>

      {/* Premium Mobile Side Drawer */}
      <>
        <div
          className={`fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={toggleMenu}
        />
        <div className={`fixed inset-y-0 right-0 z-[80] w-[85%] max-w-sm bg-surface-dark/95 backdrop-blur-2xl border-l border-border-dark shadow-2xl transition-transform duration-500 ease-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full p-8">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-2">
                <div className="size-8">
                  <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#5b2bee", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "#a855f7", stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="url(#grad2)" stroke="#151022" strokeWidth="2" />
                    <path d="M50 5 L50 45 L90 25 M50 45 L10 25 M50 45 L50 95" stroke="#1e1c27" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-xl font-bold tracking-tight">3dokas.live</span>
              </div>
              <button onClick={toggleMenu} className="size-10 flex items-center justify-center rounded-full bg-background-dark border border-border-dark text-gray-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <nav className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
              {navLinks.map((link, idx) => (
                <button
                  key={link.view}
                  onClick={() => handleMobileNav(link.view)}
                  className={`flex items-center gap-5 p-5 rounded-2xl bg-background-dark/50 border border-white/5 hover:border-primary/50 transition-all text-left animate-slide-in`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">{link.icon}</span>
                  </div>
                  <span className="text-lg font-bold tracking-tight">{link.label}</span>
                  <span className="material-symbols-outlined ml-auto text-gray-600">chevron_right</span>
                </button>
              ))}
            </nav>
            <div className="mt-auto space-y-4 pt-10 border-t border-border-dark">
              <button onClick={() => handleMobileNav('AUTH')} className="w-full h-14 border border-border-dark rounded-2xl font-bold text-lg hover:bg-white/5">Login</button>
              <button onClick={() => handleMobileNav('EDITOR')} className="w-full h-14 bg-primary rounded-2xl font-bold text-lg shadow-xl shadow-primary/20">Get Started Free</button>
            </div>
          </div>
        </div>
      </>

      {/* Hero */}
      <section className="flex flex-col items-center py-12 md:py-20 px-4 md:px-10">
        <div className="max-w-[1280px] w-full flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary mr-2 animate-pulse"></span>
              New version 2.0 with professional export
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
              From Photo to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">3D Reality</span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg lg:text-xl max-w-[540px]">
              Instantly convert your favorite 2D images into high-fidelity 3D models. Perfect for 3D printing, game assets, and AR visualization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button onClick={() => onNavigate('EDITOR')} className="h-12 md:h-14 px-8 bg-primary hover:bg-primary/90 transition-all font-bold rounded-xl shadow-xl shadow-primary/30">
                Transform Photo
              </button>
              <button onClick={() => onNavigate('HOW_IT_WORKS')} className="h-12 md:h-14 px-8 border border-border-dark bg-surface-dark hover:bg-border-dark transition-all font-bold rounded-xl">
                How It Works
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 relative group w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative aspect-[4/3] bg-surface-dark rounded-xl overflow-hidden border border-border-dark">
              <img src="/hero-3d.png" alt="3D Visual" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 p-4 bg-background-dark/90 backdrop-blur-sm rounded-lg border border-border-dark flex justify-between items-center scale-90 sm:scale-100">
                <div>
                  <span className="text-[10px] md:text-xs text-gray-400 block uppercase font-black">Status</span>
                  <span className="text-xs md:text-sm font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-400 text-sm">check</span>
                    Complete
                  </span>
                </div>
                <div className="h-8 w-px bg-border-dark"></div>
                <div>
                  <span className="text-[10px] md:text-xs text-gray-400 block uppercase font-black">Polygons</span>
                  <span className="text-xs md:text-sm font-bold">124k</span>
                </div>
                <button className="text-primary hover:text-white transition-colors" onClick={() => onNavigate('AUTH')}>
                  <span className="material-symbols-outlined">download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-20 md:h-40 w-full bg-gradient-to-b from-background-dark via-[#1a1c32] to-[#1e293b]"></div>

      {/* How It Works */}
      <section id="how-it-works" className="bg-[#1e293b] py-12 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 text-center space-y-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-slate-400 mt-2">Three simple steps to materialize your ideas.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Upload your Photo', desc: 'Upload any clear image (JPG or PNG).', icon: 'cloud_upload', step: '1' },
              { title: 'AI Processes', desc: 'Our AI analyzes depth to convert it into 3D.', icon: 'psychology', step: '2' },
              { title: 'Download & Print', desc: 'Export to STL, OBJ, or GLB for your printer.', icon: 'print', step: '3' }
            ].map((s, i) => (
              <div key={i} className="bg-surface-dark p-8 rounded-2xl border border-border-dark text-left relative group hover:border-primary/50 transition-colors cursor-pointer" onClick={() => onNavigate('HOW_IT_WORKS')}>
                <div className="absolute top-4 right-4 text-6xl font-black text-white/5">{s.step}</div>
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined">{s.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Auto-Scrolling (Marquee) Section */}
      <section className="py-20 bg-[#1e293b] overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-bold">Loved by Creators</h2>
              <p className="text-slate-400 mt-2">Join over 50,000 users worldwide.</p>
            </div>
            <button onClick={() => onNavigate('TESTIMONIALS')} className="text-primary font-bold hover:underline flex items-center gap-2">
              Read all 50+ reviews <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Marquee Wrapper */}
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee flex gap-6 whitespace-nowrap py-4">
            {[...featuredTestimonials, ...featuredTestimonials].map((t, i) => (
              <div key={i} className="inline-block w-[350px] bg-surface-dark/50 p-6 rounded-2xl border border-border-dark space-y-4 shrink-0 whitespace-normal">
                <div className="flex items-center gap-4">
                  <img src={t.avatar} className="size-12 rounded-full border-2 border-primary/20" alt={t.name} />
                  <div>
                    <h4 className="font-bold text-sm">{t.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">{t.role}</p>
                  </div>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, j) => <span key={j} className="material-symbols-outlined text-sm">star</span>)}
                </div>
                <p className="text-gray-300 text-sm italic">"{t.text}"</p>
              </div>
            ))}
          </div>

          {/* Pause on hover overlay - optional but helps readability */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#1e293b] via-transparent to-[#1e293b]"></div>
        </div>
      </section>

      {/* Persuasive Why Choose Us Section */}
      <section className="py-20 px-4 md:px-10 bg-[#1e293b]">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">Professional Grade 3D <br /><span className="text-primary">Without the Complexity.</span></h2>
            <p className="text-gray-400 text-lg">
              Manual 3D modeling can take days of meticulous work. 3dokas.live leverages the world's most advanced generative AI to reconstruct geometry from your photos in seconds.
            </p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined">auto_fix_high</span>
                </div>
                <div>
                  <h4 className="font-bold">AI-Powered Precision</h4>
                  <p className="text-sm text-gray-500">Every mesh is optimized for clean topology and realistic surface detail.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined">speed</span>
                </div>
                <div>
                  <h4 className="font-bold">Instant Results</h4>
                  <p className="text-sm text-gray-500">Go from a flat image to a downloadable GLB model in less than 60 seconds.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined">texture</span>
                </div>
                <div>
                  <h4 className="font-bold">4K PBR Texturing</h4>
                  <p className="text-sm text-gray-500">Includes roughness, metallic, and normal maps for professional renders.</p>
                </div>
              </div>
            </div>
            <button onClick={() => onNavigate('EDITOR')} className="h-14 px-10 bg-white text-background-dark font-black uppercase tracking-widest text-xs rounded-xl shadow-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-3 group">
              Try It Now
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative rounded-[2.5rem] border border-border-dark overflow-hidden bg-surface-dark shadow-2xl">
                <img src="/feature-3d.png" className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105" alt="3D Visualization demo" />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent flex items-end p-8">
                  <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-full">
                    <span className="material-symbols-outlined text-primary">view_in_ar</span>
                    <span className="text-xs font-bold">Interactive Preview Active</span>
                    <div className="ml-auto flex gap-1">
                      <div className="size-1.5 rounded-full bg-primary animate-pulse"></div>
                      <div className="size-1.5 rounded-full bg-primary/50"></div>
                      <div className="size-1.5 rounded-full bg-primary/30"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-24 px-4 md:px-10 bg-[#1e293b]">
        <div className="max-w-[1000px] mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-gray-400">Everything you need to know about our technology.</p>
          </div>

          <div className="space-y-4">
            {homeFaqs.map((faq, idx) => (
              <div
                key={idx}
                className={`border rounded-2xl transition-all overflow-hidden ${openFaqIndex === idx ? 'bg-background-dark border-primary/50' : 'bg-surface-dark border-border-dark'}`}
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-bold text-lg">{faq.q}</span>
                  <span className={`material-symbols-outlined transition-transform duration-300 ${openFaqIndex === idx ? 'rotate-180 text-primary' : 'text-gray-500'}`}>
                    keyboard_arrow_down
                  </span>
                </button>
                <div
                  className={`px-6 transition-all duration-300 ease-in-out ${openFaqIndex === idx ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-gray-400 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-8">
            <button onClick={() => onNavigate('FAQS')} className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
              See all 20+ frequently asked questions
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      <div className="h-20 md:h-40 w-full bg-gradient-to-b from-[#1e293b] via-[#1a1c32] to-background-dark"></div>

      {/* Pricing */}
      <section id="pricing" className="py-12 md:py-20 px-4 md:px-10 bg-background-dark">
        <div className="max-w-[1280px] mx-auto text-center space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold">Flexible Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-surface-dark border border-border-dark p-6 md:p-8 rounded-2xl flex flex-col gap-6 text-left">
              <h3 className="font-bold text-lg">Single</h3>
              <p className="text-4xl font-black">€5 <span className="text-sm font-medium text-gray-500">/ 100 credits</span></p>
              <button onClick={() => onNavigate('AUTH')} className="bg-border-dark hover:bg-white hover:text-background-dark transition-colors py-3 rounded-xl font-bold">Get Started</button>
              <ul className="space-y-3 text-sm text-gray-400 pt-4 border-t border-border-dark">
                <li><span className="text-primary mr-2">✓</span> 5 Transformations</li>
                <li><span className="text-primary mr-2">✓</span> Professional Export</li>
              </ul>
            </div>
            <div className="bg-surface-dark border-2 border-primary p-6 md:p-8 rounded-2xl flex flex-col gap-6 text-left relative shadow-2xl shadow-primary/20 scale-100 lg:scale-105">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Most Popular</div>
              <h3 className="font-bold text-lg">Maker Pack</h3>
              <p className="text-4xl font-black">€19 <span className="text-sm font-medium text-gray-500">/ 600 credits</span></p>
              <button onClick={() => onNavigate('AUTH')} className="bg-primary hover:bg-primary/90 transition-colors py-3 rounded-xl font-bold">Buy Pack</button>
              <ul className="space-y-3 text-sm text-gray-300 pt-4 border-t border-border-dark">
                <li><span className="text-primary mr-2">✓</span> 30 Transformations</li>
                <li><span className="text-primary mr-2">✓</span> Priority Queue</li>
                <li><span className="text-primary mr-2">✓</span> HD Formats Included</li>
              </ul>
            </div>
            <div className="bg-surface-dark border border-border-dark p-6 md:p-8 rounded-2xl flex flex-col gap-6 text-left opacity-80 hover:opacity-100 transition-opacity hidden lg:flex">
              <h3 className="font-bold text-lg">Studio</h3>
              <p className="text-4xl font-black">€49 <span className="text-sm font-medium text-gray-500">/ 2000 credits</span></p>
              <button onClick={() => onNavigate('AUTH')} className="bg-border-dark hover:bg-white hover:text-background-dark transition-colors py-3 rounded-xl font-bold">Subscribe Studio</button>
              <ul className="space-y-3 text-sm text-gray-400 pt-4 border-t border-border-dark">
                <li><span className="text-primary mr-2">✓</span> 100 Transformations</li>
                <li><span className="text-primary mr-2">✓</span> 4K Textures</li>
                <li><span className="text-primary mr-2">✓</span> Commercial License</li>
              </ul>
            </div>
          </div>
          <button onClick={() => onNavigate('PRICING_PAGE')} className="text-primary font-bold hover:underline">View all plan details</button>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-10 pb-24">
        <div className="bg-primary/10 border border-primary/20 p-12 rounded-[3rem] text-center space-y-6">
          <h3 className="text-3xl font-bold">Ready to join them?</h3>
          <p className="text-gray-300 max-w-lg mx-auto">Start your 3D transformation journey today with our free trial.</p>
          <button onClick={() => onNavigate('EDITOR')} className="bg-primary hover:bg-primary/90 transition-all px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
            Start Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-dark py-12 px-4 md:px-10 border-t border-border-dark">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between gap-10 opacity-60 text-sm mb-12">
          <div className="max-w-xs cursor-pointer" onClick={() => onNavigate('LANDING')}>
            <h3 className="font-bold text-lg mb-4 text-white">3dokas.live</h3>
            <p>Cutting-edge technology to democratize 3D creation. Transform the digital world into physical.</p>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              <span onClick={handleAdminSecret} className="font-bold mb-2 uppercase text-[10px] tracking-widest text-white opacity-100 select-none cursor-default">Product</span>
              <button onClick={() => onNavigate('GALLERY')} className="text-left hover:text-white transition-colors">Gallery</button>
              <button onClick={() => onNavigate('PRICING_PAGE')} className="text-left hover:text-white transition-colors">Pricing</button>
              <button onClick={() => onNavigate('HOW_IT_WORKS')} className="text-left hover:text-white transition-colors">How It Works</button>
              <button onClick={() => onNavigate('TESTIMONIALS')} className="text-left hover:text-white transition-colors">Testimonials</button>
              <button onClick={() => onNavigate('FAQS')} className="text-left hover:text-white transition-colors">FAQs</button>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold mb-2 uppercase text-[10px] tracking-widest text-white opacity-100">Legal</span>
              <button onClick={() => onNavigate('TERMS')} className="text-left hover:text-white transition-colors">Terms</button>
              <button onClick={() => onNavigate('PRIVACY')} className="text-left hover:text-white transition-colors">Privacy</button>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="max-w-[1280px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Secure Payments via</p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <div className="flex items-center gap-1">
              <span className="text-lg font-black italic tracking-tighter">VISA</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base font-black italic tracking-tight">mastercard</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-primary px-1.5 py-0.5 rounded-sm text-[8px] font-black text-white leading-none">MB</div>
              <span className="text-[10px] font-black tracking-widest">WAY</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="border border-white/40 px-2 py-0.5 rounded text-[8px] font-bold tracking-tight uppercase">Multibanco</div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base font-black italic tracking-tighter text-blue-400">PayPal</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-black tracking-tighter">stripe</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slideIn 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
          opacity: 0;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
