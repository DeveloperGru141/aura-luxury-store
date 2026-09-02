'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useStore } from '@/context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, Shield, Truck } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    shipping,
    total,
    freeShippingProgress,
    remainingForFreeShipping,
    formatPrice,
    clearCart,
  } = useStore();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isCartOpen) return null;

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
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={() => {
          setIsCartOpen(false);
          setOrderComplete(false);
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-6 justify-end">
        <div className="w-[100vw] sm:w-screen max-w-[92vw] sm:max-w-md bg-white border-l border-[var(--color-border)] text-[var(--color-text-primary)] shadow-xl flex flex-col justify-between overflow-hidden animate-slide-in">
          <div className="p-4 sm:p-6 border-b border-[var(--color-border)] flex items-center justify-between gap-3 bg-white">
            <div className="flex items-center gap-2 min-w-0">
              <ShoppingBag className="w-5 h-5 text-[var(--color-accent-gold)] shrink-0" />
              <h2 className="font-serif text-base sm:text-lg font-medium truncate">Shopping Bag</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-[var(--color-text-secondary)] shrink-0">
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setOrderComplete(false);
              }}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] transition-colors shrink-0"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-[var(--color-surface-alt)] p-4 border-b border-[var(--color-border)]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              {remainingForFreeShipping > 0 ? (
                <span className="text-[var(--color-text-secondary)] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[var(--color-accent-gold)]" />
                  Add <strong className="text-[var(--color-text-primary)]">{formatPrice(remainingForFreeShipping)}</strong> for free shipping
                </span>
              ) : (
                <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  You&apos;ve unlocked free shipping!
                </span>
              )}
              <span className="font-bold text-[11px] text-[var(--color-text-tertiary)]">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[var(--color-border)]">
              <div
                className="h-full bg-[var(--color-accent-gold)] transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-3 sm:space-y-4 pb-[env(safe-area-inset-bottom)] bg-[var(--color-surface-alt)]">
            {orderComplete ? (
              <div className="py-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-medium mb-2 text-[var(--color-text-primary)]">Order Confirmed</h3>
                <p className="text-xs text-[var(--color-text-tertiary)] max-w-xs mb-6 leading-relaxed">
                  Thank you for shopping with OMO ESHO SIGNATURES. A confirmation email and tracking docket have been dispatched.
                </p>
                <button
                  onClick={() => {
                    setOrderComplete(false);
                    setIsCartOpen(false);
                  }}
                  className="px-6 py-2.5 rounded-full bg-white border border-[var(--color-border)] hover:border-[var(--color-text-primary)] text-xs font-semibold transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-white border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-tertiary)] mb-3 shadow-sm">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Your bag is empty</h3>
                <p className="text-xs text-[var(--color-text-tertiary)] max-w-xs mb-6">
                  Discover OMO ESHO SIGNATURES leather accessories, fine wears, and luxury wristwatches.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold-hover)] text-black text-xs font-bold shadow-sm active:scale-[0.97] transition-all"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                  className="flex gap-4 p-3 rounded-2xl bg-white border border-[var(--color-border)] hover:border-[var(--color-accent-gold)]/30 hover:shadow-sm transition-all"
                >
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[var(--color-surface-alt)] shrink-0 border border-[var(--color-border)]">
                    <Image
                      src={item.product.primaryImage}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-medium text-sm text-[var(--color-text-primary)] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                          className="text-[var(--color-text-tertiary)] hover:text-rose-500 hover:bg-rose-50 rounded-full p-1.5 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5 space-x-2">
                        <span>{item.selectedColor}</span>
                        {item.selectedSize && <span>&bull; Size {item.selectedSize}</span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center rounded-full border border-[var(--color-border)] bg-white p-1 shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedColor, item.selectedSize, -1)}
                          className="w-7 h-7 flex items-center justify-center text-xs hover:bg-[var(--color-surface-alt)] rounded-full transition-colors text-[var(--color-text-secondary)]"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-[var(--color-text-primary)]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedColor, item.selectedSize, 1)}
                          className="w-7 h-7 flex items-center justify-center text-xs hover:bg-[var(--color-surface-alt)] rounded-full transition-colors text-[var(--color-text-secondary)]"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[var(--color-text-primary)]">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && !orderComplete && (
            <div className="p-4 sm:p-6 border-t border-[var(--color-border)] bg-white space-y-3 sm:space-y-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="space-y-1.5 text-xs text-[var(--color-text-secondary)]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[var(--color-text-primary)] font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Courier Shipping</span>
                  <span className="text-[var(--color-text-primary)] font-medium">
                    {shipping === 0 ? 'Complimentary' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[var(--color-text-primary)] pt-2 border-t border-[var(--color-border)]">
                  <span>Total Due</span>
                  <span className="text-base font-bold">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3.5 px-4 rounded-full bg-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold-hover)] active:scale-[0.97] text-black font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
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

              <div className="flex items-center justify-center gap-2 text-[10px] text-[var(--color-text-tertiary)]">
                <Shield className="w-3.5 h-3.5 text-[var(--color-accent-gold)]" />
                <span>256-Bit Encrypted Checkout &bull; Maison Verified Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
