/**
 * Melanoir landing page — localized copy & HTML builder.
 */
(function (global) {
  "use strict";

  var HIRE_KO = "[2026년 상반기 채용] 멜라누아 R&amp;D 팀에 합류하기";
  var NOTIFY_FORM_URL = "/register#waitlist";

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
      navPro: "Pro",
      navClub: "Club",
      navTechnology: "Technology",
      missionEyebrow: "OUR MISSION",
      mission: "우리의 미션은 멜라닌의 유익함을 모두가 누릴 수 있도록 하는 것입니다.",
      promiseAria: "브랜드 약속",
      promisePrimary: "지구에서 가장 안전한 Black",
      promiseSecondary: "For the Safest Black in the Universe.",
      scroll: "SCROLL",
      heroCtaEmbo: "Embo 살펴보기",
      heroCtaNotify: "출시 알림 받기",
      melaninEyebrow: "THE MATERIAL",
      melaninTitle: "왜 멜라닌인가요?",
      melaninImgAlt: "멜라닌과 광·산화 환경을 상징하는 비주얼",
      melaninProse: "멜라닌은 생명이 오랜 시간 동안 빛과 산화로부터 자신을 지키기 위해 진화시킨 <strong>자연의 방패</strong>입니다. 멜라누아는 자연이 정교하게 설계한 이 구조를 우리의 일상으로 가져옵니다.",
      melaninLearnMore: "더 알아보기",
      statBioLabel: "Bio-material",
      statBio: "생체에서 영감을 받은 고기능 소재. 검은색이 요구되는 자리마다, 더 안전한 대안으로서의 멜라닌을 상상합니다.",
      statReachLabel: "Reach",
      statReach: "실험실의 소량에서 시작해, 지구와 우주를 가로지르는 응용까지. 스케일이 커질수록 멜라닌이 대체할 수 있는 영역은 넓어집니다.",
      techEyebrow: "IRRADIATION",
      techTitle: "How we drive innovation",
      techImgAlt: "조사·광 스트레스 조건에서 멜라닌과 비교 소재의 안정성을 보여 주는 실험 비주얼",
      techProse: "멜라닌의 가치는 말로만 완성되지 않습니다. 실험과 데이터를 통해 그 안전성과 기능을 확인하고, 그 결과를 세상과 나누는 것이 멜라누아의 태도입니다. 우리는 멜라닌이 가진 물리·생물학적 특성을 끝까지 읽어 내고, 그 가능성을 새로운 기준으로 제시합니다.",
      scaleEyebrow: "SCALE",
      scaleTitle: "멜라누아의 기술이 적용되는 곳",
      scaleImgAlt: "순수 멜라닌 분말이 쌓이며 스케일을 상징하는 비주얼",
      scaleProse: "같은 물질이어도, 영역마다 요구되는 역할은 다릅니다. 아래는 멜라닌이 어떤 세계와 맞닿아 있는지에 대한 방향이며, 각 축이 지향하는 공통 목표는 <strong>지구에서 가장 안전한 Black</strong>입니다.",
      trajTattooTitle: "타투와 눈썹 문신을 더욱 안전하게.",
      trajTattooDesc: "피부 안에 영구적으로 새겨지는 색소는 그 어떤 소재보다 높은 안전 기준을 요구합니다. 멜라누아는 멜라닌 기반 타투·PMU 잉크를 개발하며, 가장 안전한 블랙을 구현합니다.",
      trajRadTitle: "방사선 차폐 기술의 혁신을 만듭니다.",
      trajRadDesc: "멜라닌의 방사선 흡수 특성은 단순한 색소를 넘어, 차세대 차폐 소재로서의 가능성을 열어 줍니다. 우주 산업과 의료 환경이 요구하는 방호 기준을 멜라닌으로 다시 씁니다.",
      trajCosmeticTitle: "화장품에 여러 기능성을 동시에 구현합니다.",
      trajCosmeticDesc: "피부에 닿는 성분은 기능을 가져야 합니다. 멜라닌을 정교하게 기능화해, 기존 화장품 성분이 채우지 못했던 광보호와 항산화의 자리를 채웁니다.",
      learnMore: "더 알아보기",
      footerShop: "문의·쇼핑",
    },
    en: {
      navAria: "Main",
      navProducts: "Products",
      navPro: "Pro",
      navClub: "Club",
      navTechnology: "Technology",
      missionEyebrow: "OUR MISSION",
      mission: "Our mission is to make the benefits of melanin accessible to everyone.",
      promiseAria: "Brand promise",
      promisePrimary: "For the Safest Black in the Universe.",
      promiseSecondary: "",
      scroll: "SCROLL",
      heroCtaEmbo: "Explore Embo",
      heroCtaNotify: "Get launch updates",
      melaninEyebrow: "THE MATERIAL",
      melaninTitle: "WHY MELANIN",
      melaninImgAlt: "Visual symbolizing melanin in light and oxidative environments",
      melaninProse: "Melanin is nature’s shield—evolved over eons so life could endure light and oxidation. Melanoir brings this elegantly engineered structure into everyday life.",
      melaninLearnMore: "Learn more",
      statBioLabel: "Bio-material",
      statBio: "A high-performance material inspired by living systems. Wherever black is required, we imagine melanin as the safer alternative.",
      statReachLabel: "Reach",
      statReach: "From bench-scale batches to applications that span Earth and space—the larger the scale, the wider melanin’s reach becomes.",
      techEyebrow: "IRRADIATION",
      techTitle: "How we drive innovation",
      techImgAlt: "Experimental visual of melanin stability under irradiation and optical stress",
      techProse: "Melanin’s value is not finished in words alone. Melanoir proves safety and function through experiment and data, then shares those results with the world. We read melanin’s physical and biological character to the end—and set new standards for what it can do.",
      scaleEyebrow: "SCALE",
      scaleTitle: "Our trajectory",
      scaleImgAlt: "Pure melanin powder stacked to symbolize scale",
      scaleProse: "The same molecule plays different roles in different worlds. Below is how melanin meets each domain—and the goal every axis shares: <strong>the safest black on Earth</strong>.",
      trajTattooTitle: "Making tattoo ink safe and beyond.",
      trajTattooDesc: "Pigments permanently embedded in skin demand the highest safety standards of any material. Melanoir develops melanin-based tattoo and PMU inks that realize the safest black.",
      trajRadTitle: "Revolutionizing radiation shielding technology.",
      trajRadDesc: "Melanin’s radiation-absorbing properties open possibilities far beyond ordinary pigments, toward next-generation shielding materials. Melanoir is rewriting protection standards for space and medical environments.",
      trajCosmeticTitle: "Functionalizing cosmetic ingredient.",
      trajCosmeticDesc: "Every ingredient that touches skin must carry a function. Through the precise functionalization of melanin, Melanoir fills the gaps in photoprotection and antioxidant defense that conventional cosmetics leave behind.",
      learnMore: "Learn more",
      footerShop: "Inquiries & shopping",
    },
    fr: {
      navAria: "Principal",
      navProducts: "Produits",
      navPro: "Pro",
      navClub: "Club",
      navTechnology: "Technologie",
      missionEyebrow: "NOTRE MISSION",
      mission: "Notre mission est de rendre les bienfaits de la mélanine accessibles à tous.",
      promiseAria: "Promesse de marque",
      promisePrimary: "Pour le Black le plus sûr sur Terre.",
      promiseSecondary: "",
      scroll: "DÉFILER",
      heroCtaEmbo: "Découvrir Embo",
      heroCtaNotify: "Être informé du lancement",
      melaninEyebrow: "LA MATIÈRE",
      melaninTitle: "POURQUOI LA MÉLANINE",
      melaninImgAlt: "Visuel évoquant la mélanine face à la lumière et à l’oxydation",
      melaninProse: "La mélanine est le <strong>bouclier de la nature</strong>, façonné par l’évolution pour protéger le vivant de la lumière et de l’oxydation. Melanoir apporte cette structure finement conçue par la nature dans votre quotidien.",
      melaninLearnMore: "En savoir plus",
      statBioLabel: "Bio-matière",
      statBio: "Un matériau haute performance inspiré du vivant. Partout où le noir est exigé, nous imaginons la mélanine comme l’alternative la plus sûre.",
      statReachLabel: "Portée",
      statReach: "Du laboratoire aux applications qui traversent la Terre et l’espace—plus l’échelle grandit, plus le champ de la mélanine s’élargit.",
      techEyebrow: "IRRADIATION",
      techTitle: "Comment nous innovons",
      techImgAlt: "Visuel expérimental de la stabilité de la mélanine sous stress lumineux et irradiation",
      techProse: "La valeur de la mélanine ne se clôt pas dans les mots. Melanoir en démontre la sûreté et la fonction par l’expérience et les données, puis les partage. Nous lisons ses propriétés physiques et biologiques jusqu’au bout—et proposons de nouveaux repères.",
      scaleEyebrow: "ÉCHELLE",
      scaleTitle: "Notre trajectoire",
      scaleImgAlt: "Poudre de mélanine pure symbolisant l’échelle",
      scaleProse: "Une même molécule, des rôles différents selon les mondes. Voici comment la mélanine touche chaque domaine—avec un objectif commun : <strong>le Black le plus sûr sur Terre</strong>.",
      trajTattooTitle: "Un encre de tatouage sûr. Et au-delà.",
      trajTattooDesc: "Les pigments incrustés définitivement dans la peau exigent les plus hauts critères de sécurité. Melanoir développe des encres de tatouage et PMU à base de mélanine pour réaliser le Black le plus sûr.",
      trajRadTitle: "Révolutionner la technologie de protection contre les rayonnements.",
      trajRadDesc: "Les propriétés d'absorption des rayonnements de la mélanine ouvrent des perspectives au-delà du simple pigment, vers des matériaux de blindage de nouvelle génération. Melanoir réécrit les normes de protection pour l'espace et le médical.",
      trajCosmeticTitle: "Des ingrédients cosmétiques fonctionnalisés.",
      trajCosmeticDesc: "Chaque ingrédient en contact avec la peau doit avoir une fonction. Par la fonctionnalisation précise de la mélanine, Melanoir comble les lacunes en photoprotection et défense antioxydante.",
      learnMore: "En savoir plus",
      footerShop: "Contact & boutique",
    },
    jp: {
      navAria: "メイン",
      navProducts: "製品",
      navPro: "Pro",
      navClub: "クラブ",
      navTechnology: "テクノロジー",
      missionEyebrow: "OUR MISSION",
      mission: "私たちのミッションは、メラニンの恩恵をすべての人が享受できるようにすることです。",
      promiseAria: "ブランドの約束",
      promisePrimary: "地球で最も安全な Black。",
      promiseSecondary: "",
      scroll: "SCROLL",
      heroCtaEmbo: "Emboを見る",
      heroCtaNotify: "発売通知を受け取る",
      melaninEyebrow: "THE MATERIAL",
      melaninTitle: "WHY MELANIN",
      melaninImgAlt: "メラニンと光・酸化環境を象徴するビジュアル",
      melaninProse: "メラニンは、生命が長い時間をかけて光と酸化から身を守るために進化させた<strong>自然の盾</strong>です。メラヌアは、自然が精巧に設計したこの構造を私たちの日常へ届けます。",
      melaninLearnMore: "詳しく見る",
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
      trajTattooTitle: "タトゥーインクを安全に。そして、その先へ。",
      trajTattooDesc: "皮膚に永久に刻まれる色素は、あらゆる素材の中で最高の安全基準を求めます。メラヌアはメラニンベースのタトゥー・PMUインクを開発し、最も安全なブラックを実現します。",
      trajRadTitle: "放射線遮蔽技術の革新をつくります。",
      trajRadDesc: "メラニンの放射線吸収特性は、単なる色素を超えて次世代遮蔽材料への可能性を開きます。宇宙産業と医療環境が求める防護基準をメラニンで書き替えます。",
      trajCosmeticTitle: "化粧品成分に先端技術を適用します。",
      trajCosmeticDesc: "膚に触れる成分は機能を持つべきです。メラニンの精巧な機能化を通じて、従来の化粧品成分が埋められなかった光防護と抗酸化の空白を埋めます。",
      learnMore: "詳しく見る",
      footerShop: "お問い合わせ・ショッピング",
    },
    cn: {
      navAria: "主导航",
      navProducts: "产品",
      navPro: "Pro",
      navClub: "俱乐部",
      navTechnology: "技术",
      missionEyebrow: "OUR MISSION",
      mission: "我们的使命，是让所有人都能享有黑色素的益处。",
      promiseAria: "品牌承诺",
      promisePrimary: "地球上最安全的 Black。",
      promiseSecondary: "",
      scroll: "SCROLL",
      heroCtaEmbo: "了解 Embo",
      heroCtaNotify: "获取上市通知",
      melaninEyebrow: "THE MATERIAL",
      melaninTitle: "WHY MELANIN",
      melaninImgAlt: "象征黑色素与光、氧化环境的视觉",
      melaninProse: "黑色素是生命在漫长岁月中为抗御光与氧化而进化出的<strong>自然之盾</strong>。Melanoir 将这一由自然精心设计的结构带入日常生活。",
      melaninLearnMore: "了解更多",
      statBioLabel: "Bio-material",
      statBio: "源于生命启发的高性能材料。在需要黑色的每一处，我们想象黑色素作为更安全的替代。",
      statReachLabel: "Reach",
      statReach: "从实验室微量到横跨地球与宇宙的应用——规模越大，黑色素可触及的领域越广。",
      techEyebrow: "IRRADIATION",
      techTitle: "我们如何推动创新",
      techImgAlt: "照射与光应激条件下黑色素稳定性的实验视觉",
      techProse: "黑色素的价値不会止于言语。Melanoir 以实验与数据验证其安全性与功能，并与世界分享结果。我们读尽黑色素的物理与生物学特性，并以新标准呈现其可能。",
      scaleEyebrow: "SCALE",
      scaleTitle: "我们的路径",
      scaleImgAlt: "纯黑色素粉末堆叠，象征规模",
      scaleProse: "同一物质，在不同领域承担不同角色。以下是黑色素所触及的世界方向——各轴共同指向<strong>地球上最安全的 Black</strong>。",
      trajTattooTitle: "让纹身墨水更安全。以及更远。",
      trajTattooDesc: "永久嵌入皮肤的色素要求所有材料中最高的安全标准。Melanoir 开发基于黑色素的纹身和 PMU 墨水，实现最安全的黑色。",
      trajRadTitle: "开创辐射防护技术的革新。",
      trajRadDesc: "黑色素的辐射吸收特性超越了普通色素，开启了新一代防护材料的可能性。Melanoir 正在用黑色素重写航天和医疗环境的防护标准。",
      trajCosmeticTitle: "将先进技术应用于化妆品成分。",
      trajCosmeticDesc: "接触皮肤的每种成分都必须具有功能。通过精确功能化黑色素，Melanoir 填补了传统化妆品成分在光防护和抗氧化防御方面留下的空白。",
      learnMore: "了解更多",
      footerShop: "咨询与购物",
    },
  };

  var VIDEO_SRC =
    "https://res.cloudinary.com/dssuxurpt/video/upload/v1778651445/Moon_gold_ighxxq.mp4";

  var TRAJ_TATTOO_VIDEO =
    "https://res.cloudinary.com/dssuxurpt/video/upload/v1779244150/%E1%84%82%E1%85%A1%E1%84%8B%E1%85%B4_%E1%84%83%E1%85%A9%E1%86%BC%E1%84%8B%E1%85%A7%E1%86%BC%E1%84%89%E1%85%A1%E1%86%BC_6-1_cpuuew.mp4";
  var TRAJ_RADIATION_IMG =
    "https://res.cloudinary.com/dssuxurpt/image/upload/v1779243028/Gown2-compressed_poeqah.jpg";
  var TRAJ_COSMETICS_IMG =
    "https://res.cloudinary.com/dssuxurpt/image/upload/v1779242602/Color_jvs9he.png";

  /** false → show [더 알아보기] on landing when /melanin, /technology/* are ready */
  var DEFER_DESTINATION_LEARN_MORE = true;

  function deferredLearnMoreLink(className, href, label) {
    if (DEFER_DESTINATION_LEARN_MORE) return "";
    return '<a class="' + className + '" href="' + href + '">' + label + "</a>";
  }

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
      '<a href="/register">' +
      t.navClub +
      "</a>" +
      '<a href="/pro">' +
      t.navPro +
      "</a>" +
      "</nav></div>" +
      '<a class="topbar-hire" href="/recruitment">' +
      HIRE_KO +
      "</a></header>" +
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
      '<div class="hero-cta-row reveal">' +
      '<a class="hero-cta hero-cta--primary" href="/products/embo">' +
      t.heroCtaEmbo +
      "</a>" +
      '<a class="hero-cta" href="' +
      NOTIFY_FORM_URL +
      '">' +
      t.heroCtaNotify +
      "</a></div>" +
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
      "</dd></div></dl>" +
      deferredLearnMoreLink("section-cta reveal", "/melanin", t.melaninLearnMore) +
      "</section>" +
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
      '<div class="traj-list" data-stagger>' +
      '<article class="traj-item stagger-item">' +
      '<figure class="traj-visual traj-visual--video">' +
      '<video autoplay muted loop playsinline disablePictureInPicture aria-hidden="true">' +
      '<source src="' + TRAJ_TATTOO_VIDEO + '" type="video/mp4"></video></figure>' +
      '<p class="traj-eyebrow">TATTOO · PMU</p>' +
      '<h3 class="traj-title shell-i18n-prose">' + t.trajTattooTitle + "</h3>" +
      '<p class="traj-desc shell-i18n-prose">' + t.trajTattooDesc + "</p>" +
      deferredLearnMoreLink("traj-cta", "/technology/tattoo", t.learnMore) +
      "</article>" +
      '<article class="traj-item stagger-item">' +
      '<figure class="traj-visual">' +
      '<img src="' + TRAJ_RADIATION_IMG + '" alt="" loading="lazy" decoding="async"></figure>' +
      '<p class="traj-eyebrow">RADIATION SHIELDING</p>' +
      '<h3 class="traj-title shell-i18n-prose">' + t.trajRadTitle + "</h3>" +
      '<p class="traj-desc shell-i18n-prose">' + t.trajRadDesc + "</p>" +
      deferredLearnMoreLink("traj-cta", "/technology/radiation", t.learnMore) +
      "</article>" +
      '<article class="traj-item stagger-item">' +
      '<figure class="traj-visual">' +
      '<img src="' + TRAJ_COSMETICS_IMG + '" alt="" loading="lazy" decoding="async"></figure>' +
      '<p class="traj-eyebrow">COSMETICS</p>' +
      '<h3 class="traj-title shell-i18n-prose">' + t.trajCosmeticTitle + "</h3>" +
      '<p class="traj-desc shell-i18n-prose">' + t.trajCosmeticDesc + "</p>" +
      deferredLearnMoreLink("traj-cta", "/technology/cosmetics", t.learnMore) +
      "</article>" +
      "</div></section></div></main>" +
      '<div data-mnr-explore="exclude:products" data-theme="dark"></div>' +
      '<div data-mnr-footer data-theme="dark"></div>'
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
