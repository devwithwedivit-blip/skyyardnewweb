const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

const mimeMap = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.json': 'application/json',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(__dirname, reqPath);
  if (!fs.existsSync(filePath)) {
    const cwdPath = path.join(process.cwd(), reqPath);
    if (fs.existsSync(cwdPath)) filePath = cwdPath;
  }

  // If path doesn't exist, check fallback
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // If it's an asset or image, NEVER serve index.html
    if (reqPath.startsWith('/assets/') || reqPath.endsWith('.avif') || reqPath.endsWith('.webp') || reqPath.endsWith('.png') || reqPath.endsWith('.jpg') || reqPath.endsWith('.svg')) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Asset not found');
      return;
    }
    filePath = path.join(__dirname, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeMap[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }
    const isImmutable = reqPath.includes('/assets/images/opt/');
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': isImmutable ? 'public, max-age=31536000, immutable' : 'public, max-age=604800'
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Skyyards Bareilly server is live at: http://localhost:${PORT}`);
  console.log(`📁 Serving directory: ${__dirname}`);
});

module.exports = server;
