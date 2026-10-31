const fs = require('fs');
const path = require('path');

let html = fs.readFileSync('original_squareyards.html', 'utf8');
console.log('Read original_squareyards.html:', html.length, 'bytes');

// 1. Title, Favicon & Meta Tags
html = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>Skyyards Bareilly | Real Estate, Buy/Rent Flats, Duplex Villas, Plots in Bareilly</title>');
html = html.replace(/<meta name="description"[^>]*>/i, '<meta name="description" content="Skyyards Bareilly - Bareilly\'s Premier Real Estate Consulting Platform. Discover BDA & RERA approved 3BHK duplex villas, residential plots & townships in Dohra Road, Bada Bypass, Nainital Road & Greater Bareilly.">');
html = html.replace(/<link rel="icon"[^>]*>/i, '<link rel="icon" type="image/png" href="assets/images/skyyards-logo.png">');

// Link Google Fonts & Moonicon font
if (!html.includes('fonts.googleapis.com/css2.css')) {
  html = html.replace('</head>', '<link rel="stylesheet" href="fonts.googleapis.com/css2.css">\n</head>');
}

// 2. Normalize local asset URLs
html = html.replace(/src="\/assets\//g, 'src="assets/');
html = html.replace(/href="\/assets\//g, 'href="assets/');
html = html.replace(/src="https:\/\/static\.squareyards\.com\/assets\//g, 'src="assets/');

// 3. Header Logo
const oldLogo = /<div class="logoBox Top_Misc_L1">[\s\S]*?<\/div>/i;
const newLogo = `<div class="logoBox Top_Misc_L1">
    <a href="/" title="Skyyards Bareilly" name="Skyyards Bareilly" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
        <img fetchpriority="low" alt="Skyyards Bareilly Logo" class="img-responsive Top_Misc_L1" style="height:36px;width:auto;object-fit:contain;" src="assets/images/skyyards-logo.png" onerror="this.src='assets/images/squareyards.png'">
        <span style="font-family:'Poppins',sans-serif;font-weight:800;font-size:18px;color:#ffffff;letter-spacing:-0.5px;line-height:1.1;">SKY<span style="color:#d92228;">YARDS</span> <span style="font-size:10px;color:#ffd916;font-weight:700;display:block;letter-spacing:1.5px;">BAREILLY</span></span>
    </a> 
</div>`;
html = html.replace(oldLogo, newLogo);

// 4. Remove City Dropdown in Header completely
html = html.replace(/<div class="gblCityDropdown">[\s\S]*?<\/div>\s*<\/div>\s*<div class="gblOverflow"><\/div>/i, '');
html = html.replace(/<div class="gblCityDropdown">[\s\S]*?<\/div>/gi, '');

// 5. Header Phone & Nav Buttons
html = html.replace(/<a href="https:\/\/www\.squareyards\.com\/blog" class="btn blogBtn"[^>]*>[\s\S]*?<\/a>/i, '<a href="tel:08534026777" class="btn blogBtn" title="Call Sky Yards Bareilly" style="font-weight:700;color:#d92228;display:flex;align-items:center;gap:4px;"><em class="icon-phone"></em> 08534026777</a>');
html = html.replace(/<a href="https:\/\/www\.squareyards\.com\/post-property"[^>]*>Sell or Rent Property<\/a>/i, '<a href="contact-us.html" class="btn postPropertyBtn Top_Misc_L4" id="postProperty">Schedule Visit</a>');

// 6. Hero City Heading & Rating
const oldHeroHeading = /<div class="city-heading-box">[\s\S]*?<\/div>\s*<div class="title-box">/i;
const newHeroHeading = `<div class="city-heading-box">
    <div class="sqy-rating">
      <div class="rating"><em class="icon-star"></em>4.9</div>
      <span>1,250+ Google reviews</span>
    </div>
    <h1>Bareilly's Premier<br> Real Estate Platform</h1>
  </div>
<div class="title-box">`;
html = html.replace(oldHeroHeading, newHeroHeading);

// 7. Hero Slide Text
const oldSlideText = /<ul class="slide-text">[\s\S]*?<\/ul>/i;
const newSlideText = `<ul class="slide-text">
    <li>100% BDA &amp; RERA Approved Projects</li>
    <li>Kings Crest: Duplex Villas Starting ₹85 Lac* on Dohra Road</li>
    <li>Olive Homes: BDA Approved Plots from ₹32 Lac* at Bada Bypass</li>
    <li>Up to 80% Home Loan by All Govt &amp; Pvt Banks</li>
    <li>Complete Legal Registry &amp; After Sales Assistance</li>
    <li>Trusted by 2,500+ Families in Bareilly</li>
    <li>100% BDA &amp; RERA Approved Projects</li>
  </ul>`;
html = html.replace(oldSlideText, newSlideText);

// 8. Search Input placeholder
html = html.replace(/placeholder="Search (?:City|developer|project|locality)[^"]*"/gi, 'placeholder="Search project (Kings Crest, Olive Homes) or locality (Dohra Road, Bada Bypass)..."');

// 9. Hot Selling Section Title & Description
html = html.replace(/<h2 class="title">\s*Hot Selling Real Estate Projects in India\s*<\/h2>/i, '<h2 class="title">Hot Selling Real Estate Projects in Bareilly</h2>');
html = html.replace(/A handpicked collection of the country’s most in-demand residential developments\./gi, 'A handpicked collection of Bareilly’s most in-demand residential developments. From modern duplex villas on Dohra Road to BDA-approved residential plots near Greater Bareilly, offering unmatched value, smart amenities, and trusted builders.');

// 10. Hot Selling City Tabs in ul.tab-box
const oldHotTabs = /<ul class="tab-box scrollbar-hide">[\s\S]*?<\/ul>/i;
const newHotTabs = `<ul class="tab-box scrollbar-hide">
    <li data-city="bareilly" class="active">Bareilly Projects</li>
    <li data-city="dohra" class="">Dohra Road</li>
    <li data-city="badabypass" class="">Bada Bypass / Lalpur</li>
    <li data-city="nainital" class="">Nainital Road</li>
    <li data-city="badaun" class="">Badaun Road</li>
    <li data-city="villas" class="">Duplex Villas</li>
    <li data-city="plots" class="">BDA Plots</li>
</ul>`;
html = html.replace(oldHotTabs, newHotTabs);

// 11. Populate Hot Selling Focus Cards with Bareilly Projects
const bareillyFocusCards = `
<article class="focus-card" data-projectid="101" data-projectName="King's Crest" data-cityname="bareilly" onclick="window.location.href='kings-crest.html'">
    <span class="project-number"><span class="number">1</span></span>
    <figure>
        <img class="img-responsive" loading="lazy" decoding="async" src="assets/images/projects/kings-crest.png" width="578" height="316" alt="Kings Crest Dohra Road Bareilly" onerror="this.onerror=null;this.src='assets/images/projects/kings-crest.png';">
    </figure>
    <figcaption>
        <a href="kings-crest.html" target="_blank" onclick="return false;">
            <strong class="strong">King's Crest</strong>
            <span class="city">Dohra Road, Bareilly</span>
        </a>
        <div class="price">₹ 85 Lac* Onwards</div>
    </figcaption>
</article>

<article class="focus-card" data-projectid="102" data-projectName="Olive Homes" data-cityname="bareilly" onclick="window.location.href='olive-homes.html'">
    <span class="project-number"><span class="number">2</span></span>
    <figure>
        <img class="img-responsive" loading="lazy" decoding="async" src="assets/images/projects/olive-homes.jpg" width="578" height="316" alt="Olive Homes Bada Bypass Bareilly" onerror="this.onerror=null;this.src='assets/images/projects/olive-homes.jpg';">
    </figure>
    <figcaption>
        <a href="olive-homes.html" target="_blank" onclick="return false;">
            <strong class="strong">Olive Homes</strong>
            <span class="city">Lalpur, Bada Bypass (Near Greater Bareilly)</span>
        </a>
        <div class="price">₹ 32 Lac* to 55 Lac*</div>
    </figcaption>
</article>

<article class="focus-card" data-projectid="103" data-projectName="King's Avenue" data-cityname="bareilly" onclick="window.location.href='kings-crest.html'">
    <span class="project-number"><span class="number">3</span></span>
    <figure>
        <img class="img-responsive" loading="lazy" decoding="async" src="assets/images/projects/kings-avenue.jpg" width="578" height="316" alt="King's Avenue Dohra Road Bareilly" onerror="this.onerror=null;this.src='assets/images/projects/kings-avenue.jpg';">
    </figure>
    <figcaption>
        <a href="kings-crest.html" target="_blank" onclick="return false;">
            <strong class="strong">King's Avenue</strong>
            <span class="city">Dohra Road, Bareilly</span>
        </a>
        <div class="price">₹ 75 Lac* Onwards</div>
    </figcaption>
</article>

<article class="focus-card" data-projectid="104" data-projectName="JHM Desire" data-cityname="bareilly" onclick="window.location.href='contact-us.html'">
    <span class="project-number"><span class="number">4</span></span>
    <figure>
        <img class="img-responsive" loading="lazy" decoding="async" src="assets/images/projects/jhm-desire.jpg" width="578" height="316" alt="JHM Desire Badaun Road Bareilly" onerror="this.onerror=null;this.src='assets/images/projects/jhm-desire.jpg';">
    </figure>
    <figcaption>
        <a href="contact-us.html" target="_blank" onclick="return false;">
            <strong class="strong">JHM Desire</strong>
            <span class="city">Opp. Parag Dairy, Badaun Road, Bareilly</span>
        </a>
        <div class="price">₹ 68 Lac* Onwards</div>
    </figcaption>
</article>

<article class="focus-card" data-projectid="105" data-projectName="JHM Joy" data-cityname="bareilly" onclick="window.location.href='kings-crest.html'">
    <span class="project-number"><span class="number">5</span></span>
    <figure>
        <img class="img-responsive" loading="lazy" decoding="async" src="assets/images/projects/jhm-joy.jpg" width="578" height="316" alt="JHM Joy Dohra Road Bareilly" onerror="this.onerror=null;this.src='assets/images/projects/jhm-joy.jpg';">
    </figure>
    <figcaption>
        <a href="kings-crest.html" target="_blank" onclick="return false;">
            <strong class="strong">JHM Joy</strong>
            <span class="city">Dohra Road, Bareilly</span>
        </a>
        <div class="price">₹ 72 Lac* Onwards</div>
    </figcaption>
</article>

<article class="focus-card" data-projectid="106" data-projectName="Eldeco City" data-cityname="bareilly" onclick="window.location.href='contact-us.html'">
    <span class="project-number"><span class="number">6</span></span>
    <figure>
        <img class="img-responsive" loading="lazy" decoding="async" src="assets/images/projects/eldeco-city.jpg" width="578" height="316" alt="Eldeco City Nainital Road Bareilly" onerror="this.onerror=null;this.src='assets/images/projects/eldeco-city.jpg';">
    </figure>
    <figcaption>
        <a href="contact-us.html" target="_blank" onclick="return false;">
            <strong class="strong">Eldeco City</strong>
            <span class="city">Nainital Road, Bareilly</span>
        </a>
        <div class="price">₹ 45 Lac to 1.2 Cr*</div>
    </figcaption>
</article>

<article class="focus-card" data-projectid="107" data-projectName="JHM Ace Commercial" data-cityname="bareilly" onclick="window.location.href='contact-us.html'">
    <span class="project-number"><span class="number">7</span></span>
    <figure>
        <img class="img-responsive" loading="lazy" decoding="async" src="assets/images/projects/jhm-ace-commercial.jpg" width="578" height="316" alt="JHM Ace Commercial Dohra Road" onerror="this.onerror=null;this.src='assets/images/projects/jhm-ace-commercial.jpg';">
    </figure>
    <figcaption>
        <a href="contact-us.html" target="_blank" onclick="return false;">
            <strong class="strong">JHM Ace Commercial</strong>
            <span class="city">Dohra Road, Bareilly U.P. 243005</span>
        </a>
        <div class="price">Price on Request</div>
    </figcaption>
</article>

<article class="focus-card" data-projectid="108" data-projectName="Olive Homes Plots" data-cityname="bareilly" onclick="window.location.href='olive-homes.html'">
    <span class="project-number"><span class="number">8</span></span>
    <figure>
        <img class="img-responsive" loading="lazy" decoding="async" src="assets/images/projects/olive-homes-masterplan.jpg" width="578" height="316" alt="Olive Homes Master Plan" onerror="this.onerror=null;this.src='assets/images/projects/olive-homes-masterplan.jpg';">
    </figure>
    <figcaption>
        <a href="olive-homes.html" target="_blank" onclick="return false;">
            <strong class="strong">Olive Homes Plotted Estate</strong>
            <span class="city">Lalpur, Bada Bypass Road</span>
        </a>
        <div class="price">Starting ₹ 32 Lac*</div>
    </figcaption>
</article>
`;

const focusCardsContainerRegex = /(<div class="bxslider focus-project-box[^"]*"[^>]*>)[\s\S]*?(<\/div>\s*<\/div>\s*<\/div>\s*<\/section>)/i;
html = html.replace(focusCardsContainerRegex, `$1\n${bareillyFocusCards}\n$2`);

// 12. Referral Rewards Banner Text
html = html.replace(/Refer a friend for[\s\S]*?&amp; Earn rewards\./i, 'Refer a friend for Duplex Villas, Plots, Home Loans &amp; Interiors in Bareilly &amp; Earn rewards.');

// 13. Property Price Insights Section
html = html.replace(/<h2 class="title">\s*Property Price Insights in India\s*<\/h2>/i, '<h2 class="title">Property Price Insights in Bareilly</h2>');
html = html.replace(/Get accurate property price insights in India with city-wise trends/gi, 'Get accurate property price insights in Bareilly with locality-wise trends, median rates, and micro-market comparisons');

// 14. Services Section
html = html.replace(/<strong class="title">\s*Everything you Need at One Place\s*<\/strong>/i, '<strong class="title">Everything you Need at One Place — Sky Yards Services</strong>');

// 15. Discover More Properties Section
html = html.replace(/Discover More Real Estate Properties in India/gi, 'Discover More Real Estate Properties in Bareilly');

// 16. Top Localities Section
html = html.replace(/<h2 class="title">\s*Top Localities in India\s*<\/h2>/i, '<h2 class="title">Top Localities in Bareilly</h2>');
html = html.replace(/Discover India's best localities known for liveability/gi, 'Discover Bareilly\'s best localities known for liveability, wide roads, and high capital appreciation');

// 17. Top Developers Section - Replace with Bareilly Developers
html = html.replace(/<h2 class="title">\s*Top Developers in India\s*<\/h2>/i, '<h2 class="title">Top Developers in Bareilly</h2>');
html = html.replace(/The top developers in India offer expertise/gi, 'The top developers in Bareilly offer expertise, superior construction quality, and a proven track record of timely delivery');

const bareillyDevelopers = `
<article class="developer-card">
    <div class="developer-header" onclick="window.location.href='contact-us.html'">
        <figure><img class="img-responsive" loading="lazy" decoding="async" src="assets/images/developerlogo/jhm-group.svg" alt="JHM Group" width="98" height="98"/></figure>
        <div class="developer-detail">
            <div class="developer-name">
                <strong title="JHM Group"><a href="contact-us.html">JHM Group</a></strong>
            </div>
            <ul class="developer-about-list">
                <li><strong>3+</strong><span>Total Projects</span></li>
                <li><strong>15+</strong><span>Experience</span></li>
            </ul>
        </div>
    </div>
    <ul class="developer-status-list">
        <li><span class="link">Ready to Move (1) <em class="icon-arrow-right"></em></span></li>
        <li><span class="link">Under Construction (2) <em class="icon-arrow-right"></em></span></li>
        <li><span class="link">Commercial Hub (1) <em class="icon-arrow-right"></em></span></li>
    </ul>
</article>

<article class="developer-card">
    <div class="developer-header" onclick="window.location.href='contact-us.html'">
        <figure><img class="img-responsive" loading="lazy" decoding="async" src="assets/images/developerlogo/eldeco-group.svg" alt="Eldeco Group" width="98" height="98"/></figure>
        <div class="developer-detail">
            <div class="developer-name">
                <strong title="Eldeco Group"><a href="contact-us.html">Eldeco Group</a></strong>
            </div>
            <ul class="developer-about-list">
                <li><strong>175+</strong><span>Total Projects</span></li>
                <li><strong>35+</strong><span>Experience</span></li>
            </ul>
        </div>
    </div>
    <ul class="developer-status-list">
        <li><span class="link">Integrated Township <em class="icon-arrow-right"></em></span></li>
        <li><span class="link">RERA Approved <em class="icon-arrow-right"></em></span></li>
        <li><span class="link">Nainital Road Bareilly <em class="icon-arrow-right"></em></span></li>
    </ul>
</article>

<article class="developer-card">
    <div class="developer-header" onclick="window.location.href='kings-crest.html'">
        <figure><img class="img-responsive" loading="lazy" decoding="async" src="assets/images/developerlogo/kings-group.svg" alt="Kings Developers" width="98" height="98"/></figure>
        <div class="developer-detail">
            <div class="developer-name">
                <strong title="Kings Developers"><a href="kings-crest.html">Kings Developers</a></strong>
            </div>
            <ul class="developer-about-list">
                <li><strong>2+</strong><span>Villa Estates</span></li>
                <li><strong>10+</strong><span>Experience</span></li>
            </ul>
        </div>
    </div>
    <ul class="developer-status-list">
        <li><span class="link">Kings Crest (Dohra Road) <em class="icon-arrow-right"></em></span></li>
        <li><span class="link">King's Avenue <em class="icon-arrow-right"></em></span></li>
        <li><span class="link">3BHK Duplex Luxury <em class="icon-arrow-right"></em></span></li>
    </ul>
</article>

<article class="developer-card">
    <div class="developer-header" onclick="window.location.href='olive-homes.html'">
        <figure><img class="img-responsive" loading="lazy" decoding="async" src="assets/images/developerlogo/olive-greens.svg" alt="Olive Greens & Infra" width="98" height="98"/></figure>
        <div class="developer-detail">
            <div class="developer-name">
                <strong title="Olive Greens & Infra"><a href="olive-homes.html">Olive Greens &amp; Infra</a></strong>
            </div>
            <ul class="developer-about-list">
                <li><strong>1</strong><span>Township</span></li>
                <li><strong>BDA</strong><span>Sanctioned</span></li>
            </ul>
        </div>
    </div>
    <ul class="developer-status-list">
        <li><span class="link">Olive Homes Plots <em class="icon-arrow-right"></em></span></li>
        <li><span class="link">Bada Bypass Lalpur <em class="icon-arrow-right"></em></span></li>
        <li><span class="link">High Appreciation <em class="icon-arrow-right"></em></span></li>
    </ul>
</article>

<article class="developer-card">
    <div class="developer-header" onclick="window.location.href='contact-us.html'">
        <figure><img class="img-responsive" loading="lazy" decoding="async" src="assets/images/developerlogo/skyyards-realty.svg" alt="Sky Yards Realty" width="98" height="98"/></figure>
        <div class="developer-detail">
            <div class="developer-name">
                <strong title="Sky Yards Realty"><a href="contact-us.html">Sky Yards Realty</a></strong>
            </div>
            <ul class="developer-about-list">
                <li><strong>10+</strong><span>Associated</span></li>
                <li><strong>2500+</strong><span>Happy Clients</span></li>
            </ul>
        </div>
    </div>
    <ul class="developer-status-list">
        <li><span class="link">Real Estate Consulting <em class="icon-arrow-right"></em></span></li>
        <li><span class="link">Home Loan Services <em class="icon-arrow-right"></em></span></li>
        <li><span class="link">After Sales Registry <em class="icon-arrow-right"></em></span></li>
    </ul>
</article>
`;

const devBoxRegex = /(<div class="bxslider top-developer-box[^"]*"[^>]*>)[\s\S]*?(<\/div>\s*<\/div>\s*<\/div>\s*<\/section>)/i;
html = html.replace(devBoxRegex, `$1\n${bareillyDevelopers}\n$2`);

// 18. About Section (largest-platform-box)
const oldLargestBox = /<section class="largest-platform-box">[\s\S]*?<\/section>/i;
const newLargestBox = `<section class="largest-platform-box" id="about-us">
  <div class="container largeContainer">
    <div class="title-box">
      <h2 class="title">About Sky Yards Bareilly</h2>
      <p class="description">Delivering the dream of home ownership everywhere.</p>
    </div>
    <div style="background:#ffffff;border-radius:16px;padding:32px;box-shadow:0 4px 20px rgba(0,0,0,0.06);margin-top:20px;border:1px solid #f1f5f9;">
      <p style="font-size:15px;color:#334155;line-height:1.8;margin-bottom:16px;">
        <strong>Sky Yards</strong> is a leading real estate consulting company in India with a clear vision to succeed on the principles of <strong>Commitment, Honesty and Reliability</strong>. There is no denying the fact that buying a property in India is a major decision requiring real-time advice, honest property comparisons, guided physical tours, transparent deal closures, legal due diligence, and home loan assistance.
      </p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:20px;margin:24px 0;">
        <div style="background:#f8fafc;padding:20px;border-radius:12px;border-left:4px solid #d92228;">
          <h4 style="font-size:16px;font-weight:700;color:#1e293b;margin:0 0 6px 0;">🎯 Our Mission</h4>
          <p style="font-size:13.5px;color:#64748b;margin:0;line-height:1.6;">Delivering the dream of home ownership everywhere. Helping families build wealth, security, and lifelong stability through real estate.</p>
        </div>
        <div style="background:#f8fafc;padding:20px;border-radius:12px;border-left:4px solid #0284c7;">
          <h4 style="font-size:16px;font-weight:700;color:#1e293b;margin:0 0 6px 0;">🌟 Our Vision</h4>
          <p style="font-size:13.5px;color:#64748b;margin:0;line-height:1.6;">Win, Make, Give, and Do Good. We do all we can to help our clients and partners build wealth while giving back meaningfully to our community.</p>
        </div>
      </div>
      <div style="background:#1e293b;color:#ffffff;padding:24px;border-radius:12px;">
        <h4 style="font-size:16px;font-weight:700;color:#fde047;margin:0 0 12px 0;">Our Core Values: H.E.A.L.T.H.</h4>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:12px;text-align:center;">
          <div style="background:rgba(255,255,255,0.08);padding:10px;border-radius:8px;"><strong style="color:#fca5a5;display:block;font-size:20px;">H</strong><span style="font-size:12px;">Hard work</span></div>
          <div style="background:rgba(255,255,255,0.08);padding:10px;border-radius:8px;"><strong style="color:#fca5a5;display:block;font-size:20px;">E</strong><span style="font-size:12px;">Extraordinary results</span></div>
          <div style="background:rgba(255,255,255,0.08);padding:10px;border-radius:8px;"><strong style="color:#fca5a5;display:block;font-size:20px;">A</strong><span style="font-size:12px;">Accountable in all things</span></div>
          <div style="background:rgba(255,255,255,0.08);padding:10px;border-radius:8px;"><strong style="color:#fca5a5;display:block;font-size:20px;">L</strong><span style="font-size:12px;">Leaders only</span></div>
          <div style="background:rgba(255,255,255,0.08);padding:10px;border-radius:8px;"><strong style="color:#fca5a5;display:block;font-size:20px;">T</strong><span style="font-size:12px;">Teamwork</span></div>
          <div style="background:rgba(255,255,255,0.08);padding:10px;border-radius:8px;"><strong style="color:#fca5a5;display:block;font-size:20px;">H</strong><span style="font-size:12px;">Humble</span></div>
        </div>
      </div>
    </div>
  </div>
</section>`;
html = html.replace(oldLargestBox, newLargestBox);

// 19. Footer updates
html = html.replace(/Square Yards is India's largest integrated platform/gi, 'Sky Yards Bareilly is a premier real estate consulting platform');
html = html.replace(/<div class="heading"><strong>COMPANY<\/strong><\/div>[\s\S]*?<\/ul>/i, `<div class="heading"><strong>COMPANY</strong></div>
<ul>
  <li><a title="About Sky Yards Bareilly" href="about-us.html">About Us</a></li>
  <li><a title="Kings Crest Dohra Road" href="kings-crest.html">Kings Crest Villas</a></li>
  <li><a title="Olive Homes Bada Bypass" href="olive-homes.html">Olive Homes Plots</a></li>
  <li><a title="Contact Us" href="contact-us.html">Contact Us</a></li>
  <li><a title="Site Visit Booking" href="contact-us.html">Book Site Visit</a></li>
</ul>`);

html = html.replace(/© \d{4} Square Yards/gi, '© 2026 Skyyards Bareilly (Sky Yards Consulting Services)');
html = html.replace(/Square Yards/gi, 'Skyyards Bareilly');
html = html.replace(/SquareYards/gi, 'Skyyards Bareilly');

// Add floating contact buttons for instant conversion
const floatingBar = `
<div style="position:fixed;bottom:24px;right:24px;display:flex;flex-direction:column;gap:12px;z-index:9999;">
  <a href="https://wa.me/918534026777?text=Hi%20Skyyards%20Bareilly,%20I%20am%20interested%20in%20property%20details" target="_blank" style="width:52px;height:52px;border-radius:50%;background:#25d366;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 15px rgba(0,0,0,0.3);text-decoration:none;font-size:24px;" title="Chat on WhatsApp">💬</a>
  <a href="tel:08534026777" style="width:52px;height:52px;border-radius:50%;background:#d92228;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 15px rgba(0,0,0,0.3);text-decoration:none;font-size:22px;" title="Call Sky Yards">📞</a>
</div>
`;
html = html.replace('</body>', floatingBar + '\n</body>');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully generated complete clone in index.html (', html.length, 'bytes)');
