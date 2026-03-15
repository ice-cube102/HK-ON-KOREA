/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Globe, Menu, X, ArrowRight, Phone, FileText, MonitorPlay, Users, Building2, Volume2, VolumeX, Zap, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { PRODUCTS, TRANSLATIONS, LANGUAGES } from './constants';
import NOTICES from './announcement/notices.json';

const Modal = ({ isOpen, onClose, title, content, images }: { isOpen: boolean; onClose: () => void; title: string; content: string; images?: string[] }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-[#0c101a] border border-white/10 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle top glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#1b62d2]/50 to-transparent" />
          
          <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0 bg-white/5">
            <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
            {images && images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {images.map((img, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden border border-white/10 bg-[#080b11]">
                    <img src={img} alt={`${title} detail ${idx + 1}`} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-line">{content}</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function App() {
  const [currentLang, setCurrentLang] = useState('ko');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [modal, setModal] = useState<{ isOpen: boolean; title: string; content: string; images?: string[] }>({ isOpen: false, title: '', content: '' });
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.log("Autoplay blocked by browser.");
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

  const navItems = [t.company, t.products, t.support, t.resources];

  const quickLinks = [
    { icon: <FileText size={24} />, title: t.inquiry, desc: "Expert consultation" },
    { icon: <MonitorPlay size={24} />, title: t.remoteSupport, desc: "1:1 Remote help" },
    { icon: <Building2 size={24} />, title: "Insight", desc: "Smart monitoring" },
    { icon: <Users size={24} />, title: t.training, desc: "Customized training" },
  ];

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-200 font-sans selection:bg-[#1b62d2]/30 selection:text-blue-200 relative overflow-hidden">
      {/* Global Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ 
        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '4rem 4rem',
        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
      }} />

      <Modal {...modal} onClose={() => setModal({ ...modal, isOpen: false })} />
      
      <audio ref={audioRef} loop>
        <source src="/images/song.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Audio Toggle */}
      <button
        onClick={toggleAudio}
        className="fixed bottom-6 right-6 z-50 p-4 bg-[#1b62d2] text-white rounded-full shadow-[0_0_20px_rgba(27,98,210,0.4)] hover:shadow-[0_0_30px_rgba(27,98,210,0.6)] hover:scale-110 transition-all duration-300 animate-float"
        aria-label={isPlaying ? "음악 끄기" : "음악 켜기"}
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      {/* Navbar */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#080b11]/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-10">
            <div className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1b62d2] flex items-center justify-center shadow-[0_0_15px_rgba(27,98,210,0.5)]">
                <Sparkles size={18} className="text-white" />
              </div>
              {t.hkon}
            </div>
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => openModal(item, `${item} content.`)}
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 bg-white/5 rounded-full px-4 py-2 border border-white/10">
              <Globe size={14} className="text-[#1b62d2]" />
              {LANGUAGES.map((lang, idx) => (
                <React.Fragment key={lang.code}>
                  <button 
                    onClick={() => setCurrentLang(lang.code)} 
                    className={`text-xs font-semibold tracking-wide transition-colors ${currentLang === lang.code ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {lang.code.toUpperCase()}
                  </button>
                  {idx < LANGUAGES.length - 1 && <span className="text-slate-700 text-xs">|</span>}
                </React.Fragment>
              ))}
            </div>
            <button 
              onClick={() => openModal(t.contactUs, "Contact us form.")}
              className="hidden md:flex items-center gap-2 bg-[#1b62d2] hover:bg-[#1b62d2]/90 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all animate-glow"
            >
              {t.contactUs}
            </button>
            <button 
              className="md:hidden p-2 text-slate-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-[#080b11] border-b border-white/10 flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b border-white/10">
              <div className="text-xl font-bold text-white">{t.hkon}</div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {navItems.map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => { openModal(item, `${item} content.`); setIsMobileMenuOpen(false); }} 
                  className="text-xl font-medium text-slate-300 text-left py-2 hover:text-white"
                >
                  {item}
                </button>
              ))}
              <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-4">
                <div className="flex items-center gap-4 justify-center">
                  {LANGUAGES.map((lang) => (
                    <button 
                      key={lang.code}
                      onClick={() => { setCurrentLang(lang.code); setIsMobileMenuOpen(false); }} 
                      className={`text-sm font-medium px-4 py-2 rounded-full border ${currentLang === lang.code ? 'bg-[#1b62d2]/20 border-[#1b62d2] text-[#1b62d2]' : 'border-white/10 text-slate-400'}`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[#1b62d2]/15 rounded-[100%] blur-[120px] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b62d2]/10 border border-[#1b62d2]/20 text-[#1b62d2] text-sm font-semibold mb-8 tracking-wide uppercase"
          >
            <Sparkles size={14} />
            <span>Revolutionize your workflow</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1]"
          >
            <span className="text-white">{t.heroTitle.split(' ')[0]} </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#60a5fa] to-[#1b62d2]">
              {t.heroTitle.split(' ').slice(1).join(' ')}
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
          >
            {t.heroSubtitle}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => openModal(t.products, "Explore our premium lineup.")} 
              className="w-full sm:w-auto px-8 py-4 bg-[#1b62d2] hover:bg-[#1b62d2]/90 text-white font-bold rounded-xl transition-all animate-glow flex items-center justify-center gap-2 text-lg"
            >
              {t.exploreProducts} <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => openModal(t.contactUs, "Get in touch with us.")} 
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
            >
              {t.contactUs}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Products/Features Section */}
      <section className="py-24 relative border-t border-white/5 bg-[#0a0d14]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Premium Lineup</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Discover our cutting-edge products designed for maximum efficiency and performance. Made for pros, by pros.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((product) => (
              <button 
                key={product.id} 
                onClick={() => openModal(product.name[currentLang] || product.name.en, product.description[currentLang] || product.description.en, product.detailImages)} 
                className="group text-left flex flex-col h-full bg-[#0c101a] border border-white/5 rounded-2xl p-5 hover:bg-[#111622] hover:border-[#1b62d2]/50 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#1b62d2]/0 to-[#1b62d2]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-6 bg-[#080b11] border border-white/5 screenshot-3d">
                  <img 
                    src={product.image} 
                    alt={product.name[currentLang] || product.name.en}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="flex-1 flex flex-col relative z-10">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#60a5fa] transition-colors">
                    {product.name[currentLang] || product.name.en}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {product.description[currentLang] || product.description.en}
                  </p>
                  <div className="mt-auto flex items-center text-sm font-bold text-[#1b62d2] group-hover:text-[#60a5fa] transition-colors uppercase tracking-wide">
                    {t.exploreProducts} <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Notice & Quick Links Section */}
      <section className="py-24 border-t border-white/5 relative bg-[#080b11]">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12">
          
          {/* Notices */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
                <Shield size={28} className="text-[#1b62d2]" />
                {t.notice}
              </h2>
              <button onClick={() => openModal(t.notice, "All notices.")} className="text-sm font-semibold text-[#1b62d2] hover:text-[#60a5fa] flex items-center uppercase tracking-wide">
                View All <ChevronRight size={16} />
              </button>
            </div>
            <div className="bg-[#0c101a] border border-white/5 rounded-2xl overflow-hidden">
              <ul className="divide-y divide-white/5">
                {NOTICES.slice(0, 4).map((notice) => (
                  <li key={notice.id}>
                    <button 
                      onClick={() => openModal(notice.title[currentLang as keyof typeof notice.title] || notice.title.en, "Notice details.")} 
                      className="w-full text-left px-6 py-5 hover:bg-white/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <span className="text-slate-300 font-medium group-hover:text-[#60a5fa] transition-colors line-clamp-1 text-lg">
                        {notice.title[currentLang as keyof typeof notice.title] || notice.title.en}
                      </span>
                      <span className="text-sm text-slate-500 whitespace-nowrap font-mono bg-white/5 px-3 py-1 rounded-full border border-white/5">{notice.date}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3 tracking-tight">
              <Zap size={28} className="text-[#1b62d2]" />
              Quick Links
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {quickLinks.map((link, idx) => (
                <button 
                  key={idx} 
                  onClick={() => openModal(link.title, `${link.title} details.`)} 
                  className="flex items-center gap-5 p-5 bg-[#0c101a] border border-white/5 rounded-xl hover:bg-[#111622] hover:border-[#1b62d2]/30 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#1b62d2]/10 flex items-center justify-center text-[#1b62d2] group-hover:scale-110 group-hover:bg-[#1b62d2]/20 transition-all shrink-0">
                    {link.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold group-hover:text-[#60a5fa] transition-colors text-lg">{link.title}</h3>
                    <p className="text-sm text-slate-500">{link.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#05070a] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="text-2xl font-black tracking-tighter text-white flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#1b62d2] flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                {t.hkon}
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">
                Revolutionize your workflow with AI-powered solutions made for pros, by pros.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Company</h4>
              <ul className="space-y-4 text-sm text-slate-400 font-medium">
                <li><button onClick={() => openModal(t.company, "Company info.")} className="hover:text-[#60a5fa] transition-colors">{t.company}</button></li>
                <li><button onClick={() => openModal(t.products, "Products info.")} className="hover:text-[#60a5fa] transition-colors">{t.products}</button></li>
                <li><button onClick={() => openModal(t.careers, "Careers info.")} className="hover:text-[#60a5fa] transition-colors">{t.careers}</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Support</h4>
              <ul className="space-y-4 text-sm text-slate-400 font-medium">
                <li><button onClick={() => openModal(t.support, "Support info.")} className="hover:text-[#60a5fa] transition-colors">{t.support}</button></li>
                <li><button onClick={() => openModal(t.resources, "Resources info.")} className="hover:text-[#60a5fa] transition-colors">{t.resources}</button></li>
                <li><button onClick={() => openModal(t.contactUs, "Contact info.")} className="hover:text-[#60a5fa] transition-colors">{t.contactUs}</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Contact</h4>
              <div className="flex items-center gap-3 text-slate-400 mb-4 font-medium">
                <Phone size={18} className="text-[#1b62d2]" />
                <span>1588-1285</span>
              </div>
              <p className="text-sm text-slate-500 mb-4 font-medium">Weekdays 09:30 - 18:30</p>
              <a href="mailto:hkonkorea@gmail.com" className="text-sm text-slate-400 hover:text-[#60a5fa] transition-colors block font-medium">hkonkorea@gmail.com</a>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 font-medium">
            <div className="flex gap-8">
              <button onClick={() => openModal(t.privacyPolicy, "Privacy Policy content.")} className="hover:text-white transition-colors">{t.privacyPolicy}</button>
              <button onClick={() => openModal(t.termsOfService, "Terms of Service content.")} className="hover:text-white transition-colors">{t.termsOfService}</button>
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
        className="fixed bottom-8 right-8 z-50 p-4 bg-[#1b62d2] text-white rounded-full shadow-[0_0_20px_rgba(27,98,210,0.5)] hover:bg-[#1b62d2]/90 transition-all hover:scale-110 flex items-center justify-center animate-float"
        aria-label="Toggle background music"
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>
    </div>
  );
}

