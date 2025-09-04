import { PrismaClient } from '@prisma/client';
import { AccountsReceivableRepository } from '../../database/repositories/AccountsReceivableRepository';
import { CreateAccountsReceivableUseCase } from '../../../application/use-cases/accounts-receivable/CreateAccountsReceivableUseCase';
import { FindAllAccountsReceivableUseCase } from '../../../application/use-cases/accounts-receivable/FindAllAccountsReceivableUseCase';
import { FindByIdAccountsReceivableUseCase } from '../../../application/use-cases/accounts-receivable/FindByIdAccountsReceivableUseCase';
import { FindByClientAccountsReceivableUseCase } from '../../../application/use-cases/accounts-receivable/FindByClientAccountsReceivableUseCase';
import { FindByStatusAccountsReceivableUseCase } from '../../../application/use-cases/accounts-receivable/FindByStatusAccountsReceivableUseCase';
import { FindOverdueAccountsReceivableUseCase } from '../../../application/use-cases/accounts-receivable/FindOverdueAccountsReceivableUseCase';
import { UpdateAccountsReceivableUseCase } from '../../../application/use-cases/accounts-receivable/UpdateAccountsReceivableUseCase';
import { DeleteAccountsReceivableUseCase } from '../../../application/use-cases/accounts-receivable/DeleteAccountsReceivableUseCase';
import { AccountsReceivableController } from '../../http/controllers/AccountsReceivableController';

const prisma = new PrismaClient();

// Repository
const accountsReceivableRepository = new AccountsReceivableRepository(prisma);

// Use Cases
const createAccountsReceivableUseCase = new CreateAccountsReceivableUseCase(accountsReceivableRepository);
const findAllAccountsReceivableUseCase = new FindAllAccountsReceivableUseCase(accountsReceivableRepository);
const findByIdAccountsReceivableUseCase = new FindByIdAccountsReceivableUseCase(accountsReceivableRepository);
const findByClientAccountsReceivableUseCase = new FindByClientAccountsReceivableUseCase(accountsReceivableRepository);
const findByStatusAccountsReceivableUseCase = new FindByStatusAccountsReceivableUseCase(accountsReceivableRepository);
const findOverdueAccountsReceivableUseCase = new FindOverdueAccountsReceivableUseCase(accountsReceivableRepository);
const updateAccountsReceivableUseCase = new UpdateAccountsReceivableUseCase(accountsReceivableRepository);
const deleteAccountsReceivableUseCase = new DeleteAccountsReceivableUseCase(accountsReceivableRepository);
// Controller
export const accountsReceivableController = new AccountsReceivableController(
  createAccountsReceivableUseCase,
  findAllAccountsReceivableUseCase,
  findByIdAccountsReceivableUseCase,
  findByClientAccountsReceivableUseCase,
  findByStatusAccountsReceivableUseCase,
  findOverdueAccountsReceivableUseCase,
  updateAccountsReceivableUseCase,
  deleteAccountsReceivableUseCase
);
