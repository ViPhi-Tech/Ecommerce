# ModalComponent — `fuse-modal`

Componente de modal reutilizável com animações de entrada e saída, suporte a rota auxiliar (`drawer` outlet) e projeção de conteúdo via slots nomeados.

---

## Uso básico

```html
@if (isOpen) {
  <fuse-modal
    title="Título do modal"
    subtitle="Subtítulo opcional"
    icon="lucideUser"
    (closeRequested)="isOpen = false"
  >
    <div modal-body>Conteúdo aqui</div>

    <div modal-footer>
      <button (click)="isOpen = false">Cancelar</button>
    </div>
  </fuse-modal>
}
```

> O modal é controlado externamente via `*ngIf` / `@if`. Para abrir basta renderizar o componente; para fechar, destruí-lo em resposta ao evento `closeRequested`.

---

## Inputs

| Input                  | Tipo      | Padrão        | Descrição                                                                 |
|------------------------|-----------|---------------|---------------------------------------------------------------------------|
| `title`                | `string`  | `''`          | Título exibido no cabeçalho padrão. Se vazio, usa o slot `[modal-header]` |
| `subtitle`             | `string`  | `''`          | Subtítulo abaixo do título                                                |
| `icon`                 | `string`  | `''`          | Nome do ícone (ng-icons) exibido ao lado do título                        |
| `titleId`              | `string`  | `'modal-title'` | ID do elemento `<h2>`, usado para `aria-labelledby`                     |
| `closeOnBackdropClick` | `boolean` | `false`       | Se `true`, clicar no backdrop dispara o fechamento                        |
| `maxWidth`             | `string`  | `'672px'`     | Largura máxima do painel de conteúdo                                      |
| `modalInUrl`           | `boolean` | `false`       | Se `true`, o fechamento limpa o outlet `drawer` na URL                    |

---

## Outputs

| Output           | Tipo   | Descrição                                                       |
|------------------|--------|-----------------------------------------------------------------|
| `closeRequested` | `void` | Emitido após a animação de saída (200ms), para destruir o modal |

---

## Slots de conteúdo (Content Projection)

| Seletor          | Descrição                                                                         |
|------------------|-----------------------------------------------------------------------------------|
| `[modal-header]` | Substitui o cabeçalho padrão quando `title` não é informado                       |
| `[modal-body]`   | Área de conteúdo principal (scrollável quando excede a altura disponível)          |
| `[modal-footer]` | Área fixa no rodapé, ideal para botões de ação                                    |

---

## Animações

| Trigger          | Entrada                                      | Saída (`open → closing`)              |
|------------------|----------------------------------------------|---------------------------------------|
| `backdropEnter`  | fade-in `opacity 0 → 1` em 200ms ease-out    | fade-out `opacity 1 → 0` em 200ms ease-in |
| `contentEnter`   | scale + fade `0.96/−8px → 1/0` em 250ms ease-out | scale + fade reverso em 200ms ease-in |

O fechamento segue este fluxo:
1. `closeModal()` seta o estado `closing = true` → inicia a animação de saída
2. Após **200ms**, navega (se `modalInUrl`) e emite `closeRequested`
3. O componente pai destrói o `<fuse-modal>`, removendo-o do DOM

---

## Comportamento do backdrop

O elemento backdrop é movido para `document.body` via `AppendChild` no `ngAfterViewInit`, garantindo que o overlay cubra toda a viewport independente do contexto de posicionamento do componente pai. Ele é removido corretamente no `ngOnDestroy`.

---

## Integração com rota auxiliar (drawer outlet)

Quando `modalInUrl="true"`, o fechamento limpa o outlet `drawer` da URL:

```ts
this.router.navigate([{ outlets: { drawer: null } }], {
  relativeTo: this.activatedRoute.root,
});
```

Configure o outlet no módulo de rotas e use `routerLink` com `{ outlets: { drawer: ['seu-path'] } }` para abrir o modal via URL.

---

## Exemplo completo

```html
@if (showModal) {
  <fuse-modal
    title="Editar produto"
    subtitle="Preencha os campos abaixo"
    icon="lucidePackage"
    maxWidth="800px"
    [closeOnBackdropClick]="true"
    (closeRequested)="showModal = false"
  >
    <div modal-body class="p-6">
      <app-product-form />
    </div>

    <div modal-footer class="flex justify-end gap-2 p-4 border-t">
      <button (click)="showModal = false">Cancelar</button>
      <button (click)="save()">Salvar</button>
    </div>
  </fuse-modal>
}
```
