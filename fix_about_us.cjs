const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const startIndex = code.indexOf('const getAboutUsContent = (lang: string, dark: boolean) => {');
const endIndex = code.indexOf('const getWhatsNewContent = (lang: string, dark: boolean) => {');

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = `const getAboutUsContent = (lang: string, dark: boolean) => {
    return (
      <motion.div 
        initial="hidden" animate="visible" 
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
        className={\`space-y-8 \${dark ? 'text-gray-300' : 'text-gray-700'}\`}
      >
        <div className="space-y-4">
          <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className={\`text-2xl font-black leading-relaxed \${dark ? 'text-blue-400' : 'text-[#6D1B2A]'}\`}>
            {lang === 'ko' 
              ? "글로벌 미식 문화의 새로운 기준, 에이치케이온(HKON)" 
              : lang === 'zh' 
              ? "全球美食文化的新标杆，HKON" 
              : "The new standard of global gastronomy, HKON."}
          </motion.p>
          <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="leading-relaxed text-lg font-medium">
            {lang === 'ko'
              ? "에이치케이온(HKON)은 세계 각국의 프리미엄 F&B 브랜드를 발굴하여 국내 소비자에게 최상의 미식 경험을 제공하는 종합 식품 유통 기업입니다. 우리는 단순한 수입을 넘어 다변화하는 이커머스 생태계를 주도하고, 체계적인 물류 인프라를 바탕으로 B2B와 B2C를 아우르는 혁신적인 비즈니스 모델을 전개하고 있습니다."
              : lang === 'zh'
              ? "HKON 是一家综合性食品分销企业，致力于发掘世界各地的高端餐饮品牌，为国内消费者提供顶级的味蕾体验。我们超越了传统的进口业务，正在引领不断演变的电子商务生态系统，并依托系统化的物流基础设施，开展涵盖 B2B 和 B2C 的创新商业模式。"
              : "HKON is a comprehensive food distribution enterprise that discovers premium F&B brands from around the world to provide domestic consumers with the ultimate gastronomic experience. Going beyond simple importation, we are leading the diversifying e-commerce ecosystem and unfolding an innovative business model encompassing both B2B and B2C based on a systematic logistics infrastructure."}
          </motion.p>
        </div>
        
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* 1. 식품 수입 유통 */}
          <div className={\`p-8 rounded-3xl border \${dark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700/50' : 'bg-gray-50 border-gray-100 hover:bg-white'} shadow-lg transition-colors flex flex-col gap-4 group\`}>
            <div className={\`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors \${dark ? 'bg-blue-900/30 text-blue-400 group-hover:bg-blue-500 group-hover:text-white' : 'bg-red-50 text-[#6D1B2A] group-hover:bg-[#6D1B2A] group-hover:text-white'}\`}>
              <Globe size={28} />
            </div>
            <h4 className={\`text-xl font-bold \${dark ? 'text-white' : 'text-gray-900'}\`}>
              {lang === 'ko' ? '식품 수입 유통' : lang === 'zh' ? '食品进口与分销' : 'Food Import & Distribution'}
            </h4>
            <p className={\`text-sm leading-relaxed \${dark ? 'text-gray-400' : 'text-gray-600'}\`}>
              {lang === 'ko' 
                ? '글로벌 소싱 네트워크를 통해 전 세계의 프리미엄 식품 브랜드를 발굴하고 국내 시장에 안정적으로 공급합니다.' 
                : lang === 'zh' 
                ? '通过我们的全球采购网络，发掘世界各地的高端食品品牌，并向国内市场提供稳定的供应。' 
                : 'Discovering premium food brands worldwide through our global sourcing network and providing a stable supply to the domestic market.'}
            </p>
          </div>

          {/* 2. 이커머스 */}
          <div className={\`p-8 rounded-3xl border \${dark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700/50' : 'bg-gray-50 border-gray-100 hover:bg-white'} shadow-lg transition-colors flex flex-col gap-4 group\`}>
            <div className={\`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors \${dark ? 'bg-blue-900/30 text-blue-400 group-hover:bg-blue-500 group-hover:text-white' : 'bg-red-50 text-[#6D1B2A] group-hover:bg-[#6D1B2A] group-hover:text-white'}\`}>
              <ShoppingCart size={28} />
            </div>
            <h4 className={\`text-xl font-bold \${dark ? 'text-white' : 'text-gray-900'}\`}>
              {lang === 'ko' ? '이커머스 운영' : lang === 'zh' ? '电子商务运营' : 'E-commerce Operations'}
            </h4>
            <p className={\`text-sm leading-relaxed \${dark ? 'text-gray-400' : 'text-gray-600'}\`}>
              {lang === 'ko' 
                ? '국내 메인 온라인 플랫폼의 유통을 전면 주도하며, 전략적인 마케팅과 최적화된 세일즈로 폭발적인 성장을 이끌어냅니다.' 
                : lang === 'zh' 
                ? '全面主导国内主要在线平台的销售，通过战略营销和优化的销售策略推动爆发式增长。' 
                : 'Leading distribution across major online platforms with strategic marketing and optimized sales for explosive growth.'}
            </p>
          </div>

          {/* 3. 하겐다즈 대리점 */}
          <div className={\`p-8 rounded-3xl border \${dark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700/50' : 'bg-gray-50 border-gray-100 hover:bg-white'} shadow-lg transition-colors flex flex-col gap-4 group\`}>
            <div className={\`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors \${dark ? 'bg-blue-900/30 text-blue-400 group-hover:bg-blue-500 group-hover:text-white' : 'bg-red-50 text-[#6D1B2A] group-hover:bg-[#6D1B2A] group-hover:text-white'}\`}>
              <Store size={28} />
            </div>
            <h4 className={\`text-xl font-bold \${dark ? 'text-white' : 'text-gray-900'}\`}>
              {lang === 'ko' ? '하겐다즈 공식 대리점' : lang === 'zh' ? '哈根达斯官方代理商' : 'Häagen-Dazs Agency'}
            </h4>
            <p className={\`text-sm leading-relaxed \${dark ? 'text-gray-400' : 'text-gray-600'}\`}>
              {lang === 'ko' 
                ? '글로벌 프리미엄 아이스크림 브랜드 \\'하겐다즈\\'의 핵심 대리점으로서 주요 온라인 채널의 유통과 판매를 전담하며 성장을 견인합니다.' 
                : lang === 'zh' 
                ? '作为全球高端冰淇淋品牌“哈根达斯”的核心代理商，我们全权负责主要在线渠道的分销与销售，稳固地推动其业务增长。' 
                : 'As a core agency for the global premium ice cream brand \\'Häagen-Dazs\\', we exclusively manage distribution and sales across major online channels, firmly driving growth.'}
            </p>
          </div>

          {/* 4. 3PL */}
          <div className={\`p-8 rounded-3xl border \${dark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700/50' : 'bg-gray-50 border-gray-100 hover:bg-white'} shadow-lg transition-colors flex flex-col gap-4 group\`}>
            <div className={\`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors \${dark ? 'bg-blue-900/30 text-blue-400 group-hover:bg-blue-500 group-hover:text-white' : 'bg-red-50 text-[#6D1B2A] group-hover:bg-[#6D1B2A] group-hover:text-white'}\`}>
              <Truck size={28} />
            </div>
            <h4 className={\`text-xl font-bold \${dark ? 'text-white' : 'text-gray-900'}\`}>
              {lang === 'ko' ? '올인원 3PL 풀필먼트' : lang === 'zh' ? '多合一 3PL 履行' : 'All-in-One 3PL Fulfillment'}
            </h4>
            <p className={\`text-sm leading-relaxed \${dark ? 'text-gray-400' : 'text-gray-600'}\`}>
              {lang === 'ko' 
                ? '대규모 냉동창고와 자체 작업 라인을 구축하여, 배송비 절감을 통한 대량 포장 및 전문적인 택배 대행 등 최적화된 콜드체인 물류 솔루션을 제공합니다.' 
                : lang === 'zh' 
                ? '通过建立大型冷库和自有作业线，提供降低配送成本的批量包装以及专业快递代理等优化冷链物流解决方案。' 
                : 'By establishing large-scale cold storage and in-house operation lines, we provide optimized cold-chain logistics solutions, including bulk packaging to reduce shipping costs and professional courier agency services.'}
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  `;

  code = code.substring(0, startIndex) + newContent + code.substring(endIndex);
  fs.writeFileSync('src/App.tsx', code, 'utf-8');
  console.log("File fixed.");
} else {
  console.log("Could not find start or end index.");
}
