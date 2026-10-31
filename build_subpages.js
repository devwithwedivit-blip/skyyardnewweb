const fs = require('fs');
const path = require('path');

function getHeader(activePage = '') {
  return `
  <header class="active outer">
    <div class="logoBox">
      <a href="index.html" title="Skyyards Bareilly" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
        <img alt="Skyyards Bareilly Logo" class="img-responsive" src="assets/images/skyyards-logo.png" onerror="this.src='assets/images/squareyards.png'">
        <div class="logoText">
          <span class="brandName">SKY<span>YARDS</span></span>
          <span class="brandTag">BAREILLY REAL ESTATE</span>
        </div>
      </a>
    </div>

    

    <nav>
      <div class="desktopNav">
        <ul class="navItem">
          <li><a href="index.html">Home</a></li>
          <li><a href="kings-crest.html" style="${activePage === 'kings-crest' ? 'color:var(--primary);font-weight:700;' : ''}">Kings Crest</a></li>
          <li><a href="olive-homes.html" style="${activePage === 'olive-homes' ? 'color:var(--primary);font-weight:700;' : ''}">Olive Homes</a></li>
          <li><a href="index.html#hot-selling">All Projects</a></li>
          <li><a href="index.html#services-section">Services</a></li>
          <li><a href="about-us.html" style="${activePage === 'about' ? 'color:var(--primary);font-weight:700;' : ''}">About Us</a></li>
          <li><a href="contact-us.html" style="${activePage === 'contact' ? 'color:var(--primary);font-weight:700;' : ''}">Contact Us</a></li>
        </ul>
      </div>
    </nav>

    <div class="headerRightSide">
      <a href="tel:08534026777" class="headerCallBtn">
        <em class="icon-phone"></em> 08534026777
      </a>
      <a href="contact-us.html" class="btn loginBtn" style="text-decoration:none;display:inline-block;">
        Schedule Visit
      </a>
    </div>
  </header>
  `;
}

function getFooter() {
  return `
  <footer>
    <div class="footerContainer">
      <div class="footerGrid">
        <div class="footerCol">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
            <img src="assets/images/skyyards-logo.png" alt="Skyyards Bareilly" style="height:36px;width:auto;" onerror="this.src='assets/images/squareyards.png'">
            <span style="font-family:'Poppins', sans-serif;font-size:18px;font-weight:800;color:#fff;">SKY<span style="color:var(--primary);">YARDS</span></span>
          </div>
          <p style="color:#94a3b8;font-size:12.5px;line-height:1.6;margin-bottom:16px;">
            Sky Yards Bareilly is a premier real estate consulting firm founded on Commitment, Honesty and Reliability. Assisting homebuyers, plot investors, and businesses with 100% verified properties.
          </p>
          <div class="footerAddressBox">
            <p><strong>Corporate Office:</strong><br>SKY YARDS, JHM Ace Commercial, Dohra Road, Bareilly, Uttar Pradesh 243005</p>
            <p><strong>Direct Helplines:</strong><br>📞 <a href="tel:08534026777" style="color:#fff;text-decoration:none;">08534026777</a>, <a href="tel:08218095851" style="color:#fff;text-decoration:none;">08218095851</a></p>
            <p><strong>Official Email:</strong><br>✉️ <a href="mailto:skyyardsofficial@gmail.com" style="color:#fff;text-decoration:none;">skyyardsofficial@gmail.com</a></p>
          </div>
        </div>

        <div class="footerCol">
          <h4>Featured Projects</h4>
          <ul>
            <li><a href="kings-crest.html">Kings Crest (Dohra Road)</a></li>
            <li><a href="olive-homes.html">Olive Homes (Bada Bypass)</a></li>
            <li><a href="index.html#kings-avenue">King's Avenue (Dohra Road)</a></li>
            <li><a href="index.html#jhm-desire">JHM Desire (Badaun Road)</a></li>
            <li><a href="index.html#jhm-joy">JHM Joy (Dohra Road)</a></li>
            <li><a href="index.html#eldeco-city">Eldeco City (Nainital Road)</a></li>
            <li><a href="index.html#jhm-ace">JHM Ace Commercial</a></li>
          </ul>
        </div>

        <div class="footerCol">
          <h4>Top Localities</h4>
          <ul>
            <li><a href="index.html#localities-section">Dohra Road Bareilly</a></li>
            <li><a href="index.html#localities-section">Lalpur &amp; Bada Bypass</a></li>
            <li><a href="index.html#localities-section">Nainital Road</a></li>
            <li><a href="index.html#localities-section">Badaun Road (Parag Dairy)</a></li>
            <li><a href="index.html#localities-section">Ram Ganga Yojna / Greater Bareilly</a></li>
            <li><a href="index.html#localities-section">Civil Lines Bareilly</a></li>
          </ul>
        </div>

        <div class="footerCol">
          <h4>Our Services</h4>
          <ul>
            <li><a href="index.html#services-section">Real Estate Consulting</a></li>
            <li><a href="index.html#services-section">After Sales Assistance</a></li>
            <li><a href="index.html#services-section">Home Loan Services (Up to 80%)</a></li>
            <li><a href="index.html#services-section">BDA &amp; RERA Verification</a></li>
            <li><a href="index.html#services-section">Turnkey Home Interiors</a></li>
          </ul>
        </div>

        <div class="footerCol">
          <h4>Quick Connect</h4>
          <p style="font-size:12.5px;color:#cbd5e1;margin-bottom:12px;">Get instant project brochures, rate lists, and schedule free site visits directly with our team.</p>
          <a href="tel:08534026777" class="btnEnquire" style="display:block;text-align:center;text-decoration:none;margin-bottom:10px;padding:12px;">Call 08534026777</a>
          <a href="https://wa.me/918534026777?text=Hi%20Skyyards%20Bareilly" target="_blank" class="btnWhatsapp" style="display:block;text-align:center;padding:10px;">Chat on WhatsApp</a>
        </div>
      </div>

      <div class="footerBottomRow">
        <div>
          © 2026 <strong>Skyyards Bareilly</strong> (Sky Yards Consulting Services). All rights reserved.
        </div>
        <div style="color:#64748b;">
          Corporate HQ: JHM Ace Commercial, Dohra Road, Bareilly U.P. 243005
        </div>
      </div>
    </div>
  </footer>

  <div class="floatingContactBar">
    <a href="https://wa.me/918534026777?text=Hi%20Skyyards%20Bareilly" target="_blank" class="floatBtn floatWhatsapp" title="WhatsApp">💬</a>
    <a href="tel:08534026777" class="floatBtn floatCall" title="Call">📞</a>
  </div>
  `;
}

