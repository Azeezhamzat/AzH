import fs from 'node:fs/promises';
import path from 'node:path';

const sourceRoot = path.join(process.cwd(), 'src');

const walk = async (directory) => {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else files.push(target);
  }
  return files;
};

const files = await walk(sourceRoot);
const urls = new Set();

for (const file of files) {
  if (!/\.(astro|md|ts)$/.test(file)) continue;
  const content = await fs.readFile(file, 'utf8');
  for (const match of content.matchAll(/https:\/\/[^\s"'<>`)]+/g)) urls.add(match[0].replace(/[.,;:]$/, ''));
}

const queue = [...urls].sort();
const failures = [];
const warnings = [];

const check = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(12000),
      headers: { 'user-agent': 'Mozilla/5.0 AzeezHamzatSiteLinkCheck/1.0' },
    });
    if (response.status === 404 || response.status === 410) failures.push(`${response.status} ${url}`);
    else if (response.status >= 500) warnings.push(`${response.status} ${url}`);
  } catch (error) {
    warnings.push(`unverified ${url} (${error.name})`);
  }
};

const workers = Array.from({ length: 6 }, async () => {
  while (queue.length) await check(queue.shift());
});

await Promise.all(workers);

if (warnings.length) console.warn(warnings.join('\n'));
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Checked ${urls.size} external links; no confirmed 404 or 410 responses.`);
