# Módulo de Fornecedores

Este módulo foi criado baseado na estrutura do módulo de categorias, seguindo os padrões estabelecidos no projeto.

## Estrutura Criada

### Interfaces

- `src/app/shared/interfaces/supplier/Supplier.ts` - Interface principal do fornecedor
- `src/app/shared/interfaces/supplier/SupplierModuleState.ts` - Interface do estado do módulo

### Serviços e Estados

- `src/app/dashboard/modules/supplier-module/supplier.service.ts` - Serviço para operações de API
- `src/app/dashboard/modules/supplier-module/supplier.state.ts` - Estado gerenciado do módulo

### Roteamentos

- `src/app/dashboard/modules/supplier-module/supplier.routing.ts` - Rotas do módulo
- Integração com `dashboard.module.ts` - Rota principal `/dashboard/suppliers`
- Integração com `dialogs.module.ts` - Rotas para drawer `/suppliers/new` e `/suppliers/:id`

### Componentes

#### Listagem

- `src/app/dashboard/modules/supplier-module/screens/list/supplier-list.component.ts`
- `src/app/dashboard/modules/supplier-module/screens/list/supplier-list.component.html`
- `src/app/dashboard/modules/supplier-module/screens/list/supplier-list.component.scss`

#### Criação/Edição

- `src/app/dashboard/modules/supplier-module/screens/create/supplier-create.component.ts`
- `src/app/dashboard/modules/supplier-module/screens/create/supplier-create.component.html`
- `src/app/dashboard/modules/supplier-module/screens/create/supplier-create.component.scss`

### Menu

- Adicionado item "Fornecedores" no menu lateral, seção "Cadastros"
- Ícone: `lucideTruck`
- Rota: `/dashboard/suppliers/list`

## Funcionalidades

### Interface ISupplier

```typescript
{
  id: string;
  name: string; // Nome da empresa
  tradeName?: string; // Nome fantasia
  cnpj?: string;
  cpf?: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contactPerson?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Operações Disponíveis

- **Listagem**: Exibe todos os fornecedores em uma tabela com paginação
- **Criação**: Formulário completo para cadastro de novos fornecedores
- **Edição**: Carrega dados do fornecedor existente para edição
- **Exclusão**: Remove fornecedor com confirmação

### Campos do Formulário

- **Dados Básicos**: Nome da empresa, nome fantasia, CNPJ, CPF
- **Contato**: Email, telefone, pessoa de contato
- **Endereço Completo**: Rua, número, complemento, bairro, cidade, estado, CEP
- **Observações**: Campo de texto livre para descrições adicionais

## Endpoints de API Esperados

O serviço espera os seguintes endpoints na API:

- `GET /supplier/all` - Listar todos os fornecedores
- `GET /supplier/:id` - Obter fornecedor por ID
- `POST /supplier/create` - Criar novo fornecedor
- `PUT /supplier/update` - Atualizar fornecedor existente
- `DELETE /supplier/:id` - Excluir fornecedor

## Uso

### Navegação

- Acesse através do menu lateral: **Cadastros > Fornecedores**
- Ou navegue diretamente para: `/dashboard/suppliers/list`

### Adicionar Fornecedor

- Clique no botão "Adicionar" na listagem
- Preencha o formulário no drawer lateral
- Clique em "Salvar"

### Editar Fornecedor

- Na listagem, clique no ícone de edição na linha do fornecedor
- Edite os dados no formulário
- Clique em "Salvar"

### Excluir Fornecedor

- Na listagem, clique no ícone de lixeira na linha do fornecedor
- Confirme a exclusão no modal
