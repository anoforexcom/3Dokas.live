import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, BrightnessContrast, HueSaturation } from '@react-three/postprocessing';
import { User } from '../types';
import Sidebar from '../components/Sidebar';
import { useTransformations } from '../context/TransformationContext';
import { storage } from '../lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import ErrorBoundary from '../components/ErrorBoundary';

interface Props {
  user: User | null;
  onNavigate: (view: string) => void;
  logout: () => void;
}

interface BatchItem {
  id: string;
  name: string;
  url: string; // Blob URL for preview
  base64?: string; // For API
  status: 'PENDING' | 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
  progress: number;
  resultUrl?: string; // The GLB output
  errorMsg?: string;
  predictionId?: string;
  debugStatus?: string;
}

const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

import { useProgress, Html } from '@react-three/drei';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4 text-white">
        <div className="size-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest">Rendering 3D Model</p>
          <p className="text-[10px] font-mono opacity-70">{progress.toFixed(0)}% loaded</p>
        </div>
      </div>
    </Html>
  );
}

const Editor: React.FC<Props> = ({ user, onNavigate, logout }) => {
  const { addTransformation } = useTransformations();
  // --- UI State ---
  const [step, setStep] = useState<'UPLOAD' | 'PREVIEW'>('UPLOAD');
  const [selectedFiles, setSelectedFiles] = useState<BatchItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Model Configuration State (Trellis) ---
  const [ssSamplingSteps, setSsSamplingSteps] = useState(12);
  const [ssGuidanceStrength, setSsGuidanceStrength] = useState(7.5);
  const [slatSamplingSteps, setSlatSamplingSteps] = useState(12);
  const [slatGuidanceStrength, setSlatGuidanceStrength] = useState(3.0);
  const [meshSimplify, setMeshSimplify] = useState(0.95);
  const [textureSize, setTextureSize] = useState(1024);

  // --- Post-Processing State ---
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [bloomIntensity, setBloomIntensity] = useState(0);

  const [optimization, setOptimization] = useState<'QUALITY' | 'SPEED'>('QUALITY');

  const COST_PER_MODEL = 20;
  const totalCost = selectedFiles.length * COST_PER_MODEL;
  // Guest has "unlimited" usage for preview, but cannot download without account (where credits apply).
  // Realistically, we might want to limit guests to 1 or 2 demos or CAPTCHA?
  // For now, assuming "Try-Before-You-Buy" allows generating to see result.
  const hasEnoughCredits = user ? user.credits >= totalCost : true;

  // --- Helpers ---
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles: BatchItem[] = [];
      const files = Array.from(e.target.files) as File[];
      for (const file of files) {
        const base64 = await fileToBase64(file);
        newFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: URL.createObjectURL(file), // Keep blob for local preview
          base64: base64,
          status: 'PENDING',
          progress: 0
        });
      }
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFileStatus = (index: number, updates: Partial<BatchItem>) => {
    setSelectedFiles(prev => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  // --- API Logic ---
  const startTransform = async () => {
    if (selectedFiles.length === 0 || !hasEnoughCredits) return;
    setIsProcessing(true);

    const filesToProcess = [...selectedFiles];

    // Process sequentially to be safe with state/rate limits
    for (let i = 0; i < filesToProcess.length; i++) {
      if (filesToProcess[i].status === 'COMPLETED') continue;

      setCurrentTaskIndex(i);
      updateFileStatus(i, { status: 'UPLOADING', progress: 10 });

      try {
        // 1. Create Prediction (using 'fire/trellis' - User Provided Version)
        // Use dynamic model resolution via backend
        // 1. Create Prediction
        const model = optimization === 'QUALITY' ? "firtoz/trellis" : "tencent/hunyuan3d-2";

        const input = optimization === 'QUALITY' ? {
          images: [filesToProcess[i].base64!],
          ss_sampling_steps: ssSamplingSteps,
          ss_guidance_strength: ssGuidanceStrength,
          slat_sampling_steps: slatSamplingSteps,
          slat_guidance_strength: slatGuidanceStrength,
          mesh_simplify: meshSimplify,
          texture_size: textureSize,
          generate_model: true
        } : {
          image: filesToProcess[i].base64!,
          steps: 20, // Minimum allowed by API
          guidance_scale: 3.0
        };

        const response = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: model, // Send model name, backend will find latest version
            input: input
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Replicate API Error:", response.status, errorText);
          throw new Error(`Failed to start generation (${response.status}): ${errorText}`);
        }
        const prediction = await response.json();

        updateFileStatus(i, { status: 'PROCESSING', progress: 20, predictionId: prediction.id });

        // 2. Poll for Status with Timeout
        const POLL_TIMEOUT = 180000; // 3 minutes
        const startTime = Date.now();
        let finalResultUrl = null;

        while (true) {
          if (Date.now() - startTime > POLL_TIMEOUT) {
            throw new Error("Generation timed out. Please try again.");
          }

          await new Promise(r => setTimeout(r, 2000)); // Poll every 2s

          // Anti-caching timestamp
          const checkRes = await fetch(`/api/predict?id=${prediction.id}&t=${Date.now()}`, {
            cache: 'no-store',
            headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
          });
          const statusData = await checkRes.json();
          console.log("Replicate Poll Status:", statusData.status, statusData); // DEBUG LOG

          // Update debug status for UI
          updateFileStatus(i, { debugStatus: statusData.status });

          if (statusData.status === 'succeeded') {
            // Robustly find the .glb URL in any structure
            const findGlb = (obj: any): string | null => {
              if (typeof obj === 'string') {
                return obj.toLowerCase().endsWith('.glb') ? obj : null;
              }
              if (Array.isArray(obj)) {
                for (const item of obj) {
                  const res = findGlb(item);
                  if (res) return res;
                }
                if (obj.length > 0 && typeof obj[0] === 'string') return obj[0];
              }
              if (obj && typeof obj === 'object') {
                // Priority keys
                const priority = obj.mesh || obj.model_file || obj.glb;
                if (priority && typeof priority === 'string') return priority;

                for (const val of Object.values(obj)) {
                  const res = findGlb(val);
                  if (res) return res;
                }
              }
              return null;
            };

            finalResultUrl = findGlb(statusData.output);

            if (!finalResultUrl) {
              console.error("Output missing or invalid format:", statusData);
              throw new Error(`Generation succeeded but no .glb found in: ${JSON.stringify(statusData.output)}`);
            }

            console.log("Final Model URL:", finalResultUrl); // DEBUG LOG FOR USER
            updateFileStatus(i, { status: 'COMPLETED', progress: 100, resultUrl: finalResultUrl });

            // Upload Image to Firebase Storage for persistence
            let permanentImageUrl = filesToProcess[i].url;
            if (filesToProcess[i].base64) {
              try {
                const imageRef = ref(storage, `transformations/${prediction.id}/input_image`);
                await uploadString(imageRef, filesToProcess[i].base64!, 'data_url');
                permanentImageUrl = await getDownloadURL(imageRef);
              } catch (uploadError) {
                console.error("Failed to upload image to storage:", uploadError);
              }
            }

            // Add to global context for Gallery and Dashboard
            addTransformation({
              id: prediction.id || Math.random().toString(36),
              userId: user ? user.id : 'guest',
              name: filesToProcess[i].name,
              prompt: `Using trellis model v1`,
              imageUrl: permanentImageUrl,
              modelUrl: finalResultUrl,
              status: 'completed',
              date: new Date().toISOString(),
              authorName: user ? user.name : 'Guest'
            });

            break;
          } else if (statusData.status === 'failed' || statusData.status === 'canceled') {
            throw new Error(statusData.error || "Generation failed");
          } else {
            // Update progress if available
            updateFileStatus(i, { status: 'PROCESSING', progress: 30 + Math.random() * 50 });
          }
        }

      } catch (error: any) {
        console.error(error);
        updateFileStatus(i, { status: 'ERROR', progress: 0, errorMsg: error.message });
      }
    }

    setIsProcessing(false);
    setStep('PREVIEW');
  };

  const getProcessingPhase = (progress: number) => {
    if (progress < 20) return "Uploading...";
    if (progress < 50) return "Reconstructing Geometry...";
    if (progress < 80) return "Refining & Texturing...";
    return "Finalizing...";
  };

  return (
    <div className="flex h-screen bg-background-dark font-display text-white">
      {user && <Sidebar user={user} current="EDITOR" onNavigate={onNavigate} logout={logout} />}

      <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                <span className="text-primary">New Project</span>
                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                <span className="text-white">3dokas.live Editor 3D</span>
              </nav>
              <h2 className="text-4xl font-bold tracking-tight">
                {step === 'UPLOAD' ? 'Create New 3D Asset' : 'Generation Results'}
              </h2>
            </div>
          </div>

          {step === 'UPLOAD' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Left Column: Upload & Queue */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-surface-dark rounded-[2.5rem] border border-border-dark overflow-hidden flex flex-col min-h-[500px] shadow-2xl relative">
                  <div className="p-8 border-b border-border-dark flex justify-between items-center bg-white/5">
                    <h3 className="font-bold flex items-center gap-3 text-sm">
                      <span className="material-symbols-outlined text-primary">imagesmode</span>
                      Import Images
                    </h3>
                  </div>

                  <div className="p-8 flex-1">
                    {isProcessing ? (
                      <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in fade-in">
                        <div className="size-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                        <div className="text-center space-y-2">
                          <h4 className="text-xl font-bold">
                            {optimization === 'SPEED' ? 'Turbo Generation Active' : 'Generating 3D Asset'}
                          </h4>
                          <p className="text-sm text-gray-400 max-w-xs mx-auto">
                            {optimization === 'SPEED'
                              ? "Turbo AI is generating your model in ultra-fast mode. This usually takes 15-30 seconds."
                              : "AI is interpreting geometry from your image. This usually takes 3-5 minutes for maximum quality."}
                          </p>
                          <div className="inline-block px-4 py-1 bg-surface-dark border border-border-dark rounded-full text-xs font-mono text-primary mt-4">
                            {getProcessingPhase(selectedFiles[currentTaskIndex]?.progress || 0)}
                            <br />
                            <span className="opacity-50 text-[10px]">
                              Status: {selectedFiles[currentTaskIndex]?.debugStatus || 'Initializing'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {selectedFiles.length === 0 ? (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="h-full border-2 border-dashed border-border-dark rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all group"
                          >
                            <div className="size-20 rounded-full bg-surface-dark flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                              <span className="material-symbols-outlined text-4xl text-gray-400 group-hover:text-primary transition-colors">add_photo_alternate</span>
                            </div>
                            <div className="text-center">
                              <p className="font-bold text-lg">Click to Upload Image</p>
                              <p className="text-sm text-gray-500">Supports PNG, JPG (High contrast works best)</p>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {selectedFiles.map((file, idx) => (
                              <div key={file.id} className="relative aspect-square bg-black/20 rounded-xl overflow-hidden group border border-border-dark">
                                <img src={file.url} className="w-full h-full object-cover" />
                                <button
                                  onClick={() => removeFile(file.id)}
                                  className="absolute top-2 right-2 size-8 bg-red-500/80 rounded-lg text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <span className="material-symbols-outlined text-xs">close</span>
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="aspect-square border-2 border-dashed border-border-dark rounded-xl flex items-center justify-center hover:bg-white/5 text-gray-500 hover:text-primary transition-colors"
                            >
                              <span className="material-symbols-outlined text-2xl">add</span>
                            </button>
                          </div>
                        )}
                      </>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>
                </div>
              </div>

              {/* Right Column: Settings */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-surface-dark border border-border-dark rounded-[2.5rem] overflow-hidden shadow-xl">
                  <div className="p-6 border-b border-border-dark bg-white/5 font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">tune</span>
                    Generation Settings
                  </div>

                  <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {/* Optimization Toggle */}
                    <div className="bg-black/40 p-1 rounded-2xl flex gap-1">
                      <button
                        onClick={() => setOptimization('QUALITY')}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${optimization === 'QUALITY' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                      >
                        HQ (Standard)
                      </button>
                      <button
                        onClick={() => setOptimization('SPEED')}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${optimization === 'SPEED' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                      >
                        Turbo (Ultra Fast)
                      </button>
                    </div>

                    <div className="h-px bg-border-dark opacity-50"></div>

                    {/* Quality/Sampling (Only show for Quality mode or show different for Speed?) */}
                    {/* For now, we'll keep them visible but Turbo ignores most of them */}

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <label className="text-xs font-bold text-gray-400">Structure Steps</label>
                        <span className="text-xs font-mono text-primary">{ssSamplingSteps}</span>
                      </div>
                      <input type="range" min="10" max="50" value={ssSamplingSteps} onChange={e => setSsSamplingSteps(Number(e.target.value))} className="w-full accent-primary h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <label className="text-xs font-bold text-gray-400">Structure Guidance</label>
                        <span className="text-xs font-mono text-primary">{ssGuidanceStrength}</span>
                      </div>
                      <input type="range" min="0" max="10" step="0.1" value={ssGuidanceStrength} onChange={e => setSsGuidanceStrength(Number(e.target.value))} className="w-full accent-primary h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <label className="text-xs font-bold text-gray-400">Latent Steps</label>
                        <span className="text-xs font-mono text-primary">{slatSamplingSteps}</span>
                      </div>
                      <input type="range" min="10" max="50" value={slatSamplingSteps} onChange={e => setSlatSamplingSteps(Number(e.target.value))} className="w-full accent-primary h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <label className="text-xs font-bold text-gray-400">Simplify Mesh</label>
                        <span className="text-xs font-mono text-primary">{meshSimplify}</span>
                      </div>
                      <input type="range" min="0.90" max="0.99" step="0.01" value={meshSimplify} onChange={e => setMeshSimplify(Number(e.target.value))} className="w-full accent-primary h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-400 block">Texture Size</label>
                      <select
                        value={textureSize}
                        onChange={e => setTextureSize(Number(e.target.value))}
                        className="w-full bg-black/20 border border-border-dark rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                      >
                        <option value={512}>512px (Fast)</option>
                        <option value={1024}>1024px (Standard)</option>
                        <option value={2048}>2048px (High Res)</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-6 border-t border-border-dark bg-background-dark/50">
                    <div className="flex justify-between items-center mb-4 text-sm">
                      <span className="text-gray-400">Estimated Cost</span>
                      <span className="font-bold text-white">{selectedFiles.length * COST_PER_MODEL} Credits</span>
                    </div>
                    <button
                      onClick={startTransform}
                      disabled={selectedFiles.length === 0 || isProcessing || !hasEnoughCredits}
                      className="w-full py-4 bg-primary rounded-xl font-bold uppercase tracking-wider text-xs hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      {isProcessing ? 'Processing...' : 'Generate 3D Assets'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            // PREVIEW MODE
            <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-surface-dark border border-border-dark rounded-[2.5rem] p-10 min-h-[60vh] flex flex-col items-center justify-center text-center">

                {selectedFiles[previewIndex].status === 'COMPLETED' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-7xl mx-auto text-left">
                    {/* Left: Canvas */}
                    <div className="lg:col-span-8 h-[60vh] bg-gradient-to-br from-primary/50 to-surface-dark rounded-3xl overflow-hidden relative border border-primary/30 shadow-2xl backdrop-blur-sm">
                      <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
                        <Suspense fallback={<Loader />}>
                          <Stage environment="city" intensity={0.6}>
                            <Model url={selectedFiles[previewIndex].resultUrl!} />
                          </Stage>
                          <EffectComposer>
                            <BrightnessContrast brightness={brightness} contrast={contrast} />
                            <HueSaturation saturation={saturation} hue={0} />
                            <Bloom intensity={bloomIntensity} luminanceThreshold={0.9} luminanceSmoothing={0.025} />
                          </EffectComposer>
                        </Suspense>
                        <OrbitControls autoRotate />
                      </Canvas>

                      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                        <span className="px-4 py-2 bg-black/50 rounded-full text-xs text-white/70 backdrop-blur-md">
                          Drag to Rotate • Scroll to Zoom
                        </span>
                      </div>
                    </div>

                    {/* Right: Filters & Download */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="bg-surface-dark border border-border-dark rounded-[2.5rem] overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-border-dark bg-white/5 font-bold flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-sm">tune</span>
                          Visual Filters
                        </div>
                        <div className="p-6 space-y-6">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <label className="text-xs font-bold text-gray-400">Brightness</label>
                              <span className="text-xs font-mono text-primary">{brightness.toFixed(2)}</span>
                            </div>
                            <input type="range" min="-0.5" max="0.5" step="0.05" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full accent-primary h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <label className="text-xs font-bold text-gray-400">Contrast</label>
                              <span className="text-xs font-mono text-primary">{contrast.toFixed(2)}</span>
                            </div>
                            <input type="range" min="-0.5" max="0.5" step="0.05" value={contrast} onChange={e => setContrast(Number(e.target.value))} className="w-full accent-primary h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <label className="text-xs font-bold text-gray-400">Saturation</label>
                              <span className="text-xs font-mono text-primary">{saturation.toFixed(2)}</span>
                            </div>
                            <input type="range" min="-1" max="1" step="0.1" value={saturation} onChange={e => setSaturation(Number(e.target.value))} className="w-full accent-primary h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <label className="text-xs font-bold text-gray-400">Bloom</label>
                              <span className="text-xs font-mono text-primary">{bloomIntensity.toFixed(2)}</span>
                            </div>
                            <input type="range" min="0" max="2" step="0.1" value={bloomIntensity} onChange={e => setBloomIntensity(Number(e.target.value))} className="w-full accent-primary h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                          </div>
                        </div>
                        <div className="p-6 border-t border-border-dark bg-background-dark/50">
                          <button
                            onClick={() => {
                              if (!user) {
                                alert("Please create an account to download your 3D models.");
                                onNavigate('AUTH'); // Or specifically to Register
                              } else {
                                window.open(selectedFiles[previewIndex].resultUrl, '_blank');
                              }
                            }}
                            className="w-full py-4 bg-primary rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                          >
                            <span className="material-symbols-outlined text-lg">download</span>
                            {user ? 'Download GLB' : 'Login to Download'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-400 space-y-4">
                    <p>{selectedFiles[previewIndex].errorMsg || "Unknown error occurred"}</p>
                  </div>
                )}

                <button
                  onClick={() => { setSelectedFiles([]); setStep('UPLOAD'); }}
                  className="mt-12 text-gray-500 hover:text-white underline text-sm"
                >
                  Start New Batch
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Editor;
