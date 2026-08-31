'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, WishlistItem, PromoCode } from '@/types/store';

const PROMO_CODES: PromoCode[] = [
  { code: 'OMOESHO15', discountPercent: 15, description: '15% Off Your Entire Order' },
  { code: 'WELCOME10', discountPercent: 10, description: '10% Off For First-Time Shoppers' },
  { code: 'VIP20', discountPercent: 20, description: '20% Off Orders Above ₦500,000', minSpend: 500000 },
];

export type Currency = 'NGN' | 'USD' | 'GBP';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  NGN: '₦',
  USD: '$',
  GBP: '£',
};

// Base price in Nigerian Naira (NGN)
const CURRENCY_RATES: Record<Currency, number> = {
  NGN: 1.0,
  USD: 1 / 1550,
  GBP: 1 / 1950,
};

const FREE_SHIPPING_THRESHOLD = 250000; // ₦250,000 for free nationwide shipping

interface ToastInfo {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface StoreContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isSearchOpen: boolean;
  quickViewProduct: Product | null;
  currency: Currency;
  appliedPromo: PromoCode | null;
  toasts: ToastInfo[];
  isAdminLoggedIn: boolean;

  // Actions
  setIsCartOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setCurrency: (curr: Currency) => void;
  setIsAdminLoggedIn: (value: boolean) => void;

  addToCart: (product: Product, color?: string, size?: string, quantity?: number) => void;
  removeFromCart: (productId: string, selectedColor: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, selectedColor: string, selectedSize: string | undefined, delta: number) => void;
  clearCart: () => void;

  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  applyPromoCode: (codeStr: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  formatPrice: (amountInNGN: number) => string;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Computed values
  cartItemCount: number;
  subtotal: number;
  discountAmount: number;
  shipping: number;
  total: number;
  freeShippingProgress: number;
  remainingForFreeShipping: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('omo_esho_signatures_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('omo_esho_signatures_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('omo_esho_signatures_cart', JSON.stringify(cart));
    } catch {
      // Ignore storage errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('omo_esho_signatures_wishlist', JSON.stringify(wishlist));
    } catch {
      // Ignore storage errors
    }
  }, [wishlist]);

  // Check for admin login from localStorage
  useEffect(() => {
    try {
      const savedAdmin = localStorage.getItem('omo_esho_signatures_admin_logged_in');
      if (savedAdmin === 'true') setIsAdminLoggedIn(true);
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save admin login state
  useEffect(() => {
    try {
      localStorage.setItem('omo_esho_signatures_admin_logged_in', isAdminLoggedIn.toString());
    } catch {
      // Ignore storage errors
    }
  }, [isAdminLoggedIn]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: Product, color?: string, size?: string, quantity: number = 1) => {
    const chosenColor = color || (product.colors.length > 0 ? product.colors[0].name : 'Standard');
    const chosenSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === chosenColor &&
          item.selectedSize === chosenSize
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedColor: chosenColor, selectedSize: chosenSize }];
      }
    });

    showToast(`Added "${product.name}" to shopping bag`, 'success');
  };

  const removeFromCart = (productId: string, selectedColor: string, selectedSize?: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(item.product.id === productId && item.selectedColor === selectedColor && item.selectedSize === selectedSize)
      )
    );
  };

  const updateQuantity = (
    productId: string,
    selectedColor: string,
    selectedSize: string | undefined,
    delta: number
  ) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          ) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    const isSaved = wishlist.some((item) => item.product.id === product.id);
    if (isSaved) {
      setWishlist((prev) => prev.filter((item) => item.product.id !== product.id));
      showToast(`Removed from your wishlist`, 'info');
    } else {
      setWishlist((prev) => [...prev, { product, addedAt: new Date() }]);
      showToast(`Saved "${product.name}" to your wishlist`, 'success');
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.product.id === productId);
  };

  const applyPromoCode = (codeStr: string) => {
    const trimmed = codeStr.trim().toUpperCase();
    const found = PROMO_CODES.find((p) => p.code === trimmed);

    if (!found) {
      return { success: false, message: 'Invalid promo code. Try "OMOESHO15" or "WELCOME10"' };
    }

    if (found.minSpend && subtotal < found.minSpend) {
      return {
        success: false,
        message: `Promo code requires a minimum spend of ${formatPrice(found.minSpend)}`,
      };
    }

    setAppliedPromo(found);
    showToast(`Promo code "${found.code}" applied: ${found.discountPercent}% OFF!`, 'success');
    return { success: true, message: `Promo code applied (${found.discountPercent}% OFF)` };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Promo code removed', 'info');
  };

  const formatPrice = (amountInNGN: number) => {
    const rate = CURRENCY_RATES[currency] || 1;
    const symbol = CURRENCY_SYMBOLS[currency] || '₦';
    const converted = amountInNGN * rate;
    
    if (currency === 'NGN') {
      return `${symbol}${Math.round(converted).toLocaleString('en-NG')}`;
    }
    return `${symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const discountAmount = appliedPromo ? (subtotal * appliedPromo.discountPercent) / 100 : 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 15000;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        isWishlistOpen,
        isSearchOpen,
        quickViewProduct,
        currency,
        appliedPromo,
        toasts,
        isAdminLoggedIn,
        setIsCartOpen,
        setIsWishlistOpen,
        setIsSearchOpen,
        setQuickViewProduct,
        setCurrency,
        setIsAdminLoggedIn,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyPromoCode,
        removePromoCode,
        formatPrice,
        showToast,
        removeToast,
        cartItemCount,
        subtotal,
        discountAmount,
        shipping,
        total,
        freeShippingProgress,
        remainingForFreeShipping,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
