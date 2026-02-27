
import React from 'react';

interface Props {
  onBack: () => void;
}

const testimonialsData = [
  { name: "Alex Thompson", role: "3D Artist", text: "The reconstruction accuracy is mind-blowing. I converted a photo of my dog into a 3D print in under 10 minutes." },
  { name: "Sofia Garcia", role: "Unity Developer", text: "Saved me hundreds of dollars in custom assets. The GLB export is ready for my VR projects immediately." },
  { name: "Marco Vieri", role: "Architect", text: "Using 3dokas.live for site surveys changed the game. I can turn drone shots into workable meshes." },
  { name: "Emily Watson", role: "Hobbyist", text: "I'm not a tech person, but the interface made it so easy. I transformed a vintage vase photo for my sims world!" },
  { name: "David Chen", role: "Product Designer", text: "Rapid prototyping at its best. I go from a sketch to a 3D physical print overnight." },
  { name: "Laura Schmidt", role: "E-commerce Manager", text: "Interactive 3D on our website boosted conversion by 40%. All thanks to 3dokas.live's batch processing." },
  { name: "Kevin Brown", role: "Collector", text: "Digitalizing my collection was my dream. 3dokas.live made it affordable and incredibly fast." },
  { name: "Sita Sharma", role: "Artist", text: "A new tool for my creative arsenal. Sculpting from AI-generated meshes is my new workflow." },
  { name: "Tom Wilson", role: "Gamer", text: "Scanned my own face for a custom character mod. Creepily accurate!" },
  { name: "Julia Petrova", role: "Educator", text: "My students love seeing their drawings come to life in 3D. Great for STEM learning." },
  { name: "Mark Zuckerberg", role: "Metaverse Visionary", text: "The future of the spatial web is built on tools like this. Fast, scalable 3D generation." },
  { name: "Sarah Lee", role: "Museum Curator", text: "We are archiving small artifacts using 3dokas.live. It's safe and non-invasive." },
  { name: "James Bond", role: "Special Agent", text: "The resolution is enough for tactical planning. Don't tell anyone." },
  { name: "Marie Curie", role: "Researcher", text: "Precision matters in my field. 3dokas.live delivers scientific-grade meshes." },
  { name: "Bruce Wayne", role: "Philanthropist", text: "I use it for... prototyping garage equipment. Very efficient." },
  { name: "Diana Prince", role: "Historian", text: "Preserving ancient pottery digitally has never been easier." },
  { name: "Steve Rogers", role: "Artist", text: "Bringing the classic feel of the 40s into 3D. The AI captures textures perfectly." },
  { name: "Tony Stark", role: "Engineer", text: "Better than my first JARVIS prototype. Minimal artifacts, clean geometry." },
  { name: "Peter Parker", role: "Photographer", text: "I take the photos, 3dokas.live does the rest. Amazing depth perception." },
  { name: "Natasha Romanoff", role: "Strategist", text: "Quick deployments require quick 3D mapping. 3dokas.live is the best." },
  { name: "Wanda Maximoff", role: "Creative", text: "It's like magic, but with code. The UI is exceptionally intuitive." },
  { name: "Thor Odinson", role: "Craftsman", text: "Strong as Mjolnir! The OBJ files hold up even in high-stress renders." },
  { name: "Stephen Strange", role: "Surgeon", text: "Anatomical models from simple X-rays? Almost. It's a miracle of AI." },
  { name: "Loki Laufeyson", role: "Deceiver", text: "The illusions are so real. I mean... the models. They are perfect." },
  { name: "Gamora", role: "Warrior", text: "Tough enough for the galaxy. Efficient and no wasted credits." },
  { name: "Rocket", role: "Mechanic", text: "I needed parts. I photographed parts. I printed parts. It works." },
  { name: "Groot", role: "Nature Fan", text: "I am Groot. (Translation: Best 3D software ever)." },
  { name: "Peter Quill", role: "Pilot", text: "Keep the 80s vibes alive in 3D. Awesome tool for my deck." },
  { name: "Clint Barton", role: "Precision Expert", text: "It never misses the mark. Every edge is exactly where it should be." },
  { name: "Sam Wilson", role: "Avian Specialist", text: "Mapping flight paths in 3D is a breeze now. Great support team too." },
  { name: "Bucky Barnes", role: "Historian", text: "Old school meets new tech. I'm impressed by the speed." },
  { name: "Scott Lang", role: "Tiny Creator", text: "Even the smallest details are captured. Perfect for my macro photography." },
  { name: "Hope Van Dyne", role: "Scientist", text: "Scale is accurate. That's the most important thing for my lab." },
  { name: "T'Challa", role: "King", text: "Wakanda-level technology for everyone. A noble achievement." },
  { name: "Shuri", role: "Genius", text: "The neural network architecture here is actually quite clever." },
  { name: "Erik Killmonger", role: "Revolutionary", text: "Challenging the status quo of 3D modeling. I respect that." },
  { name: "Carol Danvers", role: "Pilot", text: "Higher, further, faster. The processing speed is light-years ahead." },
  { name: "Nick Fury", role: "Director", text: "I have my eye on this tool. Secure and reliable data processing." },
  { name: "Maria Hill", role: "Ops Lead", text: "Streamlined my entire asset pipeline. Zero downtime." },
  { name: "Phil Coulson", role: "Agent", text: "I collect rare cards. Now I have them in 3D too!" },
  { name: "Matt Murdock", role: "Lawyer", text: "Justice for creators. Fair pricing and clear terms." },
  { name: "Jessica Jones", role: "Investigator", text: "I need results fast. 3dokas.live doesn't ask questions, it just delivers." },
  { name: "Luke Cage", role: "Community Leader", text: "Building the neighborhood in 3D. Solid as a rock." },
  { name: "Danny Rand", role: "Entrepreneur", text: "The ROI on the Studio Plan is incredible. Worth every credit." },
  { name: "Frank Castle", role: "Tactician", text: "One shot, one model. It's a precise instrument for 3D work." },
  { name: "Karen Page", role: "Journalist", text: "The truth is in the detail. And 3dokas.live has plenty of it." },
  { name: "Foggy Nelson", role: "Partner", text: "Legally speaking, it's the best service I've used. No hidden fees." },
  { name: "Wilson Fisk", role: "Collector", text: "A masterpiece of engineering. I only want the best for my city." },
  { name: "Miles Morales", role: "Student", text: "So cool! I turned my sneakers into 3D models for my art class." },
  { name: "Gwen Stacy", role: "Musician", text: "The flow of the UI is like a good beat. Really responsive." }
];

