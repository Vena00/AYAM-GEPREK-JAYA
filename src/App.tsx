import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Phone, 
  UtensilsCrossed, 
  Check, 
  Search,
  ThumbsUp,
  Heart
} from 'lucide-react';

import Header from './components/Header';
import MenuCard from './components/MenuCard';
import AIRecommender from './components/AIRecommender';
import ReviewSection from './components/ReviewSection';
import CartModal from './components/CartModal';

import { MenuItem, CartItem, ExtraItem } from './types';
import { MENU_ITEMS } from './data';

// Local generated assets paths
const logoImage = '/src/assets/images/logo_ayam_geprek_1783240539048.jpg';
const heroImage = '/src/assets/images/hero_ayam_geprek_1783240525094.jpg';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add to cart handler
  const handleAddToCart = (
    menuItem: MenuItem,
    quantity: number,
    spicyLevel: number,
    selectedExtras: ExtraItem[],
    notes: string
  ) => {
    // Generate a unique key for custom configurations
    const extrasIds = selectedExtras.map((e) => e.name).sort().join('|');
    const uniqueId = `${menuItem.id}-lv${spicyLevel}-${extrasIds}-${notes}`;

    setCartItems((prevItems) => {
      const existingIdx = prevItems.findIndex((item) => item.id === uniqueId);
      
      if (existingIdx > -1) {
        const updated = [...prevItems];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: uniqueId,
            menuItem,
            quantity,
            spicyLevel,
            selectedExtras,
            notes
          }
        ];
      }
    });
  };

  // Update quantity in cart
  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  // Remove single item from cart
  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear cart entirely
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Scroll helper
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAI = () => {
    document.getElementById('ai-recommender')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter items based on Category & Search Query
  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { value: 'all', label: '🍽️ Semua Menu' },
    { value: 'geprek', label: '🍗 Ayam Geprek' },
    { value: 'package', label: '🍱 Paket Kenyang' },
    { value: 'sides', label: '🍟 Cemilan & Extra' },
    { value: 'drinks', label: '🥤 Minuman Segar' }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 antialiased selection:bg-orange-500 selection:text-white">
      {/* Header Navigation */}
      <Header 
        cartCount={cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)}
        logoUrl={logoImage}
      />

      {/* Hero Section */}
      <section id="home" className="relative bg-white pt-10 pb-16 md:py-24 overflow-hidden border-b border-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Typography Left */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 rounded-full border border-red-100 text-red-600 font-mono text-[11px] font-black uppercase tracking-wider"
              >
                <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500 animate-pulse" />
                Kedai Geprek No. 1 Terlaris
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-gray-900 tracking-tight leading-none"
              >
                Kriuknya <span className="text-red-600 font-extrabold relative inline-block">
                  Juara
                  <span className="absolute left-0 bottom-1 w-full h-2 bg-amber-400 -z-10 transform -rotate-1" />
                </span>,<br />
                Pedasnya <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">Membakar</span> Selera!
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                Ayam goreng krispi renyah berbumbu rempah khas nusantara, berkolaborasi dengan ulekan cabai rawit merah segar dadakan dan siraman keju mozzarella leleh. Nikmati sensasi makan geprek sesungguhnya!
              </motion.p>

              {/* CTAs */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <button 
                  onClick={scrollToMenu}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-sans font-black text-sm px-8 py-4 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  Lihat Menu Spesial
                </button>
                <button 
                  onClick={scrollToAI}
                  className="w-full sm:w-auto bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-sans font-black text-sm px-8 py-4 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
                  Rekomendasi Menu AI
                </button>
              </motion.div>

              {/* Specs badges */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-4 pt-6 max-w-md mx-auto lg:mx-0 border-t border-gray-100"
              >
                <div className="text-center lg:text-left">
                  <div className="text-lg font-sans font-black text-red-600">100%</div>
                  <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Cabai Rawit Asli</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-lg font-sans font-black text-red-600">Dadakan</div>
                  <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Ulek Segar</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-lg font-sans font-black text-red-600">Premium</div>
                  <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Ayam Segar Higienis</div>
                </div>
              </motion.div>
            </div>

            {/* Hero Image Right */}
            <div className="lg:col-span-6 relative flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-[40px] overflow-hidden border-8 border-white shadow-2xl w-full max-w-lg aspect-4/3 sm:aspect-16/9 lg:aspect-4/3 bg-orange-50 transform rotate-1"
              >
                <img 
                  src={heroImage} 
                  alt="Sajian Lezat Ayam Geprek Jaya" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              {/* Overlapping promo sticker */}
              <div className="absolute -bottom-6 right-6 bg-red-600 text-white rounded-2xl px-5 py-4 shadow-xl transform -rotate-6 hidden sm:block">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 block mb-1">PROMO HARI INI</span>
                <span className="font-display font-black text-xl">Mulai Rp 18.000!</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Highlight Features section */}
      <section className="py-16 bg-gray-50 border-b border-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-orange-100/50 shadow-xs flex gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl shrink-0 h-12 w-12 flex items-center justify-center">
                <Flame className="w-6 h-6 fill-red-500" />
              </div>
              <div>
                <h3 className="font-sans font-extrabold text-base text-gray-900 mb-1">Asli Cabe Rawit Setan</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Kami tidak pernah menggunakan perisa kimia atau cabe bubuk instan. 100% ulekan cabe rawit segar dari petani lokal Yogyakarta.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-orange-100/50 shadow-xs flex gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl shrink-0 h-12 w-12 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-sans font-extrabold text-base text-gray-900 mb-1">Daging Ayam Segar Higienis</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Ayam dimarinasi bumbu rahasia 12 jam, dipotong higienis dan digoreng garing garing dadakan di minyak bersih berkualitas.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-orange-100/50 shadow-xs flex gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shrink-0 h-12 w-12 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-sans font-extrabold text-base text-gray-900 mb-1">Ulek Dadakan & Hangat</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Semua ayam digeprek dadakan persis saat Anda memesan agar kerenyahan kulit krispi luar berpadu sempurna dengan kehangatan sambal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Menu Exploration Section */}
      <section id="menu" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-widest block mb-2">DAFTAR MENU</span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-gray-900 tracking-tight leading-none mb-4">
              Menu Spesial Ayam Geprek Jaya
            </h2>
            <p className="text-gray-500 text-sm">
              Sajian ayam geprek istimewa dengan berbagai varian lezat serta penawar pedas andalan kami.
            </p>
          </div>

          {/* Search and Category Filters */}
          <div className="space-y-6 mb-12">
            {/* Search Input */}
            <div className="max-w-md mx-auto relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Cari Ayam Geprek, Mozzarella, Minuman..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm py-4 pl-12 pr-4 bg-gray-50 border border-orange-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all text-gray-700 shadow-xs"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`font-sans font-bold text-xs py-3 px-5 rounded-full border transition-all cursor-pointer ${
                    activeCategory === cat.value
                      ? 'bg-orange-500 border-orange-500 text-white shadow-md'
                      : 'bg-gray-50 border-gray-100 hover:border-orange-200 text-gray-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Card Grid */}
          <motion.div 
            layout 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredMenuItems.length === 0 ? (
                <div className="col-span-full py-16 text-center text-gray-400 font-sans text-sm">
                  Tidak menemukan menu yang cocok dengan kata kunci "{searchQuery}".
                </div>
              ) : (
                filteredMenuItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MenuCard item={item} onAddToCart={handleAddToCart} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* AI Sommelier Section */}
      <section id="ai-recommender" className="py-20 bg-gray-50 border-t border-b border-orange-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AIRecommender onAddRecommendedToCart={handleAddToCart} />
        </div>
      </section>

      {/* Customer Review Section */}
      <section id="ulasan" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReviewSection />
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Footer brand info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500 shadow-md">
                <img 
                  src={logoImage} 
                  alt="Ayam Geprek Jaya" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-sans font-black text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400">
                GEPREK JAYA
              </span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed max-w-sm">
              Menyajikan kebahagiaan renyah-pedas nusantara langsung ke depan pintu Anda. Dibuat dengan cinta, dimasak dengan higienis, digeprek dadakan!
            </p>
            <div className="flex items-center gap-1.5 text-xs text-red-500 font-bold">
              <Heart className="w-3.5 h-3.5 fill-red-500" />
              100% Buatan Indonesia
            </div>
          </div>

          {/* Footer location info */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-sans font-extrabold text-sm text-gray-200 uppercase tracking-widest">Kunjungi Kedai</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-orange-500 shrink-0 mt-0.5" />
                <span>Kantin Kampus Sekolah Tinggi Pariwisata Mataram (STP Mataram), Jl. Jend. Sudirman No. 17, Rembiga, Kota Mataram, Nusa Tenggara Barat 83124</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4.5 h-4.5 text-orange-500 shrink-0" />
                <span>Setiap Hari: 10.00 - 21.30 WIB</span>
              </div>
            </div>
          </div>

          {/* Footer contact info */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-sans font-extrabold text-sm text-gray-200 uppercase tracking-widest">Hubungi Kami</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4.5 h-4.5 text-orange-500 shrink-0" />
                <span>+62 812-3456-7890</span>
              </div>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                Menerima pesanan katering pesta besar, rapat kantor, syukuran, atau ulang tahun. Pesanan dikirim hangat dengan kurir handal.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom footer credit */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800/80 text-center text-xs text-gray-600">
          <p>© 2026 Ayam Geprek Jaya. Hak Cipta Dilindungi Undang-Undang.</p>
        </div>
      </footer>

      {/* Cart Drawer Slide-over Modal */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
