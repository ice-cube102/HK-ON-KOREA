/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Globe, Menu, Search, ArrowRight, Phone, FileText, MonitorPlay, Users, Building2, X, ChevronDown, ChevronUp, Volume2, VolumeX } from 'lucide-react';
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-gray-50 border border-gray-200 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 bg-white shrink-0">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><X size={24} /></button>
          </div>
          <div className="p-6 overflow-y-auto flex-1 bg-white">
            {images && images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {images.map((img, idx) => (
                  <img key={idx} src={img} alt={`${title} detail ${idx + 1}`} className="w-full h-auto rounded-xl shadow-sm object-cover" referrerPolicy="no-referrer" />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 leading-relaxed text-lg">{content}</p>
            )}
          </div>
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.log("Autoplay blocked by browser. User interaction required.");
          setIsPlaying(false);
        }
      }
    };
    playAudio();
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.error("Audio play failed:", err);
            alert("음악 파일을 재생할 수 없습니다. 'public/images/song.mp3' 파일이 정상적으로 업로드되었는지 확인해주세요.");
            setIsPlaying(false);
          });
      }
    }
  };

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.ko;

  const openModal = (title: string, content: string, images?: string[]) => setModal({ isOpen: true, title, content, images });

  const navItems = [
    t.company, t.products, t.support, t.resources, t.infoCenter
  ];

  const menuData: { [key: string]: { name: string; hasSub?: boolean }[] } = {
    [t.company]: [
      { name: "CEO" },
      { name: "회사개요" },
      { name: "회사연혁" },
      { name: "CI소개" },
      { name: "가치경영", hasSub: true },
      { name: "지사안내", hasSub: true },
    ],
    [t.products]: [
      { name: "Fiber", hasSub: true },
      { name: "Conversion", hasSub: true },
      { name: "Gantry", hasSub: true },
      { name: "Tube", hasSub: true },
      { name: "절곡기", hasSub: true },
      { name: "디버링기" },
      { name: "용접기" },
    ],
    [t.support]: [
      { name: "서비스" },
      { name: "트레이닝", hasSub: true },
      { name: "원격지원" },
      { name: "HK Insight" },
      { name: "자료실" },
    ]
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
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-emerald-500 selection:text-white">
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
                      items={menuData[item].map(sub => sub.name)} 
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

      {/* Top Section: Sidebar + Hero */}
      <div className="flex w-full h-[260px]">
        {/* New Left Sidebar */}
        <motion.div 
        animate={{ width: isSidebarOpen ? 224 : 64 }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
        className="border-r border-[#5A1622] py-4 hidden lg:flex flex-col items-center overflow-hidden flex-shrink-0 bg-[#6D1B2A] relative group h-full"
      >
        {/* Spotlight effect */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 50px at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.15), transparent)`
          }}
        />

        <div className={`flex w-full px-4 mb-4 ${isSidebarOpen ? 'justify-between' : 'justify-center'} items-center relative z-10`}>
          {isSidebarOpen && <div className="text-white font-bold text-xl whitespace-nowrap">{t.hkon}</div>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-md transition-colors text-white">
            <Menu size={20} />
          </button>
        </div>
        
        <div className="flex flex-col w-full relative z-10 flex-1 justify-center">
          {navItems.map((item, idx) => (
            <div key={idx} className="w-full">
              <button 
                onClick={() => openModal(item, `${item} page content.`)} 
                className={`flex justify-center items-center w-full text-sm font-medium text-white/80 text-center py-4 px-4 hover:text-white transition-colors whitespace-nowrap border-b border-white/10 ${idx === 0 ? 'border-t border-white/10' : ''} ${!isSidebarOpen && 'hidden'}`}
              >
                <span>{item}</span>
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex-1 overflow-x-hidden h-full">
        {/* Hero Slider */}
        <section className="relative h-full overflow-hidden bg-gray-900">
          <img
            src={heroImages[0]}
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            style={{ objectPosition: 'center center' }}
            referrerPolicy="no-referrer"
            fetchPriority="high"
            loading="eager"
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

          {/* Header inside Hero */}
          <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
            <div className="text-3xl font-bold tracking-tighter text-white">
              {t.hkonKorea}
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
                <h1 className="text-2xl lg:text-3xl font-bold mb-2 leading-tight drop-shadow-lg">
                  {t.heroTitle}
                </h1>
                <p className="text-sm lg:text-base font-light text-gray-200 mb-4 drop-shadow-md">
                  {t.heroSubtitle}
                </p>
                <button onClick={() => openModal(t.products, "Explore our premium food lineup.")} className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-900/20 flex items-center gap-2 text-xs">
                  {t.exploreProducts} <ArrowRight size={16} />
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
      </div>
    </div>

    {/* Full width sections below */}
    <div className="w-full">
      {/* Haagen-Dazs Products Section */}
      <section className="py-6 px-4 w-full max-w-[1600px] mx-auto">
          <div className="flex flex-col items-center text-center mb-6">
            <h2 className="text-3xl font-black tracking-tight text-[#6D1B2A] mb-2 font-serif">{t.hkonKorea}</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
            {PRODUCTS.map((product) => (
              <button 
                key={product.id} 
                onClick={() => openModal(product.name[currentLang] || product.name.en, product.description[currentLang] || product.description.en, product.detailImages)} 
                className="group cursor-pointer text-center flex flex-col items-center h-full relative p-3 rounded-2xl w-[160px] md:w-[180px] lg:w-[200px]"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                }}
              >
                {/* Mouse tracking spotlight effect on card hover */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                     style={{
                       background: 'radial-gradient(circle 100px at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.08), transparent)'
                     }}
                />
                <div className="relative aspect-square w-full overflow-hidden rounded-xl mb-3 bg-white border border-gray-100 transition-all duration-500 z-10 flex items-center justify-center p-4">
                  <img 
                    src={product.image} 
                    alt={product.name[currentLang] || product.name.en}
                    className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="flex-1 flex flex-col z-10 items-center w-full">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#6D1B2A] transition-colors line-clamp-1">
                    {product.name[currentLang] || product.name.en}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed mb-3 whitespace-pre-line flex-1 line-clamp-3">
                    {product.description[currentLang] || product.description.en}
                  </p>
                  <span className="inline-flex items-center justify-center gap-1 text-xs font-bold text-[#6D1B2A] group-hover:gap-2 transition-all mt-auto">
                    {t.exploreProducts} <ChevronRight size={14} />
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
                  {t.hkon}
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
                <p className="text-sm mb-4">Weekdays 09:30 - 18:30<br/>(Closed on Weekends & Holidays)</p>
                <a href="mailto:hkonkorea@gmail.com" className="text-sm hover:text-white transition-colors block mb-2">hkonkorea@gmail.com</a>
                <p className="text-sm text-gray-400">경기도 부천시 삼작로 164번길</p>
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

        {/* Background Audio */}
        <audio ref={audioRef} src="/images/song.mp3" loop preload="auto" />
        
        {/* Audio Toggle Button */}
        <button
          onClick={toggleAudio}
          className="fixed bottom-8 right-8 z-50 p-4 bg-[#6D1B2A] text-white rounded-full shadow-2xl hover:bg-[#5A1622] transition-transform hover:scale-110 flex items-center justify-center"
          aria-label="Toggle background music"
        >
          {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>
    </div>
  );
}

