import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Plus, Check, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomerReview } from '../types';
import { MENU_ITEMS } from '../data';

export default function ReviewSection() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [spicyLevel, setSpicyLevel] = useState(3);
  const [orderedItem, setOrderedItem] = useState('Ayam Geprek Original Jaya');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          rating,
          comment,
          spicyLevel,
          orderedItem
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setShowForm(false);
          // Clear inputs
          setName('');
          setRating(5);
          setComment('');
          setSpicyLevel(3);
          setOrderedItem('Ayam Geprek Original Jaya');
          fetchReviews(); // Refresh
        }, 1200);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Review stats header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-50 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-sans font-black text-2xl text-gray-900 leading-tight">
              Ulasan Pengunjung Toko
            </h2>
            <p className="text-gray-500 text-sm">
              Apa kata mereka yang sudah merasakan sengatan dahsyat Ayam Geprek Jaya?
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-sans font-bold text-sm py-3 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tulis Ulasan Anda
        </button>
      </div>

      {/* Review Form Drawer/Accordion */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-orange-50/50 rounded-3xl border border-orange-100/50 p-6 shadow-inner"
          >
            <h3 className="font-sans font-extrabold text-base text-gray-900 mb-4">
              Bagikan Pengalaman Pedasmu!
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Anda:</label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama Anda..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-sm p-3 bg-white border border-orange-100 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Menu yang Dipesan:</label>
                  <select
                    value={orderedItem}
                    onChange={(e) => setOrderedItem(e.target.value)}
                    className="w-full text-sm p-3 bg-white border border-orange-100 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-gray-700 cursor-pointer"
                  >
                    {MENU_ITEMS.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Rating selection stars */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Rating:</label>
                  <div className="flex items-center gap-1.5 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chili level slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-gray-700">Level Pedas yang Anda Makan:</label>
                    <span className="text-xs font-mono font-black text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-lg">
                      Lv {spicyLevel}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={spicyLevel}
                    onChange={(e) => setSpicyLevel(Number(e.target.value))}
                    className="w-full accent-red-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Ulasan/Komentar:</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ceritakan seberapa renyah ayamnya dan seberapa nagih sambalnya..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-sm p-3 bg-white border border-orange-100 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-gray-700 placeholder-gray-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-xs font-bold text-gray-400 hover:text-gray-600 px-4 py-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className={`font-sans font-bold text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                    isSuccess 
                      ? 'bg-green-600 text-white' 
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {isSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      Ulasan Terkirim!
                    </>
                  ) : (
                    <>
                      Kirim Ulasan Spesial
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400 font-sans text-sm">
            Belum ada ulasan. Jadilah yang pertama memberikan ulasan!
          </div>
        ) : (
          reviews.map((review, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              key={review.id}
              className="bg-white p-6 rounded-3xl border border-orange-50 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Header info */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-sans font-black text-gray-900 text-base">{review.name}</h4>
                    <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                      Memesan: <span className="text-orange-600 font-bold">{review.orderedItem}</span>
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {/* Stars */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    {/* Chili badge */}
                    {review.spicyLevel > 0 && (
                      <span className="text-[9px] font-sans font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5 fill-red-500 text-red-500" />
                        Pedas Lv {review.spicyLevel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Comment body */}
                <p className="text-gray-600 text-sm leading-relaxed italic mb-4">
                  "{review.comment}"
                </p>
              </div>

              {/* Date footer */}
              <div className="text-[10px] font-mono text-gray-400 text-right">
                {review.date}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
