# Simple Indicator Component

Um componente reutilizável para exibir indicadores simples com título, valor e ícone.

## Uso

```html
<fuse-simple-indicator
  title="Entradas no Mês"
  value="127"
  variant="success"
></fuse-simple-indicator>
```

## Propriedades

| Propriedade     | Tipo                                          | Padrão      | Descrição                         |
| --------------- | --------------------------------------------- | ----------- | --------------------------------- |
| `title`         | `string`                                      | `''`        | Título do indicador               |
| `value`         | `string \| number`                            | `''`        | Valor principal a ser exibido     |
| `variant`       | `'success' \| 'warning' \| 'error' \| 'info'` | `'info'`    | Variante de cor do indicador      |
| `icon`          | `string`                                      | `undefined` | Nome do ícone (não implementado)  |
| `customIconSvg` | `string`                                      | `undefined` | HTML/SVG customizado para o ícone |

## Variantes

- **success**: Verde - ideal para indicadores positivos
- **warning**: Amarelo - para alertas
- **error**: Vermelho - para erros ou valores negativos
- **info**: Azul - para informações gerais

## Ícones Padrão

Cada variante possui um ícone padrão:

- **success**: Seta para cima (arrow-up)
- **warning**: Triângulo de alerta (alert-triangle)
- **error**: Círculo com X (x-circle)
- **info**: Círculo com i (info)

## Exemplo com SVG Customizado

```html
<fuse-simple-indicator
  title="Vendas"
  value="1.250"
  variant="success"
  [customIconSvg]="meuIconeCustomizado"
></fuse-simple-indicator>
```

## Responsividade

O componente é totalmente responsivo e adapta-se a diferentes tamanhos de tela.
