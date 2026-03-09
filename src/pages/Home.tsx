import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Image as ImageIcon, ArrowRight, Loader2 } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import { motion } from 'motion/react';
import { extractFace } from '../services/faceService';

export const Home: React.FC = () => {
  const { userImage, setUserImage, setProcessedUserImage, isProcessing, setIsProcessing } = useGlobalContext();
  const navigate = useNavigate();

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    setUserImage(imageData);
    try {
      const cropped = await extractFace(imageData);
      setProcessedUserImage(cropped);
    } catch (error) {
      console.error('Face processing failed:', error);
      setProcessedUserImage(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        processImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        processImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-sans font-bold text-zinc-900 mb-4 tracking-tight">
          发现你的专属色彩
        </h1>
        <p className="text-zinc-600 text-lg max-w-2xl mx-auto">
          上传一张正面照片，我们将自动识别您的面部并生成 12 季节色彩专业对比图，帮助您精准锁定专属季型。
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative group"
        >
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className={`aspect-[3/4] rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-8 text-center ${
              userImage 
                ? 'border-indigo-200 bg-indigo-50/30' 
                : 'border-zinc-200 bg-zinc-50 hover:border-indigo-400 hover:bg-indigo-50/50'
            }`}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                <p className="text-indigo-600 font-medium">正在识别面部并生成对比图...</p>
              </div>
            ) : userImage ? (
              <div className="relative w-full h-full">
                <img 
                  src={userImage} 
                  alt="User" 
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => {
                    setUserImage(null);
                    setProcessedUserImage(null);
                  }}
                  className="absolute -top-2 -right-2 bg-white shadow-md rounded-full p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="text-indigo-600 w-8 h-8" />
                </div>
                <h3 className="text-zinc-900 font-medium mb-2">点击或拖拽上传照片</h3>
                <p className="text-zinc-500 text-sm mb-6">支持 JPG, PNG 格式</p>
                <label className="cursor-pointer bg-indigo-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                  选择文件
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <ImageIcon className="text-emerald-600 w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-zinc-900">上传建议</h3>
            </div>
            <ul className="space-y-3 text-sm text-zinc-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>使用自然光线，避免强烈的阴影或人工光源。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>尽量素颜或淡妆，以展现真实的皮肤底色。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>背景简洁，最好是中性色（如白墙）。</span>
              </li>
            </ul>
          </div>

          <button
            disabled={!userImage}
            onClick={() => navigate('/compare')}
            className={`w-full py-4 rounded-2xl font-sans font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              userImage 
                ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg' 
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            }`}
          >
            开始比对
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};
