const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-white': 'bg-[#131f24]',
  'text-gray-800': 'text-white',
  'text-gray-900': 'text-white',
  'text-gray-700': 'text-gray-300',
  'text-gray-600': 'text-gray-400',
  'text-gray-500': 'text-[#afafaf]',
  'text-gray-400': 'text-gray-500',
  'border-gray-200': 'border-[#37464f]',
  'border-gray-100': 'border-[#202f36]',
  'bg-gray-50': 'bg-[#202f36]',
  'bg-gray-100': 'bg-[#202f36]',
  'bg-gray-200': 'bg-[#37464f]',
  'hover:bg-gray-50': 'hover:bg-[#202f36]',
  'hover:bg-gray-100': 'hover:bg-[#202f36]',
  'hover:bg-gray-200': 'hover:bg-[#37464f]',
};

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      let content = fs.readFileSync(p, 'utf8');
      let modified = false;
      
      for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        if (regex.test(content)) {
          content = content.replace(regex, value);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(p, content, 'utf8');
        console.log(`Updated ${p}`);
      }
    }
  }
}

walk('./src');
