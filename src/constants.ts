export interface Product {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  image: string;
  color: string;
}

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    heroTitle: "Creating Value Through Customer Satisfaction",
    heroSubtitle: "A company that brings health and joy. This is the vision and mission of 에이치케이온.",
    exploreProducts: "View Details",
    company: "Company",
    products: "Products",
    support: "Support",
    resources: "Resources",
    ir: "IR",
    csr: "CSR",
    infoCenter: "Info Center",
    careers: "Careers",
    notice: "Notice",
    gallery: "Gallery",
    contactUs: "Contact Us",
    inquiry: "Inquiry",
    remoteSupport: "Remote Support",
    customerSupport: "Customer Support",
    training: "Training",
    footerText: "© 2026 에이치케이온. All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    sitemap: "Sitemap",
    location: "Location",
    readMore: "Read More"
  },
  ko: {
    heroTitle: "고객 만족을 통한 가치 창조",
    heroSubtitle: "건강하고 기쁨을 주는 기업, 에이치케이온의 비전과 미션입니다.",
    exploreProducts: "자세히 보기",
    company: "회사소개",
    products: "제품소개",
    support: "고객지원",
    resources: "자료실",
    ir: "투자정보",
    csr: "사회공헌",
    infoCenter: "정보센터",
    careers: "채용정보",
    notice: "공지사항",
    gallery: "갤러리",
    contactUs: "Contact Us",
    inquiry: "견적문의",
    remoteSupport: "원격지원",
    customerSupport: "고객지원",
    training: "교육신청",
    footerText: "© 2026 에이치케이온. All rights reserved.",
    privacyPolicy: "개인정보처리방침",
    termsOfService: "이용약관",
    sitemap: "사이트맵",
    location: "오시는길",
    readMore: "더보기"
  },
  zh: {
    heroTitle: "通过客户满意创造价值",
    heroSubtitle: "一家带来健康和快乐的公司。这是 에이치케이온 的愿景和使命。",
    exploreProducts: "查看详情",
    company: "公司",
    products: "产品",
    support: "支持",
    resources: "资源",
    ir: "投资者关系",
    csr: "企业社会责任",
    infoCenter: "信息中心",
    careers: "职业生涯",
    notice: "公告",
    gallery: "画廊",
    contactUs: "联系我们",
    inquiry: "查询",
    remoteSupport: "远程支持",
    customerSupport: "客户支持",
    training: "培训",
    footerText: "© 2026 에이치케이온。版权所有。",
    privacyPolicy: "隐私政策",
    termsOfService: "服务条款",
    sitemap: "网站地图",
    location: "位置",
    readMore: "阅读更多"
  }
};

export const PRODUCTS: Product[] = [
  {
    id: 'hd-vanilla',
    name: { en: 'Vanilla Pint', ko: '바닐라 파인트', zh: '香草品脱' },
    description: { 
      en: '5 pure ingredients for an elegant vanilla experience.',
      ko: '5가지 순수한 원재료로만 입 안 가득 채우는 우아한 바닐라',
      zh: '5种纯净原料，打造优雅香草体验。'
    },
    image: '/images/image1.png',
    color: '#F3E5AB'
  },
  {
    id: 'hd-cookies-cream',
    name: { en: 'Cookies & Cream Pint', ko: '쿠키앤크림 파인트', zh: '曲奇奶油品脱' },
    description: { 
      en: 'Smooth vanilla ice cream with crunchy cookie pieces.',
      ko: '부드러운 하겐다즈 바닐라 아이스크림에 달콤하고 바삭한 쿠키 조각을 듬뿍 넣은 완벽한 조합의 맛',
      zh: '丝滑香草冰淇淋配上脆脆的饼干碎片。'
    },
    image: '/images/image2.png',
    color: '#4B3621'
  },
  {
    id: 'hd-pistachio-cream',
    name: { en: 'Pistachio & Cream', ko: '피스타치오 & 크림', zh: '开心果奶油' },
    description: { 
      en: 'Premium Pistachio & Cream for a rich flavor.',
      ko: '아이스크림 of 아이스크림 하겐다즈와 넛츠 of 넛츠 피스타치오와의 완벽한 만남\n\n하겐다즈만의 깊고 진한 크림에 프리미엄 피스타치오 원물 본연의 고소함이 어우러져 깊은 풍미를 선사합니다.',
      zh: '优质开心果和奶油，风味浓郁。'
    },
    image: '/images/image3.png',
    color: '#E08E8E'
  },
  {
    id: 'hd-caramel-biscuit',
    name: { en: 'Caramel Biscuit & Cream', ko: '카라멜 비스킷 & 크림', zh: '焦糖饼干奶油' },
    description: { 
      en: 'Authentic Caramel Biscuit & Cream.',
      ko: '벨기에 정통 카라멜 비스킷, 로투스가 가득\n카라멜 비스킷 & 크림',
      zh: '正宗焦糖饼干和奶油。'
    },
    image: '/images/image4.png',
    color: '#8A9A5B'
  }
];

export const LANGUAGES = [
  { code: 'ko', name: 'Korean' },
  { code: 'en', name: 'English' },
  { code: 'zh', name: 'Chinese' }
];
