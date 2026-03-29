/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { generateHindiScript, ScriptResponse, Scene } from './services/geminiService';
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
  Trash2
} from 'lucide-react';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<ScriptResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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
    return `### Scene ${scene.sceneNumber}\n**Visual Script:** ${scene.visualScript}\n**Audio Script:** ${scene.audioScript}`;
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#5A5A40] selection:text-white">
      {/* Header */}
      <header className="border-b border-[#1A1A1A]/10 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#5A5A40] rounded-full flex items-center justify-center text-white">
              <Clapperboard size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight serif">FlowScript <span className="italic-small text-sm opacity-60">Hindi</span></h1>
          </div>
          <div className="flex items-center gap-4 text-xs uppercase tracking-widest font-semibold opacity-50">
            <span>Cartoon AI</span>
            <span>•</span>
            <span>Hindi Slang</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Input Section */}
        <section className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] p-8 shadow-sm border border-[#1A1A1A]/5"
          >
            <h2 className="text-3xl serif mb-6">Kya story banayein, Bhai?</h2>
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
                  className="w-full bg-[#F5F5F0] border-none rounded-2xl px-6 py-5 pr-16 text-lg focus:ring-2 focus:ring-[#5A5A40] transition-all outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || !topic.trim() || !apiKey.trim()}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-[#5A5A40] text-white rounded-xl hover:bg-[#4A4A30] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {loading ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
              </div>
            </form>
            <p className="mt-4 text-sm text-[#1A1A1A]/60 flex items-center gap-2">
              <Sparkles size={14} />
              Flow AI ke liye strong hook aur better retention wale script prompts generate karein.
            </p>
          </motion.div>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {script ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl serif">{script.title}</h3>
                <button 
                  onClick={() => setScript(null)}
                  className="text-sm text-red-600 hover:bg-red-50 px-4 py-2 rounded-full transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} /> Clear
                </button>
              </div>

              <div className="grid gap-6">
                {script.scenes.map((scene, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white rounded-3xl p-6 border border-[#1A1A1A]/5 hover:border-[#5A5A40]/30 transition-all shadow-sm hover:shadow-md relative"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-widest bg-[#F5F5F0] px-3 py-1 rounded-full">
                        Scene {scene.sceneNumber}
                      </span>
                      <button
                        onClick={() => copyToClipboard(formatSceneMarkdown(scene), idx)}
                        className="p-2 hover:bg-[#F5F5F0] rounded-full transition-colors text-[#1A1A1A]/40 hover:text-[#5A5A40]"
                        title="Copy Scene Markdown"
                      >
                        {copiedIndex === idx ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="mt-1 text-[#5A5A40]">
                          <Clapperboard size={18} />
                        </div>
                        <div>
                          <p className="text-xs uppercase font-bold text-[#1A1A1A]/40 mb-1">Visual Prompt (English)</p>
                          <p className="text-[#1A1A1A] leading-relaxed">{scene.visualScript}</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="mt-1 text-[#5A5A40]">
                          <Mic2 size={18} />
                        </div>
                        <div>
                          <p className="text-xs uppercase font-bold text-[#1A1A1A]/40 mb-1">Audio Dialogue (Hindi)</p>
                          <p className="text-xl font-medium text-[#1A1A1A]">{scene.audioScript}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-[#5A5A40] text-white rounded-[32px] p-8 text-center">
                <Share2 className="mx-auto mb-4" size={32} />
                <h4 className="text-xl serif mb-2">Pasand aaya?</h4>
                <p className="opacity-80 mb-6">In prompts ko Flow AI mein daalo aur apna cartoon banao!</p>
                <button 
                  onClick={() => copyToClipboard(script.scenes.map(formatSceneMarkdown).join('\n\n'), 999)}
                  className="bg-white text-[#5A5A40] px-8 py-3 rounded-full font-bold hover:bg-[#F5F5F0] transition-colors flex items-center gap-2 mx-auto"
                >
                  {copiedIndex === 999 ? <Check size={18} /> : <Copy size={18} />}
                  Copy Full Script
                </button>
              </div>
            </motion.div>
          ) : (
            !loading && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 opacity-30"
              >
                <Clapperboard size={64} className="mx-auto mb-4" />
                <p className="text-xl serif">Topic daalo aur magic dekho!</p>
              </motion.div>
            )
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/50 rounded-3xl p-6 border border-[#1A1A1A]/5 animate-pulse">
                <div className="h-4 w-20 bg-[#1A1A1A]/10 rounded-full mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-[#1A1A1A]/5 rounded"></div>
                  <div className="h-4 w-2/3 bg-[#1A1A1A]/5 rounded"></div>
                </div>
              </div>
            ))}
            <p className="text-center text-sm italic opacity-50">Script likh raha hoon, thoda sabar karo...</p>
          </div>
        )}
      </main>

      <footer className="border-t border-[#1A1A1A]/10 py-12 mt-12 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm opacity-50 mb-4">FlowScript Hindi © 2026</p>
          <div className="flex justify-center gap-6 text-xs uppercase tracking-widest font-bold opacity-40">
            <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Contact</a>
            <a href="https://www.chai4.me/krishnakant" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">Buy Me A Coffee</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
