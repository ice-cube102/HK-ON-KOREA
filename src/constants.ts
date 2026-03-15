export interface Product {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  image: string;
  detailImages: string[];
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
    name: { en: 'Häagen-Dazs', ko: '하겐다즈', zh: '哈根达斯' },
    description: { 
      en: 'Häagen-Dazs',
      ko: '하겐다즈',
      zh: '哈根达斯'
    },
    image: '/images/image6.png',
    detailImages: ['/images/image2.png', '/images/image3.png', '/images/image4.png', '/images/image5.png'],
    color: '#F3E5AB'
  },
  {
    id: 'hd-cookies-cream',
    name: { en: 'Caraci Pistachio Cream', ko: '카라치 피스타치오 크림', zh: '卡拉奇开心果奶油' },
    description: { 
      en: 'Caraci Pistachio Cream',
      ko: '카라치 피스타치오 크림',
      zh: '卡拉奇开心果奶油'
    },
    image: '/images/image7.png',
    detailImages: ['/images/image8.png', '/images/image9.png', '/images/image10.png'],
    color: '#4B3621'
  },
  {
    id: 'hd-pistachio-cream',
    name: { en: 'Nature Valley', ko: 'Nature Valley', zh: '自然谷' },
    description: { 
      en: 'Nature Valley',
      ko: 'Nature Valley',
      zh: '自然谷'
    },
    image: '/images/image11.png',
    detailImages: ['/images/image12.png', '/images/image13.png'],
    color: '#E08E8E'
  },
  {
    id: 'hd-caramel-biscuit',
    name: { en: 'Fruit By The Foot', ko: 'Fruit By The Foot', zh: '水果卷' },
    description: { 
      en: 'Fruit By The Foot',
      ko: 'Fruit By The Foot',
      zh: '水果卷'
    },
    image: '/images/image14.png',
    detailImages: ['/images/image15.png', '/images/image16.png'],
    color: '#8A9A5B'
  }
];

export const LANGUAGES = [
  { code: 'ko', name: 'Korean' },
  { code: 'en', name: 'English' },
  { code: 'zh', name: 'Chinese' }
];
