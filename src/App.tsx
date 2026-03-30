/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ChevronRight, ChevronLeft, Globe, Menu, Search, ArrowRight, Phone, FileText, MonitorPlay, Users, Building2, X, ChevronDown, ChevronUp, Volume2, VolumeX, Sun, Moon, Eye, Download, Briefcase, Headset, MessageSquare, HelpCircle } from 'lucide-react';
import { PRODUCTS, Product, TRANSLATIONS, LANGUAGES } from './constants';
import { AccordionMenu } from './components/AccordionMenu';
import companyLogo from '/images/company.png';
import NOTICES from './announcement/notices.json';

const Modal = ({ isOpen, onClose, title, content, images, isDarkMode }: { isOpen: boolean; onClose: () => void; title: string; content: React.ReactNode; images?: string[]; isDarkMode?: boolean }) => (
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
                    className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800"
                  >
                    <img src={images[0]} alt={`${title} main`} className="w-full h-auto object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
                  </motion.div>
                  {images.length > 1 && (
                    <div className="grid grid-cols-3 gap-4">
                      {images.slice(1).map((img, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + (idx * 0.1), duration: 0.4 }}
                          className="rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 aspect-square cursor-pointer group"
                        >
                          <img src={img} alt={`${title} detail ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
                        </motion.div>
                      ))}
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

// 마우스 움직임에 따라 이미지가 기울어지는 3D 틸트 효과 컴포넌트
const TiltImage = ({ src, alt, isDarkMode }: { src: string, alt: string, isDarkMode: boolean }) => {
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
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative aspect-[4/3] md:aspect-auto md:h-[400px] lg:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl ${isDarkMode ? 'bg-gray-800 border-gray-700 shadow-blue-900/10' : 'bg-white border-gray-100 shadow-red-900/10'} border-4 p-2 cursor-pointer w-full group`}
    >
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="w-full h-full rounded-[2rem] overflow-hidden relative">
        <img src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
      </div>
    </motion.div>
  );
};

// 푸터 모달용 고품질 콘텐츠 생성 함수
const getFooterContent = (type: string, title: string, isDarkMode: boolean) => {
  const baseClass = `space-y-6 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;
  const titleClass = `text-2xl font-bold mb-4 ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'}`;
  const cardClass = `p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-100'}`;
  const badgeClass = `inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${isDarkMode ? 'bg-blue-900/40 text-blue-400 border border-blue-800/50' : 'bg-red-50 text-[#6D1B2A] border border-red-200'}`;

  const contentMap: Record<string, React.ReactNode> = {
    korea: (
      <div className={baseClass}>
        <div className={cardClass}>
          <span className={badgeClass}>Global HQ</span>
          <h3 className={titleClass}>한국 (본사)</h3>
          <p className="text-lg">에이치케이온 코리아 본사는 글로벌 소싱의 중심이자 전략적 허브입니다. 전 세계의 프리미엄 브랜드를 발굴하고, 국내 시장에 최적화된 유통 네트워크를 통해 고객에게 최상의 가치를 전달합니다.</p>
        </div>
      </div>
    ),
    usa: (
      <div className={baseClass}>
        <div className={cardClass}>
          <span className={badgeClass}>North America Hub</span>
          <h3 className={titleClass}>미국 지사</h3>
          <p className="text-lg">북미 시장의 최신 식품 트렌드를 가장 먼저 발굴하고, 글로벌 프리미엄 브랜드와의 긴밀한 파트너십을 유지하는 핵심 거점입니다.</p>
        </div>
      </div>
    ),
    japan: (
      <div className={baseClass}>
        <div className={cardClass}>
          <span className={badgeClass}>Asia Pacific Hub</span>
          <h3 className={titleClass}>일본 지사</h3>
          <p className="text-lg">아시아 태평양 지역의 엄격한 품질 기준을 만족시키는 정교한 소싱 네트워크와 트렌드 분석을 담당합니다.</p>
        </div>
      </div>
    ),
    china: (
      <div className={baseClass}>
        <div className={cardClass}>
          <span className={badgeClass}>East Asia Hub</span>
          <h3 className={titleClass}>중국 지사</h3>
          <p className="text-lg">거대한 아시아 시장을 연결하는 전략적 물류 허브이자, 빠르게 변화하는 소비 트렌드에 대응하는 전초기지입니다.</p>
        </div>
      </div>
    ),
    europe: (
      <div className={baseClass}>
        <div className={cardClass}>
          <span className={badgeClass}>Europe Hub</span>
          <h3 className={titleClass}>유럽 지사</h3>
          <p className="text-lg">유럽의 전통 깊은 프리미엄 식품과 유기농 브랜드를 발굴하여 아시아 시장에 소개하는 역할을 수행합니다.</p>
        </div>
      </div>
    ),
    vietnam: (
      <div className={baseClass}>
        <div className={cardClass}>
          <span className={badgeClass}>Southeast Asia Hub</span>
          <h3 className={titleClass}>베트남 지사</h3>
          <p className="text-lg">빠르게 성장하는 동남아시아 신흥 시장의 핵심 파트너십 거점으로, 현지화된 유통 전략을 전개합니다.</p>
        </div>
      </div>
    ),
    thailand: (
      <div className={baseClass}>
        <div className={cardClass}>
          <span className={badgeClass}>Southeast Asia Hub</span>
          <h3 className={titleClass}>태국 지사</h3>
          <p className="text-lg">동남아시아 식품 허브로서, 다양한 글로벌 브랜드의 현지 진출과 마케팅을 지원하는 전략적 요충지입니다.</p>
        </div>
      </div>
    ),
    indonesia: (
      <div className={baseClass}>
        <div className={cardClass}>
          <span className={badgeClass}>Southeast Asia Hub</span>
          <h3 className={titleClass}>인도네시아 지사</h3>
          <p className="text-lg">세계 최대 할랄 시장이자 역동적인 소비 시장인 인도네시아에서 프리미엄 브랜드의 입지를 다집니다.</p>
        </div>
      </div>
    ),
    privacy: (
      <div className={baseClass}>
        <div className={cardClass}>
          <h3 className={titleClass}>개인정보처리방침</h3>
          <p className="text-lg">에이치케이온 코리아는 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법령상의 개인정보보호 규정을 준수하며, 고객의 개인정보를 안전하게 보호하기 위해 최선을 다하고 있습니다.</p>
          <ul className="list-disc pl-5 space-y-2 mt-4 opacity-80">
            <li>수집하는 개인정보 항목: 이름, 연락처, 이메일 등</li>
            <li>개인정보의 수집 및 이용 목적: 고객 상담 및 서비스 제공</li>
            <li>개인정보의 보유 및 이용 기간: 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.</li>
          </ul>
        </div>
      </div>
    ),
    terms: (
      <div className={baseClass}>
        <div className={cardClass}>
          <h3 className={titleClass}>이용약관</h3>
          <p className="text-lg">본 약관은 에이치케이온 코리아가 제공하는 제반 서비스의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
        </div>
      </div>
    ),
    sitemap: (
      <div className={baseClass}>
        <div className={cardClass}>
          <h3 className={titleClass}>사이트맵</h3>
          <p className="text-lg">에이치케이온 코리아 웹사이트의 전체 구조를 한눈에 파악할 수 있는 사이트맵입니다. 원하시는 메뉴로 빠르게 이동하실 수 있습니다.</p>
        </div>
      </div>
    ),
    location: (
      <div className={baseClass}>
        <div className={cardClass}>
          <h3 className={titleClass}>오시는길</h3>
          <p className="text-lg">에이치케이온 코리아 본사 및 글로벌 지사의 위치를 안내해 드립니다. 방문 전 미리 연락 주시면 더욱 원활한 안내가 가능합니다.</p>
          <div className="mt-4 p-4 bg-black/5 rounded-lg">
            <strong>본사 주소:</strong> 경기도 부천시 삼작로 164번길
          </div>
        </div>
      </div>
    ),
    company: (
      <div className={baseClass}>
        <div className="text-xl font-medium mb-6">
          HK ON은 글로벌 소싱 역량을 기반으로 프리미엄 식품을 수입·유통하는 전문 기업입니다.
        </div>
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4">
            <Globe className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'}`} />
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>핵심 경쟁력</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-[#6D1B2A]'}`} />
              <span>글로벌 프리미엄 브랜드(하겐다즈, 카라치, 제너럴밀즈, 란티코 등) 공식 유통 파트너</span>
            </li>
            <li className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-[#6D1B2A]'}`} />
              <span>철저한 품질 관리 및 안정적인 유통 시스템</span>
            </li>
            <li className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-[#6D1B2A]'}`} />
              <span>온라인 채널 중심의 높은 고객 만족도 실현</span>
            </li>
          </ul>
        </div>
        <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-50/50'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Eye className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'}`} />
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>비전</h3>
          </div>
          <p className="leading-relaxed">
            프리미엄 디저트 및 간편식 시장을 선도하며, 오프라인 확장(백화점 등)을 통해 고객과 파트너 모두에게 새로운 가치를 제공하는 프리미엄 F&B 기업으로 도약합니다.
          </p>
        </div>
      </div>
    ),
    products: (
      <div className={baseClass}>
        <div className="text-xl font-medium mb-6">
          세계적으로 사랑받는 프리미엄 브랜드 라인업을 만나보세요.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={cardClass}>
            <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>그린자이언트</h3>
            <p className="text-sm opacity-80">자연의 신선함을 그대로 담은 프리미엄 스위트콘 브랜드</p>
          </div>
          <div className={cardClass}>
            <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>하겐다즈</h3>
            <p className="text-sm opacity-80">최상의 원료로 만든 프리미엄 아이스크림의 대명사</p>
          </div>
          <div className={cardClass}>
            <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>네이처밸리</h3>
            <p className="text-sm opacity-80">건강하고 맛있는 리얼 통귀리 그래놀라 바</p>
          </div>
          <div className={cardClass}>
            <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>푸룻바이더풋</h3>
            <p className="text-sm opacity-80">아이들이 좋아하는 재미있고 맛있는 과일 젤리</p>
          </div>
        </div>
      </div>
    ),
    support: (
      <div className={baseClass}>
        <div className="text-xl font-medium mb-6">
          고객님의 성공적인 비즈니스를 위해 최선을 다해 지원합니다.
        </div>
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4">
            <Headset className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'}`} />
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>고객 상담 센터</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="opacity-80">대표 번호</span>
              <span className="font-bold text-lg">1588-1285</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="opacity-80">운영 시간</span>
              <span className="text-right">평일 09:30 - 18:30<br/><span className="text-sm opacity-70">(주말 및 공휴일 휴무)</span></span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="opacity-80">이메일 문의</span>
              <span>hkonkorea@gmail.com</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className={`p-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-[#6D1B2A] hover:bg-[#5A1622] text-white'}`}>
            <MessageSquare className="w-5 h-5" /> 1:1 문의하기
          </button>
          <button className={`p-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}>
            <HelpCircle className="w-5 h-5" /> 자주 묻는 질문
          </button>
        </div>
      </div>
    ),
    careers: (
      <div className={baseClass}>
        <div className="text-xl font-medium mb-6">
          에이치케이온 코리아와 함께 글로벌 식품 시장을 선도할<br/>열정적인 인재를 기다립니다.
        </div>
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'}`} />
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>인재상</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-red-50 text-[#6D1B2A]'}`}>
                <Globe className="w-6 h-6" />
              </div>
              <div className="font-bold mb-1">Global Mind</div>
              <div className="text-sm opacity-80">글로벌 감각과 열린 사고</div>
            </div>
            <div className="text-center p-4">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-red-50 text-[#6D1B2A]'}`}>
                <Users className="w-6 h-6" />
              </div>
              <div className="font-bold mb-1">Teamwork</div>
              <div className="text-sm opacity-80">소통과 협력을 통한 시너지</div>
            </div>
            <div className="text-center p-4">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-red-50 text-[#6D1B2A]'}`}>
                <MonitorPlay className="w-6 h-6" />
              </div>
              <div className="font-bold mb-1">Challenge</div>
              <div className="text-sm opacity-80">변화를 두려워하지 않는 도전</div>
            </div>
          </div>
        </div>
        <div className="text-center mt-6">
          <p className="mb-4 opacity-80">현재 진행 중인 채용 공고가 없습니다.<br/>인재풀에 등록해주시면 적합한 포지션 오픈 시 연락드리겠습니다.</p>
          <button className={`px-6 py-3 rounded-full font-bold transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}>
            인재풀 등록하기
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
            <div className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>주요 업무</div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>글로벌 소싱, 현지 시장 조사, 파트너십 관리</div>
          </div>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/80' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
            <div className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>연락처</div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>global@hkonkorea.com</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  // 현재 선택된 언어 상태 (기본값: 한국어)
  const [currentLang, setCurrentLang] = useState('ko');
  // 언어 선택 메뉴 열림/닫힘 상태
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  // 모바일 메뉴 열림/닫힘 상태
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // 데스크톱 사이드바 열림/닫힘 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // 모바일 아코디언 메뉴 열림 상태
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  // 메인 히어로 슬라이더의 현재 슬라이드 인덱스
  const [activeSlide, setActiveSlide] = useState(0);
  // 제품 상세 모달 내 이미지 슬라이더의 현재 슬라이드 인덱스
  const [activeDetailSlide, setActiveDetailSlide] = useState(0);
  // 모달 창 상태 관리 (열림 여부, 제목, 내용, 이미지 배열)
  const [modal, setModal] = useState<{ isOpen: boolean; title: string; content: React.ReactNode; images?: string[] }>({ isOpen: false, title: '', content: '' });
  
  // 마우스 위치 (사이드바의 스포트라이트 효과 등에 사용)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // 다크모드 상태 관리
  const [isDarkMode, setIsDarkMode] = useState(false);
  // 현재 마우스가 올라가 있는 메뉴 항목 (드롭다운 표시에 사용)
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  // 다크모드 토글 시 html 태그에 클래스 추가/제거하여 전역 스타일 적용
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.ko;

  // 이미지 프리로딩: 첫 로딩 시 모든 제품 이미지를 불러와서 클릭 시 바로 볼 수 있게 최적화
  useEffect(() => {
    const imagesToPreload: string[] = [];
    PRODUCTS.forEach(product => {
      if (product.image) imagesToPreload.push(product.image);
      if (product.detailImages) {
        imagesToPreload.push(...product.detailImages);
      }
    });
    
    // 중복 제거 후 프리로드
    const uniqueImages = Array.from(new Set(imagesToPreload));
    uniqueImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const openModal = (title: string, content: React.ReactNode, images?: string[]) => setModal({ isOpen: true, title, content, images });

  const getCompanyIntro = (lang: string, dark: boolean) => {
    return (
      <div className={`space-y-6 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
        <p className={`text-xl font-medium ${dark ? 'text-blue-400' : 'text-[#6D1B2A]'}`}>{t.introDesc}</p>
        <div className={`${dark ? 'bg-blue-900/20 border-blue-800/50' : 'bg-red-50 border-red-100'} p-6 rounded-2xl border`}>
          <h4 className={`font-bold ${dark ? 'text-blue-400' : 'text-[#6D1B2A]'} mb-3 flex items-center gap-2`}><Globe size={20}/> {t.coreCompetency}</h4>
          <ul className={`list-disc pl-5 space-y-2 ${dark ? 'text-blue-200/80' : 'text-[#6D1B2A]/80'}`}>
            <li>{t.core1}</li>
            <li>{t.core2}</li>
            <li>{t.core3}</li>
          </ul>
        </div>
        <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'} p-6 rounded-2xl border`}>
          <h4 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-3 flex items-center gap-2`}><Eye size={20}/> {t.vision}</h4>
          <p className={`${dark ? 'text-gray-400' : 'text-gray-700'} leading-relaxed`}>{t.visionDesc}</p>
        </div>
      </div>
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
        openModal(item, "제품 소개 섹션으로 이동합니다.");
      }
    } 
    // 3. 공지사항 메뉴 클릭 시: 최근 공지사항 목록을 모달로 보여줍니다.
    else if (item === t.notice) {
      const noticeContent = (
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-4">최근 2년 공지사항 (2024-2026)</h3>
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
            <h3 className="text-2xl font-bold mb-4">무엇을 도와드릴까요?</h3>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>고객님의 성공적인 비즈니스를 위해 최선을 다해 지원합니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 고객 센터 안내 */}
            <div className={`p-8 rounded-3xl border ${isDarkMode ? 'border-gray-800 bg-gray-800/80 hover:bg-gray-800' : 'border-gray-200 bg-white hover:shadow-xl'} transition-all text-center group cursor-pointer`}>
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${isDarkMode ? 'bg-blue-900/30 text-blue-400 group-hover:bg-blue-500 group-hover:text-white' : 'bg-red-50 text-[#6D1B2A] group-hover:bg-[#6D1B2A] group-hover:text-white'} transition-colors`}>
                <Phone size={28} />
              </div>
              <h4 className="font-bold text-xl mb-3">고객 센터</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>1588-0000</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>평일 09:00 - 18:00</p>
            </div>
            {/* 온라인 문의 안내 */}
            <div className={`p-8 rounded-3xl border ${isDarkMode ? 'border-gray-800 bg-gray-800/80 hover:bg-gray-800' : 'border-gray-200 bg-white hover:shadow-xl'} transition-all text-center group cursor-pointer`}>
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${isDarkMode ? 'bg-blue-900/30 text-blue-400 group-hover:bg-blue-500 group-hover:text-white' : 'bg-red-50 text-[#6D1B2A] group-hover:bg-[#6D1B2A] group-hover:text-white'} transition-colors`}>
                <MessageSquare size={28} />
              </div>
              <h4 className="font-bold text-xl mb-3">온라인 문의</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>24시간 접수 가능</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>순차적으로 답변해 드립니다.</p>
            </div>
            {/* FAQ 안내 */}
            <div className={`p-8 rounded-3xl border ${isDarkMode ? 'border-gray-800 bg-gray-800/80 hover:bg-gray-800' : 'border-gray-200 bg-white hover:shadow-xl'} transition-all text-center group cursor-pointer`}>
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${isDarkMode ? 'bg-blue-900/30 text-blue-400 group-hover:bg-blue-500 group-hover:text-white' : 'bg-red-50 text-[#6D1B2A] group-hover:bg-[#6D1B2A] group-hover:text-white'} transition-colors`}>
                <HelpCircle size={28} />
              </div>
              <h4 className="font-bold text-xl mb-3">자주 묻는 질문</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>FAQ 확인하기</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>빠른 해결책을 찾아보세요.</p>
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
            <h3 className="text-2xl font-bold mb-4">함께 성장할 인재를 찾습니다</h3>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>에이치케이온 코리아와 함께 미래를 만들어갈 여러분을 기다립니다.</p>
          </div>
          <div className={`p-8 rounded-3xl border ${isDarkMode ? 'border-gray-800 bg-gray-800/80' : 'border-gray-200 bg-white'} shadow-sm`}>
            <h4 className={`text-xl font-bold mb-6 flex items-center gap-3 ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'}`}><Users size={24}/> 진행 중인 채용 공고</h4>
            <ul className="space-y-4">
              <li className={`flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl border ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'} transition-colors group cursor-pointer`}>
                <div className="mb-4 md:mb-0">
                  <p className={`text-lg font-bold mb-1 ${isDarkMode ? 'group-hover:text-blue-400' : 'group-hover:text-[#6D1B2A]'} transition-colors`}>식품 유통 영업 담당자 (신입/경력)</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>영업본부 | 서울 본사 | 정규직</p>
                </div>
                <span className={`px-4 py-1.5 text-sm font-bold rounded-full ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-red-50 text-[#6D1B2A]'}`}>채용중</span>
              </li>
              <li className={`flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl border ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'} transition-colors group cursor-pointer`}>
                <div className="mb-4 md:mb-0">
                  <p className={`text-lg font-bold mb-1 ${isDarkMode ? 'group-hover:text-blue-400' : 'group-hover:text-[#6D1B2A]'} transition-colors`}>마케팅 담당자 (경력)</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>마케팅팀 | 서울 본사 | 정규직</p>
                </div>
                <span className={`px-4 py-1.5 text-sm font-bold rounded-full ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-red-50 text-[#6D1B2A]'}`}>채용중</span>
              </li>
            </ul>
          </div>
        </div>
      );
      openModal(item, careersContent);
    } 
    // 6. 자료실 메뉴 클릭 시: 제품 카탈로그 등 자료 다운로드 모달을 엽니다.
    else if (item === t.resources) {
      const resourcesContent = (
        <div className="space-y-8">
          <div className={`p-8 rounded-3xl border ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50'} text-center`}>
            <Download size={48} className={`mx-auto mb-6 ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'}`} />
            <h3 className="text-2xl font-bold mb-4">자료실</h3>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>제품 카탈로그, 제안서, 인증서 등 다양한 자료를 다운로드하실 수 있습니다.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { title: '제품 카탈로그', desc: '최신 제품 정보' },
              { title: '브랜드 브로슈어', desc: '브랜드 스토리 및 소개' },
              { title: '품질 인증서', desc: 'HACCP 및 품질 보증' },
              { title: '입점 제안서', desc: 'B2B 파트너십 안내' },
              { title: '홍보 영상', desc: '기업 및 제품 영상' },
              { title: '기타 자료', desc: '이벤트 및 프로모션' }
            ].map((res, idx) => (
              <div key={idx} className={`p-6 rounded-3xl border ${isDarkMode ? 'border-gray-800 bg-gray-800/50 hover:bg-gray-800 hover:border-blue-500/50' : 'border-gray-200 bg-white hover:shadow-xl hover:border-red-200'} flex flex-col items-center justify-center text-center cursor-pointer transition-all group`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-gray-700 text-gray-300 group-hover:bg-blue-900/50 group-hover:text-blue-400' : 'bg-gray-100 text-gray-500 group-hover:bg-red-50 group-hover:text-[#6D1B2A]'} transition-colors`}>
                  <FileText size={24} />
                </div>
                <span className={`font-bold text-base mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{res.title}</span>
                <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{res.desc}</span>
              </div>
            ))}
          </div>
        </div>
      );
      openModal(item, resourcesContent);
    } 
    // 7. 제품 문의 메뉴 클릭 시: 문의 폼 모달을 엽니다.
    else if (item === t.inquiry) {
      const inquiryContent = (
        <div className="space-y-8">
          <div className={`p-8 rounded-3xl border ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50'} text-center`}>
            <MessageSquare size={48} className={`mx-auto mb-6 ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'}`} />
            <h3 className="text-2xl font-bold mb-4">제품 문의</h3>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>에이치케이온 코리아의 제품에 대한 궁금한 점을 남겨주세요.</p>
          </div>
          <div className={`p-8 rounded-3xl border ${isDarkMode ? 'border-gray-800 bg-gray-800/80' : 'border-gray-200 bg-white'} shadow-sm`}>
            <form className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>이름 / 회사명</label>
                <input type="text" className={`w-full p-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#6D1B2A]/50`} placeholder="이름 또는 회사명을 입력해주세요" />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>이메일</label>
                <input type="email" className={`w-full p-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#6D1B2A]/50`} placeholder="답변 받으실 이메일을 입력해주세요" />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>문의 내용</label>
                <textarea rows={4} className={`w-full p-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#6D1B2A]/50`} placeholder="문의하실 내용을 상세히 적어주세요"></textarea>
              </div>
              <button type="button" className={`w-full py-4 rounded-xl font-bold text-white transition-colors ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-[#6D1B2A] hover:bg-[#5A1622]'}`}>문의 접수하기</button>
            </form>
          </div>
        </div>
      );
      openModal(item, inquiryContent);
    } 
    // 8. 입점/제휴 문의 메뉴 클릭 시: 제휴 제안 폼 모달을 엽니다.
    else if (item === t.remoteSupport) {
      const partnershipContent = (
        <div className="space-y-8">
          <div className={`p-8 rounded-3xl border ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50'} text-center`}>
            <Building2 size={48} className={`mx-auto mb-6 ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'}`} />
            <h3 className="text-2xl font-bold mb-4">입점 / 제휴 문의</h3>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>에이치케이온 코리아와 함께 비즈니스 파트너가 되어보세요.</p>
          </div>
          <div className={`p-8 rounded-3xl border ${isDarkMode ? 'border-gray-800 bg-gray-800/80' : 'border-gray-200 bg-white'} shadow-sm`}>
            <form className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>회사명</label>
                <input type="text" className={`w-full p-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#6D1B2A]/50`} placeholder="회사명을 입력해주세요" />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>담당자 연락처</label>
                <input type="text" className={`w-full p-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#6D1B2A]/50`} placeholder="연락 가능한 번호를 입력해주세요" />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>제안 내용</label>
                <textarea rows={4} className={`w-full p-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#6D1B2A]/50`} placeholder="제안하실 내용을 상세히 적어주세요"></textarea>
              </div>
              <button type="button" className={`w-full py-4 rounded-xl font-bold text-white transition-colors ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-[#6D1B2A] hover:bg-[#5A1622]'}`}>제안서 제출하기</button>
            </form>
          </div>
        </div>
      );
      openModal(item, partnershipContent);
    } 
    // 9. 그 외의 경우: 기본 모달을 엽니다.
    else {
      openModal(item, `${item} page content.`);
    }
  };

  const navItems = [
    t.company, t.products, t.notice, t.support, t.careers, t.resources
  ];

  const menuData: { [key: string]: { name: string; hasSub?: boolean, content?: string }[] } = {
    [t.company]: [
      { name: "CEO 인사말" },
      { name: "회사개요" },
      { name: "회사연혁" },
      { name: "CI 소개" },
      { name: "오시는 길" },
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
      { name: "고객 문의" },
      { name: "입점/제휴 문의" },
      { name: "자주 묻는 질문(FAQ)" },
    ],
    [t.careers]: [
      { name: "인재상" },
      { name: "인사제도" },
      { name: "채용 공고" },
    ],
    [t.resources]: [
      { name: "제품 카탈로그" },
      { name: "홍보 영상" },
      { name: "브로슈어" },
    ]
  };

  const quickLinks = [
    { icon: <MessageSquare size={32} />, title: t.inquiry, desc: t.expertConsultation },
    { icon: <Building2 size={32} />, title: t.remoteSupport, desc: t.remoteHelp },
    { icon: <Download size={32} />, title: t.resources, desc: t.smartMonitoring },
    { icon: <Headset size={32} />, title: t.customerSupport, desc: "1588-1285" },
    { icon: <Briefcase size={32} />, title: t.training, desc: t.customizedTraining },
  ];

  const heroSlides = React.useMemo(() => [
    {
      title: t.hkonKorea,
      subtitle: t.heroSubtitle,
      image: "/images/company.png",
      detailTitle: t.hkonKorea,
      detailDesc: t.hkonDesc,
      productId: 'company'
    },
    {
      title: t.haagendazs,
      subtitle: t.haagendazsSub,
      image: "/images/mini_cup.jpg",
      detailTitle: t.haagendazs,
      detailDesc: t.haagendazsDesc,
      productId: 'haagen-dazs'
    },
    {
      title: t.natureValley,
      subtitle: t.natureValleySub,
      image: "/images/grnaola_thumbnail.jpg",
      detailTitle: t.natureValley,
      detailDesc: t.natureValleyDesc,
      productId: 'nature-valley'
    },
    {
      title: t.lantico,
      subtitle: t.lanticoSub,
      image: "/images/lantico.jpg",
      detailTitle: t.lantico,
      detailDesc: t.lanticoDesc,
      productId: 'lantico'
    },
    {
      title: t.caraci,
      subtitle: t.caraciSub,
      image: "/images/kadaif_thumbnail.png",
      detailTitle: t.caraci,
      detailDesc: t.caraciDesc,
      productId: 'caraci'
    },
    {
      title: t.fruitByTheFoot,
      subtitle: t.fruitByTheFootSub,
      image: "/images/fruit_by_the_foot.jpg",
      detailTitle: t.fruitByTheFoot,
      detailDesc: t.fruitByTheFootDesc,
      productId: 'fruit-by-the-foot'
    },
    {
      title: t.greenGiant,
      subtitle: t.greenGiantSub,
      image: "/images/green_giant.jpg",
      detailTitle: t.greenGiant,
      detailDesc: t.greenGiantDesc,
      productId: 'green-giant'
    }
  ], [t]);

  // Preload images for faster loading
  useEffect(() => {
    const imagesToPreload = [
      ...heroSlides.map(slide => slide.image),
      ...PRODUCTS.flatMap(product => [product.image, ...product.detailImages])
    ];
    
    imagesToPreload.forEach(src => {
      if (src) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [heroSlides]);

  // 메인 슬라이더 자동 넘김 (7.5초)
  // FIXME: 가끔 슬라이드가 두 번 넘어가는 버그 있음. 나중에 확인 필요
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7500);
    return () => clearInterval(timer);
  }, [activeSlide, heroSlides.length]);

  // 하단 디테일 슬라이더 자동 넘김 (15초)
  // TODO: 사용자가 직접 클릭했을 때는 타이머 초기화하는 로직 추가해야 함
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
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-[#1a1a1a] text-white selection:bg-blue-500' : 'bg-white text-gray-900 selection:bg-[#6D1B2A]'} font-sans selection:text-white transition-colors duration-300`}>
      
      {/* First Screen Wrapper (Sidebar + Hero) */}
      <div className="flex w-full h-[100dvh] relative">
        {/* Left Sidebar (Ends on first screen) */}
        <motion.div 
          animate={{ width: isSidebarOpen ? 224 : 64 }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          }}
          className="border-r border-[#5A1622] py-4 hidden lg:flex flex-col items-center overflow-hidden flex-shrink-0 bg-[#6D1B2A] relative group h-full z-40"
        >
        {/* Spotlight effect */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 50px at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.15), transparent)`
          }}
        />

        <div className={`flex w-full px-4 mb-6 flex-col items-start relative z-10 mt-4`}>
          <div className="flex items-center justify-between w-full">
            <div className={`text-xl font-bold text-white transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0 hidden'}`}>{t.hkon}</div>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-md transition-colors text-white ml-auto">
              <Menu size={24} />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col w-full relative z-10 flex-grow" onMouseLeave={() => setHoveredMenu(null)}>
          {navItems.map((item, idx) => (
            <div key={idx} className="w-full" onMouseEnter={() => setHoveredMenu(item)}>
              <button 
                onClick={() => handleMenuClick(item)} 
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
                className={`absolute left-full top-0 h-full w-[280px] ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-2xl border-l z-50 flex flex-col`}
              >
                <div className="bg-[#6D1B2A] py-8 px-6">
                  <h2 className="text-white text-2xl font-bold">{hoveredMenu}</h2>
                </div>
                <div className="flex-1 overflow-y-auto py-4 px-4">
                  <ul className="space-y-1">
                    {menuData[hoveredMenu].map((subItem, subIdx) => (
                      <li key={subIdx}>
                        <button
                          onClick={() => {
                            if (hoveredMenu === t.notice) {
                              openModal(subItem.name, subItem.content);
                            } else if (hoveredMenu === t.products) {
                              const productSlide = heroSlides.find(s => s.title === subItem.name);
                              if (productSlide) {
                                const product = PRODUCTS.find(p => p.id === productSlide.productId);
                                if (product) {
                                  openModal(
                                    product.name[currentLang as keyof typeof product.name] || product.name.en, 
                                    product.description[currentLang as keyof typeof product.description] || product.description.en, 
                                    product.detailImages
                                  );
                                } else {
                                  openModal(productSlide.detailTitle, productSlide.detailDesc, [productSlide.image]);
                                }
                              } else {
                                openModal(subItem.name, `${subItem.name} content`);
                              }
                            } else {
                              openModal(subItem.name, `${subItem.name} content`);
                            }
                          }}
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

      {/* Main Content Area for First Screen */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Top Right Floating Controls */}
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-4 p-3 px-6 rounded-full shadow-2xl border backdrop-blur-xl transition-all duration-300 ${isDarkMode ? 'bg-[#1a1a1a]/95 border-gray-700 shadow-black/50' : 'bg-white/95 border-gray-300 shadow-gray-200/50'}`}>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-1.5 rounded-full transition-colors ${isDarkMode ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-800' : 'text-[#6D1B2A] hover:text-[#5A1622] hover:bg-gray-100'}`}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <div className={`w-px h-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <div className="flex items-center gap-3 text-sm font-black">
            <Globe size={18} className={isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'} />
            {LANGUAGES.map((lang, idx) => (
              <React.Fragment key={lang.code}>
                <button 
                  onClick={() => setCurrentLang(lang.code)} 
                  className={`transition-colors tracking-widest uppercase ${currentLang === lang.code ? (isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]') : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900')}`}
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
                        openModal={(t, c) => { openModal(t, c); setIsMobileMenuOpen(false); }} 
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

        {/* First Screen: Hero + Notice */}
        <div className="h-full flex flex-col">
          {/* Hero Slider */}
          <div className="flex-1 relative overflow-hidden bg-gray-900">
            <AnimatePresence mode="wait">
              <motion.img
                key={`bg-${activeSlide}`}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                src={heroSlides[activeSlide].image}
                alt="Hero Background"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: 'center top' }}
                referrerPolicy="no-referrer"
                fetchPriority="high"
                loading="eager"
              />
            </AnimatePresence>
            
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-6 w-full mt-16 md:mt-0">
                <motion.div
                  key={`text-${activeSlide}`}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
                    exit: { opacity: 0, transition: { duration: 0.4 } }
                  }}
                  className="max-w-2xl text-white"
                >
                  <motion.h1 
                    variants={{
                      hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
                      visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } },
                      exit: { opacity: 0, y: -20, filter: "blur(10px)", transition: { duration: 0.4 } }
                    }}
                    className="text-4xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-6 leading-tight tracking-tight drop-shadow-2xl"
                  >
                    {heroSlides[activeSlide].title}
                  </motion.h1>
                  <motion.p 
                    variants={{
                      hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
                      visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } },
                      exit: { opacity: 0, y: -15, filter: "blur(10px)", transition: { duration: 0.4 } }
                    }}
                    className="text-lg md:text-xl lg:text-2xl font-light text-gray-200 mb-8 md:mb-10 drop-shadow-lg tracking-wide"
                  >
                    {heroSlides[activeSlide].subtitle}
                  </motion.p>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
                      visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } },
                      exit: { opacity: 0, y: -10, filter: "blur(10px)", transition: { duration: 0.4 } }
                    }}
                  >
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const slide = heroSlides[activeSlide];
                        if (slide.productId === 'company') {
                          openModal(t.company, getCompanyIntro(currentLang, isDarkMode));
                        } else {
                          const product = PRODUCTS.find(p => p.id === slide.productId);
                          if (product) {
                            openModal(
                              product.name[currentLang as keyof typeof product.name] || product.name.en, 
                              product.description[currentLang as keyof typeof product.description] || product.description.en, 
                              [product.image, ...product.detailImages]
                            );
                          } else {
                            openModal(slide.detailTitle, slide.detailDesc, [slide.image]);
                          }
                        }
                      }} 
                      className={`px-6 py-3 md:px-8 md:py-4 text-white font-semibold rounded-full transition-colors flex items-center gap-2 text-sm md:text-base ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20' : 'bg-[#6D1B2A] hover:bg-[#5A1622] shadow-lg shadow-red-900/20'}`}
                    >
                      자세히 보기 <ArrowRight size={20} />
                    </motion.button>
                  </motion.div>
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
                    <div className={`w-10 md:w-12 h-1 transition-all ${activeSlide === idx ? (isDarkMode ? 'bg-blue-500' : 'bg-[#6D1B2A]') : 'bg-white/30 group-hover:bg-white/50'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Notices Section (Bottom of First Screen) */}
          <section className={`shrink-0 ${isDarkMode ? 'bg-gray-800/80 border-t border-gray-700' : 'bg-white/90 border-t border-gray-200'} backdrop-blur-md py-4 px-6 z-30 relative transition-colors duration-300 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]`}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                <span className={`px-5 py-2 text-xs font-black rounded-full tracking-[0.2em] uppercase shadow-sm ${isDarkMode ? 'bg-blue-600 text-white shadow-blue-900/50' : 'bg-[#6D1B2A] text-white shadow-red-900/20'}`}>NOTICE</span>
              </div>
              <div className="flex-1 w-full overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                  {NOTICES.slice(0, 3).map((notice) => (
                    <motion.button 
                      key={notice.id} 
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openModal(notice.title[currentLang as keyof typeof notice.title] || notice.title.en, notice.content[currentLang as keyof typeof notice.content] || notice.content.en)} 
                      className="flex justify-between items-center group text-left w-full py-1"
                    >
                      <span className={`${isDarkMode ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-[#6D1B2A]'} transition-colors line-clamp-1 text-sm font-medium`}>
                        {notice.title[currentLang as keyof typeof notice.title] || notice.title.en}
                      </span>
                      <span className="text-xs text-gray-400 ml-3 shrink-0 font-medium">{notice.date}</span>
                    </motion.button>
                  ))}
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
                { label: 'Global Branches', value: '12', suffix: '+' },
                { label: 'Export Countries', value: '45', suffix: '+' },
                { label: 'Years of Innovation', value: '30', suffix: '+' },
                { label: 'Happy Clients', value: '10k', suffix: '+' }
              ].map((stat, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, scale: 0.9, y: 50, rotate: -2, filter: "blur(10px)" }} 
                  whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 0, filter: "blur(0px)" }} 
                  viewport={{ once: true, amount: 0.2 }} 
                  transition={{ delay: idx * 0.1, duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
                  className={`p-6 md:p-8 ${idx !== 0 && idx !== 2 ? 'border-t md:border-t-0' : ''} ${idx > 1 ? 'border-t md:border-t-0' : ''} ${isDarkMode ? 'border-gray-800' : 'border-gray-100'} group`}
                >
                  <div className="flex items-baseline justify-center mb-3 group-hover:scale-110 transition-transform duration-500">
                    <span className={`text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-[#6D1B2A] to-red-600'}`}>
                      {stat.value}
                    </span>
                    <span className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-blue-500' : 'text-red-500'}`}>
                      {stat.suffix}
                    </span>
                  </div>
                  <div className={`text-sm md:text-base font-bold tracking-[0.2em] uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
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
                initial={{ opacity: 0, y: 50, scale: 0.95, rotate: 2, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -50, scale: 0.95, rotate: -2, filter: "blur(10px)" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
                className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center"
              >
                <div className="w-full lg:w-1/2">
                  <TiltImage 
                    src={heroSlides[activeDetailSlide].image} 
                    alt={heroSlides[activeDetailSlide].detailTitle} 
                    isDarkMode={isDarkMode} 
                  />
                </div>
                <div className="w-full lg:w-1/2 space-y-8">
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                  >
                    <h2 className={`text-sm font-black tracking-[0.2em] ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'} uppercase mb-4 flex items-center gap-3`}>
                      <span className={`w-8 h-px ${isDarkMode ? 'bg-blue-400' : 'bg-[#6D1B2A]'}`}></span>
                      {t.hkonKorea}
                    </h2>
                    <h3 className={`text-4xl md:text-5xl lg:text-6xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} leading-[1.1] transition-colors duration-300 drop-shadow-sm`}>
                      {heroSlides[activeDetailSlide].detailTitle}
                    </h3>
                  </motion.div>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className={`text-lg md:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed whitespace-pre-line transition-colors duration-300 font-medium`}
                  >
                    {heroSlides[activeDetailSlide].detailDesc}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="pt-4"
                  >
                    <button 
                      onClick={() => {
                        if (activeDetailSlide === 0) {
                          openModal(t.company, getCompanyIntro(currentLang, isDarkMode));
                        } else {
                          const currentTitle = heroSlides[activeDetailSlide].detailTitle;
                          const product = PRODUCTS.find(p => p.name[currentLang as keyof typeof p.name] === currentTitle || p.name.en === currentTitle);
                          if (product) {
                            openModal(
                              product.name[currentLang as keyof typeof product.name] || product.name.en,
                              product.description[currentLang as keyof typeof product.description] || product.description.en,
                              [product.image, ...product.detailImages]
                            );
                          } else {
                            openModal(heroSlides[activeDetailSlide].detailTitle, heroSlides[activeDetailSlide].detailDesc);
                          }
                        }
                      }} 
                      className={`group inline-flex items-center gap-3 px-8 py-4 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-[#6D1B2A] hover:bg-[#5A1622]'} text-white rounded-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 font-bold text-lg`}
                    >
                      {t.readMore} 
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
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
              initial={{ opacity: 0, y: 50, scale: 0.95, rotate: -2, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
              className="flex flex-col items-center text-center mb-24"
            >
              <span className={`text-sm font-black tracking-[0.2em] ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'} uppercase mb-4`}>Our Brands</span>
              <h2 className={`text-5xl md:text-6xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6 transition-colors duration-300`}>{t.products}</h2>
              <div className={`w-24 h-1.5 ${isDarkMode ? 'bg-blue-500' : 'bg-[#6D1B2A]'} rounded-full`} />
            </motion.div>

            <div className="space-y-40">
              {PRODUCTS.map((product, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 100, scale: 0.9, rotate: -2, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
                    className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 lg:gap-24 items-center`}
                  >
                    {/* Image Side */}
                    <div className="w-full lg:w-1/2">
                      <div className="relative group">
                        <div className={`absolute inset-0 rounded-[2.5rem] ${isDarkMode ? 'bg-blue-500/10' : 'bg-red-500/10'} blur-2xl transform group-hover:scale-105 transition-transform duration-500`} />
                        <TiltImage 
                          src={product.image} 
                          alt={product.name[currentLang as keyof typeof product.name] || product.name.en} 
                          isDarkMode={isDarkMode} 
                        />
                      </div>
                    </div>

                    {/* Text Side */}
                    <div className="w-full lg:w-1/2 space-y-8">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase ${isDarkMode ? 'bg-blue-900/40 text-blue-400 border border-blue-800/50' : 'bg-red-50 text-[#6D1B2A] border border-red-200'}`}>
                        <span className="relative flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDarkMode ? 'bg-blue-400' : 'bg-red-500'}`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${isDarkMode ? 'bg-blue-500' : 'bg-red-600'}`}></span>
                        </span>
                        {t.premiumQuality}
                      </div>
                      <h3 className={`text-4xl md:text-5xl lg:text-6xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} leading-[1.1] tracking-tight`}>
                        {product.name[currentLang as keyof typeof product.name] || product.name.en}
                      </h3>
                      <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed whitespace-pre-line font-medium`}>
                        {product.description[currentLang as keyof typeof product.description] || product.description.en}
                      </p>
                      
                      <ul className={`space-y-5 mt-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium text-lg`}>
                        <li className="flex items-start gap-4">
                          <div className={`mt-2 w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-red-500'} shrink-0 shadow-[0_0_10px_rgba(0,0,0,0.2)] ${isDarkMode ? 'shadow-blue-500/50' : 'shadow-red-500/50'}`} />
                          <span className="leading-relaxed">{t.feature1}</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <div className={`mt-2 w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-red-500'} shrink-0 shadow-[0_0_10px_rgba(0,0,0,0.2)] ${isDarkMode ? 'shadow-blue-500/50' : 'shadow-red-500/50'}`} />
                          <span className="leading-relaxed">{t.feature2}</span>
                        </li>
                      </ul>

                      <div className="pt-8">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openModal(product.name[currentLang as keyof typeof product.name] || product.name.en, product.description[currentLang as keyof typeof product.description] || product.description.en, [product.image, ...product.detailImages])}
                          className={`group inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-colors duration-300 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' : 'bg-[#6D1B2A] hover:bg-[#5A1622] text-white shadow-lg shadow-red-900/20'}`}
                        >
                          {t.exploreProducts}
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
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
              {quickLinks.map((link, idx) => (
                <motion.button 
                  key={idx} 
                  initial={{ opacity: 0, y: 30, scale: 0.9, rotate: -2, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: idx * 0.1, duration: 0.6, type: "spring", stiffness: 120, damping: 15 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleMenuClick(link.title)} 
                  className={`flex flex-col items-center text-center p-8 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-gray-50 hover:bg-white border-gray-100'} transition-colors duration-300 group w-full border hover:shadow-xl rounded-3xl`}
                >
                  <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-[#1a1a1a] text-blue-400 group-hover:text-blue-300' : 'bg-white text-[#6D1B2A] group-hover:text-[#5A1622] shadow-sm'} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {link.icon}
                  </div>
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{link.title}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>{link.desc}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#1a1a1a] text-gray-400 py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30, rotate: -2, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, rotate: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12"
            >
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
                  <li><button onClick={() => openModal(t.company, getFooterContent('company', t.company, isDarkMode))} className="hover:text-white transition-colors">{t.company}</button></li>
                  <li><button onClick={() => openModal(t.products, getFooterContent('products', t.products, isDarkMode))} className="hover:text-white transition-colors">{t.products}</button></li>
                  <li><button onClick={() => openModal(t.support, getFooterContent('support', t.support, isDarkMode))} className="hover:text-white transition-colors">{t.support}</button></li>
                  <li><button onClick={() => openModal(t.careers, getFooterContent('careers', t.careers, isDarkMode))} className="hover:text-white transition-colors">{t.careers}</button></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{t.customerCenter}</h4>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-[#6D1B2A]'} mb-2`}>1588-1285</div>
                <p className="text-sm mb-4">{t.weekdays}<br/>{t.closedWeekends}</p>
                <a href="mailto:hkonkorea@gmail.com" className="text-sm hover:text-white transition-colors block mb-2">hkonkorea@gmail.com</a>
                <p className="text-sm text-gray-400">{t.address}</p>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{t.globalNetwork}</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <button onClick={() => openModal(t.globalNetwork, getFooterContent('korea', t.korea, isDarkMode))} className="hover:text-white transition-colors text-left">{t.korea}</button>
                  <button onClick={() => openModal(t.globalNetwork, getFooterContent('usa', t.usa, isDarkMode))} className="hover:text-white transition-colors text-left">{t.usa}</button>
                  <button onClick={() => openModal(t.globalNetwork, getFooterContent('japan', t.japan, isDarkMode))} className="hover:text-white transition-colors text-left">{t.japan}</button>
                  <button onClick={() => openModal(t.globalNetwork, getFooterContent('china', t.china, isDarkMode))} className="hover:text-white transition-colors text-left">{t.china}</button>
                  <button onClick={() => openModal(t.globalNetwork, getFooterContent('europe', t.europe, isDarkMode))} className="hover:text-white transition-colors text-left">{t.europe}</button>
                  <button onClick={() => openModal(t.globalNetwork, getFooterContent('vietnam', t.vietnam, isDarkMode))} className="hover:text-white transition-colors text-left">{t.vietnam}</button>
                  <button onClick={() => openModal(t.globalNetwork, getFooterContent('thailand', t.thailand, isDarkMode))} className="hover:text-white transition-colors text-left">{t.thailand}</button>
                  <button onClick={() => openModal(t.globalNetwork, getFooterContent('indonesia', t.indonesia, isDarkMode))} className="hover:text-white transition-colors text-left">{t.indonesia}</button>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm"
            >
              <div className="flex gap-6">
                <button onClick={() => openModal(t.privacyPolicy, getFooterContent('privacy', t.privacyPolicy, isDarkMode))} className={`text-white font-medium transition-colors ${isDarkMode ? 'hover:text-blue-400' : 'hover:text-red-400'}`}>{t.privacyPolicy}</button>
                <button onClick={() => openModal(t.termsOfService, getFooterContent('terms', t.termsOfService, isDarkMode))} className="hover:text-white transition-colors">{t.termsOfService}</button>
                <button onClick={() => openModal(t.sitemap, getFooterContent('sitemap', t.sitemap, isDarkMode))} className="hover:text-white transition-colors">{t.sitemap}</button>
                <button onClick={() => openModal(t.location, getFooterContent('location', t.location, isDarkMode))} className="hover:text-white transition-colors">{t.location}</button>
              </div>
              <p>{t.footerText}</p>
            </motion.div>
          </div>
        </footer>
      </div>
    </div>
  );
}