const commonHead = `
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <link rel="icon" type="image/png" href="assets/images/skyyards-logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="fonts.googleapis.com/css2.css" rel="stylesheet">
  <link rel="stylesheet" href="assets/fonts/projectV2/moonicon-158cf97e06.min.css">
  <link rel="stylesheet" href="assets/css/critical-home.css">
  <link rel="stylesheet" href="assets/css/common_second_fold-8663ca8305.min.css">
  <link rel="stylesheet" href="assets/css/home-v2-3d4d9f9b96.min.css">
  <link rel="stylesheet" href="assets/css/loginpopup-common-45dbf9c39c.min.css">
  <style>
    :root {
      --primary: #d92228;
      --primary-hover: #b9151b;
      --secondary: #1e3a8a;
      --accent: #f59e0b;
      --dark: #1e293b;
      --light-bg: #f8fafc;
    }
    body {
      font-family: 'Inter', sans-serif;
      color: #333;
      margin: 0;
      padding: 0;
      background: #f8fafc;
    }
    header.outer {
      background: #ffffff;
      box-shadow: 0 2px 10px rgba(0,0,0,0.06);
      position: sticky;
      top: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 24px;
      height: 72px;
    }
    .logoBox { display: flex; align-items: center; gap: 12px; }
    .logoBox img { max-height: 48px; width: auto; object-fit: contain; }
    .logoText .brandName { font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 800; color: #1e293b; }
    .logoText .brandName span { color: var(--primary); }
    .logoText .brandTag { font-size: 10px; font-weight: 600; color: #64748b; letter-spacing: 1.5px; }
    .citySelectorBtn { display: flex; align-items: center; gap: 6px; padding: 6px 14px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 20px; font-size: 13px; font-weight: 600; color: #334155; }
    .cityDot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; }
    nav .desktopNav ul.navItem { display: flex; list-style: none; margin: 0; padding: 0; gap: 20px; }
    nav .desktopNav ul.navItem li a { font-size: 14px; font-weight: 600; color: #334155; text-decoration: none; padding: 8px 4px; transition: color 0.2s; }
    nav .desktopNav ul.navItem li a:hover { color: var(--primary); }
    .headerCallBtn { display: flex; align-items: center; gap: 6px; background: #fef2f2; color: var(--primary); border: 1px solid #fecaca; border-radius: 20px; padding: 7px 16px; font-size: 13px; font-weight: 700; text-decoration: none; }
    .headerRightSide .loginBtn { background: var(--primary); color: #fff; padding: 8px 20px; border-radius: 20px; font-size: 13px; font-weight: 700; border: none; cursor: pointer; }
    .sectionContainer { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    .pageHero { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff; padding: 60px 20px; }
    .pageHero h1 { font-family: 'Poppins', sans-serif; font-size: 38px; font-weight: 800; margin: 0 0 12px 0; }
    .pageHero p { font-size: 16px; color: #cbd5e1; margin: 0; max-width: 800px; line-height: 1.6; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; }
    .badgeGreen { background: #16a34a; color: #fff; }
    .badgeRed { background: var(--primary); color: #fff; }
    .card { background: #ffffff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; margin-bottom: 24px; }
    .btnEnquire { background: var(--primary); color: #fff; border: none; border-radius: 8px; padding: 12px 24px; font-size: 14px; font-weight: 700; cursor: pointer; display: inline-block; text-decoration: none; text-align: center; }
    .btnEnquire:hover { background: var(--primary-hover); }
    .btnWhatsapp { background: #22c55e; color: #fff; border-radius: 8px; padding: 12px 24px; font-size: 14px; font-weight: 700; text-decoration: none; display: inline-block; }
    .floatingContactBar { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 12px; z-index: 1010; }
    .floatBtn { width: 54px; height: 54px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 24px; box-shadow: 0 6px 20px rgba(0,0,0,0.25); text-decoration: none; }
    .floatWhatsapp { background: #25d366; }
    .floatCall { background: var(--primary); }
    footer { background: #0f172a; color: #94a3b8; padding: 60px 20px 30px 20px; font-size: 13px; line-height: 1.6; }
    .footerContainer { max-width: 1240px; margin: 0 auto; }
    .footerGrid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr; gap: 32px; margin-bottom: 40px; }
    @media (max-width: 900px) { .footerGrid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 600px) { .footerGrid { grid-template-columns: 1fr; } }
    .footerCol h4 { color: #ffffff; font-size: 15px; font-weight: 700; margin: 0 0 16px 0; text-transform: uppercase; }
    .footerCol ul { list-style: none; padding: 0; margin: 0; }
    .footerCol ul li { margin-bottom: 10px; }
    .footerCol ul li a { color: #94a3b8; text-decoration: none; }
    .footerCol ul li a:hover { color: #fff; }
    .footerBottomRow { border-top: 1px solid #1e293b; padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; font-size: 12px; }
  </style>
`;

