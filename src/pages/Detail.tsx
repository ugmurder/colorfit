import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SEASONS } from '../constants';
import { useGlobalContext } from '../context/GlobalContext';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Info, ChevronLeft, ChevronRight } from 'lucide-react';

export const Detail: React.FC = () => {
  const { seasonId } = useParams<{ seasonId: string }>();
  const { userImage, processedUserImage } = useGlobalContext();
  const navigate = useNavigate();
  const [sliderPos, setSliderPos] = useState(50);
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const season = SEASONS.find(s => s.id === seasonId);

  useEffect(() => {
    if (!userImage) navigate('/');
  }, [userImage, navigate]);

  if (!season || !userImage) return null;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  const nextColor = () => setActiveColorIdx((prev) => (prev + 1) % season.colors.length);
  const prevColor = () => setActiveColorIdx((prev) => (prev - 1 + season.colors.length) % season.colors.length);

  const activeColor = season.colors[activeColorIdx];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/compare')}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-zinc-600" />
          </button>
          <div>
            <h1 className="text-3xl font-sans font-bold text-zinc-900 tracking-tight">{season.name}</h1>
            <p className="text-zinc-500 text-sm">{season.coreDesc}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Comparison Slider */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            ref={containerRef}
            className="relative aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white transition-colors duration-500"
            style={{ backgroundColor: activeColor.hex }}
          >
            {/* Base: User Image */}
            <img 
              src={processedUserImage || userImage} 
              alt="User" 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            
            {/* Overlay: Color Palette */}
            <div 
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
            >
              <div 
                className="w-full h-full transition-colors duration-300 flex items-center justify-center"
                style={{ backgroundColor: activeColor.hex }}
              >
                <div className="text-center p-8 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30">
                   <p className="text-white font-sans font-bold text-2xl drop-shadow-md">{activeColor.name}</p>
                   <p className="text-white/80 font-mono text-sm mt-1">{activeColor.hex}</p>
                </div>
              </div>
            </div>

            {/* Slider Line */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.3)] z-10 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="w-1 h-4 bg-zinc-300 rounded-full mx-0.5" />
                <div className="w-1 h-4 bg-zinc-300 rounded-full mx-0.5" />
              </div>
            </div>

            {/* Native Range Input for Slider */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderPos} 
              onChange={handleSliderChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
          </div>

          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
            <button 
              onClick={prevColor}
              className="p-3 hover:bg-zinc-50 rounded-xl transition-colors text-zinc-600"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">当前比对色</p>
              <p className="text-lg font-sans font-bold text-zinc-900">{activeColor.name}</p>
            </div>
            <button 
              onClick={nextColor}
              className="p-3 hover:bg-zinc-50 rounded-xl transition-colors text-zinc-600"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Color Grid */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
            <h3 className="font-sans font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-6 bg-indigo-600 rounded-full" />
              完整色卡 ({season.colors.length})
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-3">
              {season.colors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveColorIdx(idx)}
                  className={`group relative aspect-square rounded-xl transition-all ${
                    activeColorIdx === idx 
                      ? 'ring-4 ring-indigo-600 ring-offset-2 scale-105 z-10' 
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl" />
                  {activeColorIdx === idx && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full border-2 border-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3 text-indigo-200">
                <Info className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">专家建议</span>
              </div>
              <p className="text-sm leading-relaxed opacity-90">
                {season.category === 'spring' && "春季型人适合明亮、温暖、鲜艳的颜色。避免沉闷、冰冷或过于灰暗的色调。"}
                {season.category === 'summer' && "夏季型人适合柔和、清爽、带有灰调的冷色。避免过于浓烈、温暖或刺眼的颜色。"}
                {season.category === 'autumn' && "秋季型人适合浓郁、温暖、带有大地感的颜色。避免冰冷、荧光或过于浅淡的色调。"}
                {season.category === 'winter' && "冬季型人适合纯净、冷冽、高对比度的颜色。避免浑浊、温暖或过于柔和的色调。"}
              </p>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
