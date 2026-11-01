const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'public');
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

// Copy html and static files
const staticFiles = [
  'index.html',
  'dohra-road.html',
  'kings-crest.html',
  'olive-homes.html',
  'about-us.html',
  'contact-us.html',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  'serve.json'
];

staticFiles.forEach(f => {
  if (fs.existsSync(f)) {
    fs.copyFileSync(f, path.join(outDir, f));
    console.log(`Copied ${f} to public/`);
  } else {
    console.warn(`Warning: ${f} not found in root!`);
  }
});

// Copy assets directory
if (fs.existsSync('assets')) {
  console.log('Copying assets/ to public/assets/ ...');
  fs.cpSync('assets', path.join(outDir, 'assets'), { recursive: true });
  console.log('Finished copying assets/.');
}

// Copy fonts.googleapis.com directory if present
if (fs.existsSync('fonts.googleapis.com')) {
  console.log('Copying fonts.googleapis.com/ to public/fonts.googleapis.com/ ...');
  fs.cpSync('fonts.googleapis.com', path.join(outDir, 'fonts.googleapis.com'), { recursive: true });
  console.log('Finished copying fonts.googleapis.com/.');
}

console.log('Build static complete! Files in public/:', fs.readdirSync(outDir));
