import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const failures = [];

const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const target = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(target) : [target];
});

const files = walk(dist);
const htmlFiles = files.filter((file) => file.endsWith('.html'));

const routeFor = (file) => {
  const relative = path.relative(dist, file).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -10)}`;
  return `/${relative}`;
};

const targetFor = (pathname) => {
  const decoded = decodeURIComponent(pathname);
  const relative = decoded.replace(/^\//, '');
  if (!relative) return path.join(dist, 'index.html');
  if (decoded.endsWith('/')) return path.join(dist, relative, 'index.html');
  if (path.extname(relative)) return path.join(dist, relative);
  const direct = path.join(dist, relative);
  return fs.existsSync(direct) && fs.statSync(direct).isFile() ? direct : path.join(direct, 'index.html');
};

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const route = routeFor(file);
  const noindex = /<meta name="robots" content="noindex"/.test(html);

  if (!noindex) {
    const required = [
      ['title', /<title>[^<]+<\/title>/],
      ['description', /<meta name="description" content="[^"]+"/],
      ['canonical', /<link rel="canonical" href="https:\/\/azeezhamzat\.com\/[^"]*"/],
      ['Open Graph title', /<meta property="og:title" content="[^"]+"/],
      ['Open Graph description', /<meta property="og:description" content="[^"]+"/],
      ['X title', /<meta name="twitter:title" content="[^"]+"/],
      ['X description', /<meta name="twitter:description" content="[^"]+"/],
    ];
    required.forEach(([label, expression]) => {
      if (!expression.test(html)) failures.push(`${route}: missing ${label}`);
    });

    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || '';
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] || '';
    if (title.length > 70) failures.push(`${route}: title exceeds 70 characters (${title.length})`);
    if (description.length > 160) failures.push(`${route}: description exceeds 160 characters (${description.length})`);

    const h1Count = (html.match(/<h1(?:\s|>)/g) || []).length;
    if (h1Count !== 1) failures.push(`${route}: expected one h1, found ${h1Count}`);

    const headings = [...html.matchAll(/<h([1-6])(?:\s|>)/g)].map((match) => Number(match[1]));
    headings.forEach((level, index) => {
      if (index > 0 && level > headings[index - 1] + 1) {
        failures.push(`${route}: heading level skips from h${headings[index - 1]} to h${level}`);
      }
    });
  }

  if (route.startsWith('/writing/') && route !== '/writing/' && /<meta property="og:image"/.test(html)) {
    failures.push(`${route}: article unexpectedly inherited the site-wide social image`);
  }

  if (!route.startsWith('/writing/') && !noindex && route !== '/404.html' && !html.includes('https://azeezhamzat.com/og.jpg')) {
    failures.push(`${route}: missing the site-wide social image`);
  }

  if (/href="#"|href=""/.test(html)) failures.push(`${route}: contains a placeholder link`);
  if (/<img(?![^>]*\salt=)[^>]*>/.test(html)) failures.push(`${route}: contains an image without alt text`);
  if (/<button(?![^>]*\stype=)[^>]*>/.test(html)) failures.push(`${route}: contains a button without an explicit type`);
  if (html.includes('—')) failures.push(`${route}: contains an em dash`);
  if (html.includes('fonts.googleapis.com') || html.includes('fonts.gstatic.com')) failures.push(`${route}: contains an external font dependency`);

  if (!noindex && route !== '/404.html') {
    if (!html.includes('<link rel="icon"')) failures.push(`${route}: missing favicon metadata`);
    if (!html.includes('<link rel="manifest"')) failures.push(`${route}: missing web manifest metadata`);
  }

  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (/^(https?:|mailto:|tel:|#)/.test(href)) continue;
    const resolved = new URL(href, `https://azeezhamzat.com${route}`);
    const target = targetFor(resolved.pathname);
    if (!fs.existsSync(target)) failures.push(`${route}: broken internal link ${href}`);
  }
}

['robots.txt', 'rss.xml', 'sitemap-index.xml', 'og.jpg', 'favicon-32.png', 'site.webmanifest', 'Azeez_Adewale_Hamzat_CV.pdf'].forEach((asset) => {
  if (!fs.existsSync(path.join(dist, asset))) failures.push(`Missing generated asset: ${asset}`);
});

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML pages and ${files.length} generated files.`);
