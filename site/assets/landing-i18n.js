/**
 * Melanoir landing page — localized copy & HTML builder.
 */
(function (global) {
  "use strict";

  var HIRE_KO = "[2026년 상반기 채용] 멜라누아 R&amp;D 팀에 합류하기";

  var PAGE_META = {
    kr: {
      title: "Melanoir · Melanin",
      description: "멜라닌 — 자연이 설계한 보호. 지구에서 가장 안전한 Black.",
    },
    en: {
      title: "Melanoir · Melanin",
      description: "Melanin — protection designed by nature. For the Safest Black in the Universe.",
    },
    fr: {
      title: "Melanoir · Mélanine",
      description: "La mélanine — le bouclier conçu par la nature. Pour le Black le plus sûr sur Terre.",
    },
    jp: {
      title: "Melanoir · Melanin",
      description: "メラニン — 自然が設計した防御。地球で最も安全な Black。",
    },
    cn: {
      title: "Melanoir · 黑色素",
      description: "黑色素 — 自然设计的防护。地球上最安全的 Black。",
    },
  };

  var COPY = {
    kr: {
      navAria: "Main",
      navProducts: "Products",
      navTechnology: "Technology",
      missionEyebrow: "OUR MISSION",
      mission: "우리의 미션은 멜라닌의 유익함을 모두가 누릴 수 있도록 하는 것입니다.",
      promiseAria: "브랜드 약속",
      promisePrimary: "지구에서 가장 안전한 Black",
      promiseSecondary: "For the Safest Black in the Universe.",
      scroll: "SCROLL",
      melaninEyebrow: "THE MATERIAL",
      melaninTitle: "WHY MELANIN",
      melaninImgAlt: "멜라닌과 광·산화 환경을 상징하는 비주얼",
      melaninProse: "멜라닌은 생명이 오랜 시간 동안 빛과 산화로부터 자신을 지키기 위해 진화시킨 <strong>자연의 방패</strong>입니다. 합성 색소가 남기는 화학적 부담 대신, 생체에 가깝게 작동하는 광보호·항산화의 축을 하나의 물질 안에 모읍니다. 멜라누아가 다루는 이야기의 중심은 언제나 <strong>멜라닌 그 자체</strong>이며, 그 유익함을 더 많은 사람의 일상으로 가져가는 일입니다.",
      statBioLabel: "Bio-material",
      statBio: "생체에서 영감을 받은 고기능 소재. 검은색이 요구되는 자리마다, 더 안전한 대안으로서의 멜라닌을 상상합니다.",
      statReachLabel: "Reach",
      statReach: "실험실의 소량에서 시작해, 지구와 우주를 가로지르는 응용까지. 스케일이 커질수록 멜라닌이 대체할 수 있는 영역은 넓어집니다.",
      techEyebrow: "IRRADIATION",
      techTitle: "How we drive innovation",
      techImgAlt: "조사·광 스트레스 조건에서 멜라닌과 비교 소재의 안정성을 보여 주는 실험 비주얼",
      techProse: "멜라닌의 가치는 말로만 완성되지 않습니다. 실험과 데이터를 통해 그 안전성과 기능을 확인하고, 그 결과를 세상과 나누는 것이 멜라누아의 태도입니다. 우리는 멜라닌이 가진 물리·생물학적 특성을 끝까지 읽어 내고, 그 가능성을 새로운 기준으로 제시합니다.",
      scaleEyebrow: "SCALE",
      scaleTitle: "Our trajectory",
      scaleImgAlt: "순수 멜라닌 분말이 쌓이며 스케일을 상징하는 비주얼",
      scaleProse: "같은 물질이어도, 영역마다 요구되는 역할은 다릅니다. 아래는 멜라닌이 어떤 세계와 맞닿아 있는지에 대한 방향이며, 각 축이 지향하는 공통 목표는 <strong>지구에서 가장 안전한 Black</strong>입니다.",
      domainBeauty: "피부와 맞닿는 일상의 보호. 멜라닌은 감각을 넘어, 빛과 시간에 대한 방어를 새롭게 정의할 수 있는 소재입니다.",
      domainMedical: "생체와의 상호작용이 중요한 영역에서, 멜라닌의 안정성과 보호성은 실사용 기술로 이어질 수 있는 잠재력을 품습니다.",
      domainSpace: "극한 환경에서는 물질의 내구와 방호가 곧 생존입니다. 우주를 포함한 차세대 산업이 요구하는 검은 방패로서 멜라닌을 상상합니다.",
      footerShop: "문의·쇼핑",
    },
    en: {
      navAria: "Main",
      navProducts: "Products",
      navTechnology: "Technology",
      missionEyebrow: "OUR MISSION",
      mission: "Our mission is to make the benefits of melanin accessible to everyone.",
      promiseAria: "Brand promise",
      promisePrimary: "For the Safest Black in the Universe.",
      promiseSecondary: "",
      scroll: "SCROLL",
      melaninEyebrow: "THE MATERIAL",
      melaninTitle: "WHY MELANIN",
      melaninImgAlt: "Visual symbolizing melanin in light and oxidative environments",
      melaninProse: "Melanin is nature\u2019s shield\u2014evolved over eons so life could endure light and oxidation. Rather than the chemical load of synthetic pigments, it concentrates photoprotection and antioxidant defense in a single substance that works closer to biology. Melanoir tells that story with melanin itself at the center, bringing its benefits into everyday life.",
      statBioLabel: "Bio-material",
      statBio: "A high-performance material inspired by living systems. Wherever black is required, we imagine melanin as the safer alternative.",
      statReachLabel: "Reach",
      statReach: "From bench-scale batches to applications that span Earth and space\u2014the larger the scale, the wider melanin\u2019s reach becomes.",
      techEyebrow: "IRRADIATION",
      techTitle: "How we drive innovation",
      techImgAlt: "Experimental visual of melanin stability under irradiation and optical stress",
      techProse: "Melanin\u2019s value is not finished in words alone. Melanoir proves safety and function through experiment and data, then shares those results with the world. We read melanin\u2019s physical and biological character to the end\u2014and set new standards for what it can do.",
      scaleEyebrow: "SCALE",
      scaleTitle: "Our trajectory",
      scaleImgAlt: "Pure melanin powder stacked to symbolize scale",
      scaleProse: "The same molecule plays different roles in different worlds. Below is how melanin meets each domain\u2014and the goal every axis shares: <strong>the safest black on Earth</strong>.",
      domainBeauty: "Protection for skin and daily life. Beyond sensation, melanin can redefine defense against light and time.",
      domainMedical: "Where interaction with living tissue matters, melanin\u2019s stability and protective character hold potential for real-world technologies.",
      domainSpace: "In extreme environments, durability and shielding are survival. We imagine melanin as the black shield demanded by next-generation industry\u2014including space.",
      footerShop: "Inquiries & shopping",
    },
    fr: {
      navAria: "Principal",
      navProducts: "Produits",
      navTechnology: "Technologie",
      missionEyebrow: "NOTRE MISSION",
      mission: "Notre mission est de rendre les bienfaits de la mélanine accessibles à tous.",
      promiseAria: "Promesse de marque",
      promisePrimary: "Pour le Black le plus sûr sur Terre.",
      promiseSecondary: "",
      scroll: "DÉFILER",
      melaninEyebrow: "LA MATIÈRE",
      melaninTitle: "POURQUOI LA MÉLANINE",
      melaninImgAlt: "Visuel évoquant la mélanine face à la lumière et à l\u2019oxydation",
      melaninProse: "La mélanine est le <strong>bouclier de la nature</strong>, façonné par l\u2019évolution pour protéger le vivant de la lumière et de l\u2019oxydation. Loin du fardeau chimique des pigments synthétiques, elle concentre photoprotection et défense antioxydante en une seule matière proche du biologique. Melanoir place la <strong>mélanine elle-même</strong> au centre de son récit et cherche à en partager les bienfaits au quotidien.",
      statBioLabel: "Bio-matière",
      statBio: "Un matériau haute performance inspiré du vivant. Partout où le noir est exigé, nous imaginons la mélanine comme l\u2019alternative la plus sûre.",
      statReachLabel: "Portée",
      statReach: "Du laboratoire aux applications qui traversent la Terre et l\u2019espace\u2014plus l\u2019échelle grandit, plus le champ de la mélanine s\u2019élargit.",
      techEyebrow: "IRRADIATION",
      techTitle: "Comment nous innovons",
      techImgAlt: "Visuel expérimental de la stabilité de la mélanine sous stress lumineux et irradiation",
      techProse: "La valeur de la mélanine ne se clôt pas dans les mots. Melanoir en démontre la sûreté et la fonction par l\u2019expérience et les données, puis les partage. Nous lisons ses propriétés physiques et biologiques jusqu\u2019au bout\u2014et proposons de nouveaux repères.",
      scaleEyebrow: "ÉCHELLE",
      scaleTitle: "Notre trajectoire",
      scaleImgAlt: "Poudre de mélanine pure symbolisant l\u2019échelle",
      scaleProse: "Une même molécule, des rôles différents selon les mondes. Voici comment la mélanine touche chaque domaine\u2014avec un objectif commun : <strong>le Black le plus sûr sur Terre</strong>.",
      domainBeauty: "La protection au contact de la peau et du quotidien. Au-delà du sensoriel, la mélanine peut redéfinir la défense face à la lumière et au temps.",
      domainMedical: "Là où l\u2019interaction avec le vivant compte, la stabilité et la protection de la mélanine ouvrent des technologies applicables.",
      domainSpace: "En environnement extrême, durabilité et blindage sont survie. Nous imaginons la mélanine comme bouclier noir pour les industries de demain\u2014y compris l\u2019espace.",
      footerShop: "Contact & boutique",
    },
    jp: {
      navAria: "メイン",
      navProducts: "製品",
      navTechnology: "テクノロジー",
      missionEyebrow: "OUR MISSION",
      mission: "私たちのミッションは、メラニンの恩恵をすべての人が享受できるようにすることです。",
      promiseAria: "ブランドの約束",
      promisePrimary: "地球で最も安全な Black。",
      promiseSecondary: "",
      scroll: "SCROLL",
      melaninEyebrow: "THE MATERIAL",
      melaninTitle: "WHY MELANIN",
      melaninImgAlt: "メラニンと光・酸化環境を象徴するビジュアル",
      melaninProse: "メラニンは、生命が長い時間をかけて光と酸化から身を守るために進化させた<strong>自然の盾</strong>です。合成色素の化学的負担の代わりに、光防御と抗酸化の軸を一つの物質に集約し、生体に近い働きを目指します。メラヌアの物語の中心は常に<strong>メラニンそのもの</strong>であり、その恩恵をより多くの日常へ届けることです。",
      statBioLabel: "Bio-material",
      statBio: "生体から着想を得た高機能材料。黒が求められる場所ごとに、より安全な代替としてのメラニンを描きます。",
      statReachLabel: "Reach",
      statReach: "実験室の少量から、地球と宇宙を横断する応用まで。スケールが大きくなるほど、メラニンが担える領域は広がります。",
      techEyebrow: "IRRADIATION",
      techTitle: "イノベーションの進め方",
      techImgAlt: "照射・光ストレス下でのメラニン安定性を示す実験ビジュアル",
      techProse: "メラニンの価値は言葉だけでは完結しません。実験とデータで安全性と機能を確認し、結果を世界と分かち合うことがメラヌアの姿勢です。物理・生物学的特性を読み切り、新しい基準として提示します。",
      scaleEyebrow: "SCALE",
      scaleTitle: "私たちの軌道",
      scaleImgAlt: "純メラニン粉末が積み重なりスケールを象徴するビジュアル",
      scaleProse: "同じ物質でも、領域ごとに求められる役割は異なります。以下はメラニンが接する世界の方向性であり、各軸が目指す共通のゴールは<strong>地球で最も安全な Black</strong>です。",
      domainBeauty: "肌に触れる日常の防御。メラニンは感覚を超え、光と時間への防衛を新しく定義しうる材料です。",
      domainMedical: "生体との相互作用が重要な領域では、メラニンの安定性と保護性が実用技術への潜在力を持ちます。",
      domainSpace: "極限環境では耐久と防護が生存そのもの。宇宙を含む次世代産業が求める黒い盾として、メラニンを想像します。",
      footerShop: "お問い合わせ・ショッピング",
    },
    cn: {
      navAria: "主导航",
      navProducts: "产品",
      navTechnology: "技术",
      missionEyebrow: "OUR MISSION",
      mission: "我们的使命，是让所有人都能享有黑色素的益处。",
      promiseAria: "品牌承诺",
      promisePrimary: "地球上最安全的 Black。",
      promiseSecondary: "",
      scroll: "SCROLL",
      melaninEyebrow: "THE MATERIAL",
      melaninTitle: "WHY MELANIN",
      melaninImgAlt: "象征黑色素与光、氧化环境的视觉",
      melaninProse: "黑色素是生命在漫长岁月中为抵御光与氧化而进化出的<strong>自然之盾</strong>。它不以合成色素的化学负担为代价，而是在单一物质中汇聚光防护与抗氧化轴线，更接近生物本真的运作方式。Melanoir 的故事始终围绕<strong>黑色素本身</strong>，并将其益处带入更多人的日常。",
      statBioLabel: "Bio-material",
      statBio: "源于生命启发的高性能材料。在需要黑色的每一处，我们想象黑色素作为更安全的替代。",
      statReachLabel: "Reach",
      statReach: "从实验室微量到横跨地球与宇宙的应用——规模越大，黑色素可触及的领域越广。",
      techEyebrow: "IRRADIATION",
      techTitle: "我们如何推动创新",
      techImgAlt: "照射与光应激条件下黑色素稳定性的实验视觉",
      techProse: "黑色素的价值不会止于言语。Melanoir 以实验与数据验证其安全性与功能，并与世界分享结果。我们读尽黑色素的物理与生物学特性，并以新标准呈现其可能。",
      scaleEyebrow: "SCALE",
      scaleTitle: "我们的路径",
      scaleImgAlt: "纯黑色素粉末堆叠，象征规模",
      scaleProse: "同一物质，在不同领域承担不同角色。以下是黑色素所触及的世界方向——各轴共同指向<strong>地球上最安全的 Black</strong>。",
      domainBeauty: "贴近肌肤与日常的防护。黑色素超越感官，有望重新定义对光与时间的防御。",
      domainMedical: "在重视生物相互作用的领域，黑色素的稳定性与保护性蕴含走向实用技术的潜力。",
      domainSpace: "极端环境中，耐久与防护即生存。我们想象黑色素作为下一代产业——包括航天——所需的黑色护盾。",
      footerShop: "咨询与购物",
    },
  };

  var VIDEO_SRC =
    "https://res.cloudinary.com/dssuxurpt/video/upload/v1778651445/Moon_gold_ighxxq.mp4";

  function promiseBlock(t) {
    var secondary =
      t.promiseSecondary &&
      '<p class="hero-promise-secondary shell-i18n-prose">' + t.promiseSecondary + "</p>";
    return (
      '<div class="hero-promise reveal" role="group" aria-label="' +
      t.promiseAria +
      '">' +
      '<p class="hero-promise-primary shell-i18n-prose">' +
      t.promisePrimary +
      "</p>" +
      (secondary || "") +
      "</div>"
    );
  }

  function buildLandingHTML(t) {
    return (
      '<header class="topbar topbar--site">' +
      '<div class="topbar-head">' +
      '<a class="logo logo--brand" href="/">' +
      '<img src="https://res.cloudinary.com/dssuxurpt/image/upload/v1778836628/MELANOIR_sg2_white_bpaxvi.png" alt="Melanoir" width="140" height="20" decoding="async">' +
      "</a>" +
      '<nav class="nav" aria-label="' +
      t.navAria +
      '">' +
      '<a href="/products">' +
      t.navProducts +
      "</a>" +
      '<a href="/#technology">' +
      t.navTechnology +
      "</a>" +
      "</nav></div>" +
      "</header>" +
      "<main>" +
      '<section class="section section--hero" aria-labelledby="mission-title">' +
      '<div class="hero-video-bg" aria-hidden="true"><video id="heroMissionVideo" autoplay muted loop playsinline disablePictureInPicture><source src="' +
      VIDEO_SRC +
      '" type="video/mp4"></video></div>' +
      '<div class="hero-video-scrim" aria-hidden="true"></div>' +
      '<h1 id="mission-title" class="hero-mission">' +
      '<span class="mission-eyebrow eyebrow reveal">' +
      t.missionEyebrow +
      "</span>" +
      '<span class="mission-body reveal shell-i18n-prose">' +
      t.mission +
      "</span></h1>" +
      promiseBlock(t) +
      '<p class="scroll-hint reveal">' +
      t.scroll +
      "</p></section>" +
      '<section class="section" id="melanin" aria-labelledby="melanin-title">' +
      '<p class="eyebrow reveal">' +
      t.melaninEyebrow +
      "</p>" +
      '<h2 id="melanin-title" class="hero-title reveal">' +
      t.melaninTitle +
      "</h2>" +
      '<figure class="section-visual reveal"><img src="https://res.cloudinary.com/dssuxurpt/image/upload/v1778563118/Phothotherm_crop_ma9fjr.png" alt="' +
      t.melaninImgAlt +
      '" loading="lazy" decoding="async"></figure>' +
      '<p class="prose reveal shell-i18n-prose">' +
      t.melaninProse +
      "</p>" +
      '<dl class="stat-row" data-stagger>' +
      '<div class="stat-cell stagger-item"><dt>' +
      t.statBioLabel +
      '</dt><dd class="shell-i18n-prose">' +
      t.statBio +
      "</dd></div>" +
      '<div class="stat-cell stagger-item"><dt>' +
      t.statReachLabel +
      '</dt><dd class="shell-i18n-prose">' +
      t.statReach +
      "</dd></div></dl></section>" +
      '<div id="technology">' +
      '<section class="section" id="tech-research" aria-labelledby="tech-title">' +
      '<p class="eyebrow reveal">' +
      t.techEyebrow +
      "</p>" +
      '<h2 id="tech-title" class="section-head section-head--sentence reveal">' +
      t.techTitle +
      "</h2>" +
      '<figure class="section-visual reveal"><img src="https://res.cloudinary.com/dssuxurpt/image/upload/v1778563616/Irradiation_eaqkxe.png" alt="' +
      t.techImgAlt +
      '" loading="lazy" decoding="async"></figure>' +
      '<p class="prose reveal shell-i18n-prose">' +
      t.techProse +
      "</p></section>" +
      '<section class="section" id="domains" aria-labelledby="domains-title">' +
      '<p class="eyebrow reveal">' +
      t.scaleEyebrow +
      "</p>" +
      '<h2 id="domains-title" class="section-head section-head--sentence reveal">' +
      t.scaleTitle +
      "</h2>" +
      '<figure class="section-visual reveal"><img src="https://res.cloudinary.com/dssuxurpt/image/upload/v1778563885/powder_joxoc1.png" alt="' +
      t.scaleImgAlt +
      '" loading="lazy" decoding="async"></figure>' +
      '<p class="prose reveal shell-i18n-prose">' +
      t.scaleProse +
      "</p>" +
      '<div class="domain-grid" data-stagger>' +
      '<article class="domain-cell stagger-item" id="domain-beauty"><h3>BEAUTY</h3><p class="shell-i18n-prose">' +
      t.domainBeauty +
      "</p></article>" +
      '<article class="domain-cell stagger-item" id="domain-medical"><h3>MEDICAL</h3><p class="shell-i18n-prose">' +
      t.domainMedical +
      "</p></article>" +
      '<article class="domain-cell stagger-item" id="domain-space"><h3>SPACE</h3><p class="shell-i18n-prose">' +
      t.domainSpace +
      "</p></article></div></section></div></main>" +
      '<footer class="site-footer"><p>© Melanoir</p><p class="shell-i18n-prose">' +
      t.footerShop +
      ': <a href="https://melanoir.co.kr" target="_blank" rel="noopener noreferrer">melanoir.co.kr</a></p></footer>'
    );
  }

  function buildLocalizedContent() {
    var out = {};
    Object.keys(COPY).forEach(function (lang) {
      out[lang] = buildLandingHTML(COPY[lang]);
    });
    return out;
  }

  global.LandingI18n = {
    HIRE_KO: HIRE_KO,
    PAGE_META: PAGE_META,
    COPY: COPY,
    buildLandingHTML: buildLandingHTML,
    buildLocalizedContent: buildLocalizedContent,
  };
})(typeof window !== "undefined" ? window : globalThis);