// 1. Kings Crest Page
const kingsCrestHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>King's Crest Dohra Road Bareilly | BDA & RERA Approved Duplex 3BHK Villas | Skyyards</title>
  <meta name="description" content="Discover Kings Crest on Dohra Road Bareilly. BDA & RERA approved 3BHK duplex villas starting at ₹85 Lac* with gated society, open gym, CCTV security, landscaped greens, and 80% bank loan.">
  ${commonHead}
</head>
<body>
  ${getHeader('kings-crest')}

  <div class="pageHero">
    <div class="sectionContainer" style="padding-top:0;padding-bottom:0;">
      <div style="display:flex;gap:8px;margin-bottom:12px;">
        <span class="badge badgeGreen">BDA &amp; RERA APPROVED</span>
        <span class="badge badgeRed">STARTING ₹ 85 LAC*</span>
      </div>
      <h1>King's Crest — Dohra Road, Bareilly</h1>
      <p>Luxury living style at an affordable price. Experience spacious 3 BHK duplex villas thoughtfully crafted with modern elevations, gated community security, and prime connectivity on Dohra Road Bareilly.</p>
    </div>
  </div>

  <div class="sectionContainer">
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:30px;">
      <div>
        <div class="card" style="padding:0;overflow:hidden;">
          <img src="assets/images/projects/kings-crest.png" alt="Kings Crest Duplex Villa" style="width:100%;height:400px;object-fit:cover;">
          <div style="padding:24px;">
            <h2 style="font-family:'Poppins', sans-serif;font-size:24px;font-weight:700;color:#1e293b;margin:0 0 10px 0;">Project Overview</h2>
            <p style="color:#475569;line-height:1.8;font-size:15px;">
              <strong>Discover Kings Crest</strong> — a prestigious gated villa community located on <strong>Dohra Road, Bareilly</strong>. Offering thoughtfully crafted <strong>3 BHK duplex villas</strong> designed for pure comfort, elegance, and long-term capital appreciation. Limited units available — secure your home today!
            </p>
            <div style="background:#e0f2fe;color:#0369a1;padding:14px;border-radius:10px;font-weight:600;font-size:14px;margin:20px 0;">
              🏦 <strong>Bank Loan Facility:</strong> Loan available up to 80% by all major government and nationalized banks (SBI, BOB, PNB, Canara Bank, HDFC).
            </div>

            <h3 style="font-family:'Poppins', sans-serif;font-size:18px;font-weight:700;color:#1e293b;margin:24px 0 14px 0;">Key Project Features &amp; Amenities</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:14px;color:#334155;">
              <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">🚪 Gated Society with Security Post</div>
              <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">🏋️ Open Gymnasium &amp; Fitness Area</div>
              <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">📷 24x7 Security Surveillance with CCTV</div>
              <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">⛹️ Dedicated Kid's Play Area</div>
              <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">🧘 Tranquil Yoga &amp; Meditation Space</div>
              <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">🏸 Professional Badminton Court</div>
              <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">🌳 Landscaped Green Parks &amp; Trees</div>
              <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">💧 24*7 Underground Water Supply</div>
              <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">⚡ Underground Electric Cabling</div>
              <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">🛣️ Wide Internal Concrete Roads</div>
            </div>

            <h3 style="font-family:'Poppins', sans-serif;font-size:18px;font-weight:700;color:#1e293b;margin:30px 0 14px 0;">Villa Specifications</h3>
            <ul style="color:#475569;font-size:14.5px;line-height:1.9;padding-left:20px;">
              <li><strong>Structure:</strong> Earthquake resistant RCC frame structure designed to seismic zone standards.</li>
              <li><strong>Elevation:</strong> Contemporary modern duplex elevation with aesthetic exterior texture paint.</li>
              <li><strong>Flooring:</strong> Premium vitrified tiles in living, dining, and bedrooms; anti-skid tiles in bathrooms &amp; balconies.</li>
              <li><strong>Kitchen:</strong> Modular kitchen layout provision with granite countertop and stainless steel sink.</li>
              <li><strong>Electrical:</strong> Concealed copper wiring with modular switches, AC and inverter wiring provisions.</li>
            </ul>
          </div>
        </div>

        <!-- Additional Brochure Visuals -->
        <div class="card">
          <h3 style="font-family:'Poppins', sans-serif;font-size:18px;font-weight:700;color:#1e293b;margin:0 0 16px 0;">Kings Crest Project Layout &amp; Visuals</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <img src="assets/images/projects/kings-crest-duplex.png" alt="Kings Crest Duplex Brochure" style="width:100%;height:260px;object-fit:cover;border-radius:10px;">
            <img src="assets/images/projects/jhm-joy.jpg" alt="Kings Crest Community" style="width:100%;height:260px;object-fit:cover;border-radius:10px;">
          </div>
        </div>
      </div>

      <!-- Sidebar Booking Form -->
      <div>
        <div class="card" style="position:sticky;top:90px;">
          <h3 style="font-family:'Poppins', sans-serif;font-size:20px;font-weight:700;color:#1e293b;margin:0 0 8px 0;">Book Free Site Visit</h3>
          <p style="font-size:13px;color:#64748b;margin:0 0 18px 0;">Tour Kings Crest with our senior property consultant.</p>
          <form onsubmit="event.preventDefault();alert('Thank you! Your site visit for Kings Crest has been scheduled. Our team will contact you shortly.');">
            <div style="margin-bottom:14px;">
              <label style="display:block;font-size:12.5px;font-weight:600;color:#475569;margin-bottom:4px;">Your Name *</label>
              <input type="text" required placeholder="Full Name" style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:6px;box-sizing:border-box;">
            </div>
            <div style="margin-bottom:14px;">
              <label style="display:block;font-size:12.5px;font-weight:600;color:#475569;margin-bottom:4px;">Phone Number *</label>
              <input type="tel" required placeholder="10-digit mobile number" style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:6px;box-sizing:border-box;">
            </div>
            <div style="margin-bottom:14px;">
              <label style="display:block;font-size:12.5px;font-weight:600;color:#475569;margin-bottom:4px;">Preferred Date</label>
              <input type="date" style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:6px;box-sizing:border-box;">
            </div>
            <button type="submit" class="btnEnquire" style="width:100%;margin-bottom:12px;">Schedule Free Site Visit</button>
            <a href="https://wa.me/918534026777?text=Hi%20Skyyards%20Bareilly,%20I%20want%20details%20for%20Kings%20Crest" target="_blank" class="btnWhatsapp" style="display:block;text-align:center;">Chat on WhatsApp</a>
          </form>
          <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:13px;color:#64748b;">
            📍 <strong>Site Address:</strong> Kings Crest, Dohra Road, Bareilly U.P.<br>
            📞 <strong>Call Consultant:</strong> <a href="tel:08534026777" style="color:var(--primary);font-weight:700;text-decoration:none;">08534026777</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  ${getFooter()}
