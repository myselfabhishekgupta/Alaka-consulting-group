const fs = require('fs');
const path = require('path');

const files = ['index.html', 'about.html', 'contact.html', 'investors.html', 'services.html', 'startups.html'];

console.log('=== COMPREHENSIVE SITE AUDIT ===\n');

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Check 1: Old brand name
  const oldBrandMatches = content.match(/Alaka\s+Consulting/gi);
  if (oldBrandMatches) {
    console.log(`[ALERT] ${file} contains ${oldBrandMatches.length} references to "Alaka Consulting":`, oldBrandMatches);
  }

  // Check 2: Stray literal backtick r backtick n
  if (content.includes('`r`n')) {
    console.log(`[ALERT] ${file} still contains literal \`r\`n!`);
  }

  // Check 3: Mojibake
  if (/â[€|…|–|—]/.test(content)) {
    console.log(`[ALERT] ${file} contains mojibake characters!`);
  }

  // Check 4: Check for dead href="#"
  const hrefHash = [];
  const regex = /<a\s+[^>]*href=["']#["'][^>]*>(.*?)<\/a>/gis;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    // Ignore if it's the scheduleCallBtn which has an ID attached or is intentionally hooked
    hrefHash.push(text || '[empty/icon]');
  }
  if (hrefHash.length > 0) {
    console.log(`[INFO] ${file} has ${hrefHash.length} href="#" links:`, hrefHash);
  }

  // Check 5: Check forms
  const formMatches = content.match(/<form[\s\S]*?<\/form>/gi);
  if (formMatches) {
    console.log(`[OK] ${file} has ${formMatches.length} <form> element(s).`);
  }

  // Check 6: Check favicon
  const hasFavicon = /<link\s+[^>]*rel=["']icon["'][^>]*>/i.test(content);
  if (!hasFavicon) {
    console.log(`[ALERT] ${file} is missing favicon!`);
  } else {
    console.log(`[OK] ${file} has favicon.`);
  }
});

