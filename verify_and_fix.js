const fs = require('fs');
const path = require('path');

const files = ['index.html', 'about.html', 'contact.html', 'investors.html', 'services.html', 'startups.html'];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Fix literal `r`n
  content = content.replace(/`r`n/g, '\r\n');

  // 2. Fix mojibake
  content = content.replace(/â€”/g, '—');
  content = content.replace(/â€¦/g, '…');
  content = content.replace(/â€“/g, '–');

  // 3. Fix investors.html first footer link if still href="#"
  if (file === 'investors.html') {
    content = content.replace(
      /<a href="#" style="font-size:13.5px;color:#B9C5D6;text-decoration:none;"\s+onmouseover="this.style.color='#C69A3A'" onmouseout="this.style.color='#B9C5D6'">Fundraising\s+Advisory<\/a>/,
      '<a href="services.html" style="font-size:13.5px;color:#B9C5D6;text-decoration:none;" onmouseover="this.style.color=\'#C69A3A\'" onmouseout="this.style.color=\'#B9C5D6\'">Fundraising Advisory</a>'
    );
  }

  // 4. In contact.html, check the schedule call button
  if (file === 'contact.html') {
    content = content.replace(
      /<a href="https:\/\/forms\.gle\/SG41uJaHyWQx4Vf59" target="_blank" class="btn-gold">\s*`r`n\s*Schedule a Call/g,
      '<a href="https://forms.gle/SG41uJaHyWQx4Vf59" target="_blank" class="btn-gold">\r\n    Schedule a Call'
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});

