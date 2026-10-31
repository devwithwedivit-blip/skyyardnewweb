const fs = require('fs');
const path = require('path');

// 1. Process index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Replace CSS header padding & logo styling & hide any gblCity elements
indexHtml = indexHtml.replace(
  /header\{padding:0 15px 0 125px !important;z-index:9!important;background:#000;display:flex;align-items:center;height:48px;width:100%;position:fixed;top:0;left:0;transition:\.3s ease\}header \.logoBox\{position:absolute;top:5px;left:15px;display:flex;height:44px\}header \.logoBox a\{display:flex;align-items:center\}header \.gblCityDropdown\{height:48px;display:inline-block;float:left;position:relative\}/,
  'header{padding:0 20px !important;z-index:9!important;background:#000;display:flex;align-items:center;height:48px;width:100%;position:fixed;top:0;left:0;transition:.3s ease}header .logoBox{position:relative !important;top:0 !important;left:0 !important;display:flex;align-items:center;height:44px;margin-right:25px;flex-shrink:0;}header .logoBox a{display:flex;align-items:center}header .gblCityDropdown, .gblCityDropdown, #gblCityBtn, #gblCityBox, .gblCityBox, #dev_headercitypopup_container{display:none !important;}'
);

// Also add a global style override in <head> for absolute safety
const styleOverride = `<style id="hideCityDropdownStyles">
header { padding: 0 20px !important; display: flex !important; align-items: center !important; }
header .logoBox { position: relative !important; top: 0 !important; left: 0 !important; margin-right: 25px !important; flex-shrink: 0 !important; }
.gblCityDropdown, #gblCityBtn, #gblCityBox, .gblCityBox, #dev_headercitypopup_container, .citySelectorBtn { display: none !important; visibility: hidden !important; width: 0 !important; height: 0 !important; overflow: hidden !important; pointer-events: none !important; }
</style>`;

if (!indexHtml.includes('id="hideCityDropdownStyles"')) {
  indexHtml = indexHtml.replace('</head>', styleOverride + '\n</head>');
}

// Remove the HTML markup for gblCityDropdown & fix logo styling
const oldLogoAndCityRegex = /<div class="logoBox Top_Misc_L1">[\s\S]*?<div class="gblCityDropdown">[\s\S]*?<\/div>\s*<\/div>\s*<div class="gblOverflow"><\/div>/;

const newLogoMarkup = `<div class="logoBox Top_Misc_L1" style="position:relative;top:0;left:0;display:flex;align-items:center;height:44px;margin-right:25px;flex-shrink:0;">
    <a href="/" title="Skyyards Bareilly" name="Skyyards Bareilly" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
        <img fetchpriority="low" alt="Skyyards Bareilly Logo" class="img-responsive Top_Misc_L1" style="height:36px;width:auto;object-fit:contain;" src="assets/images/skyyards-logo.png" onerror="this.src='assets/images/Skyyards Bareilly.png'">
        <span style="font-family:'Poppins',sans-serif;font-weight:800;font-size:18px;color:#ffffff;letter-spacing:-0.5px;line-height:1.1;">SKY<span style="color:#d92228;">YARDS</span> <span style="font-size:10px;color:#ffd916;font-weight:700;display:block;letter-spacing:1.5px;">BAREILLY</span></span>
    </a> 
</div>`;

if (oldLogoAndCityRegex.test(indexHtml)) {
  indexHtml = indexHtml.replace(oldLogoAndCityRegex, newLogoMarkup);
  console.log('Replaced old logo + gblCityDropdown with clean logo markup in index.html');
} else {
  // Try targeted replacement if regex did not match full pattern
  console.log('Regex did not match exact pattern, trying targeted replacements...');
  indexHtml = indexHtml.replace(/<div class="gblCityDropdown">[\s\S]*?<\/div>\s*<\/div>/g, '');
  indexHtml = indexHtml.replace(/<div class="gblCityDropdown">[\s\S]*?<\/div>/g, '');
}

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('index.html updated successfully.');

// 2. Process subpages: kings-crest.html, olive-homes.html, about-us.html, contact-us.html
const subpages = ['kings-crest.html', 'olive-homes.html', 'about-us.html', 'contact-us.html'];
subpages.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Remove citySelectorBtn
    content = content.replace(/<div class="citySelectorBtn">[\s\S]*?<\/div>/g, '');
    // Ensure header logo has good margin
    content = content.replace(/header \.logoBox \{ display: flex; align-items: center; \}/g, 'header .logoBox { display: flex; align-items: center; margin-right: 25px; flex-shrink: 0; }');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`${file} updated (city dropdown removed).`);
  }
});

// 3. Update build_subpages.js
let buildSubpages = fs.readFileSync('build_subpages.js', 'utf8');
buildSubpages = buildSubpages.replace(/<div class="citySelectorBtn">[\s\S]*?<\/div>/g, '');
fs.writeFileSync('build_subpages.js', buildSubpages, 'utf8');
console.log('build_subpages.js updated.');

