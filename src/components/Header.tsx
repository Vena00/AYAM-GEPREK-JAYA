import React from 'react';
import { ShoppingBag, Flame, Sparkles, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  logoUrl: string;
}

export default function Header({ cartCount, onCartClick, logoUrl }: HeaderProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('home')}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 shadow-md bg-amber-50"
            >
              <img 
                src={logoUrl} 
                alt="Logo Ayam Geprek Jaya" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div>
              <span className="font-sans font-black text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-500">
                GEPREK JAYA
              </span>
              <div className="flex items-center text-[10px] font-mono text-amber-600 font-semibold uppercase tracking-wider">
                <Flame className="w-3 h-3 text-red-500 mr-1 animate-pulse" />
                Pedas Mantap Selera Nusantara
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700">
            <button 
              onClick={() => scrollToSection('home')}
              className="hover:text-orange-500 transition-colors cursor-pointer py-2 border-b-2 border-transparent hover:border-orange-500"
            >
              Beranda
            </button>
            <button 
              onClick={() => scrollToSection('menu')}
              className="hover:text-orange-500 transition-colors cursor-pointer py-2 border-b-2 border-transparent hover:border-orange-500 flex items-center gap-1"
            >
              Menu Spesial
            </button>
            <button 
              onClick={() => scrollToSection('ai-recommender')}
              className="hover:text-orange-500 transition-colors cursor-pointer py-2 border-b-2 border-transparent hover:border-orange-500 flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100"
            >
              <Sparkles className="w-3.5 h-3.5 fill-red-500 text-red-500" />
              Rekomendasi AI
            </button>
            <button 
              onClick={() => scrollToSection('ulasan')}
              className="hover:text-orange-500 transition-colors cursor-pointer py-2 border-b-2 border-transparent hover:border-orange-500 flex items-center gap-1"
            >
              <MessageSquare className="w-4 h-4 text-orange-400" />
              Ulasan Pelanggan
            </button>
          </nav>

          {/* Cart Icon & Action */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCartClick}
              className="relative p-3 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all shadow-inner border border-orange-100 flex items-center justify-center cursor-pointer"
              id="cart-button"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white font-sans text-xs font-bold shadow-lg ring-2 ring-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>
            <button 
              onClick={() => scrollToSection('menu')}
              className="hidden lg:block bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              Pesan Sekarang
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
