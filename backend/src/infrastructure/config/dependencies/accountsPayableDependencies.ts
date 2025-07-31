import { PrismaClient } from '@prisma/client';
import { AccountsPayableRepository } from '../../database/repositories/AccountsPayableRepository';
import { CreateAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/CreateAccountsPayableUseCase';
import { FindAllAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/FindAllAccountsPayableUseCase';
import { FindByIdAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/FindByIdAccountsPayableUseCase';
import { FindBySupplierAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/FindBySupplierAccountsPayableUseCase';
import { FindByStatusAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/FindByStatusAccountsPayableUseCase';
import { FindOverdueAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/FindOverdueAccountsPayableUseCase';
import { UpdateAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/UpdateAccountsPayableUseCase';
import { DeleteAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/DeleteAccountsPayableUseCase';
import { AccountsPayableController } from '../../http/controllers/AccountsPayableController';

const prisma = new PrismaClient();

// Repository
const accountsPayableRepository = new AccountsPayableRepository(prisma);

// Use Cases
const createAccountsPayableUseCase = new CreateAccountsPayableUseCase(accountsPayableRepository);
const findAllAccountsPayableUseCase = new FindAllAccountsPayableUseCase(accountsPayableRepository);
const findByIdAccountsPayableUseCase = new FindByIdAccountsPayableUseCase(accountsPayableRepository);
const findBySupplierAccountsPayableUseCase = new FindBySupplierAccountsPayableUseCase(accountsPayableRepository);
const findByStatusAccountsPayableUseCase = new FindByStatusAccountsPayableUseCase(accountsPayableRepository);
const findOverdueAccountsPayableUseCase = new FindOverdueAccountsPayableUseCase(accountsPayableRepository);
const updateAccountsPayableUseCase = new UpdateAccountsPayableUseCase(accountsPayableRepository);
const deleteAccountsPayableUseCase = new DeleteAccountsPayableUseCase(accountsPayableRepository);

// Controller
export const accountsPayableController = new AccountsPayableController(
  createAccountsPayableUseCase,
  findAllAccountsPayableUseCase,
  findByIdAccountsPayableUseCase,
  findBySupplierAccountsPayableUseCase,
  findByStatusAccountsPayableUseCase,
  findOverdueAccountsPayableUseCase,
  updateAccountsPayableUseCase,
  deleteAccountsPayableUseCase
);