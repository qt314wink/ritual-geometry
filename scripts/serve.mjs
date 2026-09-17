import {createReadStream} from 'node:fs';
import {realpath, stat} from 'node:fs/promises';
import {createServer} from 'node:http';
import {extname, resolve, sep} from 'node:path';

const repoRoot = resolve(process.cwd());
const publicRoot = resolve(repoRoot, 'apps', 'atlas', 'public');
const publicReal = await realpath(publicRoot);
const port = Number(process.env.PORT || 4173);
const mimeByExtension = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gcode', 'text/plain; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.md', 'text/markdown; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml']
]);

function isWithin(root, candidate) {
  return candidate === root || candidate.startsWith(root + sep);
}

async function resolvePublicFile(urlPathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPathname);
  } catch {
    return null;
  }
  const requested = decoded === '/' ? '/index.html' : decoded;
  const lexicalPath = resolve(publicReal, `.${requested}`);
  if (!isWithin(publicReal, lexicalPath)) return null;
  try {
    const fileStat = await stat(lexicalPath);
    if (!fileStat.isFile()) return null;
    const actualPath = await realpath(lexicalPath);
    return isWithin(publicReal, actualPath) ? actualPath : null;
  } catch {
    return null;
  }
}

const server = createServer(async (request, response) => {
  if (!request.url || !['GET', 'HEAD'].includes(request.method || '')) {
    response.writeHead(405, {'content-type': 'text/plain; charset=utf-8'});
    response.end('Method not allowed');
    return;
  }
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  const filePath = await resolvePublicFile(url.pathname);
  if (!filePath) {
    response.writeHead(404, {'content-type': 'text/plain; charset=utf-8'});
    response.end('Not found');
    return;
  }
  response.writeHead(200, {
    'content-type': mimeByExtension.get(extname(filePath).toLowerCase()) || 'application/octet-stream',
    'x-content-type-options': 'nosniff'
  });
  if (request.method === 'HEAD') {
    response.end();
    return;
  }
  createReadStream(filePath).pipe(response);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Ritual Geometry atlas available at http://localhost:${port}/`);
});
