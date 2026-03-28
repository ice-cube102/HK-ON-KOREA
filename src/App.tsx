/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ChevronRight, ChevronLeft, Globe, Menu, Search, ArrowRight, Phone, FileText, MonitorPlay, Users, Building2, X, ChevronDown, ChevronUp, Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import { PRODUCTS, Product, TRANSLATIONS, LANGUAGES } from './constants';
import { AccordionMenu } from './components/AccordionMenu';
import companyLogo from '/images/company.png';
import NOTICES from './announcement/notices.json';

const Modal = ({ isOpen, onClose, title, content, images, isDarkMode }: { isOpen: boolean; onClose: () => void; title: string; content: React.ReactNode; images?: string[]; isDarkMode?: boolean }) => (
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
          className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`flex justify-between items-center p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shrink-0`}>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
            <button onClick={onClose} className={`p-2 ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} rounded-full transition-colors`}><X size={24} /></button>
          </div>
          <div className={`p-6 overflow-y-auto flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            {images && images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {images.map((img, idx) => (
                  <img key={idx} src={img} alt={`${title} detail ${idx + 1}`} className="w-full h-auto rounded-xl shadow-sm object-cover" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
                ))}
                <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed text-lg whitespace-pre-line`}>
                  {typeof content === 'string' ? <p>{content}</p> : content}
                </div>
              </div>
            ) : (
              typeof content === 'string' ? <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed text-lg whitespace-pre-line`}>{content}</p> : content
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const TiltImage = ({ src, alt, isDarkMode }: { src: string, alt: string, isDarkMode: boolean }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative aspect-[4/3] md:aspect-auto md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl ${isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'} p-2 border`}
    >
      <div 
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
        className="w-full h-full rounded-xl overflow-hidden"
      >
        <img 
          src={src} 
          alt={alt}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
      </div>
    </motion.div>
  );
};

