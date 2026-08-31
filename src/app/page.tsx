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
import VideoShowcase from '@/components/sections/VideoShowcase';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import ShopTheLook from '@/components/sections/ShopTheLook';
import BrandPillars from '@/components/sections/BrandPillars';
import CustomerReviews from '@/components/sections/CustomerReviews';
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
    <main className="min-h-screen bg-[#121212] text-white selection:bg-[#D4AF37] selection:text-black">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Navigation Header — wired to catalogue filtering */}
      <Navbar onSelectCategory={handleSelectCategory} />

      {/* Main Landing Sections — editorial flow with warm atelier break */}
      <HeroSection />
      <BrandPillars />
      <CategoryGrid onSelectCategory={handleSelectCategory} />
      <VideoShowcase />
      <FeaturedProducts
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      {/* Curated Living Lookbook Section — asymmetrical */}
      <ShopTheLook />
      <CustomerReviews />

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
