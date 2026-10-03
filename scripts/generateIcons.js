const fs = require('fs');
const path = require('path');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="128" fill="url(#grad)"/>
  <defs>
    <linearGradient id="grad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
  </defs>
  <g transform="translate(96, 96) scale(13.333)" fill="none" stroke="#09090b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="m6.5 6.5 11 11"/>
    <path d="m21 21-1-1"/>
    <path d="m3 3 1 1"/>
    <path d="m18 22 4-4"/>
    <path d="m2 6 4-4"/>
    <path d="m3 10 7-7"/>
    <path d="m14 21 7-7"/>
  </g>
</svg>`;

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');
console.log('Fichier public/icon.svg créé avec succès !');
