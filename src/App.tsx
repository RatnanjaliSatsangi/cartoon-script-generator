/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { generateHindiScript, ScriptResponse, Scene } from './services/geminiService';
import VideoDashboard from './components/VideoDashboard';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  RefreshCw, 
  Clapperboard, 
  Mic2, 
  Share2,
  Trash2,
  LayoutDashboard,
  Video,
  MonitorPlay,
  Settings2,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<ScriptResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'script' | 'gpu'>('script');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !apiKey.trim()) {
      alert("Please provide both API key and topic.");
      return;
    }

    setLoading(true);
    try {
      const result = await generateHindiScript(topic, apiKey);
      setScript(result);
    } catch (error) {
      console.error(error);
      alert("Kuch gadbad ho gayi! Phir se try karo.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatSceneMarkdown = (scene: Scene) => {
    return `### Scene ${scene.sceneNumber} (${scene.speaker} Speaking)\n**Visual Prompt:** ${scene.visualScript}\n**Audio Dialogue:** ${scene.audioScript}`;
  };

  const copyFullScript = () => {
    if (!script) return;
    
    let fullText = `# ${script.title}\n\n`;
    fullText += `## Character Identities (For Flow AI Consistency)\n`;
    script.characterDefinitions.forEach(char => {
      fullText += `- **${char.name}**: ${char.visualIdentity}\n`;
    });
    fullText += `\n---\n\n`;
    
    script.scenes.forEach(scene => {
      fullText += formatSceneMarkdown(scene) + `\n\n`;
    });
    
    copyToClipboard(fullText, 999);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#5A5A40] selection:text-white flex">
      {/* Sidebar Navigation */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-72' : 'w-20'
        } bg-white border-r border-[#1A1A1A]/5 transition-all duration-500 ease-in-out fixed h-full z-30 hidden md:flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-[#5A5A40] rounded-lg flex items-center justify-center text-white">
                <Clapperboard size={16} />
              </div>
              <span className="font-bold serif text-lg text-[#1A1A1A]">FlowScript</span>
            </motion.div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-[#F5F5F0] rounded-xl transition-colors text-[#5A5A40]"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <button
            onClick={() => setActiveTab('script')}
            className={`w-full flex items-center gap-4 p-4 rounded-24 transition-all ${
              activeTab === 'script' 
                ? 'bg-[#5A5A40] text-white shadow-lg' 
                : 'hover:bg-[#F5F5F0] text-[#1A1A1A]/60'
            }`}
          >
            <Video size={20} />
            {isSidebarOpen && <span className="font-bold text-sm tracking-tight text-[#1A1A1A]">Script Creator</span>}
          </button>
          <button
            onClick={() => setActiveTab('gpu')}
            className={`w-full flex items-center gap-4 p-4 rounded-24 transition-all ${
              activeTab === 'gpu' 
                ? 'bg-[#5A5A40] text-white shadow-lg' 
                : 'hover:bg-[#F5F5F0] text-[#1A1A1A]/60'
            }`}
          >
            <MonitorPlay size={20} />
            {isSidebarOpen && <span className="font-bold text-sm tracking-tight text-[#1A1A1A]">GPU Generator</span>}
          </button>
        </nav>

        <div className="p-6 border-t border-[#1A1A1A]/5">
          <div className={`flex items-center gap-3 ${isSidebarOpen ? 'bg-[#F5F5F0]' : ''} p-3 rounded-2xl`}>
            <div className="w-8 h-8 bg-[#5A5A40]/10 rounded-full flex items-center justify-center text-[#5A5A40]">
              <Settings2 size={16} />
            </div>
            {isSidebarOpen && (
              <div className="text-[10px] uppercase font-black opacity-40 leading-none text-[#1A1A1A]">
                V2 Engine Active
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-500 ${isSidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}>
        <header className="border-b border-[#1A1A1A]/10 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold uppercase tracking-widest opacity-40 text-[#1A1A1A]">
                {activeTab === 'script' ? 'AI Scripting Interface' : 'Local GPU Dashboard'}
              </h2>
            </div>
            <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest font-black opacity-20 text-[#1A1A1A]">
              <span>9:16 Optimized</span>
              <span>•</span>
              <span>720P Native</span>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-8 py-12">
          <AnimatePresence mode="wait">
            {activeTab === 'script' ? (
              <motion.div
                key="script-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
              >
                <section className="mb-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[40px] p-10 shadow-sm border border-[#1A1A1A]/5 glow-hover transition-all"
                  >
                    <h2 className="text-4xl serif mb-6 tracking-tight text-[#1A1A1A]">Kya story banayein, <span className="italic text-[#1A1A1A]">Bhai?</span></h2>
                    <form onSubmit={handleGenerate} className="space-y-4">
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter Gemini API Key..."
                        className="w-full bg-[#F5F5F0] border-none rounded-2xl px-6 py-5 text-lg focus:ring-2 focus:ring-[#5A5A40] transition-all outline-none"
                      />
                      <div className="relative">
                        <input
                          type="text"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          placeholder="Ex: Ek kanjoos baniya aur ek chalak chor..."
                          className="w-full bg-[#F5F5F0] border-none rounded-3xl px-8 py-6 pr-20 text-xl focus:ring-2 focus:ring-[#5A5A40] transition-all outline-none placeholder:opacity-30"
                        />
                        <button
                          type="submit"
                          disabled={loading || !topic.trim() || !apiKey.trim()}
                          className="absolute right-3 top-3 bottom-3 px-8 bg-[#5A5A40] text-white rounded-2xl hover:bg-[#4A4A30] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center group"
                        >
                          {loading ? <RefreshCw className="animate-spin" size={24} /> : <Send size={24} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                      </div>
                    </form>
                    <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5A5A40]/40">
                      <Sparkles size={14} className="text-[#5A5A40]" />
                      V2 Technical Directives: Hook, Twist & Anchor enabled.
                    </div>
                  </motion.div>
                </section>

                <AnimatePresence mode="wait">
                  {script ? (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-3xl serif text-[#1A1A1A]">{script.title}</h3>
                        <button 
                          onClick={() => setScript(null)}
                          className="text-xs font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 px-6 py-3 rounded-full transition-all flex items-center gap-2 border border-red-100"
                        >
                          <Trash2 size={14} /> Clear Session
                        </button>
                      </div>

                      {/* Character Identity Anchors */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[32px] p-8 border border-[#5A5A40]/10 shadow-sm relative overflow-hidden"
                      >
                        <div className="flex items-center gap-2 mb-6 text-[#5A5A40]">
                          <Sparkles size={18} />
                          <h4 className="font-black uppercase tracking-[0.2em] text-[10px] text-[#5A5A40]">Character Anchors (V2)</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                          {script.characterDefinitions.map((char, i) => (
                            <div key={i} className="bg-[#F5F5F0]/50 p-6 rounded-24 border border-white">
                              <p className="font-bold text-[#5A5A40] mb-2 flex items-center gap-2">
                                <ChevronRight size={14} /> {char.name}
                              </p>
                              <p className="text-sm text-[#1A1A1A]/70 leading-relaxed italic font-medium">"{char.visualIdentity}"</p>
                            </div>
                          ))}
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#5A5A40]/5 rounded-full blur-3xl"></div>
                      </motion.div>

                      <div className="grid gap-8">
                        {script.scenes.map((scene, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group bg-white rounded-[40px] p-10 border border-[#1A1A1A]/5 hover:border-[#5A5A40]/20 transition-all shadow-sm hover:shadow-xl relative"
                          >
                            <div className="flex items-start justify-between mb-8">
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-[#F5F5F0] text-[#5A5A40] px-4 py-2 rounded-full border border-[#5A5A40]/10">
                                  Scene {scene.sceneNumber}
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white bg-[#5A5A40] px-3 py-1.5 rounded-lg shadow-sm">
                                  {scene.speaker} Focus
                                </span>
                              </div>
                              <button
                                onClick={() => copyToClipboard(formatSceneMarkdown(scene), idx)}
                                className="p-3 hover:bg-[#F5F5F0] rounded-2xl transition-all text-[#1A1A1A]/20 hover:text-[#5A5A40] hover:scale-110 active:scale-95"
                                title="Copy V2 Prompt"
                              >
                                {copiedIndex === idx ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                              </button>
                            </div>

                            <div className="space-y-8">
                              <div className="flex gap-6">
                                <div className="mt-1 w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                  <Clapperboard size={20} />
                                </div>
                                <div className="flex-1">
                                  <p className="text-[10px] uppercase font-black tracking-widest text-[#1A1A1A]/30 mb-2 text-[#1A1A1A]">Technical Visual Directive (English)</p>
                                  <div className="bg-[#F5F5F0]/80 p-6 rounded-3xl border-2 border-dashed border-[#1A1A1A]/5 font-mono text-xs leading-relaxed text-[#5A5A40]">
                                    {scene.visualScript}
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-6">
                                <div className="mt-1 w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                                  <Mic2 size={20} />
                                </div>
                                <div className="flex-1">
                                  <p className="text-[10px] uppercase font-black tracking-widest text-[#1A1A1A]/30 mb-2 text-[#1A1A1A]">Audio Performance (Hindi)</p>
                                  <div className="bg-[#5A5A40]/5 p-6 rounded-3xl border border-[#5A5A40]/10 border-l-[6px] border-l-[#5A5A40]">
                                    <p className="text-xs font-bold text-[#5A5A40] mb-2 uppercase tracking-widest text-[#5A5A40]">{scene.speaker} is saying:</p>
                                    <p className="text-3xl font-medium text-[#1A1A1A] leading-tight text-[#1A1A1A]">{scene.audioScript}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="bg-[#5A5A40] text-white rounded-[48px] p-12 text-center shadow-2xl relative overflow-hidden">
                        <Share2 className="mx-auto mb-6 opacity-40 float-animation text-white" size={48} />
                        <h4 className="text-4xl serif mb-4 text-white">Export Full Script?</h4>
                        <p className="opacity-60 mb-10 max-w-md mx-auto text-lg text-white">Download the complete V2 Technical Directive package for batch generation.</p>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                          <button 
                            onClick={copyFullScript}
                            className="bg-white text-[#5A5A40] px-12 py-5 rounded-24 font-black uppercase tracking-tighter text-lg hover:bg-[#F5F5F0] hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl"
                          >
                            {copiedIndex === 999 ? <Check size={20} /> : <Copy size={20} />}
                            Copy All Prompts
                          </button>
                          <button 
                            onClick={() => setActiveTab('gpu')}
                            className="bg-black/20 backdrop-blur-sm text-white border border-white/20 px-10 py-5 rounded-24 font-black uppercase tracking-tighter text-lg hover:bg-black/30 transition-all flex items-center justify-center gap-3"
                          >
                            Go to GPU Generator <ChevronRight size={20} />
                          </button>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                      </div>
                    </motion.div>
                  ) : (
                    !loading && (
                      <motion.div 
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 opacity-10"
                      >
                        <Clapperboard size={120} className="mx-auto mb-8 text-[#1A1A1A]" />
                        <p className="text-4xl serif tracking-tight text-[#1A1A1A]">Script Creator Mode</p>
                        <p className="text-sm uppercase font-black tracking-[0.5em] mt-4 text-[#1A1A1A]">Enter a topic to begin</p>
                      </motion.div>
                    )
                  )}
                </AnimatePresence>

                {loading && (
                  <div className="space-y-8 max-w-3xl mx-auto">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white/40 rounded-[40px] p-10 border border-[#1A1A1A]/5 animate-pulse text-[#1A1A1A]">
                        <div className="h-6 w-32 bg-[#1A1A1A]/10 rounded-full mb-8"></div>
                        <div className="space-y-4">
                          <div className="h-4 w-full bg-[#1A1A1A]/5 rounded"></div>
                          <div className="h-4 w-3/4 bg-[#1A1A1A]/5 rounded"></div>
                        </div>
                      </div>
                    ))}
                    <p className="text-center text-sm font-bold uppercase tracking-widest text-[#5A5A40] animate-bounce">Writing magic... 🎬</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="gpu-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
              >
                <VideoDashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
