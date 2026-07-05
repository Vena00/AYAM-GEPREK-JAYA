import React, { useState } from 'react';
import { Sparkles, Flame, RefreshCw, ShoppingBag, Check, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem, AIRecommendationResponse, ExtraItem } from '../types';
import { MENU_ITEMS } from '../data';

interface AIRecommenderProps {
  onAddRecommendedToCart: (item: MenuItem, quantity: number, spicyLevel: number, selectedExtras: ExtraItem[], notes: string) => void;
}

export default function AIRecommender({ onAddRecommendedToCart }: AIRecommenderProps) {
  const [favoriteFoods, setFavoriteFoods] = useState('');
  const [chiliTolerance, setChiliTolerance] = useState<'none' | 'low' | 'medium' | 'high' | 'expert'>('medium');
  const [currentMood, setCurrentMood] = useState('biasa');
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [recommendation, setRecommendation] = useState<AIRecommendationResponse | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const moods = [
    { value: 'biasa', label: '😊 Santai & Biasa Saja' },
    { value: 'stres', label: '🤯 Stres & Butuh Pelampiasan' },
    { value: 'sedih', label: '😢 Sedih / Galau' },
    { value: 'lelah', label: '🥱 Lelah / Kurang Energi' },
    { value: 'ngantuk', label: '💤 Mengantuk & Butuh Sengatan' }
  ];

  const tolerances = [
    { value: 'none', label: '🚫 Level 0 (Sama sekali anti-pedas)' },
    { value: 'low', label: '🌱 Level 1-2 (Pedas cupu/tipis)' },
    { value: 'medium', label: '🔥 Level 3-5 (Pedas wajar/nikmat)' },
    { value: 'high', label: '💥 Level 6-8 (Doyan pedas/kebakar)' },
    { value: 'expert', label: '🌶️ Level 9-10+ (Dewa Sambal/Kelewat Gila)' }
  ];

  const prefOptions = [
    'Ekstra Bawang',
    'Keju Gurih',
    'Aroma Daun Jeruk',
    'Garing Maksimal',
    'Salted Egg Creamy',
    'Pete Gurih'
  ];

  const handlePrefToggle = (pref: string) => {
    if (selectedPrefs.includes(pref)) {
      setSelectedPrefs(selectedPrefs.filter((p) => p !== pref));
    } else {
      setSelectedPrefs([...selectedPrefs, pref]);
    }
  };

  const runLoadingAnimation = () => {
    setLoading(true);
    setLoadingStep(0);

    const steps = [
      'Menimbang takaran bawang merah...',
      'Memilih cabai rawit segar terbaik...',
      'Mengulek sambal geprek hangat...',
      'Membakar keju mozzarella...',
      'Menganalisis kadar endorfin mood Anda...',
      'Chef AI meramu resep jaya...'
    ];

    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 700);

    return interval;
  };

  const handleGetRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    const animationInterval = runLoadingAnimation();

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          favoriteFoods,
          chiliTolerance,
          currentMood,
          preferences: selectedPrefs
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data: AIRecommendationResponse = await response.json();
      
      // Keep loading active for a minimum time for smooth transition
      setTimeout(() => {
        setRecommendation(data);
        setLoading(false);
        clearInterval(animationInterval);
      }, 4200);

    } catch (error) {
      console.error(error);
      // Fallback
      setRecommendation({
        recommendedMenuId: 'geprek-mozarella',
        recommendedLevel: 5,
        reasonIndonesian: 'Maaf, sambungan AI kami sedang sibuk mengulek pesanan fisik. Chef menyarankan Ayam Geprek Mozzarella Melt Level 5 untuk melumerkan mood-mu hari ini!',
        chefTips: 'Coba kombinasikan dengan Kulit Ayam Krispi untuk kriuk ganda.'
      });
      setLoading(false);
      clearInterval(animationInterval);
    }
  };

  // Find the menu details
  const recommendedItem = recommendation 
    ? MENU_ITEMS.find((item) => item.id === recommendation.recommendedMenuId) || MENU_ITEMS[0]
    : null;

  const handleAddAIOrder = () => {
    if (!recommendedItem || !recommendation) return;
    onAddRecommendedToCart(
      recommendedItem,
      1,
      recommendation.recommendedLevel,
      [],
      `Rekomendasi AI (Mood: ${currentMood})`
    );

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
    }, 1500);
  };

  const loadingTextMap = [
    'Menimbang takaran bawang merah...',
    'Memilih cabai rawit segar terbaik...',
    'Mengulek sambal geprek hangat...',
    'Membakar keju mozzarella...',
    'Menganalisis kadar endorfin mood Anda...',
    'Chef AI meramu resep jaya...'
  ];

  return (
    <div className="bg-gradient-to-br from-red-500/10 via-orange-500/5 to-white rounded-3xl border border-red-100 p-6 md:p-10 shadow-inner relative overflow-hidden">
      
      {/* Background visual element */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-red-400/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 rounded-full bg-orange-400/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-500/20">
            <Sparkles className="w-6 h-6 fill-white" />
          </div>
          <div>
            <span className="text-red-600 text-xs font-bold uppercase tracking-wider font-mono">Sambal Sommelier AI</span>
            <h2 className="font-sans font-black text-2xl md:text-3xl text-gray-900 leading-tight">
              Rekomendasi Menu & Level Pedas AI
            </h2>
          </div>
        </div>

        <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 max-w-2xl">
          Bingung mau pesan apa dan tak tahu sanggup level pedas berapa? Biarkan AI kami yang menganalisis toleransi pedas, cita rasa favorit, serta suasana hatimu hari ini untuk meramu pesanan geprek yang paling pas secara instan!
        </p>

        <AnimatePresence mode="wait">
          {loading ? (
            /* Loading State */
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="relative w-24 h-24 mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-4 border-orange-200 border-t-red-600"
                />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-4 rounded-full bg-orange-50 flex items-center justify-center"
                >
                  <Flame className="w-10 h-10 text-red-600 fill-red-500 animate-bounce" />
                </motion.div>
              </div>
              <h3 className="font-sans font-bold text-lg text-gray-800 mb-2">
                Sedang Meramu Kepedasan Anda...
              </h3>
              <p className="text-sm font-mono text-orange-600 font-bold bg-orange-50 px-4 py-1.5 rounded-full border border-orange-100">
                {loadingTextMap[loadingStep]}
              </p>
            </motion.div>
          ) : recommendation && recommendedItem ? (
            /* Results State */
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl border border-red-50 shadow-xl p-6 md:p-8 relative overflow-hidden"
            >
              {/* Badge */}
              <div className="absolute top-0 right-0 bg-red-600 text-white text-[11px] font-sans font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl shadow-sm flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-white" />
                Saran AI Chef
              </div>

              {/* Left: Recommended Item Card */}
              <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-orange-50 pb-6 lg:pb-0 lg:pr-8">
                <div>
                  <span className="text-gray-400 text-xs uppercase font-mono tracking-wider block mb-2">Menu Rekomendasi</span>
                  <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 bg-orange-50 border border-orange-100">
                    <img 
                      src={recommendedItem.image} 
                      alt={recommendedItem.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="font-sans font-extrabold text-xl text-gray-900 mb-1.5">
                    {recommendedItem.name}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">
                    {recommendedItem.description}
                  </p>
                </div>

                <div className="flex items-center justify-between bg-orange-50/50 p-3 rounded-2xl border border-orange-100/50">
                  <span className="text-xs text-gray-500 font-medium">Harga Menu</span>
                  <span className="text-lg font-sans font-black text-red-600">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(recommendedItem.price)}
                  </span>
                </div>
              </div>

              {/* Right: AI Analysis & Why */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  {/* Spiciness Level Recommended */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-xs text-gray-400 uppercase font-mono tracking-wider">Level Pedas Ideal:</div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg font-black text-red-600 bg-red-50 px-3 py-0.5 rounded-xl border border-red-100 flex items-center gap-1">
                        <Flame className="w-4 h-4 fill-red-500 text-red-500" />
                        Level {recommendation.recommendedLevel}
                      </span>
                    </div>
                  </div>

                  {/* Recommendation Reason */}
                  <div className="mb-6 bg-red-50/20 rounded-2xl border border-red-50/50 p-4 relative">
                    <div className="absolute top-3 left-4 text-red-500">
                      <ChefHat className="w-5 h-5" />
                    </div>
                    <div className="pl-7">
                      <h4 className="font-sans font-extrabold text-xs text-red-700 uppercase tracking-wider mb-1">
                        Analisis Chef Sommelier AI:
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed italic">
                        "{recommendation.reasonIndonesian}"
                      </p>
                    </div>
                  </div>

                  {/* Chef Tips */}
                  {recommendation.chefTips && (
                    <div className="mb-6 bg-amber-50/30 rounded-2xl border border-amber-50/50 p-4">
                      <h5 className="font-sans font-extrabold text-xs text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                        💡 Tips Tambahan Chef:
                      </h5>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        {recommendation.chefTips}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddAIOrder}
                    disabled={isSuccess}
                    className={`flex-grow font-sans font-black text-sm py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 shadow-md cursor-pointer ${
                      isSuccess 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white'
                    }`}
                  >
                    {isSuccess ? (
                      <>
                        <Check className="w-5 h-5" />
                        Berhasil Ditambahkan!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4.5 h-4.5" />
                        Pesan Menu Rekomendasi AI Ini
                      </>
                    )}
                  </motion.button>
                  <button
                    onClick={() => setRecommendation(null)}
                    className="bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 font-sans font-bold text-sm py-4 px-6 rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                    Hitung Ulang
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Input Form State */
            <form onSubmit={handleGetRecommendation} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Mood Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Bagaimana perasaan / mood Anda saat ini?
                  </label>
                  <div className="relative">
                    <select
                      value={currentMood}
                      onChange={(e) => setCurrentMood(e.target.value)}
                      className="w-full bg-white border border-orange-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer text-gray-700 appearance-none shadow-sm"
                    >
                      {moods.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Spiciness Tolerance */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Berapa tingkat toleransi pedas Anda?
                  </label>
                  <div className="relative">
                    <select
                      value={chiliTolerance}
                      onChange={(e) => setChiliTolerance(e.target.value as any)}
                      className="w-full bg-white border border-orange-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer text-gray-700 appearance-none shadow-sm"
                    >
                      {tolerances.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      ▼
                    </div>
                  </div>
                </div>
              </div>

              {/* Free Text Favorite Foods */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Sebutkan makanan favorit Anda (misal: "suka keju, suka digoreng, atau gurih manis")
                </label>
                <input
                  type="text"
                  placeholder="Misal: Saya suka ayam krispi kering dengan aroma daun jeruk purut..."
                  value={favoriteFoods}
                  onChange={(e) => setFavoriteFoods(e.target.value)}
                  className="w-full bg-white border border-orange-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Checkbox Preferences */}
              <div>
                <span className="block text-sm font-bold text-gray-800 mb-3">
                  Preferensi Tambahan yang Anda Sukai (Pilih beberapa):
                </span>
                <div className="flex flex-wrap gap-2">
                  {prefOptions.map((pref, idx) => {
                    const isSelected = selectedPrefs.includes(pref);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handlePrefToggle(pref)}
                        className={`font-sans text-xs px-4 py-2.5 rounded-full border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-red-600 border-red-600 text-white font-bold shadow-sm'
                            : 'bg-white border-orange-100 hover:border-orange-300 text-gray-600 shadow-xs'
                        }`}
                      >
                        {pref}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-sans font-black text-base py-4.5 px-10 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-red-500/10 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 fill-white animate-pulse" />
                  Minta Rekomendasi AI Chef
                </motion.button>
              </div>
            </form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