</body>
</html>`;

// 2. Olive Homes Page
const oliveHomesHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Olive Homes Bareilly | BDA Approved Plots & Villas at Lalpur, Bada Bypass | Skyyards</title>
  <meta name="description" content="Olive Homes - BDA approved residential plots and villas at Lalpur, Bada Bypass, Dohra Road, Bareilly. Close to Greater Bareilly and Ram Ganga Yojna. Starting at ₹32 Lac* onwards with up to 80% bank loan.">
  ${commonHead}
</head>
<body>
  ${getHeader('olive-homes')}

  <div class="pageHero">
    <div class="sectionContainer" style="padding-top:0;padding-bottom:0;">
      <div style="display:flex;gap:8px;margin-bottom:12px;">
        <span class="badge badgeGreen">BDA APPROVED PROJECT</span>
        <span class="badge badgeRed">STARTING ₹ 32 LAKHS*</span>
      </div>
      <h1>Olive Homes — Lalpur, Bada Bypass, Bareilly</h1>
      <p>A smart investment &amp; premium living destination. BDA approved residential plots and luxury villas situated near Greater Bareilly &amp; Ram Ganga Yojna with unmatched appreciation potential.</p>
    </div>
  </div>

  <div class="sectionContainer">
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:30px;">
      <div>
        <div class="card" style="padding:0;overflow:hidden;">
          <img src="assets/images/projects/olive-homes.jpg" alt="Olive Homes Bareilly" style="width:100%;height:400px;object-fit:cover;">
          <div style="padding:24px;">
            <h2 style="font-family:'Poppins', sans-serif;font-size:24px;font-weight:700;color:#1e293b;margin:0 0 10px 0;">Why Choose Olive Homes?</h2>
            <p style="color:#475569;line-height:1.8;font-size:15px;">
              We are excited to introduce <strong>Olive Homes</strong>, a prestigious <strong>BDA-Approved Real Estate Project</strong> at <strong>Lalpur, Bada Bypass, Dohra Road</strong>, strategically located very close to <strong>Greater Bareilly &amp; Ram Ganga Yojna</strong>. Designed for both savvy investors and discerning homebuyers, this development offers residential plots and premium villas with phenomenal appreciation prospects and modern township infrastructure.
            </p>

            <div style="background:#e0f2fe;color:#0369a1;padding:14px;border-radius:10px;font-weight:600;font-size:14px;margin:20px 0;">
              🏦 <strong>Bank Loan Facility:</strong> Loan available up to 80% by Bank of Baroda (BOB), Canara Bank, HDFC Bank, and all major lenders.
            </div>

            <h3 style="font-family:'Poppins', sans-serif;font-size:18px;font-weight:700;color:#1e293b;margin:24px 0 14px 0;">Project Highlights &amp; Features</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:14px;color:#334155;">
              <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">✅ BDA Approved – Safe &amp; Legally Clear Title</div>
              <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">✅ Strategic Location near Greater Bareilly</div>
              <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">✅ 40 &amp; 30 ft Wide Planned Inner Roads</div>
              <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">✅ Lush Green Parks &amp; Open Recreation Spaces</div>
              <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">✅ 24x7 Security with CCTV &amp; Manned Gate</div>
              <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">✅ Uninterrupted Water &amp; Electricity Supply</div>
              <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">✅ Modern Sewer &amp; Drainage System</div>
              <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">✅ Children's Play Area &amp; Jogging Tracks</div>
              <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">✅ Close to Top Schools, Hospitals &amp; Markets</div>
              <div style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">✅ High Appreciation Potential for Investors</div>
            </div>

            <h3 style="font-family:'Poppins', sans-serif;font-size:18px;font-weight:700;color:#1e293b;margin:30px 0 14px 0;">Master Site Plan &amp; Layout</h3>
            <p style="color:#475569;font-size:14px;line-height:1.7;">
              Olive Homes features an organized rectilinear grid layout with wide avenue plantation, dedicated park zones, and clear demarcations for standard and premium corner plots.
            </p>
            <div style="margin-top:14px;">
              <img src="assets/images/projects/olive-homes-masterplan.jpg" alt="Olive Homes Master Site Plan" style="width:100%;border-radius:10px;box-shadow:0 4px 15px rgba(0,0,0,0.08);">
            </div>
          </div>
        </div>

        <div class="card">
          <h3 style="font-family:'Poppins', sans-serif;font-size:18px;font-weight:700;color:#1e293b;margin:0 0 16px 0;">Olive Homes Project Gallery</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <img src="assets/images/projects/olive-homes-plots.jpg" alt="Olive Homes Plots" style="width:100%;height:240px;object-fit:cover;border-radius:10px;">
            <img src="assets/images/projects/olive-homes.jpg" alt="Olive Homes Gate" style="width:100%;height:240px;object-fit:cover;border-radius:10px;">
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div>
        <div class="card" style="position:sticky;top:90px;">
          <h3 style="font-family:'Poppins', sans-serif;font-size:20px;font-weight:700;color:#1e293b;margin:0 0 8px 0;">Book Site Visit / Reserve Plot</h3>
          <p style="font-size:13px;color:#64748b;margin:0 0 18px 0;">Limited plots available! Contact Sky Yards for best deals.</p>
          <form onsubmit="event.preventDefault();alert('Thank you! Your site visit for Olive Homes has been scheduled. Our team will contact you shortly.');">
            <div style="margin-bottom:14px;">
              <label style="display:block;font-size:12.5px;font-weight:600;color:#475569;margin-bottom:4px;">Your Name *</label>
              <input type="text" required placeholder="Full Name" style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:6px;box-sizing:border-box;">
            </div>
            <div style="margin-bottom:14px;">
              <label style="display:block;font-size:12.5px;font-weight:600;color:#475569;margin-bottom:4px;">Phone Number *</label>
              <input type="tel" required placeholder="10-digit mobile number" style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:6px;box-sizing:border-box;">
            </div>
            <div style="margin-bottom:14px;">
              <label style="display:block;font-size:12.5px;font-weight:600;color:#475569;margin-bottom:4px;">Plot Size / Requirement</label>
              <select style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:6px;box-sizing:border-box;">
                <option>Residential Plot (Under ₹ 35 Lakh)</option>
                <option>Large Plot (₹ 35 L - ₹ 50 Lakh)</option>
                <option>Ready Built Villa Option</option>
              </select>
            </div>
            <button type="submit" class="btnEnquire" style="width:100%;margin-bottom:12px;">Book Site Visit &amp; Get Price List</button>
            <a href="https://wa.me/918534026777?text=Hi%20Skyyards%20Bareilly,%20I%20want%20details%20for%20Olive%20Homes" target="_blank" class="btnWhatsapp" style="display:block;text-align:center;">Chat on WhatsApp</a>
          </form>
          <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:13px;color:#64748b;">
            📍 <strong>Site Address:</strong> Lalpur, Bada Bypass, Dohra Road, Bareilly U.P.<br>
            📞 <strong>Call Consultant:</strong> <a href="tel:08534026777" style="color:var(--primary);font-weight:700;text-decoration:none;">08534026777</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  ${getFooter()}
</body>
</html>`;

