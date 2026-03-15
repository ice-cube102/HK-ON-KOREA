/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Globe, Menu, Search, ArrowRight, Phone, FileText, MonitorPlay, Users, Building2 } from 'lucide-react';
import { PRODUCTS, Product, TRANSLATIONS, LANGUAGES, NOTICES } from './constants';

export default function App() {
  const [currentLang, setCurrentLang] = useState('ko');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const navItems = [
    t.company, t.products, t.support, t.resources, t.ir, t.csr, t.infoCenter, t.careers
  ];

  const quickLinks = [
    { icon: <FileText size={32} />, title: t.inquiry, desc: "Expert consultation" },
    { icon: <MonitorPlay size={32} />, title: t.remoteSupport, desc: "1:1 Remote help" },
    { icon: <Building2 size={32} />, title: "HK Insight", desc: "Smart monitoring" },
    { icon: <Phone size={32} />, title: t.customerSupport, desc: "1588-1285" },
    { icon: <Users size={32} />, title: t.training, desc: "Customized training" },
  ];

  // Auto-slide hero
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const heroImages = [
    "https://images.unsplash.com/photo-1505935428862-770b6f24f629?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=2000&auto=format&fit=crop"
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Bar */}
      <div className="hidden lg:flex justify-end items-center px-8 py-2 border-b border-gray-100 text-xs text-gray-500 gap-6">
        <a href="#" className="hover:text-emerald-600 transition-colors">HK Insight</a>
        <a href="#" className="hover:text-emerald-600 transition-colors">Remote Support</a>
        <div className="relative">
          <button 
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="flex items-center gap-1 hover:text-emerald-600 transition-colors uppercase"
          >
            <Globe size={14} /> {currentLang}
          </button>
          {isLangMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-100 shadow-lg rounded-md overflow-hidden z-50">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setCurrentLang(lang.code);
                    setIsLangMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-3xl font-bold tracking-tighter text-emerald-800">
            HK ON
          </div>
          
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item, idx) => (
              <a key={idx} href="#" className="text-[15px] font-medium text-gray-800 hover:text-emerald-600 transition-colors">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-emerald-600 transition-colors">
              <Search size={20} />
            </button>
            <button 
              className="lg:hidden p-2 text-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navItems.map((item, idx) => (
                <a key={idx} href="#" className="text-lg font-medium text-gray-800">
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Slider */}
      <section className="relative h-[600px] lg:h-[800px] overflow-hidden bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeSlide}
            src={heroImages[activeSlide]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <motion.div
              key={`text-${activeSlide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl text-white"
            >
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                {t.heroTitle}
              </h1>
              <p className="text-xl lg:text-2xl font-light text-gray-200 mb-10">
                {t.heroSubtitle}
              </p>
              <button className="px-8 py-4 bg-emerald-600 text-white font-medium rounded-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">
                {t.exploreProducts} <ArrowRight size={20} />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-10 left-0 w-full">
          <div className="max-w-7xl mx-auto px-6 flex gap-3">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-12 h-1 transition-all ${activeSlide === idx ? 'bg-emerald-500' : 'bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-x divide-y lg:divide-y-0 divide-gray-200">
            {quickLinks.map((link, idx) => (
              <a key={idx} href="#" className="flex flex-col items-center text-center p-10 hover:bg-white transition-colors group">
                <div className="text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                  {link.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{link.title}</h3>
                <p className="text-sm text-gray-500">{link.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.products}</h2>
            <p className="text-gray-500">Discover HK ON's premium food lineup</p>
          </div>
          <a href="#" className="hidden md:flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700">
            {t.readMore} <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-6 bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name[currentLang] || product.name.en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {product.name[currentLang] || product.name.en}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {product.description[currentLang] || product.description.en}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 group-hover:gap-2 transition-all">
                {t.exploreProducts} <ChevronRight size={16} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Notice & PR Section */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          {/* Notice Board */}
          <div>
            <div className="flex justify-between items-center mb-8 border-b-2 border-gray-900 pb-4">
              <h2 className="text-2xl font-bold text-gray-900">{t.notice}</h2>
              <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
            <ul className="divide-y divide-gray-200">
              {NOTICES.map((notice) => (
                <li key={notice.id}>
                  <a href="#" className="py-4 flex justify-between items-center group hover:bg-gray-100/50 transition-colors -mx-4 px-4 rounded-lg">
                    <span className="text-gray-800 font-medium group-hover:text-emerald-600 transition-colors line-clamp-1 pr-4">
                      {notice.title[currentLang as keyof typeof notice.title] || notice.title.en}
                    </span>
                    <span className="text-sm text-gray-500 flex-shrink-0">{notice.date}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* PR Banner */}
          <div className="relative rounded-2xl overflow-hidden h-[300px] lg:h-auto group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop" 
              alt="Corporate PR"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <div className="inline-block px-3 py-1 bg-emerald-600 text-white text-xs font-bold mb-3 rounded-sm">
                PR CENTER
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                HK ON's Commitment to Sustainability
              </h3>
              <p className="text-gray-300 text-sm">
                Discover how we are building a healthier future for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-3xl font-bold tracking-tighter text-white mb-6">
                HK ON
              </div>
              <p className="text-sm leading-relaxed mb-6">
                Delivering the purest ingredients from nature to your table. We believe in the power of healthy, delicious food.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">{t.company}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.products}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.support}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.careers}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Customer Center</h4>
              <div className="text-2xl font-bold text-emerald-500 mb-2">1588-1285</div>
              <p className="text-sm mb-4">Weekdays 09:00 - 18:00<br/>(Closed on Weekends & Holidays)</p>
              <a href="mailto:contact@hkon.com" className="text-sm hover:text-white transition-colors">contact@hkon.com</a>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Global Network</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <a href="#" className="hover:text-white transition-colors">Korea (HQ)</a>
                <a href="#" className="hover:text-white transition-colors">USA</a>
                <a href="#" className="hover:text-white transition-colors">Japan</a>
                <a href="#" className="hover:text-white transition-colors">China</a>
                <a href="#" className="hover:text-white transition-colors">Europe</a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="flex gap-6">
              <a href="#" className="text-white font-medium hover:text-emerald-400 transition-colors">{t.privacyPolicy}</a>
              <a href="#" className="hover:text-white transition-colors">{t.termsOfService}</a>
              <a href="#" className="hover:text-white transition-colors">{t.sitemap}</a>
              <a href="#" className="hover:text-white transition-colors">{t.location}</a>
            </div>
            <p>{t.footerText}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

