# Configurações de Otimização de Memória

Este arquivo contém as otimizações implementadas para resolver o problema de "Out of memory" no projeto Angular.

## Otimizações Implementadas:

### 1. Scripts npm com limite de memória:
- Aumentado o limite de memória para 4GB usando `--max-old-space-size=4096`
- Scripts otimizados: `dev`, `build`, `build:dev`, `watch`

### 2. Angular.json:
- Adicionadas configurações de desenvolvimento otimizadas
- Configurado servidor de desenvolvimento com polling reduzido
- HMR desabilitado para reduzir uso de memória

### 3. TypeScript:
- Habilitado build incremental
- Adicionado arquivo .tsbuildinfo para cache
- Configurações de compilação otimizadas

### 4. Scripts de limpeza:
- `npm run clean`: Remove cache e arquivos temporários
- `npm run clean:install`: Limpeza completa + reinstalação
- `npm run serve:optimized`: Limpeza + execução otimizada

### 5. Variáveis de ambiente:
- NODE_OPTIONS configurado para 4GB
- Analytics do Angular CLI desabilitado
- Source maps desabilitados em produção

## Como usar:

1. Execute `npm run clean` para limpar cache
2. Execute `npm run dev` para desenvolver com otimizações
3. Use `npm run serve:optimized` para máxima otimização

## Monitoramento:

Para monitorar o uso de memória:
```bash
# Windows
Get-Process node | Select-Object Name, WorkingSet
```

## Troubleshooting:

Se ainda enfrentar problemas de memória:
1. Execute `npm run clean:install`
2. Reinicie o VS Code
3. Considere aumentar ainda mais o limite de memória se necessário