// 3. About Us Page
const aboutUsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>About Us | Skyyards Bareilly — Commitment, Honesty & Reliability</title>
  <meta name="description" content="About Sky Yards Bareilly - A premier real estate consulting company in India founded on commitment, honesty and reliability. Delivering the dream of home ownership everywhere.">
  ${commonHead}
</head>
<body>
  ${getHeader('about')}

  <div class="pageHero">
    <div class="sectionContainer" style="padding-top:0;padding-bottom:0;">
      <span class="badge badgeRed">ABOUT SKY YARDS</span>
      <h1 style="margin-top:10px;">Delivering the Dream of Home Ownership Everywhere</h1>
      <p>Sky Yards Is a Real Estate Consulting Company In India with a Vision To Succeed On The Principles Of Commitment, Honesty And Reliability.</p>
    </div>
  </div>

  <div class="sectionContainer">
    <div class="card">
      <h2 style="font-family:'Poppins', sans-serif;font-size:26px;font-weight:700;color:#1e293b;margin:0 0 16px 0;">About Sky Yards Consulting</h2>
      <p style="color:#475569;font-size:15px;line-height:1.8;">
        There is no denying the fact that buying a property in India is a complex and often stressful process. Homebuyers and investors require real-time advice, objective property comparisons, guided site tours, transparent deal closures, legal verification, and complete home loan assistance to make this life-defining decision.
      </p>
      <p style="color:#475569;font-size:15px;line-height:1.8;">
        At <strong>Sky Yards Bareilly</strong>, we provide end-to-end consulting for diverse real estate transactions spanning residential duplex villas, plotted townships, and prime commercial developments. We maintain a full-time staff of well-trained, passionate real estate professionals who continuously deliver quality services to individual buyers, families, and corporate clients across Bareilly and surrounding regions.
      </p>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px;">
      <div class="card" style="margin:0;border-left:5px solid var(--primary);">
        <h3 style="font-family:'Poppins', sans-serif;font-size:20px;font-weight:700;color:#1e293b;margin:0 0 10px 0;">🎯 Our Mission</h3>
        <p style="color:#475569;font-size:14.5px;line-height:1.7;margin:0;">
          <strong>Delivering the dream of home ownership everywhere.</strong> All branches of the Sky Yards companies share this singular goal because owning real estate provides true security, stability, and wealth-building opportunities for families.
        </p>
      </div>

      <div class="card" style="margin:0;border-left:5px solid #0284c7;">
        <h3 style="font-family:'Poppins', sans-serif;font-size:20px;font-weight:700;color:#1e293b;margin:0 0 10px 0;">🌟 Our Vision</h3>
        <p style="color:#475569;font-size:14.5px;line-height:1.7;margin:0;">
          <strong>Win, Make, Give, and Do Good.</strong> We want to win at what we do, and do all we can to help our customers, agents, and employees build lasting wealth while giving back meaningfully to our communities in Bareilly.
        </p>
      </div>
    </div>

    <!-- HEALTH Values -->
    <div class="card" style="background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%);color:#fff;">
      <h2 style="font-family:'Poppins', sans-serif;font-size:24px;font-weight:700;margin:0 0 10px 0;color:#fde047;">Our Core Values: H.E.A.L.T.H.</h2>
      <p style="color:#cbd5e1;font-size:14px;margin:0 0 24px 0;">Our values are what everyone at Sky Yards strives for each day. We believe our success is determined by our ability to maintain our H.E.A.L.T.H.:</p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(160px, 1fr));gap:16px;">
        <div style="background:rgba(255,255,255,0.08);padding:18px;border-radius:12px;border:1px solid rgba(255,255,255,0.15);text-align:center;">
          <div style="font-family:'Poppins', sans-serif;font-size:32px;font-weight:900;color:#fca5a5;">H</div>
          <strong style="display:block;font-size:15px;margin-top:4px;">Hard Work</strong>
          <span style="font-size:12px;color:#94a3b8;">Relentless dedication to finding the perfect property</span>
        </div>
        <div style="background:rgba(255,255,255,0.08);padding:18px;border-radius:12px;border:1px solid rgba(255,255,255,0.15);text-align:center;">
          <div style="font-family:'Poppins', sans-serif;font-size:32px;font-weight:900;color:#fca5a5;">E</div>
          <strong style="display:block;font-size:15px;margin-top:4px;">Extraordinary Results</strong>
          <span style="font-size:12px;color:#94a3b8;">Unmatched appreciation and client satisfaction</span>
        </div>
        <div style="background:rgba(255,255,255,0.08);padding:18px;border-radius:12px;border:1px solid rgba(255,255,255,0.15);text-align:center;">
          <div style="font-family:'Poppins', sans-serif;font-size:32px;font-weight:900;color:#fca5a5;">A</div>
          <strong style="display:block;font-size:15px;margin-top:4px;">Accountable</strong>
          <span style="font-size:12px;color:#94a3b8;">Accountable in all things and transparent in all deals</span>
        </div>
        <div style="background:rgba(255,255,255,0.08);padding:18px;border-radius:12px;border:1px solid rgba(255,255,255,0.15);text-align:center;">
          <div style="font-family:'Poppins', sans-serif;font-size:32px;font-weight:900;color:#fca5a5;">L</div>
          <strong style="display:block;font-size:15px;margin-top:4px;">Leaders Only</strong>
          <span style="font-size:12px;color:#94a3b8;">Setting benchmarks in Bareilly real estate advisory</span>
        </div>
        <div style="background:rgba(255,255,255,0.08);padding:18px;border-radius:12px;border:1px solid rgba(255,255,255,0.15);text-align:center;">
          <div style="font-family:'Poppins', sans-serif;font-size:32px;font-weight:900;color:#fca5a5;">T</div>
          <strong style="display:block;font-size:15px;margin-top:4px;">Teamwork</strong>
          <span style="font-size:12px;color:#94a3b8;">Collaborating seamlessly for our clients' best interest</span>
        </div>
        <div style="background:rgba(255,255,255,0.08);padding:18px;border-radius:12px;border:1px solid rgba(255,255,255,0.15);text-align:center;">
          <div style="font-family:'Poppins', sans-serif;font-size:32px;font-weight:900;color:#fca5a5;">H</div>
          <strong style="display:block;font-size:15px;margin-top:4px;">Humble</strong>
          <span style="font-size:12px;color:#94a3b8;">Approachable, honest, and grounded in every interaction</span>
        </div>
      </div>
    </div>
  </div>

  ${getFooter()}
