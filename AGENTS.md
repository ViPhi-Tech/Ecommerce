# Ecommerce — contexto para agentes (IA)

Este repositório é um **monorepo** com vários pacotes independentes (cada um com seu próprio `package.json`). Não há workspace npm/yarn na raiz; abra e rode comandos **dentro** de cada pasta.

## Idioma

- **Código e banco de dados:** tabelas, colunas, enums no Prisma, nomes de variáveis, funções, classes, arquivos, pastas e comentários no código — **sempre em inglês**.
- **Frontends (o que o cliente vê):** textos de interface — **português do Brasil (pt-BR)** (labels, botões, títulos, placeholders, mensagens de validação e feedback ao usuário, conteúdo de landing/loja/painel). Comentários em código de UI podem seguir o idioma do restante do arquivo; a regra forte é a **string exibida ao usuário** em pt-BR.

## Pacotes

| Pasta | Stack | Uso |
|--------|--------|-----|
| `backend/` | Node.js, **Fastify**, TypeScript, **Prisma** (PostgreSQL), **Zod**, Redis, Cloudinary | API REST (`/api/...`), Swagger em `/api/docs`, porta padrão **8000** |
| `frontend-admin/` | **Angular** (app `sellup`), standalone components, signals | Painel administrativo |
| `frontend-ecommerce/` | **Next.js** (Turbopack), React | Loja / vitrine |
| `frontend-landing-page/` | **Next.js**, React, Tailwind | Landing |

## Backend — arquitetura e fluxo

Padrão em camadas próximo de **Clean Architecture / hexagonal**:

- `src/domain/` — entidades (`entities/`), contratos de repositório (`repositories/I*Repository.ts`), serviços de domínio quando existirem.
- `src/application/` — casos de uso (`use-cases/<feature>/`), DTOs e schemas Zod (`dto/`).
- `src/infrastructure/` — adapters: HTTP (routes, controllers, middlewares), persistência Prisma (`database/repositories`, `prismaClient.ts`), serviços externos, plugins Fastify.
- `src/shared/` — tipos compartilhados (`ApiResponse`, `HTTP_STATUS`, `HTTP_MESSAGES`), erros, etc.

**Fluxo típico para um recurso novo:**

1. Entidade / contrato em `domain/` se necessário.
2. DTOs + schemas Zod em `application/dto/<area>/`.
3. Caso de uso em `application/use-cases/<area>/` dependendo de interfaces `I*Repository`, não de Prisma diretamente.
4. Implementação em `infrastructure/database/repositories/`.
5. Controller em `infrastructure/http/controllers/` chamando use cases; validação de entrada com Zod (`parse`).
6. Rotas em `infrastructure/http/routes/<Entity>Routes.ts` com `schema` Swagger (incl. JSON schema derivado do Zod quando o projeto já faz assim).
7. Registro de rotas em `infrastructure/http/routes/handleRoutes.ts` (prefixo `/api`).
8. **Injeção manual:** arquivo `infrastructure/config/dependencies/<feature>Dependencies.ts` instancia repositório, use cases e controller; a rota importa o controller exportado.

Respostas HTTP frequentemente seguem o formato `ApiResponse`: `status`, `descricao`, `dados`.

**Banco:** `backend/prisma/`, comandos `npm run dev`, `migrate`, `generate` no `package.json` do backend.

## Frontend admin (o [Angular])

Regras detalhadas de Angular e ícones Lucide estão em:

- `frontend-admin/.cursor/rules/agents.mdc` (e cópia em `agents.md`)

Resumo: componentes standalone (sem `standalone: true` explícito), signals, `OnPush`, `input()`/`output()`/`inject()`, control flow `@if`/`@for`, formulários reativos, sem `ngClass`/`ngStyle` (usar bindings), `NgOptimizedImage` para imagens estáticas.

## Frontends Next.js

- Ecommerce e landing têm estrutura típica de app Next (`app/` ou `pages/` conforme versão); seguir o estilo já usado no pacote ao adicionar rotas e componentes.
- API consumida pelo storefront costuma apontar para o backend Fastify (ajustar conforme env).

## Convensões gerais para o agente

- Manter a separação **código/BD em inglês** vs **UI em pt-BR** (ver seção Idioma).
- Preferir alterações **mínimas** e alinhadas ao padrão existente no arquivo tocado (nomes, imports, tratamento de erro).
- Não commitar segredos; `.env` fica no backend e não deve ser referenciado em docs com valores reais.
- Ao trabalhar só em um pacote, limitar escopo a essa pasta salvo dependência explícita entre projetos.