const Testimonials: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-background-dark font-display text-white">
      <nav className="border-b border-border-dark bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 group">
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="font-bold">Back to Home</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight">Wall of Love</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-[1280px] mx-auto p-6 md:p-12 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Trusted by 50,000+ Creators</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From professional game studios to independent makers, 3dokas.live is the tool of choice for high-fidelity 3D transformation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {testimonialsData.map((t, i) => (
            <div 
              key={i} 
              className="bg-surface-dark border border-border-dark p-6 rounded-2xl hover:border-primary/50 transition-all group animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${(i % 12) * 50}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{t.name}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-primary transition-colors">{t.role}</p>
                </div>
              </div>
              <div className="flex text-yellow-500 mb-3">
                {[...Array(5)].map((_, j) => <span key={j} className="material-symbols-outlined text-[14px]">star</span>)}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed italic">"{t.text}"</p>
            </div>
          ))}
        </div>

        <section className="bg-primary/10 border border-primary/20 p-12 rounded-[3rem] text-center space-y-6">
          <h3 className="text-3xl font-bold">Ready to join them?</h3>
          <p className="text-gray-300 max-w-lg mx-auto">Start your 3D transformation journey today with our free trial.</p>
          <button onClick={onBack} className="bg-primary hover:bg-primary/90 transition-all px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">
            Start Now
          </button>
        </section>
      </main>
    </div>
  );
};

export default Testimonials;
