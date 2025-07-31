import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/CreateAccountsPayableUseCase';
import { FindAllAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/FindAllAccountsPayableUseCase';
import { FindByIdAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/FindByIdAccountsPayableUseCase';
import { FindBySupplierAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/FindBySupplierAccountsPayableUseCase';
import { FindByStatusAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/FindByStatusAccountsPayableUseCase';
import { FindOverdueAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/FindOverdueAccountsPayableUseCase';
import { UpdateAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/UpdateAccountsPayableUseCase';
import { DeleteAccountsPayableUseCase } from '../../../application/use-cases/accounts-payable/DeleteAccountsPayableUseCase';
import { AccountsPayableCreateDTO, AccountsPayableUpdateDTO } from '../../../application/dto/accounts-payable/AccountsPayable.dto';

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
      const data = request.body as AccountsPayableCreateDTO;
      
      // Converter strings de data para Date objects
      const accountsPayableData = {
        ...data,
        originalDueDate: new Date(data.originalDueDate),
        issueDate: new Date(data.issueDate),
        dueDate: new Date(data.dueDate),
        competenceDate: new Date(data.competenceDate),
      };

      const accountsPayable = await this.createAccountsPayableUseCase.execute(accountsPayableData);
      
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
      const accountsPayable = await this.findAllAccountsPayableUseCase.execute();
      
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
      const data = request.body as AccountsPayableUpdateDTO;
      
      // Converter strings de data para Date objects se fornecidas
      const updateData = { ...data };
      if (data.originalDueDate) updateData.originalDueDate = new Date(data.originalDueDate);
      if (data.issueDate) updateData.issueDate = new Date(data.issueDate);
      if (data.dueDate) updateData.dueDate = new Date(data.dueDate);
      if (data.competenceDate) updateData.competenceDate = new Date(data.competenceDate);

      const accountsPayable = await this.updateAccountsPayableUseCase.execute(parseInt(id), updateData);
      
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