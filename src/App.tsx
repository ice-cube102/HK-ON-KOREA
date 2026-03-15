/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Globe, Menu, Search, ArrowRight, Phone, FileText, MonitorPlay, Users, Building2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { PRODUCTS, Product, TRANSLATIONS, LANGUAGES } from './constants';
import { AccordionMenu } from './components/AccordionMenu';
// import companyLogo from './images/company.png'; // Removed due to missing file
import NOTICES from './announcement/notices.json';

const Modal = ({ isOpen, onClose, title, content, images }: { isOpen: boolean; onClose: () => void; title: string; content: string; images?: string[] }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white/95 backdrop-blur-md border border-gray-100 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-white/95 py-2 z-10">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
          </div>
          {images && images.length > 0 ? (
            <div className="flex flex-col gap-4">
              {images.map((img, idx) => (
                <img key={idx} src={img} alt={`${title} detail ${idx + 1}`} className="w-full h-auto rounded-xl" referrerPolicy="no-referrer" />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 leading-relaxed">{content}</p>
          )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function App() {
  const [currentLang, setCurrentLang] = useState('ko');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [modal, setModal] = useState<{ isOpen: boolean; title: string; content: string; images?: string[] }>({ isOpen: false, title: '', content: '' });

  const t = TRANSLATIONS.ko;

  const openModal = (title: string, content: string, images?: string[]) => setModal({ isOpen: true, title, content, images });

  const navItems = [
    t.company, t.products, t.support, t.resources, t.ir, t.csr, t.infoCenter, t.careers
  ];

  const menuData: { [key: string]: string[] } = {
    [t.company]: ["CEO", "회사개요", "회사연혁", "CI소개"],
    [t.products]: ["제품1", "제품2", "제품3"],
    [t.support]: ["FAQ", "문의하기", "다운로드"],
    [t.resources]: ["기술자료", "뉴스", "블로그"],
    [t.ir]: ["재무정보", "공시자료"],
    [t.csr]: ["사회공헌활동", "환경경영"],
    [t.infoCenter]: ["공지사항", "이벤트"],
    [t.careers]: ["채용공고", "인재상"]
  };

  const quickLinks = [
    { icon: <FileText size={32} />, title: t.inquiry, desc: "Expert consultation" },
    { icon: <MonitorPlay size={32} />, title: t.remoteSupport, desc: "1:1 Remote help" },
    { icon: <Building2 size={32} />, title: "에이치케이온 Insight", desc: "Smart monitoring" },
    { icon: <Phone size={32} />, title: t.customerSupport, desc: "1588-1285" },
    { icon: <Users size={32} />, title: t.training, desc: "Customized training" },
  ];

  // Auto-slide hero (Disabled as there is only one image now)
  /*
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  */

  const heroImages = [
    "/images/company.png"
  ];


  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-emerald-500 selection:text-white flex">
      {/* New Left Sidebar */}
      <motion.div 
        animate={{ width: isSidebarOpen ? 224 : 80 }}
        className="border-r border-gray-100 py-10 hidden lg:flex flex-col items-center overflow-hidden flex-shrink-0 bg-white relative"
      >
        <div className={`flex w-full px-6 mb-12 ${isSidebarOpen ? 'justify-between' : 'justify-center'} items-center`}>
          {isSidebarOpen && <div className="text-emerald-600 font-bold text-2xl whitespace-nowrap">에이치케이온</div>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-md transition-colors">
            <Menu size={24} className="text-gray-700" />
          </button>
        </div>
        
        <div className="flex flex-col gap-4 w-full px-6">
          {navItems.map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => openModal(item, `${item} page content.`)} 
              className={`text-lg font-medium text-gray-800 text-left py-2 hover:text-emerald-600 transition-colors whitespace-nowrap ${!isSidebarOpen && 'hidden'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="flex-1 overflow-x-hidden">
        <Modal {...modal} onClose={() => setModal({ ...modal, isOpen: false })} />

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: '100vh' }}
              exit={{ opacity: 0, height: 0 }}
              className="fixed inset-0 z-50 bg-white border-b border-gray-100 overflow-y-auto"
            >
              <div className="px-6 py-4 flex flex-col gap-4 pb-20">
                <button onClick={() => setIsMobileMenuOpen(false)} className="self-end p-2"><X size={24} /></button>
                {navItems.map((item, idx) => {
                  if (menuData[item]) {
                    return (
                      <AccordionMenu 
                        key={idx} 
                        title={item} 
                        items={menuData[item]} 
                        isOpen={openAccordion === item}
                        onToggle={() => setOpenAccordion(openAccordion === item ? null : item)}
                        openModal={(t, c) => { openModal(t, c); setIsMobileMenuOpen(false); }} 
                      />
                    );
                  }
                  return (
                    <button key={idx} onClick={() => { openModal(item, `${item} page content.`); setIsMobileMenuOpen(false); }} className="text-lg font-medium text-gray-800 text-left py-2">
                      {item}
                    </button>
                  );
                })}
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

          {/* Header inside Hero */}
          <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
            <div className="text-3xl font-bold tracking-tighter text-emerald-800">
              에이치케이온 코리아
            </div>
            <div className="flex items-center gap-6 text-white text-sm font-medium">
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-emerald-400" />
                {LANGUAGES.map((lang, idx) => (
                  <React.Fragment key={lang.code}>
                    <button 
                      onClick={() => setCurrentLang(lang.code)} 
                      className={`hover:text-emerald-400 transition-colors ${currentLang === lang.code ? 'text-emerald-400 font-bold' : ''}`}
                    >
                      {lang.name}
                    </button>
                    {idx < LANGUAGES.length - 1 && <span className="text-gray-500">|</span>}
                  </React.Fragment>
                ))}
              </div>
              <button 
                className="p-2 hover:text-emerald-400 transition-colors lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full">
              <motion.div
                key={`text-${activeSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-2xl text-white"
              >
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
                  {t.heroTitle}
                </h1>
                <p className="text-xl lg:text-2xl font-light text-gray-200 mb-10 drop-shadow-md">
                  {t.heroSubtitle}
                </p>
                <button onClick={() => openModal(t.products, "Explore our premium food lineup.")} className="px-8 py-4 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-900/20 flex items-center gap-2">
                  {t.exploreProducts} <ArrowRight size={20} />
                </button>
              </motion.div>
            </div>
          </div>

          {/* Slider Controls (Disabled for single image) */}
          {/*
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
          */}
        </section>

        {/* Haagen-Dazs Products Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-5xl font-black tracking-tight text-[#6D1B2A] mb-4 font-serif">에이치케이온 코리아</h2>
            <p className="text-gray-600 text-lg max-w-2xl">
              {currentLang === 'ko' ? '프리미엄 아이스크림의 기준, 하겐다즈의 깊고 진한 풍미를 경험해보세요.' : 
               currentLang === 'zh' ? '体验哈根达斯浓郁醇厚的风味，高级冰淇淋的标杆。' :
               'Experience the rich and deep flavor of Häagen-Dazs, the standard of premium ice cream.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.map((product) => (
              <button key={product.id} onClick={() => openModal(product.name[currentLang] || product.name.en, product.description[currentLang] || product.description.en, product.detailImages)} className="group cursor-pointer text-left flex flex-col h-full">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl mb-6 bg-gray-50 shadow-md group-hover:shadow-xl transition-all duration-500">
                  <img 
                    src={product.image} 
                    alt={product.name[currentLang] || product.name.en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#6D1B2A] transition-colors">
                    {product.name[currentLang] || product.name.en}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 whitespace-pre-line flex-1">
                    {product.description[currentLang] || product.description.en}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-[#6D1B2A] group-hover:gap-3 transition-all mt-auto">
                    {t.exploreProducts} <ChevronRight size={16} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Notice Section */}
        <section className="bg-gray-50 py-24 px-6">
          <div className="max-w-3xl mx-auto">
            {/* Notice Board */}
            <div>
              <div className="flex justify-between items-center mb-8 border-b-2 border-gray-900 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">{t.notice}</h2>
                <button onClick={() => openModal(t.notice, "All notices.")} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
              <ul className="divide-y divide-gray-200">
                {NOTICES.map((notice) => (
                  <li key={notice.id}>
                    <button onClick={() => openModal(notice.title[currentLang as keyof typeof notice.title] || notice.title.en, "Notice details.")} className="py-4 flex justify-between items-center group hover:bg-gray-100/50 transition-colors -mx-4 px-4 rounded-lg w-full text-left">
                      <span className="text-gray-800 font-medium group-hover:text-emerald-600 transition-colors line-clamp-1 pr-4">
                        {notice.title[currentLang as keyof typeof notice.title] || notice.title.en}
                      </span>
                      <span className="text-sm text-gray-500 flex-shrink-0">{notice.date}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Quick Links (Moved to bottom) */}
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-x divide-y lg:divide-y-0 divide-gray-200">
              {quickLinks.map((link, idx) => (
                <button key={idx} onClick={() => openModal(link.title, `${link.title} details.`)} className="flex flex-col items-center text-center p-10 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all duration-300 group w-full border border-transparent hover:shadow-lg rounded-2xl">
                  <div className="text-emerald-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                    {link.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{link.title}</h3>
                  <p className="text-sm text-gray-500">{link.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              <div>
                <div className="text-3xl font-bold tracking-tighter text-white mb-6">
                  에이치케이온
                </div>
                <p className="text-sm leading-relaxed mb-6">
                  Delivering the purest ingredients from nature to your table. We believe in the power of healthy, delicious food.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
                <ul className="space-y-3 text-sm">
                  <li><button onClick={() => openModal(t.company, "Company info.")} className="hover:text-white transition-colors">{t.company}</button></li>
                  <li><button onClick={() => openModal(t.products, "Products info.")} className="hover:text-white transition-colors">{t.products}</button></li>
                  <li><button onClick={() => openModal(t.support, "Support info.")} className="hover:text-white transition-colors">{t.support}</button></li>
                  <li><button onClick={() => openModal(t.careers, "Careers info.")} className="hover:text-white transition-colors">{t.careers}</button></li>
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
                  <button onClick={() => openModal("Global Network", "Korea (HQ) info.")} className="hover:text-white transition-colors text-left">Korea (HQ)</button>
                  <button onClick={() => openModal("Global Network", "USA info.")} className="hover:text-white transition-colors text-left">USA</button>
                  <button onClick={() => openModal("Global Network", "Japan info.")} className="hover:text-white transition-colors text-left">Japan</button>
                  <button onClick={() => openModal("Global Network", "China info.")} className="hover:text-white transition-colors text-left">China</button>
                  <button onClick={() => openModal("Global Network", "Europe info.")} className="hover:text-white transition-colors text-left">Europe</button>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <div className="flex gap-6">
                <button onClick={() => openModal(t.privacyPolicy, "Privacy Policy content.")} className="text-white font-medium hover:text-emerald-400 transition-colors">{t.privacyPolicy}</button>
                <button onClick={() => openModal(t.termsOfService, "Terms of Service content.")} className="hover:text-white transition-colors">{t.termsOfService}</button>
                <button onClick={() => openModal(t.sitemap, "Sitemap content.")} className="hover:text-white transition-colors">{t.sitemap}</button>
                <button onClick={() => openModal(t.location, "Location content.")} className="hover:text-white transition-colors">{t.location}</button>
              </div>
              <p>{t.footerText}</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