</body>
</html>`;

// 4. Contact Us Page
const contactUsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Contact Us | Skyyards Bareilly — JHM Ace Commercial Dohra Road</title>
  <meta name="description" content="Contact Sky Yards Bareilly. Visit our office at JHM Ace Commercial, Dohra Road, Bareilly U.P. 243005. Call 08534026777 or 08218095851. Email: skyyardsofficial@gmail.com.">
  ${commonHead}
</head>
<body>
  ${getHeader('contact')}

  <div class="pageHero">
    <div class="sectionContainer" style="padding-top:0;padding-bottom:0;">
      <span class="badge badgeRed">GET IN TOUCH</span>
      <h1 style="margin-top:10px;">Contact Sky Yards Consulting Services</h1>
      <p>Our senior real estate consultants are ready to assist you with property selection, free site tours, BDA/RERA verification, and home loan processing.</p>
    </div>
  </div>

  <div class="sectionContainer">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;">
      <div>
        <div class="card">
          <h2 style="font-family:'Poppins', sans-serif;font-size:22px;font-weight:700;color:#1e293b;margin:0 0 16px 0;">Corporate Office</h2>
          <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:18px;">
            <span style="font-size:24px;">📍</span>
            <div>
              <strong style="display:block;font-size:16px;color:#1e293b;">SKY YARDS</strong>
              <span style="font-size:14px;color:#475569;line-height:1.6;">JHM Ace Commercial, Dohra Road, Bareilly, Uttar Pradesh 243005</span>
            </div>
          </div>

          <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:18px;">
            <span style="font-size:24px;">📞</span>
            <div>
              <strong style="display:block;font-size:16px;color:#1e293b;">Phone Numbers</strong>
              <span style="font-size:14px;color:#475569;">
                <a href="tel:08534026777" style="color:var(--primary);font-weight:700;text-decoration:none;">08534026777</a>, 
                <a href="tel:08218095851" style="color:var(--primary);font-weight:700;text-decoration:none;">08218095851</a>
              </span>
            </div>
          </div>

          <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:24px;">
            <span style="font-size:24px;">✉️</span>
            <div>
              <strong style="display:block;font-size:16px;color:#1e293b;">Email Address</strong>
              <span style="font-size:14px;color:#475569;">
                <a href="mailto:skyyardsofficial@gmail.com" style="color:#0284c7;text-decoration:none;">skyyardsofficial@gmail.com</a>
              </span>
            </div>
          </div>

          <div style="margin-top:20px;border-radius:10px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.08);">
            <img src="assets/images/projects/jhm-ace-commercial.jpg" alt="Sky Yards JHM Ace Commercial" style="width:100%;height:220px;object-fit:cover;">
          </div>
        </div>
      </div>

      <div>
        <div class="card">
          <h2 style="font-family:'Poppins', sans-serif;font-size:22px;font-weight:700;color:#1e293b;margin:0 0 16px 0;">Send Us a Message</h2>
          <form onsubmit="event.preventDefault();alert('Thank you! Your message has been sent to Sky Yards Bareilly. We will respond within 30 minutes.');">
            <div style="margin-bottom:14px;">
              <label style="display:block;font-size:13px;font-weight:600;color:#475569;margin-bottom:6px;">Your Name *</label>
              <input type="text" required placeholder="Full Name" style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:8px;box-sizing:border-box;">
            </div>
            <div style="margin-bottom:14px;">
              <label style="display:block;font-size:13px;font-weight:600;color:#475569;margin-bottom:6px;">Mobile Number *</label>
              <input type="tel" required placeholder="10-digit mobile number" style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:8px;box-sizing:border-box;">
            </div>
            <div style="margin-bottom:14px;">
              <label style="display:block;font-size:13px;font-weight:600;color:#475569;margin-bottom:6px;">Interested In *</label>
              <select style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:8px;box-sizing:border-box;">
                <option>Kings Crest (Duplex 3BHK Villas • Dohra Road)</option>
                <option>Olive Homes (BDA Approved Plots • Bada Bypass)</option>
                <option>King's Avenue (3BHK Villas • Dohra Road)</option>
                <option>JHM Desire (3BHK Villas • Badaun Road)</option>
                <option>Eldeco City (Nainital Road)</option>
                <option>JHM Ace Commercial (Showrooms/Office)</option>
                <option>Home Loan Assistance</option>
              </select>
            </div>
            <div style="margin-bottom:18px;">
              <label style="display:block;font-size:13px;font-weight:600;color:#475569;margin-bottom:6px;">Your Message / Query</label>
              <textarea rows="4" placeholder="How can we assist you?" style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:8px;box-sizing:border-box;font-family:inherit;"></textarea>
            </div>
            <button type="submit" class="btnEnquire" style="width:100%;margin-bottom:12px;">Submit Inquiry</button>
            <a href="https://wa.me/918534026777?text=Hi%20Skyyards%20Bareilly" target="_blank" class="btnWhatsapp" style="display:block;text-align:center;">Chat on WhatsApp</a>
          </form>
        </div>
      </div>
    </div>
  </div>

  ${getFooter()}
</body>
</html>`;

fs.writeFileSync('kings-crest.html', kingsCrestHtml, 'utf8');
fs.writeFileSync('olive-homes.html', oliveHomesHtml, 'utf8');
fs.writeFileSync('about-us.html', aboutUsHtml, 'utf8');
fs.writeFileSync('contact-us.html', contactUsHtml, 'utf8');

console.log('Successfully created all subpages: kings-crest.html, olive-homes.html, about-us.html, contact-us.html');

