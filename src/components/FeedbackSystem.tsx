import React, { useState, useEffect, useRef } from 'react';
import { 
  Edit3, 
  RotateCcw, 
  ShieldCheck, 
  LogOut, 
  AlertCircle, 
  Trash2, 
  Zap, 
  X, 
  Shield, 
  Check, 
  ExternalLink, 
  History, 
  UploadCloud, 
  Users, 
  Search, 
  Copy, 
  Image as ImageIcon, 
  Maximize2, 
  Plus,
  LogIn,
  Type,
  Film,
  Video,
  Key,
  RefreshCw,
  FolderOpen,
  ArrowRight,
  Layers,
  CheckCircle2,
  Lock,
  Unlock,
  HelpCircle,
  BookOpen,
  Send,
  Save,
  Sparkles
} from 'lucide-react';
import { 
  auth, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser, 
  googleProvider 
} from '../firebase';
import { 
  revertSiteOverride,
  directApplyOverride,
  submitFeedbackProposal,
  AdminUser,
  AdminPermissions,
  DEFAULT_ADMIN_PERMISSIONS,
  DEVELOPER_PERMISSIONS,
  subscribeAdminUsers,
  addOrUpdateAdminUser,
  removeAdminUser,
  SiteVersion,
  subscribeSiteVersions,
  deleteSiteVersion,
  rollbackToVersion,
  ActivityLog,
  subscribeActivityLogs,
  deleteActivityLog,
  GlobalMediaItem,
  subscribeToGlobalMedia,
  addGlobalMedia,
  deleteGlobalMedia
} from '../services/feedbackService';
import { TRANSLATIONS, PRODUCTS } from '../constants';

export interface StagedEditItem {
  key: string;
  title: string;
  newVal: string;
  oldVal: string;
  isImg: boolean;
  mediaType?: 'image' | 'video';
}

// Built-in Hero slides metadata
export const HERO_SLIDES_META = [
  { id: 'image_heroSlide_company', name: '1. HKON 종합 물류 허브', defaultImage: '/images/company.png', desc: '메인 첫 번째 슬라이드 배경' },
  { id: 'image_heroSlide_about-us', name: '2. About Us 회사 소개', defaultImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=60&w=800', desc: '회사 소개 슬라이드 배경' },
  { id: 'image_heroSlide_whats-new', name: "3. What's New 신제품 트렌드", defaultImage: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=60&w=800', desc: '신제품 소식 슬라이드 배경' },
  { id: 'image_heroSlide_haagen-dazs', name: '4. 하겐다즈 프리미엄', defaultImage: '/images/mini_cup.png', desc: '하겐다즈 브랜드 슬라이드 배경' },
  { id: 'image_heroSlide_lantico', name: '5. 란티코 커피', defaultImage: '/images/lantico.png', desc: '란티코 커피 슬라이드 배경' },
  { id: 'image_heroSlide_caraci', name: '6. CARACI (이탈리안 본연의 맛)', defaultImage: '/images/sweet.png', desc: 'CARACI 시칠리아 프리미엄 스프레드 배경' },
  { id: 'image_heroSlide_general-mills', name: '7. 제너럴밀스 그래놀라', defaultImage: '/images/grnaola_thumbnail.png', desc: '네이처밸리 그래놀라 슬라이드 배경' },
];

// Product Brand Categories & Slides metadata for deep hierarchical management
export interface ManagedMediaItem {
  id: string;
  name: string;
  defaultImage: string;
  desc: string;
  badge?: string;
}

export interface BrandSectionConfig {
  brandId: 'caraci' | 'haagen-dazs' | 'lantico' | 'general-mills';
  brandName: string;
  brandEn: string;
  items: ManagedMediaItem[];
}

export const BRAND_PRODUCTS_CONFIG: BrandSectionConfig[] = [
  {
    brandId: 'caraci',
    brandName: 'CARACI',
    brandEn: 'Authentic Sicilian Collection',
    items: [
      { id: 'image_product_caraci', name: 'CARACI 대표 제품 사진', defaultImage: '/images/sweet.png', desc: '제품 소개 메인 카드 썸네일' },
      { id: 'image_caraci_slide_pure', name: '1번 슬라이드: Pure', defaultImage: '/images/pure.png', desc: '100% 무가당 순수 원물 스프레드' },
      { id: 'image_caraci_slide_pesto', name: '2번 슬라이드: Pesto', defaultImage: '/images/pesto.png', desc: '올리브오일과의 조화, 정통 시칠리안 페스토' },
      { id: 'image_caraci_slide_sweet', name: '3번 슬라이드: Sweet', defaultImage: '/images/sweet.png', desc: '부드럽고 달콤한 클래식 스프레드' },
      { id: 'image_caraci_slide_nutty', name: '4번 슬라이드: Nutty', defaultImage: '/images/nutty.png', desc: '원물 알갱이의 바삭한 식감 크런치' },
      { id: 'image_caraci_slide_kataifi', name: '5번 슬라이드: Kataifi', defaultImage: '/images/Kataifi.png', desc: '바삭한 카다이프와의 황금 배합' },
      { id: 'image_caraci_slide_dark', name: '6번 슬라이드: Dark Chocolate', defaultImage: '/images/dark_choco.png', desc: '깊은 다크 카카오와의 마리아주' }
    ]
  },
  {
    brandId: 'haagen-dazs',
    brandName: '하겐다즈 (Häagen-Dazs)',
    brandEn: 'Super Premium Ice Cream',
    items: [
      { id: 'image_product_haagen-dazs', name: '하겐다즈 대표 제품 사진', defaultImage: '/images/mini_cup.png', desc: '제품 소개 메인 카드 썸네일' },
      { id: 'image_product_haagen-dazs_detail_0', name: '하겐다즈 상세 1 (파인트 컬렉션)', defaultImage: '/images/paint.png', desc: '제품 상세 모달 첫 번째 컷' },
      { id: 'image_product_haagen-dazs_detail_1', name: '하겐다즈 상세 2 (스틱바)', defaultImage: '/images/stick_bar.png', desc: '제품 상세 모달 두 번째 컷' },
      { id: 'image_product_haagen-dazs_detail_2', name: '하겐다즈 상세 3 (다크초콜릿 가나슈)', defaultImage: '/images/dark_choco_thumbnail.png', desc: '제품 상세 모달 세 번째 컷' }
    ]
  },
  {
    brandId: 'lantico',
    brandName: '란티코 (L\'Antico)',
    brandEn: 'Italian Espresso Masterpiece',
    items: [
      { id: 'image_product_lantico', name: '란티코 커피 대표 사진', defaultImage: '/images/lantico.png', desc: '제품 소개 메인 카드 썸네일' }
    ]
  },
  {
    brandId: 'general-mills',
    brandName: '제너럴밀스 & 스낵 라인업',
    brandEn: 'General Mills Global Brands',
    items: [
      { id: 'image_product_general-mills', name: '제너럴밀스 대표 사진 (네이처밸리)', defaultImage: '/images/grnaola_thumbnail.png', desc: '제품 소개 메인 카드 썸네일' },
      { id: 'image_product_green-giant', name: '그린자이언트 스위트콘', defaultImage: '/images/green_giant.png', desc: '스위트콘 브랜드 컷' },
      { id: 'image_product_nature-valley', name: '네이처밸리 그래놀라 바', defaultImage: '/images/granola_600_1.png', desc: '리얼 통귀리 스낵 컷' },
      { id: 'image_product_fruit-by-the-foot', name: '후룻 바이 더 풋 젤리', defaultImage: '/images/fruit_by_the_foot.png', desc: '인기 롤 젤리 스낵 컷' }
    ]
  }
];

// Brand story & site section images
export const BRAND_STORY_META: ManagedMediaItem[] = [
  { id: 'image_about_us_main', name: 'About Us 회사 소개 비주얼', defaultImage: '/images/company.png', desc: '회사 소개 모달 및 섹션 대표 이미지' },
  { id: 'image_company_logo', name: 'HKON 대표 심볼 / 로고', defaultImage: '/images/company.png', desc: '헤더 및 푸터 대표 로고' },
  { id: 'image_logistics_hub', name: '물류 허브 & 3PL 안내 비주얼', defaultImage: '/images/company.png', desc: '3PL 물류 서비스 안내 대표 이미지' }
];

// Product images metadata for compatibility
export const PRODUCTS_META = [
  { id: 'image_product_haagen-dazs', name: '하겐다즈 프리미엄', defaultImage: '/images/mini_cup.png', brand: 'Häagen-Dazs' },
  { id: 'image_product_lantico', name: '란티코 이탈리안 커피', defaultImage: '/images/lantico.png', brand: "L'Antico" },
  { id: 'image_product_caraci', name: 'CARACI 대표 제품 사진', defaultImage: '/images/sweet.png', brand: 'CARACI' },
  { id: 'image_product_general-mills', name: '제너럴밀스 네이처밸리', defaultImage: '/images/grnaola_thumbnail.png', brand: 'General Mills' },
];

// Main website text fields
export const SITE_TEXTS_META = [
  { id: 'brand_haagendazs_desc', name: '하겐다즈 설명 문구', defaultText: '프리미엄 아이스크림의 완벽한 기준, 하겐다즈. 타협하지 않는 퀄리티로 완성된 하겐다즈의 깊고 진한 맛을 경험해 보세요.' },
  { id: 'brand_lantico_desc', name: '란티코 설명 문구', defaultText: '이탈리아 피아짜의 정통 커피, 란티코. 이탈리아 전통 로스팅 기법을 고스란히 담아낸 프리미엄 커피.' },
  { id: 'brand_caraci_desc', name: 'CARACI 설명 문구', defaultText: '시칠리아 수입산임을 증명하는 이탈리안 본연의 맛. 100% 시칠리아 프리미엄 스프레드 (190g).' },
  { id: 'brand_generalmills_desc', name: '제너럴밀스 설명 문구', defaultText: '세계적인 식품 기업 제너럴밀스의 대표 스낵 베스트셀러 브랜드를 만나보세요.' },
];

// Complete default code mapping for side-by-side before/after comparison
export const DEFAULT_VALUES_MAP: Record<string, { value: string; type: 'image' | 'text'; title: string }> = {
  image_heroSlide_company: { value: '/images/company.png', type: 'image', title: '1. HKON 종합 물류 허브 배경' },
  'image_heroSlide_about-us': { value: '/images/company.png', type: 'image', title: '2. About Us 배경' },
  'image_heroSlide_whats-new': { value: '/images/sweet.png', type: 'image', title: "3. What's New 배경" },
  'image_heroSlide_haagen-dazs': { value: '/images/mini_cup.png', type: 'image', title: '4. 하겐다즈 슬라이드 배경' },
  image_heroSlide_lantico: { value: '/images/lantico.png', type: 'image', title: '5. 란티코 커피 슬라이드 배경' },
  image_heroSlide_caraci: { value: '/images/harvest_farm.jpg', type: 'image', title: '6. CARACI 슬라이드 배경' },
  'image_heroSlide_general-mills': { value: '/images/grnaola_thumbnail.png', type: 'image', title: '7. 제너럴밀스 슬라이드 배경' },
  'image_product_haagen-dazs': { value: '/images/mini_cup.png', type: 'image', title: '하겐다즈 프리미엄 대표 사진' },
  'image_product_haagen-dazs_detail_0': { value: '/images/paint.png', type: 'image', title: '하겐다즈 상세 1 (파인트)' },
  'image_product_haagen-dazs_detail_1': { value: '/images/stick_bar.png', type: 'image', title: '하겐다즈 상세 2 (스틱바)' },
  'image_product_haagen-dazs_detail_2': { value: '/images/dark_choco_thumbnail.png', type: 'image', title: '하겐다즈 상세 3 (다크초콜릿)' },
  image_product_lantico: { value: '/images/lantico.png', type: 'image', title: '란티코 이탈리안 커피 사진' },
  image_product_caraci: { value: '/images/sweet.png', type: 'image', title: 'CARACI 대표 사진' },
  image_caraci_slide_pure: { value: '/images/pure.png', type: 'image', title: 'CARACI 1번: Pure' },
  image_caraci_slide_pesto: { value: '/images/pesto.png', type: 'image', title: 'CARACI 2번: Pesto' },
  image_caraci_slide_sweet: { value: '/images/sweet.png', type: 'image', title: 'CARACI 3번: Sweet' },
  image_caraci_slide_nutty: { value: '/images/nutty.png', type: 'image', title: 'CARACI 4번: Nutty' },
  image_caraci_slide_kataifi: { value: '/images/Kataifi.png', type: 'image', title: 'CARACI 5번: Kataifi' },
  image_caraci_slide_dark: { value: '/images/dark_choco.png', type: 'image', title: 'CARACI 6번: Dark Chocolate' },
  'image_product_general-mills': { value: '/images/grnaola_thumbnail.png', type: 'image', title: '제너럴밀스 네이처밸리 사진' },
  'image_product_green-giant': { value: '/images/green_giant.png', type: 'image', title: '그린자이언트 대표 사진' },
  'image_product_nature-valley': { value: '/images/granola_600_1.png', type: 'image', title: '네이처밸리 대표 사진' },
  'image_product_fruit-by-the-foot': { value: '/images/fruit_by_the_foot.png', type: 'image', title: '푸룻바이더풋 대표 사진' },
  image_about_us_main: { value: '/images/company.png', type: 'image', title: 'About Us 회사 소개 비주얼' },
  image_company_logo: { value: '/images/company.png', type: 'image', title: 'HKON 대표 심볼 / 로고' },
  image_logistics_hub: { value: '/images/company.png', type: 'image', title: '물류 허브 & 3PL 비주얼' },
  brand_haagendazs_desc: { value: '프리미엄 아이스크림의 완벽한 기준, 하겐다즈. 타협하지 않는 퀄리티로 완성된 하겐다즈의 깊고 진한 맛을 경험해 보세요.', type: 'text', title: '하겐다즈 설명 문구' },
  brand_lantico_desc: { value: '이탈리아 피아짜의 정통 커피, 란티코. 이탈리아 전통 로스팅 기법을 고스란히 담아낸 프리미엄 커피.', type: 'text', title: '란티코 설명 문구' },
  brand_caraci_desc: { value: '시칠리아 수입산임을 증명하는 이탈리안 본연의 맛. 100% 시칠리아 프리미엄 스프레드 (190g).', type: 'text', title: 'CARACI 설명 문구' },
  caraci_feat1: { value: '에트나 화산 지대 비옥한 토양에서 자란 최상급 원물 본연의 진하고 깊은 고소함.', type: 'text', title: 'CARACI 특징 1 (원물 풍미)' },
  caraci_feat2: { value: '시칠리아 전통 방식을 계승하여 인공 첨가물 없이 완성한 100% 이탈리아 프리미엄 스프레드.', type: 'text', title: 'CARACI 특징 2 (시칠리아 전통)' },
  brand_generalmills_desc: { value: '세계적인 식품 기업 제너럴밀스의 대표 스낵 베스트셀러 브랜드를 만나보세요.', type: 'text', title: '제너럴밀스 설명 문구' },
};

// Multilingual key mappings and defaults for independent KO, EN, ZH editing
export const KEY_TO_TRANSLATION_MAP: Record<string, string> = {
  footer_hkon_title: 'hkon',
  footer_hkon_desc: 'hkonDesc',
  footer_quicklinks_title: 'quickLinks',
  footer_customer_center: 'customerCenter',
  footer_address: 'address',
  footer_text: 'footerText',
  hero_cta_btn: 'readMore',
  btn_detail_readmore: 'readMore',
  btn_explore_products: 'exploreProducts',
  brands_section_title: 'products',
  brand_badge_hkon: 'hkonKorea',
  heroSlide_company_title: 'hkonKorea',
  heroSlide_company_sub: 'heroSubtitle',
  detail_company_title: 'hkonKorea',
  detail_company_desc: 'hkonDesc',
  heroSlide_about_title: 'aboutUs',
  'heroSlide_about-us_title': 'aboutUs',
  heroSlide_about_sub: 'aboutUsTitle',
  'heroSlide_about-us_sub': 'aboutUsTitle',
  detail_about_title: 'aboutUs',
  'detail_about-us_title': 'aboutUs',
  detail_about_desc: 'aboutUsDesc',
  'detail_about-us_desc': 'aboutUsDesc',
  heroSlide_whatsnew_title: 'whatsNew',
  'heroSlide_whats-new_title': 'whatsNew',
  heroSlide_whatsnew_sub: 'whatsNewTitle',
  'heroSlide_whats-new_sub': 'whatsNewTitle',
  detail_whatsnew_title: 'whatsNew',
  'detail_whats-new_title': 'whatsNew',
  detail_whatsnew_desc: 'whatsNewDesc',
  'detail_whats-new_desc': 'whatsNewDesc',
  heroSlide_haagendazs_title: 'haagendazs',
  'heroSlide_haagen-dazs_title': 'haagendazs',
  heroSlide_haagendazs_sub: 'haagendazsSub',
  'heroSlide_haagen-dazs_sub': 'haagendazsSub',
  detail_haagendazs_title: 'haagendazs',
  'detail_haagen-dazs_title': 'haagendazs',
  detail_haagendazs_desc: 'haagendazsDesc',
  'detail_haagen-dazs_desc': 'haagendazsDesc',
  heroSlide_lantico_title: 'lantico',
  heroSlide_lantico_sub: 'lanticoSub',
  detail_lantico_title: 'lantico',
  detail_lantico_desc: 'lanticoDesc',
  heroSlide_caraci_title: 'caraci',
  heroSlide_caraci_sub: 'caraciSub',
  detail_caraci_title: 'caraci',
  detail_caraci_desc: 'caraciDesc',
  heroSlide_generalmills_title: 'generalMills',
  'heroSlide_general-mills_title': 'generalMills',
  heroSlide_generalmills_sub: 'generalMillsSub',
  'heroSlide_general-mills_sub': 'generalMillsSub',
  detail_generalmills_title: 'generalMills',
  'detail_general-mills_title': 'generalMills',
  detail_generalmills_desc: 'generalMillsDesc',
  'detail_general-mills_desc': 'generalMillsDesc',
  'product_haagen-dazs_name': 'haagendazs',
  'product_haagen-dazs_badge': 'haagendazsSub',
  'product_haagen-dazs_desc': 'haagendazsDesc',
  'product_nature-valley_name': 'natureValley',
  'product_nature-valley_badge': 'natureValleySub',
  'product_nature-valley_desc': 'natureValleyDesc',
  product_lantico_name: 'lantico',
  product_lantico_badge: 'lanticoSub',
  product_lantico_desc: 'lanticoDesc',
  product_caraci_name: 'caraci',
  product_caraci_badge: 'caraciSub',
  product_caraci_desc: 'caraciDesc',
  'product_fruit-by-the-foot_name': 'fruitByTheFoot',
  'product_fruit-by-the-foot_badge': 'fruitByTheFootSub',
  'product_fruit-by-the-foot_desc': 'fruitByTheFootDesc',
  'product_green-giant_name': 'greenGiant',
  'product_green-giant_badge': 'greenGiantSub',
  'product_green-giant_desc': 'greenGiantDesc',
  brand_haagendazs_desc: 'haagendazsDesc',
  brand_lantico_desc: 'lanticoDesc',
  brand_caraci_desc: 'caraciDesc',
  brand_generalmills_desc: 'generalMillsDesc'
};

export const PRODUCT_FEATS_DEFAULTS: Record<string, { ko: string; en: string; zh: string }> = {
  caraci_feat1: {
    ko: '에트나 화산 지대 비옥한 토양에서 자란 최상급 원물 본연의 진하고 깊은 고소함.',
    en: 'Rich and nutty aroma naturally cultivated from the fertile volcanic soils of Mount Etna.',
    zh: '源自埃特纳火山沃土的顶级天然原料，蕴含纯粹深邃的天然坚果馥郁香气。'
  },
  caraci_feat2: {
    ko: '시칠리아 전통 방식을 계승하여 인공 첨가물 없이 완성한 100% 이탈리아 프리미엄 스프레드.',
    en: '100% authentic Italian premium spread crafted with time-honored artisanal Sicilian traditions.',
    zh: '承袭西西里百年传统古法工艺，绝不添加人工香精的100%意大利原装进口特级涂抹酱。'
  },
  'haagen-dazs_feat1': {
    ko: '엄선된 100% 리얼 신선 원료만을 사용하는 무합성 착향료 프리미엄 레시피.',
    en: 'Pure premium recipe using strictly 100% real ingredients with zero artificial flavorings.',
    zh: '严选100%新鲜真材实料，坚持不添加任何人工香精的奢华经典配方。'
  },
  'haagen-dazs_feat2': {
    ko: '공기 함유량을 최소화한 고밀도 텍스처로 전해지는 극상의 부드러움과 깊은 풍미.',
    en: 'Dense, velvety texture with minimal overrun delivering deep, unmatched richness.',
    zh: '超低含气量的极致绵密醇厚质感，带来入口即化的丝滑与浓郁滋味。'
  },
  lantico_feat1: {
    ko: '110년 전통의 이탈리아 모데나 명문 로스팅 하우스의 정통 에스프레소 블렌딩.',
    en: 'Authentic Italian espresso blending with over 110 years of roasting heritage in Modena.',
    zh: '拥有110年历史的意大利摩德纳名门烘焙工坊正统意式浓缩拼配。'
  },
  lantico_feat2: {
    ko: '느린 로스팅 기법으로 쓴맛을 줄이고 원두 고유의 고소한 너티함과 꽃향을 극대화.',
    en: 'Artisanal slow-roasting technique minimizing bitterness while enhancing rich nutty and floral aromas.',
    zh: '传统慢速烘焙工艺，大幅降低焦苦感，完美激发咖啡豆原生的醇香与花果香。'
  },
  'general-mills_feat1': {
    ko: '간편하게 채우는 하루 10g 고단백 프로틴바와 자연 유래 통귀리 그래놀라의 영양.',
    en: 'Convenient daily nutrition with 10g protein bars and wholesome whole-grain rolled oats.',
    zh: '每日轻松补充10g优质蛋白质能量棒，结合天然全麦燕麦的均衡营养。'
  },
  'general-mills_feat2': {
    ko: '천연 과일 퓨레를 함유해 재미있게 즐기는 온 가족 글로벌 스낵 컬렉션.',
    en: 'Delightful natural fruit puree roll snacks loved by families worldwide for fun and healthy snacking.',
    zh: '富含天然果泥的趣味果丹皮零食，深受全球家庭喜爱的快乐健康零食系列。'
  }
};

export function getDefaultTextForLanguage(key: string, lang: 'ko' | 'en' | 'zh'): string {
  const baseKey = key.replace(/_(ko|en|zh)$/, '');
  
  if (PRODUCT_FEATS_DEFAULTS[baseKey]) {
    return PRODUCT_FEATS_DEFAULTS[baseKey][lang] || '';
  }

  const transKey = KEY_TO_TRANSLATION_MAP[baseKey];
  if (transKey && TRANSLATIONS[lang] && TRANSLATIONS[lang][transKey]) {
    return TRANSLATIONS[lang][transKey];
  }

  if (lang === 'ko' && DEFAULT_VALUES_MAP[baseKey]?.value) {
    return DEFAULT_VALUES_MAP[baseKey].value;
  }
  if (DEFAULT_VALUES_MAP[`${baseKey}_${lang}`]?.value) {
    return DEFAULT_VALUES_MAP[`${baseKey}_${lang}`].value;
  }

  const productMatch = baseKey.match(/^product_([a-zA-Z0-9_-]+)_(name|badge|desc)$/);
  if (productMatch) {
    const [, prodId, field] = productMatch;
    const prod = PRODUCTS.find(p => p.id === prodId);
    if (prod) {
      if (field === 'name') return prod.name[lang] || prod.name.en || '';
      if (field === 'badge') return prod.shortDescription?.[lang] || prod.name[lang] || '';
      if (field === 'desc') return prod.shortDescription?.[lang] || prod.description[lang] || prod.description.en || '';
    }
  }

  return '';
}

// All selectable target sections for media placement
export const ALL_TARGET_SECTIONS = [
  { key: 'image_heroSlide_company', title: '1. 슬라이드 배경 (HKON 물류 허브)' },
  { key: 'image_heroSlide_about-us', title: '2. 슬라이드 배경 (About Us)' },
  { key: 'image_heroSlide_whats-new', title: "3. 슬라이드 배경 (What's New)" },
  { key: 'image_heroSlide_haagen-dazs', title: '4. 슬라이드 배경 (하겐다즈)' },
  { key: 'image_heroSlide_lantico', title: '5. 슬라이드 배경 (란티코 커피)' },
  { key: 'image_heroSlide_caraci', title: '6. 슬라이드 배경 (CARACI)' },
  { key: 'image_heroSlide_general-mills', title: '7. 슬라이드 배경 (제너럴밀스)' },
  { key: 'image_product_caraci', title: '제품 사진: CARACI 대표' },
  { key: 'image_caraci_slide_pure', title: 'CARACI 1번 슬라이드 (Pure)' },
  { key: 'image_caraci_slide_pesto', title: 'CARACI 2번 슬라이드 (Pesto)' },
  { key: 'image_caraci_slide_sweet', title: 'CARACI 3번 슬라이드 (Sweet)' },
  { key: 'image_caraci_slide_nutty', title: 'CARACI 4번 슬라이드 (Nutty)' },
  { key: 'image_caraci_slide_kataifi', title: 'CARACI 5번 슬라이드 (Kataifi)' },
  { key: 'image_caraci_slide_dark', title: 'CARACI 6번 슬라이드 (Dark Chocolate)' },
  { key: 'image_product_haagen-dazs', title: '제품 사진: 하겐다즈 프리미엄' },
  { key: 'image_product_lantico', title: '제품 사진: 란티코 커피' },
  { key: 'image_product_general-mills', title: '제품 사진: 제너럴밀스 그래놀라' },
];

// Built-in default media assets for global library (only valid files existing on disk)
export const DEFAULT_BUILTIN_MEDIA = [
  { id: 'builtin_caraci_sweet', name: 'CARACI Sweet 190g (기본 대표)', url: '/images/sweet.png', mediaType: 'image' as const, category: 'CARACI' },
  { id: 'builtin_caraci_pure', name: 'CARACI Pure 190g (순수 원물)', url: '/images/pure.png', mediaType: 'image' as const, category: 'CARACI' },
  { id: 'builtin_caraci_pesto', name: 'CARACI Pesto 190g (올리브오일 페스토)', url: '/images/pesto.png', mediaType: 'image' as const, category: 'CARACI' },
  { id: 'builtin_caraci_nutty', name: 'CARACI Nutty 190g (너티 크런치)', url: '/images/nutty.png', mediaType: 'image' as const, category: 'CARACI' },
  { id: 'builtin_caraci_kataifi', name: 'CARACI Kataifi 190g (카다이프)', url: '/images/Kataifi.png', mediaType: 'image' as const, category: 'CARACI' },
  { id: 'builtin_caraci_dark', name: 'CARACI Dark Chocolate 190g (다크)', url: '/images/dark_choco.png', mediaType: 'image' as const, category: 'CARACI' },
  { id: 'builtin_company', name: '회사 물류 허브 (기본)', url: '/images/company.png', mediaType: 'image' as const, category: '슬라이드' },
  { id: 'builtin_mini_cup', name: '하겐다즈 미니컵 (기본)', url: '/images/mini_cup.png', mediaType: 'image' as const, category: '제품' },
  { id: 'builtin_pint', name: '하겐다즈 파인트 (기본)', url: '/images/paint.png', mediaType: 'image' as const, category: '제품' },
  { id: 'builtin_stick_bar', name: '하겐다즈 스틱바 (기본)', url: '/images/stick_bar.png', mediaType: 'image' as const, category: '제품' },
  { id: 'builtin_dark_choco', name: '하겐다즈 다크초콜릿 가나슈', url: '/images/dark_choco_thumbnail.png', mediaType: 'image' as const, category: '제품' },
  { id: 'builtin_lantico', name: '란티코 에스프레소 (기본)', url: '/images/lantico.png', mediaType: 'image' as const, category: '제품' },
  { id: 'builtin_lantico_2', name: '란티코 프리미엄 에스프레소 2', url: '/images/lantico_2.png', mediaType: 'image' as const, category: '제품' },
  { id: 'builtin_kadaif_old', name: 'CARACI 카다이프 초콜릿', url: '/images/kadaif_thumbnail.png', mediaType: 'image' as const, category: '제품' },
  { id: 'builtin_granola', name: '제너럴밀스 네이처밸리 그래놀라 (기본)', url: '/images/grnaola_thumbnail.png', mediaType: 'image' as const, category: '제품' },
  { id: 'builtin_granola_1', name: '네이처밸리 오츠 앤 허니', url: '/images/granola_600_1.png', mediaType: 'image' as const, category: '제품' },
  { id: 'builtin_fruit_foot', name: '후룻 바이 더 풋 젤리', url: '/images/fruit_by_the_foot.png', mediaType: 'image' as const, category: '제품' },
  { id: 'builtin_green_giant', name: '그린자이언트 스위트콘', url: '/images/green_giant.png', mediaType: 'image' as const, category: '제품' },
];

/**
 * Check if a media URL represents a video
 */
export const isMediaVideo = (url?: string): boolean => {
  if (!url) return false;
  return (
    url.startsWith('data:video') ||
    url.endsWith('.mp4') ||
    url.endsWith('.webm') ||
    url.includes('.mp4?') ||
    url.includes('.webm?') ||
    url.includes('video/')
  );
};

/**
 * Client-side media processor: Handles both image compression and video files
 */
export function processMediaFile(file: File): Promise<{
  dataUrl: string;
  mediaType: 'image' | 'video';
  sizeFormatted: string;
  fileName: string;
}> {
  return new Promise((resolve, reject) => {
    const isVideo = file.type.startsWith('video/') || file.name.match(/\.(mp4|webm|mov)$/i);
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      reject(new Error('이미지(JPG, PNG, WebP) 또는 동영상(MP4, WebM) 파일만 업로드할 수 있습니다.'));
      return;
    }

    if (isVideo) {
      if (file.size > 25 * 1024 * 1024) {
        reject(new Error('동영상 파일 크기는 최대 25MB 이하로 권장됩니다.'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          dataUrl: e.target?.result as string,
          mediaType: 'video',
          sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          fileName: file.name
        });
      };
      reader.onerror = () => reject(new Error('동영상 파일 읽기 실패'));
      reader.readAsDataURL(file);
      return;
    }

    // Process image with max 1920px bounds & optimization
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1920;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            dataUrl: e.target?.result as string,
            mediaType: 'image',
            sizeFormatted: `${Math.round(file.size / 1024)} KB`,
            fileName: file.name
          });
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.86);
        const approxSizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
        resolve({
          dataUrl,
          mediaType: 'image',
          sizeFormatted: `${approxSizeKb} KB`,
          fileName: file.name
        });
      };
      img.onerror = () => reject(new Error('이미지 불러오기 실패'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsDataURL(file);
  });
}

