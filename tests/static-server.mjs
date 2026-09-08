// Minimal static file server for the built site (dist/client), used only by the
// Playwright review-page tests. Maps trailing-slash dirs to index.html and
// preserves query strings. Calls to /api/event/ 404 here — that's fine, the
// page fires them fire-and-forget and swallows failures.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROOT = new URL('../dist/client/', import.meta.url).pathname.replace(
  /^\/([A-Za-z]:)/,
  '$1'
);
const PORT = Number(process.env.PORT || 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.xml': 'application/xml',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
};

async function resolveFile(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const candidates = [];
  if (clean.endsWith('/')) candidates.push(join(ROOT, clean, 'index.html'));
  else {
    candidates.push(join(ROOT, clean));
    candidates.push(join(ROOT, clean, 'index.html'));
  }
  for (const c of candidates) {
    try {
      const s = await stat(c);
      if (s.isFile()) return c;
    } catch {}
  }
  return null;
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const file = await resolveFile(url.pathname);
  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('Not found');
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(500);
    res.end('Error');
  }
}).listen(PORT, () => console.log(`static server on http://localhost:${PORT}`));
