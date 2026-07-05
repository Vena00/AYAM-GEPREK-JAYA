import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Flame, MapPin, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: CartModalProps) {
  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');

  // Format price to Rupiah
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const calculateItemSubtotal = (item: CartItem) => {
    const extrasTotal = item.selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
    return (item.menuItem.price + extrasTotal) * item.quantity;
  };

  const calculateCartSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + calculateItemSubtotal(item), 0);
  };

  const subtotal = calculateCartSubtotal();
  // Free delivery for orders above Rp 50.000
  const deliveryFee = subtotal >= 50000 || subtotal === 0 ? 0 : 10000;
  const total = subtotal + deliveryFee;

  const handleSendWhatsAppOrder = () => {
    if (!customerName.trim() || !address.trim()) return;

    // Generate Indonesian structured text for WhatsApp
    let message = `*HALO AYAM GEPREK JAYA! SAYA INGIN MEMESAN MAKANAN* 🍗🌶️\n\n`;
    message += `*Detail Pesanan:*\n`;
    
    cartItems.forEach((item, idx) => {
      const extrasStr = item.selectedExtras.length > 0 
        ? `\n  └ Topping: ${item.selectedExtras.map(e => e.name).join(', ')}` 
        : '';
      const notesStr = item.notes ? `\n  └ Catatan: "${item.notes}"` : '';
      const spicyStr = item.menuItem.isSpicy ? ` (Level ${item.spicyLevel})` : '';
      
      message += `${idx + 1}. *${item.menuItem.name}${spicyStr}* x ${item.quantity}\n`;
      message += `   Harga: ${formatRupiah(calculateItemSubtotal(item))}${extrasStr}${notesStr}\n\n`;
    });

    message += `--------------------------------------\n`;
    message += `*Ringkasan Belanja:*\n`;
    message += `- Subtotal: ${formatRupiah(subtotal)}\n`;
    message += `- Ongkir: ${deliveryFee === 0 ? 'GRATIS (Promo!)' : formatRupiah(deliveryFee)}\n`;
    message += `- *TOTAL PEMBAYARAN:* *${formatRupiah(total)}*\n\n`;

    message += `--------------------------------------\n`;
    message += `*Data Pengiriman:*\n`;
    message += `👤 *Nama:* ${customerName}\n`;
    message += `📍 *Alamat Kirim:* ${address}\n`;
    message += `💳 *Pembayaran:* ${paymentMethod}\n\n`;
    message += `Mohon segera diproses dan dikonfirmasi pesanannya ya Chef! Terima kasih.`;

    // Encode URL
    const encodedText = encodeURIComponent(message);
    const phoneNumber = "6281234567890"; // Mock restaurant WhatsApp number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    // Open in a new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    // Switch to success view
    setCheckoutStep('success');
  };

  const handleResetCheckout = () => {
    onClearCart();
    setCustomerName('');
    setAddress('');
    setPaymentMethod('COD');
    setCheckoutStep('cart');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black backdrop-blur-xs"
          />

          {/* Slide-over Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl border-l border-orange-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-orange-100 px-6 py-5">
              <div className="flex items-center gap-2">
                <span className="font-sans font-black text-lg text-gray-900 uppercase tracking-tight">
                  {checkoutStep === 'cart' ? 'Keranjang Belanja' : checkoutStep === 'checkout' ? 'Detail Pengiriman' : 'Pesanan Sukses'}
                </span>
                <span className="bg-orange-100 text-orange-600 text-xs font-sans font-extrabold px-2.5 py-1 rounded-full">
                  {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 hover:bg-orange-50 hover:text-gray-600 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main scrollable body */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {checkoutStep === 'cart' && (
                  /* STEP 1: CART VIEW */
                  <motion.div
                    key="step-cart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {cartItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                        <span className="text-4xl mb-3">😋</span>
                        <p className="font-sans font-bold text-sm text-gray-500 mb-1">Wah, keranjangmu masih kosong!</p>
                        <p className="text-xs text-gray-400 max-w-xs leading-relaxed">Yuk kembali ke menu dan pilih geprek jaya kesukaanmu dengan level pedas tergila!</p>
                        <button
                          onClick={onClose}
                          className="mt-6 text-xs font-sans font-bold text-orange-500 hover:text-orange-600 bg-orange-50 px-4 py-2.5 rounded-xl border border-orange-100 cursor-pointer"
                        >
                          Lihat Menu Spesial
                        </button>
                      </div>
                    ) : (
                      cartItems.map((item) => (
                        <motion.div
                          layout
                          key={item.id}
                          className="flex gap-4 p-4 rounded-2xl bg-orange-50/20 border border-orange-100/50 relative overflow-hidden"
                        >
                          {/* Small food pic */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-orange-50 shrink-0 border border-orange-100/30">
                            <img
                              src={item.menuItem.image}
                              alt={item.menuItem.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                              <h4 className="font-sans font-extrabold text-sm text-gray-800 truncate pr-5">
                                {item.menuItem.name}
                              </h4>
                              <button
                                onClick={() => onRemoveItem(item.id)}
                                className="text-gray-400 hover:text-red-500 cursor-pointer shrink-0 absolute top-4 right-4"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Spicy Indicator */}
                            {item.menuItem.isSpicy && (
                              <div className="flex items-center gap-1.5 mb-1 text-[11px] font-sans font-extrabold text-red-600">
                                <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                                Level {item.spicyLevel}
                              </div>
                            )}

                            {/* Extras List */}
                            {item.selectedExtras.length > 0 && (
                              <div className="text-[10px] text-gray-400 font-medium leading-tight mb-2">
                                + Topping: {item.selectedExtras.map(e => e.name.split(' ')[0]).join(', ')}
                              </div>
                            )}

                            {/* Custom Notes */}
                            {item.notes && (
                              <div className="text-[10px] text-gray-400 font-mono italic mb-2 max-w-[200px] truncate">
                                "{item.notes}"
                              </div>
                            )}

                            {/* Qty & Price area */}
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-orange-100">
                              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden scale-90 origin-left">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                  className="p-1.5 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                  <Minus className="w-3 h-3 text-gray-600" />
                                </button>
                                <span className="px-2.5 font-sans font-bold text-xs text-gray-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  className="p-1.5 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3 h-3 text-gray-600" />
                                </button>
                              </div>

                              <span className="font-sans font-black text-sm text-red-600">
                                {formatRupiah(calculateItemSubtotal(item))}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}

                {checkoutStep === 'checkout' && (
                  /* STEP 2: SHIPPING DETAILS FORM */
                  <motion.div
                    key="step-checkout"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider font-mono">Nama Lengkap Penerima:</label>
                      <input
                        type="text"
                        required
                        placeholder="Masukkan nama penerima..."
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full text-sm p-3.5 bg-gray-50 border border-orange-100 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider font-mono">Alamat Lengkap Pengiriman:</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Tuliskan alamat lengkap pengiriman, nomor rumah, RT/RW, kelurahan, kecamatan..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full text-sm p-3.5 bg-gray-50 border border-orange-100 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-700 placeholder-gray-400 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider font-mono">Metode Pembayaran:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['COD', 'Gopay / OVO', 'ShopeePay', 'Transfer Bank'].map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method)}
                            className={`p-3 text-xs font-bold font-sans rounded-xl border text-center transition-all cursor-pointer ${
                              paymentMethod === method
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-gray-100 hover:border-orange-200 text-gray-600 bg-white shadow-xs'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-orange-50 p-4 border border-orange-100 flex items-start gap-2 text-xs text-orange-800 leading-relaxed">
                      <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <span>Semua pesanan diantar hangat-hangat langsung dari penggorengan dapur Ayam Geprek Jaya! Kami siap memanjakan lidah Anda.</span>
                    </div>
                  </motion.div>
                )}

                {checkoutStep === 'success' && (
                  /* STEP 3: ORDER SUCCESS & TRACKING SIMULATION */
                  <motion.div
                    key="step-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-10"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
                    <h3 className="font-sans font-black text-xl text-gray-900 mb-2">Pesanan Dikirim ke WhatsApp!</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-6">
                      Rincian pesanan dan alamat telah dikonversi ke format pesan WhatsApp. Silakan klik kirim di WhatsApp untuk menyelesaikan pesanan dengan admin Ayam Geprek Jaya!
                    </p>

                    <div className="w-full bg-orange-50/50 border border-orange-100 rounded-3xl p-5 mb-8">
                      <span className="text-[10px] font-mono font-bold text-orange-600 uppercase tracking-widest block mb-3">Status Pengiriman Terkini</span>
                      <div className="relative flex flex-col gap-6 pl-6 text-left border-l-2 border-orange-300">
                        <div className="relative">
                          <span className="absolute -left-8.5 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 ring-4 ring-white">
                            ✓
                          </span>
                          <span className="text-xs font-bold text-gray-800 block">Menghubungi Admin</span>
                          <span className="text-[10px] text-gray-400">Pesan WhatsApp terkirim dan siap diproses</span>
                        </div>
                        <div className="relative opacity-60">
                          <span className="absolute -left-8.5 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 ring-4 ring-white text-white font-mono text-[9px]">
                            2
                          </span>
                          <span className="text-xs font-bold text-gray-600 block">Proses Penggilingan Cabe</span>
                          <span className="text-[10px] text-gray-400">Ayam digoreng garing dan digeprek dadakan</span>
                        </div>
                        <div className="relative opacity-60">
                          <span className="absolute -left-8.5 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 ring-4 ring-white text-white font-mono text-[9px]">
                            3
                          </span>
                          <span className="text-xs font-bold text-gray-600 block">Driver Meluncur</span>
                          <span className="text-[10px] text-gray-400">Pesanan diantar hangat dalam kemasan higienis</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleResetCheckout}
                      className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-sans font-bold text-sm py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      Kembali Belanja
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Summary Area */}
            {cartItems.length > 0 && checkoutStep !== 'success' && (
              <div className="border-t border-orange-100 bg-gray-50/50 p-6 space-y-4 shadow-inner">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal Makanan</span>
                    <span className="font-mono">{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Ongkos Kirim (Flat)</span>
                    <span className="font-mono">
                      {deliveryFee === 0 ? (
                        <span className="text-green-600 font-sans font-bold">GRATIS</span>
                      ) : (
                        formatRupiah(deliveryFee)
                      )}
                    </span>
                  </div>
                  {subtotal < 50000 && (
                    <p className="text-[10px] text-orange-600 bg-orange-50 py-1.5 px-2.5 rounded-lg border border-orange-100/50 font-sans text-center">
                      💡 Tambah belanjaan <b>{formatRupiah(50000 - subtotal)}</b> lagi untuk klaim <b>Free Ongkir!</b>
                    </p>
                  )}
                  <div className="border-t border-dashed border-gray-200 my-2 pt-2 flex justify-between font-sans font-black text-base text-gray-900">
                    <span>Total Bayar</span>
                    <span className="text-red-600 font-mono">{formatRupiah(total)}</span>
                  </div>
                </div>

                {/* Checkout Button flow */}
                {checkoutStep === 'cart' ? (
                  <button
                    onClick={() => setCheckoutStep('checkout')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-sans font-black text-sm py-4 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Lanjut Pengisian Alamat
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCheckoutStep('cart')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-sans font-bold text-xs px-4 py-4 rounded-2xl cursor-pointer"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={handleSendWhatsAppOrder}
                      disabled={!customerName.trim() || !address.trim()}
                      className="flex-grow bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-sans font-black text-xs py-4 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-4.5 h-4.5 shrink-0" />
                      Kirim Pesanan ke WhatsApp ({formatRupiah(total)})
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
