import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Edit3,
  Image as ImageIcon
} from 'lucide-react';
import { CARACI_SLIDES } from '../constants';

interface CaraciShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
  currentLang?: string;
  getImage?: (key: string, defaultVal: string) => string;
  activeOverrides?: Record<string, string>;
  isFeedbackModeActive?: boolean;
  triggerEditImage?: (key: string, label: string, currentVal: string) => void;
}

const isVideoUrl = (url: string) => {
  if (!url) return false;
  return /\.(mp4|webm|mov|ogg)($|\?)/i.test(url) || url.startsWith('data:video/');
};

export const CaraciShowcaseModal: React.FC<CaraciShowcaseModalProps> = ({
  isOpen,
  onClose,
  isDarkMode = false,
  currentLang = 'ko',
  getImage,
  activeOverrides = {},
  isFeedbackModeActive = false,
  triggerEditImage
}) => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSlideDirection('left');
        setCurrentSlideIdx((prev) => (prev - 1 + CARACI_SLIDES.length) % CARACI_SLIDES.length);
      } else if (e.key === 'ArrowRight') {
        setSlideDirection('right');
        setCurrentSlideIdx((prev) => (prev + 1) % CARACI_SLIDES.length);
      } else if (e.key === 'Escape') {
        if (isZoomOpen) {
          setIsZoomOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, isZoomOpen]);

  if (!isOpen) return null;

  const currentSlide = CARACI_SLIDES[currentSlideIdx];
  const slideImageKey = `image_caraci_slide_${currentSlide.id}`;
  const rawImage = getImage
    ? getImage(slideImageKey, currentSlide.image)
    : (activeOverrides[slideImageKey] || currentSlide.image);
  const currentImage = rawImage.startsWith('/images/caraci/')
    ? rawImage.replace('/images/caraci/', '/images/')
    : rawImage;

  const CARACI_FALLBACKS: Record<string, string[]> = {
    pure: ['/images/pure.png'],
    pesto: ['/images/Pesto.png', '/images/pesto.png'],
    sweet: ['/images/sweet.png'],
    nutty: ['/images/nutty.png'],
    kataifi: ['/images/Kataifi.png', '/images/kataifi.png'],
    dark: ['/images/dark_choco.png']
  };

  const handleNext = () => {
    setSlideDirection('right');
    setCurrentSlideIdx((prev) => (prev + 1) % CARACI_SLIDES.length);
  };

  const handlePrev = () => {
    setSlideDirection('left');
    setCurrentSlideIdx((prev) => (prev - 1 + CARACI_SLIDES.length) % CARACI_SLIDES.length);
  };

  const goToSlide = (idx: number) => {
    setSlideDirection(idx >= currentSlideIdx ? 'right' : 'left');
    setCurrentSlideIdx(idx);
  };

  const slideVariants = {
    enter: (direction: 'right' | 'left') => ({
      x: direction === 'right' ? 40 : -40,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 }
      }
    },
    exit: (direction: 'right' | 'left') => ({
      x: direction === 'right' ? -40 : 40,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.2
      }
    })
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[99995] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-5xl rounded-[2rem] border overflow-hidden shadow-2xl flex flex-col max-h-[90vh] transition-colors ${
            isDarkMode 
              ? 'bg-[#1a1a1a] border-gray-700 text-stone-100' 
              : 'bg-white border-gray-200 text-stone-900'
          }`}
        >
          {/* Header Bar - Solid black title, identical clean layout to other products */}
          <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-[#1a1a1a]/50 backdrop-blur-md shrink-0">
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                CARACI
              </h2>
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">
                {currentLang === 'en' 
                  ? `Sicilian Collection (${currentSlideIdx + 1}/6)` 
                  : currentLang === 'zh' 
                  ? `西西里典藏系列 (${currentSlideIdx + 1}/6)` 
                  : `시칠리아 컬렉션 (${currentSlideIdx + 1}/6)`}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
              aria-label={currentLang === 'en' ? 'Close' : currentLang === 'zh' ? '关闭' : '닫기'}
            >
              <X size={24} />
            </button>
          </div>

          {/* Main Body - Matches other products' side-by-side presentation */}
          <div className="p-6 md:p-10 overflow-y-auto flex-1 bg-white dark:bg-[#1a1a1a]">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
              
              {/* Left Column: Visual Showcase (Image / Video + Thumbnails) */}
              <div className="w-full lg:w-1/2 flex flex-col gap-5">
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 bg-black group">
                  <AnimatePresence mode="popLayout" custom={slideDirection}>
                    {isVideoUrl(currentImage) ? (
                      <motion.video
                        key={currentSlide.id}
                        custom={slideDirection}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        src={currentImage}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <motion.img
                        key={currentSlide.id}
                        custom={slideDirection}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.25}
                        onDragEnd={(_, { offset, velocity }) => {
                          if (offset.x < -50 || velocity.x < -300) {
                            handleNext();
                          } else if (offset.x > 50 || velocity.x > 300) {
                            handlePrev();
                          }
                        }}
                        src={currentImage}
                        alt={currentSlide.name}
                        onError={(e) => {
                          const fallbacks = CARACI_FALLBACKS[currentSlide.id] || [];
                          const target = e.currentTarget;
                          for (const fb of fallbacks) {
                            if (!target.src.endsWith(fb)) {
                              target.src = fb;
                              break;
                            }
                          }
                        }}
                        className="w-full h-full object-cover cursor-grab active:cursor-grabbing select-none"
                        draggable={false}
                      />
                    )}
                  </AnimatePresence>

                  {/* Direct Screen Edit Mode Button */}
                  {isFeedbackModeActive && triggerEditImage && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerEditImage(
                          slideImageKey,
                          `CARACI ${currentSlideIdx + 1}번 슬라이드 (${currentSlide.name})`,
                          currentImage
                        );
                      }}
                      className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl cursor-pointer hover:scale-105 transition-transform"
                      title={currentLang === 'en' ? 'Change this slide image' : currentLang === 'zh' ? '更换此幻灯片图片' : '이 슬라이드 이미지 변경하기'}
                    >
                      <ImageIcon size={13} />
                      <span>{currentLang === 'en' ? 'Change Image' : currentLang === 'zh' ? '更换图片' : '슬라이드 이미지 변경'}</span>
                    </button>
                  )}

                  {/* High Resolution Lightbox Zoom */}
                  <button
                    type="button"
                    onClick={() => setIsZoomOpen(true)}
                    className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/85 text-white transition-colors cursor-pointer border border-white/20 shadow-md opacity-80 hover:opacity-100"
                    title={currentLang === 'en' ? 'Zoom High-Res' : currentLang === 'zh' ? '放大高清图片' : '확대 보기'}
                  >
                    <Maximize2 size={15} />
                  </button>

                  {/* Image Navigation Arrows */}
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer shadow-lg opacity-80 hover:opacity-100"
                    aria-label={currentLang === 'en' ? 'Previous slide' : currentLang === 'zh' ? '上一张' : '이전 슬라이드'}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer shadow-lg opacity-80 hover:opacity-100"
                    aria-label={currentLang === 'en' ? 'Next slide' : currentLang === 'zh' ? '下一张' : '다음 슬라이드'}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* 6 Clean Slide Thumbnails */}
                <div>
                  <div className="grid grid-cols-6 gap-2">
                    {CARACI_SLIDES.map((slide, idx) => {
                      const isSelected = currentSlideIdx === idx;
                      const thumbKey = `image_caraci_slide_${slide.id}`;
                      const rawThumb = getImage 
                        ? getImage(thumbKey, slide.image) 
                        : (activeOverrides[thumbKey] || slide.image);
                      const thumbSrc = rawThumb.startsWith('/images/caraci/')
                        ? rawThumb.replace('/images/caraci/', '/images/')
                        : rawThumb;

                      return (
                        <button
                          key={slide.id}
                          onClick={() => goToSlide(idx)}
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-gray-900 dark:border-white ring-2 ring-gray-900/20 dark:ring-white/20 scale-105 shadow-md' 
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                          title={`${idx + 1}. ${slide.name}`}
                        >
                          <img 
                            src={thumbSrc} 
                            alt={slide.name} 
                            onError={(e) => {
                              const fallbacks = CARACI_FALLBACKS[slide.id] || [];
                              const target = e.currentTarget;
                              for (const fb of fallbacks) {
                                if (!target.src.endsWith(fb)) {
                                  target.src = fb;
                                  break;
                                }
                              }
                            }}
                            className="w-full h-full object-cover" 
                          />
                          <div className={`absolute bottom-0 inset-x-0 text-[10px] text-center font-bold py-0.5 ${isSelected ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-black/60 text-white'}`}>
                            {idx + 1}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Clean Editorial Product Info */}
              <div className="w-full lg:w-1/2 flex flex-col justify-between pt-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {/* Header info */}
                    <div>
                      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">
                        0{currentSlideIdx + 1} / 06
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {currentLang === 'zh' ? (currentSlide.nameZh || currentSlide.name) : currentSlide.name}
                      </h3>
                      <p className="text-sm font-medium text-gray-400 dark:text-gray-500 mt-0.5">
                        {currentSlide.nameEn}
                      </p>
                    </div>

                    {/* Tagline */}
                    <div className="text-base font-semibold text-gray-800 dark:text-gray-200">
                      {currentLang === 'en' 
                        ? (currentSlide.taglineEn || currentSlide.tagline) 
                        : currentLang === 'zh' 
                        ? (currentSlide.taglineZh || currentSlide.tagline) 
                        : currentSlide.tagline}
                    </div>

                    {/* Sensory Tasting Checkmarks - Pure Taste Evaluations Only! */}
                    <div className="space-y-2.5 pt-2">
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2">
                        {currentLang === 'en' ? 'Sensory Taste & Texture Profile' : currentLang === 'zh' ? '风味与口感评测' : '맛과 식감 평가'}
                      </span>
                      {(currentLang === 'en' 
                        ? (currentSlide.keywordsEn || currentSlide.keywords) 
                        : currentLang === 'zh' 
                        ? (currentSlide.keywordsZh || currentSlide.keywords) 
                        : currentSlide.keywords
                      ).map((kw, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-sm font-medium text-gray-800 dark:text-gray-200">
                          <span className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold">
                            ✓
                          </span>
                          <span>{kw}</span>
                        </div>
                      ))}
                    </div>

                    {/* Description - All gray boxes removed */}
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-sm sm:text-base leading-relaxed text-stone-700 dark:text-stone-300 font-normal">
                        {currentLang === 'en' 
                          ? (currentSlide.descEn || currentSlide.desc) 
                          : currentLang === 'zh' 
                          ? (currentSlide.descZh || currentSlide.desc) 
                          : currentSlide.desc}
                      </p>
                    </div>

                  </motion.div>
                </AnimatePresence>

                {/* Bottom Navigation Buttons */}
                <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  {/* Subtle dots indicator */}
                  <div className="flex items-center gap-1.5">
                    {CARACI_SLIDES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          currentSlideIdx === idx 
                            ? 'w-6 bg-gray-900 dark:bg-white' 
                            : 'w-1.5 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400'
                        }`}
                        aria-label={`슬라이드 ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Previous / Next buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      {currentLang === 'en' ? 'Previous' : currentLang === 'zh' ? '上一款' : '이전 제품'}
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-5 py-2 rounded-full bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold shadow-md cursor-pointer transition-all"
                    >
                      {currentLang === 'en' 
                        ? `Next (${currentSlideIdx + 1}/6)` 
                        : currentLang === 'zh' 
                        ? `下一款 (${currentSlideIdx + 1}/6)` 
                        : `다음 제품 (${currentSlideIdx + 1}/6)`}
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Full Resolution Zoom Lightbox */}
      {isZoomOpen && (
        <div 
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer animate-fadeIn"
        >
          <div className="max-w-5xl max-h-[90vh] flex flex-col items-center">
            {isVideoUrl(currentImage) ? (
              <video 
                src={currentImage} 
                autoPlay 
                loop 
                controls 
                className="max-h-[82vh] max-w-full rounded-2xl shadow-2xl border border-white/20" 
              />
            ) : (
              <img 
                src={currentImage} 
                alt={currentSlide.name} 
                className="max-h-[82vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/20"
              />
            )}
            <p className="mt-3 text-white text-sm font-semibold bg-black/70 px-5 py-2 rounded-full border border-white/20">
              {currentSlide.name} ({currentSlideIdx + 1}/6)
            </p>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