export default function App() {
  const [currentLang, setCurrentLang] = useState('ko');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeDetailSlide, setActiveDetailSlide] = useState(0);
  const [modal, setModal] = useState<{ isOpen: boolean; title: string; content: React.ReactNode; images?: string[] }>({ isOpen: false, title: '', content: '' });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleInteraction = async () => {
      if (audioRef.current && !userPaused && !isPlaying) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          window.removeEventListener('click', handleInteraction);
          window.removeEventListener('keydown', handleInteraction);
          window.removeEventListener('touchstart', handleInteraction);
        } catch (err) {
          console.log("Autoplay blocked by browser. User interaction required.");
        }
      }
    };

    if (audioRef.current && !userPaused && !isPlaying) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          window.addEventListener('click', handleInteraction);
          window.addEventListener('keydown', handleInteraction);
          window.addEventListener('touchstart', handleInteraction);
        });
    }

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [userPaused, isPlaying]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setUserPaused(true);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setUserPaused(false);
          })
          .catch(err => {
            console.error("Audio play failed:", err);
            setIsPlaying(false);
          });
      }
    }
  };

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.ko;

  const openModal = (title: string, content: React.ReactNode, images?: string[]) => setModal({ isOpen: true, title, content, images });

  const getCompanyIntro = (lang: string, dark: boolean) => {
    return (
      <div className={`space-y-6 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
        <p className={`text-xl font-medium ${dark ? 'text-blue-400' : 'text-[#6D1B2A]'}`}>{t.introDesc}</p>
        <div className={`${dark ? 'bg-blue-900/20 border-blue-800/50' : 'bg-emerald-50 border-emerald-100'} p-6 rounded-2xl border`}>
          <h4 className={`font-bold ${dark ? 'text-blue-400' : 'text-emerald-800'} mb-3 flex items-center gap-2`}><Globe size={20}/> {t.coreCompetency}</h4>
          <ul className={`list-disc pl-5 space-y-2 ${dark ? 'text-blue-200/80' : 'text-emerald-900/80'}`}>
            <li>{t.core1}</li>
            <li>{t.core2}</li>
            <li>{t.core3}</li>
          </ul>
        </div>
        <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'} p-6 rounded-2xl border`}>
          <h4 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-3 flex items-center gap-2`}><ArrowRight size={20}/> {t.vision}</h4>
          <p className={`${dark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>{t.visionDesc}</p>
        </div>
      </div>
    );
  };

  const navItems = [
    t.company, t.products, t.notice, t.support, t.careers, t.resources
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
    [t.notice]: NOTICES.map(notice => ({ name: notice.title[currentLang as keyof typeof notice.title] || notice.title.en })),
    [t.support]: [
      { name: "서비스" },
      { name: "트레이닝", hasSub: true },
      { name: "원격지원" },
      { name: "HK Insight" },
      { name: "자료실" },
    ]
  };

  const quickLinks = [
    { icon: <FileText size={32} />, title: t.inquiry, desc: t.expertConsultation },
    { icon: <MonitorPlay size={32} />, title: t.remoteSupport, desc: t.remoteHelp },
    { icon: <Building2 size={32} />, title: "HKON Insight", desc: t.smartMonitoring },
    { icon: <Phone size={32} />, title: t.customerSupport, desc: "1588-1285" },
    { icon: <Users size={32} />, title: t.training, desc: t.customizedTraining },
  ];

  const heroSlides = React.useMemo(() => [
    {
      title: t.hkonKorea,
      subtitle: t.heroSubtitle,
      image: "/images/company.jpg",
      detailTitle: t.hkonKorea,
      detailDesc: t.hkonDesc
    },
    {
      title: t.haagendazs,
      subtitle: t.haagendazsSub,
      image: "/images/mini_cup.jpg",
      detailTitle: t.haagendazs,
      detailDesc: t.haagendazsDesc
    },
    {
      title: t.natureValley,
      subtitle: t.natureValleySub,
      image: "/images/grnaola_thumbnail.jpg",
      detailTitle: t.natureValley,
      detailDesc: t.natureValleyDesc
    },
    {
      title: t.lantico,
      subtitle: t.lanticoSub,
      image: "/images/lantico.jpg",
      detailTitle: t.lantico,
      detailDesc: t.lanticoDesc
    },
    {
      title: t.caraci,
      subtitle: t.caraciSub,
      image: "/images/kadaif_thumbnail.png",
      detailTitle: t.caraci,
      detailDesc: t.caraciDesc
    },
    {
      title: t.fruitByTheFoot,
      subtitle: t.fruitByTheFootSub,
      image: "/images/fruit_by_the_foot.jpg",
      detailTitle: t.fruitByTheFoot,
      detailDesc: t.fruitByTheFootDesc
    },
    {
      title: t.greenGiant,
      subtitle: t.greenGiantSub,
      image: "/images/product.jpg",
      detailTitle: t.greenGiant,
      detailDesc: t.greenGiantDesc
    }
  ], [t]);

  // Preload images for faster loading
  useEffect(() => {
    heroSlides.forEach(slide => {
      const img = new Image();
      img.src = slide.image;
    });
  }, [heroSlides]);

  // Auto-slide hero (1.5x slower = 7500ms, resets on activeSlide change)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7500);
    return () => clearInterval(timer);
  }, [activeSlide, heroSlides.length]);

  // Auto-slide detail section (3x slower)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDetailSlide((prev) => (prev + 1) % heroSlides.length);
    }, 15000);
    return () => clearInterval(timer);
  }, [activeDetailSlide, heroSlides.length]);

  // Keyboard navigation for hero slider
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
      } else if (e.key === 'ArrowRight') {
        setActiveSlide((prev) => (prev + 1) % heroSlides.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [heroSlides.length]);


  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white selection:bg-blue-500' : 'bg-white text-gray-900 selection:bg-emerald-500'} font-sans selection:text-white flex transition-colors duration-300`}>
      {/* New Left Sidebar */}
      <motion.div 
        animate={{ width: isSidebarOpen ? 224 : 64 }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
        className="border-r border-[#5A1622] py-4 hidden lg:flex flex-col items-center overflow-hidden flex-shrink-0 bg-[#6D1B2A] relative group"
      >
        {/* Spotlight effect */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 50px at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.15), transparent)`
          }}
        />

        <div className={`flex w-full px-4 mb-6 flex-col items-start relative z-10`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-md transition-colors text-white">
              <Menu size={24} />
            </button>
            <div className="text-xl font-bold text-white">{t.hkon}</div>
          </div>
        </div>
        
        <div className="flex flex-col w-full relative z-10 flex-grow" onMouseLeave={() => setHoveredMenu(null)}>
          {navItems.map((item, idx) => (
            <div key={idx} className="w-full" onMouseEnter={() => setHoveredMenu(item)}>
              <button 
                onClick={() => {
                  if (item === t.company) {
                    openModal(item, getCompanyIntro(currentLang, isDarkMode));
                  } else {
                    openModal(item, `${item} page content.`);
                  }
                }} 
                className={`flex justify-between items-center w-full text-lg font-medium text-white/80 text-left py-4 px-4 hover:text-white transition-colors whitespace-nowrap border-b border-white/10 ${idx === 0 ? 'border-t border-white/10' : ''} ${!isSidebarOpen && 'hidden'}`}
              >
                <span>{item}</span>
                {menuData[item] && isSidebarOpen && <ChevronRight size={16} className="opacity-50" />}
              </button>
            </div>
          ))}

          {/* Flyout Panel */}
          <AnimatePresence>
            {hoveredMenu && menuData[hoveredMenu] && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={`absolute left-full top-0 h-screen w-[280px] ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-2xl border-l z-50 flex flex-col`}
              >
                <div className="bg-[#6D1B2A] py-8 px-6">
                  <h2 className="text-white text-2xl font-bold">{hoveredMenu}</h2>
                </div>
                <div className="flex-1 overflow-y-auto py-4 px-4">
                  <ul className="space-y-1">
                    {menuData[hoveredMenu].map((subItem, subIdx) => (
                      <li key={subIdx}>
                        <button
                          onClick={() => openModal(subItem.name, `${subItem.name} content`)}
                          className={`flex justify-between items-center w-full py-3 px-4 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'} hover:text-[#6D1B2A] rounded-lg transition-all text-sm`}
                        >
                          <span>{subItem.name}</span>
                          {subItem.hasSub && <ChevronDown size={14} className="rotate-[-90deg] opacity-40" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="flex-1 overflow-x-hidden relative">
        {/* Top Right Floating Controls */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-4 p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 transition-colors ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-emerald-600 hover:text-emerald-700'}`}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Globe size={18} className={isDarkMode ? 'text-blue-400' : 'text-emerald-600'} />
            {LANGUAGES.map((lang, idx) => (
              <React.Fragment key={lang.code}>
                <button 
                  onClick={() => setCurrentLang(lang.code)} 
                  className={`transition-colors ${isDarkMode ? 'hover:text-blue-400' : 'hover:text-emerald-600'} ${currentLang === lang.code ? (isDarkMode ? 'text-blue-400 font-bold' : 'text-emerald-600 font-bold') : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}
                >
                  {lang.name}
                </button>
                {idx < LANGUAGES.length - 1 && <span className={isDarkMode ? 'text-gray-700' : 'text-gray-300'}>|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <Modal {...modal} isDarkMode={isDarkMode} onClose={() => setModal({ ...modal, isOpen: false })} />

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: '100dvh' }}
              exit={{ opacity: 0, height: 0 }}
              className={`fixed inset-0 z-50 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} overflow-y-auto`}
            >
              <div className="px-6 py-4 flex flex-col gap-4 pb-20">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Globe size={18} className={isDarkMode ? 'text-blue-400' : 'text-emerald-600'} />
                    {LANGUAGES.map((lang, idx) => (
                      <React.Fragment key={lang.code}>
                        <button 
                          onClick={() => { setCurrentLang(lang.code); setIsMobileMenuOpen(false); }} 
                          className={`text-sm font-medium transition-colors ${currentLang === lang.code ? (isDarkMode ? 'text-blue-400 font-bold' : 'text-emerald-600 font-bold') : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}
                        >
                          {lang.name}
                        </button>
                        {idx < LANGUAGES.length - 1 && <span className={isDarkMode ? 'text-gray-700' : 'text-gray-300'}>|</span>}
                      </React.Fragment>
                    ))}
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className={`p-2 -mr-2 ${isDarkMode ? 'text-gray-400' : ''}`}><X size={24} /></button>
                </div>
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
                        isDarkMode={isDarkMode}
                      />
                    );
                  }
                  return (
                    <button key={idx} onClick={() => { 
                      if (item === t.company) {
                        openModal(item, getCompanyIntro(currentLang, isDarkMode));
                      } else {
                        openModal(item, `${item} page content.`); 
                      }
                      setIsMobileMenuOpen(false); 
                    }} className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-left py-2`}>
                      {item}
                    </button>
                  );
                })}

                {/* Mobile Dark Mode Toggle */}
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`mt-4 p-4 rounded-xl flex items-center justify-center gap-3 font-medium transition-colors ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Slider */}
        <section className="relative h-[calc(100dvh-64px)] overflow-hidden bg-gray-900">
          <AnimatePresence mode="wait">
            <motion.img
              key={`bg-${activeSlide}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              src={heroSlides[activeSlide].image}
              alt="Hero Background"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center top' }}
              referrerPolicy="no-referrer"
              fetchPriority="high"
              loading="eager"
            />
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

          {/* Header inside Hero - Removed */}
          
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full mt-16 md:mt-0">
              <motion.div
                key={`text-${activeSlide}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 80, damping: 20 }}
                className="max-w-2xl text-white"
              >
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight drop-shadow-lg">
                  {heroSlides[activeSlide].title}
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl font-light text-gray-200 mb-8 md:mb-10 drop-shadow-md">
                  {heroSlides[activeSlide].subtitle}
                </p>
                <button onClick={() => openModal(t.products, "Explore our premium food lineup.")} className={`px-6 py-3 md:px-8 md:py-4 text-white font-semibold rounded-full transition-all hover:shadow-lg flex items-center gap-2 text-sm md:text-base ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-900/20' : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-900/20'}`}>
                  {t.exploreProducts} <ArrowRight size={20} />
                </button>
              </motion.div>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="absolute bottom-10 left-0 w-full z-20">
            <div className="max-w-7xl mx-auto px-6 flex gap-1 md:gap-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className="py-4 px-1 group cursor-pointer"
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <div className={`w-10 md:w-12 h-1 transition-all ${activeSlide === idx ? (isDarkMode ? 'bg-blue-500' : 'bg-emerald-500') : 'bg-white/30 group-hover:bg-white/50'}`} />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Notices Section */}
        <section className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} py-4 px-6 z-30 relative transition-colors duration-300`}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <span className="bg-[#6D1B2A] text-white px-3 py-1 text-xs font-bold rounded-full tracking-wider">NOTICE</span>
            </div>
            <div className="flex-1 w-full overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                {NOTICES.slice(0, 3).map((notice) => (
                  <button 
                    key={notice.id} 
                    onClick={() => openModal(notice.title[currentLang as keyof typeof notice.title] || notice.title.en, "Notice details.")} 
                    className="flex justify-between items-center group text-left w-full"
                  >
                    <span className={`${isDarkMode ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-[#6D1B2A]'} transition-colors line-clamp-1 text-sm font-medium`}>
                      {notice.title[currentLang as keyof typeof notice.title] || notice.title.en}
                    </span>
                    <span className="text-xs text-gray-400 ml-3 shrink-0">{notice.date}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Content Section */}
        <section className={`py-20 px-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} min-h-[60vh] flex items-center transition-colors duration-300`}>
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDetailSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
                className="flex flex-col md:flex-row gap-12 items-center"
              >
                <div className="w-full md:w-1/2">
                  <div className={`relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 transition-colors duration-300`}>
                    <img src={heroSlides[activeDetailSlide].image} alt={heroSlides[activeDetailSlide].detailTitle} className="w-full h-full object-contain rounded-2xl" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
                  </div>
                </div>
                <div className="w-full md:w-1/2 space-y-6">
                  <h2 className={`text-sm font-bold tracking-widest ${isDarkMode ? 'text-blue-400' : 'text-emerald-600'} uppercase`}>{t.hkonKorea}</h2>
                  <h3 className={`text-4xl md:text-5xl font-black ${isDarkMode ? 'text-white' : 'text-[#6D1B2A]'} leading-tight transition-colors duration-300`}>
                    {heroSlides[activeDetailSlide].detailTitle}
                  </h3>
                  <div className={`w-20 h-1 ${isDarkMode ? 'bg-blue-500' : 'bg-emerald-500'} rounded-full`}></div>
                  <p className={`text-lg md:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed whitespace-pre-line transition-colors duration-300`}>
                    {heroSlides[activeDetailSlide].detailDesc}
                  </p>
                  <button 
                    onClick={() => {
                      if (activeDetailSlide === 0) {
                        openModal(t.company, getCompanyIntro(currentLang, isDarkMode));
                      } else {
                        openModal(heroSlides[activeDetailSlide].detailTitle, heroSlides[activeDetailSlide].detailDesc);
                      }
                    }} 
                    className={`inline-flex items-center gap-2 px-8 py-4 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#6D1B2A] hover:bg-[#5A1622]'} text-white rounded-full transition-colors font-medium mt-4`}
                  >
                    {t.readMore} <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Products Section */}
        <section className={`py-20 md:py-32 px-6 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center mb-16 md:mb-24">
              <h2 className={`text-4xl md:text-5xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#6D1B2A]'} mb-4 font-serif transition-colors duration-300`}>{t.products}</h2>
            </div>

            <div className="space-y-32 md:space-y-40">
              {PRODUCTS.map((product, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
                    className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-20 items-center`}
                  >
                    {/* Image Side */}
                    <div className="w-full md:w-1/2">
                      <TiltImage 
                        src={product.image} 
                        alt={product.name[currentLang as keyof typeof product.name] || product.name.en}
                        isDarkMode={isDarkMode}
                      />
                    </div>

                    {/* Text Side */}
                    <div className="w-full md:w-1/2 space-y-6">
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' : 'bg-emerald-100 text-emerald-800'}`}>
                        🚀 {t.premiumQuality}
                      </div>
                      <h3 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>
                        {product.name[currentLang as keyof typeof product.name] || product.name.en}
                      </h3>
                      <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed whitespace-pre-line`}>
                        {product.description[currentLang as keyof typeof product.description] || product.description.en}
                      </p>
                      
                      <ul className={`space-y-4 mt-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <li className="flex items-start gap-3">
                          <div className={`mt-2 w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-emerald-500'} shrink-0`} />
                          <span className="leading-relaxed">{t.feature1}</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className={`mt-2 w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-emerald-500'} shrink-0`} />
                          <span className="leading-relaxed">{t.feature2}</span>
                        </li>
                      </ul>

                      <div className="pt-6">
                        <button 
                          onClick={() => openModal(product.name[currentLang as keyof typeof product.name] || product.name.en, product.description[currentLang as keyof typeof product.description] || product.description.en, product.detailImages)}
                          className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium transition-colors ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-[#6D1B2A] hover:bg-[#5A1622] text-white'}`}
                        >
                          {t.exploreProducts} <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Notice Section */}
        <section className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} py-24 px-6 transition-colors duration-300`}>
          <div className="max-w-3xl mx-auto">
            {/* Notice Board */}
            <div>
              <div className={`flex justify-between items-center mb-8 border-b-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-900'} pb-4`}>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.notice}</h2>
                <button onClick={() => openModal(t.notice, "All notices.")} className={`p-2 ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-900'} rounded-full transition-colors`}>
                  <ChevronRight size={20} />
                </button>
              </div>
              <ul className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {NOTICES.map((notice) => (
                  <li key={notice.id}>
                    <button onClick={() => openModal(notice.title[currentLang as keyof typeof notice.title] || notice.title.en, "Notice details.")} className={`py-4 flex justify-between items-center group ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100/50'} transition-colors -mx-4 px-4 rounded-lg w-full text-left`}>
                      <span className={`${isDarkMode ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-800 group-hover:text-emerald-600'} font-medium transition-colors line-clamp-1 pr-4`}>
                        {notice.title[currentLang as keyof typeof notice.title] || notice.title.en}
                      </span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} flex-shrink-0`}>{notice.date}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Quick Links (Moved to bottom) */}
        <section className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b transition-colors duration-300`}>
          <div className="max-w-7xl mx-auto">
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-x divide-y lg:divide-y-0 ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {quickLinks.map((link, idx) => (
                <button key={idx} onClick={() => openModal(link.title, `${link.title} details.`)} className={`flex flex-col items-center text-center p-10 ${isDarkMode ? 'hover:bg-blue-900/20 hover:border-blue-800' : 'hover:bg-emerald-50/50 hover:border-emerald-200'} transition-all duration-300 group w-full border border-transparent hover:shadow-lg rounded-2xl`}>
                  <div className={`${isDarkMode ? 'text-blue-400' : 'text-emerald-600'} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {link.icon}
                  </div>
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{link.title}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{link.desc}</p>
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
                  {t.hkonDesc}
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{t.quickLinks}</h4>
                <ul className="space-y-3 text-sm">
                  <li><button onClick={() => openModal(t.company, "Company info.")} className="hover:text-white transition-colors">{t.company}</button></li>
                  <li><button onClick={() => openModal(t.products, "Products info.")} className="hover:text-white transition-colors">{t.products}</button></li>
                  <li><button onClick={() => openModal(t.support, "Support info.")} className="hover:text-white transition-colors">{t.support}</button></li>
                  <li><button onClick={() => openModal(t.careers, "Careers info.")} className="hover:text-white transition-colors">{t.careers}</button></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{t.customerCenter}</h4>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-emerald-500'} mb-2`}>1588-1285</div>
                <p className="text-sm mb-4">{t.weekdays}<br/>{t.closedWeekends}</p>
                <a href="mailto:hkonkorea@gmail.com" className="text-sm hover:text-white transition-colors block mb-2">hkonkorea@gmail.com</a>
                <p className="text-sm text-gray-400">{t.address}</p>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{t.globalNetwork}</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <button onClick={() => openModal(t.globalNetwork, `${t.korea} info.`)} className="hover:text-white transition-colors text-left">{t.korea}</button>
                  <button onClick={() => openModal(t.globalNetwork, `${t.usa} info.`)} className="hover:text-white transition-colors text-left">{t.usa}</button>
                  <button onClick={() => openModal(t.globalNetwork, `${t.japan} info.`)} className="hover:text-white transition-colors text-left">{t.japan}</button>
                  <button onClick={() => openModal(t.globalNetwork, `${t.china} info.`)} className="hover:text-white transition-colors text-left">{t.china}</button>
                  <button onClick={() => openModal(t.globalNetwork, `${t.europe} info.`)} className="hover:text-white transition-colors text-left">{t.europe}</button>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <div className="flex gap-6">
                <button onClick={() => openModal(t.privacyPolicy, "Privacy Policy content.")} className={`text-white font-medium transition-colors ${isDarkMode ? 'hover:text-blue-400' : 'hover:text-emerald-400'}`}>{t.privacyPolicy}</button>
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
          className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 p-3 md:p-4 bg-[#6D1B2A] text-white rounded-full shadow-2xl hover:bg-[#5A1622] transition-transform hover:scale-110 flex items-center justify-center"
          aria-label="Toggle background music"
        >
          {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>
    </div>
  );
}

