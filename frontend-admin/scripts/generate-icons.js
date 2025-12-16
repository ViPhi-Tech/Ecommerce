/**
 * Script para gerar ícones PWA a partir de uma imagem base
 * 
 * Uso: node scripts/generate-icons.js [caminho-da-imagem-base]
 * 
 * Requer: npm install sharp --save-dev
 */

const fs = require('fs');
const path = require('path');

// Tamanhos dos ícones necessários
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons(imagePath) {
  try {
    // Verifica se sharp está instalado
    let sharp;
    try {
      sharp = require('sharp');
    } catch (e) {
      console.error('❌ Erro: sharp não está instalado.');
      console.log('📦 Instale com: npm install sharp --save-dev');
      process.exit(1);
    }

    if (!fs.existsSync(imagePath)) {
      console.error(`❌ Erro: Arquivo não encontrado: ${imagePath}`);
      process.exit(1);
    }

    const outputDir = path.join(__dirname, '../public/icons');
    
    // Cria o diretório se não existir
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('🎨 Gerando ícones PWA...\n');

    // Gera cada tamanho de ícone
    for (const size of iconSizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(imagePath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Gerado: icon-${size}x${size}.png`);
    }

    console.log('\n✨ Todos os ícones foram gerados com sucesso!');
    console.log(`📁 Localização: ${outputDir}`);
  } catch (error) {
    console.error('❌ Erro ao gerar ícones:', error.message);
    process.exit(1);
  }
}

// Verifica argumentos
const imagePath = process.argv[2];

if (!imagePath) {
  console.log('📝 Uso: node scripts/generate-icons.js [caminho-da-imagem-base]');
  console.log('\n💡 Exemplo:');
  console.log('   node scripts/generate-icons.js public/favicon.ico');
  console.log('   node scripts/generate-icons.js assets/logo.png');
  console.log('\n📦 Requer: npm install sharp --save-dev');
  process.exit(1);
}

generateIcons(imagePath);
