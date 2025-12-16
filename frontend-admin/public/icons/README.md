# Ícones PWA

Esta pasta contém os ícones necessários para o Progressive Web App (PWA).

## Tamanhos necessários

- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## Como gerar os ícones

### Opção 1: Usando o script automatizado

1. Instale o sharp:
```bash
npm install sharp --save-dev
```

2. Execute o script:
```bash
node scripts/generate-icons.js [caminho-da-imagem-base]
```

Exemplo:
```bash
node scripts/generate-icons.js public/favicon.ico
```

### Opção 2: Usando ferramentas online

Você pode usar ferramentas online como:
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [PWA Builder](https://www.pwabuilder.com/imageGenerator)

### Opção 3: Manualmente

Crie imagens PNG nos tamanhos listados acima e salve-as nesta pasta com o nome `icon-[tamanho]x[tamanho].png`.

## Nota

Se você não tiver os ícones, o PWA ainda funcionará, mas os usuários não verão um ícone personalizado ao instalar o aplicativo.
