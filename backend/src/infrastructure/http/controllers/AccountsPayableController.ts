import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/CreateAccountsPayableUseCase';
import { FindAllAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/FindAllAccountsPayableUseCase';
import { FindByIdAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/FindByIdAccountsPayableUseCase';
import { FindBySupplierAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/FindBySupplierAccountsPayableUseCase';
import { FindByStatusAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/FindByStatusAccountsPayableUseCase';
import { FindOverdueAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/FindOverdueAccountsPayableUseCase';
import { UpdateAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/UpdateAccountsPayableUseCase';
import { DeleteAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/DeleteAccountsPayableUseCase';
import {
  CreateAccountsPayableInput,
  UpdateAccountsPayableInput,
  UpdateAccountsPayableStatusInput,
  accountsPayableListQuerySchema,
} from '../../../application/dto/accountsPayable/AccountsPayableDTOs';
import {
  endOfDayBRT,
  startOfDayBRT,
} from '../../../shared/utils/dateUtils';
import { AccountsPayableListFilter } from '../../../domain/repositories/IAccountsPayableRepository';

export class AccountsPayableController {
  constructor(
    private createAccountsPayableUseCase: CreateAccountsPayableUseCase,
    private findAllAccountsPayableUseCase: FindAllAccountsPayableUseCase,
    private findByIdAccountsPayableUseCase: FindByIdAccountsPayableUseCase,
    private findBySupplierAccountsPayableUseCase: FindBySupplierAccountsPayableUseCase,
    private findByStatusAccountsPayableUseCase: FindByStatusAccountsPayableUseCase,
    private findOverdueAccountsPayableUseCase: FindOverdueAccountsPayableUseCase,
    private updateAccountsPayableUseCase: UpdateAccountsPayableUseCase,
    private deleteAccountsPayableUseCase: DeleteAccountsPayableUseCase
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.body as CreateAccountsPayableInput;
      
      const accountsPayable = await this.createAccountsPayableUseCase.execute(data);
      
      return reply.status(201).send({
        success: true,
        message: 'Conta a pagar criada com sucesso',
        data: accountsPayable,
      });
    } catch (error) {
      return reply.status(400).send({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao criar conta a pagar',
      });
    }
  }

  async findAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parsed = accountsPayableListQuerySchema.safeParse(request.query);
      if (!parsed.success) {
        const msg = parsed.error.issues.map(i => i.message).join('; ');
        return reply.status(400).send({
          success: false,
          message: msg || 'Invalid query parameters',
        });
      }

      const { dueDateFrom, dueDateTo, status } = parsed.data;

      const listFilter: AccountsPayableListFilter = {};
      if (dueDateFrom && dueDateTo) {
        listFilter.dueDateRange = {
          dueDateFrom: startOfDayBRT(dueDateFrom),
          dueDateTo: endOfDayBRT(dueDateTo),
        };
      }
      if (status !== undefined && status !== 'all') {
        listFilter.status = status;
      }

      const hasFilter =
        listFilter.dueDateRange !== undefined || listFilter.status !== undefined;

      const accountsPayable =
        await this.findAllAccountsPayableUseCase.execute(
          hasFilter ? listFilter : undefined
        );

      return reply.status(200).send({
        success: true,
        data: accountsPayable,
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar contas a pagar',
      });
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const accountsPayable = await this.findByIdAccountsPayableUseCase.execute(parseInt(id));
      
      if (!accountsPayable) {
        return reply.status(404).send({
          success: false,
          message: 'Conta a pagar não encontrada',
        });
      }

      return reply.status(200).send({
        success: true,
        data: accountsPayable,
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar conta a pagar',
      });
    }
  }

  async findBySupplier(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { supplierId } = request.params as { supplierId: string };
      const accountsPayable = await this.findBySupplierAccountsPayableUseCase.execute(parseInt(supplierId));
      
      return reply.status(200).send({
        success: true,
        data: accountsPayable,
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar contas a pagar por fornecedor',
      });
    }
  }

  async findByStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { status } = request.params as { status: string };
      const accountsPayable = await this.findByStatusAccountsPayableUseCase.execute(status);
      
      return reply.status(200).send({
        success: true,
        data: accountsPayable,
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar contas a pagar por status',
      });
    }
  }

  async findOverdue(request: FastifyRequest, reply: FastifyReply) {
    try {
      const accountsPayable = await this.findOverdueAccountsPayableUseCase.execute();
      
      return reply.status(200).send({
        success: true,
        data: accountsPayable,
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar contas a pagar em atraso',
      });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const data = request.body as UpdateAccountsPayableInput;
      
      const accountsPayable = await this.updateAccountsPayableUseCase.execute(parseInt(id), data);
      
      return reply.status(200).send({
        success: true,
        message: 'Conta a pagar atualizada com sucesso',
        data: accountsPayable,
      });
    } catch (error) {
      return reply.status(400).send({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao atualizar conta a pagar',
      });
    }
  }

  async updateStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const { status } = request.body as UpdateAccountsPayableStatusInput;
      
      const accountsPayable = await this.updateAccountsPayableUseCase.execute(parseInt(id), { status });
      
      return reply.status(200).send({
        success: true,
        message: 'Status da conta a pagar atualizado com sucesso',
        data: accountsPayable,
      });
    } catch (error) {
      return reply.status(400).send({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao atualizar status da conta a pagar',
      });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      await this.deleteAccountsPayableUseCase.execute(parseInt(id));
      
      return reply.status(200).send({
        success: true,
        message: 'Conta a pagar deletada com sucesso',
      });
    } catch (error) {
      return reply.status(400).send({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao deletar conta a pagar',
      });
    }
  }
}