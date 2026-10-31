const fs = require('fs');
const path = require('path');

let html = fs.readFileSync('original_squareyards.html', 'utf8');
console.log('Original HTML size:', html.length);

// 1. Title & Meta
html = html.replace(/<title>.*?<\/title>/i, '<title>Skyyards Bareilly | Real Estate, Buy/Rent Flats, Duplex Villas, Plots in Bareilly</title>');
html = html.replace(/content="Square Yards[^"]*"/gi, 'content="Skyyards Bareilly - Bareilly\'s Premier Real Estate Consulting Platform. Discover BDA & RERA approved 3BHK duplex villas, residential plots & townships in Dohra Road, Bada Bypass, Nainital Road & Greater Bareilly."');

// 2. Relative paths & missing prefixes
html = html.replace(/src="\/assets\//g, 'src="assets/');
html = html.replace(/href="\/assets\//g, 'href="assets/');
html = html.replace(/src="https:\/\/static\.squareyards\.com\/assets\//g, 'src="assets/');
html = html.replace(/src="https:\/\/static\.squareyards\.com\/resources\//g, 'src="resources/');

// 3. Logo in Header
const oldLogoRegex = /<div class="logoBox Top_Misc_L1">[\s\S]*?<\/div>/i;
const newLogo = `<div class="logoBox Top_Misc_L1">
    <a href="/" title="Skyyards Bareilly" name="Skyyards Bareilly" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
        <img fetchpriority="low" alt="Skyyards Bareilly Logo" class="img-responsive Top_Misc_L1" style="height:36px;width:auto;object-fit:contain;" src="assets/images/skyyards-logo.png" onerror="this.src='assets/images/squareyards.png'">
        <span style="font-family:'Poppins',sans-serif;font-weight:800;font-size:18px;color:#ffffff;letter-spacing:-0.5px;line-height:1.1;">SKY<span style="color:#d92228;">YARDS</span> <span style="font-size:10px;color:#ffd916;font-weight:700;display:block;letter-spacing:1.5px;">BAREILLY</span></span>
    </a> 
</div>`;
html = html.replace(oldLogoRegex, newLogo);

// 4. Remove City Dropdown in Header completely
html = html.replace(/<div class="gblCityDropdown">[\s\S]*?<\/div>\s*<\/div>\s*<div class="gblOverflow"><\/div>/i, '');
html = html.replace(/<div class="gblCityDropdown">[\s\S]*?<\/div>/gi, '');

// 5. Header phone button
html = html.replace(/<a href="https:\/\/www\.squareyards\.com\/blog" class="btn blogBtn"[^>]*>[\s\S]*?<\/a>/i, '<a href="tel:08534026777" class="btn blogBtn" title="Call Sky Yards Bareilly" style="font-weight:700;color:#d92228;display:flex;align-items:center;gap:4px;"><em class="icon-phone"></em> 08534026777</a>');

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

// 9. Hot Selling Section Title
html = html.replace(/<h2 class="title">\s*Hot Selling Real Estate Projects in India\s*<\/h2>/i, '<h2 class="title">Hot Selling Real Estate Projects in Bareilly</h2>');
html = html.replace(/A handpicked collection of the country’s most in-demand residential developments\./gi, 'A handpicked collection of Bareilly’s most in-demand residential developments. From luxury duplex villas on Dohra Road to BDA-approved residential plots near Greater Bareilly, offering unmatched value, smart amenities, and trusted builders.');

// 10. Property Price Insights Title & Description
html = html.replace(/<h2 class="title">\s*Property Price Insights in India\s*<\/h2>/i, '<h2 class="title">Property Price Insights in Bareilly</h2>');
html = html.replace(/Get accurate property price insights in India with city-wise trends/gi, 'Get accurate property price insights in Bareilly with locality-wise trends, median rates, and micro-market comparisons');

// 11. Everything You Need / Services Title
html = html.replace(/<strong class="title">\s*Everything you Need at One Place\s*<\/strong>/i, '<strong class="title">Everything you Need at One Place — Sky Yards Services</strong>');

// 12. Discover More Title
html = html.replace(/Discover More Real Estate Properties in India/gi, 'Discover More Real Estate Properties in Bareilly');

// 13. Top Localities Title
html = html.replace(/<h2 class="title">\s*Top Localities in India\s*<\/h2>/i, '<h2 class="title">Top Localities in Bareilly</h2>');
html = html.replace(/Discover India's best localities known for liveability/gi, 'Discover Bareilly\'s best localities known for liveability, wide roads, and high capital appreciation');

// 14. Top Developers Title
html = html.replace(/<h2 class="title">\s*Top Developers in India\s*<\/h2>/i, '<h2 class="title">Top Developers in Bareilly</h2>');
html = html.replace(/The top developers in India offer expertise/gi, 'The top developers in Bareilly offer expertise, superior construction quality, and a proven track record of timely delivery');

// 15. Refer a Friend Title
html = html.replace(/Refer a friend for[\s\S]*?&amp; Earn rewards\./i, 'Refer a friend for Duplex Villas, Plots, Home Loans &amp; Interiors in Bareilly &amp; Earn rewards.');

// 16. Replace "Square Yards" generic occurrences in prose with "Skyyards Bareilly"
html = html.replace(/Square Yards - Research, Recognitions/gi, 'Skyyards Bareilly - Research, Insights');

// 17. Brand replacement in Schema.org and text
html = html.replace(/"name":\s*"Square Yards"/gi, '"name": "Skyyards Bareilly"');
html = html.replace(/Square Yards is India's largest/gi, 'Skyyards Bareilly is Bareilly\'s premier');

// 18. About section (largest-platform-box)
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
html = html.replace(/Square Yards/gi, 'Skyyards Bareilly');
html = html.replace(/SquareYards/gi, 'Skyyards Bareilly');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully transformed index.html! New length:', html.length);

