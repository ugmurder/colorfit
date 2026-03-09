import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Palette, Home, Layers, Info } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '上传图片', icon: Home },
    { path: '/compare', label: '季型比对', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Palette className="text-white w-5 h-5" />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight text-zinc-900">ColorFit</span>
          </Link>
          
          <nav className="flex items-center gap-1 sm:gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-zinc-50 border-t border-zinc-200 mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <Info className="w-4 h-4" />
            <p>隐私声明：所有图片处理均在本地浏览器完成，不会上传或存储任何用户数据。</p>
          </div>
          <p className="text-zinc-400 text-xs">
            &copy; {new Date().getFullYear()} ColorFit Personal Color Analysis.
          </p>
        </div>
      </div>
    </footer>
  );
};