export type TargetSectionType = {
  key: string;
  title: string;
  currentText?: string;
  currentImage?: string;
  isImage?: boolean;
  lang?: string;
} | null;

interface FeedbackSystemProps {
  activeOverrides: Record<string, string>;
  isFeedbackModeActive: boolean;
  setIsFeedbackModeActive: (active: boolean) => void;
  isAdminActive: boolean;
  setIsAdminActive: (active: boolean) => void;
  isAdminReviewOpen: boolean;
  setIsAdminReviewOpen: (open: boolean) => void;
  targetSection: TargetSectionType;
  setTargetSection: (section: TargetSectionType) => void;
  onDirectApplyOptimistic?: (sectionKey: string, newValue: string, targetLang?: string) => void;
  isAdminPortalOpen: boolean;
  setIsAdminPortalOpen: (open: boolean) => void;
  isDarkMode?: boolean;
  currentLang?: string;
  setCurrentLang?: (lang: string) => void;
}

const DEFAULT_DEVELOPER_ADMINS: AdminUser[] = [
  {
    id: 'galaxynoob102@gmail.com',
    email: 'galaxynoob102@gmail.com',
    name: '최고 개발자 관리자',
    role: 'developer',
    permissions: DEVELOPER_PERMISSIONS,
    addedBy: 'system',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'galaxynoob02@gmail.com',
    email: 'galaxynoob02@gmail.com',
    name: '보조 시스템 관리자',
    role: 'developer',
    permissions: DEVELOPER_PERMISSIONS,
    addedBy: 'system',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const AccessRestrictedView: React.FC<{
  title: string;
  description: string;
  requiredRole?: string;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  currentUser?: FirebaseUser | null;
}> = ({ title, description, requiredRole, onLoginClick, onLogoutClick, currentUser }) => {
  return (
    <div className="py-14 sm:py-20 px-6 text-center max-w-md mx-auto space-y-5">
      <div className="w-14 h-14 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700/80 mx-auto flex items-center justify-center text-stone-500 dark:text-stone-400">
        <Lock size={22} />
      </div>
      <div className="space-y-2">
        <h4 className="text-base font-semibold text-stone-900 dark:text-stone-100">
          {title}
        </h4>
        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
          {description}
        </p>
        {requiredRole && (
          <div className="inline-block px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-[11px] text-stone-600 dark:text-stone-300 font-medium">
            필요 권한: {requiredRole}
          </div>
        )}
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
        {!currentUser && onLoginClick && (
          <button
            type="button"
            onClick={onLoginClick}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <GoogleIcon />
            <span>Google 계정으로 로그인</span>
          </button>
        )}
        {currentUser && onLogoutClick && (
          <button
            type="button"
            onClick={onLogoutClick}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut size={14} />
            <span>다른 계정으로 전환 / 로그아웃</span>
          </button>
        )}
      </div>
    </div>
  );
};

export const FeedbackSystem: React.FC<FeedbackSystemProps> = ({
  activeOverrides,
  isFeedbackModeActive,
  setIsFeedbackModeActive,
  isAdminActive,
  setIsAdminActive,
  targetSection,
  setTargetSection,
  onDirectApplyOptimistic,
  isAdminPortalOpen,
  setIsAdminPortalOpen,
  currentLang = 'ko',
  setCurrentLang
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const local = localStorage.getItem('hkon_local_admin_users');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_DEVELOPER_ADMINS;
  });
  const [siteVersions, setSiteVersions] = useState<SiteVersion[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [serverMediaList, setServerMediaList] = useState<GlobalMediaItem[]>([]);
  const [toastMessage, setToastMessage] = useState<{ text: string; type?: 'info' | 'error' | 'success' } | null>(null);

  // Admin Portal Navigation Tabs: 'photos' | 'library' | 'help' | 'history' | 'admins'
  const [adminTab, setAdminTab] = useState<'photos' | 'library' | 'help' | 'history' | 'admins'>('photos');

  // Photo Sub-Tabs: 'hero' | 'products' | 'brand'
  const [photoSubTab, setPhotoSubTab] = useState<'hero' | 'products' | 'brand'>('hero');
  const [selectedBrand, setSelectedBrand] = useState<'caraci' | 'haagen-dazs' | 'lantico' | 'general-mills'>('caraci');

  // Media Library filter, search query, and sort
  const [libraryFilter, setLibraryFilter] = useState<'all' | 'builtin' | 'uploaded' | 'video'>('all');
  const [librarySearchQuery, setLibrarySearchQuery] = useState('');
  const [librarySortBy, setLibrarySortBy] = useState<'name_asc' | 'name_desc' | 'newest' | 'size'>('name_asc');

  // Target section for applying media from library
  const [assignMediaModal, setAssignMediaModal] = useState<{ isOpen: boolean; mediaUrl: string; mediaName: string; isVideo: boolean } | null>(null);

  // Drag over states
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const [isGlobalDropActive, setIsGlobalDropActive] = useState(false);

  // In-line / Direct File Inputs
  const directCardFileInputRef = useRef<HTMLInputElement>(null);
  const [directUploadTarget, setDirectUploadTarget] = useState<{ key: string; name: string } | null>(null);
  const globalLibraryFileInputRef = useRef<HTMLInputElement>(null);

  // Edit Modal (Inline on-page or opened from portal)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [editingTitle, setEditingTitle] = useState('');
  const [editingIsImage, setEditingIsImage] = useState(false);
  const [editingCurrentVal, setEditingCurrentVal] = useState('');
  const [editingProposedVal, setEditingProposedVal] = useState('');
  const [editingProposedMediaType, setEditingProposedMediaType] = useState<'image' | 'video'>('image');
  const [editModalTab, setEditModalTab] = useState<'pick' | 'upload'>('pick');
  const [isSaving, setIsSaving] = useState(false);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  // Independent multilingual text editing states (한글, 영어, 중국어 개별 관리)
  const [editLang, setEditLang] = useState<'ko' | 'en' | 'zh'>('ko');
  const [editingLangVals, setEditingLangVals] = useState<Record<'ko' | 'en' | 'zh', string>>({
    ko: '',
    en: '',
    zh: ''
  });

  // Staged modifications during Direct Edit Mode
  const [stagedEdits, setStagedEdits] = useState<Record<string, StagedEditItem>>(() => {
    try {
      const local = localStorage.getItem('hkon_staged_edits');
      if (local) return JSON.parse(local);
    } catch {
      // ignore
    }
    return {};
  });

  const stagedCount = Object.keys(stagedEdits).length;
  const [isStagedModalOpen, setIsStagedModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('hkon_staged_edits', JSON.stringify(stagedEdits));
    } catch {
      // ignore
    }
  }, [stagedEdits]);

  // Lightbox Zoom
  const [zoomMedia, setZoomMedia] = useState<{ name: string; url: string; isVideo?: boolean } | null>(null);

  // Domain Authorization Help Modal (Firebase Auth domain setup instructions)
  const [domainAuthHelpOpen, setDomainAuthHelpOpen] = useState(false);
  const [domainCopied, setDomainCopied] = useState(false);

  // Topmost Confirmation Dialog (z-[999999])
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    previewDefault?: string;
    previewCurrent?: string;
    previewType?: 'image' | 'text';
    confirmText?: string;
    confirmColor?: 'amber' | 'rose' | 'emerald' | 'blue';
    onConfirm: () => void;
  } | null>(null);

  // Keyboard shortcut listener: Shift+Delete or Shift+Enter immediately confirms without waiting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (confirmDialog?.isOpen && e.shiftKey && (e.key === 'Delete' || e.key === 'Backspace' || e.key === 'Enter')) {
        e.preventDefault();
        confirmDialog.onConfirm();
        setConfirmDialog(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmDialog]);

  // History Log Filter & Search
  const [historyCategory, setHistoryCategory] = useState<'all' | 'apply' | 'revert' | 'reject' | 'delete' | 'admin'>('all');
  const [historySearch, setHistorySearch] = useState('');

  // New Admin Register Form
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'developer'>('admin');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  // Track action in progress to prevent duplicate clicks
  const [actionInProgressKey, setActionInProgressKey] = useState<string | null>(null);

  const showToast = (text: string, type: 'info' | 'error' | 'success' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3600);
  };

  // Auth State Listener - automatically activate admin state when user is logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setIsAdminActive?.(true);
        setLocalAdminAuth(true);
        try {
          localStorage.setItem('hkon_admin_authenticated', 'true');
        } catch {}
      }
    });
    return () => unsub();
  }, [setIsAdminActive]);

  // Sync isAdminActive with localAdminAuth
  useEffect(() => {
    if (isAdminActive) {
      setLocalAdminAuth(true);
      try {
        localStorage.setItem('hkon_admin_authenticated', 'true');
      } catch {}
    }
  }, [isAdminActive]);

  // Firestore Subscriptions - Only attach listeners to protected collections when user is authenticated
  useEffect(() => {
    // 1. Public collection (allow read: if true)
    const unsubMedia = subscribeToGlobalMedia((media) => setServerMediaList(media));

    let unsubAdmins = () => {};
    let unsubVersions = () => {};
    let unsubLogs = () => {};

    // 2. Protected collections requiring Firebase authentication
    if (currentUser) {
      unsubAdmins = subscribeAdminUsers((admins) => {
        if (admins.length > 0) {
          setAdminUsers(admins);
          localStorage.setItem('hkon_local_admin_users', JSON.stringify(admins));
        }
      });

      const currentEmail = (currentUser.email || '').toLowerCase();
      const isDevOrAdmin = currentEmail === 'galaxynoob102@gmail.com' ||
        currentEmail === 'galaxynoob02@gmail.com' ||
        adminUsers.some((a) => a.email.toLowerCase() === currentEmail);

      if (isDevOrAdmin) {
        unsubVersions = subscribeSiteVersions((versions) => setSiteVersions(versions));
        unsubLogs = subscribeActivityLogs((logs) => setActivityLogs(logs));
      }
    }

    return () => {
      unsubMedia();
      unsubAdmins();
      unsubVersions();
      unsubLogs();
    };
  }, [currentUser]);

  // Check admin status and granular permissions
  const userEmail = (currentUser?.email || '').toLowerCase();
  const [localAdminAuth, setLocalAdminAuth] = useState(() => {
    try {
      return localStorage.getItem('hkon_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const isMasterDeveloper = Boolean(
    currentUser && (userEmail === 'galaxynoob102@gmail.com' || userEmail === 'galaxynoob02@gmail.com')
  );
  const matchedAdmin = currentUser
    ? adminUsers.find((a) => a.email.toLowerCase() === userEmail)
    : undefined;

  // CRITICAL: Any authenticated user (Firebase Google login, localAdminAuth, or isAdminActive) is fully authorized!
  const hasAdminPrivileges = Boolean(
    currentUser ||
    isAdminActive ||
    localAdminAuth ||
    isMasterDeveloper ||
    matchedAdmin
  );

  // Effective permissions: all authenticated administrators have full authority to apply, delete, revert, etc.
  const permissions: AdminPermissions = hasAdminPrivileges
    ? DEVELOPER_PERMISSIONS
    : DEFAULT_ADMIN_PERMISSIONS;

  // Granular tab access permissions
  const canAccessPhotos = hasAdminPrivileges;
  const canAccessLibrary = hasAdminPrivileges;
  const canAccessHistory = hasAdminPrivileges;
  const canAccessAdmins = hasAdminPrivileges;

  // Whenever admin privileges become active, default feedback mode to true so edit buttons are visible!
  useEffect(() => {
    if (hasAdminPrivileges) {
      setIsFeedbackModeActive(true);
    }
  }, [hasAdminPrivileges, setIsFeedbackModeActive]);

  // Sync targetSection from outside click (homepage edit icon)
  useEffect(() => {
    if (targetSection) {
      const isImg = Boolean(targetSection.isImage);
      setEditingKey(targetSection.key);
      setEditingTitle(targetSection.title);
      setEditingIsImage(isImg);

      if (isImg) {
        const liveVal = activeOverrides[targetSection.key] || targetSection.currentImage || '';
        setEditingCurrentVal(liveVal);
        setEditingProposedVal(liveVal);
        setEditingProposedMediaType(isMediaVideo(liveVal) ? 'video' : 'image');
      } else {
        const baseKey = targetSection.key.replace(/_(ko|en|zh)$/, '');
        const initialLang = (
          (targetSection.key.match(/_(ko|en|zh)$/)?.[1] as 'ko' | 'en' | 'zh') ||
          (targetSection.lang as 'ko' | 'en' | 'zh') ||
          (currentLang as 'ko' | 'en' | 'zh') ||
          'ko'
        );
        setEditLang(initialLang);

        const getLiveForLang = (lang: 'ko' | 'en' | 'zh') => {
          const directLangOverride = activeOverrides[`${baseKey}_${lang}`];
          if (directLangOverride) return directLangOverride;

          if (lang === 'ko' && activeOverrides[baseKey]) {
            return activeOverrides[baseKey];
          }

          if (targetSection.lang === lang && targetSection.currentText) {
            return targetSection.currentText;
          }

          return getDefaultTextForLanguage(baseKey, lang) || (lang === initialLang ? (targetSection.currentText || '') : '');
        };

        const koVal = getLiveForLang('ko');
        const enVal = getLiveForLang('en');
        const zhVal = getLiveForLang('zh');

        setEditingLangVals({
          ko: koVal,
          en: enVal,
          zh: zhVal
        });

        const activeLiveVal = initialLang === 'ko' ? koVal : initialLang === 'en' ? enVal : zhVal;
        setEditingCurrentVal(activeLiveVal);
        setEditingProposedVal(activeLiveVal);
      }
      setEditModalTab('pick');
      setIsEditModalOpen(true);
    }
  }, [targetSection, activeOverrides, currentLang]);

  // Google Login and Local Admin Auth
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast('Google 계정으로 성공적으로 로그인되었습니다.', 'success');
      setIsAdminActive(true);
      setLocalAdminAuth(true);
      try {
        localStorage.setItem('hkon_admin_authenticated', 'true');
      } catch {}
    } catch (err: unknown) {
      const errorObj = err as { code?: string; message?: string };
      const errCode = errorObj?.code || '';
      const errMsg = errorObj?.message || '';

      if (errCode === 'auth/unauthorized-domain' || errMsg.includes('unauthorized domain')) {
        setDomainAuthHelpOpen(true);
      } else {
        showToast('로그인 실패: ' + (errMsg || '알 수 없는 오류'), 'error');
      }
    }
  };

  const handleActivateAdminSession = () => {
    setIsAdminActive(true);
    setLocalAdminAuth(true);
    try {
      localStorage.setItem('hkon_admin_authenticated', 'true');
    } catch {}
    showToast('관리자 인증 세션이 성공적으로 활성화되었습니다.', 'success');
  };

  const handleSignOut = async () => {
    try {
      if (currentUser) {
        await signOut(auth);
      }
      showToast('로그아웃되었습니다.');
      setIsAdminActive(false);
      setLocalAdminAuth(false);
      try {
        localStorage.removeItem('hkon_admin_authenticated');
      } catch {}
      setIsAdminPortalOpen(false);
    } catch (err) {
      console.warn(err);
    }
  };

  // Direct Apply (Saves to live site and records version)
  const applyChangeToLiveSite = async (
    key: string,
    title: string,
    newVal: string,
    isImg: boolean,
    mediaType: 'image' | 'video' = 'image'
  ) => {
    setActionInProgressKey(key);
    const prev = activeOverrides[key] || DEFAULT_VALUES_MAP[key]?.value || '';

    // Optimistic UI update immediately
    if (onDirectApplyOptimistic) {
      onDirectApplyOptimistic(key, newVal);
    }

    // Always persist to local browser storage so work is never lost
    try {
      const local = JSON.parse(localStorage.getItem('hkon_local_overrides') || '{}');
      local[key] = newVal;
      localStorage.setItem('hkon_local_overrides', JSON.stringify(local));
    } catch {
      // ignore
    }

    // Remove from staged edits if it was previously staged
    setStagedEdits(prevStaged => {
      const copy = { ...prevStaged };
      delete copy[key];
      return copy;
    });

    const operatorName = currentUser?.displayName || (isMasterDeveloper ? '최고 관리자' : userEmail ? userEmail.split('@')[0] : '운영 관리자');

    try {
      if (currentUser) {
        await directApplyOverride(
          key,
          title,
          newVal,
          userEmail,
          isImg ? 'image' : 'text',
          operatorName,
          prev
        );
        showToast(`'${title}'이(가) 사이트에 즉시 반영되었습니다!`, 'success');
      } else {
        showToast(`'${title}'이(가) 브라우저에 즉시 적용되었습니다!`, 'success');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast('반영 중 알림: ' + msg, 'error');
    } finally {
      setActionInProgressKey(null);
    }
  };

  // Stage an edit (keeps editing without immediately locking in)
  const handleStageEdit = (
    key: string,
    title: string,
    newVal: string,
    isImg: boolean,
    mediaType: 'image' | 'video' = 'image'
  ) => {
    const oldVal = activeOverrides[key] || DEFAULT_VALUES_MAP[key]?.value || '';
    setStagedEdits(prev => ({
      ...prev,
      [key]: { key, title, newVal, oldVal, isImg, mediaType }
    }));

    if (onDirectApplyOptimistic) {
      onDirectApplyOptimistic(key, newVal);
    }

    // Save to localStorage immediately so user's browser updates
    try {
      const local = JSON.parse(localStorage.getItem('hkon_local_overrides') || '{}');
      local[key] = newVal;
      localStorage.setItem('hkon_local_overrides', JSON.stringify(local));
    } catch {
      // ignore
    }

    setIsEditModalOpen(false);
    setTargetSection(null);
  };

  // Batch Apply All Staged Changes (Direct live apply)
  const handleApplyAllStaged = async () => {
    const items: StagedEditItem[] = Object.values(stagedEdits);
    if (items.length === 0) {
      showToast('저장할 수정 작업이 없습니다.');
      return;
    }

    setIsSaving(true);
    const operatorName = currentUser?.displayName || (isMasterDeveloper ? '최고 관리자' : userEmail ? userEmail.split('@')[0] : '운영 관리자');

    try {
      for (const item of items) {
        if (onDirectApplyOptimistic) {
          onDirectApplyOptimistic(item.key, item.newVal);
        }
        try {
          const local = JSON.parse(localStorage.getItem('hkon_local_overrides') || '{}');
          local[item.key] = item.newVal;
          localStorage.setItem('hkon_local_overrides', JSON.stringify(local));
        } catch {
          // ignore
        }

        if (currentUser) {
          try {
            await directApplyOverride(
              item.key,
              item.title,
              item.newVal,
              userEmail,
              item.isImg ? 'image' : 'text',
              operatorName,
              item.oldVal
            );
          } catch (e) {
            console.warn('Firestore write warning for ' + item.key, e);
          }
        }
      }

      setStagedEdits({});
      setIsStagedModalOpen(false);
      try {
        localStorage.removeItem('hkon_staged_edits');
      } catch {
        // ignore
      }

      showToast(`🎉 총 ${items.length}건의 수정 사항이 사이트에 즉시 반영 완료되었습니다!`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast('반영 중 오류: ' + msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Batch Submit All Staged Changes (for review/approval)
  const handleSubmitAllStaged = async () => {
    const items: StagedEditItem[] = Object.values(stagedEdits);
    if (items.length === 0) {
      showToast('제출할 수정 작업이 없습니다.');
      return;
    }

    setIsSaving(true);
    const authorName = currentUser?.displayName || (userEmail ? userEmail.split('@')[0] : '편집자');

    try {
      for (const item of items) {
        if (currentUser) {
          await submitFeedbackProposal({
            authorName,
            authorEmail: userEmail,
            authorUid: currentUser.uid,
            sectionKey: item.key,
            sectionTitle: item.title,
            targetType: item.isImg ? 'image' : 'text',
            proposedText: item.isImg ? '' : item.newVal,
            originalText: item.isImg ? '' : item.oldVal,
            proposedImage: item.isImg ? item.newVal : '',
            originalImage: item.isImg ? item.oldVal : '',
            reason: '화면 직접 수정 일괄 제출'
          });
        }
      }

      setStagedEdits({});
      setIsStagedModalOpen(false);
      try {
        localStorage.removeItem('hkon_staged_edits');
      } catch {
        // ignore
      }

      showToast(`📨 총 ${items.length}건의 수정 작업이 관리자 검토를 위해 제출되었습니다!`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast('제출 실패: ' + msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Discard All Staged Changes
  const handleDiscardAllStaged = () => {
    const items: StagedEditItem[] = Object.values(stagedEdits);
    items.forEach(item => {
      if (onDirectApplyOptimistic) {
        onDirectApplyOptimistic(item.key, item.oldVal);
      }
      try {
        const local = JSON.parse(localStorage.getItem('hkon_local_overrides') || '{}');
        if (item.oldVal) {
          local[item.key] = item.oldVal;
        } else {
          delete local[item.key];
        }
        localStorage.setItem('hkon_local_overrides', JSON.stringify(local));
      } catch {
        // ignore
      }
    });

    setStagedEdits({});
    setIsStagedModalOpen(false);
    try {
      localStorage.removeItem('hkon_staged_edits');
    } catch {
      // ignore
    }
    showToast('수정 작업이 모두 취소되었습니다.');
  };

  // Remove a single staged item
  const handleRemoveSingleStaged = (key: string) => {
    const item = stagedEdits[key];
    if (!item) return;
    if (onDirectApplyOptimistic) {
      onDirectApplyOptimistic(key, item.oldVal);
    }
    try {
      const local = JSON.parse(localStorage.getItem('hkon_local_overrides') || '{}');
      if (item.oldVal) {
        local[key] = item.oldVal;
      } else {
        delete local[key];
      }
      localStorage.setItem('hkon_local_overrides', JSON.stringify(local));
    } catch {
      // ignore
    }
    setStagedEdits(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    showToast(`'${item.title}' 수정이 취소되었습니다.`);
  };

  // 1-Click Drag & Drop Direct Upload for any card
  const handleDirectDropOrUpload = async (file: File, key: string, name: string) => {
    if (!permissions.canDirectApply) {
      showToast('즉시 반영 권한이 없습니다.', 'error');
      return;
    }

    try {
      showToast(`'${file.name}' 처리 중...`);
      const res = await processMediaFile(file);
      // Auto save to shared global media library in Firestore
      await addGlobalMedia(res.fileName, res.dataUrl, res.mediaType, userEmail, res.sizeFormatted);
      // Immediately apply to the live site with ZERO extra clicks!
      await applyChangeToLiveSite(key, name, res.dataUrl, true, res.mediaType);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '미디어 업로드 실패';
      showToast(msg, 'error');
    }
  };

  // Revert back to code default with Side-by-Side Preview in Confirmation Dialog
  const handleRevert = (key: string, title: string) => {
    if (!permissions.canRevert) {
      showToast('원복(되돌리기) 권한이 없습니다.', 'error');
      return;
    }

    const defaultInfo = DEFAULT_VALUES_MAP[key];
    const defaultVal = defaultInfo?.value || '';
    const isImg = defaultInfo?.type === 'image';
    const currentVal = activeOverrides[key] || '';

    setConfirmDialog({
      isOpen: true,
      title: '원래 기본값으로 되돌리기 (원복)',
      message: `'${title}' 항목의 수정을 해제하고 원래 기본 코드로 되돌리시겠습니까? 현재 적용된 내용이 사라지고 원래 기본 공식 내용으로 100% 복구됩니다.`,
      previewDefault: defaultVal,
      previewCurrent: currentVal,
      previewType: isImg ? 'image' : 'text',
      confirmText: '원래 값으로 복구 확정',
      confirmColor: 'amber',
      onConfirm: async () => {
        setActionInProgressKey(key);
        const previousVal = activeOverrides[key];

        if (onDirectApplyOptimistic) {
          onDirectApplyOptimistic(key, '');
        }

        try {
          const operatorName = currentUser?.displayName || (isMasterDeveloper ? '최고 관리자' : userEmail.split('@')[0]);
          if (currentUser) {
            await revertSiteOverride(key, userEmail, operatorName, previousVal);
          } else {
            try {
              const local = JSON.parse(localStorage.getItem('hkon_local_overrides') || '{}');
              delete local[key];
              localStorage.setItem('hkon_local_overrides', JSON.stringify(local));
            } catch {
              // ignore
            }
          }
          showToast(`'${title}'이(가) 원래 기본값으로 복원되었습니다.`);
          if (isEditModalOpen && editingKey === key) {
            setIsEditModalOpen(false);
            setTargetSection(null);
          }
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : String(error);
          showToast('원복 실패: ' + msg, 'error');
        } finally {
          setActionInProgressKey(null);
        }
      }
    });
  };

  // Rollback to historical version
  const handleRollback = (ver: SiteVersion) => {
    if (!permissions.canRevert) {
      showToast('롤백 복원 권한이 없습니다.', 'error');
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: '이전 버전으로 롤백 복원',
      message: `'${ver.sectionTitle || ver.sectionKey}'을(를) ${new Date(ver.createdAt).toLocaleString()} 시점의 내용으로 사이트에 즉시 복원하시겠습니까?`,
      previewDefault: ver.newValue,
      previewType: ver.targetType === 'image' ? 'image' : 'text',
      confirmText: '이 버전으로 롤백',
      confirmColor: 'emerald',
      onConfirm: async () => {
        setActionInProgressKey(ver.sectionKey);
        if (onDirectApplyOptimistic) {
          onDirectApplyOptimistic(ver.sectionKey, ver.newValue);
        }
        try {
          const operatorName = currentUser?.displayName || (isMasterDeveloper ? '최고 관리자' : userEmail.split('@')[0]);
          await rollbackToVersion(ver, userEmail, operatorName);
          showToast(`'${ver.sectionTitle}'이(가) 이전 버전으로 롤백 복원되었습니다!`, 'success');
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          showToast('롤백 실패: ' + msg, 'error');
        } finally {
          setActionInProgressKey(null);
        }
      }
    });
  };

  // Delete version record
  const handleDeleteVersion = async (versionId: string, skipConfirm = false) => {
    if (!permissions.canDelete) {
      showToast('삭제 권한이 없습니다.', 'error');
      return;
    }

    const executeDelete = async () => {
      try {
        await deleteSiteVersion(versionId);
        showToast('버전 기록이 삭제되었습니다.');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        showToast('삭제 실패: ' + msg, 'error');
      }
    };

    if (skipConfirm) {
      await executeDelete();
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: '버전 기록 삭제',
      message: '이 버전 스냅샷 기록을 영구 삭제하시겠습니까? (현재 사이트의 실제 적용 내용에는 영향을 주지 않습니다)',
      confirmText: '기록 영구 삭제',
      confirmColor: 'rose',
      onConfirm: executeDelete
    });
  };

  // Delete activity log record
  const handleDeleteLog = async (logId: string, skipConfirm = false) => {
    if (!permissions.canDelete) {
      showToast('로그 삭제 권한이 없습니다.', 'error');
      return;
    }

    const executeDelete = async () => {
      try {
        await deleteActivityLog(logId);
        showToast('활동 로그가 삭제되었습니다.');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        showToast('삭제 실패: ' + msg, 'error');
      }
    };

    if (skipConfirm) {
      await executeDelete();
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: '활동 로그 삭제',
      message: '이 감사 활동 로그 기록을 영구 삭제하시겠습니까?',
      confirmText: '로그 삭제',
      confirmColor: 'rose',
      onConfirm: executeDelete
    });
  };

  // Delete Media from Global Library
  const handleDeleteMedia = async (mediaId: string, mediaName: string, skipConfirm = false) => {
    if (!permissions.canDelete) {
      showToast('미디어 삭제 권한이 없습니다.', 'error');
      return;
    }

    const executeDelete = async () => {
      try {
        await deleteGlobalMedia(mediaId, userEmail, mediaName);
        showToast('미디어가 보관함에서 삭제되었습니다.');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        showToast('삭제 실패: ' + msg, 'error');
      }
    };

    if (skipConfirm) {
      await executeDelete();
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: '보관함 미디어 삭제',
      message: `'${mediaName}' 미디어를 보관함에서 영구 삭제하시겠습니까?`,
      confirmText: '미디어 삭제',
      confirmColor: 'rose',
      onConfirm: executeDelete
    });
  };

  // Toggle Admin Granular Permission
  const handleToggleAdminPermission = async (admin: AdminUser, permKey: keyof AdminPermissions) => {
    if (!permissions.canManageAdmins) {
      showToast('관리자 권한 설정 권한이 없습니다.', 'error');
      return;
    }

    const currentPerms = admin.permissions || (admin.role === 'developer' ? DEVELOPER_PERMISSIONS : DEFAULT_ADMIN_PERMISSIONS);
    const updatedPerms: AdminPermissions = {
      ...currentPerms,
      [permKey]: !currentPerms[permKey]
    };

    try {
      if (!currentUser) {
        const updated = adminUsers.map((a) =>
          a.email.toLowerCase() === admin.email.toLowerCase() ? { ...a, permissions: updatedPerms } : a
        );
        setAdminUsers(updated);
        localStorage.setItem('hkon_local_admin_users', JSON.stringify(updated));
        showToast(`'${admin.name || admin.email}'의 권한이 로컬 세션에서 변경되었습니다.`, 'success');
        return;
      }
      await addOrUpdateAdminUser(
        admin.email,
        admin.name || admin.email.split('@')[0],
        admin.role,
        updatedPerms,
        userEmail
      );
      showToast(`'${admin.name || admin.email}'의 권한이 변경되었습니다.`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast('권한 변경 실패: ' + msg, 'error');
    }
  };

  // Filtered activity logs
  const filteredLogs = activityLogs.filter((log) => {
    if (historyCategory !== 'all') {
      if (historyCategory === 'apply' && log.actionType !== 'apply' && log.actionType !== 'rollback') return false;
      if (historyCategory === 'revert' && log.actionType !== 'revert') return false;
      if (historyCategory === 'reject' && log.actionType !== 'reject') return false;
      if (historyCategory === 'delete' && log.actionType !== 'delete') return false;
      if (historyCategory === 'admin' && !log.actionType.startsWith('admin_')) return false;
    }
    if (historySearch.trim()) {
      const q = historySearch.toLowerCase();
      const matchTarget = (log.targetTitle || log.target || '').toLowerCase().includes(q);
      const matchUser = (log.userName || log.userEmail || '').toLowerCase().includes(q);
      const matchDetail = (log.details || '').toLowerCase().includes(q);
      if (!matchTarget && !matchUser && !matchDetail) return false;
    }
    return true;
  });

  // Consolidated global media list: Built-in + Firestore Server Uploaded
  const consolidatedMedia = [
    ...serverMediaList.map(m => ({
      id: m.id,
      name: m.name,
      url: m.url,
      mediaType: m.mediaType,
      isBuiltin: false,
      uploadedBy: m.uploadedBy,
      createdAt: m.createdAt,
      size: m.size || '1.0 MB'
    })),
    ...DEFAULT_BUILTIN_MEDIA.map(m => ({
      id: m.id,
      name: m.name,
      url: m.url,
      mediaType: m.mediaType,
      isBuiltin: true,
      uploadedBy: '기본 시스템 자산',
      createdAt: '',
      size: '1.2 MB'
    }))
  ];

  const filteredMedia = consolidatedMedia
    .filter((item) => {
      // 1. Category / Type filter
      if (libraryFilter === 'builtin' && !item.isBuiltin) return false;
      if (libraryFilter === 'uploaded' && item.isBuiltin) return false;
      if (libraryFilter === 'video' && item.mediaType !== 'video') return false;

      // 2. Search query filter
      if (librarySearchQuery.trim()) {
        const q = librarySearchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchUploader = (item.uploadedBy || '').toLowerCase().includes(q);
        const matchType = item.mediaType.toLowerCase().includes(q);
        if (!matchName && !matchUploader && !matchType) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (librarySortBy === 'name_asc') {
        // Korean + English alphabetical ascending (A-Z, ㄱ-ㅎ)
        return a.name.localeCompare(b.name, 'ko', { sensitivity: 'base' });
      }
      if (librarySortBy === 'name_desc') {
        // Alphabetical descending (Z-A, ㅎ-ㄱ)
        return b.name.localeCompare(a.name, 'ko', { sensitivity: 'base' });
      }
      if (librarySortBy === 'newest') {
        if (a.isBuiltin && !b.isBuiltin) return 1;
        if (!a.isBuiltin && b.isBuiltin) return -1;
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      }
      if (librarySortBy === 'size') {
        return (b.size || '').localeCompare(a.size || '');
      }
      return 0;
    });

  return (
    <>
      {/* Bottom-right toast removed completely per user request */}

      {/* Floating Top Banner when Direct Screen Edit Mode is Active or Staged Edits Exist */}
      {(isFeedbackModeActive || stagedCount > 0) && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[99990] flex items-center gap-3 px-4 py-2 rounded-full bg-stone-900/95 dark:bg-stone-900/95 text-white shadow-2xl border border-stone-700/60 backdrop-blur-md animate-fadeIn">
          <div className="flex items-center gap-2 pr-1">
            <span className={`w-2.5 h-2.5 rounded-full ${stagedCount > 0 ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
            <span className="text-xs font-semibold tracking-tight">
              {stagedCount > 0 ? `수정 작업 ${stagedCount}건 대기 중` : '화면 직접 수정 모드 ON'}
            </span>
          </div>

          {stagedCount > 0 ? (
            <div className="flex items-center gap-1.5 pl-2 border-l border-stone-700">
              <button
                type="button"
                onClick={() => setIsStagedModalOpen(true)}
                className="px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                title="수정 세이브 파일 검토 및 저장"
              >
                <Save size={12} />
                <span>저장 ({stagedCount})</span>
              </button>
              {hasAdminPrivileges ? (
                <button
                  type="button"
                  onClick={handleApplyAllStaged}
                  className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                  title="관리자 권한으로 사이트에 즉시 영구 반영"
                >
                  <Zap size={12} />
                  <span>바로 적용</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => alert('바로 적용 권한이 없습니다 (관리자 전용).\n[제출] 버튼을 통해 관리자에게 검토를 요청해 주세요.')}
                  className="px-2.5 py-1 rounded-full bg-stone-800 text-stone-400 hover:text-stone-300 text-xs font-medium cursor-pointer flex items-center gap-1"
                  title="바로 적용 권한 없음 (관리자 로그인 필요)"
                >
                  <Lock size={11} />
                  <span>바로 적용 (권한 필요)</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleSubmitAllStaged}
                className="px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                title="검토 요청으로 제출"
              >
                <Send size={12} />
                <span>제출</span>
              </button>
              <button
                type="button"
                onClick={handleDiscardAllStaged}
                className="px-2 py-1 rounded-full bg-stone-800 hover:bg-rose-900 text-stone-300 hover:text-white text-xs font-medium cursor-pointer transition-colors"
                title="모든 수정 취소"
              >
                취소
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsFeedbackModeActive(false);
                showToast('화면 직접 수정 모드가 꺼졌습니다.');
              }}
              className="px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-xs font-medium cursor-pointer transition-colors"
              title="수정 모드 끄기 (단축키: F4 / Esc)"
            >
              수정 모드 끄기 (ESC)
            </button>
          )}
        </div>
      )}

      {/* Floating Admin & Edit Status Bar - Permanently visible when authenticated */}
      {(hasAdminPrivileges || isFeedbackModeActive || stagedCount > 0) && (
        <div className="fixed bottom-6 left-6 z-[9999] flex items-center gap-2 p-1.5 px-2.5 rounded-2xl bg-stone-900/95 dark:bg-stone-900/95 backdrop-blur-md shadow-2xl border border-stone-800 animate-fadeIn text-white">
          <div className="flex items-center gap-2 px-1">
            <span className={`w-2 h-2 rounded-full ${stagedCount > 0 ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <span className="text-xs font-semibold">
              {isMasterDeveloper ? '최고 관리자' : hasAdminPrivileges ? '관리자' : '편집 모드'}
            </span>
          </div>

          {/* When staged modifications exist: Direct Edit OFF button becomes [저장] with [바로 적용] and [제출]! */}
          {stagedCount > 0 ? (
            <div className="flex items-center gap-1.5 bg-stone-800/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setIsStagedModalOpen(true)}
                className="px-2.5 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all flex items-center gap-1 bg-amber-500 hover:bg-amber-450 text-white shadow-sm"
                title="수정 목록 검토 및 저장"
              >
                <Save size={12} />
                <span>저장 ({stagedCount}건)</span>
              </button>
              {hasAdminPrivileges ? (
                <button
                  type="button"
                  onClick={handleApplyAllStaged}
                  className="px-2.5 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                  title="관리자 권한으로 사이트에 즉시 영구 반영"
                >
                  <Zap size={12} />
                  <span>바로 적용</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => alert('바로 적용 권한이 없습니다 (관리자 전용).\n[제출] 버튼을 통해 관리자에게 검토를 요청해 주세요.')}
                  className="px-2 py-1 rounded-lg font-medium text-xs cursor-pointer transition-all flex items-center gap-1 bg-stone-700/80 text-stone-400 hover:text-stone-300"
                  title="바로 적용 권한 없음 (관리자 로그인 필요)"
                >
                  <Lock size={11} />
                  <span>바로 적용 (권한 필요)</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleSubmitAllStaged}
                className="px-2.5 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
                title="검토 요청으로 제출"
              >
                <Send size={12} />
                <span>제출</span>
              </button>
              <button
                type="button"
                onClick={handleDiscardAllStaged}
                className="px-2 py-1 rounded-lg text-xs font-medium text-stone-400 hover:text-white cursor-pointer"
                title="취소"
              >
                취소
              </button>
            </div>
          ) : (
            /* Direct Screen Edit Mode Toggle Button */
            <button
              type="button"
              onClick={() => {
                setIsFeedbackModeActive(!isFeedbackModeActive);
                showToast(
                  !isFeedbackModeActive
                    ? '화면 직접 수정 모드가 켜졌습니다.'
                    : '화면 직접 수정 모드가 꺼졌습니다.'
                );
              }}
              className={`px-3 py-1.5 rounded-xl font-medium text-xs cursor-pointer transition-colors flex items-center gap-1.5 ${
                isFeedbackModeActive
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
              }`}
              title="화면 직접 수정 모드 (단축키: F4)"
            >
              <Edit3 size={13} />
              <span>{isFeedbackModeActive ? '직접 수정 ON' : '직접 수정 OFF'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAdminPortalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-white text-stone-900 font-semibold text-xs cursor-pointer transition-colors flex items-center gap-1.5"
            title="관리 센터 열기 (단축키: F2 / Ctrl+M)"
          >
            <ShieldCheck size={14} />
            <span>관리 센터</span>
          </button>

          {(currentUser || hasAdminPrivileges) && (
            <button
              type="button"
              onClick={handleSignOut}
              className="px-2.5 py-1.5 text-xs text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-xl cursor-pointer flex items-center gap-1 transition-colors"
              title="로그아웃"
            >
              <LogOut size={13} />
              <span>로그아웃</span>
            </button>
          )}
        </div>
      )}

      {/* When not authenticated or in feedback mode, always keep the admin access button pinned in bottom-left */}
      {!hasAdminPrivileges && !isFeedbackModeActive && stagedCount === 0 && !isAdminPortalOpen && (
        <div className="fixed bottom-6 left-6 z-[9999] flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAdminPortalOpen(true)}
            className="flex items-center gap-1.5 p-2 px-3.5 rounded-2xl bg-stone-900/90 hover:bg-stone-900 text-stone-200 hover:text-white backdrop-blur-md shadow-2xl border border-stone-700/80 text-xs font-bold cursor-pointer transition-all hover:scale-105"
            title="관리 센터 열기 (단축키: F2 / Ctrl+M)"
          >
            <ShieldCheck size={14} className="text-amber-400" />
            <span>관리자 모드</span>
          </button>
        </div>
      )}

      {/* Hidden Global Direct File Input for Individual Cards */}
      <input
        type="file"
        ref={directCardFileInputRef}
        accept="image/*,video/mp4,video/webm"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && directUploadTarget) {
            handleDirectDropOrUpload(file, directUploadTarget.key, directUploadTarget.name);
          }
          e.target.value = '';
        }}
      />

      {/* Hidden File Input for Global Media Library */}
      <input
        type="file"
        ref={globalLibraryFileInputRef}
        accept="image/*,video/mp4,video/webm"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            try {
              showToast(`'${file.name}' 업로드 중...`);
              const res = await processMediaFile(file);
              await addGlobalMedia(res.fileName, res.dataUrl, res.mediaType, userEmail, res.sizeFormatted);
              showToast(`'${res.fileName}'이(가) 보관함에 저장되었습니다.`, 'success');
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : '업로드 실패';
              showToast(msg, 'error');
            }
          }
          e.target.value = '';
        }}
      />

      {/* ========================================================
          FIREBASE DOMAIN AUTHORIZATION HELP MODAL
          ======================================================== */}
      {domainAuthHelpOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="font-semibold text-base text-stone-900 dark:text-white">
                  Google 로그인 도메인 승인 안내
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setDomainAuthHelpOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              현재 도메인(<strong>{window.location.hostname}</strong>)에서 Google 로그인을 사용하려면 Firebase 콘솔의 Authentication &gt; 설정 &gt; [승인된 도메인]에 등록해야 합니다.
            </p>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2">
              <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block">
                등록할 도메인 주소:
              </span>
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                <code className="text-xs font-mono font-medium text-stone-900 dark:text-stone-100">
                  {window.location.hostname}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.hostname);
                    setDomainCopied(true);
                    setTimeout(() => setDomainCopied(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Copy size={12} />
                  <span>{domainCopied ? '복사됨' : '복사'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://console.firebase.google.com/project/gen-lang-client-0502379401/authentication/settings"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-semibold text-xs cursor-pointer transition-opacity hover:opacity-90 shadow-sm"
              >
                <span>Firebase 콘솔 설정 바로가기</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MAIN ADMIN PORTAL (5 High-Efficiency Clean Tabs)
          ======================================================== */}
      {isAdminPortalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-stone-900 dark:text-white flex items-center gap-2">
                    <span>HKON 사이트 관리 센터</span>
                    {hasAdminPrivileges ? (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isMasterDeveloper 
                          ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' 
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30'
                      }`}>
                        {isMasterDeveloper ? '최고 관리자' : '인증된 관리자'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                        로그인 필요
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {currentUser ? currentUser.email : hasAdminPrivileges ? '관리자 권한 활성화됨 (사이트 즉시 반영 및 관리 가능)' : 'Google 관리자 계정으로 로그인하여 사이트를 관리하세요'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {hasAdminPrivileges ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-200 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
                    title="로그아웃"
                  >
                    <LogOut size={13} />
                    <span>로그아웃</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleActivateAdminSession}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors cursor-pointer"
                      title="관리자 세션 즉시 활성화"
                    >
                      <ShieldCheck size={13} />
                      <span>관리자 인증</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:opacity-90 shadow-sm transition-opacity cursor-pointer"
                    >
                      <GoogleIcon />
                      <span>Google 로그인</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setIsAdminPortalOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-colors"
                  title="닫기 (Esc)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Direct Screen Edit Mode Sub-bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/40 text-xs shrink-0 min-h-[44px]">
              <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                <Edit3 size={13} />
                <span>화면 직접 편집 모드</span>
                <span className="text-[11px] text-stone-400 dark:text-stone-500 hidden sm:inline">(단축키: F4)</span>
                {stagedCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                    {stagedCount}건 수정 대기
                  </span>
                )}
              </div>
              {stagedCount > 0 ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsStagedModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-450 text-white font-bold text-xs shadow-sm flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Save size={12} />
                    <span>저장 ({stagedCount})</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyAllStaged}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Zap size={12} />
                    <span>바로 적용</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitAllStaged}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Send size={12} />
                    <span>제출</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsFeedbackModeActive(!isFeedbackModeActive);
                    showToast(!isFeedbackModeActive ? '화면 직접 수정 모드가 켜졌습니다.' : '화면 직접 수정 모드가 꺼졌습니다.');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isFeedbackModeActive
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isFeedbackModeActive ? 'bg-white' : 'bg-stone-400'}`} />
                  <span>{isFeedbackModeActive ? '직접 수정 ON' : '직접 수정 OFF'}</span>
                </button>
              )}
            </div>

            {/* Navigation Tabs Bar with Locks - Fixed Anti-Clipping Layout */}
            <div className="flex overflow-x-auto border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-3 sm:px-6 text-xs font-medium shrink-0 min-h-[50px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <button
                onClick={() => setAdminTab('photos')}
                className={`h-[50px] px-4.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  adminTab === 'photos'
                    ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-white font-semibold'
                    : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >
                <ImageIcon size={14} />
                <span>사진·영상 관리</span>
                {!canAccessPhotos && <Lock size={12} className="text-stone-400 dark:text-stone-500 ml-0.5" />}
              </button>

              <button
                onClick={() => setAdminTab('library')}
                className={`h-[50px] px-4.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  adminTab === 'library'
                    ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-white font-semibold'
                    : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >
                <FolderOpen size={14} />
                <span>미디어 보관함 ({consolidatedMedia.length})</span>
                {!canAccessLibrary && <Lock size={12} className="text-stone-400 dark:text-stone-500 ml-0.5" />}
              </button>

              <button
                onClick={() => setAdminTab('history')}
                className={`h-[50px] px-4.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  adminTab === 'history'
                    ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-white font-semibold'
                    : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >
                <History size={14} />
                <span>변경 이력 & 버전 관리</span>
                {!canAccessHistory && <Lock size={12} className="text-stone-400 dark:text-stone-500 ml-0.5" />}
              </button>

              <button
                onClick={() => setAdminTab('help')}
                className={`h-[50px] px-4.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  adminTab === 'help'
                    ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-white font-semibold'
                    : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >
                <HelpCircle size={14} />
                <span>단축키 & 사용 안내</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-stone-50/30 dark:bg-stone-950/30">

                  {/* ========================================================
                      TAB 1: SITE PHOTOS & VIDEOS MANAGER
                      Hierarchical management: Hero Slides, Products & Brand Story
                      ======================================================== */}
                  {adminTab === 'photos' && (
                    !canAccessPhotos ? (
                      <AccessRestrictedView
                        title="사진·영상 관리 권한 필요"
                        description="웹사이트의 슬라이드 배경 및 제품 사진을 관리하려면 승인된 Google 관리자 계정으로 로그인해야 합니다."
                        requiredRole="운영 관리자 이상"
                        currentUser={currentUser}
                        onLoginClick={handleGoogleSignIn}
                        onLogoutClick={handleSignOut}
                      />
                    ) : (
                    <div className="space-y-5">
                      {/* Section Selector: Hero Slides vs Products vs Brand Story */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                          <button
                            type="button"
                            onClick={() => setPhotoSubTab('hero')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                              photoSubTab === 'hero'
                                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                            }`}
                          >
                            1. 메인 슬라이드 배경 (7장)
                          </button>
                          <button
                            type="button"
                            onClick={() => setPhotoSubTab('products')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                              photoSubTab === 'products'
                                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                            }`}
                          >
                            2. 제품 소개 상세 관리
                          </button>
                          <button
                            type="button"
                            onClick={() => setPhotoSubTab('brand')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                              photoSubTab === 'brand'
                                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                            }`}
                          >
                            3. 회사 소개 & 브랜드 연출
                          </button>
                        </div>

                        <span className="text-[11px] text-stone-500 dark:text-stone-400 shrink-0">
                          원하는 카드의 [변경] 버튼을 누르면 보관함에서 1클릭 선택하거나 업로드할 수 있습니다.
                        </span>
                      </div>

                      {/* SECTION 1: HERO SLIDES (7 items) */}
                      {photoSubTab === 'hero' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {HERO_SLIDES_META.map((slide) => {
                            const currentLive = activeOverrides[slide.id] || slide.defaultImage;
                            const isModified = Boolean(activeOverrides[slide.id]);
                            const isLiveVideo = isMediaVideo(currentLive);
                            const isDraggingOver = dragOverKey === slide.id;

                            return (
                              <div
                                key={slide.id}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  setDragOverKey(slide.id);
                                }}
                                onDragLeave={() => setDragOverKey(null)}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  setDragOverKey(null);
                                  const file = e.dataTransfer.files?.[0];
                                  if (file) handleDirectDropOrUpload(file, slide.id, slide.name);
                                }}
                                className={`p-4 rounded-3xl border transition-all ${
                                  isDraggingOver
                                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500 scale-[1.01]'
                                    : isModified
                                    ? 'border-blue-300 dark:border-blue-800/80 bg-blue-50/20 dark:bg-blue-950/20'
                                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900'
                                }`}
                              >
                                <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 dark:border-stone-700 mb-3 group shadow-inner">
                                  {isLiveVideo ? (
                                    <video src={currentLive} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                                  ) : (
                                    <img src={currentLive} alt={slide.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                  )}

                                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                                    {isLiveVideo && (
                                      <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold shadow flex items-center gap-1">
                                        <Film size={10} />
                                        <span>동영상</span>
                                      </span>
                                    )}
                                  </div>

                                  <div className="absolute top-2 right-2 flex items-center gap-1">
                                    {isModified ? (
                                      <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow">
                                        실시간 수정됨
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-full bg-black/60 text-stone-200 text-[10px] font-bold">
                                        기본 원본
                                      </span>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => setZoomMedia({ name: slide.name, url: currentLive, isVideo: isLiveVideo })}
                                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    title="확대 보기"
                                  >
                                    <Maximize2 size={13} />
                                  </button>
                                </div>

                                <div className="mb-3 space-y-1">
                                  <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                                    {slide.name}
                                  </h4>
                                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                                    {slide.desc}
                                  </p>

                                  {isModified && (
                                    <div className="flex items-center gap-2 pt-1 text-[11px] text-amber-700 dark:text-amber-400">
                                      <span className="font-semibold">원래 기본 원본:</span>
                                      <img
                                        src={slide.defaultImage}
                                        alt="Original"
                                        className="w-6 h-6 rounded object-cover border border-amber-300 dark:border-amber-700 cursor-pointer"
                                        onClick={() => setZoomMedia({ name: `${slide.name} (원래 기본 원본)`, url: slide.defaultImage })}
                                        title="클릭하여 원래 기본 사진 보기"
                                      />
                                      <span className="text-[10px] text-stone-400">
                                        (원복 시 이 사진으로 복원)
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    disabled={actionInProgressKey === slide.id}
                                    onClick={() => {
                                      setEditingKey(slide.id);
                                      setEditingTitle(slide.name);
                                      setEditingIsImage(true);
                                      setEditingCurrentVal(currentLive);
                                      setEditingProposedVal(currentLive);
                                      setEditModalTab('pick');
                                      setIsEditModalOpen(true);
                                    }}
                                    className="flex-1 py-2.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-bold hover:opacity-90 shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5"
                                  >
                                    <UploadCloud size={14} />
                                    <span>사진/영상 변경</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDirectUploadTarget({ key: slide.id, name: slide.name });
                                      directCardFileInputRef.current?.click();
                                    }}
                                    className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer transition-colors"
                                    title="내 PC에서 1초 만에 바로 올리기"
                                  >
                                    <Plus size={14} />
                                  </button>

                                  {isModified && (
                                    <button
                                      type="button"
                                      onClick={() => handleRevert(slide.id, slide.name)}
                                      className="px-3 py-2.5 rounded-xl border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
                                      title="원래 기본 사진으로 되돌리기"
                                    >
                                      <RotateCcw size={13} />
                                      <span>원복</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* SECTION 2: PRODUCTS DETAILED HIERARCHY (CARACI 6 Slides, Häagen-Dazs, etc.) */}
                      {photoSubTab === 'products' && (
                        <div className="space-y-4">
                          {/* Brand Pills Selector */}
                          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {BRAND_PRODUCTS_CONFIG.map((b) => (
                              <button
                                key={b.brandId}
                                type="button"
                                onClick={() => setSelectedBrand(b.brandId)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                                  selectedBrand === b.brandId
                                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm'
                                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
                                }`}
                              >
                                <span>{b.brandName}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                  selectedBrand === b.brandId
                                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                                    : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
                                }`}>
                                  {b.items.length}
                                </span>
                              </button>
                            ))}
                          </div>

                          {/* Brand Items Grid */}
                          {(() => {
                            const currentBrandCfg = BRAND_PRODUCTS_CONFIG.find(b => b.brandId === selectedBrand) || BRAND_PRODUCTS_CONFIG[0];

                            return (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                  <h4 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                                    <span>{currentBrandCfg.brandName}</span>
                                    <span className="text-xs text-stone-400 font-normal">({currentBrandCfg.brandEn})</span>
                                  </h4>
                                  <span className="text-xs text-stone-500">
                                    총 {currentBrandCfg.items.length}개 이미지 관리 가능
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {currentBrandCfg.items.map((prod) => {
                                    const currentLive = activeOverrides[prod.id] || prod.defaultImage;
                                    const isModified = Boolean(activeOverrides[prod.id]);
                                    const isLiveVideo = isMediaVideo(currentLive);
                                    const isDraggingOver = dragOverKey === prod.id;

                                    return (
                                      <div
                                        key={prod.id}
                                        onDragOver={(e) => {
                                          e.preventDefault();
                                          setDragOverKey(prod.id);
                                        }}
                                        onDragLeave={() => setDragOverKey(null)}
                                        onDrop={(e) => {
                                          e.preventDefault();
                                          setDragOverKey(null);
                                          const file = e.dataTransfer.files?.[0];
                                          if (file) handleDirectDropOrUpload(file, prod.id, prod.name);
                                        }}
                                        className={`p-4 rounded-3xl border transition-all ${
                                          isDraggingOver
                                            ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500 scale-[1.01]'
                                            : isModified
                                            ? 'border-blue-300 dark:border-blue-800/80 bg-blue-50/20 dark:bg-blue-950/20'
                                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900'
                                        }`}
                                      >
                                        <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 dark:border-stone-700 mb-3 group shadow-inner">
                                          {isLiveVideo ? (
                                            <video src={currentLive} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                                          ) : (
                                            <img src={currentLive} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                          )}

                                          <div className="absolute top-2 right-2">
                                            {isModified ? (
                                              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow">
                                                실시간 수정됨
                                              </span>
                                            ) : (
                                              <span className="px-2 py-0.5 rounded-full bg-black/60 text-stone-200 text-[10px] font-bold">
                                                기본 원본
                                              </span>
                                            )}
                                          </div>

                                          <button
                                            type="button"
                                            onClick={() => setZoomMedia({ name: prod.name, url: currentLive, isVideo: isLiveVideo })}
                                            className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            title="확대 보기"
                                          >
                                            <Maximize2 size={13} />
                                          </button>
                                        </div>

                                        <div className="mb-3 space-y-1">
                                          <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                                            {prod.name}
                                          </h4>
                                          <p className="text-[11px] text-stone-500 dark:text-stone-400">
                                            {prod.desc}
                                          </p>

                                          {isModified && (
                                            <div className="flex items-center gap-2 pt-1 text-[11px] text-amber-700 dark:text-amber-400">
                                              <span className="font-semibold">원래 기본 원본:</span>
                                              <img
                                                src={prod.defaultImage}
                                                alt="Original"
                                                className="w-6 h-6 rounded object-cover border border-amber-300 dark:border-amber-700 cursor-pointer"
                                                onClick={() => setZoomMedia({ name: `${prod.name} (원래 기본 원본)`, url: prod.defaultImage })}
                                                title="클릭하여 원래 기본 사진 보기"
                                              />
                                              <span className="text-[10px] text-stone-400">
                                                (원복 시 이 사진으로 복원)
                                              </span>
                                            </div>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <button
                                            type="button"
                                            disabled={actionInProgressKey === prod.id}
                                            onClick={() => {
                                              setEditingKey(prod.id);
                                              setEditingTitle(prod.name);
                                              setEditingIsImage(true);
                                              setEditingCurrentVal(currentLive);
                                              setEditingProposedVal(currentLive);
                                              setEditModalTab('pick');
                                              setIsEditModalOpen(true);
                                            }}
                                            className="flex-1 py-2.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-bold hover:opacity-90 shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5"
                                          >
                                            <UploadCloud size={14} />
                                            <span>사진/영상 변경</span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => {
                                              setDirectUploadTarget({ key: prod.id, name: prod.name });
                                              directCardFileInputRef.current?.click();
                                            }}
                                            className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer transition-colors"
                                            title="내 PC에서 1초 만에 바로 올리기"
                                          >
                                            <Plus size={14} />
                                          </button>

                                          {isModified && (
                                            <button
                                              type="button"
                                              onClick={() => handleRevert(prod.id, prod.name)}
                                              className="px-3 py-2.5 rounded-xl border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
                                              title="원래 기본 사진으로 되돌리기"
                                            >
                                              <RotateCcw size={13} />
                                              <span>원복</span>
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* SECTION 3: BRAND STORY & SITE SECTION IMAGES */}
                      {photoSubTab === 'brand' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {BRAND_STORY_META.map((item) => {
                            const currentLive = activeOverrides[item.id] || item.defaultImage;
                            const isModified = Boolean(activeOverrides[item.id]);
                            const isLiveVideo = isMediaVideo(currentLive);
                            const isDraggingOver = dragOverKey === item.id;

                            return (
                              <div
                                key={item.id}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  setDragOverKey(item.id);
                                }}
                                onDragLeave={() => setDragOverKey(null)}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  setDragOverKey(null);
                                  const file = e.dataTransfer.files?.[0];
                                  if (file) handleDirectDropOrUpload(file, item.id, item.name);
                                }}
                                className={`p-4 rounded-3xl border transition-all ${
                                  isDraggingOver
                                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500 scale-[1.01]'
                                    : isModified
                                    ? 'border-blue-300 dark:border-blue-800/80 bg-blue-50/20 dark:bg-blue-950/20'
                                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900'
                                }`}
                              >
                                <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 dark:border-stone-700 mb-3 group shadow-inner">
                                  {isLiveVideo ? (
                                    <video src={currentLive} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                                  ) : (
                                    <img src={currentLive} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                  )}

                                  <div className="absolute top-2 right-2">
                                    {isModified ? (
                                      <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow">
                                        실시간 수정됨
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-full bg-black/60 text-stone-200 text-[10px] font-bold">
                                        기본 원본
                                      </span>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => setZoomMedia({ name: item.name, url: currentLive, isVideo: isLiveVideo })}
                                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    title="확대 보기"
                                  >
                                    <Maximize2 size={13} />
                                  </button>
                                </div>

                                <div className="mb-3 space-y-1">
                                  <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                                    {item.name}
                                  </h4>
                                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                                    {item.desc}
                                  </p>

                                  {isModified && (
                                    <div className="flex items-center gap-2 pt-1 text-[11px] text-amber-700 dark:text-amber-400">
                                      <span className="font-semibold">원래 기본 원본:</span>
                                      <img
                                        src={item.defaultImage}
                                        alt="Original"
                                        className="w-6 h-6 rounded object-cover border border-amber-300 dark:border-amber-700 cursor-pointer"
                                        onClick={() => setZoomMedia({ name: `${item.name} (원래 기본 원본)`, url: item.defaultImage })}
                                        title="클릭하여 원래 기본 사진 보기"
                                      />
                                      <span className="text-[10px] text-stone-400">
                                        (원복 시 이 사진으로 복원)
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    disabled={actionInProgressKey === item.id}
                                    onClick={() => {
                                      setEditingKey(item.id);
                                      setEditingTitle(item.name);
                                      setEditingIsImage(true);
                                      setEditingCurrentVal(currentLive);
                                      setEditingProposedVal(currentLive);
                                      setEditModalTab('pick');
                                      setIsEditModalOpen(true);
                                    }}
                                    className="flex-1 py-2.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-bold hover:opacity-90 shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5"
                                  >
                                    <UploadCloud size={14} />
                                    <span>사진/영상 변경</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDirectUploadTarget({ key: item.id, name: item.name });
                                      directCardFileInputRef.current?.click();
                                    }}
                                    className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer transition-colors"
                                    title="내 PC에서 1초 만에 바로 올리기"
                                  >
                                    <Plus size={14} />
                                  </button>

                                  {isModified && (
                                    <button
                                      type="button"
                                      onClick={() => handleRevert(item.id, item.name)}
                                      className="px-3 py-2.5 rounded-xl border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
                                      title="원래 기본 사진으로 되돌리기"
                                    >
                                      <RotateCcw size={13} />
                                      <span>원복</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    )
                  )}

                  {/* ========================================================
                      TAB 2: GLOBAL MEDIA LIBRARY (사진 및 동영상 보관함)
                      All site photos + server-uploaded media in one unified repository
                      ======================================================== */}
                  {adminTab === 'library' && (
                    !canAccessLibrary ? (
                      <AccessRestrictedView
                        title="글로벌 미디어 보관함 접근 권한 필요"
                        description="서버에 보관된 미디어 자산을 업로드하거나 관리하려면 승인된 Google 관리자 계정이 필요합니다."
                        requiredRole="운영 관리자 이상"
                        currentUser={currentUser}
                        onLoginClick={handleGoogleSignIn}
                        onLogoutClick={handleSignOut}
                      />
                    ) : (
                    <div className="space-y-4">
                      {/* Intuitive Usage Guide Banner */}
                      <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-stone-900 text-white dark:bg-white dark:text-stone-900 text-[10px] font-bold">
                            안내
                          </span>
                          <span className="text-stone-700 dark:text-stone-300">
                            <strong>미디어 보관함</strong>은 업로드된 모든 이미지·동영상의 통합 창고입니다. 각 화면 요소의 사진 변경은 <strong>[사진·영상 관리]</strong> 탭 또는 <strong>[화면 직접 편집 모드]</strong>에서 변경 시 보관함에서 1클릭으로 선택됩니다.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAdminTab('photos')}
                          className="px-3 py-1 rounded-xl bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-600 font-semibold shrink-0 cursor-pointer transition-colors text-[11px]"
                        >
                          사진·영상 관리 탭으로 이동 →
                        </button>
                      </div>

                      {/* Top Search, Sort and Filter Bar */}
                      <div className="flex flex-col gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                        {/* Row 1: Search Input & Sort Selector & Upload Button */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                          {/* Search Input */}
                          <div className="relative flex-1 min-w-[220px]">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              value={librarySearchQuery}
                              onChange={(e) => setLibrarySearchQuery(e.target.value)}
                              placeholder="미디어 파일명, 형식, 등록자 검색..."
                              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {librarySearchQuery && (
                              <button
                                type="button"
                                onClick={() => setLibrarySearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 cursor-pointer"
                              >
                                <X size={13} />
                              </button>
                            )}
                          </div>

                          {/* Sort Dropdown */}
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 hidden md:inline">
                              정렬:
                            </span>
                            <select
                              value={librarySortBy}
                              onChange={(e) => setLibrarySortBy(e.target.value as any)}
                              className="px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                              <option value="name_asc">가나다순 (오름차순 A→Z) ⬆</option>
                              <option value="name_desc">역순 (내림차순 Z→A) ⬇</option>
                              <option value="newest">최신 등록순 ⏱</option>
                              <option value="size">용량순 💾</option>
                            </select>

                            {/* Upload Button */}
                            <button
                              type="button"
                              onClick={() => globalLibraryFileInputRef.current?.click()}
                              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 cursor-pointer transition-all whitespace-nowrap"
                            >
                              <UploadCloud size={14} />
                              <span>새 미디어 올리기</span>
                            </button>
                          </div>
                        </div>

                        {/* Row 2: Category Filter Tabs & Count */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-200/60 dark:border-gray-700/60">
                          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                            <button
                              type="button"
                              onClick={() => setLibraryFilter('all')}
                              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                libraryFilter === 'all'
                                  ? 'bg-blue-600 text-white shadow'
                                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              전체 ({consolidatedMedia.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setLibraryFilter('uploaded')}
                              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                libraryFilter === 'uploaded'
                                  ? 'bg-blue-600 text-white shadow'
                                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              관리자 업로드 ({serverMediaList.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setLibraryFilter('builtin')}
                              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                libraryFilter === 'builtin'
                                  ? 'bg-blue-600 text-white shadow'
                                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              사이트 기본 자산 ({DEFAULT_BUILTIN_MEDIA.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setLibraryFilter('video')}
                              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                libraryFilter === 'video'
                                  ? 'bg-blue-600 text-white shadow'
                                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              동영상만
                            </button>
                          </div>

                          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                            총 {filteredMedia.length}개 표시 중
                          </span>
                        </div>
                      </div>

                      {/* Dropzone Hint */}
                      <div
                        onClick={() => globalLibraryFileInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsGlobalDropActive(true);
                        }}
                        onDragLeave={() => setIsGlobalDropActive(false)}
                        onDrop={async (e) => {
                          e.preventDefault();
                          setIsGlobalDropActive(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            try {
                              showToast(`'${file.name}' 업로드 중...`);
                              const res = await processMediaFile(file);
                              await addGlobalMedia(res.fileName, res.dataUrl, res.mediaType, userEmail, res.sizeFormatted);
                              showToast(`'${res.fileName}'이(가) 보관함에 저장되었습니다.`, 'success');
                            } catch (err: unknown) {
                              const msg = err instanceof Error ? err.message : '업로드 실패';
                              showToast(msg, 'error');
                            }
                          }
                        }}
                        className={`p-5 rounded-3xl border-2 border-dashed text-center cursor-pointer transition-all ${
                          isGlobalDropActive
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40'
                            : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 bg-gray-50/40 dark:bg-gray-800/20'
                        }`}
                      >
                        <UploadCloud size={26} className="mx-auto text-blue-500 mb-1" />
                        <p className="font-bold text-xs text-gray-800 dark:text-gray-200">
                          파일을 여기로 드래그하거나 클릭하여 새 사진·동영상을 보관함에 추가
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          JPG, PNG, WebP 이미지 및 MP4, WebM 동영상 지원 • 모든 관리자가 실시간 공유
                        </p>
                      </div>

                      {/* No Results Empty State */}
                      {filteredMedia.length === 0 && (
                        <div className="py-12 text-center space-y-2 bg-gray-50 dark:bg-gray-800/30 rounded-3xl border border-gray-200 dark:border-gray-800">
                          <Search size={32} className="mx-auto text-gray-400" />
                          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                            {librarySearchQuery ? `'${librarySearchQuery}' 검색 조건에 맞는 미디어가 없습니다.` : '등록된 미디어가 없습니다.'}
                          </p>
                          {librarySearchQuery && (
                            <button
                              type="button"
                              onClick={() => {
                                setLibrarySearchQuery('');
                                setLibraryFilter('all');
                              }}
                              className="text-xs text-blue-600 hover:underline cursor-pointer font-semibold"
                            >
                              검색 필터 초기화
                            </button>
                          )}
                        </div>
                      )}

                      {/* Media Grid */}
                      {filteredMedia.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                          {filteredMedia.map((item) => {
                            const isVid = item.mediaType === 'video';

                            return (
                              <div
                                key={item.id}
                                className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                              >
                                {/* Thumbnail */}
                                <div className="relative w-full h-32 bg-gray-900 overflow-hidden">
                                  {isVid ? (
                                    <video
                                      src={item.url}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <img
                                      src={item.url}
                                      alt={item.name}
                                      onError={(e) => {
                                        const target = e.currentTarget;
                                        target.onerror = null;
                                        target.style.display = 'none';
                                        if (target.parentElement) {
                                          target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                          const fallbackDiv = document.createElement('div');
                                          fallbackDiv.className = 'text-[11px] text-gray-400 font-medium px-2 text-center';
                                          fallbackDiv.innerText = '이미지 준비 중';
                                          target.parentElement.appendChild(fallbackDiv);
                                        }
                                      }}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  )}

                                  {/* Badge */}
                                  <div className="absolute top-1.5 left-1.5 flex gap-1">
                                    {isVid ? (
                                      <span className="px-1.5 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-bold shadow flex items-center gap-0.5">
                                        <Film size={9} />
                                        <span>영상</span>
                                      </span>
                                    ) : item.isBuiltin ? (
                                      <span className="px-1.5 py-0.5 rounded-full bg-black/60 text-gray-200 text-[9px] font-bold">
                                        기본
                                      </span>
                                    ) : (
                                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold shadow">
                                        업로드됨
                                      </span>
                                    )}
                                  </div>

                                  {/* Lightbox Zoom button */}
                                  <button
                                    type="button"
                                    onClick={() => setZoomMedia({ name: item.name, url: item.url, isVideo: isVid })}
                                    className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/60 hover:bg-black/80 text-white cursor-pointer"
                                    title="미리보기"
                                  >
                                    <Maximize2 size={11} />
                                  </button>
                                </div>

                                {/* Title & Info */}
                                <div className="p-2.5 flex-1 flex flex-col justify-between space-y-2">
                                  <div>
                                    <h5 className="font-bold text-xs text-gray-900 dark:text-white truncate" title={item.name}>
                                      {item.name}
                                    </h5>
                                    <p className="text-[10px] text-gray-400 truncate">
                                      {item.uploadedBy || '기본 자산'}
                                    </p>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex items-center gap-1.5 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(item.url);
                                        showToast(`'${item.name}' 미디어 주소가 복사되었습니다.`, 'success');
                                      }}
                                      className="flex-1 py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold"
                                      title="미디어 URL 복사"
                                    >
                                      <Copy size={12} />
                                      <span>URL 복사</span>
                                    </button>

                                    {!item.isBuiltin && permissions.canDelete && (
                                      <button
                                        type="button"
                                        onClick={(e) => handleDeleteMedia(item.id, item.name, e.shiftKey)}
                                        className="p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 cursor-pointer transition-colors"
                                        title="보관함에서 삭제 (Shift+클릭 시 확인 창 없이 즉시 삭제)"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    )
                  )}

                  {/* ========================================================
                      TAB 4: VERSION HISTORY & AUDIT LOGS (Multi-Category Filters)
                      ======================================================== */}
                  {adminTab === 'history' && (
                    !canAccessHistory ? (
                      <AccessRestrictedView
                        title="변경 이력 및 버전 복원 권한 필요"
                        description="사이트 변경 기록 열람 및 이전 시점 롤백 복원은 승인된 관리자 계정으로만 접근할 수 있습니다."
                        requiredRole="운영 관리자 이상"
                        currentUser={currentUser}
                        onLoginClick={handleGoogleSignIn}
                        onLogoutClick={handleSignOut}
                      />
                    ) : (
                    <div className="space-y-4">
                      {/* Sub-Filters and Search */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                        {/* Categories */}
                        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                          <button
                            type="button"
                            onClick={() => setHistoryCategory('all')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                              historyCategory === 'all'
                                ? 'bg-blue-600 text-white shadow'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            전체 내역 ({activityLogs.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setHistoryCategory('apply')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                              historyCategory === 'apply'
                                ? 'bg-blue-600 text-white shadow'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            실시간 적용
                          </button>
                          <button
                            type="button"
                            onClick={() => setHistoryCategory('revert')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                              historyCategory === 'revert'
                                ? 'bg-blue-600 text-white shadow'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            기본값 원복
                          </button>
                          <button
                            type="button"
                            onClick={() => setHistoryCategory('reject')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                              historyCategory === 'reject'
                                ? 'bg-blue-600 text-white shadow'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            거절/반려
                          </button>
                          <button
                            type="button"
                            onClick={() => setHistoryCategory('delete')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                              historyCategory === 'delete'
                                ? 'bg-blue-600 text-white shadow'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            삭제 내역
                          </button>
                          <button
                            type="button"
                            onClick={() => setHistoryCategory('admin')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                              historyCategory === 'admin'
                                ? 'bg-blue-600 text-white shadow'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            관리자 권한 변경
                          </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative min-w-[200px]">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={historySearch}
                            onChange={(e) => setHistorySearch(e.target.value)}
                            placeholder="키워드/항목/작성자 검색..."
                            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Snapshots Rollback Section */}
                      {siteVersions.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-bold text-xs text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                            <Layers size={13} className="text-blue-500" />
                            <span>저장된 과거 버전 스냅샷 (클릭하여 즉시 롤백 복원)</span>
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {siteVersions.slice(0, 6).map((ver) => (
                              <div
                                key={ver.id}
                                className="p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 shadow-sm space-y-2 flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-1 mb-1">
                                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 truncate">
                                      {ver.sectionTitle || ver.sectionKey}
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                      {new Date(ver.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>

                                  {ver.targetType === 'image' ? (
                                    <div className="w-full h-20 rounded-xl overflow-hidden bg-gray-900 border border-gray-200 dark:border-gray-700">
                                      <img src={ver.newValue} alt="Snapshot" className="w-full h-full object-cover" />
                                    </div>
                                  ) : (
                                    <p className="text-[11px] text-gray-700 dark:text-gray-300 line-clamp-3 bg-gray-50 dark:bg-gray-900 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
                                      {ver.newValue}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleRollback(ver)}
                                    className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow cursor-pointer transition-all flex items-center justify-center gap-1"
                                  >
                                    <RotateCcw size={11} />
                                    <span>이 버전으로 롤백</span>
                                  </button>
                                  {permissions.canDelete && (
                                    <button
                                      type="button"
                                      onClick={(e) => handleDeleteVersion(ver.id, e.shiftKey)}
                                      className="p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-rose-50 text-rose-500 cursor-pointer"
                                      title="스냅샷 기록 삭제 (Shift+클릭 시 확인 창 없이 즉시 삭제)"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Log List */}
                      <div className="space-y-2">
                        <h5 className="font-bold text-xs text-gray-700 dark:text-gray-300">
                          감사 활동 로그 내역
                        </h5>

                        {filteredLogs.length === 0 ? (
                          <div className="p-8 text-center text-xs text-gray-400 rounded-2xl bg-gray-50 dark:bg-gray-800/40">
                            기록된 활동 로그가 없습니다.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {filteredLogs.map((log) => {
                              const isApply = log.actionType === 'apply' || log.actionType === 'rollback';
                              const isRevert = log.actionType === 'revert';
                              const isReject = log.actionType === 'reject';
                              const isDelete = log.actionType === 'delete';

                              return (
                                <div
                                  key={log.id}
                                  className="p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/60 flex items-center justify-between gap-3 text-xs"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className={`p-2 rounded-xl shrink-0 ${
                                      isApply
                                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400'
                                        : isRevert
                                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400'
                                        : isReject || isDelete
                                        ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400'
                                        : 'bg-purple-100 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400'
                                    }`}>
                                      {isApply ? <Zap size={14} /> : isRevert ? <RotateCcw size={14} /> : isDelete ? <Trash2 size={14} /> : <Users size={14} />}
                                    </div>

                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-900 dark:text-white truncate">
                                          {log.targetTitle || log.target}
                                        </span>
                                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                                          isApply
                                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                                            : isRevert
                                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                        }`}>
                                          {log.actionType}
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                                        {log.details || log.target} • {log.userName || log.userEmail}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[10px] text-gray-400">
                                      {new Date(log.createdAt).toLocaleString()}
                                    </span>
                                    {permissions.canDelete && (
                                      <button
                                        type="button"
                                        onClick={(e) => handleDeleteLog(log.id, e.shiftKey)}
                                        className="p-1 text-gray-300 hover:text-rose-500 rounded-lg cursor-pointer transition-colors"
                                        title="로그 삭제 (Shift+클릭 시 확인 창 없이 즉시 삭제)"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    )
                  )}

                  {/* ========================================================
                      TAB 5: ADMIN ROLES & GRANULAR PERMISSIONS
                      Proper RBAC: canDirectApply, canRevert, canDelete, canReject, canManageAdmins
                      ======================================================== */}
                  {adminTab === 'admins' && (
                    !canAccessAdmins ? (
                      <AccessRestrictedView
                        title="관리자 설정 접근 제한"
                        description="새로운 관리자 등록 및 세부 권한 변경은 시스템 최고 관리자(Developer) 전용 기능입니다."
                        requiredRole="시스템 최고 관리자"
                        currentUser={currentUser}
                        onLoginClick={handleGoogleSignIn}
                        onLogoutClick={handleSignOut}
                      />
                    ) : (
                    <div className="space-y-5">
                      {/* Register New Admin Form */}
                      {permissions.canManageAdmins && (
                        <div className="p-4 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-3">
                          <h5 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                            <Users size={14} className="text-blue-500" />
                            <span>새 관리자 등록 및 계정 추가</span>
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <input
                              type="email"
                              value={newAdminEmail}
                              onChange={(e) => setNewAdminEmail(e.target.value)}
                              placeholder="관리자 Google 이메일 (예: admin@example.com)"
                              className="p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              value={newAdminName}
                              onChange={(e) => setNewAdminName(e.target.value)}
                              placeholder="관리자 이름/직책"
                              className="p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex gap-2">
                              <select
                                value={newAdminRole}
                                onChange={(e) => setNewAdminRole(e.target.value as 'admin' | 'developer')}
                                className="flex-1 p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-900 dark:text-white outline-none"
                              >
                                <option value="admin">일반 운영 관리자</option>
                                <option value="developer">시스템 최고 관리자</option>
                              </select>
                              <button
                                type="button"
                                disabled={isAddingAdmin || !newAdminEmail.trim()}
                                onClick={async () => {
                                  setIsAddingAdmin(true);
                                  try {
                                    const cleanEmail = newAdminEmail.trim().toLowerCase();
                                    const cleanName = newAdminName.trim() || cleanEmail.split('@')[0];
                                    const perms = newAdminRole === 'developer' ? DEVELOPER_PERMISSIONS : DEFAULT_ADMIN_PERMISSIONS;

                                    if (!currentUser) {
                                      // Local session registration when not signed into Google Auth
                                      const newLocalAdmin: AdminUser = {
                                        id: cleanEmail,
                                        email: cleanEmail,
                                        name: cleanName,
                                        role: newAdminRole,
                                        permissions: perms,
                                        addedBy: 'master-passkey',
                                        createdAt: new Date().toISOString()
                                      };
                                      const updated = [...adminUsers.filter((a) => a.email.toLowerCase() !== cleanEmail), newLocalAdmin];
                                      setAdminUsers(updated);
                                      localStorage.setItem('hkon_local_admin_users', JSON.stringify(updated));
                                      setNewAdminEmail('');
                                      setNewAdminName('');
                                      showToast(`'${cleanName}' 관리자가 로컬 세션에 등록되었습니다. (클라우드 동기화는 Google 로그인 시 적용)`, 'success');
                                      return;
                                    }

                                    await addOrUpdateAdminUser(
                                      cleanEmail,
                                      cleanName,
                                      newAdminRole,
                                      perms,
                                      userEmail
                                    );
                                    setNewAdminEmail('');
                                    setNewAdminName('');
                                    showToast('새 관리자가 성공적으로 등록되었습니다.', 'success');
                                  } catch (err: unknown) {
                                    const msg = err instanceof Error ? err.message : String(err);
                                    showToast('관리자 등록 실패: ' + msg, 'error');
                                  } finally {
                                    setIsAddingAdmin(false);
                                  }
                                }}
                                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md disabled:opacity-50 cursor-pointer transition-all"
                              >
                                등록
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Admin Users List */}
                      <div className="space-y-3">
                        <h5 className="font-bold text-xs text-gray-900 dark:text-white flex items-center justify-between">
                          <span>등록된 관리자 목록 & 세부 권한 설정</span>
                          <span className="text-[11px] text-gray-500">
                            칩을 클릭하여 개별 권한을 즉시 켜고 끌 수 있습니다
                          </span>
                        </h5>

                        <div className="space-y-3">
                          {adminUsers.map((admin) => {
                            const isDev = admin.role === 'developer';
                            const p = admin.permissions || (isDev ? DEVELOPER_PERMISSIONS : DEFAULT_ADMIN_PERMISSIONS);

                            return (
                              <div
                                key={admin.id || admin.email}
                                className="p-4 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 shadow-sm space-y-3"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
                                      <Shield size={16} />
                                    </div>
                                    <div>
                                      <h6 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-2">
                                        <span>{admin.name || admin.email.split('@')[0]}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                                          isDev
                                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                        }`}>
                                          {isDev ? '시스템 최고 관리자' : '운영 관리자'}
                                        </span>
                                      </h6>
                                      <p className="text-[11px] text-gray-500">
                                        {admin.email}
                                      </p>
                                    </div>
                                  </div>

                                  {permissions.canManageAdmins && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setConfirmDialog({
                                          isOpen: true,
                                          title: '관리자 권한 삭제',
                                          message: `'${admin.email}' 계정의 관리자 권한을 삭제하시겠습니까?`,
                                          confirmText: '관리자 삭제',
                                          confirmColor: 'rose',
                                          onConfirm: async () => {
                                            try {
                                              if (!currentUser) {
                                                const updated = adminUsers.filter((a) => a.email.toLowerCase() !== admin.email.toLowerCase());
                                                setAdminUsers(updated);
                                                localStorage.setItem('hkon_local_admin_users', JSON.stringify(updated));
                                                showToast('관리자가 로컬 세션에서 삭제되었습니다.');
                                                return;
                                              }
                                              await removeAdminUser(admin.email, userEmail);
                                              showToast('관리자가 삭제되었습니다.');
                                            } catch (err: unknown) {
                                              const msg = err instanceof Error ? err.message : String(err);
                                              showToast('삭제 실패: ' + msg, 'error');
                                            }
                                          }
                                        });
                                      }}
                                      className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 text-[11px] font-bold hover:bg-rose-50 cursor-pointer self-start sm:self-auto"
                                    >
                                      삭제
                                    </button>
                                  )}
                                </div>

                                {/* Granular Permission Toggles */}
                                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                  <span className="text-[10px] font-bold text-gray-400 block mb-1.5">
                                    세부 실행 권한 (클릭하여 토글):
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {/* Direct Apply */}
                                    <button
                                      type="button"
                                      onClick={() => handleToggleAdminPermission(admin, 'canDirectApply')}
                                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                        p.canDirectApply
                                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                                          : 'bg-gray-100 text-gray-400 dark:bg-gray-900 dark:text-gray-600 border border-transparent'
                                      }`}
                                    >
                                      {p.canDirectApply ? <Check size={11} /> : <X size={11} />}
                                      <span>즉시 승인/적용</span>
                                    </button>

                                    {/* Revert */}
                                    <button
                                      type="button"
                                      onClick={() => handleToggleAdminPermission(admin, 'canRevert')}
                                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                        p.canRevert
                                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                                          : 'bg-gray-100 text-gray-400 dark:bg-gray-900 dark:text-gray-600 border border-transparent'
                                      }`}
                                    >
                                      {p.canRevert ? <Check size={11} /> : <X size={11} />}
                                      <span>기본값 원복</span>
                                    </button>

                                    {/* Delete */}
                                    <button
                                      type="button"
                                      onClick={() => handleToggleAdminPermission(admin, 'canDelete')}
                                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                        p.canDelete
                                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                                          : 'bg-gray-100 text-gray-400 dark:bg-gray-900 dark:text-gray-600 border border-transparent'
                                      }`}
                                    >
                                      {p.canDelete ? <Check size={11} /> : <X size={11} />}
                                      <span>영구 삭제</span>
                                    </button>

                                    {/* Reject */}
                                    <button
                                      type="button"
                                      onClick={() => handleToggleAdminPermission(admin, 'canReject')}
                                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                        p.canReject
                                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 dark:border-purple-700'
                                          : 'bg-gray-100 text-gray-400 dark:bg-gray-900 dark:text-gray-600 border border-transparent'
                                      }`}
                                    >
                                      {p.canReject ? <Check size={11} /> : <X size={11} />}
                                      <span>제안 거절</span>
                                    </button>

                                    {/* Manage Admins */}
                                    <button
                                      type="button"
                                      onClick={() => handleToggleAdminPermission(admin, 'canManageAdmins')}
                                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                        p.canManageAdmins
                                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                                          : 'bg-gray-100 text-gray-400 dark:bg-gray-900 dark:text-gray-600 border border-transparent'
                                      }`}
                                    >
                                      {p.canManageAdmins ? <Check size={11} /> : <X size={11} />}
                                      <span>관리자 설정</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    )
                  )}

                  {/* ========================================================
                      TAB 5: HELP & SHORTCUTS GUIDE
                      ======================================================== */}
                  {adminTab === 'help' && (
                    <div className="space-y-5">
                      {/* Section 1: Keyboard Shortcuts */}
                      <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100">
                            <BookOpen size={16} />
                          </div>
                          <h5 className="font-semibold text-sm text-stone-900 dark:text-white">
                            키보드 단축키 안내
                          </h5>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          작업 효율을 높여주는 키보드 단축키를 언제든지 활용할 수 있습니다.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 flex items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold text-stone-900 dark:text-white block">
                                관리 센터 열기 / 닫기
                              </span>
                              <span className="text-[11px] text-stone-400">
                                관리 포털 호출
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <kbd className="px-2 py-1 rounded-md bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs font-mono font-bold text-stone-900 dark:text-stone-100 shadow-xs">
                                F2
                              </kbd>
                              <span className="text-[10px] text-stone-400">또는</span>
                              <kbd className="px-2 py-1 rounded-md bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-[11px] font-mono text-stone-700 dark:text-stone-300">
                                Ctrl+M
                              </kbd>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 flex items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold text-stone-900 dark:text-white block">
                                화면 직접 편집 모드
                              </span>
                              <span className="text-[11px] text-stone-400">
                                화면 속 수정 버튼 노출
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <kbd className="px-2 py-1 rounded-md bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs font-mono font-bold text-stone-900 dark:text-stone-100 shadow-xs">
                                F4
                              </kbd>
                              <span className="text-[10px] text-stone-400">또는</span>
                              <kbd className="px-2 py-1 rounded-md bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-[11px] font-mono text-stone-700 dark:text-stone-300">
                                Ctrl+E
                              </kbd>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 flex items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold text-stone-900 dark:text-white block">
                                닫기 / 편집 모드 종료
                              </span>
                              <span className="text-[11px] text-stone-400">
                                창 닫기
                              </span>
                            </div>
                            <kbd className="px-2 py-1 rounded-md bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs font-mono text-stone-700 dark:text-stone-300">
                              Esc
                            </kbd>
                          </div>

                          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 flex items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold text-stone-900 dark:text-white block">
                                슬라이더 제품 전환
                              </span>
                              <span className="text-[11px] text-stone-400">
                                CARACI 및 배너 이동
                              </span>
                            </div>
                            <kbd className="px-2 py-1 rounded-md bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs font-mono text-stone-700 dark:text-stone-300">
                              ← / →
                            </kbd>
                          </div>

                          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 flex items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold text-stone-900 dark:text-white block">
                                확인 창 없이 즉시 삭제
                              </span>
                              <span className="text-[11px] text-stone-400">
                                삭제 버튼 클릭 시 확인 창 없이 바로 삭제
                              </span>
                            </div>
                            <kbd className="px-2 py-1 rounded-md bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs font-mono text-stone-700 dark:text-stone-300">
                              Shift + 삭제 클릭
                            </kbd>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Photo & Video Editing Guide */}
                      <div className="p-5 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-emerald-600 text-white">
                            <ImageIcon size={16} />
                          </div>
                          <h5 className="font-bold text-sm text-gray-900 dark:text-white">
                            사진 및 동영상 변경 3단계 방법
                          </h5>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                          <div className="p-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-1.5">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                              STEP 1
                            </span>
                            <h6 className="text-xs font-bold text-gray-900 dark:text-white">
                              사진/영상 변경 클릭
                            </h6>
                            <p className="text-[11px] text-gray-500 leading-relaxed">
                              관리 센터 [사이트 사진·영상 관리] 탭에서 원하는 항목의 [사진/영상 변경] 버튼을 누릅니다.
                            </p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-1.5">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                              STEP 2
                            </span>
                            <h6 className="text-xs font-bold text-gray-900 dark:text-white">
                              원하는 미디어 선택
                            </h6>
                            <p className="text-[11px] text-gray-500 leading-relaxed">
                              라이브러리에서 기본 사진(CARACI 6종, 하겐다즈 등)을 클릭하거나, 내 PC의 사진/동영상을 드래그앤드롭합니다.
                            </p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-1.5">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                              STEP 3
                            </span>
                            <h6 className="text-xs font-bold text-gray-900 dark:text-white">
                              즉시 사이트에 적용
                            </h6>
                            <p className="text-[11px] text-gray-500 leading-relaxed">
                              [즉시 사이트에 적용] 버튼을 누르면 모든 방문자에게 1초 만에 실시간 반영되며, 서버에 보관됩니다.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Section 4: Reverting to Code Default */}
                      <div className="p-5 rounded-3xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-purple-600 text-white">
                            <RotateCcw size={16} />
                          </div>
                          <h5 className="font-bold text-sm text-gray-900 dark:text-white">
                            원래 사진으로 원복(되돌리기) 시 어떻게 되나요?
                          </h5>
                        </div>
                        <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                          <p>
                            • <strong>원래 있던 사진은 그대로 보존됩니다</strong>: 사용자가 사진을 바꾸더라도 원래 시스템에 지정되어 있던 기본 공식 사진은 삭제되지 않고 안전하게 보존되어 있습니다.
                          </p>
                          <p>
                            • <strong>실시간 나란히 비교 미리보기</strong>: [원복] 버튼을 누르면 <strong>[현재 적용 중인 사진]</strong>과 <strong>[복구될 원래 기본 사진]</strong>을 두 개의 큰 화면으로 나란히 보여줍니다. 눈으로 확인 후 [원래 값으로 복구 확정]을 누르면 즉시 복원됩니다.
                          </p>
                          <p>
                            • <strong>실수 방지 안전장치</strong>: 원복 후에도 [변경 내역 & 되돌리기] 탭에서 이전 스냅샷 버전으로 언제든지 다시 되돌아갈 수 있습니다.
                          </p>
                        </div>
                      </div>

                      {/* Section 5: Video Format & Public Visitor Clean UI */}
                      <div className="p-5 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-gray-700 text-white">
                            <Film size={16} />
                          </div>
                          <h5 className="font-bold text-sm text-gray-900 dark:text-white">
                            동영상 지원 및 일반 방문자 화면 안내
                          </h5>
                        </div>
                        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                          <p>
                            • <strong>동영상 파일 지원</strong>: <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono">.mp4</code>, <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono">.webm</code> 형식의 고화질 비디오를 바로 업로드할 수 있으며, 메인 배너 및 모달에서 부드럽게 무한 루프로 재생됩니다.
                          </p>
                          <p>
                            • <strong>일반 방문자에게는 관리자 버튼이 보이지 않습니다</strong>: 일반 대중이나 고객이 웹사이트에 들어왔을 때는 상단 내비게이션 바에 관리자 버튼이 전혀 노출되지 않아 깨끗하고 품격 있는 기업 사이트로 유지됩니다.
                          </p>
                          <p>
                            • 사내 임직원은 <strong>F2</strong> (또는 Ctrl+M) 단축키를 누르거나 웹사이트 하단의 <strong>[사내 포털]</strong>을 통해 언제든지 관리자 포털을 열 수 있습니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

      {/* ========================================================
          ASSIGN MEDIA TO SECTION MODAL (From Library)
          Allows picking ANY site section and applying the media in 1 click!
          ======================================================== */}
      {assignMediaModal?.isOpen && (
        <div className="fixed inset-0 z-[99998] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-blue-600" />
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  사이트 섹션에 즉시 적용
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setAssignMediaModal(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Preview of chosen media */}
            <div className="w-full h-32 rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-inner">
              {assignMediaModal.isVideo ? (
                <video src={assignMediaModal.mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
              ) : (
                <img src={assignMediaModal.mediaUrl} alt="Selected" className="w-full h-full object-cover" />
              )}
            </div>
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">
              선택한 파일: {assignMediaModal.mediaName}
            </p>

            <span className="text-[11px] font-bold text-gray-500 block">
              적용할 사이트 위치를 선택하세요:
            </span>

            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
              {ALL_TARGET_SECTIONS.map((sec) => (
                <button
                  key={sec.key}
                  type="button"
                  onClick={async () => {
                    await applyChangeToLiveSite(sec.key, sec.title, assignMediaModal.mediaUrl, true, assignMediaModal.isVideo ? 'video' : 'image');
                    setAssignMediaModal(null);
                  }}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 text-left text-xs font-bold text-gray-800 dark:text-gray-200 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <span>{sec.title}</span>
                  <ArrowRight size={13} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          EDIT MODAL (Inline or Opened from Portal)
          Transparent Before/After with 1-Click Library Pick or 1-Click Upload
          ======================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[99990] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600">
                  {editingIsImage ? <ImageIcon size={18} /> : <Edit3 size={18} />}
                </div>
                <div>
                  <h4 className="font-bold text-base text-gray-900 dark:text-white">
                    {editingTitle} 수정
                  </h4>
                  <span className="text-[10px] text-gray-500 font-mono">
                    ID: {editingKey}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setTargetSection(null);
                }}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              
              {editingIsImage ? (
                <div className="space-y-4">
                  
                  {/* BEFORE & AFTER PREVIEW (Side-by-Side comparison) */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
                    {/* Original Code Default */}
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 block mb-1">
                        📌 원래 기본 원본 (원복 시 복원):
                      </span>
                      <div className="w-full h-24 rounded-xl overflow-hidden bg-gray-900 border border-gray-200 dark:border-gray-700">
                        {DEFAULT_VALUES_MAP[editingKey] ? (
                          <img
                            src={DEFAULT_VALUES_MAP[editingKey].value}
                            alt="Original Default"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                            기본 원본
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Current Live / Proposed */}
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block mb-1">
                        ⚡ 새로 변경할 사진/영상:
                      </span>
                      <div className="w-full h-24 rounded-xl overflow-hidden bg-gray-900 border-2 border-blue-500 shadow-md">
                        {isMediaVideo(editingProposedVal) ? (
                          <video src={editingProposedVal} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                        ) : (
                          <img src={editingProposedVal || editingCurrentVal} alt="Proposed" className="w-full h-full object-cover" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mode Tabs: [보관함에서 1클릭 선택] vs [내 컴퓨터에서 새 파일 올리기] */}
                  <div className="flex border-b border-gray-200 dark:border-gray-800 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditModalTab('pick')}
                      className={`pb-2 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                        editModalTab === 'pick'
                          ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500'
                      }`}
                    >
                      🖼️ 전체 보관함에서 1클릭 선택 ({consolidatedMedia.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditModalTab('upload')}
                      className={`pb-2 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                        editModalTab === 'upload'
                          ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500'
                      }`}
                    >
                      📁 내 컴퓨터에서 새 파일 올리기
                    </button>
                  </div>

                  {/* TAB 1: PICK FROM LIBRARY */}
                  {editModalTab === 'pick' && (
                    <div className="space-y-2">
                      <p className="text-[11px] text-gray-500">
                        원하는 사진이나 동영상을 클릭하면 즉시 선택되어 미리보기에 반영됩니다:
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1">
                        {consolidatedMedia.map((m) => {
                          const isSelected = editingProposedVal === m.url;
                          const isVid = m.mediaType === 'video';

                          return (
                            <div
                              key={m.id}
                              onClick={() => {
                                setEditingProposedVal(m.url);
                                setEditingProposedMediaType(isVid ? 'video' : 'image');
                              }}
                              className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-video bg-gray-900 group ${
                                isSelected
                                  ? 'border-blue-600 ring-2 ring-blue-500 scale-95 shadow-md'
                                  : 'border-transparent hover:border-gray-400'
                              }`}
                            >
                              {isVid ? (
                                <video src={m.url} className="w-full h-full object-cover" />
                              ) : (
                                <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                              )}
                              {isSelected && (
                                <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                                  <Check size={18} className="text-white drop-shadow" />
                                </div>
                              )}
                              <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[9px] font-bold p-0.5 truncate text-center">
                                {m.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: UPLOAD FROM COMPUTER */}
                  {editModalTab === 'upload' && (
                    <div className="space-y-3">
                      <input
                        type="file"
                        ref={modalFileInputRef}
                        accept="image/*,video/mp4,video/webm"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              showToast(`'${file.name}' 처리 중...`);
                              const res = await processMediaFile(file);
                              setEditingProposedVal(res.dataUrl);
                              setEditingProposedMediaType(res.mediaType);
                              await addGlobalMedia(res.fileName, res.dataUrl, res.mediaType, userEmail, res.sizeFormatted);
                              showToast('사진이 선택 및 보관함에 저장되었습니다.');
                            } catch (err: unknown) {
                              const msg = err instanceof Error ? err.message : '파일 처리 실패';
                              showToast(msg, 'error');
                            }
                          }
                          e.target.value = '';
                        }}
                      />

                      <div
                        onClick={() => modalFileInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={async (e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            try {
                              showToast(`'${file.name}' 처리 중...`);
                              const res = await processMediaFile(file);
                              setEditingProposedVal(res.dataUrl);
                              setEditingProposedMediaType(res.mediaType);
                              await addGlobalMedia(res.fileName, res.dataUrl, res.mediaType, userEmail, res.sizeFormatted);
                              showToast('사진이 선택 및 보관함에 저장되었습니다.');
                            } catch (err: unknown) {
                              const msg = err instanceof Error ? err.message : '파일 처리 실패';
                              showToast(msg, 'error');
                            }
                          }
                        }}
                        className="p-8 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 bg-gray-50/50 dark:bg-gray-800/40 text-center cursor-pointer transition-all"
                      >
                        <UploadCloud size={32} className="mx-auto text-blue-500 mb-2" />
                        <p className="font-bold text-xs text-gray-800 dark:text-gray-200">
                          파일을 여기에 끌어다 놓거나 클릭하여 선택
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          JPG, PNG, WebP 이미지 또는 MP4 동영상
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                /* Text Edit Form - Separate Multilingual Tabs (한글, 영어, 중국어 각각 따로따로 수정) */
                <div className="space-y-4">
                  {/* Language Selection Tab Header */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        <span>🌐 언어별 개별 문구 수정 (한/영/중 분리):</span>
                      </label>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">
                        * 각 언어별로 독립적으로 저장·반영됩니다
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700">
                      {[
                        { id: 'ko' as const, flag: '🇰🇷', label: '한국어 (KO)' },
                        { id: 'en' as const, flag: '🇺🇸', label: 'English (EN)' },
                        { id: 'zh' as const, flag: '🇨🇳', label: '中文 (ZH)' }
                      ].map((item) => {
                        const isSelected = editLang === item.id;
                        const baseKey = editingKey.replace(/_(ko|en|zh)$/, '');
                        const hasOverride = Boolean(
                          activeOverrides[`${baseKey}_${item.id}`] ||
                          (item.id === 'ko' && activeOverrides[baseKey])
                        );

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setEditLang(item.id);
                              setEditingProposedVal(editingLangVals[item.id] || '');
                            }}
                            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm ring-2 ring-blue-500/20'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                            }`}
                          >
                            <span>{item.flag}</span>
                            <span>{item.label}</span>
                            {hasOverride && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" title="현재 사이트에 적용된 수정본 있음" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Language Specific Box */}
                  {(() => {
                    const baseKey = editingKey.replace(/_(ko|en|zh)$/, '');
                    const defaultText = getDefaultTextForLanguage(baseKey, editLang);
                    const activeLangOverride = activeOverrides[`${baseKey}_${editLang}`] || (editLang === 'ko' ? activeOverrides[baseKey] : undefined);
                    const langNames = { ko: '한국어', en: 'English', zh: '中文' };

                    return (
                      <div className="space-y-3">
                        {/* Default Reference for Active Language */}
                        {defaultText && (
                          <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold flex items-center gap-1 text-amber-700 dark:text-amber-400">
                                <RotateCcw size={11} />
                                <span>원래 기본 코드 원본 ({langNames[editLang]}):</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingLangVals(prev => ({ ...prev, [editLang]: defaultText }));
                                  setEditingProposedVal(defaultText);
                                }}
                                className="text-[10px] text-amber-700 dark:text-amber-400 hover:underline cursor-pointer font-semibold"
                              >
                                기본값 불러오기
                              </button>
                            </div>
                            <p className="opacity-80 whitespace-pre-line">{defaultText}</p>
                          </div>
                        )}

                        {/* Active Override Indicator */}
                        {activeLangOverride && (
                          <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-[11px] text-blue-900 dark:text-blue-200 flex items-center justify-between">
                            <span className="flex items-center gap-1.5 font-medium">
                              <Check size={12} className="text-blue-600 dark:text-blue-400" />
                              <span>현재 {langNames[editLang]} 페이지에 실시간 적용 중인 문구입니다.</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const targetLangKey = editLang === 'ko' ? (activeOverrides[`${baseKey}_ko`] ? `${baseKey}_ko` : baseKey) : `${baseKey}_${editLang}`;
                                handleRevert(targetLangKey, `${editingTitle} (${langNames[editLang]})`);
                              }}
                              className="text-[10px] text-red-600 dark:text-red-400 hover:underline cursor-pointer font-bold"
                            >
                              이 언어만 원복
                            </button>
                          </div>
                        )}

                        {/* Textarea for Active Language */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-gray-800 dark:text-gray-200">
                              {langNames[editLang]} 문구 입력:
                            </label>
                            <span className="text-[10px] text-gray-500 font-mono">
                              적용 대상: {baseKey}_{editLang}
                            </span>
                          </div>
                          <textarea
                            rows={4}
                            value={editingLangVals[editLang] ?? ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditingLangVals(prev => ({ ...prev, [editLang]: val }));
                              setEditingProposedVal(val);
                            }}
                            className="w-full p-3.5 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                            placeholder={`${langNames[editLang]} 문구를 입력하세요...`}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/80 flex items-center justify-between">
              <div>
                {editingIsImage ? (
                  activeOverrides[editingKey] && (
                    <button
                      type="button"
                      onClick={() => handleRevert(editingKey, editingTitle)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/40 cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw size={13} />
                      <span>원래 기본 사진으로 원복</span>
                    </button>
                  )
                ) : (
                  (() => {
                    const baseKey = editingKey.replace(/_(ko|en|zh)$/, '');
                    const hasLangOverride = Boolean(
                      activeOverrides[`${baseKey}_${editLang}`] ||
                      (editLang === 'ko' && activeOverrides[baseKey])
                    );
                    const langNames = { ko: '한국어', en: 'English', zh: '中文' };

                    return hasLangOverride ? (
                      <button
                        type="button"
                        onClick={() => {
                          const targetRevertKey = editLang === 'ko'
                            ? (activeOverrides[`${baseKey}_ko`] ? `${baseKey}_ko` : baseKey)
                            : `${baseKey}_${editLang}`;
                          handleRevert(targetRevertKey, `${editingTitle} (${langNames[editLang]})`);
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/40 cursor-pointer flex items-center gap-1 transition-colors"
                        title={`${langNames[editLang]} 수정 사항만 원래 코드로 되돌립니다`}
                      >
                        <RotateCcw size={13} />
                        <span>{langNames[editLang]} 원복</span>
                      </button>
                    ) : null;
                  })()
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setTargetSection(null);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  취소
                </button>
                {hasAdminPrivileges && (
                  <button
                    type="button"
                    disabled={
                      editingIsImage
                        ? (!editingProposedVal.trim() || actionInProgressKey === editingKey)
                        : (!((editingLangVals.ko || '').trim() || (editingLangVals.en || '').trim() || (editingLangVals.zh || '').trim() || editingProposedVal.trim()))
                    }
                    onClick={() => {
                      if (editingIsImage) {
                        applyChangeToLiveSite(editingKey, editingTitle, editingProposedVal, true, editingProposedMediaType);
                        setIsEditModalOpen(false);
                        setTargetSection(null);
                      } else {
                        const baseKey = editingKey.replace(/_(ko|en|zh)$/, '');
                        const langNames: Record<'ko' | 'en' | 'zh', string> = { ko: '한국어', en: 'English', zh: '中文' };

                        // Apply current active language first
                        const currentActiveVal = (editingLangVals[editLang] ?? editingProposedVal).trim();
                        if (currentActiveVal) {
                          const langKey = `${baseKey}_${editLang}`;
                          applyChangeToLiveSite(langKey, `${editingTitle} (${langNames[editLang]})`, currentActiveVal, false, 'image');
                          if (editLang === 'ko') {
                            applyChangeToLiveSite(baseKey, editingTitle, currentActiveVal, false, 'image');
                          }
                        }

                        // Apply other modified languages independently
                        (['ko', 'en', 'zh'] as const).forEach((l) => {
                          if (l !== editLang) {
                            const v = (editingLangVals[l] ?? '').trim();
                            if (v) {
                              const langKey = `${baseKey}_${l}`;
                              applyChangeToLiveSite(langKey, `${editingTitle} (${langNames[l]})`, v, false, 'image');
                              if (l === 'ko') {
                                applyChangeToLiveSite(baseKey, editingTitle, v, false, 'image');
                              }
                            }
                          }
                        });

                        setIsEditModalOpen(false);
                        setTargetSection(null);
                        showToast(`'${editingTitle}' 문구가 사이트에 즉시 반영되었습니다! (한/영/중 분리 저장)`, 'success');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1.5"
                    title="관리자 권한으로 변경사항을 즉시 사이트 및 데이터베이스에 영구 반영합니다"
                  >
                    <Zap size={13} />
                    <span>즉시 사이트에 바로 반영 (저장)</span>
                  </button>
                )}
                {/* Save edit to draft and update user screen immediately like a game save file */}
                <button
                  type="button"
                  disabled={
                    editingIsImage
                      ? !editingProposedVal.trim()
                      : (!((editingLangVals.ko || '').trim() || (editingLangVals.en || '').trim() || (editingLangVals.zh || '').trim() || editingProposedVal.trim()))
                  }
                  onClick={() => {
                    if (editingIsImage) {
                      handleStageEdit(editingKey, editingTitle, editingProposedVal, true, editingProposedMediaType);
                    } else {
                      const baseKey = editingKey.replace(/_(ko|en|zh)$/, '');
                      const langNames: Record<'ko' | 'en' | 'zh', string> = { ko: '한국어', en: 'English', zh: '中文' };

                      const currentActiveVal = (editingLangVals[editLang] ?? editingProposedVal).trim();
                      if (currentActiveVal) {
                        const langKey = `${baseKey}_${editLang}`;
                        handleStageEdit(langKey, `${editingTitle} (${langNames[editLang]})`, currentActiveVal, false, 'image');
                        if (editLang === 'ko') {
                          handleStageEdit(baseKey, editingTitle, currentActiveVal, false, 'image');
                        }
                      }

                      (['ko', 'en', 'zh'] as const).forEach((l) => {
                        if (l !== editLang) {
                          const v = (editingLangVals[l] ?? '').trim();
                          if (v) {
                            const langKey = `${baseKey}_${l}`;
                            handleStageEdit(langKey, `${editingTitle} (${langNames[l]})`, v, false, 'image');
                            if (l === 'ko') {
                              handleStageEdit(baseKey, editingTitle, v, false, 'image');
                            }
                          }
                        }
                      });

                      setIsEditModalOpen(false);
                      setTargetSection(null);
                      showToast(`'${editingTitle}' 수정 사항이 임시 저장되었습니다. (한/영/중 분리)`, 'success');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1.5"
                  title="수정 사항을 담아 화면에 즉시 반영합니다 (세이브 파일 저장)"
                >
                  <Save size={13} />
                  <span>수정 완료 (화면에 반영)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          STAGED EDITS BATCH REVIEW & SAVE MODAL
          ======================================================== */}
      {isStagedModalOpen && (
        <div className="fixed inset-0 z-[999990] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <Save size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                    <span>수정 작업 저장 및 반영</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold">
                      {stagedCount}건 대기
                    </span>
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    여러 개의 수정 작업을 확인한 후 [바로 적용] 또는 [제출]을 선택하세요.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStagedModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-xl cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body - Items List */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
              {stagedCount === 0 ? (
                <div className="py-12 text-center text-xs text-stone-400">
                  대기 중인 수정 작업이 없습니다.
                </div>
              ) : (
                (Object.values(stagedEdits) as StagedEditItem[]).map((item) => (
                  <div
                    key={item.key}
                    className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          item.isImg ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                        }`}>
                          {item.isImg ? '이미지/영상' : '텍스트 문구'}
                        </span>
                        <span className="font-bold text-xs text-stone-900 dark:text-white">
                          {item.title}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSingleStaged(item.key)}
                        className="text-[11px] text-rose-500 hover:text-rose-600 hover:underline cursor-pointer font-medium"
                      >
                        이 수정 취소
                      </button>
                    </div>

                    {item.isImg ? (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-stone-400 block mb-1">변경 전 (기존):</span>
                          <div className="w-full h-20 rounded-xl overflow-hidden bg-stone-900 border border-stone-200 dark:border-stone-700">
                            {item.oldVal ? (
                              <img src={item.oldVal} alt="Old" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">기본 원본</div>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-blue-500 font-bold block mb-1">새로 변경할 파일:</span>
                          <div className="w-full h-20 rounded-xl overflow-hidden bg-stone-900 border-2 border-blue-500">
                            {isMediaVideo(item.newVal) ? (
                              <video src={item.newVal} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                            ) : (
                              <img src={item.newVal} alt="New" className="w-full h-full object-cover" />
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 text-xs">
                        {item.oldVal && (
                          <div className="text-stone-400 text-[11px] line-through">
                            기존: {item.oldVal}
                          </div>
                        )}
                        <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                          변경: {item.newVal}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer - Actions */}
            <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleDiscardAllStaged}
                className="text-xs text-rose-500 hover:text-rose-600 hover:underline cursor-pointer font-medium"
              >
                대기 중인 수정 전체 취소
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsStagedModalOpen(false)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  계속 수정하기
                </button>
                <button
                  type="button"
                  onClick={handleSubmitAllStaged}
                  className="flex-1 sm:flex-none px-4.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title="검토 요청으로 제출"
                >
                  <Send size={13} />
                  <span>제출 (검토 요청)</span>
                </button>
                {hasAdminPrivileges ? (
                  <button
                    type="button"
                    onClick={handleApplyAllStaged}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="관리자 권한으로 사이트에 즉시 영구 반영"
                  >
                    <Zap size={14} />
                    <span>바로 적용 ({stagedCount})</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => alert('바로 적용 권한이 없습니다 (관리자 전용).\n[제출 (검토 요청)] 버튼을 이용해 주세요.')}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5"
                    title="관리자 권한 필요"
                  >
                    <Lock size={13} />
                    <span>바로 적용 (권한 필요)</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          MEDIA LIGHTBOX ZOOM / FULL PREVIEW
          ======================================================== */}
      {zoomMedia && (
        <div
          onClick={() => setZoomMedia(null)}
          className="fixed inset-0 z-[999998] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer animate-fadeIn"
        >
          <div className="max-w-4xl max-h-[90vh] flex flex-col items-center">
            {zoomMedia.isVideo ? (
              <video
                src={zoomMedia.url}
                autoPlay
                controls
                className="max-h-[80vh] max-w-full rounded-2xl shadow-2xl border border-white/20"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={zoomMedia.url}
                alt={zoomMedia.name}
                className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/20"
              />
            )}
            <p className="mt-3 text-white text-xs font-bold bg-black/70 px-4 py-1.5 rounded-full">
              {zoomMedia.name}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          TOPMOST IN-APP CONFIRMATION DIALOG (z-[999999])
          Guaranteed above ALL portals, sidebars, and modals
          Shows Side-by-Side Thumbnail / Text preview of Default!
          ======================================================== */}
      {confirmDialog?.isOpen && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setConfirmDialog(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 border-2 border-amber-500/60 dark:border-amber-500/50 rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${
                confirmDialog.confirmColor === 'rose'
                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400'
                  : confirmDialog.confirmColor === 'emerald'
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400'
                  : 'bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400'
              }`}>
                <Shield size={22} />
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white">
                {confirmDialog.title}
              </h4>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              {confirmDialog.message}
            </p>

            {/* Visual Side-by-Side Comparison inside Confirmation Dialog */}
            {confirmDialog.previewDefault && (
              <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-2.5">
                <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block">
                  원복 전후 내용 실시간 비교 (확인 후 복구):
                </span>
                {confirmDialog.previewType === 'image' ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Left: Currently Live (to be removed) */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                        <span>현재 사진 (제거됨)</span>
                      </span>
                      <div className="w-full h-28 rounded-xl overflow-hidden bg-gray-950 border border-rose-300 dark:border-rose-900/60 shadow-inner flex items-center justify-center">
                        {confirmDialog.previewCurrent ? (
                          isMediaVideo(confirmDialog.previewCurrent) ? (
                            <video src={confirmDialog.previewCurrent} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                          ) : (
                            <img src={confirmDialog.previewCurrent} alt="Current" className="w-full h-full object-cover" />
                          )
                        ) : (
                          <span className="text-[10px] text-gray-500">현재 변경본 없음</span>
                        )}
                      </div>
                    </div>

                    {/* Right: Code Default (to be restored) */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span>복원될 원래 사진 (적용됨)</span>
                      </span>
                      <div className="w-full h-28 rounded-xl overflow-hidden bg-gray-950 border-2 border-emerald-500 dark:border-emerald-600 shadow-md flex items-center justify-center">
                        {isMediaVideo(confirmDialog.previewDefault) ? (
                          <video src={confirmDialog.previewDefault} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                        ) : (
                          <img src={confirmDialog.previewDefault} alt="Default" className="w-full h-full object-cover" />
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {confirmDialog.previewCurrent && (
                      <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50">
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block mb-0.5">현재 문구 (제거):</span>
                        <p className="text-xs text-rose-900 dark:text-rose-200 line-clamp-2 font-mono">
                          "{confirmDialog.previewCurrent}"
                        </p>
                      </div>
                    )}
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">복원될 원래 문구 (적용):</span>
                      <p className="text-xs text-emerald-900 dark:text-emerald-200 line-clamp-2 font-mono">
                        "{confirmDialog.previewDefault}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg cursor-pointer transition-all ${
                  confirmDialog.confirmColor === 'rose'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                    : confirmDialog.confirmColor === 'emerald'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                    : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
                }`}
              >
                {confirmDialog.confirmText || '확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
