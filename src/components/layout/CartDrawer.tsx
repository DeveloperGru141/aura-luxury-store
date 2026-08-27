'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useStore } from '@/context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Check, Shield, Truck } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    shipping,
    total,
    freeShippingProgress,
    remainingForFreeShipping,
    formatPrice,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    clearCart,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput) return;
    const res = applyPromoCode(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoInput('');
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#F3E5AB', '#ffffff', '#AA7C11'],
    });

    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      clearCart();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => {
          setIsCartOpen(false);
          setOrderComplete(false);
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#11141A] border-l border-white/10 text-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-lg font-medium">Shopping Bag</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setOrderComplete(false);
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#171B24] p-4 border-b border-white/5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              {remainingForFreeShipping > 0 ? (
                <span className="text-gray-300 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Add <strong className="text-[#F3E5AB]">{formatPrice(remainingForFreeShipping)}</strong> for Complimentary Express Shipping
                </span>
              ) : (
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  You&apos;ve unlocked Complimentary Worldwide Express Shipping!
                </span>
              )}
              <span className="font-bold text-[11px] text-gray-400">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E2C366] transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {orderComplete ? (
              <div className="py-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-medium mb-2">Order Confirmed</h3>
                <p className="text-xs text-gray-300 max-w-xs mb-6 leading-relaxed">
                  Thank you for shopping with AURA. A confirmation email and tracking docket have been dispatched.
                </p>
                <button
                  onClick={() => {
                    setOrderComplete(false);
                    setIsCartOpen(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-3">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-medium text-gray-200 mb-1">Your bag is empty</h3>
                <p className="text-xs text-gray-400 max-w-xs mb-6">
                  Discover timeless leather accessories, high-jewelry, and fine timepieces.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black text-xs font-bold uppercase tracking-wider"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                  className="flex gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                    <Image
                      src={item.product.primaryImage}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-serif text-sm font-medium text-white line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                          className="text-gray-500 hover:text-rose-400 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5 space-x-2">
                        <span>{item.selectedColor}</span>
                        {item.selectedSize && <span>&bull; Size {item.selectedSize}</span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Buttons */}
                      <div className="flex items-center rounded-lg border border-white/10 bg-black/30 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedColor, item.selectedSize, -1)}
                          className="w-6 h-6 flex items-center justify-center text-xs hover:bg-white/10 rounded transition-colors text-gray-300"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedColor, item.selectedSize, 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs hover:bg-white/10 rounded transition-colors text-gray-300"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-semibold text-[#F3E5AB]">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Checkout */}
          {cart.length > 0 && !orderComplete && (
            <div className="p-6 border-t border-white/10 bg-[#0C0E12] space-y-4">
              {/* Promo Code Box */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs">
                    <span className="text-emerald-300 font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Code &ldquo;{appliedPromo.code}&rdquo; Applied ({appliedPromo.discountPercent}% OFF)
                    </span>
                    <button
                      onClick={removePromoCode}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo Code (e.g. LUXE15)"
                      className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 uppercase tracking-wider outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-gray-200 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && <p className="text-[11px] text-rose-400 mt-1">{promoError}</p>}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Courier Shipping</span>
                  <span className="text-white font-medium">
                    {shipping === 0 ? 'Complimentary' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-white/10">
                  <span>Total Due</span>
                  <span className="text-base font-bold text-[#F3E5AB]">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E2C366] to-[#B38F24] text-black font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-xl shadow-[#D4AF37]/10"
              >
                {isCheckingOut ? (
                  <span>Processing Secure Payment...</span>
                ) : (
                  <>
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500">
                <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>256-Bit Encrypted Checkout &bull; Maison Verified Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
