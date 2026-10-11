/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ChevronRight, ChevronLeft, Globe, Menu, Search, ArrowRight, Phone, FileText, MonitorPlay, Users, Building2, X, ChevronDown, ChevronUp, Volume2, VolumeX, Sun, Moon, Eye, Download, Briefcase, Headset, MessageSquare, HelpCircle, CheckCircle2, Award, Star, Instagram, Youtube, BookOpen, ShoppingCart, Truck, Store, Package, Bell, Edit3, Image as ImageIcon, ShieldCheck, Sparkles } from 'lucide-react';
import { PRODUCTS, Product, TRANSLATIONS, LANGUAGES } from './constants';
import { AccordionMenu } from './components/AccordionMenu';
import companyLogo from '/images/company.png';
import NOTICES from './announcement/notices.json';
import { FeedbackSystem, TargetSectionType, isMediaVideo } from './components/FeedbackSystem';
import { CaraciShowcaseModal } from './components/CaraciShowcaseModal';
import { subscribeSiteOverrides } from './services/feedbackService';

const Modal = ({ isOpen, onClose, title, content, images, isDarkMode }: { isOpen: boolean; onClose: () => void; title: string; content: React.ReactNode; images?: string[]; isDarkMode?: boolean }) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    setActiveImageIdx(0);
  }, [isOpen, images]);

  return (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.85, opacity: 0, y: 60, rotateX: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30, rotateX: -10 }}
          transition={{ type: "spring", stiffness: 250, damping: 25 }}
          style={{ perspective: 1000 }}
          className={`${isDarkMode ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-gray-200'} border rounded-[2rem] w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`flex justify-between items-center p-6 md:p-8 border-b ${isDarkMode ? 'border-gray-800 bg-[#1a1a1a]/50' : 'border-gray-100 bg-white/50'} backdrop-blur-md shrink-0`}>
            <h2 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
            <button 
              onClick={onClose} 
              className={`p-2.5 rounded-full transition-all duration-300 ${isDarkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
              aria-label="Close Modal"
            >
              <X size={24} />
            </button>
          </div>
          <div className={`p-6 md:p-10 overflow-y-auto flex-1 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            {images && images.length > 0 ? (
              <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 relative group"
                  >
                    <AnimatePresence mode="wait">
                      <motion.img 
                        key={activeImageIdx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        src={images[activeImageIdx]} 
                        alt={`${title} main`} 
                        className={`w-full h-auto block group-hover:scale-[1.02] transition-transform duration-700 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`} 
                        referrerPolicy="no-referrer" 
                        loading="lazy" 
                        decoding="async" 
                      />
                    </AnimatePresence>
                  </motion.div>
                  {images.length > 1 && (
                    <div className="grid grid-cols-3 gap-4">
                      {images.map((img, idx) => {
                        if (idx === activeImageIdx) return null;
                        return (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (idx * 0.1), duration: 0.4 }}
                            onClick={() => setActiveImageIdx(idx)}
                            className={`rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 cursor-pointer group relative flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
                          >
                            <img src={img} alt={`${title} detail ${idx + 1}`} className="w-full h-auto block group-hover:scale-[1.05] transition-transform duration-500" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="w-full lg:w-1/2 flex flex-col pt-4 lg:pt-8"
                >
                  <div className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} leading-loose text-lg whitespace-pre-line max-w-none font-medium`}>
                    {typeof content === 'string' ? <p>{content}</p> : content}
                  </div>
                </motion.div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} leading-loose text-lg whitespace-pre-line max-w-none mx-auto`}
              >
                {typeof content === 'string' ? <p>{content}</p> : content}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  );
};

