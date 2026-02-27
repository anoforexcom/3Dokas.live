
import React from 'react';
import { useTransformations } from '../context/TransformationContext';

interface Props {
  onBack: () => void;
}

const Gallery: React.FC<Props> = ({ onBack }) => {
  const { transformations } = useTransformations();
  // Only show completed items with a model or image
  const items = transformations.filter(t => t.status === 'completed' || t.imageUrl).map(t => ({
    id: t.id,
    title: t.name || 'Untitled 3D Model',
    author: t.authorName || 'Anonymous',
    image: t.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image',
    modelUrl: t.modelUrl
  }));

  return (
    <div className="min-h-screen bg-background-dark font-display text-white">
      <nav className="border-b border-border-dark bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 group">
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="font-bold">Back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight">Community Gallery</h1>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-[1280px] mx-auto p-6 md:p-10 space-y-10">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-bold">Three-Dimensional Inspiration</h2>
          <p className="text-gray-400 mt-2">See what other creators are transforming using our AI technology.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden group hover:border-primary/50 transition-all">
              <div className="aspect-[3/2] overflow-hidden relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 bg-background-dark/80 backdrop-blur-md text-[10px] font-bold rounded-lg uppercase tracking-widest border border-border-dark">4K Texture</span>
                </div>
              </div>
              <div className="p-5 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.author}</p>
                </div>
                <button className="size-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <span className="material-symbols-outlined text-lg">view_in_ar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Gallery;
