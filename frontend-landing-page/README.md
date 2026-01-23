# Frontend Landing Page - E-commerce

Uma moderna landing page para e-commerce desenvolvida com Next.js 16.1.4 e TypeScript.

## 🚀 Tecnologias

- **Next.js 16.1.4** - Framework React para produção
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de CSS utilitário
- **Lucide React** - Ícones modernos
- **React 19** - Biblioteca JavaScript para interfaces

## 📋 Funcionalidades

- ✅ **Home Page** - Landing page com hero section e produtos em destaque
- ✅ **Listagem de Produtos** - Página com filtros, busca e ordenação
- ✅ **Produto Individual** - Página detalhada com galeria de imagens
- ✅ **Design Responsivo** - Adaptado para desktop, tablet e mobile
- ✅ **Componentes Reutilizáveis** - Header, Footer, ProductCard
- ✅ **Dados Mock** - Produtos de exemplo para demonstração

## 🎨 Páginas

### Home (`/`)
- Hero section com call-to-action
- Seção de benefícios (frete grátis, garantia, etc.)
- Produtos em destaque
- Newsletter

### Produtos (`/produtos`)
- Listagem completa de produtos
- Filtros por categoria
- Busca por nome/descrição
- Ordenação por preço, nome, avaliação
- Visualização em grid ou lista

### Produto Individual (`/produto/[id]`)
- Galeria de imagens
- Informações detalhadas
- Especificações técnicas
- Sistema de avaliações
- Produtos relacionados

## 🛠️ Como executar

1. **Instalar dependências:**
```bash
npm install
```

2. **Executar em desenvolvimento:**
```bash
npm run dev
```

3. **Build para produção:**
```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
frontend-landing-page/
├── src/
│   ├── app/
│   │   ├── produto/[id]/
│   │   │   └── page.tsx
│   │   ├── produtos/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ProductCard.tsx
│   ├── data/
│   │   └── products.ts
│   └── types/
│       └── product.ts
├── public/
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
└── package.json
```

## 🎯 Próximos Passos

Para conectar com uma API real:

1. Substituir os dados mock em `src/data/products.ts`
2. Criar hooks ou services para chamadas à API
3. Implementar estado global (Context API ou Zustand)
4. Adicionar sistema de carrinho de compras
5. Implementar autenticação de usuários

## 📱 Design System

### Cores Principais
- **Primary**: Blue (Tailwind blue-600)
- **Secondary**: Yellow (Tailwind yellow-400)
- **Background**: Gray-50
- **Text**: Gray-900

### Componentes
- **Header**: Navegação fixa com logo e carrinho
- **Footer**: Links úteis e informações de contato
- **ProductCard**: Card reutilizável para produtos
- **Layout responsivo**: Mobile-first design

## 🔧 Configurações

- **Tailwind CSS**: Configurado com cores personalizadas
- **TypeScript**: Strict mode habilitado
- **Next.js**: App Router com páginas dinâmicas
- **ESLint**: Configuração padrão do Next.js

---

Desenvolvido com ❤️ usando Next.js e TypeScript