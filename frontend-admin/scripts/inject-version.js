const fs = require('fs');
const path = require('path');

// Gera uma versão baseada no timestamp e hash do package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const version = `${packageJson.version}-${Date.now()}`;
const buildDate = new Date().toISOString();

// Caminho do index.html após o build
const indexPath = path.join(__dirname, '../dist/sellup/browser/index.html');

// Lê o index.html
if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Adiciona query parameter de versão em todos os scripts
  indexContent = indexContent.replace(
    /(<script[^>]*src=")([^"]*)(")([^>]*>)/g,
    (match, p1, src, p3, p4) => {
      // Não adiciona versão se já tiver hash (Angular já faz isso)
      if (src.includes('.') && !src.includes('?')) {
        return `${p1}${src}?v=${version}${p3}${p4}`;
      }
      return match;
    }
  );
  
  // Adiciona query parameter de versão em todos os links CSS
  indexContent = indexContent.replace(
    /(<link[^>]*href=")([^"]*\.css)(")([^>]*>)/g,
    (match, p1, href, p3, p4) => {
      if (!href.includes('?')) {
        return `${p1}${href}?v=${version}${p3}${p4}`;
      }
      return match;
    }
  );
  
  // Adiciona versão no manifest.json
  indexContent = indexContent.replace(
    /href="\/manifest\.json"/g,
    `href="/manifest.json?v=${version}"`
  );
  
  // Adiciona meta tags com versão e build date
  const metaVersion = `    <meta name="build-version" content="${version}" />\n    <meta name="build-date" content="${buildDate}" />\n`;
  if (!indexContent.includes('build-version')) {
    indexContent = indexContent.replace('</head>', `${metaVersion}  </head>`);
  } else {
    indexContent = indexContent.replace(
      /<meta name="build-version"[^>]*>/,
      `<meta name="build-version" content="${version}" />`
    );
    indexContent = indexContent.replace(
      /<meta name="build-date"[^>]*>/,
      `<meta name="build-date" content="${buildDate}" />`
    );
  }
  
  // Escreve o arquivo modificado
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log(`✅ Cache busting aplicado - Versão: ${version}`);
  console.log(`   Build Date: ${buildDate}`);
} else {
  console.warn(`⚠️  Arquivo não encontrado: ${indexPath}`);
  console.warn(`   Certifique-se de que o build foi executado antes deste script.`);
  process.exit(1);
}
