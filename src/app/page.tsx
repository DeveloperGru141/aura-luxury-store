'use client';

import React, { useState } from 'react';
import { ProductCategory } from '@/types/store';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import WishlistDrawer from '@/components/layout/WishlistDrawer';
import SearchModal from '@/components/layout/SearchModal';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import CategoryGrid from '@/components/sections/CategoryGrid';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import ShopTheLook from '@/components/sections/ShopTheLook';
import QuickViewModal from '@/components/ui/QuickViewModal';
import ToastNotification from '@/components/ui/ToastNotification';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');

  const handleSelectCategory = (cat: ProductCategory) => {
    setActiveCategory(cat);
    const catalogueEl = document.getElementById('catalogue');
    if (catalogueEl) {
      catalogueEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-surface)] text-[var(--color-text-primary)] selection:bg-[var(--color-accent-gold)] selection:text-black">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Navigation Header — wired to catalogue filtering */}
      <Navbar onSelectCategory={handleSelectCategory} />

      {/* Main Landing Sections */}
      <HeroSection />
      <CategoryGrid onSelectCategory={handleSelectCategory} />
      <FeaturedProducts
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      {/* Curated Living Lookbook Section */}
      <ShopTheLook />

      {/* Footer */}
      <Footer />

      {/* Global Modals & Toast Notification */}
      <WishlistDrawer />
      <SearchModal />
      <QuickViewModal />
      <ToastNotification />
    </main>
  );
}
