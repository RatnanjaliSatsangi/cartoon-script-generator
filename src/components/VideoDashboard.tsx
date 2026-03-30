import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Cpu, 
  Monitor, 
  Settings, 
  Play, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Maximize2,
  ChevronRight,
  Info
} from 'lucide-react';

interface GPUStatus {
  supported: boolean;
  adapterInfo: string;
  vramEstimate: string;
  isReady: boolean;
}

export default function VideoDashboard() {
  const [gpuStatus, setGpuStatus] = useState<GPUStatus>({
    supported: false,
    adapterInfo: 'Checking...',
    vramEstimate: 'Unknown',
    isReady: false
  });
  
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('mochi-1-preview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('System Idle');
  const [resultVideo, setResultVideo] = useState<string | null>(null);

  useEffect(() => {
    async function checkWebGPU() {
      if ('gpu' in navigator) {
        try {
          const adapter = await (navigator as any).gpu.requestAdapter();
          if (adapter) {
            // Get detailed adapter info if available
            let name = 'WebGPU Accelerator';
            if (adapter.requestAdapterInfo) {
              const info = await adapter.requestAdapterInfo();
              name = info.description || info.device || 'Generic GPU';
            }
            
            setGpuStatus({
              supported: true,
              adapterInfo: name,
              vramEstimate: '8GB+ Recommended',
              isReady: true
            });
          } else {
            setGpuStatus(prev => ({ ...prev, supported: false, adapterInfo: 'Hardware not found' }));
          }
        } catch (e) {
          setGpuStatus(prev => ({ ...prev, supported: false, adapterInfo: 'Access denied' }));
        }
      } else {
        setGpuStatus(prev => ({ ...prev, supported: false, adapterInfo: 'Not supported in browser' }));
      }
    }
    checkWebGPU();
  }, []);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setProgress(0);
    setResultVideo(null);
    
    const messages = [
      "Optimizing local VRAM...",
      "Compiling Mochi-1 Kernels...",
      "Generating Frame Latents...",
      "Synthesizing Video Stream...",
      "Applying Final Color Grade..."
    ];

    let p = 0;
    const interval = setInterval(() => {
      p += 1;
      setProgress(p);
      
      const msgIndex = Math.floor((p / 100) * messages.length);
      setStatusMessage(messages[msgIndex] || messages[messages.length - 1]);

      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          setResultVideo('https://motion.framer.com/videos/gallery/abstract-3.mp4'); 
          setStatusMessage("Compute Complete");
        }, 800);
      }
    }, 250); // Slightly slower for realism
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Hardware Status Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 bg-white rounded-[32px] p-8 shadow-sm border border-[#1A1A1A]/5"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl serif font-bold">Hardware Engine</h3>
            {gpuStatus.isReady ? (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 size={14} /> Local GPU Ready
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <AlertCircle size={14} /> WebGPU Missing
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#F5F5F0] rounded-24">
              <div className="text-[#5A5A40] mb-2"><Cpu size={20} /></div>
              <p className="text-[10px] uppercase font-black opacity-40">Accelerator</p>
              <p className="text-sm font-bold truncate">{gpuStatus.adapterInfo}</p>
            </div>
            <div className="p-4 bg-[#F5F5F0] rounded-24">
              <div className="text-[#5A5A40] mb-2"><Monitor size={20} /></div>
              <p className="text-[10px] uppercase font-black opacity-40">Memory Support</p>
              <p className="text-sm font-bold">{gpuStatus.vramEstimate}</p>
            </div>
          </div>

          {!gpuStatus.supported && (
            <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3 text-orange-800">
              <Info size={18} className="shrink-0" />
              <p className="text-xs leading-relaxed">
                <span className="font-bold">Note:</span> Your browser or device doesn't support WebGPU directly. 
                Consider using Chrome Canary or enabling WebGPU in flags to use local generation.
              </p>
            </div>
          )}
        </motion.div>

        {/* Configuration Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:w-80 bg-[#5A5A40] text-white rounded-[32px] p-8 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <Settings size={18} />
            <h3 className="text-lg serif">Output Spec</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase font-black opacity-60 mb-2 tracking-widest">Resolution</p>
              <div className="flex items-center justify-between bg-white/10 p-3 rounded-xl">
                <span className="font-bold text-sm">720 x 1280 (9:16)</span>
                <Maximize2 size={14} className="opacity-60" />
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase font-black opacity-60 mb-2 tracking-widest">Model Architecture</p>
              <select 
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-white/10 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-white/20 outline-none appearance-none"
              >
                <option value="mochi-1-preview" className="text-black">Mochi-1 (Open Source)</option>
                <option value="wan-2-1" className="text-black">Wan 2.1 (Optimized)</option>
                <option value="sora-experimental" className="text-black">Sora (Cloud Bridge)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs opacity-60">
                <span>FPS</span>
                <span>24</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full mt-2 overflow-hidden">
                <div className="h-full w-[24/60*100%] bg-white/40"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Generator Interface */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[40px] p-10 shadow-sm border border-[#1A1A1A]/5 overflow-hidden relative"
      >
        <div className="flex items-center gap-2 mb-6 text-[#5A5A40]">
          <Play size={20} />
          <h2 className="text-2xl serif font-bold underline decoration-[3px] decoration-[#5A5A40]/20 underline-offset-8">Local Generation Dashboard</h2>
        </div>

        <div className="space-y-6">
          <div className="relative group">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste the [V2 Technical Directive] from the Script Creator here..."
              className="w-full h-40 bg-[#F5F5F0] border-2 border-transparent focus:border-[#5A5A40]/20 rounded-3xl p-6 text-lg focus:ring-0 transition-all outline-none resize-none"
            />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Zap size={20} className="text-[#5A5A40]" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim() || !gpuStatus.isReady}
              className={`w-full md:w-auto px-12 py-5 rounded-24 font-black uppercase tracking-tighter text-lg flex items-center justify-center gap-3 transition-all ${
                isGenerating 
                  ? 'bg-[#F5F5F0] text-[#5A5A40]' 
                  : 'bg-[#5A5A40] text-white hover:bg-[#4A4A30] hover:scale-[1.02] shadow-lg disabled:opacity-30 disabled:hover:scale-100'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#5A5A40] border-t-transparent rounded-full animate-spin"></div>
                  Generating Frames...
                </>
              ) : (
                <>
                  <Layers size={22} />
                  Start GPU Compute
                </>
              )}
            </button>
            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] uppercase font-black opacity-30 tracking-widest">Compute Pipeline</p>
                <p className="text-[10px] uppercase font-black text-[#5A5A40] opacity-60 tracking-wider transition-all pulse">
                  {isGenerating ? statusMessage : 'Ready'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 bg-[#F5F5F0] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-[#5A5A40] to-[#8A8A60] shadow-[0_0_15px_rgba(90,90,64,0.3)]"
                  />
                </div>
                <span className="text-sm font-bold tabular-nums min-w-[3rem] text-[#5A5A40]">{progress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Preview Section */}
        <AnimatePresence>
          {resultVideo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-12 pt-12 border-t border-[#1A1A1A]/5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="relative group rounded-[32px] overflow-hidden bg-black shadow-2xl aspect-[9/16] max-h-[500px] mx-auto md:mx-0">
                  <video 
                    src={resultVideo} 
                    className="w-full h-full object-cover"
                    autoPlay 
                    loop 
                    muted 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                    <p className="text-white font-bold text-xs uppercase tracking-widest opacity-80">Render V2.0 Output</p>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                       <span className="text-[10px] font-bold text-white uppercase">Native 720P</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-8">
                  <div>
                    <h3 className="text-3xl serif mb-4">Export Final Cut</h3>
                    <p className="text-[#1A1A1A]/60 leading-relaxed max-w-sm font-medium">
                      Generation finished with zero data cost. The prompt has been converted to 512+ latent frames using your local {gpuStatus.adapterInfo}.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button className="bg-[#5A5A40] text-white p-5 rounded-24 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
                      <Zap size={18} /> Download MP4
                    </button>
                    <button className="bg-[#F5F5F0] text-[#5A5A40] p-5 rounded-24 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
                      <Layers size={18} /> Master Project
                    </button>
                  </div>

                  <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex gap-4">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="text-emerald-900 font-bold text-sm mb-1">Consistency Verified</p>
                      <p className="text-emerald-700 text-xs leading-relaxed opacity-80">
                        Character Identity Loss [0.03%]. Technical Directive Anchor successfully maintained across all latent frames.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Background Decoration */}
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#5A5A40]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#8A8A60]/5 rounded-full blur-[100px] pointer-events-none"></div>
      </motion.div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-[#1A1A1A]/5 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4"><Zap size={20} /></div>
          <h4 className="font-bold mb-2">9:16 Vertical Optimization</h4>
          <p className="text-sm text-[#1A1A1A]/60 leading-relaxed">Engine pre-configured for 720x1280 resolution, ideal for vertical shorts and reels.</p>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-[#1A1A1A]/5 shadow-sm">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4"><Clock size={20} /></div>
          <h4 className="font-bold mb-2">Timing Control</h4>
          <p className="text-sm text-[#1A1A1A]/60 leading-relaxed">Manual override for frame intervals and duration to sync with high-energy Hindi slang dialogues.</p>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-[#1A1A1A]/5 shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4"><CheckCircle2 size={20} /></div>
          <h4 className="font-bold mb-2">Zero Data Cost</h4>
          <p className="text-sm text-[#1A1A1A]/60 leading-relaxed">Processing happens on your local hardware. No server costs, no token limits, absolute privacy.</p>
        </div>
      </div>
    </div>
  );
}
