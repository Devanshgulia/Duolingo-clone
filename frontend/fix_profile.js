const fs = require('fs');
const file = 'src/app/profile/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacements = {
  'bg-blue-50': 'bg-blue-500/10',
  'border-blue-200': 'border-blue-500/30',
  'bg-blue-100': 'bg-blue-500/20',
  'text-blue-700': 'text-blue-400',
  'bg-amber-50/50': 'bg-amber-500/10',
  'border-amber-300': 'border-amber-500/30',
  'text-amber-600': 'text-amber-500',
  'bg-amber-100': 'bg-amber-500/20',
  'border-blue-400': 'border-blue-500',
};

for (const [key, value] of Object.entries(replacements)) {
  content = content.replaceAll(key, value);
}

fs.writeFileSync(file, content, 'utf8');
