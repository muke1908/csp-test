const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ancestor = process.env.ANCESTOR || '';

const cspHeader = `frame-ancestors 'self'${ancestor ? ' ' + ancestor : ''}`;

const MIME_TYPES = {
  '.html': 'text/html',
};

const ALLOWED_FILES = new Set(['/near.html', '/far.html']);

const server = http.createServer((req, res) => {
  const url = req.url === '/' ? '/far.html' : req.url;

  if (!ALLOWED_FILES.has(url)) {
    res.writeHead(404, {
      'Content-Type': 'text/plain',
      'Content-Security-Policy': cspHeader,
    });
    res.end('Not Found');
    return;
  }

  const filePath = path.join(__dirname, url);
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, {
        'Content-Type': 'text/plain',
        'Content-Security-Policy': cspHeader,
      });
      res.end('Not Found');
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Security-Policy': cspHeader,
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`CSP header: Content-Security-Policy: ${cspHeader}`);
});
