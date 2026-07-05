import React, { useState } from 'react';
import { Flame, Plus, Minus, Check, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem, ExtraItem } from '../types';
import { EXTRAS_OPTIONS } from '../data';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number, spicyLevel: number, selectedExtras: ExtraItem[], notes: string) => void;
}

export default function MenuCard({ item, onAddToCart }: MenuCardProps) {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [spicyLevel, setSpicyLevel] = useState(3); // Default level 3
  const [selectedExtras, setSelectedExtras] = useState<ExtraItem[]>([]);
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Format price to Rupiah
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleExtraToggle = (extra: ExtraItem) => {
    if (selectedExtras.some((e) => e.name === extra.name)) {
      setSelectedExtras(selectedExtras.filter((e) => e.name !== extra.name));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const calculateTotalPrice = () => {
    const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
    return (item.price + extrasTotal) * quantity;
  };

  const handleSubmit = () => {
    onAddToCart(item, quantity, item.isSpicy ? spicyLevel : 0, selectedExtras, notes);
    
    // Trigger quick success animation
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsCustomizing(false);
      // Reset values
      setQuantity(1);
      setSpicyLevel(3);
      setSelectedExtras([]);
      setNotes('');
    }, 1200);
  };

  // Describe spicy level dynamically
  const getSpicyDescription = (level: number) => {
    if (level === 0) return { label: 'Biasa (Tidak Pedas)', color: 'text-gray-500 bg-gray-100' };
    if (level <= 2) return { label: 'Sedang (Pedas Tipis-Tipis)', color: 'text-green-600 bg-green-50 border-green-100' };
    if (level <= 5) return { label: 'Mantap (Pedas Normal Pas)', color: 'text-orange-600 bg-orange-50 border-orange-100' };
    if (level <= 8) return { label: 'Gokil (Pedas Kebakar)', color: 'text-red-600 bg-red-50 border-red-100' };
    return { label: 'Jaya Extreme (Awas Kepala Botak!)', color: 'text-purple-600 bg-purple-50 border-purple-100 animate-pulse' };
  };

  const spicyInfo = getSpicyDescription(spicyLevel);

  return (
    <motion.div 
      layout
      className="bg-white rounded-3xl border border-orange-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full relative"
    >
      {/* Product Image & Tags */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-orange-50">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {item.tags?.map((tag, idx) => (
            <span 
              key={idx} 
              className="bg-red-600/90 backdrop-blur-md text-white text-[11px] font-sans font-bold px-2.5 py-1 rounded-full shadow-sm"
            >
              {tag}
            </span>
          ))}
          {item.isSpicy && (
            <span className="bg-amber-500/90 backdrop-blur-md text-white text-[11px] font-sans font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center">
              <Flame className="w-3.5 h-3.5 fill-white text-white mr-1" />
              Custom Pedas
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-sans font-extrabold text-lg text-gray-900 leading-snug">
              {item.name}
            </h3>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
            {item.description}
          </p>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-gray-400 text-xs font-medium">Harga mulai dari</span>
            <span className="text-xl font-sans font-black text-red-600">
              {formatRupiah(item.price)}
            </span>
          </div>

          {/* Customizing Action Area */}
          <AnimatePresence mode="wait">
            {!isCustomizing ? (
              <motion.button
                key="btn-order"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCustomizing(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-sans font-extrabold text-sm py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Pilih & Atur Pedas
              </motion.button>
            ) : (
              <motion.div
                key="custom-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-orange-50 pt-4"
              >
                {/* Spiciness Slider */}
                {item.isSpicy && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-gray-700 text-xs font-bold flex items-center gap-1">
                        <Flame className="w-4 h-4 text-red-500" />
                        Pilih Level Cabe:
                      </span>
                      <span className="text-sm font-black text-red-600 bg-red-50 px-2.5 py-0.5 rounded-lg border border-red-100">
                        Lv {spicyLevel}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="10" 
                      value={spicyLevel} 
                      onChange={(e) => setSpicyLevel(Number(e.target.value))}
                      className="w-full accent-red-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-1">
                      <span>0 (No Cabe)</span>
                      <span>5 (Sedap)</span>
                      <span>10 (Juara)</span>
                    </div>
                    <div className={`mt-2 text-center text-[11px] font-sans font-bold py-1 px-2.5 rounded-xl border text-ellipsis overflow-hidden ${spicyInfo.color}`}>
                      {spicyInfo.label}
                    </div>
                  </div>
                )}

                {/* Extra Toppings */}
                <div className="mb-4">
                  <span className="text-gray-700 text-xs font-bold block mb-2">
                    Topping Tambahan (Opsional):
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {EXTRAS_OPTIONS.slice(0, 4).map((extra, idx) => {
                      const isSelected = selectedExtras.some((e) => e.name === extra.name);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleExtraToggle(extra)}
                          className={`text-left text-[11px] p-2 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                            isSelected 
                              ? 'border-orange-500 bg-orange-50 font-bold text-orange-700' 
                              : 'border-gray-100 hover:border-orange-200 text-gray-600 bg-gray-50/50'
                          }`}
                        >
                          <span className="truncate">{extra.name.split(' ')[0]}</span>
                          <span className="text-gray-400 font-mono text-[9px] shrink-0">+{extra.price/1000}k</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Special Notes */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Catatan (misal: sambal dipisah...)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-700"
                  />
                </div>

                {/* Quantity & Add Button */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shrink-0">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2.5 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                    <span className="px-3.5 font-sans font-bold text-sm text-gray-800">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2.5 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSuccess}
                    className={`flex-grow font-sans font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                      isSuccess 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {isSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        Sukses Ditambah!
                      </>
                    ) : (
                      <>
                        Tambah ({formatRupiah(calculateTotalPrice())})
                      </>
                    )}
                  </button>
                </div>

                {/* Cancel button */}
                <button
                  type="button"
                  onClick={() => setIsCustomizing(false)}
                  className="w-full text-center text-[11px] text-gray-400 hover:text-gray-600 font-sans mt-3 cursor-pointer"
                >
                  Batal
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
