'use client';

import React, { useState } from 'react';
import { ProductCategory } from '@/types/store';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import CartDrawer from '@/components/layout/CartDrawer';
import WishlistDrawer from '@/components/layout/WishlistDrawer';
import SearchModal from '@/components/layout/SearchModal';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import CategoryGrid from '@/components/sections/CategoryGrid';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import ShopTheLook from '@/components/sections/ShopTheLook';
import BrandPillars from '@/components/sections/BrandPillars';
import FlashDropBanner from '@/components/sections/FlashDropBanner';
import CustomerReviews from '@/components/sections/CustomerReviews';
import InstagramGallery from '@/components/sections/InstagramGallery';
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
    <main className="min-h-screen bg-[#0D0F14] text-white selection:bg-[#D4AF37] selection:text-black">
      {/* Top Announcement Bar — active on all screen sizes */}
      <AnnouncementBar />

      {/* Navigation Header — wired to catalogue filtering */}
      <Navbar onSelectCategory={handleSelectCategory} />

      {/* Main Landing Sections */}
      <HeroSection />
      <BrandPillars />
      <CategoryGrid onSelectCategory={handleSelectCategory} />
      <FeaturedProducts
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <ShopTheLook />
      <FlashDropBanner />
      <CustomerReviews />
      <InstagramGallery />

      {/* Footer */}
      <Footer />

      {/* Global Drawers, Modals & Toast Notification */}
      <CartDrawer />
      <WishlistDrawer />
      <SearchModal />
      <QuickViewModal />
      <ToastNotification />
    </main>
  );
}
