const fs = require('fs');
const path = require('path');

const dir = 'src/components/exercises';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const replacements = {
  'bg-blue-50/50': 'bg-blue-500/10',
  'bg-blue-50': 'bg-blue-500/10',
  'bg-blue-100': 'bg-blue-500/20',
  'border-b-gray-200': 'border-b-[#37464f]',
  'border-gray-200': 'border-[#37464f]',
  'bg-gray-100': 'bg-[#202f36]',
  'text-blue-600': 'text-blue-400',
  'text-gray-800': 'text-white'
};

for (const file of files) {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replaceAll(key, value);
  }
  fs.writeFileSync(p, content, 'utf8');
}