// 마우스 움직임에 따라 이미지가 기울어지는 3D 틸트 효과 컴포넌트
const TiltImage = ({ src, alt, isDarkMode, onClick }: { src: string, alt: string, isDarkMode: boolean, onClick?: () => void }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

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
      onClick={onClick}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative inline-block rounded-[2.5rem] overflow-hidden shadow-2xl ${isDarkMode ? 'bg-gray-800 border-gray-700 shadow-blue-900/10' : 'bg-white border-gray-100 shadow-red-900/10'} border-4 p-2 ${onClick ? 'cursor-pointer' : ''} group`}
    >
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="w-full h-full rounded-[2rem] overflow-hidden relative flex items-center justify-center">
        <img src={src} alt={alt} className="w-full h-auto max-h-[500px] object-contain transition-transform duration-700" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
      </div>
    </motion.div>
  );
};

// 푸터 모달용 고품질 콘텐츠 생성 함수
const InquiryForm = ({ isDarkMode, onClose, t }: { isDarkMode: boolean, onClose: () => void, t: any }) => {
  const [formData, setFormData] = useState({ name: '', email: '', contact: '', type: t.formCategoryProduct, content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { sendInquiryEmail, saveInquiryToLocal } = await import('./services/emailService');
      const data = { ...formData, id: Date.now().toString(), date: new Date().toISOString() };
      
      // Save locally first
      saveInquiryToLocal(data);
      
      // Attempt to send email
      await sendInquiryEmail(data);
      
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      alert(t.formError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={`p-8 text-center ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-green-100 text-green-600'}`}>
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold mb-2">{t.formSuccessTitle}</h3>
        <p className="opacity-80">{t.formSuccessDesc}</p>
      </div>
    );
  }

  const inputClass = `w-full p-4 border rounded-xl outline-none transition-all ${
    isDarkMode 
      ? 'bg-gray-800/50 border-gray-700 text-white focus:border-blue-500 focus:bg-gray-800' 
      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#6D1B2A] focus:bg-white'
  }`;

  const options = [t.formCategoryProduct, t.formCategoryPartnership, t.formCategoryOther];

  return (
    <div className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-bold mb-2">{t.formCategory}</label>
          <div 
            className={`${inputClass} flex justify-between items-center cursor-pointer`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>{formData.type}</span>
            <ChevronDown size={20} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </div>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute z-10 w-full mt-2 rounded-xl shadow-xl overflow-hidden border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
              >
                {options.map((option) => (
                  <div 
                    key={option}
                    className={`p-4 cursor-pointer transition-colors ${
                      formData.type === option 
                        ? (isDarkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-[#6D1B2A]/10 text-[#6D1B2A] font-bold') 
                        : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50')
                    }`}
                    onClick={() => {
                      setFormData({ ...formData, type: option });
                      setDropdownOpen(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2">{t.formName}</label>
            <input 
              type="text" 
              placeholder={t.formNamePlaceholder}
              className={inputClass}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">{t.formContact}</label>
            <input 
              type="tel" 
              placeholder={t.formContactPlaceholder}
              className={inputClass}
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              required 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">{t.formEmail}</label>
          <input 
            type="email" 
            placeholder={t.formEmailPlaceholder}
            className={inputClass}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold mb-2">{t.formContent}</label>
          <textarea 
            rows={6}
            placeholder={t.formContentPlaceholder}
            className={inputClass}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required 
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          } ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-[#6D1B2A] hover:bg-[#5A1622]'}`}
        >
          {isSubmitting ? t.formSubmitting : t.formSubmit}
        </button>
      </form>
    </div>
  );
};

const getFooterContent = (type: string, title: string, isDarkMode: boolean, t: any, onClose?: () => void, lang: string = 'ko') => {
  const baseClass = `space-y-6 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;
  const titleClass = `text-2xl font-bold mb-4 ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'}`;
  const cardClass = `p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-100'}`;
  const badgeClass = `inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${isDarkMode ? 'bg-blue-900/40 text-blue-400 border border-blue-800/50' : 'bg-red-50 text-[#6D1B2A] border border-red-200'}`;

  const contentMap: Record<string, React.ReactNode> = {
    korea: (
      <div className={baseClass}>
        <div className={cardClass}>
          <span className={badgeClass}>Global HQ</span>
          <h3 className={titleClass}>{lang === 'ko' ? '한국 (본사)' : lang === 'zh' ? '韩国 (全球总部)' : 'Korea (Global HQ)'}</h3>
          <p className="text-lg">
            {lang === 'ko'
              ? '에이치케이온 코리아 본사는 글로벌 소싱의 중심이자 전략적 허브입니다. 전 세계의 프리미엄 브랜드를 발굴하고, 국내 시장에 최적화된 유통 네트워크를 통해 고객에게 최상의 가치를 전달합니다.'
              : lang === 'zh'
              ? 'HKON 韩国总部是全球采购与战略物流的核心枢纽。我们严选全球顶尖美食品牌，依托覆盖全渠道的现代分销网络，为客户与消费者带来卓越价值。'
              : 'HKON Korea HQ serves as the strategic core of our global sourcing network. We curate world-class food brands and deliver supreme value to consumers through optimized distribution channels.'}
          </p>
        </div>
      </div>
    ),
    usa: (
      <div className={baseClass}>
        <div className={cardClass}>
          <span className={badgeClass}>North America Hub</span>
          <h3 className={titleClass}>{lang === 'ko' ? '미국 지사' : lang === 'zh' ? '美国分部' : 'USA Branch'}</h3>
          <p className="text-lg">
            {lang === 'ko'
              ? '북미 시장의 최신 식품 트렌드를 가장 먼저 발굴하고, 글로벌 프리미엄 브랜드와의 긴밀한 파트너십을 유지하는 핵심 거점입니다.'
              : lang === 'zh'
              ? '发掘北美市场前沿食品潮流，与全球知名食品跨国巨头保持紧密战略合作的海外核心据点。'
              : 'Our key hub for identifying cutting-edge North American F&B trends and fostering strategic partnerships with global brand owners.'}
          </p>
        </div>
      </div>
    ),
    japan: (
      <div className={baseClass}>
        <div className={cardClass}>
          <span className={badgeClass}>Asia Pacific Hub</span>
          <h3 className={titleClass}>{lang === 'ko' ? '일본 지사' : lang === 'zh' ? '日本分部' : 'Japan Branch'}</h3>
          <p className="text-lg">
            {lang === 'ko'
              ? '아시아 태평양 지역의 엄격한 품질 기준을 만족시키는 정교한 소싱 네트워크와 트렌드 분석을 담당합니다.'
              : lang === 'zh'
              ? '负责严谨高效的供应链品质管控与亚太地区前瞻性消费趋势调研。'
              : 'Responsible for meticulous sourcing networks and trend analytics adhering to strict Asia-Pacific quality standards.'}
          </p>
        </div>
      </div>
    ),
    china: (
      <div className={baseClass}>
        <div className={cardClass}>
          <span className={badgeClass}>East Asia Hub</span>
          <h3 className={titleClass}>{lang === 'ko' ? '중국 지사' : lang === 'zh' ? '中国分部' : 'China Branch'}</h3>
          <p className="text-lg">
            {lang === 'ko'
              ? '거대한 아시아 시장을 연결하는 전략적 물류 허브이자, 빠르게 변화하는 소비 트렌드에 대응하는 전초기지입니다.'
              : lang === 'zh'
              ? '连接广阔亚洲市场的战略物流中枢，以及敏锐响应瞬息万变消费趋势的前沿阵地。'
              : 'A strategic logistics hub bridging vast Asian markets, promptly adapting to dynamic consumer demands.'}
          </p>
        </div>
      </div>
    ),
    europe: (
      <div className={baseClass}>
        <div className={cardClass}>
          <span className={badgeClass}>Europe Hub</span>
          <h3 className={titleClass}>{lang === 'ko' ? '유럽 지사' : lang === 'zh' ? '欧洲分部' : 'Europe Branch'}</h3>
          <p className="text-lg">
            {lang === 'ko'
              ? '유럽의 전통 깊은 프리미엄 식품과 유기농 브랜드를 발굴하여 아시아 시장에 소개하는 역할을 수행합니다.'
              : lang === 'zh'
              ? '深度挖掘欧洲历史悠久的高端美食与有机认证工坊品牌，将其引入亚洲市场。'
              : 'Dedicated to discovering heritage European artisanal gastronomy and introducing authentic gourmet traditions.'}
          </p>
        </div>
      </div>
    ),
    vietnam: (
      <div className={baseClass}>
        <div className={cardClass}>
          <span className={badgeClass}>Southeast Asia Hub</span>
          <h3 className={titleClass}>{lang === 'ko' ? '베트남 지사' : lang === 'zh' ? '越南分部' : 'Vietnam Branch'}</h3>
          <p className="text-lg">
            {lang === 'ko'
              ? '빠르게 성장하는 동남아시아 신흥 시장의 핵심 파트너십 거점으로, 현지화된 유통 전략을 전개합니다.'
              : lang === 'zh'
              ? '东南亚新兴高成长市场的核心战略伙伴枢纽，积极推进本地化分销网络布局。'
              : 'Core partnership hub in fast-growing Southeast Asian markets executing localized distribution strategies.'}
          </p>
        </div>
      </div>
    ),
    thailand: (
      <div className={baseClass}>
        <div className={cardClass}>
          <span className={badgeClass}>Southeast Asia Hub</span>
          <h3 className={titleClass}>{lang === 'ko' ? '태국 지사' : lang === 'zh' ? '泰国分部' : 'Thailand Branch'}</h3>
          <p className="text-lg">
            {lang === 'ko'
              ? '동남아시아 식품 허브로서, 다양한 글로벌 브랜드의 현지 진출과 마케팅을 지원하는 전략적 요충지입니다.'
              : lang === 'zh'
              ? '作为东南亚美食中心，为多国高端品牌拓展当地市场与品牌推广提供战略支持。'
              : 'Strategic base supporting global food brand onboarding, marketing, and cross-border expansion in Southeast Asia.'}
          </p>
        </div>
      </div>
    ),
    indonesia: (
      <div className={baseClass}>
        <div className={cardClass}>
          <span className={badgeClass}>Southeast Asia Hub</span>
          <h3 className={titleClass}>{lang === 'ko' ? '인도네시아 지사' : lang === 'zh' ? '印度尼西亚分部' : 'Indonesia Branch'}</h3>
          <p className="text-lg">
            {lang === 'ko'
              ? '세계 최대 할랄 시장이자 역동적인 소비 시장인 인도네시아에서 프리미엄 브랜드의 입지를 다집니다.'
              : lang === 'zh'
              ? '立足全球庞大的高活力消费市场，夯实高端食品品牌的分销基础与市场份额。'
              : 'Solidifying our brand footprint across one of the most dynamic, high-potential consumer markets.'}
          </p>
        </div>
      </div>
    ),
    privacy: (
      <div className={baseClass}>
        <div className={cardClass}>
          <h3 className={titleClass}>{lang === 'ko' ? '개인정보처리방침' : lang === 'zh' ? '隐私政策' : 'Privacy Policy'}</h3>
          <p className="text-lg">
            {lang === 'ko'
              ? '에이치케이온 코리아는 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법령상의 개인정보보호 규정을 준수하며, 고객의 개인정보를 안전하게 보호하기 위해 최선을 다하고 있습니다.'
              : lang === 'zh'
              ? 'HKON 韩国严格遵守个人信息保护相关法律法规，全力保障用户个人隐私与信息安全。'
              : 'HKON Korea strictly adheres to all applicable privacy regulations to safeguard customer personal information securely.'}
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4 opacity-80 text-sm">
            <li>{lang === 'ko' ? '수집 항목: 이름, 연락처, 이메일, 문의 내용' : lang === 'zh' ? '收集内容：姓名、联系方式、电子邮箱、咨询详情' : 'Collected Items: Name, phone, email, inquiry details'}</li>
            <li>{lang === 'ko' ? '수집 목적: 고객 상담, 파트너십 안내 및 서비스 제공' : lang === 'zh' ? '使用目的：客户咨询答复、合作洽谈与服务支持' : 'Purpose: Customer inquiry resolution, partnership consultation'}</li>
            <li>{lang === 'ko' ? '보유 기간: 목적 달성 후 지체 없이 안전하게 파기' : lang === 'zh' ? '保留期限：目的达成后立即安全销毁' : 'Retention: Securely discarded immediately after purpose is fulfilled'}</li>
          </ul>
        </div>
      </div>
    ),
    terms: (
      <div className={baseClass}>
        <div className={cardClass}>
          <h3 className={titleClass}>{lang === 'ko' ? '이용약관' : lang === 'zh' ? '服务条款' : 'Terms of Service'}</h3>
          <p className="text-lg">
            {lang === 'ko'
              ? '본 약관은 에이치케이온 코리아가 제공하는 제반 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.'
              : lang === 'zh'
              ? '本条款旨在规范 HKON 韩国所提供各项在线服务的使用规则，明确企业与用户之间的权利、义务与责任。'
              : 'These terms stipulate the rights, duties, and responsibilities between HKON Korea and users regarding website and business services.'}
          </p>
        </div>
      </div>
    ),
    sitemap: (
      <div className={baseClass}>
        <div className={cardClass}>
          <h3 className={titleClass}>{lang === 'ko' ? '사이트맵' : lang === 'zh' ? '网站导航' : 'Sitemap'}</h3>
          <p className="text-lg mb-4">
            {lang === 'ko'
              ? '에이치케이온 코리아 웹사이트의 전체 구조를 한눈에 확인하실 수 있습니다.'
              : lang === 'zh'
              ? '一目了然查看 HKON 韩国官方网站的完整架构，快速直达所需页面。'
              : 'Easily navigate the entire structure of the HKON Korea website.'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm font-medium">
            <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl">{t.company}</div>
            <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl">{t.products}</div>
            <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl">{t.support}</div>
            <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl">{t.resources}</div>
          </div>
        </div>
      </div>
    ),
    location: (
      <div className={baseClass}>
        <div className={cardClass}>
          <h3 className={titleClass}>{lang === 'ko' ? '오시는 길' : lang === 'zh' ? '公司位置' : 'Location'}</h3>
          <p className="text-lg mb-4">
            {lang === 'ko'
              ? '에이치케이온 코리아 본사 및 통합 물류센터 오시는 길 안내입니다.'
              : lang === 'zh'
              ? 'HKON 韩国总部与综合物流中心交通导航指南。'
              : 'Directions and contact details for HKON Korea headquarters and logistics hub.'}
          </p>
          <div className="p-4 bg-black/5 dark:bg-white/5 rounded-xl text-sm space-y-1">
            <div><strong>{lang === 'ko' ? '본사 주소:' : lang === 'zh' ? '总部地址:' : 'Address:'}</strong> {t.address}</div>
            <div><strong>{lang === 'ko' ? '대표 번호:' : lang === 'zh' ? '客服电话:' : 'Phone:'}</strong> 1588-1285</div>
          </div>
        </div>
      </div>
    ),
    company: (
      <div className={baseClass}>
        <div className="text-xl font-medium mb-6">
          {t.introDesc}
        </div>
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4">
            <Globe className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'}`} />
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.coreCompetency}</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-[#6D1B2A]'}`} />
              <span>{t.core1}</span>
            </li>
            <li className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-[#6D1B2A]'}`} />
              <span>{t.core2}</span>
            </li>
            <li className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-[#6D1B2A]'}`} />
              <span>{t.core3}</span>
            </li>
          </ul>
        </div>
        <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-50/50'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Eye className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'}`} />
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.vision}</h3>
          </div>
          <p className="leading-relaxed">
            {t.visionDesc}
          </p>
        </div>
      </div>
    ),
    products: (
      <div className={baseClass}>
        <div className="text-xl font-medium mb-6">
          {lang === 'ko' ? '세계적으로 사랑받는 프리미엄 브랜드 라인업을 만나보세요.' : lang === 'zh' ? '探索备受全球赞誉的高端品牌家族。' : 'Discover our world-renowned premium brand portfolio.'}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={cardClass}>
            <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>CARACI</h3>
            <p className="text-sm opacity-80">{lang === 'ko' ? '시칠리아 에트나 화산지대 피스타치오 프리미엄 스프레드' : lang === 'zh' ? '西西里埃特纳火山区特级开心果涂抹酱' : 'Sicilian artisanal premium pistachio spread'}</p>
          </div>
          <div className={cardClass}>
            <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Häagen-Dazs</h3>
            <p className="text-sm opacity-80">{lang === 'ko' ? '최상의 원료로 만든 프리미엄 아이스크림의 대명사' : lang === 'zh' ? '严选纯正天然原料的高端冰淇淋传奇' : 'The undisputed hallmark of luxury ice cream'}</p>
          </div>
          <div className={cardClass}>
            <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>L'Antico</h3>
            <p className="text-sm opacity-80">{lang === 'ko' ? '110년 전통 이탈리아 정통 명문 로스팅 커피' : lang === 'zh' ? '110年历史意大利摩德纳名门烘焙咖啡' : 'Authentic Italian heritage roasting coffee'}</p>
          </div>
          <div className={cardClass}>
            <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>General Mills</h3>
            <p className="text-sm opacity-80">{lang === 'ko' ? '네이쳐밸리, 후룻바이더풋 등 글로벌 베스트셀러 스낵' : lang === 'zh' ? '天然谷、果丹皮卷等畅销全球健康零食' : 'Nature Valley, Fruit by the Foot & iconic snacks'}</p>
          </div>
        </div>
      </div>
    ),
    support: (
      <div className={baseClass}>
        <div className="text-xl font-medium mb-6">
          {lang === 'ko' ? '고객님의 성공적인 비즈니스를 위해 최선을 다해 지원합니다.' : lang === 'zh' ? '我们竭诚为您提供支持，助力您的商业成功。' : 'We are dedicated to supporting your successful business growth.'}
        </div>
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4">
            <Headset className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'}`} />
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.customerCenter}</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="opacity-80">{lang === 'ko' ? '대표 번호' : lang === 'zh' ? '客服热线' : 'Phone'}</span>
              <span className="font-bold text-lg">1588-1285</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="opacity-80">{lang === 'ko' ? '운영 시간' : lang === 'zh' ? '工作时间' : 'Hours'}</span>
              <span className="text-right">{t.weekdays}<br/><span className="text-sm opacity-70">{t.closedWeekends}</span></span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="opacity-80">{lang === 'ko' ? '이메일 문의' : lang === 'zh' ? '电子邮箱' : 'Email'}</span>
              <span>hkonkorea@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    ),
    inquiry: <InquiryForm isDarkMode={isDarkMode} onClose={onClose || (() => {})} t={t} />,
    careers: (
      <div className={baseClass}>
        <div className="text-xl font-medium mb-6">
          {lang === 'ko'
            ? '에이치케이온 코리아와 함께 글로벌 식품 시장을 선도할 열정적인 인재를 기다립니다.'
            : lang === 'zh'
            ? '期待与您携手共进，成为引领全球食品市场的杰出精英。'
            : 'Join HKON Korea in leading the future of global food and beverage culture.'}
        </div>
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'}`} />
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{lang === 'ko' ? '인재상' : lang === 'zh' ? '人才理念' : 'Core Values'}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-red-50 text-[#6D1B2A]'}`}>
                <Globe className="w-6 h-6" />
              </div>
              <div className="font-bold mb-1">Global Mind</div>
              <div className="text-sm opacity-80">{lang === 'ko' ? '글로벌 감각과 열린 사고' : lang === 'zh' ? '全球视野与开放思维' : 'Global Vision'}</div>
            </div>
            <div className="text-center p-4">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-red-50 text-[#6D1B2A]'}`}>
                <Users className="w-6 h-6" />
              </div>
              <div className="font-bold mb-1">Teamwork</div>
              <div className="text-sm opacity-80">{lang === 'ko' ? '소통과 협력을 통한 시너지' : lang === 'zh' ? '高效沟通与团队协作' : 'Synergy & Respect'}</div>
            </div>
            <div className="text-center p-4">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-red-50 text-[#6D1B2A]'}`}>
                <MonitorPlay className="w-6 h-6" />
              </div>
              <div className="font-bold mb-1">Challenge</div>
              <div className="text-sm opacity-80">{lang === 'ko' ? '변화를 두려워하지 않는 도전' : lang === 'zh' ? '勇于创新与开拓进取' : 'Bold Innovation'}</div>
            </div>
          </div>
        </div>
        <div className="text-center mt-6">
          <p className="mb-4 opacity-80">
            {lang === 'ko' ? '인재풀에 등록해주시면 적합한 포지션 오픈 시 우선적으로 연락드립니다.' : lang === 'zh' ? '欢迎投递加入我们的人才库，有合适职位时将优先联络。' : 'Submit your profile to our talent pool for future opportunities.'}
          </p>
          <button 
            onClick={() => {
              if (onClose) onClose();
              window.dispatchEvent(new CustomEvent('hkon-open-inquiry'));
            }}
            className={`px-6 py-3 rounded-full font-bold transition-colors cursor-pointer ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-[#6D1B2A] hover:bg-[#5A1622] text-white'}`}
          >
            {lang === 'ko' ? '인재풀 등록 / 지원하기' : lang === 'zh' ? '加入人才库 / 立即申请' : 'Register Talent Pool'}
          </button>
        </div>
      </div>
    )
  };

  const isGlobalNetwork = ['korea', 'usa', 'japan', 'china', 'europe', 'vietnam', 'thailand', 'indonesia'].includes(type);

  return (
    <div className="space-y-6">
      {contentMap[type]}
      {isGlobalNetwork && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/80' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
            <div className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Contact</div>
            <div className="text-sm opacity-80">hkonkorea@gmail.com</div>
          </div>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/80' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
            <div className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Address</div>
            <div className="text-sm opacity-80">경기 부천시 원미구 삼작로164번길</div>
          </div>
        </div>
      )}
    </div>
  );
};

const getAboutUsContent = (
  lang: string, 
  dark: boolean, 
  getText?: (key: string, def: string) => string, 
  onEdit?: (key: string, title: string, text: string) => void, 
  isEditMode?: boolean,
  getImage?: (key: string, def: string) => string,
  onEditImage?: (key: string, title: string, currentImage: string) => void
) => {
    const gText = getText || ((_, def) => def);
    const gImage = getImage || ((_, def) => def);
    const headerImg = gImage('image_aboutUs_header', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200');

    const defaultTitle = lang === 'ko' 
      ? "글로벌 미식 문화의 새로운 기준, 에이치케이온(HKON)" 
      : lang === 'zh' 
      ? "全球美食文化的新标杆，HKON" 
      : "The new standard of global gastronomy, HKON.";
    const currentTitle = gText('aboutUsTitle', defaultTitle);

    const defaultDesc = lang === 'ko'
      ? "에이치케이온(HKON)은 세계 각국의 프리미엄 F&B 브랜드를 발굴하여 국내 소비자에게 최상의 미식 경험을 제공하는 종합 식품 유통 기업입니다. 우리는 다변화하는 이커머스 생태계를 주도하고, B2B와 B2C를 아우르는 혁신적인 비즈니스 모델을 전개하고 있습니다."
      : lang === 'zh'
      ? "HKON 是一家综合性食品分销企业，致力于发掘世界各地的高端餐饮品牌，为国内消费者提供顶级的味蕾体验。我们超越了传统的进口业务，正在引领不断演变的电子商务生态系统，并开展涵盖 B2B 和 B2C 的创新商业模式。"
      : "HKON is a comprehensive food distribution enterprise that discovers premium F&B brands from around the world to provide domestic consumers with the ultimate gastronomic experience. Going beyond simple importation, we are leading the diversifying e-commerce ecosystem and unfolding an innovative business model encompassing both B2B and B2C.";
    const currentDesc = gText('aboutUsDesc', defaultDesc);

    const defaultEcom = lang === 'ko' 
      ? '국내 메인 온라인 플랫폼의 유통을 전면 주도하며, 전략적인 마케팅과 최적화된 세일즈로 폭발적인 성장을 이끌어냅니다. 브랜드의 가치를 극대화하는 맞춤형 온라인 전략을 통해 타겟 고객층에 가장 효과적으로 도달합니다.' 
      : lang === 'zh' 
      ? '全面主导国内主要在线平台的销售，通过战略营销和优化的销售策略推动爆发式增长。通过定制的在线策略，最大限度地提升品牌价值，最有效地触达目标客户群。' 
      : 'Leading distribution across major domestic online platforms, we drive explosive growth through strategic marketing and optimized sales. We reach target audiences most effectively through customized online strategies that maximize brand value.';
    const currentEcom = gText('ecommerceDesc', defaultEcom);

    const defaultFulfil = lang === 'ko' 
      ? '대규모 냉동창고와 자체 라인을 기반으로, 입출고부터 보관, 재고 관리, 배송까지 원스톱 콜드체인 물류 솔루션을 완벽하게 제공합니다. 최첨단 WMS(창고관리시스템)를 도입하여 오차율 0%에 도전하는 정확하고 빠른 물류를 실현합니다.' 
      : lang === 'zh' 
      ? '依托大型冷库和自有流水线，我们完美提供从入库出库到仓储、库存管理和配送的一站式冷链物流解决方案。引入先进的WMS系统，挑战0%误差率，实现精准快速的物流。' 
      : 'Based on large-scale cold storage and our own operation lines, we perfectly provide a one-stop cold-chain logistics solution covering inbound/outbound, storage, inventory, to delivery. Using advanced WMS, we realize accurate and fast logistics aiming for a 0% error rate.';
    const currentFulfil = gText('fulfillmentDesc', defaultFulfil);

    return (
      <motion.div 
        initial="hidden" animate="visible" 
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
        className={`space-y-8 ${dark ? 'text-gray-300' : 'text-gray-700'}`}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="w-full h-64 md:h-80 rounded-3xl overflow-hidden relative shadow-xl group">
          <img 
            src={headerImg} 
            alt="Logistics and E-Commerce" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <h3 className="text-white text-3xl font-bold">
              {lang === 'ko' ? '끊임없는 도전과 혁신' : lang === 'zh' ? '不断的挑战与创新' : 'Relentless Challenge and Innovation'}
            </h3>
          </div>
          {isEditMode && (
            <button
              onClick={() => onEditImage?.('image_aboutUs_header', 'About Us 대표 이미지', headerImg)}
              className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl cursor-pointer hover:scale-105 transition-transform"
              title="이 이미지 변경 제안/적용하기"
            >
              <ImageIcon size={13} />
              <span>이미지 변경</span>
            </button>
          )}
        </motion.div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className={`text-2xl font-black leading-relaxed ${dark ? 'text-blue-400' : 'text-[#6D1B2A]'}`}>
              {currentTitle}
            </motion.p>
            {isEditMode && (
              <button 
                onClick={() => onEdit?.('aboutUsTitle', 'About Us 타이틀', currentTitle)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-transform hover:scale-105 cursor-pointer"
                title="이 타이틀 문구 수정 제안하기"
              >
                <Edit3 size={12} />
                <span>문구 수정</span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="leading-relaxed text-lg font-medium">
              {currentDesc}
            </motion.p>
            {isEditMode && (
              <div className="flex justify-end">
                <button 
                  onClick={() => onEdit?.('aboutUsDesc', 'About Us 소개 본문', currentDesc)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-transform hover:scale-105 cursor-pointer"
                  title="소개 본문 문구 수정 제안하기"
                >
                  <Edit3 size={12} />
                  <span>문구 수정</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-6 mt-8">
          {/* 1. 이커머스 */}
          <div className={`p-8 rounded-3xl border ${dark ? 'bg-gray-800/80 border-gray-700' : 'bg-gray-50/80 border-gray-100'} shadow-sm flex flex-col gap-5`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${dark ? 'bg-blue-900/40 text-blue-400' : 'bg-red-50 text-[#6D1B2A]'}`}>
                  <ShoppingCart size={28} />
                </div>
                <h4 className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                  {lang === 'ko' ? '이커머스 운영' : lang === 'zh' ? '电子商务运营' : 'E-commerce Operations'}
                </h4>
              </div>
              {isEditMode && (
                <button 
                  onClick={() => onEdit?.('ecommerceDesc', '이커머스 운영 설명', currentEcom)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-transform hover:scale-105 cursor-pointer"
                  title="이커머스 설명 문구 수정 제안하기"
                >
                  <Edit3 size={12} />
                  <span>문구 수정</span>
                </button>
              )}
            </div>
            <p className={`text-base leading-relaxed font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
              {currentEcom}
            </p>
            <ul className={`grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-blue-400' : 'bg-[#6D1B2A]'}`}/> {lang === 'ko' ? '주요 플랫폼 직거래 및 벤더 운영' : lang === 'zh' ? '主要平台的直营与供应商运营' : 'Direct and vendor operations on major platforms'}</li>
              <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-blue-400' : 'bg-[#6D1B2A]'}`}/> {lang === 'ko' ? '트렌드 분석 기반의 퍼포먼스 마케팅' : lang === 'zh' ? '基于趋势分析的绩效营销' : 'Performance marketing based on trend analysis'}</li>
              <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-blue-400' : 'bg-[#6D1B2A]'}`}/> {lang === 'ko' ? '브랜드 자사몰(D2C) 구축 및 통합 관리' : lang === 'zh' ? '品牌D2C商城建设与综合管理' : 'D2C mall establishment and integrated management'}</li>
              <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-blue-400' : 'bg-[#6D1B2A]'}`}/> {lang === 'ko' ? '실시간 데이터 수집 및 판매 예측 최적화' : lang === 'zh' ? '实时数据收集与销售预测优化' : 'Real-time data collection and sales forecast optimization'}</li>
            </ul>
          </div>

          {/* 2. 3PL */}
          <div className={`p-8 rounded-3xl border ${dark ? 'bg-gray-800/80 border-gray-700' : 'bg-gray-50/80 border-gray-100'} shadow-sm flex flex-col gap-5`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${dark ? 'bg-blue-900/40 text-blue-400' : 'bg-red-50 text-[#6D1B2A]'}`}>
                  <Truck size={28} />
                </div>
                <h4 className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                  {lang === 'ko' ? '올인원 3PL 풀필먼트' : lang === 'zh' ? '多合一 3PL 履行' : 'All-in-One 3PL Fulfillment'}
                </h4>
              </div>
              {isEditMode && (
                <button 
                  onClick={() => onEdit?.('fulfillmentDesc', '올인원 3PL 풀필먼트 설명', currentFulfil)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-transform hover:scale-105 cursor-pointer"
                  title="3PL 설명 문구 수정 제안하기"
                >
                  <Edit3 size={12} />
                  <span>문구 수정</span>
                </button>
              )}
            </div>
            <p className={`text-base leading-relaxed font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
              {currentFulfil}
            </p>
            <ul className={`grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-blue-400' : 'bg-[#6D1B2A]'}`}/> {lang === 'ko' ? '최신식 스마트 콜드체인 물류 센터 완비' : lang === 'zh' ? '配备最先进的智能冷链物流中心' : 'Equipped with state-of-the-art smart cold chain center'}</li>
              <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-blue-400' : 'bg-[#6D1B2A]'}`}/> {lang === 'ko' ? '실시간 재고 연동 및 자동화 WMS 시스템' : lang === 'zh' ? '实时库存同步与自动化WMS系统' : 'Real-time inventory sync & automated WMS'}</li>
              <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-blue-400' : 'bg-[#6D1B2A]'}`}/> {lang === 'ko' ? '꼼꼼한 품질 검수(QC) 및 맞춤형 패키징' : lang === 'zh' ? '严格的质量检验(QC)与定制化包装' : 'Thorough QC and customized packaging'}</li>
              <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-blue-400' : 'bg-[#6D1B2A]'}`}/> {lang === 'ko' ? '당일 출고 및 새벽 배송 인프라 완벽 연계' : lang === 'zh' ? '当日出库与清晨配送基础设施完美整合' : 'Same-day shipping and dawn delivery integration'}</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const getWhatsNewContent = (lang: string, dark: boolean) => {
    return (
      <motion.div 
        initial="hidden" animate="visible" 
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
        className={`space-y-6 ${dark ? 'text-gray-300' : 'text-gray-700'}`}
      >
        <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className={`text-xl font-medium ${dark ? 'text-blue-400' : 'text-[#6D1B2A]'}`}>
          {lang === 'ko' ? "HKON의 새로운 소식 & 신제품" : lang === 'zh' ? "HKON的新闻与新产品" : "HKON News & New Products"}
        </motion.p>
        <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
          {lang === 'ko' 
            ? "에이치케이온이 새롭게 선보이는 신제품 라인업과 핫한 팝업 스토어, 특별한 브랜드 프로모션 소식을 가장 빠르게 확인하세요."
            : lang === 'zh'
            ? "第一时间获取 HKON 全新引进的海外品牌、火爆的快闪店活动以及限时特别优惠等最新资讯。"
            : "Stay updated with HKON's newest product launches, brand partnerships, and exciting events."}
        </motion.p>

        <div className="space-y-4 mt-6">
          <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className={`${dark ? 'bg-blue-900/20 border-blue-800/50 hover:bg-blue-900/30' : 'bg-red-50 border-red-100 hover:bg-red-100/50'} p-6 rounded-3xl border flex items-start gap-5 transition-all hover:shadow-xl duration-300`}>
            <div className={`mt-1 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${dark ? 'bg-blue-800/50 text-blue-300 shadow-lg shadow-blue-900/20' : 'bg-white text-[#6D1B2A] shadow-md shadow-red-200/50'}`}>
              <Star size={24} />
            </div>
            <div>
              <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2 ${dark ? 'bg-blue-500 text-white' : 'bg-[#6D1B2A] text-white'}`}>New Product</div>
              <h5 className={`font-bold text-lg mb-1.5 ${dark ? 'text-blue-400' : 'text-[#6D1B2A]'}`}>
                {lang === 'ko' ? "이탈리아 No.1 디저트 '티라미수 클라시코' 단독 런칭" : lang === 'zh' ? "意大利第一甜点“经典提拉米苏”独家推出" : "Exclusive Launch: Italy's #1 Dessert 'Tiramisu Classico'"}
              </h5>
              <p className={`text-sm font-medium ${dark ? 'text-blue-200/70' : 'text-[#6D1B2A]/70'}`}>
                {lang === 'ko' ? "본고장의 마스카포네 치즈로 완성된 프리미엄 신제품을 만나보세요" : lang === 'zh' ? "品尝正宗马斯卡彭奶酪制成的高端新产品" : "Experience the premium new product made with authentic Mascarpone cheese"}
              </p>
            </div>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className={`${dark ? 'bg-blue-900/20 border-blue-800/50 hover:bg-blue-900/30' : 'bg-red-50 border-red-100 hover:bg-red-100/50'} p-6 rounded-3xl border flex items-start gap-5 transition-all hover:shadow-xl duration-300`}>
            <div className={`mt-1 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${dark ? 'bg-blue-800/50 text-blue-300 shadow-lg shadow-blue-900/20' : 'bg-white text-[#6D1B2A] shadow-md shadow-red-200/50'}`}>
              <span className="font-bold text-xl">🔥</span>
            </div>
            <div>
              <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2 ${dark ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'}`}>Notice</div>
              <h5 className={`font-bold text-lg mb-1.5 ${dark ? 'text-blue-400' : 'text-[#6D1B2A]'}`}>
                {lang === 'ko' ? "네이쳐밸리 리뉴얼 패키지 런칭 팝업" : lang === 'zh' ? "天然谷全新包装快闪店盛大启幕" : "Nature Valley Revamped Packaging Launch"}
              </h5>
              <p className={`text-sm font-medium ${dark ? 'text-blue-200/70' : 'text-[#6D1B2A]/70'}`}>
                {lang === 'ko' ? "여의도 더현대 서울 지하 1층 팝업존" : lang === 'zh' ? "汝矣岛 The Hyundai Seoul 地下一层" : "The Hyundai Seoul, B1 Pop-up Zone"}
              </p>
            </div>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className={`${dark ? 'bg-blue-900/20 border-blue-800/50 hover:bg-blue-900/30' : 'bg-red-50 border-red-100 hover:bg-red-100/50'} p-6 rounded-3xl border flex items-start gap-5 transition-all hover:shadow-xl duration-300`}>
            <div className={`mt-1 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${dark ? 'bg-blue-800/50 text-blue-300 shadow-lg shadow-blue-900/20' : 'bg-white text-[#6D1B2A] shadow-md shadow-red-200/50'}`}>
              <Building2 size={24} />
            </div>
            <div>
              <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2 ${dark ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'}`}>Notice</div>
              <h5 className={`font-bold text-lg mb-1.5 ${dark ? 'text-blue-400' : 'text-[#6D1B2A]'}`}>
                {lang === 'ko' ? "이탈리아 정통 커피 '란티코' B2B 납품" : lang === 'zh' ? "兰蒂科(L'Antico)成功入驻多家国内顶级高端酒店" : "L'Antico Secures B2B Partnerships"}
              </h5>
              <p className={`text-sm font-medium ${dark ? 'text-blue-200/70' : 'text-[#6D1B2A]/70'}`}>
                {lang === 'ko' ? "국내 프리미엄 호텔 5곳 브루잉 센터 계약 체결 완료" : lang === 'zh' ? "与国内5家高端酒店正式签署入驻协议" : "Brewing center contracts confirmed with 5 premium domestic hotels"}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  const getProductContent = (product: Product, lang: string, dark: boolean) => {
    return (
      <motion.div 
        initial="hidden" animate="visible" 
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
        className={`space-y-8 ${dark ? 'text-gray-300' : 'text-gray-700'}`}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 ${dark ? 'bg-blue-900/40 text-blue-400 border border-blue-800/50' : 'bg-red-50 text-[#6D1B2A] border border-red-200'}`}>
            <Award size={14} />
            Premium Collection
          </div>
          <p className="text-xl font-medium leading-relaxed whitespace-pre-line">
            {product.description[lang as keyof typeof product.description] || product.description.en}
          </p>
        </motion.div>

        {product.website && (
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
            <a 
              href={product.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`block w-full p-6 rounded-2xl border transition-all duration-300 group ${dark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-blue-500/50' : 'bg-gray-50 border-gray-200 hover:bg-white hover:shadow-xl hover:border-red-200'} cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${dark ? 'bg-blue-900/50 text-blue-400' : 'bg-red-100 text-[#6D1B2A]'}`}>
                    <Globe size={24} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h5 className={`font-bold text-lg mb-0.5 ${dark ? 'text-white' : 'text-gray-900'}`}>
                      {lang === 'ko' ? '공식 브랜드 웹사이트' : lang === 'zh' ? '品牌官方网站' : 'Official Brand Website'}
                    </h5>
                    <p className="text-sm opacity-70">
                      {product.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </p>
                  </div>
                </div>
                <ArrowRight size={24} className={`${dark ? 'text-gray-600 group-hover:text-white' : 'text-gray-400 group-hover:text-[#6D1B2A]'} transition-colors group-hover:translate-x-1`} />
              </div>
            </a>
          </motion.div>
        )}
      </motion.div>
    );
  };


export default function App() {
  const [currentLang, setCurrentLang] = useState('ko');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [modal, setModal] = useState<{ isOpen: boolean; title: string; content: React.ReactNode; images?: string[] }>({ isOpen: false, title: '', content: null });
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeDetailSlide, setActiveDetailSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Staff Feedback & Firebase site text/image overrides state
  const [activeOverrides, setActiveOverrides] = useState<Record<string, string>>({});
  const [isFeedbackModeActive, setIsFeedbackModeActive] = useState(false);
  const [isAdminActive, setIsAdminActive] = useState(() => {
    try {
      return localStorage.getItem('hkon_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [targetSection, setTargetSection] = useState<TargetSectionType | null>(null);
  const [isCaraciShowcaseOpen, setIsCaraciShowcaseOpen] = useState(false);

  useEffect(() => {
    // Initial local overrides load and sanitize obsolete boilerplate & cross-language contamination
    try {
      const local = JSON.parse(localStorage.getItem('hkon_local_overrides') || '{}');
      let cleaned = false;
      ['caraci_feat1', 'caraci_feat2'].forEach((k) => {
        if (local[k] && (local[k].includes('전 세계') || local[k].includes('콜드체인') || local[k].includes('타협 없는') || local[k].includes('품질 인증') || local[k].includes('고객만족도'))) {
          delete local[k];
          cleaned = true;
        }
      });
      // Sanitize old contaminated keys where Korean text was accidentally copied to _en or _zh
      Object.keys(local).forEach(k => {
        if ((k.endsWith('_en') || k.endsWith('_zh')) && /[가-힣]/.test(local[k])) {
          delete local[k];
          cleaned = true;
        }
        if (typeof local[k] === 'string' && local[k].startsWith('/images/caraci/')) {
          local[k] = local[k].replace('/images/caraci/', '/images/');
          cleaned = true;
        }
        if (typeof local[k] === 'string' && local[k].includes('카라치')) {
          local[k] = local[k].replace(/카라치/g, 'CARACI');
          cleaned = true;
        }
      });
      if (cleaned) {
        localStorage.setItem('hkon_local_overrides', JSON.stringify(local));
      }
      if (Object.keys(local).length > 0) {
        setActiveOverrides((prev) => ({ ...prev, ...local }));
      }
    } catch {
      // ignore
    }

    const unsub = subscribeSiteOverrides((overrides) => {
      // Sanitize obsolete boilerplate and cross-language contamination from remote overrides as well
      const sanitized = { ...overrides };
      ['caraci_feat1', 'caraci_feat2'].forEach((k) => {
        if (sanitized[k] && (sanitized[k].includes('전 세계') || sanitized[k].includes('콜드체인') || sanitized[k].includes('타협 없는') || sanitized[k].includes('품질 인증') || sanitized[k].includes('고객만족도'))) {
          delete sanitized[k];
        }
      });
      Object.keys(sanitized).forEach(k => {
        if ((k.endsWith('_en') || k.endsWith('_zh')) && /[가-힣]/.test(sanitized[k])) {
          delete sanitized[k];
        }
        if (typeof sanitized[k] === 'string' && sanitized[k].startsWith('/images/caraci/')) {
          sanitized[k] = sanitized[k].replace('/images/caraci/', '/images/');
        }
        if (typeof sanitized[k] === 'string' && sanitized[k].includes('카라치')) {
          sanitized[k] = sanitized[k].replace(/카라치/g, 'CARACI');
        }
      });
      setActiveOverrides((prev) => ({ ...prev, ...sanitized }));
    });
    return () => unsub();
  }, []);

  // Sync isAdminActive with localStorage so admin session persists
  useEffect(() => {
    if (isAdminActive) {
      try {
        localStorage.setItem('hkon_admin_authenticated', 'true');
      } catch {}
    }
  }, [isAdminActive]);

  // Keyboard shortcut (Alt + A) and URL hash (#admin) listener for company staff
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#admin' || window.location.search.includes('admin=')) {
        setIsAdminPortalOpen(true);
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input/textarea
      const activeEl = document.activeElement;
      const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || (activeEl as HTMLElement).isContentEditable);

      if (isTyping) return;

      // 1. F2 or Ctrl+M / Cmd+M / Shift+M / Alt+A: Toggle Admin Center
      if (
        e.key === 'F2' ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'm' || e.key === 'M' || e.key === 'ㅡ')) ||
        (e.shiftKey && (e.key === 'm' || e.key === 'M' || e.key === 'ㅡ')) ||
        (e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ㅁ'))
      ) {
        e.preventDefault();
        setIsAdminPortalOpen(prev => !prev);
        return;
      }

      // 2. F4 or Ctrl+E / Cmd+E / Shift+E / Alt+E: Toggle On-Screen Direct Edit Mode (화면 직접 수정 모드)
      if (
        e.key === 'F4' ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'e' || e.key === 'E' || e.key === 'ㄷ')) ||
        (e.shiftKey && (e.key === 'e' || e.key === 'E' || e.key === 'ㄷ')) ||
        (e.altKey && (e.key === 'e' || e.key === 'E' || e.key === 'ㄷ'))
      ) {
        e.preventDefault();
        setIsFeedbackModeActive(prev => !prev);
        return;
      }

      // 3. Esc: Close admin portal if open
      if (e.key === 'Escape') {
        setIsAdminPortalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getText = (key: string, defaultText: string) => {
    const baseKey = key.replace(/_(ko|en|zh)$/, '');

    // Generate alternate alias keys so hero slides and detail slides resolve seamlessly
    const altKey = baseKey
      .replace('about-us', 'about')
      .replace('whats-new', 'whatsnew')
      .replace('haagen-dazs', 'haagendazs')
      .replace('general-mills', 'generalmills');

    const revAltKey = baseKey
      .replace('about', 'about-us')
      .replace('whatsnew', 'whats-new')
      .replace('haagendazs', 'haagen-dazs')
      .replace('generalmills', 'general-mills');

    let result = defaultText;

    // 1. Language-specific override takes top priority
    const langKey = `${baseKey}_${currentLang}`;
    const altLangKey = `${altKey}_${currentLang}`;
    const revAltLangKey = `${revAltKey}_${currentLang}`;
    if (activeOverrides[langKey]) {
      result = activeOverrides[langKey];
    } else if (activeOverrides[altLangKey]) {
      result = activeOverrides[altLangKey];
    } else if (activeOverrides[revAltLangKey]) {
      result = activeOverrides[revAltLangKey];
    } else if (key.endsWith(`_${currentLang}`) && activeOverrides[key]) {
      // Check direct key if it already has the active language suffix
      result = activeOverrides[key];
    } else if (currentLang === 'ko') {
      // 2. Base override candidate ONLY applies for Korean to avoid cross-language contamination
      const baseCandidate = activeOverrides[baseKey] || 
        (altKey !== baseKey ? activeOverrides[altKey] : undefined) ||
        (revAltKey !== baseKey ? activeOverrides[revAltKey] : undefined);

      if (baseCandidate) {
        // Discard obsolete boilerplate for caraci features
        if (baseKey.startsWith('caraci_feat') && (
          baseCandidate.includes('전 세계') || 
          baseCandidate.includes('콜드체인') ||
          baseCandidate.includes('타협 없는') ||
          baseCandidate.includes('품질 인증') ||
          baseCandidate.includes('고객만족도')
        )) {
          result = defaultText;
        } else {
          result = baseCandidate;
        }
      }
    }

    if (typeof result === 'string' && result.includes('카라치')) {
      return result.replace(/카라치/g, 'CARACI');
    }
    return result;
  };

  const getImage = (key: string, defaultImage: string) => {
    const altKey = key
      .replace('about-us', 'about')
      .replace('whats-new', 'whatsnew')
      .replace('haagen-dazs', 'haagendazs')
      .replace('general-mills', 'generalmills');
    const revAltKey = key
      .replace('about', 'about-us')
      .replace('whatsnew', 'whats-new')
      .replace('haagendazs', 'haagen-dazs')
      .replace('generalmills', 'general-mills');
    let candidate = activeOverrides[key] || activeOverrides[altKey] || activeOverrides[revAltKey];
    if (candidate) {
      if (candidate.startsWith('/images/caraci/')) {
        candidate = candidate.replace('/images/caraci/', '/images/');
      }
      return candidate;
    }
    return defaultImage;
  };

  const triggerEdit = (key: string, title: string, currentText: string) => {
    setTargetSection({ key, title, currentText, isImage: false, lang: currentLang });
  };

  const triggerEditImage = (key: string, title: string, currentImage: string) => {
    setTargetSection({ key, title, currentImage, isImage: true });
  };

  const handleDirectApplyOptimistic = (key: string, value: string, targetLang?: string) => {
    const isImage = key.startsWith('image_');
    const matchedLang = key.match(/_(ko|en|zh)$/)?.[1] || targetLang || currentLang;
    const baseKey = key.replace(/_(ko|en|zh)$/, '');
    const altKey = baseKey
      .replace('about-us', 'about')
      .replace('whats-new', 'whatsnew')
      .replace('haagen-dazs', 'haagendazs')
      .replace('general-mills', 'generalmills');
    const revAltKey = baseKey
      .replace('about', 'about-us')
      .replace('whatsnew', 'whats-new')
      .replace('haagendazs', 'haagen-dazs')
      .replace('generalmills', 'general-mills');

    const keysToUpdate: string[] = [];

    if (isImage) {
      keysToUpdate.push(key, baseKey, altKey, revAltKey);
    } else {
      // Language-specific text update: ONLY update this specific language!
      const lang = matchedLang;
      keysToUpdate.push(`${baseKey}_${lang}`);
      if (altKey !== baseKey) keysToUpdate.push(`${altKey}_${lang}`);
      if (revAltKey !== baseKey) keysToUpdate.push(`${revAltKey}_${lang}`);

      // If editing Korean, also keep baseKey in sync for backwards compatibility
      if (lang === 'ko') {
        keysToUpdate.push(baseKey);
        if (altKey !== baseKey) keysToUpdate.push(altKey);
        if (revAltKey !== baseKey) keysToUpdate.push(revAltKey);
      }
    }

    const uniqueKeys = Array.from(new Set(keysToUpdate));

    setActiveOverrides(prev => {
      const next = { ...prev };
      if (!value) {
        uniqueKeys.forEach(k => delete next[k]);
      } else {
        uniqueKeys.forEach(k => {
          next[k] = value;
        });
      }
      try {
        localStorage.setItem('hkon_local_overrides', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const t = TRANSLATIONS[currentLang as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  const openModal = (title: string, content: React.ReactNode, images?: string[]) => setModal({ isOpen: true, title, content, images });

  const getResourcesContent = (lang: string, dark: boolean) => {
    return (
      <div className="space-y-8">
        <div className={`p-8 rounded-3xl border ${dark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50'} text-center`}>
          <Download size={48} className={`mx-auto mb-6 ${dark ? 'text-blue-400' : 'text-[#6D1B2A]'}`} />
          <h3 className="text-2xl font-bold mb-4">{lang === 'ko' ? '미디어 자료실' : lang === 'zh' ? '媒体库' : 'Media Center'}</h3>
          <p className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-700'}`}>
            {lang === 'ko' ? '제품 카탈로그, 제안서, 홍보 영상 등 다양한 자료를 열람하실 수 있습니다.' : 'You can browse catalogs, proposals, and promotional videos.'}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {[
            { title: lang === 'ko' ? '제품 카탈로그' : 'Catalog', desc: lang === 'ko' ? '최신 제품 정보' : 'Product Info' },
            { title: lang === 'ko' ? '브랜드 브로슈어' : 'Brochure', desc: lang === 'ko' ? '브랜드 스토리 및 소개' : 'Brand Story' },
            { title: lang === 'ko' ? '품질 인증서' : 'Certificates', desc: lang === 'ko' ? 'HACCP 및 품질 보증' : 'HACCP & QA' },
            { title: lang === 'ko' ? '입점 제안서' : 'Proposals', desc: lang === 'ko' ? 'B2B 파트너십 안내' : 'B2B Guide' },
            { title: lang === 'ko' ? '홍보 영상' : 'Videos', desc: lang === 'ko' ? '기업 및 제품 영상' : 'Promo Videos' },
            { title: lang === 'ko' ? '기타 자료' : 'Others', desc: lang === 'ko' ? '이벤트 및 프로모션' : 'Events & Promos' }
          ].map((res, idx) => (
            <div key={idx} className={`p-6 rounded-3xl border ${dark ? 'border-gray-800 bg-gray-800/50 hover:bg-gray-800 hover:border-blue-500/50' : 'border-gray-200 bg-white hover:shadow-xl hover:border-red-200'} flex flex-col items-center justify-center text-center cursor-pointer transition-all group`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${dark ? 'bg-gray-700 text-gray-300 group-hover:bg-blue-900/50 group-hover:text-blue-400' : 'bg-gray-100 text-gray-500 group-hover:bg-red-50 group-hover:text-[#6D1B2A]'} transition-colors`}>
                <FileText size={24} />
              </div>
              <span className={`font-bold text-base mb-1 ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{res.title}</span>
              <span className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-500'}`}>{res.desc}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getCompanyIntro = (lang: string, dark: boolean) => {
    return (
      <motion.div 
        initial="hidden" animate="visible" 
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
        className={`space-y-8 ${dark ? 'text-gray-300' : 'text-gray-700'}`}
      >
        {/* Company Overview */}
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className={`${dark ? 'bg-blue-900/20 border-blue-800/50 hover:bg-blue-900/30' : 'bg-red-50 border-red-100 hover:bg-red-100/50'} p-8 md:p-10 rounded-3xl border transition-colors`}>
          <h4 className={`font-bold text-2xl ${dark ? 'text-blue-400' : 'text-[#6D1B2A]'} mb-6 flex items-center gap-3`}><Building2 size={28}/> {lang === 'ko' ? '회사 개요' : lang === 'zh' ? '公司简介' : 'Company Overview'}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div className={`flex flex-col gap-1 pb-4 border-b ${dark ? 'border-blue-800/50' : 'border-red-200/60'}`}>
              <span className={`text-sm font-bold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{lang === 'ko' ? '회사명' : lang === 'zh' ? '公司名称' : 'Company Name'}</span>
              <span className={`text-lg font-medium ${dark ? 'text-gray-200' : 'text-gray-900'}`}>{lang === 'ko' ? '에이치케이온 주식회사 (HKON)' : lang === 'zh' ? 'HKON 株式会社' : 'HKON Co., Ltd.'}</span>
            </div>
            <div className={`flex flex-col gap-1 pb-4 border-b ${dark ? 'border-blue-800/50' : 'border-red-200/60'}`}>
              <span className={`text-sm font-bold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{lang === 'ko' ? '설립일' : lang === 'zh' ? '成立日期' : 'Established'}</span>
              <span className={`text-lg font-medium ${dark ? 'text-gray-200' : 'text-gray-900'}`}>2020. 03. 15</span>
            </div>
            <div className={`flex flex-col gap-1 pb-4 border-b ${dark ? 'border-blue-800/50' : 'border-red-200/60'}`}>
              <span className={`text-sm font-bold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{lang === 'ko' ? '주요 사업' : lang === 'zh' ? '主要业务' : 'Main Business'}</span>
              <span className={`text-lg font-medium ${dark ? 'text-gray-200' : 'text-gray-900'}`}>{lang === 'ko' ? '프리미엄 식품 수입 유통, E-Commerce, 3PL 풀필먼트' : lang === 'zh' ? '高端食品进口分销, 电子商务, 3PL 履行' : 'Premium Food Distribution, E-Commerce, 3PL Fulfillment'}</span>
            </div>
            <div className={`flex flex-col gap-1 pb-4 border-b ${dark ? 'border-blue-800/50' : 'border-red-200/60'}`}>
              <span className={`text-sm font-bold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{lang === 'ko' ? '본사 소재지' : lang === 'zh' ? '总部地址' : 'Headquarters'}</span>
              <span className={`text-lg font-medium ${dark ? 'text-gray-200' : 'text-gray-900'}`}>{lang === 'ko' ? '경기도 부천시 원미구 삼작로 164번길' : lang === 'zh' ? '京畿道富川市远美区三作路164号街' : '164 Samjak-ro, Wonmi-gu, Bucheon-si, Gyeonggi-do'}</span>
            </div>
          </div>
        </motion.div>

        <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'} p-8 rounded-2xl border`}>
          <h4 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2 text-xl`}><Eye size={24}/> {t.vision}</h4>
          <p className={`${dark ? 'text-gray-400' : 'text-gray-700'} leading-relaxed text-lg`}>{t.visionDesc}</p>
        </div>
      </motion.div>
    );
  };

  // 메뉴 클릭 핸들러 (각 메뉴별로 모달 띄우거나 스크롤 이동)
  // 사용자가 사이드바나 모바일 메뉴에서 항목을 클릭했을 때 호출됩니다.
  // 각 메뉴 항목에 맞는 모달을 열거나, 특정 섹션으로 부드럽게 스크롤합니다.
  const handleMenuClick = (item: string) => {
    // 1. 회사 소개 메뉴 클릭 시: 회사 소개 모달을 엽니다.
    if (item === t.company) {
      openModal(item, getCompanyIntro(currentLang, isDarkMode));
    } 
    // 2. 제품 소개 메뉴 클릭 시: 제품 소개 섹션으로 부드럽게 스크롤합니다.
    else if (item === t.products) {
      // 제품 소개 섹션의 ID를 찾아 스크롤 이동
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // 섹션을 찾을 수 없는 경우 예외 처리
        openModal(item, currentLang === 'ko' ? "제품 소개 섹션으로 이동합니다." : currentLang === 'zh' ? "正在前往产品介绍页面。" : "Navigating to Products section.");
      }
    } 
    // 3. 공지사항 메뉴 클릭 시: 최근 공지사항 목록을 모달로 보여줍니다.
    else if (item === t.notice) {
      const noticeContent = (
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-4">
            {currentLang === 'ko' ? '최근 2년 공지사항 (2024-2026)' : currentLang === 'zh' ? '近两年官方公告资讯 (2024-2026)' : 'Recent Announcements (2024-2026)'}
          </h3>
          <ul className="space-y-3">
            {NOTICES.map((notice, idx) => (
              <li 
                key={idx} 
                // 공지사항 항목 클릭 시 상세 내용을 모달로 다시 엽니다.
                onClick={() => openModal(notice.title[currentLang as keyof typeof notice.title] || notice.title.en, notice.content[currentLang as keyof typeof notice.content] || notice.content.en)}
                className={`p-4 rounded-xl border ${isDarkMode ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800' : 'border-gray-200 bg-gray-50 hover:bg-white'} hover:shadow-md transition-all cursor-pointer group`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-semibold ${isDarkMode ? 'text-blue-400 group-hover:text-blue-300' : 'text-[#6D1B2A] group-hover:text-[#5A1622]'} transition-colors`}>{notice.title[currentLang as keyof typeof notice.title] || notice.title.en}</span>
                  <span className="text-sm text-gray-400">{notice.date}</span>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} line-clamp-2`}>{notice.content[currentLang as keyof typeof notice.content] || notice.content.en}</p>
              </li>
            ))}
          </ul>
        </div>
      );
      openModal(item, noticeContent);
    } 
    // 4. 고객 지원 관련 메뉴 클릭 시: 고객 센터, 온라인 문의, FAQ 안내 모달을 엽니다.
    else if (item === t.support || item === t.customerSupport) {
      const supportContent = (
        <div className="space-y-8">
          <div className={`p-8 rounded-3xl border ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50'} text-center`}>
            <Headset size={48} className={`mx-auto mb-6 ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'}`} />
            <h3 className="text-2xl font-bold mb-4">{currentLang === 'ko' ? '무엇을 도와드릴까요?' : currentLang === 'zh' ? '我们能为您提供什么帮助？' : 'How can we help you?'}</h3>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>{currentLang === 'ko' ? '고객님의 성공적인 비즈니스를 위해 최선을 다해 지원합니다.' : currentLang === 'zh' ? '我们竭诚为您提供支持，助力您的商业成功。' : 'We are dedicated to supporting your successful business growth.'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 고객 센터 안내 */}
            <div className={`p-8 rounded-3xl border ${isDarkMode ? 'border-gray-800 bg-gray-800/80 hover:bg-gray-800' : 'border-gray-200 bg-white hover:shadow-xl'} transition-all text-center group cursor-pointer`}>
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${isDarkMode ? 'bg-blue-900/30 text-blue-400 group-hover:bg-blue-500 group-hover:text-white' : 'bg-red-50 text-[#6D1B2A] group-hover:bg-[#6D1B2A] group-hover:text-white'} transition-colors`}>
                <Phone size={28} />
              </div>
              <h4 className="font-bold text-xl mb-3">{currentLang === 'ko' ? '고객 센터' : currentLang === 'zh' ? '客服热线' : 'Customer Service'}</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>1588-1285</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{currentLang === 'ko' ? '평일 09:30 - 18:30' : currentLang === 'zh' ? '工作日 09:30 - 18:30' : 'Weekdays 09:30 - 18:30'}</p>
            </div>
            {/* 온라인 문의 안내 */}
            <div onClick={() => openModal(t.inquiry, <InquiryForm isDarkMode={isDarkMode} onClose={() => setModal(m => ({ ...m, isOpen: false }))} t={t} />)} className={`p-8 rounded-3xl border ${isDarkMode ? 'border-gray-800 bg-gray-800/80 hover:bg-gray-800' : 'border-gray-200 bg-white hover:shadow-xl'} transition-all text-center group cursor-pointer`}>
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${isDarkMode ? 'bg-blue-900/30 text-blue-400 group-hover:bg-blue-500 group-hover:text-white' : 'bg-red-50 text-[#6D1B2A] group-hover:bg-[#6D1B2A] group-hover:text-white'} transition-colors`}>
                <MessageSquare size={28} />
              </div>
              <h4 className="font-bold text-xl mb-3">{currentLang === 'ko' ? '온라인 문의' : currentLang === 'zh' ? '在线咨询' : 'Online Inquiry'}</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{currentLang === 'ko' ? '24시간 접수 가능' : currentLang === 'zh' ? '24小时均可提交' : '24/7 Submissions'}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{currentLang === 'ko' ? '순차적으로 답변해 드립니다.' : currentLang === 'zh' ? '我们将按顺序为您答复' : 'Prompt replies provided.'}</p>
            </div>
            {/* FAQ 안내 */}
            <div onClick={() => handleMenuClick(currentLang === 'ko' ? '자주 묻는 질문(FAQ)' : currentLang === 'zh' ? '常见问题(FAQ)' : 'FAQ')} className={`p-8 rounded-3xl border ${isDarkMode ? 'border-gray-800 bg-gray-800/80 hover:bg-gray-800' : 'border-gray-200 bg-white hover:shadow-xl'} transition-all text-center group cursor-pointer`}>
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${isDarkMode ? 'bg-blue-900/30 text-blue-400 group-hover:bg-blue-500 group-hover:text-white' : 'bg-red-50 text-[#6D1B2A] group-hover:bg-[#6D1B2A] group-hover:text-white'} transition-colors`}>
                <HelpCircle size={28} />
              </div>
              <h4 className="font-bold text-xl mb-3">{currentLang === 'ko' ? '자주 묻는 질문' : currentLang === 'zh' ? '常见问题' : 'FAQ'}</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{currentLang === 'ko' ? 'FAQ 확인하기' : currentLang === 'zh' ? '查看常见解答' : 'Check Answers'}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{currentLang === 'ko' ? '빠른 해결책을 찾아보세요.' : currentLang === 'zh' ? '快速获取方案' : 'Find quick solutions'}</p>
            </div>
          </div>
        </div>
      );
      openModal(item, supportContent);
    } 
    // 5. 채용/교육 관련 메뉴 클릭 시: 채용 정보 모달을 엽니다.
    else if (item === t.careers || item === t.training) {
      const careersContent = (
        <div className="space-y-8">
          <div className={`p-8 rounded-3xl border ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50'} text-center`}>
            <Briefcase size={48} className={`mx-auto mb-6 ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'}`} />
            <h3 className="text-2xl font-bold mb-4">{currentLang === 'ko' ? '함께 성장할 인재를 찾습니다' : currentLang === 'zh' ? '寻找与我们共同成长的杰出人才' : 'Looking for Talents to Grow Together'}</h3>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>{currentLang === 'ko' ? '에이치케이온 코리아와 함께 미래를 만들어갈 여러분을 기다립니다.' : currentLang === 'zh' ? '期待与您携手共创 HKON 韩国的美好未来。' : 'We welcome you to shape the future together with HKON Korea.'}</p>
          </div>
          <div className={`p-8 rounded-3xl border ${isDarkMode ? 'border-gray-800 bg-gray-800/80' : 'border-gray-200 bg-white'} shadow-sm`}>
            <h4 className={`text-xl font-bold mb-6 flex items-center gap-3 ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'}`}><Users size={24}/> {currentLang === 'ko' ? '진행 중인 채용 공고' : currentLang === 'zh' ? '热招职位公告' : 'Open Positions'}</h4>
            <ul className="space-y-4">
              <li className={`flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl border ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'} transition-colors group cursor-pointer`}>
                <div className="mb-4 md:mb-0">
                  <p className={`text-lg font-bold mb-1 ${isDarkMode ? 'group-hover:text-blue-400' : 'group-hover:text-[#6D1B2A]'} transition-colors`}>{currentLang === 'ko' ? '식품 유통 영업 담당자 (신입/경력)' : currentLang === 'zh' ? '食品分销销售经理 (应届/经验)' : 'F&B Sales & Distribution Specialist (Entry/Experienced)'}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{currentLang === 'ko' ? '영업본부 | 서울 본사 | 정규직' : currentLang === 'zh' ? '销售事业部 | 首尔总部 | 全职' : 'Sales Division | Seoul HQ | Full-time'}</p>
                </div>
                <span className={`px-4 py-1.5 text-sm font-bold rounded-full ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-red-50 text-[#6D1B2A]'}`}>{currentLang === 'ko' ? '채용중' : currentLang === 'zh' ? '招聘中' : 'Hiring'}</span>
              </li>
              <li className={`flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl border ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'} transition-colors group cursor-pointer`}>
                <div className="mb-4 md:mb-0">
                  <p className={`text-lg font-bold mb-1 ${isDarkMode ? 'group-hover:text-blue-400' : 'group-hover:text-[#6D1B2A]'} transition-colors`}>{currentLang === 'ko' ? '마케팅 기획 담당자 (경력)' : currentLang === 'zh' ? '品牌营销策划经理 (具备经验)' : 'Global Marketing Strategist (Experienced)'}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{currentLang === 'ko' ? '마케팅팀 | 서울 본사 | 정규직' : currentLang === 'zh' ? '市场营销部 | 首尔总部 | 全职' : 'Marketing Division | Seoul HQ | Full-time'}</p>
                </div>
                <span className={`px-4 py-1.5 text-sm font-bold rounded-full ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-red-50 text-[#6D1B2A]'}`}>{currentLang === 'ko' ? '채용중' : currentLang === 'zh' ? '招聘中' : 'Hiring'}</span>
              </li>
            </ul>
          </div>
        </div>
      );
      openModal(item, careersContent);
    } 
    // 6. 자료실 메뉴 클릭 시: 제품 카탈로그 등 자료 다운로드 모달을 엽니다.
    else if (item === t.resources) {
      openModal(item, getResourcesContent(currentLang, isDarkMode));
    } 
    // 7. 제품 문의 메뉴 클릭 시: 문의 폼 모달을 엽니다.
    else if (item === t.inquiry) {
      openModal(item, <InquiryForm isDarkMode={isDarkMode} onClose={() => setModal(m => ({ ...m, isOpen: false }))} t={t} />);
    } 
    // 8. 문의 관리 (Admin) 메뉴 클릭 시:
    else if (item === t.inquiryManagement) {
      const getInquiries = () => {
        try {
          const items = localStorage.getItem('hkon_inquiries');
          return items ? JSON.parse(items) : [];
        } catch { return []; }
      };
      
      const items = getInquiries();
      
      const content = (
        <div className="space-y-6">
          <div className="text-xl font-bold mb-4">{currentLang === 'ko' ? '접수된 문의 내역' : currentLang === 'zh' ? '已提交的咨询记录' : 'Submitted Inquiries'}</div>
          {items.length === 0 ? (
            <p className="opacity-80">{currentLang === 'ko' ? '저장된 문의가 없습니다.' : currentLang === 'zh' ? '暂无保存的咨询记录。' : 'No inquiries recorded yet.'}</p>
          ) : (
            <ul className="space-y-4">
              {items.reverse().map((inq: any, idx: number) => (
                <li key={idx} className={`p-4 rounded-xl border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                  <div className="font-bold flex justify-between">
                    <span>{inq.type} - {inq.name}</span>
                    <span className="text-sm opacity-70">{new Date(inq.date).toLocaleString()}</span>
                  </div>
                  <div className="text-xs opacity-80 mt-1 mb-2">연락처: {inq.contact} | 이메일: {inq.email}</div>
                  <div className="p-3 bg-black/5 rounded-lg text-sm whitespace-pre-wrap">{inq.content}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
      openModal(item, content);
    } 
    // 9. 그 외의 경우: 메뉴 아이템별 상세 콘텐츠를 다국어(KO, EN, ZH)로 완벽하게 제공합니다.
    else {
      const SUBMENU_DATA: Record<string, {
        title: { ko: string; en: string; zh: string };
        desc: { ko: string; en: string; zh: string };
        image?: string;
      }> = {
        overview: {
          title: { ko: '회사개요', en: 'Company Overview', zh: '公司简介' },
          desc: {
            ko: "에이치케이온(HKON)은 독보적인 글로벌 소싱 네트워크와 철저한 품질 관리를 통해 세계 최상급 F&B 브랜드를 국내 소비자에게 이어주는 프리미엄 식품 유통사입니다.\n\n설립일: 2020년\n사업 분야: 프리미엄 식품 유통, 3PL (제3자 물류) 서비스\n주요 브랜드: 하겐다즈, 제너럴밀즈, 란티코, CARACI 등",
            en: "HKON is a premier food distribution company connecting world-class F&B brands to domestic consumers through an unmatched global sourcing network and rigorous quality control.\n\nEstablished: 2020\nBusiness Sectors: Premium food distribution, 3PL cold-chain logistics\nKey Brands: Häagen-Dazs, General Mills, L'Antico, CARACI, etc.",
            zh: "HKON 是一家依托独树一帜的全球采购网络与严苛质量把控，将全球顶级餐饮品牌带给国内消费者的专业食品分销机构。\n\n成立时间：2020年\n业务范围：高端食品进口分销、3PL第三方冷链物流服务\n合作品牌：哈根达斯、通用磨坊、兰蒂科、CARACI 等"
          },
          image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
        },
        history: {
          title: { ko: '회사연혁', en: 'Company History', zh: '发展历程' },
          desc: {
            ko: "2024 - 물류 센터 확장 및 3PL 서비스 고도화\n2023 - CARACI 공식 파트너십 체결 (시칠리아 프리미엄 스프레드)\n2022 - 란티코(L'Antico) 공식 파트너십 체결\n2021 - 제너럴밀즈 공식 파트너십 체결\n2020 - 에이치케이온 코리아 설립 및 하겐다즈 유통 시작",
            en: "2024 - Logistics center expansion & advanced 3PL service rollout\n2023 - Signed official partnership with CARACI (Sicilian premium spread)\n2022 - Signed official partnership with L'Antico Caffe\n2021 - Signed official partnership with General Mills\n2020 - Established HKON Korea and commenced Häagen-Dazs distribution",
            zh: "2024年 - 扩建智能冷链物流中心并全面升级3PL综合服务\n2023年 - 与西西里顶级涂抹酱品牌 CARACI 正式签署独家合作\n2022年 - 与意大利百年咖啡品牌兰蒂科(L'Antico)签署官方战略协议\n2021年 - 与全球食品巨头通用磨坊(General Mills)达成全面经销合作\n2020年 - HKON 韩国正式创立并全面启动哈根达斯经销业务"
          },
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"
        },
        ci: {
          title: { ko: 'CI 소개', en: 'CI Introduction', zh: '企业标识(CI)' },
          desc: {
            ko: "HKON의 CI는 '글로벌을 향한 연결(Connection)'과 '무한한 가능성(ON)'을 상징합니다. 굵고 선명한 타이포그래피는 고객과 세계 최고 수준의 브랜드를 잇는 굳건한 신뢰의 다리가 되겠다는 당사의 굳은 의지를 시각적으로 담아냈습니다.",
            en: "HKON's Corporate Identity symbolizes 'Global Connection' and 'Boundless Potential (ON)'. The bold, modern typography visually conveys our unwavering commitment to being a trusted bridge connecting consumers with the world's most distinguished brands.",
            zh: "HKON 的企业标识(CI)象征着“全球连接(Connection)”与“无限潜能(ON)”。鲜明沉稳的字体设计，直观呈现了我们作为连接消费者与全球顶尖品牌之间坚实信赖桥梁的崇高使命。"
          },
          image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80"
        },
        location: {
          title: { ko: '오시는 길', en: 'Location & Map', zh: '公司位置' },
          desc: {
            ko: "본사 주소: 경기도 부천시 원미구 삼작로 164번길, 에이치케이온 코리아\n\n[대중교통 이용 시]\n- 지하철 7호선 부천시청역 하차 후 버스 환승\n\n[차량 이용 시]\n- 경인고속도로 부천IC에서 10분 거리",
            en: "Headquarters: 164 Samjak-ro, Wonmi-gu, Bucheon-si, Gyeonggi-do, Republic of Korea\n\n[Public Transportation]\n- Subway Line 7 (Bucheon City Hall Station) -> Transfer to local bus\n\n[By Car]\n- 10 minutes from Bucheon IC on Gyeongin Expressway",
            zh: "总部地址：韩国京畿道富川市远美区三作路164号街，HKON\n\n[公共交通]\n- 地铁7号线富川市厅站下车后换乘公交车\n\n[驾车路线]\n- 距离京仁高速公路富川IC仅需10分钟车程"
          },
          image: "https://images.unsplash.com/photo-1548345680-f5475ea90f14?auto=format&fit=crop&w=800&q=80"
        },
        customerInquiry: {
          title: { ko: '고객 문의', en: 'Customer Inquiries', zh: '客户咨询' },
          desc: {
            ko: "제품 및 서비스에 대한 문의사항을 남겨주시면 신속하고 친절하게 답변해 드립니다.\n\n대표 번호: 1588-1285\n운영 시간: 평일 09:30 ~ 18:30 (주말 및 공휴일 휴무)\n이메일: hkonkorea@gmail.com",
            en: "Please feel free to reach out to us with any product or service inquiries. Our team will respond promptly.\n\nMain Phone: +82-1588-1285\nBusiness Hours: Weekdays 09:30 - 18:30 KST (Closed on weekends and holidays)\nEmail: hkonkorea@gmail.com",
            zh: "如果您对我们的产品与服务有任何疑问，请随时联系我们，我们将竭诚为您服务。\n\n客服热线：1588-1285\n工作时间：工作日 09:30 ~ 18:30（周末及节假日休息）\n电子邮箱：hkonkorea@gmail.com"
          },
          image: "https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?auto=format&fit=crop&w=800&q=80"
        },
        partnerInquiry: {
          title: { ko: '입점/제휴 문의', en: 'Partnership & Store Inquiries', zh: '合作加盟' },
          desc: {
            ko: "에이치케이온 코리아와의 성공적인 비즈니스 파트너십을 환영합니다. 새로운 브랜드 입점 제안 및 B2B 유통 제휴와 관련된 세부적인 문의는 온라인 문의 폼을 이용해 주시거나 대표 이메일로 제안서를 송부해주시기 바랍니다.",
            en: "We warmly welcome strategic business partnerships with HKON Korea. For new brand onboarding proposals and B2B distribution partnerships, please use our online inquiry form or send your proposal directly to our official email.",
            zh: "热烈欢迎与 HKON 韩国开展战略商业合作。如果您有海外新品牌入驻提案或 B2B 分销合作需求，请通过网站咨询表单提交或直接将合作方案发送至我们的官方邮箱。"
          },
          image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80"
        },
        faq: {
          title: { ko: '자주 묻는 질문(FAQ)', en: 'FAQ', zh: '常见问题(FAQ)' },
          desc: {
            ko: "Q. 배송은 보통 얼마나 걸리나요?\nA. 평일 오후 2시 이전 결제 완료 건에 한하여 당일 출고되며, 보통 1~2영업일 이내에 배송이 완료됩니다.\n\nQ. B2B 대량 구매 시 할인이 적용되나요?\nA. 네, 기업 및 단체를 위한 대량 구매의 경우 별도의 파트너십 할인율이 적용됩니다. 고객 지원 센터로 상세 수량을 기재하여 문의 부탁드립니다.",
            en: "Q. What is the standard shipping lead time?\nA. Orders placed before 2:00 PM on weekdays are dispatched the same day, typically delivered within 1 to 2 business days.\n\nQ. Are discounts available for B2B bulk orders?\nA. Yes, preferential partnership discount rates apply for corporate and bulk wholesale purchases. Please contact our support team with your requested quantity.",
            zh: "问：通常的配送时效是多久？\n答：工作日下午2点前完成付款的订单当天出库，通常在1至2个工作日内送达。\n\n问：B2B大宗采购是否有批量折扣？\n答：是的，针对企业和机构的大宗采购，我们提供专项合作伙伴折扣。欢迎联系客户服务中心并注明具体采购需求。"
          },
          image: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&w=800&q=80"
        },
        talent: {
          title: { ko: '인재상', en: 'Talent Philosophy', zh: '人才理念' },
          desc: {
            ko: "에이치케이온이 찾는 인재상:\n\n1. 열정 (Passion)\n식음료 트렌드를 사랑하고 자신의 업무에 강한 자부심을 가진 인재\n\n2. 도전 (Challenge)\n새로운 시장을 선제적으로 개척하고 혁신을 두려워하지 않는 인재\n\n3. 상생 (Cooperation)\n비즈니스 파트너 및 동료들과 진정성 있게 소통하며 함께 성장하는 인재",
            en: "HKON Talent Philosophy:\n\n1. Passion\nTalents who are genuinely enthusiastic about global F&B trends and take immense pride in their craftsmanship.\n\n2. Challenge\nTalents who proactively pioneer emerging markets and embrace bold innovation without fear of failure.\n\n3. Cooperation\nTalents who communicate sincerely with global partners and team members to create shared sustainable growth.",
            zh: "HKON 核心人才理念：\n\n1. 热忱 (Passion)\n热爱全球美食潮流、对自身专业领域抱有崇高自豪感与追求的杰出人才\n\n2. 挑战 (Challenge)\n敢为人先、主动开拓新兴市场、勇于拥抱变革与创新的开拓者\n\n3. 合作 (Cooperation)\n真诚倾听客户与伙伴需求、与团队紧密协作共同实现可持续共赢的合作者"
          },
          image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
        },
        hrPolicy: {
          title: { ko: '인사제도', en: 'HR Policy', zh: '人事制度' },
          desc: {
            ko: "공정하고 유연한 성과 중심의 인사 제도와 임직원의 전문성 성장을 돕는 교육 지원 프로그램을 운영합니다.",
            en: "We operate a fair, merit-based human resources system alongside comprehensive professional development and welfare programs.",
            zh: "我们实行公平开放、以绩效为导向的人事管理机制，并提供全方位的专业技能培训与员工福利关怀体系。"
          },
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"
        },
        recruitment: {
          title: { ko: '채용 공고', en: 'Job Openings', zh: '招聘公告' },
          desc: {
            ko: "현재 진행 중인 채용 공고:\n- 식품 유통 영업 담당자 (신입/경력) | 서울 본사 | 정규직\n- 글로벌 마케팅 기획자 (경력) | 서울 본사 | 정규직\n- 콜드체인 물류 운영 관리자 (경력) | 부천 물류센터 | 정규직",
            en: "Current Open Positions:\n- F&B Sales & Distribution Specialist (Entry/Experienced) | Seoul HQ | Full-time\n- Global Marketing Strategist (Experienced) | Seoul HQ | Full-time\n- Cold-Chain Logistics Operations Manager (Experienced) | Bucheon Center | Full-time",
            zh: "当前热招岗位：\n- 食品分销与销售代表（应届/经验）| 首尔总部 | 全职\n- 全球品牌营销企划（具备经验）| 首尔总部 | 全职\n- 冷链物流综合运营主管（具备经验）| 富川物流中心 | 全职"
          },
          image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
        },
        catalog: {
          title: { ko: '제품 카탈로그', en: 'Product Catalog', zh: '产品目录' },
          desc: {
            ko: "에이치케이온 코리아 공식 브랜드 카탈로그 및 제품 소개서 (PDF)를 다운로드하실 수 있습니다.",
            en: "Download the official HKON Korea brand catalog and product specification guide (PDF).",
            zh: "您可以下载获取 HKON 韩国全线官方品牌产品目录与规格指南 (PDF)。"
          },
          image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
        },
        promoVideos: {
          title: { ko: '홍보 영상', en: 'Promo Videos', zh: '宣传视频' },
          desc: {
            ko: "에이치케이온 코리아의 글로벌 소싱 스토리와 프리미엄 브랜드 영상을 확인하실 수 있습니다.",
            en: "Watch HKON Korea's global sourcing story and premium brand showcase videos.",
            zh: "观看 HKON 韩国全球溯源探索纪录片与高端合作品牌宣传短片。"
          },
          image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80"
        },
        brochure: {
          title: { ko: '브로슈어', en: 'Brand Brochure', zh: '品牌宣传册' },
          desc: {
            ko: "에이치케이온 코리아의 기업 비전과 수입 브랜드 소개가 담긴 종합 브로슈어입니다.",
            en: "Comprehensive brand brochure introducing HKON Korea's corporate vision and imported premium portfolio.",
            zh: "涵盖 HKON 韩国企业愿景及全线进口高端品牌介绍的综合品牌宣传册。"
          },
          image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80"
        }
      };

      const langKey = (currentLang === 'zh' ? 'zh' : currentLang === 'en' ? 'en' : 'ko') as 'ko' | 'en' | 'zh';
      const matchedKey = Object.keys(SUBMENU_DATA).find(k => {
        const itemInfo = SUBMENU_DATA[k];
        return itemInfo.title.ko === item || itemInfo.title.en === item || itemInfo.title.zh === item;
      });

      if (matchedKey) {
        const info = SUBMENU_DATA[matchedKey];
        const modalTitle = info.title[langKey] || info.title.en;
        const modalDesc = info.desc[langKey] || info.desc.en;
        const contentComponent = (
          <div className="space-y-6">
            <div className={`p-8 rounded-3xl border ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50'} shadow-sm whitespace-pre-line text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {modalDesc}
            </div>
          </div>
        );
        openModal(modalTitle, contentComponent, info.image ? [info.image] : undefined);
      } else {
        const defaultNotice = currentLang === 'ko'
          ? `${item}와 관련된 상세 내용을 준비 중입니다. 잠시만 기다려 주시기 바랍니다.`
          : currentLang === 'zh'
          ? `正在为您准备 ${item} 的详细内容，请稍候。`
          : `Preparing detailed information for ${item}. Please check back shortly.`;
        const contentComponent = (
          <div className="space-y-6">
            <div className={`p-8 rounded-3xl border ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50'} shadow-sm whitespace-pre-line text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {defaultNotice}
            </div>
          </div>
        );
        openModal(item, contentComponent);
      }
    }
  };

  const navItems = [
    t.company, t.products, t.notice, t.support, t.careers, t.resources
  ];

  const menuData: { [key: string]: { name: string; hasSub?: boolean, content?: string }[] } = {
    [t.company]: [
      { name: currentLang === 'ko' ? "회사개요" : currentLang === 'zh' ? "公司简介" : "Company Overview" },
      { name: currentLang === 'ko' ? "회사연혁" : currentLang === 'zh' ? "发展历程" : "Company History" },
      { name: currentLang === 'ko' ? "CI 소개" : currentLang === 'zh' ? "企业标识(CI)" : "CI Introduction" },
      { name: currentLang === 'ko' ? "오시는 길" : currentLang === 'zh' ? "公司位置" : "Location & Map" },
    ],
    [t.products]: [
      { name: t.haagendazs },
      { name: t.natureValley },
      { name: t.lantico },
      { name: t.caraci },
      { name: t.fruitByTheFoot },
      { name: t.greenGiant },
    ],
    [t.notice]: NOTICES.map(notice => ({ 
      name: notice.title[currentLang as keyof typeof notice.title] || notice.title.en,
      content: notice.content[currentLang as keyof typeof notice.content] || notice.content.en
    })),
    [t.support]: [
      { name: currentLang === 'ko' ? "고객 문의" : currentLang === 'zh' ? "客户咨询" : "Customer Inquiries" },
      { name: currentLang === 'ko' ? "입점/제휴 문의" : currentLang === 'zh' ? "合作加盟" : "Partnership & Store Inquiries" },
      { name: currentLang === 'ko' ? "자주 묻는 질문(FAQ)" : currentLang === 'zh' ? "常见问题(FAQ)" : "FAQ" },
    ],
    [t.careers]: [
      { name: currentLang === 'ko' ? "인재상" : currentLang === 'zh' ? "人才理念" : "Talent Philosophy" },
      { name: currentLang === 'ko' ? "인사제도" : currentLang === 'zh' ? "人事制度" : "HR Policy" },
      { name: currentLang === 'ko' ? "채용 공고" : currentLang === 'zh' ? "招聘公告" : "Job Openings" },
    ],
    [t.resources]: [
      { name: currentLang === 'ko' ? "제품 카탈로그" : currentLang === 'zh' ? "产品目录" : "Product Catalog" },
      { name: currentLang === 'ko' ? "홍보 영상" : currentLang === 'zh' ? "宣传视频" : "Promo Videos" },
      { name: currentLang === 'ko' ? "브로슈어" : currentLang === 'zh' ? "品牌宣传册" : "Brand Brochure" },
    ]
  };

  const quickLinks = [
    { icon: <HelpCircle size={32} />, title: "FAQ", desc: currentLang === 'ko' ? '자주 묻는 질문' : currentLang === 'zh' ? '常见问题' : 'Frequently Asked Questions' },
    { icon: <Bell size={32} />, title: t.notice, desc: currentLang === 'ko' ? '새로운 소식' : currentLang === 'zh' ? '最新消息' : 'Announcements' },
    { icon: <Headset size={32} />, title: t.support || t.customerSupport, desc: "1588-1285" },
    { icon: <Briefcase size={32} />, title: t.careers || t.training, desc: currentLang === 'ko' ? '인재 채용 풀 등록' : currentLang === 'zh' ? '诚聘英才，加入我们' : 'Join our team' },
    { icon: <Download size={32} />, title: t.resources, desc: currentLang === 'ko' ? '공식 카탈로그 요청' : currentLang === 'zh' ? '产品目录与宣传册下载' : 'Media & Downloads' },
  ];

  const heroSlides = React.useMemo(() => [
    {
      title: getText('heroSlide_company_title', t.hkonKorea),
      subtitle: getText('heroSlide_company_sub', t.heroSubtitle),
      image: getImage('image_heroSlide_company', "/images/company.png"),
      detailTitle: getText('detail_company_title', t.hkonKorea),
      detailDesc: getText('detail_company_desc', t.hkonDesc),
      productId: 'company'
    },
    {
      title: getText('heroSlide_about-us_title', getText('heroSlide_about_title', t.aboutUs)),
      subtitle: getText('heroSlide_about-us_sub', getText('heroSlide_about_sub', t.aboutUsTitle)),
      image: getImage('image_heroSlide_about-us', "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=60&w=800"),
      detailTitle: getText('detail_about-us_title', getText('detail_about_title', t.aboutUs)),
      detailDesc: getText('detail_about-us_desc', getText('detail_about_desc', t.aboutUsDesc)),
      productId: 'about-us'
    },
    {
      title: getText('heroSlide_whats-new_title', getText('heroSlide_whatsnew_title', t.whatsNew)),
      subtitle: getText('heroSlide_whats-new_sub', getText('heroSlide_whatsnew_sub', t.whatsNewTitle)),
      image: getImage('image_heroSlide_whats-new', "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=60&w=800"),
      detailTitle: getText('detail_whats-new_title', getText('detail_whatsnew_title', t.whatsNew)),
      detailDesc: getText('detail_whats-new_desc', getText('detail_whatsnew_desc', t.whatsNewDesc)),
      productId: 'whats-new'
    },
    {
      title: getText('heroSlide_haagen-dazs_title', getText('heroSlide_haagendazs_title', t.haagendazs)),
      subtitle: getText('heroSlide_haagen-dazs_sub', getText('heroSlide_haagendazs_sub', t.haagendazsSub)),
      image: getImage('image_heroSlide_haagen-dazs', "/images/mini_cup.png"),
      detailTitle: getText('detail_haagen-dazs_title', getText('detail_haagendazs_title', t.haagendazs)),
      detailDesc: getText('detail_haagen-dazs_desc', getText('detail_haagendazs_desc', t.haagendazsDesc)),
      productId: 'haagen-dazs'
    },
    {
      title: getText('heroSlide_lantico_title', t.lantico),
      subtitle: getText('heroSlide_lantico_sub', t.lanticoSub),
      image: getImage('image_heroSlide_lantico', "/images/lantico.png"),
      detailTitle: getText('detail_lantico_title', t.lantico),
      detailDesc: getText('detail_lantico_desc', t.lanticoDesc),
      productId: 'lantico'
    },
    {
      title: getText('heroSlide_caraci_title', t.caraci),
      subtitle: getText('heroSlide_caraci_sub', t.caraciSub),
      image: getImage('image_heroSlide_caraci', "/images/sweet.png"),
      detailTitle: getText('detail_caraci_title', t.caraci),
      detailDesc: getText('detail_caraci_desc', t.caraciDesc),
      productId: 'caraci'
    },
    {
      title: getText('heroSlide_general-mills_title', getText('heroSlide_generalmills_title', t.generalMills)),
      subtitle: getText('heroSlide_general-mills_sub', getText('heroSlide_generalmills_sub', t.generalMillsSub)),
      image: getImage('image_heroSlide_general-mills', "/images/grnaola_thumbnail.png"),
      detailTitle: getText('detail_general-mills_title', getText('detail_generalmills_title', t.generalMills)),
      detailDesc: getText('detail_general-mills_desc', getText('detail_generalmills_desc', t.generalMillsDesc)),
      productId: 'general-mills'
    }
  ], [t, activeOverrides, currentLang]);

  // Preload next image and some important thumbnails after initial render
  useEffect(() => {
    // delay preloading logic until after the main load
    const timer = setTimeout(() => {
      const nextSlideImage = heroSlides[(activeSlide + 1) % heroSlides.length].image;
      const imagesToPreload = [nextSlideImage];
      
      imagesToPreload.forEach(src => {
        if (src && src.trim() !== '') {
          const img = new Image();
          img.src = src;
        }
      });
    }, 2000); // 2 seconds delay
    return () => clearTimeout(timer);
  }, [activeSlide, heroSlides]);

  // Pause slider automatic rotations when editing or modal is open so slides don't flip away
  useEffect(() => {
    if (targetSection !== null || modal.isOpen) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7500);
    return () => clearInterval(timer);
  }, [activeSlide, heroSlides.length, targetSection, modal.isOpen]);

  // 하단 디테일 슬라이더 자동 넘김 (15초) - Pause when editing or modal is open
  useEffect(() => {
    if (targetSection !== null || modal.isOpen) return;
    const timer = setInterval(() => {
      setActiveDetailSlide((prev) => (prev + 1) % heroSlides.length);
    }, 15000);
    return () => clearInterval(timer);
  }, [activeDetailSlide, heroSlides.length, targetSection, modal.isOpen]);

  // Listener for custom inquiry events from modals
  useEffect(() => {
    const handleOpenInquiry = () => {
      openModal(t.inquiry, <InquiryForm isDarkMode={isDarkMode} onClose={() => setModal(m => ({ ...m, isOpen: false }))} t={t} />);
    };
    window.addEventListener('hkon-open-inquiry', handleOpenInquiry);
    return () => window.removeEventListener('hkon-open-inquiry', handleOpenInquiry);
  }, [t, isDarkMode]);

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
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-[#1a1a1a] text-white selection:bg-blue-500' : 'bg-white text-gray-900 selection:bg-[#6D1B2A]'} font-sans selection:text-white transition-colors duration-300`}>
      
      {/* First Screen Wrapper */}
      <div className="flex w-full h-[100dvh] relative">
        {/* Main Content Area for First Screen */}
        <div className="flex-1 flex flex-col min-w-0 relative h-full">
          {/* Top Left Floating Logo */}
          <div className="fixed top-6 left-6 z-50">
            <div className="text-2xl font-black text-white mix-blend-difference tracking-widest drop-shadow-md">
              {t.hkon}
            </div>
          </div>

          {/* Top Right Floating Controls */}
          <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-2 px-4 rounded-full shadow-2xl border backdrop-blur-xl transition-all duration-300 ${isDarkMode ? 'bg-[#1a1a1a]/95 border-gray-700 shadow-black/50' : 'bg-white/95 border-gray-300 shadow-gray-200/50'}`}>
            <button 
              className={`p-1.5 rounded-full transition-colors ${isDarkMode ? 'text-blue-400 hover:bg-gray-800' : 'text-[#6D1B2A] hover:bg-gray-100'}`}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={20} />
            </button>
            <div className={`w-px h-5 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-1.5 rounded-full transition-colors ${isDarkMode ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-800' : 'text-[#6D1B2A] hover:text-[#5A1622] hover:bg-gray-100'}`}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <div className={`w-px h-5 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          
          <div className="flex items-center gap-2 text-xs md:text-sm font-black">
            <Globe size={16} className={isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'} />
            {LANGUAGES.map((lang, idx) => (
              <React.Fragment key={lang.code}>
                <button 
                  onClick={() => setCurrentLang(lang.code)} 
                  className={`transition-colors tracking-widest uppercase ${currentLang === lang.code ? (isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]') : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900')}`}
                >
                  {lang.name.slice(0, 3)}
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
              className={`fixed inset-0 z-50 ${isDarkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'} overflow-y-auto`}
            >
              <div className="px-6 py-4 flex flex-col gap-4 pb-20">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Globe size={18} className={isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'} />
                    {LANGUAGES.map((lang, idx) => (
                      <React.Fragment key={lang.code}>
                        <button 
                          onClick={() => { setCurrentLang(lang.code); setIsMobileMenuOpen(false); }} 
                          className={`text-sm font-medium transition-colors ${currentLang === lang.code ? (isDarkMode ? 'text-blue-400 font-bold' : 'text-[#6D1B2A] font-bold') : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}
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
                        onItemClick={(selectedItem) => { handleMenuClick(selectedItem); setIsMobileMenuOpen(false); }} 
                        isDarkMode={isDarkMode}
                      />
                    );
                  }
                  return (
                    <button key={idx} onClick={() => { 
                      handleMenuClick(item);
                      setIsMobileMenuOpen(false); 
                    }} className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-left py-2`}>
                      {item}
                    </button>
                  );
                })}

                <div className="mt-8 flex gap-5 items-center justify-center pt-8 border-t border-gray-200 dark:border-gray-800">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={`transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} title="Instagram" aria-label="Instagram"><Instagram size={24} /></a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={`transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} title="YouTube" aria-label="YouTube"><Youtube size={26} /></a>
                  
                  {/* Shield icon button next to Instagram and YouTube */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAdminPortalOpen(true);
                    }}
                    className={`transition-all p-2 rounded-full cursor-pointer hover:scale-110 ${
                      isAdminActive 
                        ? 'text-amber-400 bg-amber-400/20 ring-2 ring-amber-400/40' 
                        : isDarkMode 
                        ? 'text-gray-400 hover:text-amber-400 hover:bg-gray-800' 
                        : 'text-gray-600 hover:text-amber-600 hover:bg-gray-100'
                    }`}
                    title="관리자 & 직원 전용 보안 관리"
                    aria-label="관리자 관리"
                  >
                    <ShieldCheck size={25} />
                  </button>

                  <a href="https://blog.naver.com" target="_blank" rel="noopener noreferrer" className={`transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} title="Naver Blog" aria-label="Naver Blog"><BookOpen size={24} /></a>
                  <a href="https://pf.kakao.com" target="_blank" rel="noopener noreferrer" className={`transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} title="KakaoTalk" aria-label="KakaoTalk"><MessageSquare size={24} /></a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* First Screen: Hero + Notice */}
        <div className="h-full flex flex-col">
          {/* Hero Slider */}
          <motion.div 
            className="flex-1 relative overflow-hidden bg-black cursor-grab active:cursor-grabbing touch-pan-y select-none"
            onPanEnd={(e, info) => {
              const threshold = 50;
              if (info.offset.x > threshold) {
                setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
              } else if (info.offset.x < -threshold) {
                setActiveSlide((prev) => (prev + 1) % heroSlides.length);
              }
            }}
          >
            <AnimatePresence initial={false}>
              {isMediaVideo(heroSlides[activeSlide].image) ? (
                <motion.video
                  key={`bg-vid-${activeSlide}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  src={heroSlides[activeSlide].image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <motion.img
                  key={`bg-${activeSlide}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  src={heroSlides[activeSlide].image}
                  alt={heroSlides[activeSlide].title}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{ objectPosition: 'center top' }}
                  referrerPolicy="no-referrer"
                  fetchPriority="high"
                  loading="eager"
                />
              )}
            </AnimatePresence>
            
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
            
            <div className="absolute inset-0 flex items-center pointer-events-none">
              <div className="max-w-7xl mx-auto px-6 w-full mt-16 md:mt-0 pointer-events-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`text-${activeSlide}`}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
                      exit: { opacity: 0, transition: { duration: 0.3 } }
                    }}
                    className="max-w-2xl text-white"
                  >
                  <motion.h1 
                    variants={{
                      hidden: { opacity: 0, y: 40 },
                      visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } },
                      exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
                    }}
                    className="text-4xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-6 leading-tight tracking-tight drop-shadow-2xl flex flex-wrap items-center gap-3"
                  >
                    <span>{heroSlides[activeSlide].title}</span>
                    {isFeedbackModeActive && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const cur = heroSlides[activeSlide];
                            triggerEdit(cur.productId === 'company' ? 'heroSlide_company_title' : `heroSlide_${cur.productId}_title`, `${cur.title} 타이틀`, cur.title);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-lg cursor-pointer transform hover:scale-105 transition-transform"
                          title="이 타이틀 문구 수정 제안하기"
                        >
                          <Edit3 size={13} />
                          <span>문구 수정</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const cur = heroSlides[activeSlide];
                            const key = `image_heroSlide_${cur.productId}`;
                            triggerEditImage(key, `${cur.title} 슬라이드 배경 사진`, cur.image);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg cursor-pointer transform hover:scale-105 transition-transform"
                          title="현재 슬라이드 배경 사진 변경 제안/적용하기"
                        >
                          <ImageIcon size={13} />
                          <span>배경 사진 변경</span>
                        </button>
                      </div>
                    )}
                  </motion.h1>
                  <motion.p 
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } },
                      exit: { opacity: 0, y: -15, transition: { duration: 0.4 } }
                    }}
                    className="text-lg md:text-xl lg:text-2xl font-light text-gray-200 mb-8 md:mb-10 drop-shadow-lg tracking-wide flex flex-wrap items-center gap-3"
                  >
                    <span>{heroSlides[activeSlide].subtitle}</span>
                    {isFeedbackModeActive && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const cur = heroSlides[activeSlide];
                          triggerEdit(cur.productId === 'company' ? 'heroSlide_company_sub' : `heroSlide_${cur.productId}_sub`, `${cur.title} 서브 슬로건`, cur.subtitle);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-lg cursor-pointer transform hover:scale-105 transition-transform"
                        title="이 서브 슬로건 문구 수정 제안하기"
                      >
                        <Edit3 size={12} />
                        <span>문구 수정</span>
                      </button>
                    )}
                  </motion.p>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } },
                      exit: { opacity: 0, y: -10, transition: { duration: 0.4 } }
                    }}
                    className="flex flex-wrap items-center gap-3"
                  >
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const slide = heroSlides[activeSlide];
                        if (slide.productId === 'company') {
                          openModal(t.company, getCompanyIntro(currentLang, isDarkMode));
                        } else if (slide.productId === 'about-us') {
                          openModal(t.aboutUs, getAboutUsContent(currentLang, isDarkMode, getText, triggerEdit, isFeedbackModeActive, getImage, triggerEditImage));
                        } else if (slide.productId === 'whats-new') {
                          openModal(t.whatsNew, getWhatsNewContent(currentLang, isDarkMode), [slide.image]);
                        } else if (slide.productId === 'caraci') {
                          setIsCaraciShowcaseOpen(true);
                        } else {
                          const product = PRODUCTS.find(p => p.id === slide.productId);
                          if (product) {
                            openModal(
                              product.name[currentLang as keyof typeof product.name] || product.name.en, 
                              getProductContent(product, currentLang, isDarkMode), 
                              [product.image, ...product.detailImages]
                            );
                          } else {
                            openModal(slide.detailTitle, slide.detailDesc, [slide.image]);
                          }
                        }
                      }} 
                      className={`px-6 py-3 md:px-8 md:py-4 text-white font-semibold rounded-full transition-colors flex items-center gap-2 text-sm md:text-base ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20' : 'bg-[#6D1B2A] hover:bg-[#5A1622] shadow-lg shadow-red-900/20'}`}
                    >
                      {getText('hero_cta_btn', t.readMore)} <ArrowRight size={20} />
                    </motion.button>
                    {isFeedbackModeActive && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerEdit('hero_cta_btn', '메인 슬라이더 더보기 버튼 문구', getText('hero_cta_btn', t.readMore));
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-lg cursor-pointer transform hover:scale-105 transition-transform"
                        title="버튼 문구 수정하기"
                      >
                        <Edit3 size={12} />
                        <span>버튼 수정</span>
                      </button>
                    )}
                  </motion.div>
                  </motion.div>
                </AnimatePresence>
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
                    <div className={`w-10 md:w-12 h-1 transition-all ${activeSlide === idx ? (isDarkMode ? 'bg-blue-500' : 'bg-[#6D1B2A]') : 'bg-white/30 group-hover:bg-white/50'}`} />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Notices Section (Bottom of First Screen) */}
          <section className={`shrink-0 ${isDarkMode ? 'bg-gray-800/80 border-t border-gray-700' : 'bg-white/90 border-t border-gray-200'} backdrop-blur-md py-4 px-6 z-30 relative transition-colors duration-300 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]`}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                <span className={`px-5 py-2 text-xs font-black rounded-full tracking-[0.2em] uppercase shadow-sm ${isDarkMode ? 'bg-blue-600 text-white shadow-blue-900/50' : 'bg-[#6D1B2A] text-white shadow-red-900/20'}`}>NOTICE</span>
                {isFeedbackModeActive && (
                  <button
                    onClick={() => handleMenuClick(t.notice)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm cursor-pointer"
                    title="공지사항 전체 보기 및 관리"
                  >
                    <Edit3 size={11} />
                    <span>공지 관리</span>
                  </button>
                )}
              </div>
              <div className="flex-1 w-full overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                  {NOTICES.slice(0, 3).map((notice) => {
                    const noticeTitle = getText(`notice_${notice.id}_title`, notice.title[currentLang as keyof typeof notice.title] || notice.title.en);
                    return (
                      <div key={notice.id} className="flex items-center justify-between gap-2 group w-full py-1">
                        <motion.button 
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => openModal(noticeTitle, notice.content[currentLang as keyof typeof notice.content] || notice.content.en)} 
                          className="flex justify-between items-center text-left flex-1"
                        >
                          <span className={`${isDarkMode ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-[#6D1B2A]'} transition-colors line-clamp-1 text-sm font-medium`}>
                            {noticeTitle}
                          </span>
                          <span className="text-xs text-gray-400 ml-3 shrink-0 font-medium">{notice.date}</span>
                        </motion.button>
                        {isFeedbackModeActive && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerEdit(`notice_${notice.id}_title`, `공지사항 제목: ${noticeTitle}`, noticeTitle);
                            }}
                            className="shrink-0 p-1 rounded-lg bg-amber-500/80 hover:bg-amber-500 text-white cursor-pointer shadow-sm"
                            title="공지 제목 수정"
                          >
                            <Edit3 size={11} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

      {/* Rest of the Content (Full Width) */}
      <div className="w-full flex flex-col">
        {/* Global Stats Section (Fill empty space) */}
        <section className={`py-24 px-6 ${isDarkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'} border-b relative overflow-hidden`}>
          {/* Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl ${isDarkMode ? 'bg-blue-900/10' : 'bg-red-50/50'}`} />
            <div className={`absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl ${isDarkMode ? 'bg-purple-900/10' : 'bg-red-50/50'}`} />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center divide-x-0 md:divide-x divide-y md:divide-y-0 ${isDarkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
              {[
                { key: 'stat_branches', defaultLabel: currentLang === 'ko' ? '글로벌 지사' : currentLang === 'zh' ? '全球分支' : 'Global Branches', defaultValue: '12', suffix: '+' },
                { key: 'stat_countries', defaultLabel: currentLang === 'ko' ? '수출 및 유통 국가' : currentLang === 'zh' ? '出口与分销国家' : 'Export Countries', defaultValue: '45', suffix: '+' },
                { key: 'stat_years', defaultLabel: currentLang === 'ko' ? '혁신과 신뢰의 역사' : currentLang === 'zh' ? '创新与信赖历程' : 'Years of Innovation', defaultValue: '30', suffix: '+' },
                { key: 'stat_clients', defaultLabel: currentLang === 'ko' ? '파트너 및 고객사' : currentLang === 'zh' ? '合作企业与伙伴' : 'Happy Clients', defaultValue: '10k', suffix: '+' }
              ].map((stat, idx) => {
                const label = getText(`${stat.key}_label`, stat.defaultLabel);
                const value = getText(`${stat.key}_val`, stat.defaultValue);
                return (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, scale: 0.9, y: 50, rotate: -2 }} 
                    whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 0 }} 
                    viewport={{ once: true, amount: 0.2 }} 
                    transition={{ delay: idx * 0.1, duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
                    className={`p-6 md:p-8 ${idx !== 0 && idx !== 2 ? 'border-t md:border-t-0' : ''} ${idx > 1 ? 'border-t md:border-t-0' : ''} ${isDarkMode ? 'border-gray-800' : 'border-gray-100'} group relative`}
                  >
                    <div className="flex items-baseline justify-center mb-3 group-hover:scale-110 transition-transform duration-500">
                      <span className={`text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-[#6D1B2A] to-red-600'}`}>
                        {value}
                      </span>
                      <span className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-blue-500' : 'text-red-500'}`}>
                        {stat.suffix}
                      </span>
                    </div>
                    <div className={`text-sm md:text-base font-bold tracking-[0.2em] uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                      {label}
                    </div>
                    {isFeedbackModeActive && (
                      <div className="flex items-center justify-center gap-1.5 pt-2">
                        <button
                          onClick={() => triggerEdit(`${stat.key}_val`, `${label} 수치`, value)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-sm cursor-pointer"
                          title="수치 수정"
                        >
                          <Edit3 size={10} />
                          <span>수치</span>
                        </button>
                        <button
                          onClick={() => triggerEdit(`${stat.key}_label`, `${label} 라벨`, label)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-sm cursor-pointer"
                          title="라벨 수정"
                        >
                          <Edit3 size={10} />
                          <span>라벨</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Dynamic Content Section */}
        <section className={`py-32 px-6 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} min-h-[70vh] flex items-center transition-colors duration-300 relative overflow-hidden`}>
          {/* Decorative Background Elements */}
          <div className={`absolute top-0 right-0 w-1/2 h-full ${isDarkMode ? 'bg-gradient-to-l from-blue-900/10' : 'bg-gradient-to-l from-red-50/50'} to-transparent pointer-events-none`} />
          <div className={`absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl ${isDarkMode ? 'bg-blue-900/20' : 'bg-red-100/40'} pointer-events-none`} />

          <div className="max-w-7xl mx-auto w-full relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDetailSlide}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center"
              >
                <div className="w-full lg:w-1/2 relative group">
                  <TiltImage 
                    src={heroSlides[activeDetailSlide].image} 
                    alt={heroSlides[activeDetailSlide].detailTitle} 
                    isDarkMode={isDarkMode} 
                  />

                  {/* 2nd Image Slide Navigation Buttons */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDetailSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/85 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-xl z-10 hover:scale-110"
                    aria-label="이전 슬라이드"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDetailSlide((prev) => (prev + 1) % heroSlides.length);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/85 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-xl z-10 hover:scale-110"
                    aria-label="다음 슬라이드"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* 2nd Image Slide Indicators & Counter */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-1.5">
                      {heroSlides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveDetailSlide(idx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            activeDetailSlide === idx
                              ? `w-8 ${isDarkMode ? 'bg-blue-500' : 'bg-[#6D1B2A]'}`
                              : 'w-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400'
                          }`}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-black tracking-widest text-gray-400">
                      0{activeDetailSlide + 1} / 0{heroSlides.length}
                    </span>
                  </div>

                  {isFeedbackModeActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const cur = heroSlides[activeDetailSlide];
                        const key = cur.productId === 'company' ? 'image_heroSlide_company' : `image_heroSlide_${cur.productId}`;
                        triggerEditImage(key, `${cur.detailTitle} 상세 이미지`, cur.image);
                      }}
                      className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl cursor-pointer hover:scale-105 transition-transform"
                      title="이 상세 이미지 변경하기"
                    >
                      <ImageIcon size={13} />
                      <span>이미지 변경</span>
                    </button>
                  )}
                </div>
                <div className="w-full lg:w-1/2 space-y-8">
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className={`text-sm font-black tracking-[0.2em] ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'} uppercase flex items-center gap-3`}>
                        <span className={`w-8 h-px ${isDarkMode ? 'bg-blue-400' : 'bg-[#6D1B2A]'}`}></span>
                        {getText('brand_badge_hkon', t.hkonKorea)}
                      </h2>
                      {isFeedbackModeActive && (
                        <button
                          onClick={() => triggerEdit('brand_badge_hkon', '상단 뱃지 문구', getText('brand_badge_hkon', t.hkonKorea))}
                          className="p-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-sm"
                          title="상단 뱃지 문구 수정"
                        >
                          <Edit3 size={11} />
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className={`text-4xl md:text-5xl lg:text-6xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} leading-[1.1] transition-colors duration-300 drop-shadow-sm`}>
                        {heroSlides[activeDetailSlide].detailTitle}
                      </h3>
                      {isFeedbackModeActive && (
                        <button
                          onClick={() => {
                            const cur = heroSlides[activeDetailSlide];
                            triggerEdit(cur.productId === 'company' ? 'detail_company_title' : `detail_${cur.productId}_title`, `${cur.detailTitle} 타이틀`, cur.detailTitle);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-md cursor-pointer"
                          title="이 타이틀 문구 수정 제안하기"
                        >
                          <Edit3 size={12} />
                          <span>문구 수정</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                  <div className="space-y-2">
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className={`text-lg md:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed whitespace-pre-line transition-colors duration-300 font-medium`}
                    >
                      {heroSlides[activeDetailSlide].detailDesc}
                    </motion.p>
                    {isFeedbackModeActive && (
                      <button
                        onClick={() => {
                          const cur = heroSlides[activeDetailSlide];
                          triggerEdit(cur.productId === 'company' ? 'detail_company_desc' : `detail_${cur.productId}_desc`, `${cur.detailTitle} 설명 문구`, cur.detailDesc);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-md cursor-pointer"
                        title="이 설명 문구 수정 제안하기"
                      >
                        <Edit3 size={11} />
                        <span>문구 수정</span>
                      </button>
                    )}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="pt-4 flex flex-wrap items-center gap-3"
                  >
                    <button 
                      onClick={() => {
                        const slide = heroSlides[activeDetailSlide];
                        if (slide.productId === 'company') {
                          openModal(t.company, getCompanyIntro(currentLang, isDarkMode));
                        } else if (slide.productId === 'about-us') {
                          openModal(t.aboutUs, getAboutUsContent(currentLang, isDarkMode, getText, triggerEdit, isFeedbackModeActive, getImage, triggerEditImage));
                        } else if (slide.productId === 'whats-new') {
                          openModal(t.whatsNew, getWhatsNewContent(currentLang, isDarkMode), [slide.image]);
                        } else if (slide.productId === 'caraci') {
                          setIsCaraciShowcaseOpen(true);
                        } else {
                          const currentTitle = slide.detailTitle;
                          const product = PRODUCTS.find(p => p.name[currentLang as keyof typeof p.name] === currentTitle || p.name.en === currentTitle || p.id === slide.productId);
                          if (product) {
                            if (product.id === 'caraci') {
                              setIsCaraciShowcaseOpen(true);
                            } else {
                              openModal(
                                product.name[currentLang as keyof typeof product.name] || product.name.en,
                                getProductContent(product, currentLang, isDarkMode),
                                [product.image, ...product.detailImages]
                              );
                            }
                          } else {
                            openModal(slide.detailTitle, slide.detailDesc, [slide.image]);
                          }
                        }
                      }} 
                      className={`group inline-flex items-center gap-3 px-8 py-4 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-[#6D1B2A] hover:bg-[#5A1622]'} text-white rounded-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 font-bold text-lg cursor-pointer`}
                    >
                      {getText('btn_detail_readmore', t.readMore)} 
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    {isFeedbackModeActive && (
                      <button
                        onClick={() => triggerEdit('btn_detail_readmore', '상세 슬라이더 더보기 버튼 문구', getText('btn_detail_readmore', t.readMore))}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-md cursor-pointer"
                        title="버튼 문구 수정"
                      >
                        <Edit3 size={12} />
                        <span>버튼 수정</span>
                      </button>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Products Section */}
        <section id="products-section" className={`py-32 px-6 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
              className="flex flex-col items-center text-center mb-24"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-sm font-black tracking-[0.2em] ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'} uppercase`}>
                  {getText('brands_section_subtitle', 'Our Brands')}
                </span>
                {isFeedbackModeActive && (
                  <button
                    onClick={() => triggerEdit('brands_section_subtitle', '브랜드 섹션 서브타이틀', getText('brands_section_subtitle', 'Our Brands'))}
                    className="p-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-sm"
                    title="서브타이틀 수정"
                  >
                    <Edit3 size={11} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className={`text-5xl md:text-6xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                  {getText('brands_section_title', t.products)}
                </h2>
                {isFeedbackModeActive && (
                  <button
                    onClick={() => triggerEdit('brands_section_title', '브랜드 섹션 타이틀', getText('brands_section_title', t.products))}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-md cursor-pointer"
                    title="타이틀 문구 수정"
                  >
                    <Edit3 size={12} />
                    <span>문구 수정</span>
                  </button>
                )}
              </div>
              <div className={`w-24 h-1.5 ${isDarkMode ? 'bg-blue-500' : 'bg-[#6D1B2A]'} rounded-full`} />
            </motion.div>

            <div className="space-y-40">
              {PRODUCTS.map((product, index) => {
                const isEven = index % 2 === 0;
                const pName = getText(`product_${product.id}_name`, product.name[currentLang as keyof typeof product.name] || product.name.en);
                const pBadge = getText(`product_${product.id}_badge`, t.premiumQuality);
                return (
                  <motion.div 
                    id={`product-${product.id}`}
                    key={product.id}
                    initial={{ opacity: 0, y: 100, scale: 0.9, rotate: -2 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
                    className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 lg:gap-24 items-center`}
                  >
                    {/* Image Side */}
                    <div className="w-full lg:w-1/2">
                      <div className="relative group">
                        <div className={`absolute inset-0 rounded-[2.5rem] ${isDarkMode ? 'bg-blue-500/10' : 'bg-red-500/10'} blur-2xl transform group-hover:scale-105 transition-transform duration-500`} />
                        <TiltImage 
                          src={getImage(`image_product_${product.id}`, product.image)} 
                          alt={pName} 
                          isDarkMode={isDarkMode}
                          onClick={() => {
                            if (product.id === 'caraci') {
                              setIsCaraciShowcaseOpen(true);
                            } else {
                              openModal(pName, getProductContent(product, currentLang, isDarkMode), [getImage(`image_product_${product.id}`, product.image), ...product.detailImages]);
                            }
                          }}
                        />
                        {isFeedbackModeActive && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const curImg = getImage(`image_product_${product.id}`, product.image);
                              triggerEditImage(`image_product_${product.id}`, `${pName} 대표 이미지`, curImg);
                            }}
                            className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl cursor-pointer hover:scale-105 transition-transform"
                            title="이 제품 이미지 변경 제안/적용하기"
                          >
                            <ImageIcon size={13} />
                            <span>이미지 변경</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Text Side */}
                    <div className="w-full lg:w-1/2 space-y-8">
                      <div className="flex items-center gap-2">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase ${isDarkMode ? 'bg-blue-900/40 text-blue-400 border border-blue-800/50' : 'bg-red-50 text-[#6D1B2A] border border-red-200'}`}>
                          <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDarkMode ? 'bg-blue-400' : 'bg-red-500'}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${isDarkMode ? 'bg-blue-500' : 'bg-red-600'}`}></span>
                          </span>
                          {pBadge}
                        </div>
                        {isFeedbackModeActive && (
                          <button
                            onClick={() => triggerEdit(`product_${product.id}_badge`, `${pName} 뱃지 문구`, pBadge)}
                            className="p-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-sm"
                            title="뱃지 문구 수정"
                          >
                            <Edit3 size={11} />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <h3 className={`text-4xl md:text-5xl lg:text-6xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} leading-[1.1] tracking-tight`}>
                          {pName}
                        </h3>
                        {isFeedbackModeActive && (
                          <button
                            onClick={() => triggerEdit(`product_${product.id}_name`, `${pName} 제품명`, pName)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-md cursor-pointer"
                            title="제품명 수정"
                          >
                            <Edit3 size={11} />
                            <span>이름 수정</span>
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed whitespace-pre-line font-medium`}>
                          {getText(`${product.id}Desc`, product.shortDescription?.[currentLang as keyof typeof product.shortDescription] || product.description[currentLang as keyof typeof product.description] || product.description.en)}
                        </p>
                        {isFeedbackModeActive && (
                          <button
                            onClick={() => {
                              const pDesc = getText(`${product.id}Desc`, product.shortDescription?.[currentLang as keyof typeof product.shortDescription] || product.description[currentLang as keyof typeof product.description] || product.description.en);
                              const editKey = currentLang === 'ko' ? `${product.id}Desc` : `${product.id}Desc_${currentLang}`;
                              triggerEdit(editKey, `${pName} 설명 문구`, pDesc);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-md cursor-pointer"
                            title="이 제품 설명 문구 수정 제안하기"
                          >
                            <Edit3 size={11} />
                            <span>문구 수정</span>
                          </button>
                        )}
                      </div>
                      
                      {/* Product Specific Features - Fully Distinct, Multilingual (KO, EN, ZH) & Individually Editable */}
                      {(() => {
                        const PRODUCT_FEATURES_DICT: Record<string, {
                          feat1: { ko: string; en: string; zh: string };
                          feat2: { ko: string; en: string; zh: string };
                        }> = {
                          caraci: {
                            feat1: {
                              ko: '에트나 화산 지대 비옥한 토양에서 자란 최상급 원물 본연의 진하고 깊은 고소함.',
                              en: 'Rich and nutty aroma naturally cultivated from the fertile volcanic soils of Mount Etna.',
                              zh: '源自埃特纳火山沃土的顶级天然原料，蕴含纯粹深邃的天然坚果馥郁香气。'
                            },
                            feat2: {
                              ko: '시칠리아 전통 방식을 계승하여 인공 첨가물 없이 완성한 100% 이탈리아 프리미엄 스프레드.',
                              en: '100% authentic Italian premium spread crafted with time-honored artisanal Sicilian traditions.',
                              zh: '承袭西西里百年传统古法工艺，绝不添加人工香精的100%意大利原装进口特级涂抹酱。'
                            }
                          },
                          'haagen-dazs': {
                            feat1: {
                              ko: '엄선된 100% 리얼 신선 원료만을 사용하는 무합성 착향료 프리미엄 레시피.',
                              en: 'Pure premium recipe using strictly 100% real ingredients with zero artificial flavorings.',
                              zh: '严选100%新鲜真材实料，坚持不添加任何人工香精的奢华经典配方。'
                            },
                            feat2: {
                              ko: '공기 함유량을 최소화한 고밀도 텍스처로 전해지는 극상의 부드러움과 깊은 풍미.',
                              en: 'Dense, velvety texture with minimal overrun delivering deep, unmatched richness.',
                              zh: '超低含气量的极致绵密醇厚质感，带来入口即化的丝滑与浓郁滋味。'
                            }
                          },
                          lantico: {
                            feat1: {
                              ko: '110년 전통의 이탈리아 모데나 명문 로스팅 하우스의 정통 에스프레소 블렌딩.',
                              en: 'Authentic Italian espresso blending with over 110 years of roasting heritage in Modena.',
                              zh: '拥有110年历史的意大利摩德纳名门烘焙工坊正统意式浓缩拼配。'
                            },
                            feat2: {
                              ko: '느린 로스팅 기법으로 쓴맛을 줄이고 원두 고유의 고소한 너티함과 꽃향을 극대화.',
                              en: 'Artisanal slow-roasting technique minimizing bitterness while enhancing rich nutty and floral aromas.',
                              zh: '传统慢速烘焙工艺，大幅降低焦苦感，完美激发咖啡豆原生的醇香与花果香。'
                            }
                          },
                          'general-mills': {
                            feat1: {
                              ko: '간편하게 채우는 하루 10g 고단백 프로틴바와 자연 유래 통귀리 그래놀라의 영양.',
                              en: 'Convenient daily nutrition with 10g protein bars and wholesome whole-grain rolled oats.',
                              zh: '每日轻松补充10g优质蛋白质能量棒，结合天然全麦燕麦的均衡营养。'
                            },
                            feat2: {
                              ko: '천연 과일 퓨레를 함유해 재미있게 즐기는 온 가족 글로벌 스낵 컬렉션.',
                              en: 'Delightful natural fruit puree roll snacks loved by families worldwide for fun and healthy snacking.',
                              zh: '富含天然果泥的趣味果丹皮零食，深受全球家庭喜爱的快乐健康零食系列。'
                            }
                          }
                        };

                        const langKey = (currentLang === 'zh' ? 'zh' : currentLang === 'en' ? 'en' : 'ko') as 'ko' | 'en' | 'zh';
                        const featData = PRODUCT_FEATURES_DICT[product.id] || PRODUCT_FEATURES_DICT['caraci'];
                        const defaultFeat1 = featData.feat1[langKey] || featData.feat1.ko;
                        const defaultFeat2 = featData.feat2[langKey] || featData.feat2.ko;

                        const pName = product.name[currentLang as keyof typeof product.name] || product.name.en;
                        const feat1Key = `${product.id}_feat1`;
                        const feat2Key = `${product.id}_feat2`;
                        const feat1LangKey = `${product.id}_feat1_${currentLang}`;
                        const feat2LangKey = `${product.id}_feat2_${currentLang}`;
                        const feat1Text = activeOverrides[feat1LangKey] || (currentLang === 'ko' ? activeOverrides[feat1Key] : undefined) || defaultFeat1;
                        const feat2Text = activeOverrides[feat2LangKey] || (currentLang === 'ko' ? activeOverrides[feat2Key] : undefined) || defaultFeat2;

                        return (
                          <ul className={`space-y-5 mt-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-lg`}>
                            <li className="flex items-start gap-4">
                              <div className={`mt-2 w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-red-500'} shrink-0 shadow-[0_0_10px_rgba(0,0,0,0.2)] ${isDarkMode ? 'shadow-blue-500/50' : 'shadow-red-500/50'}`} />
                              <div className="flex-1">
                                <span className="leading-relaxed font-semibold">
                                  {feat1Text}
                                </span>
                                {isFeedbackModeActive && (
                                  <button
                                    onClick={() => triggerEdit(currentLang === 'ko' ? feat1Key : feat1LangKey, `${pName} 특징 1번`, feat1Text)}
                                    className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow cursor-pointer"
                                    title="이 특징 문구 수정 제안/적용하기"
                                  >
                                    <Edit3 size={10} />
                                    <span>수정</span>
                                  </button>
                                )}
                              </div>
                            </li>
                            <li className="flex items-start gap-4">
                              <div className={`mt-2 w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-red-500'} shrink-0 shadow-[0_0_10px_rgba(0,0,0,0.2)] ${isDarkMode ? 'shadow-blue-500/50' : 'shadow-red-500/50'}`} />
                              <div className="flex-1">
                                <span className="leading-relaxed font-semibold">
                                  {feat2Text}
                                </span>
                                {isFeedbackModeActive && (
                                  <button
                                    onClick={() => triggerEdit(currentLang === 'ko' ? feat2Key : feat2LangKey, `${pName} 특징 2번`, feat2Text)}
                                    className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow cursor-pointer"
                                    title="이 특징 문구 수정 제안/적용하기"
                                  >
                                    <Edit3 size={10} />
                                    <span>수정</span>
                                  </button>
                                )}
                              </div>
                            </li>
                          </ul>
                        );
                      })()}

                      <div className="pt-8 flex flex-wrap items-center gap-3">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (product.id === 'caraci') {
                              setIsCaraciShowcaseOpen(true);
                            } else {
                              openModal(product.name[currentLang as keyof typeof product.name] || product.name.en, getProductContent(product, currentLang, isDarkMode), [product.image, ...product.detailImages]);
                            }
                          }}
                          className={`group inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-colors duration-300 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' : 'bg-[#6D1B2A] hover:bg-[#5A1622] text-white shadow-lg shadow-red-900/20'}`}
                        >
                          {getText('btn_explore_products', t.exploreProducts)}
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                        {isFeedbackModeActive && (
                          <button
                            onClick={() => triggerEdit('btn_explore_products', '제품 탐색 버튼 문구', getText('btn_explore_products', t.exploreProducts))}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-md cursor-pointer"
                            title="버튼 문구 수정"
                          >
                            <Edit3 size={11} />
                            <span>버튼 수정</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Links (Moved to bottom) */}
        <section className={`${isDarkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'} border-b transition-colors duration-300 py-12`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {quickLinks.map((link, idx) => {
                const qTitle = getText(`quicklink_${idx}_title`, link.title);
                const qDesc = getText(`quicklink_${idx}_desc`, link.desc);
                return (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 30, scale: 0.9, rotate: -2 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: idx * 0.1, duration: 0.6, type: "spring", stiffness: 120, damping: 15 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className={`flex flex-col items-center text-center p-8 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-gray-50 hover:bg-white border-gray-100'} transition-colors duration-300 group w-full border hover:shadow-xl rounded-3xl relative`}
                  >
                    <div 
                      onClick={() => handleMenuClick(link.title)}
                      className="cursor-pointer w-full flex flex-col items-center"
                    >
                      <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-[#1a1a1a] text-blue-400 group-hover:text-blue-300' : 'bg-white text-[#6D1B2A] group-hover:text-[#5A1622] shadow-sm'} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        {link.icon}
                      </div>
                      <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{qTitle}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>{qDesc}</p>
                    </div>
                    {isFeedbackModeActive && (
                      <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 w-full justify-center">
                        <button
                          onClick={() => triggerEdit(`quicklink_${idx}_title`, `${qTitle} 제목`, qTitle)}
                          className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-sm cursor-pointer"
                          title="제목 수정"
                        >
                          제목
                        </button>
                        <button
                          onClick={() => triggerEdit(`quicklink_${idx}_desc`, `${qTitle} 설명`, qDesc)}
                          className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-sm cursor-pointer"
                          title="설명 수정"
                        >
                          설명
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#1a1a1a] text-gray-400 py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12"
            >
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="text-3xl font-bold tracking-tighter text-white">
                    {getText('footer_hkon_title', t.hkon)}
                  </div>
                  {isFeedbackModeActive && (
                    <button
                      onClick={() => triggerEdit('footer_hkon_title', '푸터 기업명', getText('footer_hkon_title', t.hkon))}
                      className="p-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-sm"
                      title="푸터 기업명 수정"
                    >
                      <Edit3 size={11} />
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm leading-relaxed">
                    {getText('footer_hkon_desc', t.hkonDesc)}
                  </p>
                  {isFeedbackModeActive && (
                    <div>
                      <button
                        onClick={() => triggerEdit('footer_hkon_desc', '푸터 기업 소개글', getText('footer_hkon_desc', t.hkonDesc))}
                        className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-sm cursor-pointer"
                        title="푸터 기업 소개글 수정"
                      >
                        소개글 수정
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <h4 className="text-white font-bold uppercase tracking-wider text-sm">{getText('footer_quicklinks_title', t.quickLinks)}</h4>
                  {isFeedbackModeActive && (
                    <button
                      onClick={() => triggerEdit('footer_quicklinks_title', '푸터 퀵링크 타이틀', getText('footer_quicklinks_title', t.quickLinks))}
                      className="p-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-sm"
                      title="타이틀 수정"
                    >
                      <Edit3 size={10} />
                    </button>
                  )}
                </div>
                <ul className="space-y-3 text-sm">
                  <li><button onClick={() => openModal(t.company, getFooterContent('company', t.company, isDarkMode, t, undefined, currentLang))} className="hover:text-white transition-colors">{t.company}</button></li>
                  <li><button onClick={() => openModal(t.products, getFooterContent('products', t.products, isDarkMode, t, undefined, currentLang))} className="hover:text-white transition-colors">{t.products}</button></li>
                  <li><button onClick={() => openModal(t.support, getFooterContent('support', t.support, isDarkMode, t, undefined, currentLang))} className="hover:text-white transition-colors">{t.support}</button></li>
                  <li><button onClick={() => openModal(t.careers, getFooterContent('careers', t.careers, isDarkMode, t, undefined, currentLang))} className="hover:text-white transition-colors">{t.careers}</button></li>
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-6">
                  <h4 className="text-white font-bold uppercase tracking-wider text-sm">{getText('footer_customer_center', t.customerCenter)}</h4>
                  {isFeedbackModeActive && (
                    <button
                      onClick={() => triggerEdit('footer_customer_center', '고객센터 타이틀', getText('footer_customer_center', t.customerCenter))}
                      className="p-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-sm"
                      title="타이틀 수정"
                    >
                      <Edit3 size={10} />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'}`}>{getText('footer_phone', '1588-1285')}</div>
                  {isFeedbackModeActive && (
                    <button
                      onClick={() => triggerEdit('footer_phone', '대표 전화번호', getText('footer_phone', '1588-1285'))}
                      className="p-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-sm"
                      title="전화번호 수정"
                    >
                      <Edit3 size={10} />
                    </button>
                  )}
                </div>
                <p className="text-sm mb-4 whitespace-pre-line">{getText('footer_hours', `${t.weekdays}\n${t.closedWeekends}`)}</p>
                <a href="mailto:hkonkorea@gmail.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors block mb-2">{getText('footer_email', 'hkonkorea@gmail.com')}</a>
                <p className="text-sm text-gray-400">{getText('footer_address', t.address)}</p>
              </div>

            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm"
            >
              <div className="flex gap-6 items-center flex-wrap">
                <button onClick={() => openModal(t.privacyPolicy, getFooterContent('privacy', t.privacyPolicy, isDarkMode, t, undefined, currentLang))} className={`text-white font-medium transition-colors ${isDarkMode ? 'hover:text-blue-400' : 'hover:text-red-400'}`}>{t.privacyPolicy}</button>
                <button onClick={() => openModal(t.termsOfService, getFooterContent('terms', t.termsOfService, isDarkMode, t, undefined, currentLang))} className="hover:text-white transition-colors">{t.termsOfService}</button>
                <button onClick={() => openModal(t.sitemap, getFooterContent('sitemap', t.sitemap, isDarkMode, t, undefined, currentLang))} className="hover:text-white transition-colors">{t.sitemap}</button>
                <button onClick={() => openModal(t.location, getFooterContent('location', t.location, isDarkMode, t, undefined, currentLang))} className="hover:text-white transition-colors">{t.location}</button>
                <button onClick={() => openModal(t.resources, getResourcesContent(currentLang, isDarkMode))} className="flex items-center gap-2 hover:text-white transition-colors font-bold text-white"><MonitorPlay size={16} />{t.resources}</button>
                <button onClick={() => setIsAdminPortalOpen(true)} className="text-gray-500 hover:text-gray-300 transition-colors text-xs font-medium cursor-pointer" title="사내 포털 (단축키: F2 / Ctrl+M)">사내 포털</button>
                <div className="hidden md:flex ml-2 gap-4 border-l border-gray-700 pl-4 items-center">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors p-1 rounded-full bg-gray-800 hover:bg-gray-700" aria-label="Instagram"><Instagram size={16} /></a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors p-1 rounded-full bg-gray-800 hover:bg-gray-700" aria-label="YouTube"><Youtube size={17} /></a>
                  <button
                    onClick={() => setIsAdminPortalOpen(true)}
                    className="hover:text-amber-400 text-gray-400 transition-colors p-1 rounded-full bg-gray-800 hover:bg-gray-700 cursor-pointer"
                    title="관리자 & 직원 전용 보안 관리"
                    aria-label="관리자 보안 관리"
                  >
                    <ShieldCheck size={16} />
                  </button>
                  <a href="https://blog.naver.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors p-1 rounded-full bg-gray-800 hover:bg-gray-700" aria-label="Naver Blog"><BookOpen size={16} /></a>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 mt-4 md:mt-0">
                <div className="flex md:hidden gap-3 mb-2 items-center">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors p-1.5 rounded-full bg-gray-800 hover:bg-gray-700" aria-label="Instagram"><Instagram size={18} /></a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors p-1.5 rounded-full bg-gray-800 hover:bg-gray-700" aria-label="YouTube"><Youtube size={19} /></a>
                  <button
                    onClick={() => setIsAdminPortalOpen(true)}
                    className="hover:text-amber-400 text-gray-400 transition-colors p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 cursor-pointer"
                    title="관리자 & 직원 전용 보안 관리"
                    aria-label="관리자 보안 관리"
                  >
                    <ShieldCheck size={18} />
                  </button>
                  <a href="https://blog.naver.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors p-1.5 rounded-full bg-gray-800 hover:bg-gray-700" aria-label="Naver Blog"><BookOpen size={18} /></a>
                </div>
                <p>{getText('footer_text', t.footerText)}</p>
              </div>
            </motion.div>
          </div>
        </footer>
      </div>

      {/* Staff Feedback & Firebase Review Management System */}
      <FeedbackSystem
        isDarkMode={isDarkMode}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        activeOverrides={activeOverrides}
        isFeedbackModeActive={isFeedbackModeActive}
        setIsFeedbackModeActive={setIsFeedbackModeActive}
        targetSection={targetSection}
        setTargetSection={setTargetSection}
        onDirectApplyOptimistic={handleDirectApplyOptimistic}
        isAdminActive={isAdminActive}
        setIsAdminActive={setIsAdminActive}
        isAdminPortalOpen={isAdminPortalOpen}
        setIsAdminPortalOpen={setIsAdminPortalOpen}
      />

      {/* CARACI 6-Slide Visual Showcase Modal */}
      <CaraciShowcaseModal
        isOpen={isCaraciShowcaseOpen}
        onClose={() => setIsCaraciShowcaseOpen(false)}
        isDarkMode={isDarkMode}
        currentLang={currentLang}
        getImage={getImage}
        activeOverrides={activeOverrides}
        isFeedbackModeActive={isFeedbackModeActive}
        triggerEditImage={triggerEditImage}
      />
    </div>
  );
}

