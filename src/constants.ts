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
  fr: {
    heroTitle: "Créer de la valeur par la satisfaction client",
    heroSubtitle: "Une entreprise qui apporte santé et joie. C'est la vision et la mission de 에이치케이온.",
    exploreProducts: "Voir les détails",
    company: "Entreprise",
    products: "Produits",
    support: "Assistance",
    resources: "Ressources",
    ir: "IR",
    csr: "RSE",
    infoCenter: "Centre d'information",
    careers: "Carrières",
    notice: "Avis",
    gallery: "Galerie",
    contactUs: "Contactez-nous",
    inquiry: "Demande",
    remoteSupport: "Assistance à distance",
    customerSupport: "Service Client",
    training: "Formation",
    footerText: "© 2026 에이치케이온. Tous droits réservés.",
    privacyPolicy: "Politique de confidentialité",
    termsOfService: "Conditions d'utilisation",
    sitemap: "Plan du site",
    location: "Emplacement",
    readMore: "Lire la suite"
  },
  ja: {
    heroTitle: "顧客満足を通じた価値創造",
    heroSubtitle: "健康と喜びをもたらす企業。それが에이치케이온のビジョンとミッションです。",
    exploreProducts: "詳細を見る",
    company: "会社紹介",
    products: "製品紹介",
    support: "顧客サポート",
    resources: "資料室",
    ir: "投資情報",
    csr: "社会貢献",
    infoCenter: "情報センター",
    careers: "採用情報",
    notice: "お知らせ",
    gallery: "ギャラリー",
    contactUs: "お問い合わせ",
    inquiry: "見積もり依頼",
    remoteSupport: "遠隔サポート",
    customerSupport: "顧客サポート",
    training: "教育申請",
    footerText: "© 2026 에이치케이온. All rights reserved.",
    privacyPolicy: "個人情報保護方針",
    termsOfService: "利用規約",
    sitemap: "サイトマップ",
    location: "アクセス",
    readMore: "もっと見る"
  }
};

export const PRODUCTS: Product[] = [
  {
    id: 'kombucha',
    name: { en: 'Signature Kombucha', ko: '시그니처 콤부차', fr: 'Kombucha Signature', ja: 'シグネチャーコンブチャ' },
    description: { 
      en: 'A refreshing, naturally fermented tea rich in probiotics and antioxidants to revitalize your day.',
      ko: '프로바이오틱스와 항산화 물질이 풍부하여 활력을 되찾아주는 상쾌하고 자연 발효된 콤부차입니다.',
      fr: 'Un thé rafraîchissant, naturellement fermenté, riche en probiotiques et antioxydants pour revitaliser votre journée.',
      ja: 'プロバイオティクスと抗酸化物質が豊富で、一日を活性化させる爽やかな自然発酵茶です。'
    },
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop',
    color: '#E8A87C'
  },
  {
    id: 'red-ginseng',
    name: { en: 'Premium Red Ginseng', ko: '프리미엄 홍삼정', fr: 'Ginseng Rouge Premium', ja: 'プレミアム紅参' },
    description: { 
      en: 'Deeply concentrated 6-year-old Korean red ginseng extract for ultimate immune support and energy.',
      ko: '최고의 면역력 지원과 에너지를 위한 깊고 진한 6년근 한국산 홍삼 농축액입니다.',
      fr: 'Extrait de ginseng rouge coréen de 6 ans d\'âge profondément concentré pour un soutien immunitaire et une énergie ultimes.',
      ja: '究極の免疫サポートとエネルギーのための、深く濃縮された6年根の高麗紅参エキスです。'
    },
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=800&auto=format&fit=crop',
    color: '#8B0000'
  },
  {
    id: 'granola',
    name: { en: 'Organic Granola Bites', ko: '유기농 그래놀라 바이트', fr: 'Bouchées de Granola Bio', ja: 'オーガニックグラノーラバイツ' },
    description: { 
      en: 'Oven-baked clusters of organic oats, nuts, and honey. A perfect crunchy and healthy snack.',
      ko: '유기농 귀리, 견과류, 꿀을 오븐에 구운 클러스터. 완벽하게 바삭하고 건강한 간식입니다.',
      fr: 'Grappes cuites au four d\'avoine biologique, de noix et de miel. Une collation croquante et saine parfaite.',
      ja: 'オーガニックオーツ麦、ナッツ、蜂蜜をオーブンで焼き上げたクラスター。完璧にサクサクで健康的なスナックです。'
    },
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=800&auto=format&fit=crop',
    color: '#D2B48C'
  },
  {
    id: 'artisan-tea',
    name: { en: 'Artisan Blended Tea', ko: '아티잔 블렌디드 티', fr: 'Thé Mélangé Artisanal', ja: '職人ブレンドティー' },
    description: { 
      en: 'A calming blend of hand-picked herbs and flowers, designed to soothe your mind and body.',
      ko: '몸과 마음을 진정시키기 위해 세심하게 디자인된 수제 허브와 꽃의 차분한 블렌드입니다.',
      fr: 'Un mélange apaisant d\'herbes et de fleurs cueillies à la main, conçu pour apaiser votre esprit et votre corps.',
      ja: '心と体を落ち着かせるためにデザインされた、手摘みのハーブと花の穏やかなブレンドです。'
    },
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop',
    color: '#9DC183'
  }
];

export const NOTICES = [
  { id: 1, title: { ko: '2026 상반기 신제품 출시 안내', en: '2026 First Half New Product Launch', fr: 'Lancement de nouveaux produits premier semestre 2026', ja: '2026年上半期新製品発売のご案内' }, date: '26.03.10' },
  { id: 2, title: { ko: '에이치케이온 글로벌 식품 박람회 참가', en: '에이치케이온 Participates in Global Food Expo', fr: '에이치케이온 participe à l\'Expo alimentaire mondiale', ja: '에이치케이온 グローバル食品博覧会参加' }, date: '26.02.28' },
  { id: 3, title: { ko: '2025 지속가능경영 보고서 발간', en: '2025 Sustainability Report Published', fr: 'Publication du rapport de développement durable 2025', ja: '2025年持続可能性報告書発行' }, date: '25.12.15' },
  { id: 4, title: { ko: '에이치케이온 고객센터 운영 시간 변경 안내', en: '에이치케이온 Customer Center Operating Hours Change', fr: 'Changement des heures d\'ouverture du centre client 에이치케이온', ja: '에이치케이온 カスタマーセンター営業時間変更のご案内' }, date: '25.11.02' }
];

export const LANGUAGES = [
  { code: 'ko', name: 'Korean' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'ja', name: 'Japan' }
];
