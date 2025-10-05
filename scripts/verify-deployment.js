#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'src/api/client.ts',
  'src/api/types.ts',
  'src/components/ui/card.tsx',
  'src/components/ui/badge.tsx',
  'src/components/ui/button.tsx',
  'src/components/model/model-metrics-display.tsx',
  'tsconfig.json',
  'jsconfig.json',
  'next.config.js',
  'package.json',
  'render.yaml',
  '.nvmrc'
];

console.log('🔍 Verifying deployment files...\n');

let allFilesPresent = true;

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesPresent = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allFilesPresent) {
  console.log('🎉 All required files are present!');
  console.log('✅ Ready for deployment to Render');
  process.exit(0);
} else {
  console.log('❌ Some required files are missing!');
  console.log('🚫 Not ready for deployment');
  process.exit(1);
}
