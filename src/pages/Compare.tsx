import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEASONS } from '../constants';
import { useGlobalContext } from '../context/GlobalContext';
import { motion } from 'motion/react';

export const Compare: React.FC = () => {
  const { userImage, processedUserImage } = useGlobalContext();
  const navigate = useNavigate();

  if (!userImage) {
// ... (rest of the check)
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <h2 className="text-2xl font-sans font-bold text-zinc-900 mb-4">请先上传照片</h2>
        <button 
          onClick={() => navigate('/')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors"
        >
          去上传
        </button>
      </div>
    );
  }

  const categories = [
    { id: 'spring', name: '春季系', color: 'bg-orange-50 text-orange-600 border-orange-100' },
    { id: 'summer', name: '夏季系', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { id: 'autumn', name: '秋季系', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { id: 'winter', name: '冬季系', color: 'bg-zinc-100 text-zinc-600 border-zinc-200' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-12 px-2 sm:px-6 lg:px-8">
      <div className="text-center mb-6 sm:mb-12">
        <h1 className="text-xl sm:text-3xl font-sans font-bold text-zinc-900 mb-2 sm:mb-4 tracking-tight">
          12季型对比预览
        </h1>
        <p className="text-zinc-500 text-xs sm:text-base max-w-2xl mx-auto px-4">
          肤色在不同季型色卡包围下的对比效果。
        </p>
      </div>

      <div className="space-y-8 sm:space-y-16">
        {categories.map((cat) => (
          <section key={cat.id}>
            <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
              <h2 className="text-lg sm:text-2xl font-sans font-bold text-zinc-900">{cat.name}</h2>
              <span className={`px-2 sm:px-4 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-bold border uppercase tracking-widest ${cat.color}`}>
                {cat.id}
              </span>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-8">
              {SEASONS.filter(s => s.category === cat.id).map((season) => (
                <motion.div
                  key={season.id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => navigate(`/detail/${season.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-square relative rounded-xl sm:rounded-[2.5rem] overflow-hidden shadow-md sm:shadow-xl bg-white">
                    {/* Background Color Grid - Filling the surroundings with 12 colors */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-4">
                      {season.colors.slice(0, 12).map((color, idx) => (
                        <div 
                          key={idx} 
                          style={{ backgroundColor: color.hex }} 
                          className="w-full h-full" 
                        />
                      ))}
                    </div>
                    
                    {/* Central Circle Face Container - No gap/border, reduced size for more color area */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[65%] h-[65%] relative rounded-full overflow-hidden shadow-lg sm:shadow-2xl">
                        <img 
                          src={processedUserImage || userImage} 
                          alt="User" 
                          className="w-full h-full object-cover scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Season Label Below Image */}
                  <div className="mt-2 sm:mt-4 px-1 sm:px-2">
                    <h3 className="text-zinc-900 font-sans font-bold text-[10px] sm:text-lg group-hover:text-indigo-600 transition-colors truncate">
                      {season.name}
                    </h3>
                    <p className="text-zinc-500 text-[8px] sm:text-[10px] uppercase tracking-tighter sm:tracking-[0.1em] font-mono truncate">
                      {season.id.replace('-', ' ')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
