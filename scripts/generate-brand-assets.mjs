import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const publicDir = path.join(root, 'public');

const icon = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="112" fill="#1b201e"/>
    <g fill="none" stroke="#d3b872" stroke-width="12" stroke-linecap="round" opacity=".9">
      <path d="M256 256L145 154M256 256l132-78M256 256l89 120M256 256l-132 96M145 154l243 24M124 352l221 24"/>
    </g>
    <g fill="#d3b872">
      <circle cx="256" cy="256" r="38"/>
      <circle cx="145" cy="154" r="22"/>
      <circle cx="388" cy="178" r="18"/>
      <circle cx="345" cy="376" r="24"/>
      <circle cx="124" cy="352" r="17"/>
    </g>
    <circle cx="256" cy="256" r="15" fill="#1b201e"/>
  </svg>
`);

const outputs = [
  ['favicon-32.png', 32],
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
];

await Promise.all(outputs.map(([name, size]) =>
  sharp(icon).resize(size, size).png({ compressionLevel: 9 }).toFile(path.join(publicDir, name))
));

const socialPng = path.join(publicDir, 'og.png');
const socialJpg = path.join(publicDir, 'og.jpg');
const socialInput = await fs.access(socialPng).then(() => socialPng).catch(() => socialJpg);
const socialTemp = path.join(publicDir, 'og.optimized.jpg');
await sharp(socialInput)
  .jpeg({ quality: 88, chromaSubsampling: '4:4:4', mozjpeg: true })
  .toFile(socialTemp);
await fs.rename(socialTemp, socialJpg);
if (socialInput === socialPng) await fs.unlink(socialPng);
