const fs = require('fs');

const replacements = {
  'divide-gray-100': 'divide-[#37464f]',
  'bg-amber-100': 'bg-amber-500/20',
  'border-amber-200': 'border-amber-500/30',
  'bg-blue-50/80': 'bg-blue-500/10',
  'bg-purple-100': 'bg-purple-500/20',
  'border-purple-200': 'border-purple-500/30',
  'bg-red-100': 'bg-red-500/20',
  'border-red-200': 'border-red-500/30',
  'bg-purple-50/50': 'bg-purple-500/10',
  'border-purple-300': 'border-purple-500/30',
};

['src/app/leaderboard/page.tsx', 'src/app/shop/page.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replaceAll(key, value);
  }
  fs.writeFileSync(file, content, 'utf8');
});
