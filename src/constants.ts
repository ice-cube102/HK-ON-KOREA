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
    heroSubtitle: "A company that brings health and joy. This is the vision and mission of HKON.",
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
    footerText: "© 2026 HKON. All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    sitemap: "Sitemap",
    location: "Location",
    readMore: "Read More",
    hkonKorea: "HKON Korea",
    hkon: "HKON"
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
    readMore: "더보기",
    hkonKorea: "에이치케이온 코리아",
    hkon: "에이치케이온"
  },
  zh: {
    heroTitle: "通过客户满意创造价值",
    heroSubtitle: "一家带来健康和快乐的公司。这是 HKON 的愿景和使命。",
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
    footerText: "© 2026 HKON。版权所有。",
    privacyPolicy: "隐私政策",
    termsOfService: "服务条款",
    sitemap: "网站地图",
    location: "位置",
    readMore: "阅读更多",
    hkonKorea: "HKON 韩国",
    hkon: "HKON"
  }
};

export const PRODUCTS: Product[] = [
  {
    id: 'hd-vanilla',
    name: { en: 'Häagen-Dazs', ko: '하겐다즈', zh: '哈根达斯' },
    description: { 
      en: 'Experience the rich and deep flavor of Häagen-Dazs, the standard of premium ice cream. Made with only the finest ingredients, it offers an unforgettable taste.',
      ko: '프리미엄 아이스크림의 기준, 하겐다즈의 깊고 진한 풍미를 경험해보세요. 엄선된 최고의 재료만을 사용하여 잊을 수 없는 맛을 선사합니다.',
      zh: '体验哈根达斯浓郁醇厚的风味，高级冰淇淋的标杆。仅使用最优质的原料制成，提供令人难忘的口感。'
    },
    image: '/images/image6.png',
    detailImages: ['/images/image2.png', '/images/image3.png', '/images/image4.png', '/images/image5.png'],
    color: '#F3E5AB'
  },
  {
    id: 'hd-cookies-cream',
    name: { en: 'Caraci Pistachio Cream', ko: '카라치 피스타치오 크림', zh: '卡拉奇开心果奶油' },
    description: { 
      en: 'Caraci Pistachio Cream. A luxurious spread made with premium pistachios. Perfect for spreading on toast, adding to desserts, or enjoying straight from the jar.',
      ko: '카라치 피스타치오 크림. 최고급 피스타치오로 만든 럭셔리한 스프레드입니다. 토스트에 발라 먹거나 디저트에 추가하거나 그대로 즐기기에 완벽합니다.',
      zh: '卡拉奇开心果奶油。用优质开心果制成的奢华涂抹酱。非常适合涂抹在吐司上，添加到甜点中，或直接从罐子里享用。'
    },
    image: '/images/image7.png',
    detailImages: ['/images/image8.png', '/images/image9.png', '/images/image10.png'],
    color: '#4B3621'
  },
  {
    id: 'hd-pistachio-cream',
    name: { en: 'Nature Valley', ko: 'Nature Valley', zh: '自然谷' },
    description: { 
      en: 'Nature Valley Protein Bar Peanut Butter Dark Chocolate. A convenient way to get 10g of protein a day. The perfect harmony of chewy peanuts and chocolate.',
      ko: '네이처밸리 프로틴바 피넛버터 다크 초콜릿\n하루 10g 간편한 단백질 섭취\n피넛과 초콜릿의 쫀득한 조화',
      zh: '自然谷花生酱黑巧克力蛋白棒。每天方便摄取10克蛋白质。耐嚼花生和巧克力的完美结合。'
    },
    image: '/images/image11.png',
    detailImages: ['/images/image12.png', '/images/image13.png'],
    color: '#E08E8E'
  },
  {
    id: 'hd-caramel-biscuit',
    name: { en: 'Fruit By The Foot', ko: 'Fruit By The Foot', zh: '水果卷' },
    description: { 
      en: '1M long roll-type jelly! Fun to unroll and eat. Contains 12% fruit puree (berry & strawberry). Perfect for kids snacks, playtime, kindergarten/school events, and special gifts.',
      ko: '1M 길이의 롤 타입 젤리로 도르르 풀어먹는 재미!\n12% 과일 퓨레 함유(베리&딸기).\n아이 간식 및 놀이 타임, 유치원/학교 이벤트 간식, 특별한 날 선물로 완벽합니다.',
      zh: '1米长的卷型果冻！解开吃很有趣。含有12%的水果泥（浆果和草莓）。非常适合儿童零食、游戏时间、幼儿园/学校活动和特殊礼物。'
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
