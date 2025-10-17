# Message Loader Component

Componente de loader customizável que exibe uma mensagem e um ícone em uma caixa centralizada na tela.

## Características

- ✅ Mensagem personalizável
- ✅ Ícone personalizável (usa ng-icons)
- ✅ Descrição opcional
- ✅ Animações suaves de entrada
- ✅ Backdrop com blur
- ✅ Suporte a dark mode
- ✅ Z-index alto para sobreposição

## Como usar

### 1. Importar o componente

```typescript
import { MessageLoaderComponent } from 'app/shared/components/loader/message-loader.component';

@Component({
  // ...
  imports: [
    // outros imports
    MessageLoaderComponent,
  ],
})
```

### 2. Usar no template

```html
<fuse-message-loader
  [visible]="isLoading"
  [message]="'Processando...'"
  [description]="'Aguarde enquanto processamos sua solicitação'"
  [icon]="'lucideLoader2'"
/>
```

## Propriedades (Inputs)

| Propriedade | Tipo | Padrão | Descrição |
|------------|------|--------|-----------|
| `visible` | `boolean` | `false` | Controla a visibilidade do loader |
| `message` | `string` | `'Carregando...'` | Mensagem principal exibida |
| `description` | `string` | `''` | Descrição opcional (texto secundário) |
| `icon` | `string` | `'lucideLoader2'` | Nome do ícone do ng-icons |

## Exemplos de uso

### Exemplo 1: Loader simples

```html
<fuse-message-loader
  [visible]="isLoading"
  [message]="'Carregando dados...'"
/>
```

### Exemplo 2: Loader com descrição

```html
<fuse-message-loader
  [visible]="isSaving"
  [message]="'Salvando alterações'"
  [description]="'Isso pode levar alguns segundos...'"
  [icon]="'lucideSave'"
/>
```

### Exemplo 3: Loader de pedido

```html
<fuse-message-loader
  [visible]="isCheckingOut"
  [message]="'Finalizando pedido'"
  [description]="'Aguarde enquanto processamos seu pedido...'"
  [icon]="'lucideShoppingCart'"
/>
```

### Exemplo 4: Loader com signal do Angular

```typescript
// No componente TypeScript
import { signal } from '@angular/core';

export class MyComponent {
  isLoading = signal(false);
  
  async saveData() {
    this.isLoading.set(true);
    try {
      await this.service.save();
    } finally {
      this.isLoading.set(false);
    }
  }
}
```

```html
<!-- No template -->
<fuse-message-loader
  [visible]="isLoading()"
  [message]="'Salvando...'"
/>
```

## Ícones disponíveis

Você pode usar qualquer ícone do [Lucide Icons](https://lucide.dev/icons/). Exemplos:

- `lucideLoader2` - Ícone de carregamento padrão
- `lucideShoppingCart` - Carrinho de compras
- `lucideSave` - Salvar
- `lucideUpload` - Upload
- `lucideDownload` - Download
- `lucideRefreshCw` - Atualizar
- `lucideCheck` - Confirmação
- `lucidePackage` - Pacote/entrega

## Notas técnicas

- O loader usa `z-index: 9999` para garantir que fique sobre outros elementos
- O backdrop tem `bg-black/50` com `backdrop-blur-sm` para um efeito visual moderno
- As animações são otimizadas para performance
- Totalmente compatível com dark mode usando classes do Tailwind
- O componente é standalone e não requer módulo adicional

